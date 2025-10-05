# backend/app/main.py
from fastapi import FastAPI, HTTPException, Query, Request
from fastapi.responses import StreamingResponse, JSONResponse
from pathlib import Path
import requests
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from rio_tiler.io import COGReader
import tempfile
import io
from PIL import Image
import numpy as np
import mercantile  # pip install mercantile
import urllib.parse
from pydantic import BaseModel
from fastapi import Body, Request
import logging
from fastapi.middleware.cors import CORSMiddleware
import asyncio
from typing import Optional


app = FastAPI(title="COG Tile Server")
TEMP_DIR = Path(tempfile.gettempdir()) / "cog_tiles"
TEMP_DIR.mkdir(exist_ok=True)

# Simple mapping: in production remplace par config / DB
COG_MAP = {
    "earth": "/path/to/local/earth_cog.tif",  # ou URL http(s)
    "mars": "/path/to/local/mars_cog_3857.tif"  # si tu as des tuiles pour Mars
}

app.add_middleware(
  CORSMiddleware,
  allow_origins=["http://localhost:8000","http://localhost:5500","http://127.0.0.1:5500","file://"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

def download_cog(url: str) -> Path:
    local_path = TEMP_DIR / Path(url).name
    if not local_path.exists():
        resp = requests.get(url, stream=True)
        if resp.status_code != 200:
            raise HTTPException(status_code=404, detail=f"Impossible de télécharger le COG : {url}")
        with open(local_path, "wb") as f:
            for chunk in resp.iter_content(chunk_size=8192):
                f.write(chunk)
    return local_path

def reproject_cog(input_path: Path, dst_crs="EPSG:3857") -> Path:
    output_path = input_path.parent / f"{input_path.stem}_3857.tif"
    # si déjà existe renvoyer
    if output_path.exists():
        return output_path
    with rasterio.open(input_path) as src:
        if src.crs and src.crs.to_string() == dst_crs:
            return input_path
        transform, width, height = calculate_default_transform(
            src.crs, dst_crs, src.width, src.height, *src.bounds
        )
        kwargs = src.meta.copy()
        kwargs.update({"crs": dst_crs, "transform": transform, "width": width, "height": height})
        with rasterio.open(output_path, "w", **kwargs) as dst:
            for i in range(1, src.count + 1):
                reproject(
                    source=rasterio.band(src, i),
                    destination=rasterio.band(dst, i),
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=transform,
                    dst_crs=dst_crs,
                    resampling=Resampling.bilinear
                )
    return output_path



logger = logging.getLogger("uvicorn.error")

class BBox(BaseModel):
    minLon: float
    minLat: float
    maxLon: float
    maxLat: float

class PrepareRequest(BaseModel):
    bbox: BBox
    planet: Optional[str] = "earth"
    z: Optional[int] = None
    url: Optional[str] = None     # chemin local ou URL vers un COG (dev only)
    use_gibs: bool = False       # permet d'activer le mode GIBS via JSON
    layer: Optional[str] = None  # allow client to provide a COG path/URL for testing

@app.post("/prepare-deepzoom")
async def prepare_deepzoom(request: Request, body: PrepareRequest | None = Body(default=None)):
    """
    Accepts either:
      - JSON body: { "bbox": {...}, "planet": "earth", "z": 10, "url": "http(s) or local path" }
      - OR query params fallback: ?minLon=...&minLat=...&maxLon=...&maxLat=...&planet=earth
    Returns a JSON with tileTemplate (absolute url), minzoom/maxzoom, width/height, url (path used).
    Heavy I/O (download/reproject/COGReader) runs inside asyncio.to_thread to avoid blocking the event loop.
    """
    logger = logging.getLogger("uvicorn.error")
    logger.info("prepare_deepzoom called; query: %s", dict(request.query_params))

    # --- build payload (prefer JSON body) ---
    try:
        if body is not None:
            payload = body.dict()
            logger.info("prepare_deepzoom: got JSON body")
        else:
            q = request.query_params
            if all(k in q for k in ("minLon","minLat","maxLon","maxLat")):
                payload = {
                    "bbox": {
                        "minLon": float(q["minLon"]),
                        "minLat": float(q["minLat"]),
                        "maxLon": float(q["maxLon"]),
                        "maxLat": float(q["maxLat"]),
                    },
                    "planet": q.get("planet", "earth"),
                    "z": int(q["z"]) if "z" in q else None,
                    "url": q.get("url", None)
                }
                logger.info("prepare_deepzoom: built payload from query params")
            else:
                return JSONResponse({"error":"No JSON body and missing bbox query params. Send JSON POST or provide minLon,minLat,maxLon,maxLat in query."}, status_code=400)
    except Exception as e:
        logger.exception("invalid payload")
        return JSONResponse({"error": f"Invalid payload: {e}"}, status_code=400)
    
    GIBS_DEFAULT_LAYER = "MODIS_Terra_CorrectedReflectance_TrueColor"
    GIBS_LAYERS = {
        "truecolor": "MODIS_Terra_CorrectedReflectance_TrueColor",
        "modis_truecolor": "MODIS_Terra_CorrectedReflectance_TrueColor",
        "viirs": "VIIRS_SNPP_CorrectedReflectance_TrueColor",
        # add more short names if needed
    }

    # check flags that indicate "use GIBS"
    use_gibs = False
    # priority: explicit field `use_gibs` in payload, then planet == "gibs", then url == "gibs"
    if payload.get("use_gibs", False):
        use_gibs = True
    if str(payload.get("planet", "")).lower() == "gibs":
        use_gibs = True
    if str(payload.get("url", "")).lower() == "gibs":
        use_gibs = True

    if use_gibs:
        # optional: select layer from payload.layer or fallback to default
        chosen = payload.get("layer", None)
        layer = GIBS_LAYERS.get(str(chosen).lower(), GIBS_DEFAULT_LAYER)
        # GIBS tile template (WebMercator XYZ with {z}/{y}/{x})
        gibs_template = f"https://gibs.earthdata.nasa.gov/tiles/epsg3857/best/{layer}/{{z}}/{{y}}/{{x}}.jpg"
        # build absolute template using request.base_url (so front can fetch without host mismatch)
        base = str(request.base_url).rstrip("/")
        # instead of proxying tiles via /tiles, we return the direct GIBS template
        resp = {
            "tileTemplate": gibs_template,
            "minzoom": 0,
            "maxzoom": 9,   # conservative default for GIBS imagery; front can request more if needed
            "width": 43200, # approximate world width at high res (informational)
            "height": 21600,
            "url": "gibs",
            "note": "GIBS direct tiles (no server-side COG processing). Layer: " + layer
        }
        logger.info("prepare-deepzoom: returning GIBS template for layer %s", layer)
        return JSONResponse(resp)

    # --- validate bbox ---
    try:
        bbox = payload["bbox"]
        for k in ("minLon","minLat","maxLon","maxLat"):
            if k not in bbox:
                raise ValueError(f"bbox.{k} missing")
        minLon = float(bbox["minLon"]); minLat = float(bbox["minLat"])
        maxLon = float(bbox["maxLon"]); maxLat = float(bbox["maxLat"])
        if not (-180 <= minLon <= 180 and -90 <= minLat <= 90 and -180 <= maxLon <= 180 and -90 <= maxLat <= 90):
            raise ValueError("bbox coordinates out of range")
        # optional: ensure min < max
        if not (minLon < maxLon and minLat < maxLat):
            raise ValueError("bbox min must be < max")
    except Exception as e:
        logger.exception("invalid bbox")
        return JSONResponse({"error": f"Invalid bbox: {e}"}, status_code=400)

    planet = payload.get("planet", "earth")
    preferred_z = payload.get("z", None)
    provided_url = payload.get("url", None)

    # --- choose COG path (provided url wins) ---
    cog_source = provided_url if provided_url else COG_MAP.get(planet)
    if not cog_source:
        return JSONResponse({"error": "No COG source available for planet and no url provided."}, status_code=400)

    # --- helper: blocking process to run in thread ---
    def _process_cog_and_get_info(cog_source_local):
        # cog_source_local: either an http URL or a local path (string)
        try:
            path = Path(cog_source_local)
            if str(cog_source_local).startswith("http"):
                # download (may take time) -> download_cog handles re-use
                path = download_cog(cog_source_local)
            if not path.exists():
                raise FileNotFoundError(f"COG not found: {path}")
            # reproj if needed (this may write a new file)
            path = reproject_cog(path)
            # read metadata with COGReader
            with COGReader(str(path)) as cog:
                minz = cog.minzoom
                maxz = cog.maxzoom
                used_z = preferred_z if preferred_z is not None else min(maxz, 12)
                used_z = max(minz, min(used_z, maxz))

                # center tile for info
                center_lon = (minLon + maxLon) / 2.0
                center_lat = (minLat + maxLat) / 2.0
                t = mercantile.tile(center_lon, center_lat, used_z)

                return {
                    "path": str(path),
                    "minz": int(minz),
                    "maxz": int(maxz),
                    "used_z": int(used_z),
                    "width": int(cog.width),
                    "height": int(cog.height),
                    "center_tile": {"x": int(t.x), "y": int(t.y), "z": int(t.z)}
                }
        except Exception as exc:
            # raise so outer code can log and return 500
            raise

    # --- run blocking work in threadpool ---
    try:
        info = await asyncio.to_thread(_process_cog_and_get_info, cog_source)
    except Exception as e:
        logger.exception("prepare-deepzoom: error processing COG")
        # return helpful error (avoid leaking stack)
        return JSONResponse({"detail": f"prepare-deepzoom error: {e}"}, status_code=500)

    # --- construct absolute tileTemplate (include encoded path as ?url=...) ---
    encoded = urllib.parse.quote_plus(info["path"])
    base = str(request.base_url).rstrip("/")  # includes scheme://host:port/
    tile_template = f"{base}/tiles/{{z}}/{{x}}/{{y}}.png?url={encoded}"

    resp = {
        "tileTemplate": tile_template,
        "minzoom": info["minz"],
        "maxzoom": info["maxz"],
        "width": info["width"],
        "height": info["height"],
        "url": info["path"],
        "center_tile": info["center_tile"]
    }
    logger.info("prepare-deepzoom: returning info for %s (min=%d,max=%d)", info["path"], info["minz"], info["maxz"])
    return JSONResponse(resp)

@app.get("/info")
def info(url: str = Query(..., description="Chemin local ou URL d'un COG")):
    try:
        path = Path(url)
        if url.startswith("http"):
            path = download_cog(url)
        path = reproject_cog(path)
        with COGReader(str(path)) as cog:
            return {
                "url": str(path),
                "bounds": cog.bounds,
                "width": cog.width,
                "height": cog.height,
                "minzoom": cog.minzoom,
                "maxzoom": cog.maxzoom,
                "dtype": str(cog.dataset.dtypes[0]),
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unable to read COG: {e}")

@app.get("/tiles/{z}/{x}/{y}.png")
def tiles(z: int, x: int, y: int, url: str = Query(..., description="Chemin local ou URL d'un COG")):
    """
    Retourne la tuile PNG (256x256) issue du COG.
    z/x/y sont au format WebMercator (slippy).
    """
    try:
        path = Path(url)
        if url.startswith("http"):
            path = download_cog(url)
        path = reproject_cog(path)

        with COGReader(str(path)) as cog:
            # rio-tiler tile expects (x, y, z)
            data, mask = cog.tile(x, y, z, tilesize=256, resampling=Resampling.bilinear)
            # construire image RGBA (ou grayscale si 1 band)
            if data.shape[0] >= 3:
                rgb = np.stack([data[0], data[1], data[2]], axis=2)
            else:
                rgb = np.stack([data[0], data[0], data[0]], axis=2)
            # appliquer mask (mask==False -> transparent)
            alpha = (mask.astype("uint8") * 255)
            rgba = np.dstack([rgb, alpha])
            img = Image.fromarray(rgba.astype("uint8"), mode="RGBA")
            buf = io.BytesIO()
            img.save(buf, format="PNG")
            buf.seek(0)
            return StreamingResponse(buf, media_type="image/png")
    except rasterio.errors.TileOutsideBounds:
        raise HTTPException(status_code=400, detail=f"Tile(x={x}, y={y}, z={z}) is outside bounds")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tile error: {e}")

