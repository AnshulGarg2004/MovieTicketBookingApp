// 'use client'
// import BlurCircle from '@/components/blur-circle'
// import Loading from '@/components/loading'
// import { useAuth } from '@clerk/nextjs'
// import { auth } from '@clerk/nextjs/server'
// import axios from 'axios'
// import { ArrowRightIcon, Calendar, Clock } from 'lucide-react'
// import { useParams, useRouter, useSearchParams } from 'next/navigation'
// import React, { useEffect, useState } from 'react'
// import { toast } from 'sonner'

// interface Cast {
//     id: number
//     name: string
//     movieName: string
//     image: string
// }

// interface TimeEntry { time: string; id: string; cost: number }

// interface Showtime {
//     id: string
//     date: string
//     times: TimeEntry[]
// }

// interface MovieProps {
//     _id: string
//     title: string
//     image: string
//     trailer: string
//     rating: number
//     genre: string
//     release: string
//     duration: string
//     cbf: string
//     description: string
//     casts: Cast[]
//     showtimes: Showtime[]
// }

// const SeatLayout = () => {

//     const groupRows = [["A", "B"], ["C", 'D'], ["E", "F"], ['G', 'H'], ["I", "J"]]

//     const { id, showid } = useParams()
//     const searchParams = useSearchParams()

//     const date = searchParams.get('date')
//     const time = searchParams.get('time')

//     const [show, setShow] = useState(null);
//     const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
//     const [movie, setMovie] = useState<MovieProps | null>(null)
//     const [selectedTime, setSelectedTime] = useState<string | null>(time)
//     const [occupiedSeats, setOccupiedSeats] = useState<string[]>([]);
//     const [currentShowMeta, setCurrentShowMeta] = useState<{ showId?: string; cost?: number } | null>(null)

//     const router = useRouter();

//     useEffect(() => {
//         const getShow = async() => {
//             const user = await auth();
//             const {getToken} = useAuth();
//             const token = await getToken();

//             try {
//                 const {data} = await axios.get(`/api/get-show/${showid}`);

//                 if(data.success) {
//                     setShow(data);
//                 }
//             } catch (error) {
//                 return toast.error("Cannot book seats");
//             }
//         }

//         getShow();
//     }, [])

    
//     // ❌ Guard
//     if (!id || !date || !time) {
//         toast.error('Internal Server Error')
//         return null
//     }

//     const handleSeatClick = (seatId: string) => {
//         if (selectedSeats.includes(seatId)) {
//             setSelectedSeats(prev => prev.filter(s => s !== seatId))
//             return
//         }

//         if (selectedSeats.length >= 10) {
//             toast.warning("😅You can only select 10 seats")
//             return
//         }

//         setSelectedSeats(prev => [...prev, seatId])
//     }

//     const renderSeats = (row: string, count: number = 9) => {
//         return (
//             <div key={row} className="flex gap-2 mt-2">
//                 <div className="flex flex-wrap items-center justify-center gap-2">
//                     {Array.from({ length: count }, (_, i) => {
//                         const seatId = `${row}${i + 1}`

//                         return (
//                             <button
//                                 key={seatId}
//                                 onClick={() => handleSeatClick(seatId)}
//                                 className={`h-8 w-8 rounded border border-rose-500 cursor-pointer
//                 ${
//                                     // @ts-ignore
//                                     selectedSeats.includes(seatId)
//                                         ? 'bg-rose-500 text-white'
//                                         : 'bg-transparent'
//                                     }`}
//                             >
//                                 {seatId}
//                             </button>
//                         )
//                     })}
//                 </div>
//             </div>
//         )
//     }


//     // ✅ Fetch movie & show meta ONCE
//     useEffect(() => {
//         const load = async () => {
//             try {
//                 const res = await fetch(`/api/get-shows/${id}`)
//                 const data = await res.json()
//                 if (!data?.success) {
//                     toast.error(data?.message || 'Failed to load')
//                     return
//                 }

