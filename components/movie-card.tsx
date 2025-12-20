'use client'
import { Star } from 'lucide-react';
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

// @ts-ignore
const MovieCards = ({movies}) => {
    const router =  useRouter();
  return (
    <div className='flex flex-col justify-between gap-4 p-3 bg-gray-800 rounded-2xl hover:-translate-y-1 transition duration-300 w-70'>
      <Image onClick={() => {router.push(`/movies/${movies.id}`); scrollTo(0,0)}} src={movies.image} alt={movies.title} width={200} height={300} className='rounded-lg w-full h-55 object-cover object-fit cursor-pointer' />
        <p className='mt-2 truncate font-semibold'>{movies.title}</p>

        <p className=''>{new Date(movies.release).getFullYear()} • {movies.genre} • {movies.duration} </p>
        <div className='flex items-center justify-between mt-4 pb-3'>
            <button onClick={() => {router.push(`/movies/${movies.id}`), scrollTo(0,0)}} className='px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-700 rounded-full font-medium transition'>Book Now</button>
            <p className='flex items-center gap-1 text-sm mt-1 pr-1 text-gray-400'><Star className='fill-blue-500 w-4 h-4
            '/> {movies.rating} </p>
        </div>
    </div>
  )
}

export default MovieCards
