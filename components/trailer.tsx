import React, { useState } from 'react'
import Image from 'next/image';
import { PlayCircleIcon } from 'lucide-react';
import { movies } from '@/data/movies';

const Trailers = () => {
    const [currentTrailer, setCurrentTrailer] = useState(movies[1]);
    return (
        <div>
            <div>
                <iframe className='w-full aspect-video rounded-lg' src={`https://www.youtube.com/embed/${currentTrailer.trailer}`} allowFullScreen width={"100%"} height={"400px"}></iframe>
            </div>
                <div className="max-w-4xl mx-auto mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {movies.map((movie) => (
                        <div
                            key={movie.id}
                            onClick={() => setCurrentTrailer(movie)}
                            className="relative group-hover:not-hover:opacity-50 hover:-translate-y-1 duration-300 transition max-md:h-60 cursor-pointer">
                            <Image
                                src={movie.image}
                                alt={movie.title}
                                width={220}
                                height={130}
                                className="rounded-lg w-full h-full object-cover object-center"
                            />

                            <PlayCircleIcon strokeWidth={1.6} className='absolute cursor-pointer top-1/2 left-1/2 w-5 md:w-8 h-5 md:h-12 transform -translate-x-0.5 -translate-y-0.5' />
                        </div>
                    ))}
                </div>
        </div>
    )
}

export default Trailers