//                 setMovie(data.movie)

//                 // find the meta for the currently selected time (showId param prioritized)
//                 const showsObj = data.shows || {}
//                 const showIdParam = searchParams.get('showId')
//                 let found: any = null
//                 for (const [d, times] of Object.entries(showsObj)) {
//                     for (const t of times as any[]) {
//                         if (t.time === time || t.id === showIdParam) {
//                             found = t
//                             break
//                         }
//                     }
//                     if (found) break
//                 }

//                 if (found) {
//                     setCurrentShowMeta({ showId: found.id, cost: found.cost })
//                 }

//             } catch (e) {
//                 toast.error('Failed to fetch show data')
//             }
//         }

//         load()
//     }, [id, time, searchParams])

//     // ✅ Update URL when time changes
//     useEffect(() => {
//         if (!selectedTime) return
//         router.replace(
//             `/movies/${id}/bookTicket/${showid}?date=${date}&time=${selectedTime}`
//         )
//     }, [selectedTime, id, showid, date, router])

//     if (!movie) return <Loading />

//     return (
//         // ✅ PUSH CONTENT BELOW NAVBAR
//         <div className="relative min-h-screen pt-28 px-6 md:px-16 lg:px-32">
//             {/* BACKGROUND BLURS */}
//             <BlurCircle top="150px" left="150px" />
//             <BlurCircle bottom="-0" right="100px" />

//             {/* HEADER */}
//             <div className="mb-8">
//                 <h1 className="text-3xl font-bold text-white">{movie.title}</h1>
//                 <p className="mt-2 flex items-center gap-2 text-zinc-400">
//                     <Calendar size={18} /> {date}
//                     <span className="mx-2">|</span>
//                     <Clock size={18} /> {selectedTime}
//                 </p>
//             </div>

//             {/* TIME SELECT */}
//             <div className="mb-16 flex flex-wrap gap-4">
//                 {/* render times for the selected date */}
//                 {movie?.showtimes?.find((s) => s.id === showid)?.times?.map((t) => (
//                     <button
//                         key={t.id}
//                         onClick={() => { setSelectedTime(t.time); setCurrentShowMeta({ showId: t.id, cost: t.cost }) }}
//                         className={`px-5 py-3 rounded-xl text-sm font-medium transition-all
//               ${selectedTime === t.time
//                                 ? 'bg-rose-600 text-white shadow-lg scale-105'
//                                 : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
//                             }`}
//                     >
//                         {t.time}
//                     </button>
//                 ))}
//             </div>

//             {/* SEAT SECTION */}
//             <div className="relative flex flex-col items-center">
//                 <h2 className="mb-4 text-2xl font-semibold text-white">
//                     Select your Seats
//                 </h2>

//                 {/* SCREEN */}
//                 <svg
//                     viewBox="0 0 585 29"
//                     className="w-full max-w-2xl text-rose-500"
//                     xmlns="http://www.w3.org/2000/svg"
//                 >
//                     <path
//                         d="M585 29V17C585 17 406.824 0 292.5 0C178.176 0 0 17 0 17V29C0 29 175.5 12 292.5 12C404.724 12 585 29 585 29Z"
//                         fill="currentColor"
//                         fillOpacity="0.35"
//                     />
//                 </svg>

//                 <p className="mt-2 text-sm text-zinc-400">
//                     All eyes this way please
//                 </p>
//                 <div className='flex flex-col items-center mt-10 mb-40 text-xs text-gray-300'>
//                     <div className='grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-1 mb-6'>
//                         {groupRows[0].map(row => (renderSeats(row)))}
//                     </div>

//                     <div className='grid grid-cols-2 gap-11 m-1'>
//                         {
//                             groupRows.slice(1).map((group, idx) => (
//                                 <div key={idx}>
//                                     {group.map(row => (renderSeats(row)))}
//                                 </div>
//                             ))

//                         }
//                     </div>

//                 </div>


//             </div>

