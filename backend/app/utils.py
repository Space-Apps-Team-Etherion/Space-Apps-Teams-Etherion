# utils.py
import math

def lonlat_to_tile(lon, lat, z):
    """Convert lon/lat to XYZ tile indices (WebMercator / slippy)."""
    # clamp
    n = 2.0 ** z
    xtile = int((lon + 180.0) / 360.0 * n)
    lat_rad = math.radians(lat)
    ytile = int((1.0 - math.log(math.tan(lat_rad) + 1.0 / math.cos(lat_rad)) / math.pi) / 2.0 * n)
    return xtile, ytile

def tile_bounds(x, y, z):
    """Return bounds of tile in lon/lat (left, bottom, right, top)."""
    n = 2.0 ** z
    lon_left = x / n * 360.0 - 180.0
    lon_right = (x + 1) / n * 360.0 - 180.0
    lat_top = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * y / n))))
    lat_bottom = math.degrees(math.atan(math.sinh(math.pi * (1 - 2 * (y + 1) / n))))
    return (lon_left, lat_bottom, lon_right, lat_top)
