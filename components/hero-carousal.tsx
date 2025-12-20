'use client'
import { movies } from "@/data/movies";
import { Calendar, ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";


const AUTO_SLIDE_INTERVAL = 8000;

export const HeroCarousal = () => {
    const [current, setCurrent] = useState(0);
    const nextSlide = () => {
        setCurrent((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
    };
    const prevSlide = () => {
        setCurrent((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
    };

    // Auto-Slide
    useEffect(() => {
        const interval = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
        return () => clearInterval(interval);
    }, []);
    return (
        <section className="relative w-full h-screen overflow-hidden">
            {
                movies.map((movie, index) => (
                    <div key={index} className={`absolute inset-0 transition-opacity duration-700 ${index === current ? 'opacity-100' : 'opacity-0'}`}>
                        <Image src={movie.image} fill alt={movie.title} className="object-cover object-center" />
                        <div className="absolute inset-0 bg-black/40 md:bg-gradient-to-r md:from-black/70 md:via-black/40 md:to-transparent" />

                        <div className="absolute bottom-20 left-6 md:left-20 z-10 text-white max-w-2xl">
                            <h1 className="text-4xl mb-4 font-extrabold md:text-6xl">{movie.title}</h1>
                            <p className="flex mb-5 gap-1.5 mt-2"> <Star /> {movie.rating} • {movie.genre} • <Calendar /> {movie.release} • <Clock /> {movie.duration} • {movie.cbf}</p>
                            <p className="mt-5 mb-5">{movie.description}</p>

                        </div>
                    </div>
                ))
            }
            {/* Left Button */}
            <button
                onClick={prevSlide}
                className="absolute left-4 md:left-10 top-1/2 -translate-y-1/2 z-30 p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur transform hover:scale-110 transition duration-300 cursor-pointer"
            >
                <ChevronLeft className="w-6 h-6 text-white" />
            </button>

            {/* Right Button */}
            <button
                onClick={nextSlide}
                className="absolute right-4 md:right-10 top-1/2 -translate-y-1/2 z-30 cursor-pointer p-2 bg-black/50 hover:bg-black/70 rounded-full backdrop-blur transform hover:scale-110 transition duration-300"
            >
                <ChevronRight className="w-6 h-6 text-white" />
            </button>



            {/* Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrent(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${index === current ? 'bg-white scale-110' : 'bg-gray-400/70'
                            }`}
                    ></button>
                ))}
            </div>

        </section>
    );
}