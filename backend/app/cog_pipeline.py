from rio_tiler.io import COGReader
from pyproj import Transformer
import mercantile

cog_path = r"C:\Users\BOX1~1\AppData\Local\Temp\cog_tiles\TCI_3857.tif"

with COGReader(cog_path) as reader:
    print("Bounds (WebMercator):", reader.bounds)  # (minX, minY, maxX, maxY)
    
    # conversion WebMercator -> lon/lat
    transformer = Transformer.from_crs("epsg:3857", "epsg:4326", always_xy=True)
    minLon, minLat = transformer.transform(reader.bounds[0], reader.bounds[1])
    maxLon, maxLat = transformer.transform(reader.bounds[2], reader.bounds[3])
    print("Bounds (lon/lat):", minLon, minLat, maxLon, maxLat)
    
    # centre du COG
    center_lon = (minLon + maxLon) / 2
    center_lat = (minLat + maxLat) / 2
    
    # tuile Mercator pour un zoom choisi
    z = 12
    tile = mercantile.tile(center_lon, center_lat, z)
    print("Tile x/y/z:", tile.x, tile.y, tile.z)
    
    data, mask = reader.tile(tile.x, tile.y, z)
    print("Tile shape:", data.shape)


"""import os
import requests
import rasterio
from rasterio.warp import calculate_default_transform, reproject, Resampling
from fastapi import FastAPI
from fastapi.responses import FileResponse
from pathlib import Path
from rio_tiler.io import COGReader
from PIL import Image

app = FastAPI()

# ----------------------------
# Config
# ----------------------------
COG_URL = "https://njogis-imagery.s3.amazonaws.com/2020/cog/I7D16.tif"
LOCAL_DIR = Path("C:/temp/cog_tiles")
LOCAL_DIR.mkdir(exist_ok=True, parents=True)

COG_LOCAL = LOCAL_DIR / "I7D16.tif"
COG_3857 = LOCAL_DIR / "I7D16_3857.tif"
DZI_DIR = LOCAL_DIR / "I7D16_dzi"

# ----------------------------
# Étape 1: Télécharger le COG
# ----------------------------
def download_cog(url, dest):
    if dest.exists():
        print(f"{dest} existe déjà, skipping download")
        return
    print(f"Téléchargement de {url} ...")
    r = requests.get(url, stream=True)
    r.raise_for_status()
    with open(dest, "wb") as f:
        for chunk in r.iter_content(1024 * 1024):
            f.write(chunk)
    print("Téléchargement terminé.")

# ----------------------------
# Étape 2: Reprojection EPSG:3857
# ----------------------------
def reproject_cog(src_path, dst_path):
    if dst_path.exists():
        print(f"{dst_path} existe déjà, skipping reprojection")
        return
    print(f"Reprojection de {src_path} en EPSG:3857 ...")
    with rasterio.open(src_path) as src:
        transform, width, height = calculate_default_transform(
            src.crs, "EPSG:3857", src.width, src.height, *src.bounds
        )
        kwargs = src.meta.copy()
        kwargs.update({"crs": "EPSG:3857", "transform": transform,
                       "width": width, "height": height})
        with rasterio.open(dst_path, "w", **kwargs) as dst:
            for i in range(1, src.count + 1):
                reproject(
                    source=rasterio.band(src, i),
                    destination=rasterio.band(dst, i),
                    src_transform=src.transform,
                    src_crs=src.crs,
                    dst_transform=transform,
                    dst_crs="EPSG:3857",
                    resampling=Resampling.bilinear
                )
    print("Reprojection terminée.")

# ----------------------------
# Étape 3: Génération DZI pour OpenSeadragon
# ----------------------------
def generate_dzi(src_path, dzi_dir):
    if dzi_dir.exists():
        print(f"{dzi_dir} existe déjà, skipping DZI")
        return
    print(f"Génération DZI depuis {src_path} ...")
    from rio_tiler.io import cogeo
    from rio_tiler.profiles import web

    profile = web("PNG")  # DeepZoom compatible avec OpenSeadragon

    os.makedirs(dzi_dir, exist_ok=True)
    with COGReader(src_path) as cog:
        for z in range(cog.minzoom, cog.maxzoom + 1):
            for x in range(2 ** z):
                for y in range(2 ** z):
                    try:
                        tile, mask = cog.tile(x, y, z, tilesize=256)
                        img = Image.fromarray(tile)
                        tile_path = dzi_dir / f"{z}_{x}_{y}.png"
                        img.save(tile_path)
                    except Exception:
                        continue
    print("DZI généré.")

# ----------------------------
# Étape 4: API FastAPI pour tester les tuiles
# ----------------------------
@app.get("/tiles/{z}/{x}/{y}.png")
def get_tile(z: int, x: int, y: int):
    tile_path = DZI_DIR / f"{z}_{x}_{y}.png"
    if not tile_path.exists():
        return {"error": "Tile not found"}
    return FileResponse(tile_path)

# ----------------------------
# Main
# ----------------------------
if __name__ == "__main__":
    download_cog(COG_URL, COG_LOCAL)
    reproject_cog(COG_LOCAL, COG_3857)
    generate_dzi(COG_3857, DZI_DIR)
    print("Lancer le serveur FastAPI: uvicorn cog_pipeline:app --reload")
"""