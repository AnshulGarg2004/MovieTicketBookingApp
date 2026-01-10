'use client'
import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import BlurCircle from './blur-circle';
import MovieCards from './movie-card';
import Trailers from './trailer';
import axios from 'axios';
import { toast } from 'sonner';

const FeaturedSection = () => {
    const router = useRouter();
    const [shows, setShows] = useState([]);
    useEffect(() => {
        const fetchShows = async() => {
            try {
                const {data} = await axios.get("/api/get-shows");
                if(data.success) {
                    setShows(data.Show.map((show : any) => (show.movie)));

                }
            } catch (error) {
              return toast.error("Error fetching shows");  
            }
        }
        fetchShows();
    }, []);
    return (
        <div className='px-6 md:px-20 xl:px-44 overflow-hidden'>
            <div className='relative flex items-center justify-between pt-20 pb-10'>
                <BlurCircle top='0' right='-80px' />
                <p className='font-medium text-xl text-gray-400'>Now Showing</p>
                <button onClick={() => router.push('/movies')} className='group cursor-pointer flex items-center gap-2 text-sm text-gray-400'>View All <ArrowRight className='group-hover:translate-x-0.5 transition w-4.5 h-4.5' /></button>
            </div>
            <BlurCircle top='-10px' left='-80px' />
            <div className='group grid grid-cols-3 max-sm:justify-center gap-8 mt-8'>
                {
                    shows.slice(0, 6).map((movie, idx) => (
                        <MovieCards key={idx} movies={movie} />
                    ))
                }
            </div>
            <div>
                <button onClick={() => { router.push("/movies"); scrollTo(0, 0) }} className='px-10 py-5 rounded-md transition text-sm cursor-pointer font-medium bg-blue-500 hover:bg-blue-700'>Show More</button>
            </div>

            <div>
                <Trailers />
            </div>
        </div>
    )
}

export default FeaturedSection
