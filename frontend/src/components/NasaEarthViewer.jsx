

// Version 1
// import React, { useState, useEffect } from 'react';
// import { ZoomIn, ZoomOut, RotateCcw, Info, Loader2 } from 'lucide-react';

// export default function NasaEarthViewer() {
//     const [earthData, setEarthData] = useState(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [zoom, setZoom] = useState(1);
//     const [position, setPosition] = useState({ x: 0, y: 0 });
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
//     const [showInfo, setShowInfo] = useState(true);

//     const NASA_API_KEY = '0sgXxBtCTTW9hUsdkuRVD0y3D2Hbr9963U54voC9'; // Using demo key, users should get their own from api.nasa.gov

//     useEffect(() => {
//         fetchEarthData();
//     }, []);

//     const fetchEarthData = async () => {
//         try {
//             setLoading(true);
//             setError(null);

//             // Try fetching EPIC data with retry logic
//             let response = await fetch(
//                 `https://epic.gsfc.nasa.gov/api/natural?api_key=${NASA_API_KEY}`
//             );

//             // If EPIC fails, use a fallback with static data
//             if (!response.ok) {
//                 console.warn('EPIC API unavailable, using fallback data');
//                 // Use a known working image from a recent date
//                 const fallbackData = {
//                     identifier: '20240115',
//                     caption: 'Earth from DSCOVR Satellite',
//                     date: '2024-01-15 12:00:00',
//                     centroid_coordinates: { lat: 0, lon: -45 },
//                     dscovr_j2000_position: { x: 1500000, y: 0, z: 0 },
//                     sun_j2000_position: { x: 150000000, y: 0, z: 0 },
//                     image: 'epic_1b_20240115120000',
//                     imageUrl: 'https://epic.gsfc.nasa.gov/archive/natural/2024/01/15/png/epic_1b_20240115120000.png'
//                 };

//                 setEarthData(fallbackData);
//                 setLoading(false);
//                 return;
//             }

//             const data = await response.json();
//             const latestImage = data[0];

//             // Construct the image URL using NASA's EPIC archive
//             const date = latestImage.date.split(' ')[0].split('-');
//             const imageUrl = `https://epic.gsfc.nasa.gov/archive/natural/${date[0]}/${date[1]}/${date[2]}/png/${latestImage.image}.png`;

//             setEarthData({
//                 ...latestImage,
//                 imageUrl
//             });
//             setLoading(false);
//         } catch (err) {
//             setError(`Unable to load Earth imagery: ${err.message}. The NASA API may be temporarily unavailable.`);
//             setLoading(false);
//         }
//     };

//     const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.5, 5));
//     const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.5, 1));
//     const handleReset = () => {
//         setZoom(1);
//         setPosition({ x: 0, y: 0 });
//     };

//     const handleMouseDown = (e) => {
//         setIsDragging(true);
//         setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
//     };

//     const handleMouseMove = (e) => {
//         if (isDragging && zoom > 1) {
//             setPosition({
//                 x: e.clientX - dragStart.x,
//                 y: e.clientY - dragStart.y
//             });
//         }
//     };

//     const handleMouseUp = () => setIsDragging(false);

//     if (loading) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-900">
//                 <div className="text-center">
//                     <Loader2 className="w-16 h-16 text-blue-400 animate-spin mx-auto mb-4" />
//                     <p className="text-white text-xl">Loading Earth imagery...</p>
//                 </div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-900">
//                 <div className="text-center text-red-400">
//                     <p className="text-xl mb-4">Error: {error}</p>
//                     <button
//                         onClick={fetchEarthData}
//                         className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//                     >
//                         Retry
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="relative h-screen bg-gray-900 overflow-hidden">
//             {/* Header */}
//             <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent z-10 p-6">
//                 <h1 className="text-3xl font-bold text-white mb-2">NASA Earth Viewer</h1>
//                 <p className="text-gray-300">EPIC - Earth Polychromatic Imaging Camera</p>
//             </div>

//             {/* Zoom Controls */}
//             <div className="absolute top-24 right-6 z-10 flex flex-col gap-2">
//                 <button
//                     onClick={handleZoomIn}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
//                     title="Zoom In"
//                 >
//                     <ZoomIn className="w-6 h-6 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleZoomOut}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
//                     title="Zoom Out"
//                 >
//                     <ZoomOut className="w-6 h-6 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleReset}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
//                     title="Reset View"
//                 >
//                     <RotateCcw className="w-6 h-6 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={() => setShowInfo(!showInfo)}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
//                     title="Toggle Info"
//                 >
//                     <Info className="w-6 h-6 text-gray-800" />
//                 </button>
//             </div>

//             {/* Earth Image Container */}
//             <div
//                 className="absolute inset-0 flex items-center justify-center cursor-move"
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 onMouseLeave={handleMouseUp}
//             >
//                 <img
//                     src={earthData.imageUrl}
//                     alt="Earth from NASA EPIC"
//                     className="max-w-none transition-transform"
//                     style={{
//                         transform: `translate(${position.x}px, ${position.y}px) scale(${zoom})`,
//                         cursor: isDragging ? 'grabbing' : 'grab'
//                     }}
//                     draggable={false}
//                 />
//             </div>

//             {/* Information Panel */}
//             {showInfo && earthData && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-6">
//                     <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 text-white">
//                         <div>
//                             <h3 className="text-sm text-gray-400 mb-1">Date & Time</h3>
//                             <p className="text-lg font-semibold">{earthData.date}</p>
//                         </div>
//                         <div>
//                             <h3 className="text-sm text-gray-400 mb-1">Image Identifier</h3>
//                             <p className="text-lg font-semibold">{earthData.identifier}</p>
//                         </div>
//                         <div>
//                             <h3 className="text-sm text-gray-400 mb-1">Satellite Position</h3>
//                             <p className="text-sm">
//                                 X: {earthData.dscovr_j2000_position.x.toFixed(0)} km<br />
//                                 Y: {earthData.dscovr_j2000_position.y.toFixed(0)} km<br />
//                                 Z: {earthData.dscovr_j2000_position.z.toFixed(0)} km
//                             </p>
//                         </div>
//                         <div>
//                             <h3 className="text-sm text-gray-400 mb-1">Earth Center</h3>
//                             <p className="text-sm">
//                                 Lat: {earthData.centroid_coordinates.lat.toFixed(2)}°<br />
//                                 Lon: {earthData.centroid_coordinates.lon.toFixed(2)}°
//                             </p>
//                         </div>
//                         <div className="md:col-span-2">
//                             <h3 className="text-sm text-gray-400 mb-1">Sun Position</h3>
//                             <p className="text-sm">
//                                 X: {earthData.sun_j2000_position.x.toFixed(0)} km |
//                                 Y: {earthData.sun_j2000_position.y.toFixed(0)} km |
//                                 Z: {earthData.sun_j2000_position.z.toFixed(0)} km
//                             </p>
//                         </div>
//                     </div>
//                     <div className="max-w-4xl mx-auto mt-4 text-gray-400 text-sm">
//                         <p>Zoom: {zoom.toFixed(1)}x | Click and drag to pan when zoomed in</p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


//Version 2
// import React, { useState, useEffect, useRef } from 'react';
// import { ZoomIn, ZoomOut, Maximize2, Layers, Info, Globe } from 'lucide-react';

// export default function NasaEarthMapViewer() {
//     const [zoom, setZoom] = useState(2);
//     const [center, setCenter] = useState({ lat: 0, lon: 0 });
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragStart, setDragStart] = useState({ x: 0, y: 0, lat: 0, lon: 0 });
//     const [showInfo, setShowInfo] = useState(true);
//     const [layer, setLayer] = useState('BlueMarble');
//     const [tiles, setTiles] = useState([]);
//     const canvasRef = useRef(null);
//     const imageCache = useRef({});

//     // Available NASA GIBS layers
//     const layers = {
//         BlueMarble: {
//             name: 'Blue Marble',
//             url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/BlueMarble_ShadedRelief_Bathymetry/default/2024-01-01/250m/{z}/{y}/{x}.jpeg',
//             description: 'Natural color Earth imagery'
//         },
//         VIIRS: {
//             name: 'Day/Night Band',
//             url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/VIIRS_SNPP_CorrectedReflectance_TrueColor/default/2024-01-01/250m/{z}/{y}/{x}.jpeg',
//             description: 'True color satellite imagery'
//         },
//         Landsat: {
//             name: 'Landsat',
//             url: 'https://gibs.earthdata.nasa.gov/wmts/epsg4326/best/Landsat_WELD_CorrectedReflectance_TrueColor_Global_Annual/default/2013-01-01/250m/{z}/{y}/{x}.png',
//             description: 'Annual Landsat mosaic'
//         }
//     };

//     // Convert lat/lon to tile coordinates
//     const latLonToTile = (lat, lon, z) => {
//         const n = Math.pow(2, z);
//         const x = Math.floor((lon + 180) / 360 * n);
//         const y = Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * n);
//         return { x, y, z };
//     };

//     // Convert tile coordinates to lat/lon
//     const tileToLatLon = (x, y, z) => {
//         const n = Math.pow(2, z);
//         const lon = x / n * 360 - 180;
//         const lat = Math.atan(Math.sinh(Math.PI * (1 - 2 * y / n))) * 180 / Math.PI;
//         return { lat, lon };
//     };

//     // Get visible tiles based on current view
//     const getVisibleTiles = () => {
//         const canvas = canvasRef.current;
//         if (!canvas) return [];

//         const width = canvas.width;
//         const height = canvas.height;
//         const z = Math.floor(zoom);

//         // Calculate how many tiles we need
//         const centerTile = latLonToTile(center.lat, center.lon, z);
//         const tilesX = Math.ceil(width / 256) + 2;
//         const tilesY = Math.ceil(height / 256) + 2;

//         const visibleTiles = [];
//         for (let dy = -tilesY; dy <= tilesY; dy++) {
//             for (let dx = -tilesX; dx <= tilesX; dx++) {
//                 const tx = centerTile.x + dx;
//                 const ty = centerTile.y + dy;
//                 const maxTiles = Math.pow(2, z);

//                 if (ty >= 0 && ty < maxTiles) {
//                     // Wrap x coordinate for continuous scrolling
//                     const wrappedX = ((tx % maxTiles) + maxTiles) % maxTiles;
//                     visibleTiles.push({ x: wrappedX, y: ty, z, dx, dy });
//                 }
//             }
//         }

//         return visibleTiles;
//     };

//     // Load and cache tile image
//     const loadTile = (tile) => {
//         const key = `${layer}-${tile.z}-${tile.x}-${tile.y}`;

//         if (imageCache.current[key]) {
//             return imageCache.current[key];
//         }

//         const img = new Image();
//         img.crossOrigin = 'anonymous';

//         // Use the selected layer URL template
//         const url = layers[layer].url
//             .replace('{z}', tile.z)
//             .replace('{x}', tile.x)
//             .replace('{y}', tile.y);

//         img.src = url;
//         imageCache.current[key] = img;

//         img.onload = () => {
//             drawMap();
//         };

//         return img;
//     };

//     // Draw the map
//     const drawMap = () => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext('2d');
//         const width = canvas.width;
//         const height = canvas.height;

//         // Clear canvas
//         ctx.fillStyle = '#000814';
//         ctx.fillRect(0, 0, width, height);

//         const z = Math.floor(zoom);
//         const centerTile = latLonToTile(center.lat, center.lon, z);
//         const centerPos = tileToLatLon(centerTile.x + 0.5, centerTile.y + 0.5, z);

//         // Calculate pixel offset
//         const pixelScale = 256 * Math.pow(2, zoom - z);
//         const centerPixelX = width / 2;
//         const centerPixelY = height / 2;

//         const latDiff = center.lat - centerPos.lat;
//         const lonDiff = center.lon - centerPos.lon;

//         // Draw tiles
//         const visibleTiles = getVisibleTiles();
//         visibleTiles.forEach(tile => {
//             const img = loadTile(tile);

//             if (img.complete) {
//                 const tilePos = tileToLatLon(tile.x, tile.y, z);
//                 const tileLat = tilePos.lat;
//                 const tileLon = tilePos.lon;

//                 const latOffset = (tileLat - center.lat);
//                 const lonOffset = (tileLon - center.lon);

//                 // Handle world wrapping
//                 let adjustedLonOffset = lonOffset;
//                 if (Math.abs(lonOffset) > 180) {
//                     adjustedLonOffset = lonOffset > 0 ? lonOffset - 360 : lonOffset + 360;
//                 }

//                 const x = centerPixelX + (adjustedLonOffset * pixelScale * 360 / 256);
//                 const y = centerPixelY - (latOffset * pixelScale * 170 / 256); // Approximate

//                 ctx.drawImage(img, x, y, pixelScale, pixelScale);
//             }
//         });

