import React from 'react'
import NasaEarthViewer from './components/NasaEarthViewer'

function Test({ mode }) {
    return (
        <div className={`${mode ? 'bg-nwutral-50' : 'bg-neutral-800'}`}>
            {/* <img src="/SpaceViewLogo.svg" alt="" /> */}
            <NasaEarthViewer />
        </div>

    )
}

export default Test
