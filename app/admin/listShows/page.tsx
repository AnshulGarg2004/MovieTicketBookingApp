'use client'
import Title from '@/components/admin/title';
import Loading from '@/components/loading';
import { Dashboard } from '@/data/dashboard';
import React, { useEffect, useState } from 'react'

interface ActiveMovie {
    id: number,
    title: string,
    image: string,
    trailer: string,
    rating: number,
    genre: string,
    release: string,
    duration: string,
    cbf: string,
    currency: string,
    description: string,


}
interface DashboardProps {
    totalBookings: number,
    totalRevenue: string,
    activeMovies: ActiveMovie[],
    totalUser: number
}

const ListShows = () => {
    const [shows, setShows] = useState<ActiveMovie[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const getShows = () => {
        setShows(Dashboard.activeMovies);
        setIsLoading(false);
    };

    useEffect(() => { getShows(); }, []);

    return !isLoading ?  (
        <>
        <Title first='Admin' second='Shows' />
        <div className='mt-6 overflow-x-auto max-w-4xl'>
            <table className=' border-collapse w-full text-nowrap overflow-hidden rounded-md'>
                <thead className=''>
                    <tr className='bg-rose-500/20 text-center font-bold text-white'>
                    <th className='p-2 font-medium pl-5'>Movie Name</th>
                    <th className='p-2 font-medium'>Show Time</th>
                    <th className='p-2 font-medium'>Total Booking</th>
                    <th className='p-2 font-medium'>Earning</th>
                </tr>
                </thead>
                <tbody className='text-sm font-light'>
                    {shows.map((show, idx) => (
                        <tr key={idx} className='border-b text-center border-rose-500/20 bg-rose-500/5 even:bg-rose-500/20'>
                            <td className='p-2 min-w-45 pl-2'>{show.title}</td>
                            <td className='p-2'>2025-12-19 7:00 AM</td>
                            <td className='p-2'>10</td>
                            <td className='p-2'>2200</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        </>
    ) : (
        <Loading />
    )
}

export default ListShows