//         // Draw crosshair at center
//         ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
//         ctx.lineWidth = 2;
//         ctx.beginPath();
//         ctx.moveTo(width / 2 - 20, height / 2);
//         ctx.lineTo(width / 2 + 20, height / 2);
//         ctx.moveTo(width / 2, height / 2 - 20);
//         ctx.lineTo(width / 2, height / 2 + 20);
//         ctx.stroke();
//     };

//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             canvas.width = window.innerWidth;
//             canvas.height = window.innerHeight;
//         }

//         drawMap();

//         const handleResize = () => {
//             if (canvas) {
//                 canvas.width = window.innerWidth;
//                 canvas.height = window.innerHeight;
//                 drawMap();
//             }
//         };

//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, [zoom, center, layer]);

//     const handleZoomIn = () => {
//         setZoom(prev => Math.min(prev + 1, 8));
//     };

//     const handleZoomOut = () => {
//         setZoom(prev => Math.max(prev - 1, 1));
//     };

//     const handleReset = () => {
//         setZoom(2);
//         setCenter({ lat: 0, lon: 0 });
//     };

//     const handleMouseDown = (e) => {
//         setIsDragging(true);
//         setDragStart({
//             x: e.clientX,
//             y: e.clientY,
//             lat: center.lat,
//             lon: center.lon
//         });
//     };

//     const handleMouseMove = (e) => {
//         if (!isDragging) return;

//         const dx = e.clientX - dragStart.x;
//         const dy = e.clientY - dragStart.y;

//         const z = Math.floor(zoom);
//         const pixelScale = 256 * Math.pow(2, zoom - z);

//         const latChange = (dy / pixelScale) * (256 / 170);
//         const lonChange = -(dx / pixelScale) * (256 / 360);

//         let newLat = dragStart.lat + latChange;
//         let newLon = dragStart.lon + lonChange;

//         // Clamp latitude
//         newLat = Math.max(-85, Math.min(85, newLat));

//         // Wrap longitude
//         while (newLon > 180) newLon -= 360;
//         while (newLon < -180) newLon += 360;

//         setCenter({ lat: newLat, lon: newLon });
//     };

//     const handleMouseUp = () => {
//         setIsDragging(false);
//     };

//     const handleWheel = (e) => {
//         e.preventDefault();
//         const delta = e.deltaY > 0 ? -0.5 : 0.5;
//         setZoom(prev => Math.max(1, Math.min(8, prev + delta)));
//     };

//     return (
//         <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
//             {/* Canvas for map */}
//             <canvas
//                 ref={canvasRef}
//                 className="absolute inset-0"
//                 style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 onMouseLeave={handleMouseUp}
//                 onWheel={handleWheel}
//             />

//             {/* Header */}
//             <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4">
//                 <div className="flex items-center gap-3">
//                     <Globe className="w-8 h-8 text-blue-400" />
//                     <div>
//                         <h1 className="text-2xl font-bold text-white">NASA Earth Map</h1>
//                         <p className="text-sm text-gray-300">Global Imagery Browse Services</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Controls */}
//             <div className="absolute top-24 right-4 z-10 flex flex-col gap-2">
//                 <button
//                     onClick={handleZoomIn}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
//                     title="Zoom In"
//                 >
//                     <ZoomIn className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleZoomOut}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
//                     title="Zoom Out"
//                 >
//                     <ZoomOut className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleReset}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
//                     title="Reset View"
//                 >
//                     <Maximize2 className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={() => setShowInfo(!showInfo)}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition"
//                     title="Toggle Info"
//                 >
//                     <Info className="w-5 h-5 text-gray-800" />
//                 </button>
//             </div>

