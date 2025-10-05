import React, { useEffect, useRef } from 'react'
import OpenSeaDragon from 'openseadragon';
import ViewerControls from './ViewerControls';


const OSDViewer = ({ tileSource, fixed, isViewing, setIsViewing }) => {
    const viewerRef = useRef(null)
    const osdRef = useRef(null)

    useEffect(() => {
        if (!viewerRef.current) return
        //initialize OpenSeaDragon once

        osdRef.current = OpenSeaDragon({
            element: viewerRef.current,
            prefixUrl: 'https://openseadragon.github.io/openseadragon/images/', // Toolbar icons
            tileSources: tileSource,
            showNavigator: false,
            showNavigationControl: false,
        })

        // When the image is open, adjust zoom
        osdRef.current.addHandler("open", () => {
            osdRef.current.viewport.fitHorizontally();
        });


        //Clean Up on unmount
        return () => {
            if (osdRef.current) {
                osdRef.current.destroy()
                osdRef.current = null
            }
        }
    }, [tileSource])

    return (
        <>
            <div
                className={`bg-black text-white ${fixed ? 'fixed top-0 left-0' : ''}`}
                ref={viewerRef}
                style={{ width: '100%', height: '100vh' }}
            >

            </div>
            <ViewerControls isViewing={isViewing} osdInstance={osdRef} setIsViewing={setIsViewing} />
        </>
    )
}

export default OSDViewer
