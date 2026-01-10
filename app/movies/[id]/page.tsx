'use client'

import BlurCircle from '@/components/blur-circle'
import DateSelect from '@/components/date-select'
import MovieCards from '@/components/movie-card'
import { AnimatedTooltip } from '@/components/ui/animated-tooltip'
import { Calendar, Clock, Heart, PlayCircleIcon, Star } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { movies } from '@/data/movies'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '@clerk/nextjs'

interface Cast {
  id: number
  name: string
  movieName: string
  image: string
}

interface TimeEntry { time: string; showId: string; cost: number }

interface Showtime {
  id: string
  date: string
  times: TimeEntry[]
}

interface MovieProps {
  _id: string
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
  // 'shows' comes from /api/get-shows/[id] as a map of date -> TimeEntry[]
  shows?: {
    [date: string]: { time: string; id: string; cost: number }[]
  }
}

const MovieId = () => {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const [show, setShow] = useState<MovieProps | null>(null)
  const [isFavourite, setIsFavourite] = useState(false)

  const handleFavourite = async () => {
    const { getToken } = useAuth();
    const token = await getToken();

    try {
      if (!token) {
        return toast.error("😒Login first");
      }
      const { data } = await axios.post('/api/favorites', { movieId: id }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (data.success) {
        setIsFavourite(!isFavourite);
        toast.success("Added to favouites");
      }
    } catch (error) {
      return toast.error("Internal server error");
    }
  }

  useEffect(() => {
    if (!id) return
    const load = async () => {
      try {
        const { data } = await axios.get(`/api/get-shows/${id}`)
        console.log('Movie API response:', data);
        if (data.success) {
          // Combine movie data with shows data
          const movieWithShows = {
            ...data.movie,
            shows: data.shows || {}
          };
          setShow(movieWithShows);
        }
      } catch (e) {
        console.error('API error:', e);
        return toast.error('Failed to fetch movie')
      }
    }

    load()
  }, [id])

  if (!show) {
    return <div className="text-center mt-40">Loading...</div>
  }

  return (
    <div className="px-6 md:px-16 lg:px-40 pt-32">

      {/* MOVIE HEADER */}
      <div className="flex flex-col gap-8 p-10 mx-auto md:flex-row max-w-6xl mt-20">
        <Image
          src={show.image || '/placeholder-movie.jpg'}
          alt={show.title}
          width={400}
          height={300}
          className="rounded-xl object-cover shadow-xl max-md:mx-auto"
        />

        <div className="relative flex flex-col gap-3">
          <BlurCircle top="-100px" left="-100px" />

          <h1 className="text-4xl font-bold my-4">{show.title || 'Movie Title'}</h1>

          <p className="flex items-center gap-2">
            <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
            {show.rating || 'N/A'}
          </p>

          <p className="text-gray-400 max-w-xl">{show.description || 'No description available'}</p>

          <p className="flex items-center gap-4 text-sm text-gray-300">
            <Clock /> {show.duration || 'N/A'} min
            <Calendar /> {show.release ? new Date(show.release).getFullYear() : 'N/A'}
          </p>

          <div className="flex gap-4 mt-6 flex-wrap">
            <button className="flex items-center gap-2 px-6 py-3 bg-neutral-800 hover:bg-neutral-900 rounded-lg transition">
              <PlayCircleIcon className="w-5 h-5" />
              Watch Trailer
            </button>

            <Link
              href="#dateSelect"
              className="px-8 py-3 bg-rose-600 hover:bg-rose-700 rounded-lg font-semibold transition"
            >
              Book Now
            </Link>

            <button
              onClick={handleFavourite}
              className="p-3 rounded-full bg-neutral-700 active:scale-95"
            >
              <Heart
                className={`w-5 h-5 ${isFavourite ? 'fill-rose-500 text-rose-500' : 'text-white'
                  }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* CASTS */}
      <h2 className="text-3xl text-center mt-24 mb-10">Casts</h2>

      <div className="flex gap-20 justify-center mb-16">
        <AnimatedTooltip items={show.casts?.slice(0, 10) || []} />
      </div>

      {/* DATE & TIME SELECTION */}
      {(() => {
        console.log('Show data:', show);
        const shows = show?.shows;
        console.log('Show.shows:', shows);
        if (shows && Object.keys(shows).length > 0) {
          return (
            <DateSelect
              movieId={show!._id}
              showtimes={Object.entries(shows).map(([date, times]: [string, any]) => ({
                id: date,
                date,
                times: times.map((t: any) => ({
                  time: t.time,
                  showId: t.id,
                  cost: t.cost
                }))
              }))}
            />
          )
        }

        return (
          <div className="text-center py-10">
            <p className="text-gray-400">No showtimes available for this movie</p>
            <p className="text-sm text-gray-500 mt-2">This movie needs to be added through the admin panel to have showtimes</p>
          </div>
        )
      })()}

      {/* RECOMMENDED MOVIES */}
      <div className="mt-24 mb-20">
        <h2 className="text-2xl font-bold text-center mb-10">
          You may also like
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {movies.slice(0, 4).map((movie) => (
            <MovieCards key={movie.id} movies={movie} />
          ))}
        </div>
      </div>

      {/* SHOW MORE */}
      <div className="flex justify-center mb-40">
        <button
          onClick={() => {
            router.push('/movies')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className="px-10 py-4 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700
          text-white font-semibold shadow-lg hover:from-rose-700 hover:to-rose-800 transition"
        >
          Show More
        </button>
      </div>
    </div>
  )
}

export default MovieId