//             {/* Layer Selector */}
//             <div className="absolute top-24 left-4 z-10 bg-white/90 rounded-lg shadow-lg p-3">
//                 <div className="flex items-center gap-2 mb-2">
//                     <Layers className="w-5 h-5 text-gray-800" />
//                     <span className="font-semibold text-gray-800">Layers</span>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                     {Object.entries(layers).map(([key, value]) => (
//                         <button
//                             key={key}
//                             onClick={() => {
//                                 setLayer(key);
//                                 imageCache.current = {}; // Clear cache when changing layers
//                             }}
//                             className={`px-3 py-2 rounded text-sm transition ${layer === key
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                                 }`}
//                         >
//                             {value.name}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Info Panel */}
//             {showInfo && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4">
//                     <div className="max-w-4xl mx-auto">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2">
//                             <div>
//                                 <p className="text-xs text-gray-400">Latitude</p>
//                                 <p className="font-mono text-lg">{center.lat.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Longitude</p>
//                                 <p className="font-mono text-lg">{center.lon.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Zoom Level</p>
//                                 <p className="font-mono text-lg">{zoom.toFixed(1)}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Layer</p>
//                                 <p className="text-lg">{layers[layer].name}</p>
//                             </div>
//                         </div>
//                         <p className="text-sm text-gray-300">{layers[layer].description}</p>
//                         <p className="text-xs text-gray-400 mt-2">
//                             Drag to pan • Scroll to zoom • Data from NASA GIBS
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


//Version3
import React, { useState, useEffect, useRef } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Layers, Info, Globe, Loader2 } from 'lucide-react';

export default function NasaEarthMapViewer() {
    const [zoom, setZoom] = useState(2);
    const [center, setCenter] = useState({ lat: 20, lon: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0, lat: 0, lon: 0 });
    const [showInfo, setShowInfo] = useState(true);
    const [layer, setLayer] = useState('Satellite');
    const [loadingTiles, setLoadingTiles] = useState(0);
    const canvasRef = useRef(null);
    const imageCache = useRef({});
    const animationFrameRef = useRef(null);

   // Fast, reliable tile sources
   const layers = {
       Satellite: {
           name: 'Satellite (Esri)',
           url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
           description: 'High-resolution satellite imagery',
           maxZoom: 18
       },
       OpenStreetMap: {
           name: 'OpenStreetMap',
           url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
           description: 'Detailed street and terrain map',
           maxZoom: 19
       },
       Terrain: {
           name: 'Terrain',
           url: 'https://tile.opentopomap.org/{z}/{x}/{y}.png',
           description: 'Topographic map with elevation',
           maxZoom: 17
       },
       Dark: {
           name: 'Dark Mode',
           url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}.png',
           description: 'Dark themed map',
           maxZoom: 20
       }
   };

    // Convert lat/lon to tile coordinates
    const latLonToTile = (lat, lon, z) => {
        const n = Math.pow(2, z);
        const x = Math.floor((lon + 180) / 360 * n);
        const latRad = lat * Math.PI / 180;
        const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
        return { x, y, z };
    };

    // Convert pixel position to lat/lon
    const pixelToLatLon = (px, py, centerLat, centerLon, z) => {
        const centerTile = latLonToTile(centerLat, centerLon, z);
        const scale = Math.pow(2, z);
        const worldSize = 256 * scale;

        // Center pixel in world coordinates
        const centerX = (centerLon + 180) / 360 * worldSize;
        const centerY = (1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * worldSize;

        // New position in world coordinates
        const canvas = canvasRef.current;
        const newX = centerX + (px - canvas.width / 2);
        const newY = centerY + (py - canvas.height / 2);

        // Convert back to lat/lon
        const lon = (newX / worldSize) * 360 - 180;
        const n = Math.PI - 2 * Math.PI * newY / worldSize;
        const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

        return { lat, lon };
    };

    // Get visible tiles
    const getVisibleTiles = () => {
        const canvas = canvasRef.current;
        if (!canvas) return [];

        const z = Math.floor(zoom);
        const maxZoom = layers[layer].maxZoom;
        const actualZoom = Math.min(z, maxZoom);

        const centerTile = latLonToTile(center.lat, center.lon, actualZoom);
        const scale = Math.pow(2, actualZoom);

        // Calculate center position in pixels
        const centerX = (center.lon + 180) / 360 * 256 * scale;
        const centerY = (1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * 256 * scale;

        const tilesNeededX = Math.ceil(canvas.width / 256) + 1;
        const tilesNeededY = Math.ceil(canvas.height / 256) + 1;

        const tiles = [];
        const maxTiles = Math.pow(2, actualZoom);

        for (let dy = -tilesNeededY; dy <= tilesNeededY; dy++) {
            for (let dx = -tilesNeededX; dx <= tilesNeededX; dx++) {
                let tx = centerTile.x + dx;
                const ty = centerTile.y + dy;

                // Wrap X coordinate
                tx = ((tx % maxTiles) + maxTiles) % maxTiles;

                if (ty >= 0 && ty < maxTiles) {
                    const tileX = tx * 256;
                    const tileY = ty * 256;

                    const screenX = canvas.width / 2 + (tileX - centerX);
                    const screenY = canvas.height / 2 + (tileY - centerY);

                    tiles.push({ x: tx, y: ty, z: actualZoom, screenX, screenY });
                }
            }
        }

        return tiles;
    };

    // Load tile with faster caching
    const loadTile = (tile) => {
        const key = `${layer}-${tile.z}-${tile.x}-${tile.y}`;

        if (imageCache.current[key]) {
            return imageCache.current[key];
        }

        const img = new Image();
        img.crossOrigin = 'anonymous';

        const url = layers[layer].url
            .replace('{z}', tile.z)
            .replace('{x}', tile.x)
            .replace('{y}', tile.y);

        img.src = url;

        img.onloadstart = () => {
            setLoadingTiles(prev => prev + 1);
        };

        img.onload = () => {
            setLoadingTiles(prev => Math.max(0, prev - 1));
            requestAnimationFrame(drawMap);
        };

        img.onerror = () => {
            setLoadingTiles(prev => Math.max(0, prev - 1));
        };

        imageCache.current[key] = img;
        return img;
    };

    // Optimized drawing
    const drawMap = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        ctx.fillStyle = layer === 'Dark' ? '#1a1a2e' : '#a8dadc';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const tiles = getVisibleTiles();

        tiles.forEach(tile => {
            const img = loadTile(tile);

            if (img.complete && img.naturalHeight !== 0) {
                ctx.drawImage(img, tile.screenX, tile.screenY, 256, 256);
            }
        });

        // Draw crosshair
        ctx.strokeStyle = layer === 'Dark' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        const cx = canvas.width / 2;
        const cy = canvas.height / 2;
        ctx.moveTo(cx - 15, cy);
        ctx.lineTo(cx + 15, cy);
        ctx.moveTo(cx, cy - 15);
        ctx.lineTo(cx, cy + 15);
        ctx.stroke();
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        drawMap();

        const handleResize = () => {
            if (canvas) {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
                drawMap();
            }
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [zoom, center, layer]);

    const handleZoomIn = () => {
        setZoom(prev => Math.min(prev + 1, layers[layer].maxZoom));
    };

    const handleZoomOut = () => {
        setZoom(prev => Math.max(prev - 1, 1));
    };

    const handleReset = () => {
        setZoom(2);
        setCenter({ lat: 20, lon: 0 });
    };

    const handleMouseDown = (e) => {
        setIsDragging(true);
        setDragStart({
            x: e.clientX,
            y: e.clientY,
            lat: center.lat,
            lon: center.lon
        });
    };

    const handleMouseMove = (e) => {
        if (!isDragging) return;

        const dx = e.clientX - dragStart.x;
        const dy = e.clientY - dragStart.y;

        const z = Math.floor(zoom);
        const scale = Math.pow(2, z);

        // More accurate panning calculation
        const latChange = -(dy / 256) * (360 / scale);
        const lonChange = -(dx / 256) * (360 / scale);

        let newLat = dragStart.lat + latChange;
        let newLon = dragStart.lon + lonChange;

        // Clamp latitude
        newLat = Math.max(-85, Math.min(85, newLat));

        // Wrap longitude
        while (newLon > 180) newLon -= 360;
        while (newLon < -180) newLon += 360;

        setCenter({ lat: newLat, lon: newLon });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleWheel = (e) => {
        e.preventDefault();
        const delta = e.deltaY > 0 ? -0.5 : 0.5;
        const maxZoom = layers[layer].maxZoom;
        setZoom(prev => Math.max(1, Math.min(maxZoom, prev + delta)));
    };

    return (
        <div className="relative w-full h-screen bg-gray-900 overflow-hidden">
            <canvas
                ref={canvasRef}
                className="absolute inset-0"
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onWheel={handleWheel}
            />

            {/* Loading Indicator */}
            {loadingTiles > 0 && (
                <div className="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 bg-black/80 text-white px-4 py-2 rounded-full flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span className="text-sm">Loading tiles...</span>
                </div>
            )}

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4">
                <div className="flex items-center gap-3">
                    <Globe className="w-8 h-8 text-blue-400" />
                    <div>
                        <h1 className="text-2xl font-bold text-white">Interactive Earth Map</h1>
                        <p className="text-sm text-gray-300">Pan, zoom, and explore the world</p>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="absolute top-24 right-4 z-10 flex flex-col gap-2">
                <button
                    onClick={handleZoomIn}
                    className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition cursor-pointer"
                    title="Zoom In"
                >
                    <ZoomIn className="w-5 h-5 text-gray-800" />
                </button>
                <button
                    onClick={handleZoomOut}
                    className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition cursor-pointer"
                    title="Zoom Out"
                >
                    <ZoomOut className="w-5 h-5 text-gray-800" />
                </button>
                <button
                    onClick={handleReset}
                    className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition cursor-pointer"
                    title="Reset View"
                >
                    <Maximize2 className="w-5 h-5 text-gray-800" />
                </button>
                <button
                    onClick={() => setShowInfo(!showInfo)}
                    className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition cursor-pointer"
                    title="Toggle Info"
                >
                    <Info className="w-5 h-5 text-gray-800" />
                </button>
            </div>

            {/* Layer Selector */}
            <div className="absolute top-24 left-4 z-10 bg-white/90 rounded-lg shadow-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                    <Layers className="w-5 h-5 text-gray-800" />
                    <span className="font-semibold text-gray-800">Map Layers</span>
                </div>
                <div className="flex flex-col gap-1">
                    {Object.entries(layers).map(([key, value]) => (
                        <button
                            key={key}
                            onClick={() => {
                                setLayer(key);
                                imageCache.current = {};
                            }}
                            className={`px-3 py-2 rounded text-sm transition text-left ${layer === key
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                }`}
                        >
                            <div className="font-medium">{value.name}</div>
                            <div className="text-xs opacity-75">{value.description}</div>
                        </button>
                    ))}
                </div>
            </div>

            {/* Info Panel */}
            {showInfo && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2">
                            <div>
                                <p className="text-xs text-gray-400">Latitude</p>
                                <p className="font-mono text-lg">{center.lat.toFixed(4)}°</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Longitude</p>
                                <p className="font-mono text-lg">{center.lon.toFixed(4)}°</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Zoom Level</p>
                                <p className="font-mono text-lg">{zoom.toFixed(1)}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Map Style</p>
                                <p className="text-lg">{layers[layer].name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-gray-300">{layers[layer].description}</p>
                        <p className="text-xs text-gray-400 mt-2">
                            Drag to pan • Scroll to zoom • Switch layers to explore different views
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

//Version 4
// import React, { useState, useEffect, useRef, useCallback } from 'react';
// import { ZoomIn, ZoomOut, Maximize2, Layers, Info, Globe } from 'lucide-react';

// export default function NasaEarthMapViewer() {
//     const [zoom, setZoom] = useState(2);
//     const [center, setCenter] = useState({ lat: 20, lon: 0 });
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragStart, setDragStart] = useState({ x: 0, y: 0, lat: 0, lon: 0 });
//     const [showInfo, setShowInfo] = useState(true);
//     const [layer, setLayer] = useState('Satellite');
//     const canvasRef = useRef(null);
//     const imageCache = useRef({});
//     const loadingQueue = useRef(new Set());
//     const rafRef = useRef(null);
//     const lastDrawTime = useRef(0);

//     const layers = {
//         Satellite: {
//             name: 'Satellite',
//             url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//             description: 'High-resolution satellite imagery',
//             maxZoom: 18
//         },
//         OpenStreetMap: {
//             name: 'OpenStreetMap',
//             url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
//             description: 'Detailed street and terrain map',
//             maxZoom: 19
//         },
//         CartoDB: {
//             name: 'Light Map',
//             url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
//             description: 'Clean, fast-loading map',
//             maxZoom: 19
//         },
//         Dark: {
//             name: 'Dark Mode',
//             url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
//             description: 'Dark themed map',
//             maxZoom: 19
//         }
//     };

//     const latLonToTile = (lat, lon, z) => {
//         const n = Math.pow(2, z);
//         const x = Math.floor((lon + 180) / 360 * n);
//         const latRad = lat * Math.PI / 180;
//         const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
//         return { x, y };
//     };

//     const getVisibleTiles = useCallback(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return [];

//         const z = Math.floor(zoom);
//         const maxZoom = layers[layer].maxZoom;
//         const actualZoom = Math.min(z, maxZoom);

//         const centerTile = latLonToTile(center.lat, center.lon, actualZoom);
//         const scale = Math.pow(2, actualZoom);

//         const centerX = (center.lon + 180) / 360 * 256 * scale;
//         const centerY = (1 - Math.log(Math.tan(center.lat * Math.PI / 180) + 1 / Math.cos(center.lat * Math.PI / 180)) / Math.PI) / 2 * 256 * scale;

//         // Calculate with extra buffer for preloading
//         const tilesNeededX = Math.ceil(canvas.width / 256) + 2;
//         const tilesNeededY = Math.ceil(canvas.height / 256) + 2;

//         const tiles = [];
//         const maxTiles = Math.pow(2, actualZoom);

//         for (let dy = -tilesNeededY; dy <= tilesNeededY; dy++) {
//             for (let dx = -tilesNeededX; dx <= tilesNeededX; dx++) {
//                 let tx = centerTile.x + dx;
//                 const ty = centerTile.y + dy;

//                 tx = ((tx % maxTiles) + maxTiles) % maxTiles;

//                 if (ty >= 0 && ty < maxTiles) {
//                     const tileX = tx * 256;
//                     const tileY = ty * 256;

//                     const screenX = canvas.width / 2 + (tileX - centerX);
//                     const screenY = canvas.height / 2 + (tileY - centerY);

//                     // Calculate distance from center for priority loading
//                     const distFromCenter = Math.sqrt(dx * dx + dy * dy);

//                     tiles.push({
//                         x: tx,
//                         y: ty,
//                         z: actualZoom,
//                         screenX,
//                         screenY,
//                         priority: distFromCenter
//                     });
//                 }
//             }
//         }

//         // Sort by priority (closer tiles load first)
//         tiles.sort((a, b) => a.priority - b.priority);
//         return tiles;
//     }, [zoom, center, layer]);

//     const loadTile = useCallback((tile) => {
//         const key = `${layer}-${tile.z}-${tile.x}-${tile.y}`;

//         if (imageCache.current[key]) {
//             return imageCache.current[key];
//         }

//         // Check if already loading
//         if (loadingQueue.current.has(key)) {
//             return null;
//         }

//         const img = new Image();
//         img.crossOrigin = 'anonymous';

//         const url = layers[layer].url
//             .replace('{z}', tile.z)
//             .replace('{x}', tile.x)
//             .replace('{y}', tile.y);

//         loadingQueue.current.add(key);

//         img.onload = () => {
//             loadingQueue.current.delete(key);
//             imageCache.current[key] = img;
//             // Use throttled redraw
//             scheduleRedraw();
//         };

//         img.onerror = () => {
//             loadingQueue.current.delete(key);
//         };

//         img.src = url;
//         return null;
//     }, [layer]);

//     // Throttled redraw to prevent too many renders
//     const scheduleRedraw = useCallback(() => {
//         if (rafRef.current) return;

//         rafRef.current = requestAnimationFrame((timestamp) => {
//             // Throttle to ~30fps for smoother experience
//             if (timestamp - lastDrawTime.current > 33) {
//                 drawMap();
//                 lastDrawTime.current = timestamp;
//             }
//             rafRef.current = null;
//         });
//     }, []);

//     const drawMap = useCallback(() => {
//         const canvas = canvasRef.current;
//         if (!canvas) return;

//         const ctx = canvas.getContext('2d', { alpha: false });

//         // Use appropriate background color
//         ctx.fillStyle = layer === 'Dark' ? '#0a0a0a' : '#b0c4de';
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         const tiles = getVisibleTiles();

//         // Draw tiles
//         tiles.forEach(tile => {
//             const key = `${layer}-${tile.z}-${tile.x}-${tile.y}`;
//             const img = imageCache.current[key];

//             if (img && img.complete && img.naturalHeight !== 0) {
//                 ctx.drawImage(img, tile.screenX, tile.screenY, 256, 256);
//             } else {
//                 // Start loading if not loaded
//                 loadTile(tile);

//                 // Draw placeholder for missing tiles
//                 ctx.fillStyle = layer === 'Dark' ? '#1a1a1a' : '#d0d0d0';
//                 ctx.fillRect(tile.screenX, tile.screenY, 256, 256);
//             }
//         });

//         // Draw crosshair
//         ctx.strokeStyle = layer === 'Dark' ? 'rgba(255, 255, 255, 0.5)' : 'rgba(0, 0, 0, 0.3)';
//         ctx.lineWidth = 2;
//         ctx.beginPath();
//         const cx = canvas.width / 2;
//         const cy = canvas.height / 2;
//         ctx.moveTo(cx - 15, cy);
//         ctx.lineTo(cx + 15, cy);
//         ctx.moveTo(cx, cy - 15);
//         ctx.lineTo(cx, cy + 15);
//         ctx.stroke();
//     }, [zoom, center, layer, getVisibleTiles, loadTile]);

//     // Debounced draw on state changes
//     useEffect(() => {
//         const canvas = canvasRef.current;
//         if (canvas) {
//             canvas.width = window.innerWidth;
//             canvas.height = window.innerHeight;
//         }

//         const timeoutId = setTimeout(() => {
//             drawMap();
//         }, 10);

//         const handleResize = () => {
//             if (canvas) {
//                 canvas.width = window.innerWidth;
//                 canvas.height = window.innerHeight;
//                 drawMap();
//             }
//         };

//         window.addEventListener('resize', handleResize);

//         return () => {
//             clearTimeout(timeoutId);
//             window.removeEventListener('resize', handleResize);
//             if (rafRef.current) {
//                 cancelAnimationFrame(rafRef.current);
//             }
//         };
//     }, [zoom, center, layer, drawMap]);

//     const handleZoomIn = () => {
//         setZoom(prev => Math.min(prev + 1, layers[layer].maxZoom));
//     };

//     const handleZoomOut = () => {
//         setZoom(prev => Math.max(prev - 1, 1));
//     };

//     const handleReset = () => {
//         setZoom(2);
//         setCenter({ lat: 20, lon: 0 });
//     };

//     const handleMouseDown = (e) => {
//         setIsDragging(true);
//         setDragStart({
//             x: e.clientX,
//             y: e.clientY,
//             lat: center.lat,
//             lon: center.lon
//         });
//     };

//     const handleMouseMove = (e) => {
//         if (!isDragging) return;

//         const dx = e.clientX - dragStart.x;
//         const dy = e.clientY - dragStart.y;

//         const z = Math.floor(zoom);
//         const scale = Math.pow(2, z);

//         const latChange = -(dy / 256) * (360 / scale);
//         const lonChange = -(dx / 256) * (360 / scale);

//         let newLat = dragStart.lat + latChange;
//         let newLon = dragStart.lon + lonChange;

//         newLat = Math.max(-85, Math.min(85, newLat));

//         while (newLon > 180) newLon -= 360;
//         while (newLon < -180) newLon += 360;

//         setCenter({ lat: newLat, lon: newLon });
//     };

//     const handleMouseUp = () => {
//         setIsDragging(false);
//     };

//     const handleWheel = (e) => {
//         e.preventDefault();
//         const delta = e.deltaY > 0 ? -0.5 : 0.5;
//         const maxZoom = layers[layer].maxZoom;
//         setZoom(prev => Math.max(1, Math.min(maxZoom, prev + delta)));
//     };

//     return (
//         <div className="relative w-full h-screen bg-gray-900 overflow-hidden select-none">
//             <canvas
//                 ref={canvasRef}
//                 className="absolute inset-0"
//                 style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 onMouseLeave={handleMouseUp}
//                 onWheel={handleWheel}
//             />

//             {/* Header */}
//             <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4 pointer-events-none">
//                 <div className="flex items-center gap-3">
//                     <Globe className="w-8 h-8 text-blue-400" />
//                     <div>
//                         <h1 className="text-2xl font-bold text-white">Interactive Earth Map</h1>
//                         <p className="text-sm text-gray-300">Explore Earth • And Beyond</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Controls */}
//             <div className="absolute top-24 right-4 z-10 flex flex-col gap-2">
//                 <button
//                     onClick={handleZoomIn}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Zoom In"
//                 >
//                     <ZoomIn className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleZoomOut}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Zoom Out"
//                 >
//                     <ZoomOut className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleReset}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Reset View"
//                 >
//                     <Maximize2 className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={() => setShowInfo(!showInfo)}
//                     className="p-3 bg-white/90 rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Toggle Info"
//                 >
//                     <Info className="w-5 h-5 text-gray-800" />
//                 </button>
//             </div>

//             {/* Layer Selector */}
//             <div className="absolute top-24 left-4 z-10 bg-white/95 rounded-lg shadow-lg p-3 backdrop-blur-sm">
//                 <div className="flex items-center gap-2 mb-2">
//                     <Layers className="w-5 h-5 text-gray-800" />
//                     <span className="font-semibold text-gray-800">Layers</span>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                     {Object.entries(layers).map(([key, value]) => (
//                         <button
//                             key={key}
//                             onClick={() => {
//                                 setLayer(key);
//                                 // Clear cache when switching layers
//                                 imageCache.current = {};
//                                 loadingQueue.current.clear();
//                             }}
//                             className={`px-3 py-2 rounded text-sm transition text-left active:scale-95 ${layer === key
//                                 ? 'bg-blue-600 text-white'
//                                 : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                                 }`}
//                         >
//                             <div className="font-semibold">{value.name}</div>
//                             <div className='font-light'>{value.description}</div>
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Info Panel */}
//             {showInfo && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4 pointer-events-none">
//                     <div className="max-w-4xl mx-auto">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2">
//                             <div>
//                                 <p className="text-xs text-gray-400">Latitude</p>
//                                 <p className="font-mono text-lg">{center.lat.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Longitude</p>
//                                 <p className="font-mono text-lg">{center.lon.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Zoom Level</p>
//                                 <p className="font-mono text-lg">{zoom.toFixed(1)}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Map Style</p>
//                                 <p className="text-lg">{layers[layer].name}</p>
//                             </div>
//                         </div>
//                         <p className="text-xs text-gray-400 mt-2">
//                             Drag to pan • Scroll to zoom • Tiles load prioritized from center
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


