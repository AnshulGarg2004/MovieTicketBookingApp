'use client'
import React, { useEffect, useState } from 'react'
import MovieCards from '@/components/movie-card'
import BlurCircle from '@/components/blur-circle'
import Loading from '@/components/loading'
import axios from 'axios'

const Movie = () => {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        const fetchShows = async() => {
            const {data} = await axios.get('/api/get-shows');
            if(data.success) {
                setShows(data.Show.map((s : any) => s.movie));
            }
        }
        fetchShows();
    }, [])

    return shows.length > 0 ? (
        <div className='relative my-40 mb-60 md:px-16 lg:px-40 overflow-hidden min-h-[80vh] '>
            <BlurCircle top='120px' left='20' />
            <BlurCircle bottom='80px' right='40px' />
            <h1 className='text-2xl font-bold my-5 text-center mb-5'>Now Showing</h1>
            <div className='grid grid-cols-4 max-sm:justify-center gap-8 mt-8'>
            {
                shows.map((movie, idx) => (
                    <MovieCards key={idx} movies={movie} />
                ))
            }

            </div>
        </div>
    ) : (
        <Loading />
    )
}

export default Movie

