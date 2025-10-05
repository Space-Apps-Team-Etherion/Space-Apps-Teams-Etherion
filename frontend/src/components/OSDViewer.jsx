
import React, { useEffect, useRef, useState } from 'react'
import OpenSeaDragon from 'openseadragon';
import ViewerControls from './ViewerControls';

const OSDViewer = ({ tileSource, fixed, isViewing, setIsViewing, description }) => {
    const viewerRef = useRef(null)
    const osdRef = useRef(null)
    const [annotations, setAnnotations] = useState([])
    const [showAnnotation, setShowAnnotation] = useState(false)
    const [showContextMenu, setShowContextMenu] = useState(false)
    const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 })
    const [pendingAnnotation, setPendingAnnotation] = useState(null)
    const [annotationText, setAnnotationText] = useState('')
    const [hoveredAnnotation, setHoveredAnnotation] = useState(null)

    // Get image identifier from tileSource
    const getImageId = () => {
        if (typeof tileSource === 'string') return tileSource;
        if (tileSource?.url) return tileSource.url;
        return 'default-image';
    }

    // Load annotations from localStorage on mount
    useEffect(() => {
        const imageId = getImageId();
        const stored = localStorage.getItem(`osd-annotations-${imageId}`);
        if (stored) {
            try {
                setAnnotations(JSON.parse(stored));
            } catch (e) {
                console.error('Error loading annotations:', e);
            }
        }
    }, [tileSource]);

    // Save annotations to localStorage whenever they change
    useEffect(() => {
        if (annotations.length >= 0) {
            const imageId = getImageId();
            localStorage.setItem(`osd-annotations-${imageId}`, JSON.stringify(annotations));
        }
    }, [annotations]);

    useEffect(() => {
        if (!viewerRef.current) return

        // Initialize OpenSeaDragon
        osdRef.current = OpenSeaDragon({
            element: viewerRef.current,
            prefixUrl: 'https://openseadragon.github.io/openseadragon/images/',
            tileSources: tileSource,
            showNavigator: false,
            showNavigationControl: false,
        })
        // When the image is open, adjust zoom
        osdRef.current.addHandler("open", () => {
            osdRef.current.viewport.fitHorizontally();
            renderAnnotations();
        });

        // Handle viewport changes to update annotation positions
        osdRef.current.addHandler("animation", () => {
            renderAnnotations();
        });

        // Prevent default context menu and show custom menu
        const handleContextMenu = (e) => {
            e.preventDefault();

            // Get mouse position relative to viewer
            const viewerElement = viewerRef.current;
            const rect = viewerElement.getBoundingClientRect();
            const viewportPoint = osdRef.current.viewport.pointFromPixel(
                new OpenSeaDragon.Point(e.clientX - rect.left, e.clientY - rect.top)
            );

            // Convert to image coordinates
            const imagePoint = osdRef.current.viewport.viewportToImageCoordinates(viewportPoint);

            setPendingAnnotation({
                x: imagePoint.x,
                y: imagePoint.y,
                viewportX: viewportPoint.x,
                viewportY: viewportPoint.y
            });

            setContextMenuPosition({ x: e.clientX, y: e.clientY });
            setShowContextMenu(true);
        };

        viewerRef.current.addEventListener('contextmenu', handleContextMenu);

        // Clean up on unmount
        return () => {
            if (viewerRef.current) {
                viewerRef.current.removeEventListener('contextmenu', handleContextMenu);
            }
            if (osdRef.current) {
                osdRef.current.destroy()
                osdRef.current = null
            }
        }
    }, [tileSource])

    // Render annotations as overlays
    const renderAnnotations = () => {
        if (!osdRef.current || !osdRef.current.world.getItemCount()) return;

        // Remove existing annotation overlays
        const existingOverlays = document.querySelectorAll('.annotation-marker');
        existingOverlays.forEach(overlay => overlay.remove());

        // Add annotation markers
        annotations.forEach((annotation, index) => {
            const marker = document.createElement('div');
            marker.className = `annotation-marker`;
            marker.style.cssText = `
                position: absolute;
                width: 24px;
                height: 24px;
                background-color: #3b82f6;
                border: 2px solid white;
                border-radius: 50%;
                cursor: pointer;
                box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 12px;
                font-weight: bold;
                z-index: 1000;
                transition: transform 0.2s;
            `;
            marker.textContent = index + 1;

            // Convert image coordinates to viewport coordinates
            const viewportPoint = osdRef.current.viewport.imageToViewportCoordinates(
                annotation.x,
                annotation.y
            );

            // Convert viewport coordinates to pixel coordinates
            const pixelPoint = osdRef.current.viewport.viewportToViewerElementCoordinates(viewportPoint);

            marker.style.left = `${pixelPoint.x - 12}px`;
            marker.style.top = `${pixelPoint.y - 12}px`;

            // Hover effects
            marker.addEventListener('mouseenter', () => {
                marker.style.transform = 'scale(1.2)';
                setHoveredAnnotation(annotation);
            });

            marker.addEventListener('mouseleave', () => {
                marker.style.transform = 'scale(1)';
                setHoveredAnnotation(null);
            });

            // Click to view/edit
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                handleAnnotationClick(annotation, index);
            });

            viewerRef.current.appendChild(marker);
        });
    };

    const handleAnnotationClick = (annotation, index) => {
        const action = window.confirm(
            `Annotation ${index + 1}:\n"${annotation.text}"\n\nClick OK to delete, Cancel to keep.`
        );

        if (action) {
            deleteAnnotation(index);
        }
    };

    const deleteAnnotation = (index) => {
        setAnnotations(prev => prev.filter((_, i) => i !== index));
        renderAnnotations();
    };

    const handleAddAnnotation = () => {
        if (!annotationText.trim() || !pendingAnnotation) return;

        const newAnnotation = {
            id: Date.now(),
            x: pendingAnnotation.x,
            y: pendingAnnotation.y,
            text: annotationText.trim(),
            imageId: getImageId(),
            timestamp: new Date().toISOString()
        };

        setAnnotations(prev => [...prev, newAnnotation]);
        setAnnotationText('');
        setShowContextMenu(false);
        setPendingAnnotation(null);

        // Re-render annotations after a short delay
        setTimeout(() => renderAnnotations(), 100);
    };

    const handleCancelAnnotation = () => {
        setShowContextMenu(false);
        setPendingAnnotation(null);
        setAnnotationText('');
    };

    // Close context menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (showContextMenu && !e.target.closest('.context-menu')) {
                handleCancelAnnotation();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showContextMenu]);

    
    return (
        <>
            <div
                className={`bg-black text-white ${fixed ? 'fixed top-0 left-0' : 'relative'}`}
                ref={viewerRef}
                style={{ width: '100%', height: '100vh' }}
            >
            </div>

            {/* Context Menu for Adding Annotations */}
            {showContextMenu && (
                <div
                    className={`context-menu p-4 rounded-2xl text-white border-2 border-white/20 bg-white/10 no-scrollbar transition-opacity duration-300`}
                    style={{
                        position: 'fixed',
                        left: `${contextMenuPosition.x}px`,
                        top: `${contextMenuPosition.y}px`,
                        padding: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        zIndex: 10000,
                        minWidth: '250px'
                    }}
                >
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: 'bold' }}>
                        Add Annotation
                    </h3>
                    <textarea
                        className='resize-none border-white/20 border-1 focus:outline-none'
                        value={annotationText}
                        onChange={(e) => setAnnotationText(e.target.value)}
                        placeholder="Enter annotation text..."
                        autoFocus
                        style={{
                            width: '100%',
                            minHeight: '60px',
                            padding: '8px',
                            borderRadius: '4px',
                            fontSize: '13px',
                            fontFamily: 'inherit',
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.ctrlKey) {
                                handleAddAnnotation();
                            } else if (e.key === 'Escape') {
                                handleCancelAnnotation();
                            }
                        }}
                    />
                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                        <button
                            onClick={handleAddAnnotation}
                            style={{
                                flex: 1,
                                padding: '6px 12px',
                                backgroundColor: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500'
                            }}
                        >
                            Add (Ctrl+Enter)
                        </button>
                        <button
                            onClick={handleCancelAnnotation}
                            style={{
                                flex: 1,
                                padding: '6px 12px',
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                border: '1px solid #d1d5db',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500'
                            }}
                        >
                            Cancel (Esc)
                        </button>
                    </div>
                </div>
            )}

            {/* Annotation Tooltip on Hover */}
            {hoveredAnnotation && (
                <div
                    className='bg-neutral-900/50'
                    style={{
                        position: 'fixed',
                        color: 'white',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        fontSize: '13px',
                        maxWidth: '300px',
                        zIndex: 10001,
                        pointerEvents: 'none',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                        left: '50%',
                        top: '20px',
                        transform: 'translateX(-50%)'
                    }}
                >
                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                        Annotation
                    </div>
                    <div>{hoveredAnnotation.text}</div>
                    <div style={{ fontSize: '11px', marginTop: '4px', opacity: 0.7 }}>
                        Click to delete
                    </div>
                </div>
            )}

            {/* Annotations List Panel */}
            {annotations.length === 0 && isViewing && (
                <div className={`${showAnnotation ? 'opacity-100' : 'opacity-0'} pointer-events-none p-4 rounded-2xl text-white border-2 border-white/20 bg-white/10 no-scrollbar transition-opacity duration-300`}
                    style={{
                        position: 'fixed',
                        right: '20px',
                        top: '25em',
                        padding: '1em 1.2em',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        maxWidth: '300px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        zIndex: 1000
                    }}>
                    No annotation yet <br /> <span className='text-sm opacity-60'>(right click on a spot to add an annotation)</span>
                </div>
            )}
            {annotations.length > 0 && isViewing && (
                <div
                    className={`${showAnnotation ? 'opacity-100' : 'opacity-0 pointer-events-none'} p-4 rounded-2xl text-white border-2 border-white/20 bg-white/10 no-scrollbar transition-opacity duration-300`}
                    style={{
                        position: 'fixed',
                        right: '20px',
                        top: '25em',
                        padding: '1em 1.2em',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                        maxWidth: '300px',
                        maxHeight: '400px',
                        overflowY: 'auto',
                        zIndex: 1000
                    }}
                >
                    <h3 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: 'bold' }}>
                        Annotations ( <span className='font-mono font-light'>{annotations.length}</span> )
                    </h3>
                    {annotations.map((annotation, index) => (
                        <div
                            key={annotation.id}
                            className='p-4 rounded-lg text-white border-2 border-white/20 bg-white/30'
                            style={{
                                padding: '8px',
                                marginBottom: '8px',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleAnnotationClick(annotation, index)}
                        >
                            <div style={{ fontWeight: 'bold', fontSize: '1em', marginBottom: '4px' }} className='text-red-600'>
                                #{index + 1}
                            </div>
                            <div style={{ fontSize: '1.1em' }}>
                                {annotation.text}
                            </div>
                            <div style={{ fontSize: '1em', marginTop: '4px' }} className='opacity-70 text-neutral-50'>
                                {new Date(annotation.timestamp).toLocaleString()}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <ViewerControls setShowAnnotation={() => setShowAnnotation(!showAnnotation)} isViewing={isViewing} osdInstance={osdRef} setIsViewing={setIsViewing} description={description} />
        </>
    )
}

export default OSDViewer