// //Version 5
// import React, { useState, useEffect, useRef } from 'react';
// import { ZoomIn, ZoomOut, Maximize2, Layers, Info, Globe } from 'lucide-react';

// export default function NasaEarthMapViewer() {
//     const [zoom, setZoom] = useState(3);
//     const [center, setCenter] = useState({ lat: 20, lon: 0 });
//     const [isDragging, setIsDragging] = useState(false);
//     const [dragStart, setDragStart] = useState({ x: 0, y: 0, lat: 0, lon: 0 });
//     const [showInfo, setShowInfo] = useState(true);
//     const [layer, setLayer] = useState('CartoDB');
//     const [tiles, setTiles] = useState([]);
//     const containerRef = useRef(null);

//     const layers = {
//         CartoDB: {
//             name: 'Light Map',
//             url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
//             subdomains: ['a', 'b', 'c', 'd'],
//             description: 'Clean, fast-loading map',
//             maxZoom: 19
//         },
//         Dark: {
//             name: 'Dark Mode',
//             url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
//             subdomains: ['a', 'b', 'c', 'd'],
//             description: 'Dark themed map',
//             maxZoom: 19
//         },
//         OpenStreetMap: {
//             name: 'OpenStreetMap',
//             url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//             subdomains: ['a', 'b', 'c'],
//             description: 'Detailed street map',
//             maxZoom: 19
//         },
//         Satellite: {
//             name: 'Satellite',
//             url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//             subdomains: [],
//             description: 'Satellite imagery',
//             maxZoom: 18
//         }
//     };

//     const latLonToTile = (lat, lon, z) => {
//         const n = Math.pow(2, z);
//         const x = Math.floor((lon + 180) / 360 * n);
//         const latRad = lat * Math.PI / 180;
//         const y = Math.floor((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2 * n);
//         return { x, y };
//     };

//     const tileToPixel = (tileX, tileY, centerTile, z, containerWidth, containerHeight) => {
//         const scale = Math.pow(2, z);

//         const centerLon = center.lon;
//         const centerLat = center.lat;

//         const centerX = (centerLon + 180) / 360 * 256 * scale;
//         const centerY = (1 - Math.log(Math.tan(centerLat * Math.PI / 180) + 1 / Math.cos(centerLat * Math.PI / 180)) / Math.PI) / 2 * 256 * scale;

//         const tilePixelX = tileX * 256;
//         const tilePixelY = tileY * 256;

//         const screenX = containerWidth / 2 + (tilePixelX - centerX);
//         const screenY = containerHeight / 2 + (tilePixelY - centerY);

//         return { x: screenX, y: screenY };
//     };

//     const updateTiles = () => {
//         if (!containerRef.current) return;

//         const container = containerRef.current;
//         const width = container.clientWidth;
//         const height = container.clientHeight;

//         const z = Math.floor(zoom);
//         const maxZoom = layers[layer].maxZoom;
//         const actualZoom = Math.min(z, maxZoom);

//         const centerTile = latLonToTile(center.lat, center.lon, actualZoom);
//         const maxTiles = Math.pow(2, actualZoom);

//         // Calculate number of tiles needed with buffer
//         const tilesX = Math.ceil(width / 256) + 3;
//         const tilesY = Math.ceil(height / 256) + 3;

//         const newTiles = [];

//         for (let dy = -tilesY; dy <= tilesY; dy++) {
//             for (let dx = -tilesX; dx <= tilesX; dx++) {
//                 let tx = centerTile.x + dx;
//                 const ty = centerTile.y + dy;

//                 // Wrap X coordinate
//                 tx = ((tx % maxTiles) + maxTiles) % maxTiles;

//                 if (ty >= 0 && ty < maxTiles) {
//                     const pos = tileToPixel(tx, ty, centerTile, actualZoom, width, height);

//                     // Only add tiles that are at least partially visible (with buffer)
//                     if (pos.x > -512 && pos.x < width + 256 && pos.y > -512 && pos.y < height + 256) {
//                         // Select subdomain for load balancing
//                         const subdomains = layers[layer].subdomains;
//                         const subdomain = subdomains.length > 0
//                             ? subdomains[(tx + ty) % subdomains.length]
//                             : '';

//                         const url = layers[layer].url
//                             .replace('{s}', subdomain)
//                             .replace('{z}', actualZoom)
//                             .replace('{x}', tx)
//                             .replace('{y}', ty);

//                         const key = `${layer}-${actualZoom}-${tx}-${ty}`;

//                         newTiles.push({
//                             key,
//                             url,
//                             x: pos.x,
//                             y: pos.y,
//                             tileX: tx,
//                             tileY: ty
//                         });
//                     }
//                 }
//             }
//         }

//         setTiles(newTiles);
//     };

//     useEffect(() => {
//         updateTiles();
//     }, [zoom, center, layer]);

//     useEffect(() => {
//         const handleResize = () => updateTiles();
//         window.addEventListener('resize', handleResize);
//         return () => window.removeEventListener('resize', handleResize);
//     }, [zoom, center, layer]);

//     const handleZoomIn = () => {
//         setZoom(prev => Math.min(prev + 1, layers[layer].maxZoom));
//     };

//     const handleZoomOut = () => {
//         setZoom(prev => Math.max(prev - 1, 1));
//     };

//     const handleReset = () => {
//         setZoom(3);
//         setCenter({ lat: 20, lon: 0 });
//     };

//     const handleMouseDown = (e) => {
//         e.preventDefault();
//         setIsDragging(true);
//         setDragStart({
//             x: e.clientX,
//             y: e.clientY,
//             lat: center.lat,
//             lon: center.lon
//         });
//     };

//     const handleMouseMove = (e) => {
//         if (!isDragging) return;

//         const dx = e.clientX - dragStart.x;
//         const dy = e.clientY - dragStart.y;

//         const z = Math.floor(zoom);
//         const scale = Math.pow(2, z);

//         const latChange = -(dy / 256) * (360 / scale);
//         const lonChange = -(dx / 256) * (360 / scale);

//         let newLat = dragStart.lat + latChange;
//         let newLon = dragStart.lon + lonChange;

//         newLat = Math.max(-85, Math.min(85, newLat));

//         while (newLon > 180) newLon -= 360;
//         while (newLon < -180) newLon += 360;

//         setCenter({ lat: newLat, lon: newLon });
//     };

//     const handleMouseUp = () => {
//         setIsDragging(false);
//     };

//     const handleWheel = (e) => {
//         e.preventDefault();
//         const delta = e.deltaY > 0 ? -0.5 : 0.5;
//         const maxZoom = layers[layer].maxZoom;
//         setZoom(prev => Math.max(1, Math.min(maxZoom, prev + delta)));
//     };

//     const handleTouchStart = (e) => {
//         if (e.touches.length === 1) {
//             setIsDragging(true);
//             setDragStart({
//                 x: e.touches[0].clientX,
//                 y: e.touches[0].clientY,
//                 lat: center.lat,
//                 lon: center.lon
//             });
//         }
//     };

//     const handleTouchMove = (e) => {
//         if (!isDragging || e.touches.length !== 1) return;
//         e.preventDefault();

//         const dx = e.touches[0].clientX - dragStart.x;
//         const dy = e.touches[0].clientY - dragStart.y;

//         const z = Math.floor(zoom);
//         const scale = Math.pow(2, z);

//         const latChange = -(dy / 256) * (360 / scale);
//         const lonChange = -(dx / 256) * (360 / scale);

//         let newLat = dragStart.lat + latChange;
//         let newLon = dragStart.lon + lonChange;

//         newLat = Math.max(-85, Math.min(85, newLat));

//         while (newLon > 180) newLon -= 360;
//         while (newLon < -180) newLon += 360;

//         setCenter({ lat: newLat, lon: newLon });
//     };

//     const handleTouchEnd = () => {
//         setIsDragging(false);
//     };

//     return (
//         <div className="relative w-full h-screen overflow-hidden select-none">
//             {/* Map Container */}
//             <div
//                 ref={containerRef}
//                 className="absolute inset-0 overflow-hidden"
//                 style={{
//                     cursor: isDragging ? 'grabbing' : 'grab',
//                     backgroundColor: layer === 'Dark' ? '#0a0a0a' : '#a8dadc'
//                 }}
//                 onMouseDown={handleMouseDown}
//                 onMouseMove={handleMouseMove}
//                 onMouseUp={handleMouseUp}
//                 onMouseLeave={handleMouseUp}
//                 onWheel={handleWheel}
//                 onTouchStart={handleTouchStart}
//                 onTouchMove={handleTouchMove}
//                 onTouchEnd={handleTouchEnd}
//             >
//                 {/* Tiles */}
//                 {tiles.map(tile => (
//                     <img
//                         key={tile.key}
//                         src={tile.url}
//                         alt=""
//                         className="absolute pointer-events-none"
//                         style={{
//                             left: `${tile.x}px`,
//                             top: `${tile.y}px`,
//                             width: '256px',
//                             height: '256px',
//                             willChange: 'transform',
//                             imageRendering: zoom % 1 !== 0 ? 'auto' : 'crisp-edges'
//                         }}
//                         loading="lazy"
//                         draggable={false}
//                     />
//                 ))}

//                 {/* Crosshair */}
//                 <div
//                     className="absolute top-1/2 left-1/2 pointer-events-none"
//                     style={{
//                         transform: 'translate(-50%, -50%)',
//                         opacity: 0.5
//                     }}
//                 >
//                     <div className={`w-8 h-0.5 ${layer === 'Dark' ? 'bg-white' : 'bg-black'}`} style={{ marginBottom: '1px' }}></div>
//                     <div className={`h-8 w-0.5 ${layer === 'Dark' ? 'bg-white' : 'bg-black'} mx-auto`}></div>
//                 </div>
//             </div>

//             {/* Header */}
//             <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4 pointer-events-none">
//                 <div className="flex items-center gap-3">
//                     <Globe className="w-8 h-8 text-blue-400" />
//                     <div>
//                         <h1 className="text-2xl font-bold text-white">Interactive Earth Map</h1>
//                         <p className="text-sm text-gray-300">GPU-accelerated • Ultra smooth</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Controls */}
//             <div className="absolute top-24 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
//                 <button
//                     onClick={handleZoomIn}
//                     className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Zoom In"
//                 >
//                     <ZoomIn className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleZoomOut}
//                     className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Zoom Out"
//                 >
//                     <ZoomOut className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleReset}
//                     className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Reset View"
//                 >
//                     <Maximize2 className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={() => setShowInfo(!showInfo)}
//                     className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Toggle Info"
//                 >
//                     <Info className="w-5 h-5 text-gray-800" />
//                 </button>
//             </div>

