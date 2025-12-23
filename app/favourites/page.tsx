'use client'

import BlurCircle from "@/components/blur-circle";
import MovieCards from "@/components/movie-card";
import axios from "axios";
import { useEffect, useState } from "react";

const Favourites = () => {
    const [favourites, setFavourites] = useState([]);
    
        useEffect(() => {
            const fetchShows = async() => {
                const {data} = await axios.get('/api/favorites');
                if(data.success) {
                    setFavourites(data.favourite.map((s : any) => s.movie));
                }
            }
            fetchShows();
        }, [])
    return favourites.length > 0 ? (
        <div className="relative my-40 mb-60 px-6 md:px-16 lg:px-16 overflow-hidden min-h-[80vh]">
            <BlurCircle top="150px" left="0" />
            <BlurCircle bottom="50px" right="50px" />

            <h1 className="text-lg font-medium my-4">Your Favourite Movies</h1>
            <div className="flex flex-wrap max-sm:justify-center gap-8">
                {favourites.map((movie, idx) => (
                    <MovieCards movies={movie} key={idx} />
                ))}
            </div>
        </div>
    ) : (
        <div className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-3xl font-bold text-center">No Movies available</h1>
        </div>
    )
}

export default Favourites
