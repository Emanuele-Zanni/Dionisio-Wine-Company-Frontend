"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

function Carrusel() {
    const images = [
        "https://imagenes.eltiempo.com/files/image_1200_600/uploads/2023/07/13/64b022c02dced.jpeg",
        "https://aratiendas.com/wp-content/uploads/2023/04/GettyImages-490390516-1024x683.jpg",
        "https://pasilloturistico.com/wp-content/uploads/2022/08/42476F93-919F-4FE9-A9B6-808D3807FD8B.jpeg",
        "https://www.infobae.com/new-resizer/sKbXNAXaQK8xuRLl4KidH-jI5BE=/1440x810/filters:format(webp):quality(85)/cloudfront-us-east-1.images.arcpublishing.com/infobae/MTUDXIOQEZHQDIM7N3BKWOSAU4.jpg"
    ];

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
        }, 3000); // Cambia la imagen cada 3 segundos
        return () => clearInterval(interval);
    }, [images.length]);

    return (
        <div id="indicators-carousel" className="relative w-full h-96 md:h-128">
            <div className="relative h-full overflow-hidden rounded-lg">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${index === currentIndex ? 'opacity-100' : 'opacity-0'}`}
                    >
                        <Image
                            src={image}
                            alt={`Slide ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                        />
                    </div>
                ))}
            </div>
            <div className="absolute z-30 flex space-x-3 bottom-5 left-1/2 transform -translate-x-1/2">
                {images.map((_, index) => (
                    <button
                        key={index}
                        type="button"
                        className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'}`}
                        onClick={() => setCurrentIndex(index)}
                        aria-current={index === currentIndex}
                        aria-label={`Slide ${index + 1}`}
                    />
                ))}
            </div>
            <button
                type="button"
                className="absolute top-0 left-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={() => setCurrentIndex((currentIndex - 1 + images.length) % images.length)}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
                    <svg className="w-4 h-4 text-white" aria-hidden="true" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4" />
                    </svg>
                    <span className="sr-only">Anterior</span>
                </span>
            </button>
            <button
                type="button"
                className="absolute top-0 right-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
                onClick={() => setCurrentIndex((currentIndex + 1) % images.length)}
            >
                <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 group-hover:bg-white/50 group-focus:ring-4 group-focus:ring-white">
                    <svg className="w-4 h-4 text-white" aria-hidden="true" fill="none" viewBox="0 0 6 10">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4" />
                    </svg>
                    <span className="sr-only">Siguiente</span>
                </span>
            </button>
        </div>
    );
}

export default Carrusel;
