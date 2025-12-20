'use client'
import BlurCircle from '@/components/blur-circle'
import Loading from '@/components/loading'
import { movies } from '@/data/movies'
import { ArrowRightIcon, Calendar, Clock } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Cast {
    id: number
    name: string
    movieName: string
    image: string
}

interface Showtime {
    id: number
    date: string
    times: string[]
}

interface MovieProps {
    id: number
    title: string
    image: string
    trailer: string
    rating: number
    genre: string
    release: string
    duration: string
    cbf: string
    description: string
    casts: Cast[]
    showtimes: Showtime[]
}

const SeatLayout = () => {

    const groupRows = [["A", "B"], ["C", 'D'], ["E", "F"], ['G', 'H'], ["I", "J"]]

    const { id, showid } = useParams()
    const searchParams = useSearchParams()

    const date = searchParams.get('date')
    const time = searchParams.get('time')

    const [selectedSeats, setselectedSeats] = useState<[]>([]);
    const [show, setShow] = useState<MovieProps | null>(null)
    const [selectedTime, setSelectedTime] = useState<string | null>(time)

    const router = useRouter();

    // ❌ Guard
    if (!id || !showid || !date || !time) {
        toast.error('Internal Server Error')
        return null
    }

    const handleSeatClick = (seatId: string) => {
        // @ts-ignore
        if (!selectedSeats.includes(seatId) && selectedSeats?.length > 10) {
            toast.warning("😅You can only select 10 seats")
        }
        // @ts-ignore
        setselectedSeats((prev) => prev.includes(seatId) ? prev.filter((id) => id !== seatId) : [...prev, seatId])
    }

    const renderSeats = (row: string, count: number = 9) => {
        return (
            <div key={row} className="flex gap-2 mt-2">
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {Array.from({ length: count }, (_, i) => {
                        const seatId = `${row}${i + 1}`

                        return (
                            <button
                                key={seatId}
                                onClick={() => handleSeatClick(seatId)}
                                className={`h-8 w-8 rounded border border-rose-500 cursor-pointer
                ${
                                    // @ts-ignore
                                    selectedSeats.includes(seatId)
                                        ? 'bg-rose-500 text-white'
                                        : 'bg-transparent'
                                    }`}
                            >
                                {seatId}
                            </button>
                        )
                    })}
                </div>
            </div>
        )
    }


    // ✅ Fetch movie ONCE
    useEffect(() => {
        const movie = movies.find(m => m.id === Number(id))
        if (!movie) {
            toast.error('Movie not found')
            return
        }
        setShow(movie)
    }, [id])

    // ✅ Update URL when time changes
    useEffect(() => {
        if (!selectedTime) return
        router.replace(
            `/movies/${id}/bookTicket/${showid}?date=${date}&time=${selectedTime}`
        )
    }, [selectedTime, id, showid, date, router])

    if (!show) return <Loading />

    return (
        // ✅ PUSH CONTENT BELOW NAVBAR
        <div className="relative min-h-screen pt-28 px-6 md:px-16 lg:px-32">
            {/* BACKGROUND BLURS */}
            <BlurCircle top="150px" left="150px" />
            <BlurCircle bottom="-0" right="100px" />

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-white">{show.title}</h1>
                <p className="mt-2 flex items-center gap-2 text-zinc-400">
                    <Calendar size={18} /> {date}
                    <span className="mx-2">|</span>
                    <Clock size={18} /> {selectedTime}
                </p>
            </div>

            {/* TIME SELECT */}
            <div className="mb-16 flex flex-wrap gap-4">
                {show.showtimes[Number(showid) - 1].times.map(t => (
                    <button
                        key={t}
                        onClick={() => setSelectedTime(t)}
                        className={`px-5 py-3 rounded-xl text-sm font-medium transition-all
              ${selectedTime === t
                                ? 'bg-rose-600 text-white shadow-lg scale-105'
                                : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                            }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            {/* SEAT SECTION */}
            <div className="relative flex flex-col items-center">
                <h2 className="mb-4 text-2xl font-semibold text-white">
                    Select your Seats
                </h2>

                {/* SCREEN */}
                <svg
                    viewBox="0 0 585 29"
                    className="w-full max-w-2xl text-rose-500"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M585 29V17C585 17 406.824 0 292.5 0C178.176 0 0 17 0 17V29C0 29 175.5 12 292.5 12C404.724 12 585 29 585 29Z"
                        fill="currentColor"
                        fillOpacity="0.35"
                    />
                </svg>

                <p className="mt-2 text-sm text-zinc-400">
                    All eyes this way please
                </p>
                <div className='flex flex-col items-center mt-10 mb-40 text-xs text-gray-300'>
                    <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-1 mb-6'>
                        {groupRows[0].map(row => (renderSeats(row)))}
                    </div>

                    <div className='grid grid-cols-2 gap-11 m-1'>
                        {
                            groupRows.slice(1).map((group, idx) => (
                                <div key={idx}>
                                    {group.map(row => (renderSeats(row)))}
                                </div>
                            ))

                        }
                    </div>

                </div>


            </div>

            <div className='flex justify-center gap-1'>
                <button onClick={() => {
                    router.push(`/my-bookings`);
                    scrollTo(0, 0);
                }} className='bg-rose-600 hover:bg-rose-700/70 transition cursor-pointer px-10 font-medium py-3 flex items-center justify-center mt-10 gap-1 text-sm rounded-full active:scale-95'>Proceed to checkout! <ArrowRightIcon strokeWidth={3} className='w-4 h-4' /></button>

            </div>
        </div>
    )
}

export default SeatLayout
