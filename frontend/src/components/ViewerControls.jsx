import React, { useState } from 'react'
import { ZoomIn, ZoomOut, Home, Info, Plus, Pen } from 'lucide-react';
import Return from './Return';


function ViewerControls({ osdInstance, isViewing, setIsViewing, description, setShowAnnotation }) {
    const handleZoomIn = () => osdInstance.current?.viewport.zoomBy(2);
    const handleZoomOut = () => osdInstance.current?.viewport.zoomBy(0.5);
    const handleReset = () => osdInstance.current?.viewport.goHome();
    const [showInfo, setShowInfo] = useState(true);


    return (
        <>
            <div className={`${isViewing ? 'opacity-100' : 'hidden opacity-0'} fixed top-1/2 left-1/2 -mx-1/2 -my-1/2 z-20 select-none transition-opacity duration-300`}>
                <Plus className='w-6 h-6 text-neutral-600' />
            </div>
            <Return isViewing={isViewing} onclick={setIsViewing} />
            <div className={`${isViewing ? 'opacity-100' : 'hidden opacity-0'} fixed top-24 right-4 z-20 flex flex-col gap-2 pointer-events-auto select-none transition-opacity duration-300`}>
                {/* Controls */}
                <button onClick={handleZoomIn} className="p-3 bg-white/15 border-2 border-white/20 rounded-lg shadow-lg cursor-pointer">
                    <ZoomIn className="w-5 h-5 text-white/80" />
                </button>
                <button onClick={handleZoomOut} className="p-3 bg-white/15 border-2 border-white/20 rounded-lg shadow-lg cursor-pointer">
                    <ZoomOut className="w-5 h-5 text-white/80" />
                </button>
                <button onClick={handleReset} className="p-3 bg-white/15 border-2 border-white/20 rounded-lg shadow-lg cursor-pointer">
                    <Home className="w-5 h-5 text-white/80" />
                </button>
                <button onClick={setShowAnnotation} className="p-3 bg-white/15 border-2 border-white/20 rounded-lg shadow-lg cursor-pointer">
                    <Pen className="w-5 h-5 text-white/80" />
                </button>
                <button onClick={() => setShowInfo(!showInfo)} className="p-3 bg-white/15 border-2 border-white/20 rounded-lg shadow-lg cursor-pointer">
                    <Info className="w-5 h-5 text-white/80" />
                </button>

                {/* Layer Selector
            <div className="absolute top-24 left-4 z-10 bg-white/95 p-3 rounded-lg shadow-lg pointer-events-auto">
            <div className="flex items-center gap-2 mb-2">
            <Layers className="w-5 h-5 text-gray-800" />
                    <span className="font-semibold text-gray-800">Layers</span>
                    </div>
                    <div className="flex flex-col gap-1">
                    {Object.entries(layers).map(([key, value]) => (
                        <button
                        key={key}
                        onClick={() => setLayer(key)}
                        disabled={layer === key}
                        className={`px-3 py-2 rounded text-sm ${layer === key
                        ? 'bg-blue-600 text-white cursor-default'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                        >
                        {value.name}
                        </button>
                        ))}
                        </div>
                        </div> */}

                {/* Info Panel 
            {showInfo && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent z-10 p-4 pointer-events-none">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white mb-2 max-w-4xl mx-auto">
                <div>
                <p className="text-xs text-gray-400">Latitude</p>
                <p className="font-mono text-lg">{coordinates.lat.toFixed(4)}°</p>
                </div>
                <div>
                <p className="text-xs text-gray-400">Longitude</p>
                <p className="font-mono text-lg">{coordinates.lon.toFixed(4)}°</p>
                </div>
                <div>
                <p className="text-xs text-gray-400">Zoom Level</p>
                <p className="font-mono text-lg">{coordinates.zoom.toFixed(2)}</p>
                </div>
                <div>
                <p className="text-xs text-gray-400">Map Style</p>
                <p className="text-lg">{layers[layer].name}</p>
                </div>
                </div>
                </div>
                )}*/}
                {/* Description */}
                <div className={`${showInfo ? 'opacity-100' : "opacity-0"} max-w-80 p-4 rounded-2xl text-white border-2 border-white/20 bg-white/10 fixed bottom-5 right-5 transition-opacity duration-300`}>
                    {description}
                </div >
            </div>


        </>
    )
}

export default ViewerControls
