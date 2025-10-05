import React, { useState } from 'react'
import OSDViewer from './components/OSDViewer'
import SearchBar from './components/SearchBar';
import Button from './components/Button';
import Card from './components/Card';
import { ChevronRight } from 'lucide-react';
import { astroCards } from './assets/astroCards';


function Home({ mode }) {
    const [isViewing, setIsViewing] = useState(false)
    const [iiifTileSource, setIiifTileSource] = useState("./NGC_5866/opo0624a.dzi")
    const [currentDescription, setCurrentDescription] = useState("Mars is the fourth planet from the Sun, known as the Red Planet due to iron oxide on its surface. It has the largest volcano in the solar system, Olympus Mons.")
    // https://esahubble.org/images/opo0328a/zoomable/
    // const iiifTileSource = "./messier82/heic064a.dzi"
    // const iiifTileSource = "./Jupiter/heic1914b.dzi"
    // const iiifTileSource = "./mars/opo0745g.dzi"


    return (
        <>
            <div className={`relative w-full h-screen ${mode ? 'bg-white' : 'bg-neutral-500'} raleway`}>
                <OSDViewer description={currentDescription} tileSource={iiifTileSource} mode={mode} fixed={true} isViewing={isViewing} setIsViewing={() => setIsViewing(false)} />
                <div className={`absolute z-10 top-0 left-0 text-white w-full h-full ${isViewing ? ' pointer-events-none' : ''}`}>
                    {/* Search bar and logo  */}
                    <div className={`flex flex-col ${isViewing ? 'opacity-0 -translate-y-30' : ''} transition-all duration-500 gap-[7vh]`}>
                        <div className='flex flex-row lg:flex-col'>
                            <div className='fixed top-8 left-8 z-50'>
                                <img src="/SpaceViewLogo.svg" alt="" className='w-[80px] aspect-square lg:hidden' />
                                <h1 className='text-white font-semibold text-3xl hidden lg:flex'>Space <span className='text-blue-400 font-normal'>View</span></h1>
                            </div>
                            <SearchBar mode={mode} addStyle={'mt-20'} />
                        </div>
                        <h1 className='mx-auto text-5xl xl:text-6xl max-w-[60em] lg:w-[45%] text-center font-bold animate-fade-down'>Explore Space and Beyond with Space <span className='text-blue-500'>View</span></h1>
                        <Button content={<>Explore&nbsp;<ChevronRight className='w-5 h-5' /></>} addStyle={'mx-auto animate-ease-in delay-150'} onclick={() => setIsViewing(true)} />
                    </div>

                    {/* Cards and footer */}
                    <div className={`w-full ${isViewing ? 'opacity-0 translate-y-30' : ''} transition-all duration-500 flex flex-col items-center mt-[8vh]`}>

                        <div className=" w-[90%] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-20 p-10">
                            {astroCards.map((card, index) => (
                                <Card
                                    key={index}
                                    title={card.title}
                                    image={card.image}
                                    description={card.description}
                                    onclick={() => { setIiifTileSource(card.IIIF); setCurrentDescription(card.description) }}
                                />
                            ))}
                        </div>
                        <div className='w-full flex flex-col items-center justify-center h-max p-10'>
                            <div className='w-[80%] max-w-[80em] p-8 rounded-2xl text-neutral-600 bg-white flex flex-col items-center justify-center'>
                                <h1 className='lg:w-[40%] text-center mb-6 text-2xl font-bold'>Subscribe to our Newsletter for interesting Space Facts and News</h1>
                                <form className='flex flex-row items-center justify-center gap-8 w-full lg:w-[60%]'>
                                    <input className='w-full p-4 text-neutral-600 rounded-lg bg-neutral-100' type="email" placeholder='Enter your e-mail' />
                                    <Button content={'Subscribe'} />
                                </form>
                            </div>
                        </div>

                        <footer className="w-full bg-gray-900 text-gray-400 text-sm py-10 mt-auto border-t border-gray-700">
                            <div className=" w-full px-10 flex flex-col md:flex-row items-center justify-between gap-4">
                                {/* Left: Project info */}
                                <div className="text-center md:text-left">
                                    <div>
                                        <img src="/SpaceViewLogo.svg" alt="" className='w-[80px] aspect-square lg:hidden' />
                                        <h1 className='text-white font-semibold text-3xl hidden lg:flex'>Space <span className='text-blue-400 font-normal'>View</span></h1>
                                    </div>
                                    <p>
                                        Built for the{" "}
                                        <a
                                            href="https://www.spaceappschallenge.org/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline"
                                        >
                                            NASA Space Apps Challenge
                                        </a>
                                        .
                                    </p>
                                </div>

                                {/* Center: License */}
                                <div className="text-center">
                                    <p>
                                        Open Source • Licensed under{" "}
                                        <a
                                            href="https://opensource.org/licenses/MIT"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-400 hover:underline"
                                        >
                                            MIT
                                        </a>
                                    </p>
                                </div>

                                {/* Right: Repo link */}
                                <div className="text-center md:text-right">
                                    <a
                                        href="https://github.com/Space-Apps-Team-Etherion/Space-View"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-400 hover:underline"
                                    >
                                        View Source on GitHub
                                    </a>
                                </div>
                            </div>

                            {/* Disclaimer */}
                            <div className="mt-4 text-xs text-center text-gray-500 px-4">
                                <p>
                                    This project is an independent open-source submission for the NASA Space
                                    Apps Challenge. It is not an official NASA product.
                                </p>
                            </div>
                        </footer>
                    </div>
                </div>
            </div >
        </>
    )
}

export default Home