//             {/* Layer Selector */}
//             <div className="absolute top-24 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 pointer-events-auto">
//                 <div className="flex items-center gap-2 mb-2">
//                     <Layers className="w-5 h-5 text-gray-800" />
//                     <span className="font-semibold text-gray-800">Layers</span>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                     {Object.entries(layers).map(([key, value]) => (
//                         <button
//                             key={key}
//                             onClick={() => setLayer(key)}
//                             className={`px-3 py-2 rounded text-sm transition text-left active:scale-95 ${layer === key
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                                 }`}
//                         >
//                             <div className="font-medium">{value.name}</div>
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Info Panel */}
//             {showInfo && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4 pointer-events-none">
//                     <div className="max-w-4xl mx-auto">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2">
//                             <div>
//                                 <p className="text-xs text-gray-400">Latitude</p>
//                                 <p className="font-mono text-lg">{center.lat.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Longitude</p>
//                                 <p className="font-mono text-lg">{center.lon.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Zoom Level</p>
//                                 <p className="font-mono text-lg">{zoom.toFixed(1)}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Map Style</p>
//                                 <p className="text-lg">{layers[layer].name}</p>
//                             </div>
//                         </div>
//                         <p className="text-xs text-gray-400 mt-2">
//                             Drag to pan • Scroll to zoom • {tiles.length} tiles loaded
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


//Version 7
// import React, { useState, useEffect, useRef } from 'react';
// import { ZoomIn, ZoomOut, Maximize2, Layers, Info, Globe, Home } from 'lucide-react';

// export default function NasaEarthMapViewer() {
//     const [showInfo, setShowInfo] = useState(true);
//     const [layer, setLayer] = useState('CartoDB');
//     const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0, zoom: 2 });
//     const viewerRef = useRef(null);
//     const containerRef = useRef(null);
//     const osdInstance = useRef(null);

//     const layers = {
//         CartoDB: {
//             name: 'Light Map',
//             url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
//             description: 'Clean, fast-loading map',
//             maxZoom: 19
//         },
//         Dark: {
//             name: 'Dark Mode',
//             url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
//             description: 'Dark themed map',
//             maxZoom: 19
//         },
//         OpenStreetMap: {
//             name: 'OpenStreetMap',
//             url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//             description: 'Detailed street map',
//             maxZoom: 19
//         },
//         Satellite: {
//             name: 'Satellite',
//             url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//             description: 'Satellite imagery',
//             maxZoom: 18
//         }
//     };

//     useEffect(() => {
//         // Load OpenSeadragon script
//         const script = document.createElement('script');
//         script.src = 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/openseadragon.min.js';
//         script.async = true;

//         script.onload = () => {
//             initializeViewer();
//         };

//         document.head.appendChild(script);

//         return () => {
//             if (osdInstance.current) {
//                 osdInstance.current.destroy();
//             }
//             if (script.parentNode) {
//                 document.head.removeChild(script);
//             }
//         };
//     }, []);

//     const initializeViewer = () => {
//         if (!window.OpenSeadragon || !containerRef.current) return;

//         // Custom tile source for web maps
//         const CustomTileSource = function (options) {
//             window.OpenSeadragon.TileSource.apply(this, [options]);
//         };

//         CustomTileSource.prototype = Object.create(window.OpenSeadragon.TileSource.prototype);
//         CustomTileSource.prototype.constructor = CustomTileSource;

//         CustomTileSource.prototype.configure = function (data, url) {
//             return data;
//         };

//         CustomTileSource.prototype.supports = function (data, url) {
//             return data.type === 'customtilesource';
//         };

//         CustomTileSource.prototype.getTileUrl = function (level, x, y) {
//             const maxTiles = Math.pow(2, level);

//             // Wrap x coordinate for continuous horizontal scrolling
//             x = ((x % maxTiles) + maxTiles) % maxTiles;

//             // Check if y is out of bounds
//             if (y < 0 || y >= maxTiles) {
//                 return null;
//             }

//             const subdomains = ['a', 'b', 'c', 'd'];
//             const subdomain = subdomains[(x + y) % subdomains.length];

//             return layers[layer].url
//                 .replace('{s}', subdomain)
//                 .replace('{z}', level)
//                 .replace('{x}', x)
//                 .replace('{y}', y);
//         };

//         const viewer = window.OpenSeadragon({
//             element: containerRef.current,
//             prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/',
//             tileSources: {
//                 type: 'customtilesource',
//                 height: 256 * Math.pow(2, layers[layer].maxZoom),
//                 width: 256 * Math.pow(2, layers[layer].maxZoom),
//                 tileSize: 256,
//                 minLevel: 0,
//                 maxLevel: layers[layer].maxZoom,
//                 getTileUrl: CustomTileSource.prototype.getTileUrl
//             },
//             showNavigationControl: false,
//             showFullPageControl: false,
//             defaultZoomLevel: 2,
//             minZoomLevel: 1,
//             maxZoomLevel: layers[layer].maxZoom,
//             visibilityRatio: 0.5,
//             constrainDuringPan: false,
//             wrapHorizontal: true,
//             wrapVertical: false,
//             animationTime: 0.3,
//             springStiffness: 10,
//             immediateRender: false,
//             blendTime: 0.1,
//             alwaysBlend: false,
//             smoothTileEdgesMinZoom: 5,
//             crossOriginPolicy: 'Anonymous',
//             ajaxWithCredentials: false,
//             loadTilesWithAjax: false,
//             timeout: 120000,
//             gestureSettingsMouse: {
//                 scrollToZoom: true,
//                 clickToZoom: false,
//                 dblClickToZoom: false,
//                 pinchToZoom: true,
//                 flickEnabled: true,
//                 flickMinSpeed: 40,
//                 flickMomentum: 0.4
//             },
//             gestureSettingsTouch: {
//                 scrollToZoom: false,
//                 clickToZoom: false,
//                 dblClickToZoom: true,
//                 pinchToZoom: true,
//                 flickEnabled: true,
//                 flickMinSpeed: 40,
//                 flickMomentum: 0.4
//             }
//         });

//         // Update coordinates on viewport change
//         viewer.addHandler('viewport-change', () => {
//             updateCoordinates(viewer);
//         });

//         // Initial coordinate update
//         viewer.addHandler('open', () => {
//             updateCoordinates(viewer);
//         });

//         osdInstance.current = viewer;
//         viewerRef.current = viewer;
//     };

//     const updateCoordinates = (viewer) => {
//         if (!viewer) return;

//         const viewport = viewer.viewport;
//         const center = viewport.getCenter();
//         const zoom = viewport.getZoom();

//         // Convert OpenSeadragon coordinates to lat/lon
//         const imageSize = viewer.world.getItemAt(0).getContentSize();
//         const maxTileLevel = layers[layer].maxZoom;
//         const scale = Math.pow(2, maxTileLevel);

//         // Normalize coordinates
//         const x = center.x * imageSize.x;
//         const y = center.y * imageSize.y;

//         // Convert to lat/lon
//         const lon = (x / (256 * scale)) * 360 - 180;
//         const n = Math.PI - 2 * Math.PI * y / (256 * scale);
//         const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

//         // Calculate zoom level
//         const osdZoom = viewport.getZoom(true);
//         const worldSize = imageSize.x;
//         const containerWidth = viewer.container.clientWidth;
//         const tilesAcross = worldSize * osdZoom / containerWidth;
//         const zoomLevel = Math.log2(tilesAcross * 256);

//         setCoordinates({
//             lat: isNaN(lat) ? 0 : lat,
//             lon: isNaN(lon) ? 0 : lon,
//             zoom: isNaN(zoomLevel) ? 0 : zoomLevel
//         });
//     };

//     useEffect(() => {
//         if (osdInstance.current) {
//             // Rebuild viewer with new layer
//             osdInstance.current.destroy();
//             initializeViewer();
//         }
//     }, [layer]);

//     const handleZoomIn = () => {
//         if (osdInstance.current) {
//             const viewport = osdInstance.current.viewport;
//             viewport.zoomBy(1.5);
//             viewport.applyConstraints();
//         }
//     };

//     const handleZoomOut = () => {
//         if (osdInstance.current) {
//             const viewport = osdInstance.current.viewport;
//             viewport.zoomBy(0.66);
//             viewport.applyConstraints();
//         }
//     };

//     const handleReset = () => {
//         if (osdInstance.current) {
//             osdInstance.current.viewport.goHome();
//         }
//     };

//     return (
//         <div className="relative w-full h-screen overflow-hidden select-none bg-gray-900">
//             {/* OpenSeadragon Container */}
//             <div
//                 ref={containerRef}
//                 className="absolute inset-0"
//                 style={{
//                     backgroundColor: layer === 'Dark' ? '#0a0a0a' : '#a8dadc'
//                 }}
//             />

//             {/* Header */}
//             <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4 pointer-events-none">
//                 <div className="flex items-center gap-3">
//                     <Globe className="w-8 h-8 text-blue-400" />
//                     <div>
//                         <h1 className="text-2xl font-bold text-white">Interactive Earth Map</h1>
//                         <p className="text-sm text-gray-300">Powered by OpenSeadragon • Silky smooth</p>
//                     </div>
//                 </div>
//             </div>

//             {/* Controls */}
//             <div className="absolute top-24 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
//                 <button
//                     onClick={handleZoomIn}
//                     className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Zoom In"
//                 >
//                     <ZoomIn className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={handleZoomOut}
//                     className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Zoom Out"
//                 >
//                     <ZoomOut className="w-5 h-5 text-gray-800" />
// import React, { useState, useEffect, useRef } from 'react';
// import OpenSeadragon from 'openseadragon';
// import { ZoomIn, ZoomOut, Maximize2, Layers, Info, Globe, Home, Loader2, MapPin, X, Save } from 'lucide-react';

// export default function NasaEarthViewer() {
//     const [showInfo, setShowInfo] = useState(true);
//     const [layer, setLayer] = useState('CartoDB');
//     const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0, zoom: 2 });
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [debugInfo, setDebugInfo] = useState('Initializing...');
//     const [annotations, setAnnotations] = useState([]);
//     const [showAnnotationForm, setShowAnnotationForm] = useState(false);
//     const [currentAnnotation, setCurrentAnnotation] = useState(null);
//     const [annotationText, setAnnotationText] = useState('');
//     const [showAnnotations, setShowAnnotations] = useState(true);
    
//     const viewerRef = useRef(null);
//     const osdInstance = useRef(null);
//     const overlayContainerRef = useRef(null);

//     const layers = {
//         CartoDB: {
//             name: 'Light Map',
//             url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
//             description: 'Clean, fast-loading map',
//             maxZoom: 19
//         },
//         Dark: {
//             name: 'Dark Mode',
//             url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
//             description: 'Dark themed map',
//             maxZoom: 19
//         },
//         OpenStreetMap: {
//             name: 'OpenStreetMap',
//             url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
//             description: 'Detailed street map',
//             maxZoom: 19
//         },
//         Satellite: {
//             name: 'Satellite',
//             url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//             description: 'Satellite imagery',
//             maxZoom: 18
//         }
//     };

//     // Load annotations from state (simulating localStorage)
//     const loadAnnotations = () => {
//         // In a real app with localStorage:
//         // const saved = localStorage.getItem(`annotations_${layer}`);
//         // return saved ? JSON.parse(saved) : [];
        
//         // Using state instead since localStorage isn't available in artifacts
//         return annotations.filter(a => a.layer === layer);
//     };

//     // Save annotations to state (simulating localStorage)
//     const saveAnnotations = (newAnnotations) => {
//         // In a real app with localStorage:
//         // localStorage.setItem(`annotations_${layer}`, JSON.stringify(newAnnotations));
        
//         // Remove old annotations for this layer and add new ones
//         const otherLayerAnnotations = annotations.filter(a => a.layer !== layer);
//         setAnnotations([...otherLayerAnnotations, ...newAnnotations]);
//     };

//     const initializeViewer = () => {
//         setDebugInfo('Creating viewer...');

//         if (!viewerRef.current) {
//             console.error('Container ref not ready');
//             setError('Container not ready');
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const maxLevel = layers[layer].maxZoom;
//             const size = Math.pow(2, maxLevel);

//             const tileSource = {
//                 width: size,
//                 height: size,
//                 tileSize: 256,
//                 minLevel: 0,
//                 maxLevel: maxLevel,
//                 getTileUrl: function(level, x, y) {
//                     const maxTiles = Math.pow(2, level);
//                     x = ((x % maxTiles) + maxTiles) % maxTiles;
                    
//                     if (y < 0 || y >= maxTiles) {
//                         return null;
//                     }
                    
//                     return layers[layer].url
//                         .replace('{z}', level)
//                         .replace('{x}', x)
//                         .replace('{y}', y);
//                 }
//             };

//             const viewer = OpenSeadragon({
//                 element: viewerRef.current,
//                 prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/',
//                 tileSources: tileSource,
//                 showNavigationControl: false,
//                 showFullPageControl: false,
//                 defaultZoomLevel: 0,
//                 minZoomLevel: 0,
//                 maxZoomLevel: maxLevel - 8,
//                 visibilityRatio: 1,
//                 constrainDuringPan: false,
//                 wrapHorizontal: true,
//                 wrapVertical: false,
//                 animationTime: 0.5,
//                 springStiffness: 7,
//                 immediateRender: false,
//                 blendTime: 0.2,
//                 alwaysBlend: false,
//                 placeholderFillStyle: layer === 'Dark' ? '#1a1a1a' : '#d0d0d0',
//                 gestureSettingsMouse: {
//                     scrollToZoom: true,
//                     clickToZoom: false,
//                     dblClickToZoom: false,
//                     pinchToZoom: true,
//                     flickEnabled: true,
//                     flickMinSpeed: 40,
//                     flickMomentum: 0.4
//                 },
//                 gestureSettingsTouch: {
//                     scrollToZoom: false,
//                     clickToZoom: false,
//                     dblClickToZoom: true,
//                     pinchToZoom: true,
//                     flickEnabled: true,
//                     flickMinSpeed: 40,
//                     flickMomentum: 0.4
//                 }
//             });

//             viewer.addHandler('open', () => {
//                 console.log('Viewer opened successfully!');
//                 setDebugInfo('Viewer opened - Loading tiles');
//                 setIsLoading(false);
                
//                 setTimeout(() => {
//                     viewer.viewport.fitBounds(new OpenSeadragon.Rect(0, 0, 1, 1));
//                     updateCoordinates(viewer);
//                     renderAnnotations(viewer);
//                 }, 100);
//             });

//             viewer.addHandler('open-failed', (event) => {
//                 console.error('Viewer open failed:', event);
//                 setError('Failed to open map viewer');
//                 setIsLoading(false);
//             });

//             viewer.addHandler('viewport-change', () => {
//                 updateCoordinates(viewer);
//             });

//             // Handle right-click for annotations
//             viewer.addHandler('canvas-contextmenu', (event) => {
//                 event.preventDefaultAction = true;
//                 handleRightClick(event, viewer);
//             });

//             osdInstance.current = viewer;
//             setDebugInfo('Viewer initialized');

//         } catch (e) {
//             console.error('Error initializing viewer:', e);
//             setError(`Initialization error: ${e.message}`);
//             setIsLoading(false);
//         }
//     };

//     const handleRightClick = (event, viewer) => {
//         const viewportPoint = viewer.viewport.pointFromPixel(event.position);
//         const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
        
//         setCurrentAnnotation({
//             x: imagePoint.x,
//             y: imagePoint.y,
//             layer: layer,
//             id: Date.now()
//         });
//         setAnnotationText('');
//         setShowAnnotationForm(true);
//     };

//     const saveAnnotation = () => {
//         if (!annotationText.trim() || !currentAnnotation) return;

//         const newAnnotation = {
//             ...currentAnnotation,
//             text: annotationText,
//             timestamp: new Date().toISOString()
//         };

//         const currentAnnotations = loadAnnotations();
//         const updatedAnnotations = [...currentAnnotations, newAnnotation];
//         saveAnnotations(updatedAnnotations);

//         setShowAnnotationForm(false);
//         setCurrentAnnotation(null);
//         setAnnotationText('');

//         if (osdInstance.current) {
//             renderAnnotations(osdInstance.current);
//         }
//     };

//     const deleteAnnotation = (annotationId) => {
//         const currentAnnotations = loadAnnotations();
//         const updatedAnnotations = currentAnnotations.filter(a => a.id !== annotationId);
//         saveAnnotations(updatedAnnotations);

//         if (osdInstance.current) {
//             renderAnnotations(osdInstance.current);
//         }
//     };

//     const renderAnnotations = (viewer) => {
//         if (!viewer || !showAnnotations) return;

//         // Remove existing overlays
//         viewer.clearOverlays();

//         const currentAnnotations = loadAnnotations();

//         currentAnnotations.forEach(annotation => {
//             const element = document.createElement('div');
//             element.className = 'annotation-marker';
//             element.innerHTML = `
//                 <div class="relative group">
//                     <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-red-600 transition">
//                         <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                         </svg>
//                     </div>
//                     <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//                         <div class="bg-black/90 text-white text-sm rounded px-3 py-2 whitespace-nowrap shadow-lg max-w-xs">
//                             ${annotation.text}
//                         </div>
//                     </div>
//                 </div>
//             `;

