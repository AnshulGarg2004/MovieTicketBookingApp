'use client'
import Title from '@/components/admin/title'
import Loading from '@/components/loading'
import { Dashboard } from '@/data/dashboard'
import { useAuth } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import axios from 'axios'
import { CheckIcon, StarIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface ActiveMovie {
  id: number
  title: string
  image: string
  trailer: string
  rating: number
  genre: string
  release: string
  duration: string
  cbf: string
  currency: string
  description: string
}

type DateTimeSelection = {
  [date: string]: string[]
}

const AddShows =async () => {
  const [nowPlaying, setNowPlaying] = useState<ActiveMovie[]>([])
  const [selectedMovie, setSelectedMovie] = useState<number | null>(null)
  const [dateTimeSelection, setDateTimeSelection] = useState<DateTimeSelection>({})
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedTime, setSelectedTime] = useState('')
  const [showPrice, setShowPrice] = useState<number>(0)
  const [addingShow, setAddingShow] = useState(false);

  const {getToken} = useAuth();
      const token = getToken();

  const fetchNowPlaying = async() => {
    try {
      
      const {data} = await axios.get('/api/get-now-playing', {
        headers : {Authorization : `Bearer ${token}`}
      })

      if(data.success) {
        setNowPlaying(data.movie);
      }
    } catch (error) {
      console.error("Error in fetching movies", error);
      
    }
  }


  const handleDateTimeAdd = () => {
    if (!selectedDate || !selectedTime) {
      toast.error('Please select both date and time')
      return
    }

    setDateTimeSelection(prev => {
      const times = prev[selectedDate] || []
      if (times.includes(selectedTime)) return prev
      return { ...prev, [selectedDate]: [...times, selectedTime] }
    })

    setSelectedTime('')
  }

  const user = await auth();

  useEffect(() => {
    if(user) {
      fetchNowPlaying();
    }
  }, [user])

  const handleRemoveTime = (date: string, time: string) => {
    setDateTimeSelection(prev => {
      const filtered = prev[date].filter(t => t !== time)
      if (filtered.length === 0) {
        const { [date]: _, ...rest } = prev
        return rest
      }
      return { ...prev, [date]: filtered }
    })
  }

  const handleSubmit  =async() => {
    try {
      setAddingShow(true);
      if(!selectedMovie || Object.keys(dateTimeSelection).length === 0 || !showPrice) {
        return toast.error("😒Missing required fields");
      }

      const showInput = Object.entries(dateTimeSelection).map(([date, time]) => ({
        date, time
      }));

      const payload = {
        movieId : selectedMovie,
        showInput,
        showPrice : Number(showPrice)
      }

      const {data} = await axios.post('/api/add-show', payload, {
        headers : {Authorization : `Bearer ${token}`}
      })

      if(data.success) {
         toast.success("🎉 Data added successfully");
         setSelectedMovie(null);
         setDateTimeSelection({});
         setShowPrice(0);
      }
      else {
        return toast.error("Error in adding data");
      }
    } catch (error) {
      console.error("Submission error: ", error);
      return toast.error("Internal server error");
    }
    setAddingShow(false);
  }

  if (nowPlaying.length === 0) return <Loading />

  return (
    <>
      <Title first="Add" second="Shows" />

      <div className="relative min-h-screen overflow-x-hidden">

        {/* NOW PLAYING */}
        <p className="mt-10 text-xl font-medium">Now Playing</p>

        <div className="flex flex-wrap gap-6 mt-6">
          {nowPlaying.map(movie => (
            <div
              key={movie.id}
              onClick={() => setSelectedMovie(movie.id)}
              className="relative w-44 rounded-xl overflow-hidden bg-rose-500/10 border border-rose-500/20 shadow-lg cursor-pointer transition-transform duration-300 hover:scale-105"
            >
              <div className="relative h-64 w-full">
                <Image src={movie.image} alt={movie.title} fill className="object-cover" />
              </div>

              <div className="absolute bottom-0 left-0 w-full bg-black/70 p-2 flex justify-between text-sm">
                <p className="flex items-center gap-1 text-gray-300">
                  <StarIcon className="w-4 h-4 fill-rose-500 text-rose-500" />
                  {movie.rating}
                </p>
                <p className="text-gray-400">Votes</p>
              </div>

              {selectedMovie === movie.id && (
                <div className="absolute top-2 right-2 bg-rose-500 h-6 w-6 rounded flex items-center justify-center">
                  <CheckIcon className="w-4 h-4 text-white" strokeWidth={2.5} />
                </div>
              )}

              <div className="p-2">
                <p className="font-medium truncate">{movie.title}</p>
                <p className="text-sm text-gray-400">{movie.release}</p>
              </div>
            </div>
          ))}
        </div>

        {/* SHOW PRICE */}
        <div className="mt-10">
          <label className="block text-sm font-medium mb-2">Show Price</label>
          <div className="inline-flex items-center gap-2 border border-rose-500/30 px-3 py-2 rounded-lg bg-black/20">
            <span className="text-gray-400">₹</span>
            <input
              type="number"
              min={0}
              value={showPrice}
              onChange={e => setShowPrice(Number(e.target.value))}
              className="bg-transparent outline-none text-sm w-32"
              placeholder="Enter price"
            />
          </div>
        </div>

        {/* DATE & TIME */}
        <div className="mt-8">
          <label className="block text-sm font-medium mb-2">Select Date & Time</label>

          <div className="inline-flex items-center gap-3 border border-rose-500/30 p-2 rounded-lg bg-black/20">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent text-white outline-none text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
            />
            <input
              type="time"
              value={selectedTime}
              onChange={e => setSelectedTime(e.target.value)}
              className="bg-transparent text-white outline-none text-sm cursor-pointer [&::-webkit-calendar-picker-indicator]:invert"
            />
            <button
              onClick={handleDateTimeAdd}
              className="bg-rose-500 text-white px-4 py-2 text-sm rounded-lg hover:bg-rose-600 transition"
            >
              Add Time
            </button>
          </div>

          {/* SELECTED SHOW TIMES (GROUPED BY DATE) */}
          <div className="mt-5 flex flex-col gap-3">
            {Object.entries(dateTimeSelection).map(([date, times]) => (
              <div
                key={date}
                className="flex flex-wrap items-center gap-3 px-4 py-2 rounded-lg text-sm"
              >
                <span className="font-medium text-white">
                  {new Date(date).toLocaleDateString('en-IN', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })} :
                </span>

                {times.map(time => (
                  <span
                    key={time}
                    className="px-2 py-1 bg-black/30 rounded-md text-gray-200 flex items-center gap-1"
                  >
                    {time}
                    <button
                      onClick={() => handleRemoveTime(date, time)}
                      className="text-rose-400 hover:text-rose-500 ml-1"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

      </div>
      <button onClick={handleSubmit} disabled={addingShow} className='bg-rose-500 text-white px-8 py-2 mt-6 rounded hover:
      bg-rose-500/90 transition-all cursor-pointer'>Add Show</button>
    </>
  )
}

export default AddShows
