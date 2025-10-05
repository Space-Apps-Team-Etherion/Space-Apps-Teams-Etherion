import React from "react";

export default function Card({ title, image, description, onclick }) {
    return (
        <div className="relative group rounded-2xl overflow-hidden shadow-lg bg-black/80" onClick={onclick}>
            {/* Image */}
            <img
                src={image}
                alt={title}
                className="w-full h-max aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Overlay with description (hidden until hover) */}
            <div className="absolute inset-0 bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h3 className="font-bold text-2xl mb-2">{title}</h3>
                <p className="text-2sm opacity-70 line-clamp-3">{description}</p>
            </div>
        </div>
    );
}