//             // Add delete button
//             element.querySelector('.annotation-marker').addEventListener('click', (e) => {
//                 e.stopPropagation();
//                 if (confirm('Delete this annotation?')) {
//                     deleteAnnotation(annotation.id);
//                 }
//             });

//             const location = new OpenSeadragon.Point(annotation.x, annotation.y);
//             viewer.addOverlay({
//                 element: element,
//                 location: location,
//                 placement: OpenSeadragon.Placement.CENTER
//             });
//         });
//     };

//     const updateCoordinates = (viewer) => {
//         if (!viewer || !viewer.viewport || !viewer.world.getItemCount()) return;

//         try {
//             const viewport = viewer.viewport;
//             const center = viewport.getCenter();
//             const zoom = viewport.getZoom();
//             const imageSize = viewer.world.getItemAt(0).getContentSize();

//             const x = center.x * imageSize.x;
//             const y = center.y * imageSize.y;

//             const maxLevel = layers[layer].maxZoom;
//             const scale = Math.pow(2, maxLevel);

//             const lon = (x / scale) * 360 - 180;
//             const n = Math.PI - 2 * Math.PI * y / scale;
//             const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

//             const containerWidth = viewer.container.clientWidth;
//             const worldWidth = imageSize.x * zoom;
//             const tilesAcross = worldWidth / 256;
//             const zoomLevel = Math.log2(tilesAcross * 256);

//             setCoordinates({
//                 lat: isFinite(lat) ? lat : 0,
//                 lon: isFinite(lon) ? lon : 0,
//                 zoom: isFinite(zoomLevel) ? zoomLevel : 2
//             });
//         } catch (e) {
//             console.error('Error updating coordinates:', e);
//         }
//     };

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             initializeViewer();
//         }, 100);

//         return () => {
//             clearTimeout(timer);
//             if (osdInstance.current) {
//                 try {
//                     osdInstance.current.destroy();
//                 } catch (e) {
//                     console.error('Error destroying viewer:', e);
//                 }
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (osdInstance.current && !isLoading) {
//             osdInstance.current.destroy();
//             setIsLoading(true);
//             setDebugInfo('Switching layers...');
//             setTimeout(() => initializeViewer(), 200);
//         }
//     }, [layer]);

//     useEffect(() => {
//         if (osdInstance.current) {
//             renderAnnotations(osdInstance.current);
//         }
//     }, [showAnnotations]);

//     const handleZoomIn = () => {
//         if (osdInstance.current) {
//             osdInstance.current.viewport.zoomBy(2);
//         }
//     };

//     const handleZoomOut = () => {
//         if (osdInstance.current) {
//             osdInstance.current.viewport.zoomBy(0.5);
//         }
//     };

//     const handleReset = () => {
//         if (osdInstance.current) {
//             osdInstance.current.viewport.goHome();
//         }
//     };

//     const exportAnnotations = () => {
//         const dataStr = JSON.stringify(annotations, null, 2);
//         const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//         const exportFileDefaultName = `annotations_${new Date().toISOString()}.json`;
        
//         const linkElement = document.createElement('a');
//         linkElement.setAttribute('href', dataUri);
//         linkElement.setAttribute('download', exportFileDefaultName);
//         linkElement.click();
//     };

//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-900">
//                 <div className="text-center text-white max-w-lg">
//                     <p className="text-xl mb-4">Error: {error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
//                     >
//                         Reload Page
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="relative w-full h-screen overflow-hidden select-none bg-gray-900">
//             {isLoading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
//                     <div className="text-center text-white">
//                         <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-400" />
//                         <p className="text-xl">Loading Earth Map...</p>
//                         <p className="text-sm text-gray-400 mt-2">{debugInfo}</p>
//                     </div>
//                 </div>
//             )}

//             <div
//                 ref={viewerRef}
//                 className="absolute inset-0"
//                 style={{
//                     backgroundColor: layer === 'Dark' ? '#0a0a0a' : '#a8dadc',
//                     width: '100%',
//                     height: '100%'
//                 }}
//             />

//             {/* Annotation Form Modal */}
//             {showAnnotationForm && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
//                     <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                                 <MapPin className="w-5 h-5" />
//                                 Add Annotation
//                             </h3>
//                             <button
//                                 onClick={() => setShowAnnotationForm(false)}
//                                 className="text-gray-500 hover:text-gray-700"
//                             >
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>
//                         <textarea
//                             value={annotationText}
//                             onChange={(e) => setAnnotationText(e.target.value)}
//                             placeholder="Enter annotation text..."
//                             className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
//                             autoFocus
//                         />
//                         <div className="flex gap-2 mt-4">
//                             <button
//                                 onClick={saveAnnotation}
//                                 disabled={!annotationText.trim()}
//                                 className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
//                             >
//                                 <Save className="w-4 h-4" />
//                                 Save
//                             </button>
//                             <button
//                                 onClick={() => setShowAnnotationForm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Header */}
//             <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4 pointer-events-none">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <Globe className="w-8 h-8 text-blue-400" />
//                         <div>
//                             <h1 className="text-2xl font-bold text-white">Interactive Earth Map</h1>
//                             <p className="text-sm text-gray-300">Right-click to annotate • {loadAnnotations().length} annotations</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={exportAnnotations}
//                         className="pointer-events-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-2"
//                     >
//                         <Save className="w-4 h-4" />
//                         Export
//                     </button>
//                 </div>
//             </div>

//             {/* Controls */}
//             {!isLoading && (
//                 <div className="absolute top-24 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
//                     <button
//                         onClick={handleZoomIn}
//                         className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                         title="Zoom In"
//                     >
//                         <ZoomIn className="w-5 h-5 text-gray-800" />
//                     </button>
//                     <button
//                         onClick={handleZoomOut}
//                         className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                         title="Zoom Out"
//                     >
//                         <ZoomOut className="w-5 h-5 text-gray-800" />
//                     </button>
//                     <button
//                         onClick={handleReset}
//                         className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                         title="Reset to Home"
//                     >
//                         <Home className="w-5 h-5 text-gray-800" />
//                     </button>
//                     <button
//                         onClick={() => setShowAnnotations(!showAnnotations)}
//                         className={`p-3 rounded-lg shadow-lg transition active:scale-95 ${
//                             showAnnotations 
//                                 ? 'bg-blue-600 text-white hover:bg-blue-700' 
//                                 : 'bg-white/95 backdrop-blur-sm hover:bg-white'
//                         }`}
//                         title="Toggle Annotations"
//                     >
//                         <MapPin className={`w-5 h-5 ${showAnnotations ? 'text-white' : 'text-gray-800'}`} />
//                     </button>
//                     <button
//                         onClick={() => setShowInfo(!showInfo)}
//                         className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                         title="Toggle Info"
//                     >
//                         <Info className="w-5 h-5 text-gray-800" />
//                     </button>
//                 </div>
//             )}

//             {/* Layer Selector */}
//             {!isLoading && (
//                 <div className="absolute top-24 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 pointer-events-auto">
//                     <div className="flex items-center gap-2 mb-2">
//                         <Layers className="w-5 h-5 text-gray-800" />
//                         <span className="font-semibold text-gray-800">Layers</span>
//                     </div>
//                     <div className="flex flex-col gap-1">
//                         {Object.entries(layers).map(([key, value]) => (
//                             <button
//                                 key={key}
//                                 onClick={() => setLayer(key)}
//                                 disabled={layer === key}
//                                 className={`px-3 py-2 rounded text-sm transition text-left active:scale-95 ${
//                                     layer === key
//                                         ? 'bg-blue-600 text-white cursor-default'
//                                         : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 <div className="font-medium">{value.name}</div>
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Info Panel */}
//             {showInfo && !isLoading && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4 pointer-events-none">
//                     <div className="max-w-4xl mx-auto">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2">
//                             <div>
//                                 <p className="text-xs text-gray-400">Latitude</p>
//                                 <p className="font-mono text-lg">{coordinates.lat.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Longitude</p>
//                                 <p className="font-mono text-lg">{coordinates.lon.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Zoom Level</p>
//                                 <p className="font-mono text-lg">{coordinates.zoom.toFixed(1)}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Annotations</p>
//                                 <p className="text-lg">{loadAnnotations().length} on this layer</p>
//                             </div>
//                         </div>
//                         <p className="text-xs text-gray-400 mt-2">
//                             Drag to pan • Scroll to zoom • Right-click to add annotation
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }                </button>
//                 <button
//                     onClick={handleReset}
//                     className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Reset to Home"
//                 >
//                     <Home className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button
//                     onClick={() => setShowInfo(!showInfo)}
//                     className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                     title="Toggle Info"
//                 >
//                     <Info className="w-5 h-5 text-gray-800" />
//                 </button>
//             </div>

