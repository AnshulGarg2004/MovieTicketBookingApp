'use client'
import React, { useState } from 'react'
import BlurCircle from './blur-circle'
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

interface TimeEntry { time: string; showId: string; cost: number }
interface Showtime {
  id: string
  date: string
  times: TimeEntry[]
}

interface DateSelectProps {
  movieId: string | number
  showtimes: Showtime[]
}

const DateSelect = ({ movieId, showtimes = [] }: DateSelectProps) => {
  const [selectedShow, setSelectedShow] = useState<Showtime | null>(null)
  const [selectedTime, setSelectedTime] = useState<TimeEntry | null>(null)
  const router = useRouter()

  const handleBookNow = () => {
    if (!selectedShow || !selectedTime) {
      toast.warning('Please select date and time')
      return
    }

    // include the concrete showId for booking
    router.push(
      `/movies/${movieId}/bookTicket/${selectedShow.id}?date=${selectedShow.date}&time=${selectedTime.time}&showId=${selectedTime.showId}`
    )
  }

  return (
    <div id="dateSelect" className="pt-24">

      {/* Card */}
      <div className="relative flex flex-col md:flex-row items-center justify-between gap-10 p-8 rounded-2xl border border-zinc-800 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 shadow-xl">

        {/* Decorative blur */}
        <BlurCircle top="-100px" left="-100px" />
        <BlurCircle top="100px" right="0" />

        {/* Title */}
        <p className="text-lg font-semibold text-white tracking-wide">
          Choose Date & Time
        </p>

        {/* Date selector */}
        <div className="flex items-center gap-5 text-sm mt-4 md:mt-0">

          <ChevronLeftIcon
            width={28}
            className="text-zinc-500"
          />

          <span className="grid grid-cols-3 md:flex flex-wrap md:max-w-lg gap-4">
            {showtimes.map((show) => {
              const isSelected = selectedShow?.id === show.id

              return (
                <button
                  key={show.id}
                  onClick={() => {
                    setSelectedShow(show)
                    setSelectedTime(null)
                  }}
                  className={`
                    flex flex-col items-center justify-center
                    h-14 w-16 rounded-xl cursor-pointer
                    transition-all duration-200
                    ${isSelected
                      ? 'bg-rose-600 text-white shadow-lg scale-105'
                      : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                    }
                  `}
                >
                  <span className="text-base font-semibold">
                    {new Date(show.date).getDate()}
                  </span>
                  <span className="text-xs uppercase tracking-wide">
                    {new Date(show.date).toLocaleDateString('en-US', {
                      month: 'short',
                    })}
                  </span>
                </button>
              )
            })}
          </span>

          <ChevronRightIcon
            width={28}
            className="text-zinc-500"
          />
        </div>
      </div>

      {/* Time selector */}
      {selectedShow && (
        <div className="mt-6 flex justify-center gap-4 flex-wrap">
          {selectedShow.times.map((t) => (
            <button
              key={t.showId}
              onClick={() => setSelectedTime(t)}
              className={`
                px-5 py-2 rounded-lg border transition-all
                ${selectedTime?.showId === t.showId
                  ? 'bg-rose-600 border-rose-600 text-white'
                  : 'bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800'
                }
              `}
            >
              {t.time}
            </button>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="flex justify-center">
        <button
          onClick={handleBookNow}
          className="
            mt-10 px-12 py-3 rounded-xl
            bg-gradient-to-r from-rose-600 to-rose-700
            text-white font-semibold tracking-wide
            shadow-lg
            hover:from-rose-700 hover:to-rose-800
            transition-all duration-200
            active:scale-95
          "
        >
          Book Tickets
        </button>
      </div>

    </div>
  )
}

export default DateSelect