//             <div className='flex justify-center gap-1'>
//                 <button onClick={() => {
//                     router.push(`/my-bookings`);
//                     scrollTo(0, 0);
//                 }} className='bg-rose-600 hover:bg-rose-700/70 transition cursor-pointer px-10 font-medium py-3 flex items-center justify-center mt-10 gap-1 text-sm rounded-full active:scale-95'>Proceed to checkout! <ArrowRightIcon strokeWidth={3} className='w-4 h-4' /></button>

//             </div>
//         </div>
//     )
// }

// export default SeatLayout



'use client'

import BlurCircle from '@/components/blur-circle'
import Loading from '@/components/loading'
import { useAuth } from '@clerk/nextjs'
import axios from 'axios'
import { ArrowRightIcon, Calendar, Clock } from 'lucide-react'
import { useParams, useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface TimeEntry {
  time: string
  id: string
  cost: number
  occupiedSeats: string[]
}

type ShowsByDate = {
  [date: string]: TimeEntry[]
}

interface MovieProps {
  _id: string
  title: string
  image: string
  duration: string
  release: string
}

const SeatLayout = () => {
  const groupRows = [['A', 'B'], ['C', 'D'], ['E', 'F'], ['G', 'H'], ['I', 'J']]

  const { id, showid } = useParams<{ id: string; showid: string }>()
  const searchParams = useSearchParams()
  const router = useRouter()
  const { getToken, isSignedIn } = useAuth()

  const date = searchParams.get('date')
  const time = searchParams.get('time')

  const [movie, setMovie] = useState<MovieProps | null>(null)
  const [shows, setShows] = useState<ShowsByDate>({})
  const [occupiedSeats, setOccupiedSeats] = useState<string[]>([])
  const [selectedSeats, setSelectedSeats] = useState<string[]>([])
  const [selectedTime, setSelectedTime] = useState<string | null>(time)
  const [currentShowMeta, setCurrentShowMeta] = useState<{ showId: string; cost: number } | null>(null)
  const [loading, setLoading] = useState(true)

  // ❌ Guard
  if (!id || !date || !time) {
    toast.error('Invalid booking data')
    return null
  }

  // ✅ Fetch movie + showtimes + occupied seats
  useEffect(() => {
    const load = async () => {
      try {
        console.log(`Fetching show data for movie ${id}`);
        const { data } = await axios.get(`/api/get-shows/${id}`)
        console.log('API response:', data);
        
        if (!data.success) {
          toast.error(data.message || 'Failed to load shows')
          return
        }

        setMovie(data.movie)
        setShows(data.shows || {})

        // Find selected show
        const timesForDate = data.shows?.[date] || []
        const found = timesForDate.find((t: TimeEntry) => t.time === time || t.id === showid)

        if (!found) {
          console.log('Show not found for:', { date, time, showid });
          toast.error('Show not found')
          return
        }

        setCurrentShowMeta({ showId: found.id, cost: found.cost })
        setOccupiedSeats(found.occupiedSeats || [])
      } catch (error: any) {
        console.error('Fetch error:', error);
        toast.error('Failed to fetch show data')
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [id, date, time, showid])

  // ✅ Update URL when time changes
  useEffect(() => {
    if (!selectedTime) return
    router.replace(
      `/movies/${id}/bookTicket/${showid}?date=${date}&time=${selectedTime}`
    )
  }, [selectedTime, id, showid, date, router])

  // ✅ Seat click handler
  const handleSeatClick = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(prev => prev.filter(s => s !== seatId))
      return
    }

    if (selectedSeats.length >= 10) {
      return toast.warning('😅 You can only select 10 seats')
      
    }
    if(occupiedSeats.includes(seatId)) {
        return toast.error('Seat already occupied');
    }


    setSelectedSeats(prev => prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    )
  }


    const bookTicket = async() => {
        try {
            if(!isSignedIn) {
                return toast.warning("😒Login first");
            }
            if(!selectedSeats.length) {
                return toast.error("😒Select seats first")
            }
            if(!currentShowMeta) {
                return toast.error("Show information missing")
            }

            const token = await getToken();
            const payload = {
                showId: currentShowMeta.showId,
                seats: selectedSeats,
                movieId: movie?._id,
                ticketQty: selectedSeats.length,
                movieTitle: movie?.title,
                movieImage: movie?.image,
                duration: movie?.duration,
                showDateTime: `${date}T${selectedTime}`
            };
            
            console.log('Booking payload:', payload);
            
            const {data} = await axios.post('/api/booking', payload)
            console.log('Booking response:', data);

            if(data.success) {
                console.log('Redirecting to:', data.url);
                window.location.href = data.url;
            } else {
                toast.error(data.message || 'Booking failed');
            }

        } catch (error: any) {
            console.error('Booking error:', error.response?.data || error.message);
            return toast.error(error.response?.data?.message || error.message)    
        }
    }


  // ✅ Render seats
  const renderSeats = (row: string, count: number = 9) => (
    <div key={row} className="flex gap-2 mt-2">
      {Array.from({ length: count }, (_, i) => {
        const seatId = `${row}${i + 1}`
        const isOccupied = occupiedSeats.includes(seatId)
        const isSelected = selectedSeats.includes(seatId)

        return (
          <button
            key={seatId}
            disabled={isOccupied}
            onClick={() => handleSeatClick(seatId)}
            className={`h-8 w-8 rounded border text-xs transition-colors
              ${
                isOccupied 
                  ? 'bg-red-500 text-white cursor-not-allowed opacity-50' 
                  : isSelected 
                    ? 'bg-rose-500 text-white border-rose-500' 
                    : 'bg-transparent border-gray-400 hover:border-rose-500'
              }`}
          >
            {seatId}
          </button>
        )
      })}
    </div>
  )

  if (loading || !movie) return <Loading />

  return (
    <div className="relative min-h-screen pt-28 px-6 md:px-16 lg:px-32">
      <BlurCircle top="150px" left="150px" />
      <BlurCircle bottom="0" right="100px" />

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{movie.title}</h1>
        <p className="mt-2 flex items-center gap-2 text-zinc-400">
          <Calendar size={18} /> {date}
          <span>|</span>
          <Clock size={18} /> {selectedTime}
        </p>
      </div>

      {/* TIME SELECT */}
      <div className="mb-16 flex flex-wrap gap-4">
        {(shows[date] || []).map((t: TimeEntry) => (
          <button
            key={t.id}
            onClick={() => {
              setSelectedTime(t.time)
              setCurrentShowMeta({ showId: t.id, cost: t.cost })
              setOccupiedSeats(t.occupiedSeats || [])
              setSelectedSeats([])
            }}
            className={`px-5 py-3 rounded-xl text-sm font-medium transition-all
              ${
                selectedTime === t.time
                  ? 'bg-rose-600 text-white shadow-lg scale-105'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
          >
            {t.time}
          </button>
        ))}
      </div>

      {/* SEAT LAYOUT */}
      <div className="flex flex-col items-center mt-10 mb-40 text-xs text-gray-300">
        {/* LEGEND */}
        <div className="flex gap-6 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-transparent border border-gray-400 rounded"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-rose-500 rounded"></div>
            <span>Selected</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Occupied</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-1 gap-8 md:gap-1 mb-6">
          {groupRows[0].map(row => renderSeats(row))}
        </div>

        <div className="grid grid-cols-2 gap-11">
          {groupRows.slice(1).map((group, idx) => (
            <div key={idx}>
              {group.map(row => renderSeats(row))}
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={bookTicket}
          className="bg-rose-600 hover:bg-rose-700 px-10 py-3 rounded-full flex items-center gap-2"
        >
          Proceed to checkout
          <ArrowRightIcon className="w-4 h-4" strokeWidth={3} />
        </button>
      </div>
    </div>
  )
}

export default SeatLayout