//             {/* Layer Selector */}
//             <div className="absolute top-24 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 pointer-events-auto">
//                 <div className="flex items-center gap-2 mb-2">
//                     <Layers className="w-5 h-5 text-gray-800" />
//                     <span className="font-semibold text-gray-800">Layers</span>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                     {Object.entries(layers).map(([key, value]) => (
//                         <button
//                             key={key}
//                             onClick={() => setLayer(key)}
//                             className={`px-3 py-2 rounded text-sm transition text-left active:scale-95 ${layer === key
//                                     ? 'bg-blue-600 text-white'
//                                     : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                                 }`}
//                         >
//                             <div className="font-medium">{value.name}</div>
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Info Panel */}
//             {showInfo && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4 pointer-events-none">
//                     <div className="max-w-4xl mx-auto">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2">
//                             <div>
//                                 <p className="text-xs text-gray-400">Latitude</p>
//                                 <p className="font-mono text-lg">{coordinates.lat.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Longitude</p>
//                                 <p className="font-mono text-lg">{coordinates.lon.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Zoom Level</p>
//                                 <p className="font-mono text-lg">{coordinates.zoom.toFixed(1)}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Map Style</p>
//                                 <p className="text-lg">{layers[layer].name}</p>
//                             </div>
//                         </div>
//                         <p className="text-xs text-gray-400 mt-2">
//                             Drag to pan • Scroll to zoom • Optimized tile loading with OpenSeadragon
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// //V8
// import React, { useState, useEffect, useRef } from 'react';
// import OpenSeadragon from 'openseadragon';
// import { ZoomIn, ZoomOut, Home, Layers, Info, Globe, Loader2 } from 'lucide-react';

// export default function NasaEarthViewer() {
//     const viewerRef = useRef(null);
//     const osdInstance = useRef(null);

//     const [isLoading, setIsLoading] = useState(true);
//     const [layer, setLayer] = useState('CartoDB');
//     const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0, zoom: 2 });
//     const [showInfo, setShowInfo] = useState(true);

//     const layers = {
//         CartoDB: {
//             name: 'Light Map',
//             url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
//             maxZoom: 19,
//         },
//         Dark: {
//             name: 'Dark Map',
//             url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
//             maxZoom: 19,
//         },
//         OpenStreetMap: {
//             name: 'OpenStreetMap',
//             url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
//             maxZoom: 19,
//         },
//         Satellite: {
//             name: 'Satellite',
//             url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//             maxZoom: 18,
//         },
//     };

//     // Generate tileSource for a layer
//     const getTileSource = (layerName) => ({
//         width: 256,
//         height: 256,
//         tileSize: 256,
//         minLevel: 0,
//         maxLevel: layers[layerName].maxZoom,
//         getTileUrl: (level, x, y) => {
//             const maxTiles = Math.pow(2, level);
//             x = ((x % maxTiles) + maxTiles) % maxTiles;
//             if (y < 0 || y >= maxTiles) return null;
//             return layers[layerName].url
//                 .replace('{z}', level)
//                 .replace('{x}', x)
//                 .replace('{y}', y);
//         },
//     });

//     const updateCoordinates = (viewer) => {
//         if (!viewer || !viewer.viewport || !viewer.world.getItemCount()) return;

//         const viewport = viewer.viewport;
//         const center = viewport.getCenter();
//         const zoom = viewport.getZoom();
//         const imageSize = viewer.world.getItemAt(0).getContentSize();

//         const x = center.x * imageSize.x;
//         const y = center.y * imageSize.y;
//         const maxLevel = layers[layer].maxZoom;
//         const scale = Math.pow(2, maxLevel);
//         const lon = (x / scale) * 360 - 180;
//         const n = Math.PI - 2 * Math.PI * y / scale;
//         const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

//         setCoordinates({
//             lat: isFinite(lat) ? lat : 0,
//             lon: isFinite(lon) ? lon : 0,
//             zoom: isFinite(zoom) ? zoom : 2,
//         });
//     };

//     useEffect(() => {
//         if (!viewerRef.current) return;

//         const viewer = OpenSeadragon({
//             element: viewerRef.current,
//             prefixUrl: '/openseadragon/images/',
//             tileSources: getTileSource(layer),
//             showNavigationControl: false,
//             wrapHorizontal: true,
//             wrapVertical: false,
//             animationTime: 0.5,
//             constrainDuringPan: false,
//             crossOriginPolicy: 'Anonymous', // CORS safe
//             ajaxWithCredentials: false,
//         });

//         osdInstance.current = viewer;

//         viewer.addHandler('open', () => {
//             viewer.viewport.goHome();
//             setIsLoading(false);
//             updateCoordinates(viewer);
//         });

//         viewer.addHandler('viewport-change', () => updateCoordinates(viewer));

//         return () => osdInstance.current?.destroy();
//     }, []);

//     // Layer switching
//     useEffect(() => {
//         if (!osdInstance.current) return;
//         setIsLoading(true);
//         osdInstance.current.open(getTileSource(layer));
//     }, [layer]);

//     const handleZoomIn = () => osdInstance.current?.viewport.zoomBy(2);
//     const handleZoomOut = () => osdInstance.current?.viewport.zoomBy(0.5);
//     const handleReset = () => osdInstance.current?.viewport.goHome();

//     return (
//         <div className="relative w-full h-screen overflow-hidden select-none bg-gray-900">
//             {isLoading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
//                     <div className="text-center text-white">
//                         <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-400" />
//                         <p className="text-xl">Loading Map...</p>
//                     </div>
//                 </div>
//             )}

//             <div ref={viewerRef} className="absolute inset-0 w-full h-full" />

//             {/* Controls */}
//             <div className="absolute top-24 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
//                 <button onClick={handleZoomIn} className="p-3 bg-white/95 rounded-lg shadow-lg">
//                     <ZoomIn className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button onClick={handleZoomOut} className="p-3 bg-white/95 rounded-lg shadow-lg">
//                     <ZoomOut className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button onClick={handleReset} className="p-3 bg-white/95 rounded-lg shadow-lg">
//                     <Home className="w-5 h-5 text-gray-800" />
//                 </button>
//                 <button onClick={() => setShowInfo(!showInfo)} className="p-3 bg-white/95 rounded-lg shadow-lg">
//                     <Info className="w-5 h-5 text-gray-800" />
//                 </button>
//             </div>

//             {/* Layer Selector */}
//             <div className="absolute top-24 left-4 z-10 bg-white/95 p-3 rounded-lg shadow-lg pointer-events-auto">
//                 <div className="flex items-center gap-2 mb-2">
//                     <Layers className="w-5 h-5 text-gray-800" />
//                     <span className="font-semibold text-gray-800">Layers</span>
//                 </div>
//                 <div className="flex flex-col gap-1">
//                     {Object.entries(layers).map(([key, value]) => (
//                         <button
//                             key={key}
//                             onClick={() => setLayer(key)}
//                             disabled={layer === key}
//                             className={`px-3 py-2 rounded text-sm ${layer === key
//                                     ? 'bg-blue-600 text-white cursor-default'
//                                     : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                                 }`}
//                         >
//                             {value.name}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             {/* Info Panel */}
//             {showInfo && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4 pointer-events-none">
//                     <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2 max-w-4xl mx-auto">
//                         <div>
//                             <p className="text-xs text-gray-400">Latitude</p>
//                             <p className="font-mono text-lg">{coordinates.lat.toFixed(4)}°</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-400">Longitude</p>
//                             <p className="font-mono text-lg">{coordinates.lon.toFixed(4)}°</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-400">Zoom Level</p>
//                             <p className="font-mono text-lg">{coordinates.zoom.toFixed(2)}</p>
//                         </div>
//                         <div>
//                             <p className="text-xs text-gray-400">Map Style</p>
//                             <p className="text-lg">{layers[layer].name}</p>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

//V9
// import React, { useState, useEffect, useRef } from 'react';
// import OpenSeadragon from 'openseadragon';
// import { ZoomIn, ZoomOut, Maximize2, Layers, Info, Globe, Home, Loader2, MapPin, X, Save } from 'lucide-react';

// export default function NasaEarthViewer() {
//     const [showInfo, setShowInfo] = useState(true);
//     const [layer, setLayer] = useState('CartoDB');
//     const [coordinates, setCoordinates] = useState({ lat: 0, lon: 0, zoom: 2 });
//     const [isLoading, setIsLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [debugInfo, setDebugInfo] = useState('Initializing...');
//     const [annotations, setAnnotations] = useState([]);
//     const [showAnnotationForm, setShowAnnotationForm] = useState(false);
//     const [currentAnnotation, setCurrentAnnotation] = useState(null);
//     const [annotationText, setAnnotationText] = useState('');
//     const [showAnnotations, setShowAnnotations] = useState(true);
    
//     const viewerRef = useRef(null);
//     const osdInstance = useRef(null);
//     const overlayContainerRef = useRef(null);

//     const layers = {
//         CartoDB: {
//             name: 'Light Map',
//             url: 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png',
//             description: 'Clean, fast-loading map',
//             maxZoom: 19
//         },
//         Dark: {
//             name: 'Dark Mode',
//             url: 'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
//             description: 'Dark themed map',
//             maxZoom: 19
//         },
//         OpenStreetMap: {
//             name: 'OpenStreetMap',
//             url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
//             description: 'Detailed street map',
//             maxZoom: 19
//         },
//         Satellite: {
//             name: 'Satellite',
//             url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
//             description: 'Satellite imagery',
//             maxZoom: 18
//         }
//     };

//     // Load annotations from state (simulating localStorage)
//     const loadAnnotations = () => {
//         // In a real app with localStorage:
//         // const saved = localStorage.getItem(`annotations_${layer}`);
//         // return saved ? JSON.parse(saved) : [];
        
//         // Using state instead since localStorage isn't available in artifacts
//         return annotations.filter(a => a.layer === layer);
//     };

//     // Save annotations to state (simulating localStorage)
//     const saveAnnotations = (newAnnotations) => {
//         // In a real app with localStorage:
//         // localStorage.setItem(`annotations_${layer}`, JSON.stringify(newAnnotations));
        
//         // Remove old annotations for this layer and add new ones
//         const otherLayerAnnotations = annotations.filter(a => a.layer !== layer);
//         setAnnotations([...otherLayerAnnotations, ...newAnnotations]);
//     };

//     const initializeViewer = () => {
//         setDebugInfo('Creating viewer...');

//         if (!viewerRef.current) {
//             console.error('Container ref not ready');
//             setError('Container not ready');
//             setIsLoading(false);
//             return;
//         }

//         try {
//             const maxLevel = layers[layer].maxZoom;
//             const size = Math.pow(2, maxLevel);

//             const tileSource = {
//                 width: size,
//                 height: size,
//                 tileSize: 256,
//                 minLevel: 0,
//                 maxLevel: maxLevel,
//                 getTileUrl: function(level, x, y) {
//                     const maxTiles = Math.pow(2, level);
//                     x = ((x % maxTiles) + maxTiles) % maxTiles;
                    
//                     if (y < 0 || y >= maxTiles) {
//                         return null;
//                     }
                    
//                     return layers[layer].url
//                         .replace('{z}', level)
//                         .replace('{x}', x)
//                         .replace('{y}', y);
//                 }
//             };

//             const viewer = OpenSeadragon({
//                 element: viewerRef.current,
//                 prefixUrl: 'https://cdnjs.cloudflare.com/ajax/libs/openseadragon/4.1.0/images/',
//                 tileSources: tileSource,
//                 showNavigationControl: false,
//                 showFullPageControl: false,
//                 defaultZoomLevel: 0,
//                 minZoomLevel: 0,
//                 maxZoomLevel: maxLevel - 8,
//                 visibilityRatio: 1,
//                 constrainDuringPan: false,
//                 wrapHorizontal: true,
//                 wrapVertical: false,
//                 animationTime: 0.5,
//                 springStiffness: 7,
//                 immediateRender: false,
//                 blendTime: 0.2,
//                 alwaysBlend: false,
//                 placeholderFillStyle: layer === 'Dark' ? '#1a1a1a' : '#d0d0d0',
//                 gestureSettingsMouse: {
//                     scrollToZoom: true,
//                     clickToZoom: false,
//                     dblClickToZoom: false,
//                     pinchToZoom: true,
//                     flickEnabled: true,
//                     flickMinSpeed: 40,
//                     flickMomentum: 0.4
//                 },
//                 gestureSettingsTouch: {
//                     scrollToZoom: false,
//                     clickToZoom: false,
//                     dblClickToZoom: true,
//                     pinchToZoom: true,
//                     flickEnabled: true,
//                     flickMinSpeed: 40,
//                     flickMomentum: 0.4
//                 }
//             });

//             viewer.addHandler('open', () => {
//                 console.log('Viewer opened successfully!');
//                 setDebugInfo('Viewer opened - Loading tiles');
//                 setIsLoading(false);
                
//                 setTimeout(() => {
//                     viewer.viewport.fitBounds(new OpenSeadragon.Rect(0, 0, 1, 1));
//                     updateCoordinates(viewer);
//                     renderAnnotations(viewer);
//                 }, 100);
//             });

