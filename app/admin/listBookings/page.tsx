'use client'
import Title from '@/components/admin/title';
import Loading from '@/components/loading';
import { bookingData } from '@/data/booking';
import React, { useEffect, useState } from 'react'

interface BookingProps {
    id: number,
    title: string,
    duration: string,
    dateTime: string,
    isPaid: boolean,
    ticketQty: number,
    seats: string[],
    image: string,
    cost: string
}

const Bookings = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [bookings, setBookings] = useState<BookingProps[]>([]);

    const getbookings = () => {
        setBookings(bookingData);
        setIsLoading(false);
    }

    useEffect(() => { getbookings(); }, []);
    return !isLoading ? (
        <>
            <Title first='Admin' second='Bookings' />
            <div className='max-w-4xl mt-6 overflow-x-auto'>
                <table className='border-collapse rounded-md w-full overflow-hidden text-nowrap'>
                    <thead className='font-medium'>
                        <tr className='bg-rose-500/20 text-center text-white'>
                        <th className='p-2 font-medium pl-2'>Movie Name</th>
                        <th className='p-2 font-medium'>Show Time</th>
                        <th className='p-2 font-medium'>Seats</th>
                        <th className='p-2 font-medium'>Amount</th>
                        </tr>
                    </thead>
                    <tbody className='text-center'>
                        {bookings.map(booking => (
                            <tr key={booking.id} className='border-2 border-rose-500/20'>
                                <td className='p-2 min-w-45 pl-5'>{booking.title}</td>
                                <td className='p-2'>2025-12-19 4:00 PM</td>
                                <td className='p-2'>{booking.seats.join(", ")}</td>
                                <td className='p-2'>{booking.cost}</td>
                            </tr>
                        )) }
                    </tbody>
                </table>
            </div>
        </>
    ) : (
        <Loading />
    )
}

export default Bookings