//             viewer.addHandler('open-failed', (event) => {
//                 console.error('Viewer open failed:', event);
//                 setError('Failed to open map viewer');
//                 setIsLoading(false);
//             });

//             viewer.addHandler('viewport-change', () => {
//                 updateCoordinates(viewer);
//             });

//             // Handle right-click for annotations
//             viewer.addHandler('canvas-contextmenu', (event) => {
//                 event.preventDefaultAction = true;
//                 handleRightClick(event, viewer);
//             });

//             osdInstance.current = viewer;
//             setDebugInfo('Viewer initialized');

//         } catch (e) {
//             console.error('Error initializing viewer:', e);
//             setError(`Initialization error: ${e.message}`);
//             setIsLoading(false);
//         }
//     };

//     const handleRightClick = (event, viewer) => {
//         const viewportPoint = viewer.viewport.pointFromPixel(event.position);
//         const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);
        
//         setCurrentAnnotation({
//             x: imagePoint.x,
//             y: imagePoint.y,
//             layer: layer,
//             id: Date.now()
//         });
//         setAnnotationText('');
//         setShowAnnotationForm(true);
//     };

//     const saveAnnotation = () => {
//         if (!annotationText.trim() || !currentAnnotation) return;

//         const newAnnotation = {
//             ...currentAnnotation,
//             text: annotationText,
//             timestamp: new Date().toISOString()
//         };

//         const currentAnnotations = loadAnnotations();
//         const updatedAnnotations = [...currentAnnotations, newAnnotation];
//         saveAnnotations(updatedAnnotations);

//         setShowAnnotationForm(false);
//         setCurrentAnnotation(null);
//         setAnnotationText('');

//         if (osdInstance.current) {
//             renderAnnotations(osdInstance.current);
//         }
//     };

//     const deleteAnnotation = (annotationId) => {
//         const currentAnnotations = loadAnnotations();
//         const updatedAnnotations = currentAnnotations.filter(a => a.id !== annotationId);
//         saveAnnotations(updatedAnnotations);

//         if (osdInstance.current) {
//             renderAnnotations(osdInstance.current);
//         }
//     };

//     const renderAnnotations = (viewer) => {
//         if (!viewer || !showAnnotations) return;

//         // Remove existing overlays
//         viewer.clearOverlays();

//         const currentAnnotations = loadAnnotations();

//         currentAnnotations.forEach(annotation => {
//             const element = document.createElement('div');
//             element.className = 'annotation-marker';
//             element.innerHTML = `
//                 <div class="relative group">
//                     <div class="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center cursor-pointer shadow-lg hover:bg-red-600 transition">
//                         <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
//                             <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
//                         </svg>
//                     </div>
//                     <div class="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
//                         <div class="bg-black/90 text-white text-sm rounded px-3 py-2 whitespace-nowrap shadow-lg max-w-xs">
//                             ${annotation.text}
//                         </div>
//                     </div>
//                 </div>
//             `;

//             // Add delete button
//             element.querySelector('.annotation-marker').addEventListener('click', (e) => {
//                 e.stopPropagation();
//                 if (confirm('Delete this annotation?')) {
//                     deleteAnnotation(annotation.id);
//                 }
//             });

//             const location = new OpenSeadragon.Point(annotation.x, annotation.y);
//             viewer.addOverlay({
//                 element: element,
//                 location: location,
//                 placement: OpenSeadragon.Placement.CENTER
//             });
//         });
//     };

//     const updateCoordinates = (viewer) => {
//         if (!viewer || !viewer.viewport || !viewer.world.getItemCount()) return;

//         try {
//             const viewport = viewer.viewport;
//             const center = viewport.getCenter();
//             const zoom = viewport.getZoom();
//             const imageSize = viewer.world.getItemAt(0).getContentSize();

//             const x = center.x * imageSize.x;
//             const y = center.y * imageSize.y;

//             const maxLevel = layers[layer].maxZoom;
//             const scale = Math.pow(2, maxLevel);

//             const lon = (x / scale) * 360 - 180;
//             const n = Math.PI - 2 * Math.PI * y / scale;
//             const lat = (180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n))));

//             const containerWidth = viewer.container.clientWidth;
//             const worldWidth = imageSize.x * zoom;
//             const tilesAcross = worldWidth / 256;
//             const zoomLevel = Math.log2(tilesAcross * 256);

//             setCoordinates({
//                 lat: isFinite(lat) ? lat : 0,
//                 lon: isFinite(lon) ? lon : 0,
//                 zoom: isFinite(zoomLevel) ? zoomLevel : 2
//             });
//         } catch (e) {
//             console.error('Error updating coordinates:', e);
//         }
//     };

//     useEffect(() => {
//         const timer = setTimeout(() => {
//             initializeViewer();
//         }, 100);

//         return () => {
//             clearTimeout(timer);
//             if (osdInstance.current) {
//                 try {
//                     osdInstance.current.destroy();
//                 } catch (e) {
//                     console.error('Error destroying viewer:', e);
//                 }
//             }
//         };
//     }, []);

//     useEffect(() => {
//         if (osdInstance.current && !isLoading) {
//             osdInstance.current.destroy();
//             setIsLoading(true);
//             setDebugInfo('Switching layers...');
//             setTimeout(() => initializeViewer(), 200);
//         }
//     }, [layer]);

//     useEffect(() => {
//         if (osdInstance.current) {
//             renderAnnotations(osdInstance.current);
//         }
//     }, [showAnnotations]);

//     const handleZoomIn = () => {
//         if (osdInstance.current) {
//             osdInstance.current.viewport.zoomBy(2);
//         }
//     };

//     const handleZoomOut = () => {
//         if (osdInstance.current) {
//             osdInstance.current.viewport.zoomBy(0.5);
//         }
//     };

//     const handleReset = () => {
//         if (osdInstance.current) {
//             osdInstance.current.viewport.goHome();
//         }
//     };

//     const exportAnnotations = () => {
//         const dataStr = JSON.stringify(annotations, null, 2);
//         const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
//         const exportFileDefaultName = `annotations_${new Date().toISOString()}.json`;
        
//         const linkElement = document.createElement('a');
//         linkElement.setAttribute('href', dataUri);
//         linkElement.setAttribute('download', exportFileDefaultName);
//         linkElement.click();
//     };

//     if (error) {
//         return (
//             <div className="flex items-center justify-center h-screen bg-gray-900">
//                 <div className="text-center text-white max-w-lg">
//                     <p className="text-xl mb-4">Error: {error}</p>
//                     <button
//                         onClick={() => window.location.reload()}
//                         className="px-6 py-2 bg-blue-600 rounded hover:bg-blue-700"
//                     >
//                         Reload Page
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="relative w-full h-screen overflow-hidden select-none bg-gray-900">
//             {isLoading && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-50">
//                     <div className="text-center text-white">
//                         <Loader2 className="w-16 h-16 animate-spin mx-auto mb-4 text-blue-400" />
//                         <p className="text-xl">Loading Earth Map...</p>
//                         <p className="text-sm text-gray-400 mt-2">{debugInfo}</p>
//                     </div>
//                 </div>
//             )}

//             <div
//                 ref={viewerRef}
//                 className="absolute inset-0"
//                 style={{
//                     backgroundColor: layer === 'Dark' ? '#0a0a0a' : '#a8dadc',
//                     width: '100%',
//                     height: '100%'
//                 }}
//             />

//             {/* Annotation Form Modal */}
//             {showAnnotationForm && (
//                 <div className="absolute inset-0 flex items-center justify-center bg-black/50 z-50">
//                     <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
//                         <div className="flex items-center justify-between mb-4">
//                             <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
//                                 <MapPin className="w-5 h-5" />
//                                 Add Annotation
//                             </h3>
//                             <button
//                                 onClick={() => setShowAnnotationForm(false)}
//                                 className="text-gray-500 hover:text-gray-700"
//                             >
//                                 <X className="w-5 h-5" />
//                             </button>
//                         </div>
//                         <textarea
//                             value={annotationText}
//                             onChange={(e) => setAnnotationText(e.target.value)}
//                             placeholder="Enter annotation text..."
//                             className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none text-gray-800"
//                             autoFocus
//                         />
//                         <div className="flex gap-2 mt-4">
//                             <button
//                                 onClick={saveAnnotation}
//                                 disabled={!annotationText.trim()}
//                                 className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
//                             >
//                                 <Save className="w-4 h-4" />
//                                 Save
//                             </button>
//                             <button
//                                 onClick={() => setShowAnnotationForm(false)}
//                                 className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
//                             >
//                                 Cancel
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}

//             {/* Header */}
//             <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent z-10 p-4 pointer-events-none">
//                 <div className="flex items-center justify-between">
//                     <div className="flex items-center gap-3">
//                         <Globe className="w-8 h-8 text-blue-400" />
//                         <div>
//                             <h1 className="text-2xl font-bold text-white">Interactive Earth Map</h1>
//                             <p className="text-sm text-gray-300">Right-click to annotate • {loadAnnotations().length} annotations</p>
//                         </div>
//                     </div>
//                     <button
//                         onClick={exportAnnotations}
//                         className="pointer-events-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm flex items-center gap-2"
//                     >
//                         <Save className="w-4 h-4" />
//                         Export
//                     </button>
//                 </div>
//             </div>

//             {/* Controls */}
//             {!isLoading && (
//                 <div className="absolute top-24 right-4 z-10 flex flex-col gap-2 pointer-events-auto">
//                     <button
//                         onClick={handleZoomIn}
//                         className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                         title="Zoom In"
//                     >
//                         <ZoomIn className="w-5 h-5 text-gray-800" />
//                     </button>
//                     <button
//                         onClick={handleZoomOut}
//                         className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                         title="Zoom Out"
//                     >
//                         <ZoomOut className="w-5 h-5 text-gray-800" />
//                     </button>
//                     <button
//                         onClick={handleReset}
//                         className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                         title="Reset to Home"
//                     >
//                         <Home className="w-5 h-5 text-gray-800" />
//                     </button>
//                     <button
//                         onClick={() => setShowAnnotations(!showAnnotations)}
//                         className={`p-3 rounded-lg shadow-lg transition active:scale-95 ${
//                             showAnnotations 
//                                 ? 'bg-blue-600 text-white hover:bg-blue-700' 
//                                 : 'bg-white/95 backdrop-blur-sm hover:bg-white'
//                         }`}
//                         title="Toggle Annotations"
//                     >
//                         <MapPin className={`w-5 h-5 ${showAnnotations ? 'text-white' : 'text-gray-800'}`} />
//                     </button>
//                     <button
//                         onClick={() => setShowInfo(!showInfo)}
//                         className="p-3 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg hover:bg-white transition active:scale-95"
//                         title="Toggle Info"
//                     >
//                         <Info className="w-5 h-5 text-gray-800" />
//                     </button>
//                 </div>
//             )}

//             {/* Layer Selector */}
//             {!isLoading && (
//                 <div className="absolute top-24 left-4 z-10 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg p-3 pointer-events-auto">
//                     <div className="flex items-center gap-2 mb-2">
//                         <Layers className="w-5 h-5 text-gray-800" />
//                         <span className="font-semibold text-gray-800">Layers</span>
//                     </div>
//                     <div className="flex flex-col gap-1">
//                         {Object.entries(layers).map(([key, value]) => (
//                             <button
//                                 key={key}
//                                 onClick={() => setLayer(key)}
//                                 disabled={layer === key}
//                                 className={`px-3 py-2 rounded text-sm transition text-left active:scale-95 ${
//                                     layer === key
//                                         ? 'bg-blue-600 text-white cursor-default'
//                                         : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
//                                 }`}
//                             >
//                                 <div className="font-medium">{value.name}</div>
//                             </button>
//                         ))}
//                     </div>
//                 </div>
//             )}

//             {/* Info Panel */}
//             {showInfo && !isLoading && (
//                 <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4 pointer-events-none">
//                     <div className="max-w-4xl mx-auto">
//                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2">
//                             <div>
//                                 <p className="text-xs text-gray-400">Latitude</p>
//                                 <p className="font-mono text-lg">{coordinates.lat.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Longitude</p>
//                                 <p className="font-mono text-lg">{coordinates.lon.toFixed(4)}°</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Zoom Level</p>
//                                 <p className="font-mono text-lg">{coordinates.zoom.toFixed(1)}</p>
//                             </div>
//                             <div>
//                                 <p className="text-xs text-gray-400">Annotations</p>
//                                 <p className="text-lg">{loadAnnotations().length} on this layer</p>
//                             </div>
//                         </div>
//                         <p className="text-xs text-gray-400 mt-2">
//                             Drag to pan • Scroll to zoom • Right-click to add annotation
//                         </p>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }


