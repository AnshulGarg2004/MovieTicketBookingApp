'use client'
import Title from '@/components/admin/title'
import BlurCircle from '@/components/blur-circle'
import Loading from '@/components/loading'
import { Dashboard } from '@/data/dashboard'
import { ChartLineIcon, CircleDollarSignIcon, PlayCircleIcon, StarIcon, UserIcon } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

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

interface DashboardProps {
  totalBookings: number
  totalRevenue: string
  activeMovies: ActiveMovie[]
  totalUser: number
}

const AdminDashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [dashboardData, setDashboardData] = useState<DashboardProps>({ totalBookings: 0, totalRevenue: '₹ 0', activeMovies: [], totalUser: 0 })

  useEffect(() => {
    setDashboardData(Dashboard)
    setIsLoading(false)
  }, [])

  const dashboardCards = [
    { title: 'Total Bookings', value: dashboardData.totalBookings, icon: ChartLineIcon },
    { title: 'Total Revenue', value: dashboardData.totalRevenue, icon: CircleDollarSignIcon },
    { title: 'Active Movies', value: dashboardData.activeMovies.length, icon: PlayCircleIcon },
    { title: 'Total User', value: dashboardData.totalUser, icon: UserIcon }
  ]

  return !isLoading ? (
    <>
      <Title first="Admin" second="Dashboard" />

      <div className="relative flex flex-col gap-6 mt-6 overflow-hidden">
        <BlurCircle top="50px" left="100px" />

        <div className="flex flex-wrap gap-4 w-full overflow-hidden">
          {dashboardCards.map((card, idx) => (
            <div key={idx} className="flex items-center justify-between px-4 py-3 bg-rose-500/30 border border-rose-500/20 rounded-md w-full max-w-[220px]">
              <div className="flex flex-col gap-2">
                <h1 className="text-sm">{card.title}</h1>
                <p className="text-xl font-medium">{card.value}</p>
              </div>
              <card.icon className="w-6 h-6" />
            </div>
          ))}
        </div>

        <p className="mt-10 text-3xl font-medium">Active Shows</p>

        <div className="flex flex-wrap gap-6 mt-5 ">
          {dashboardData.activeMovies.map((show, idx) => (
            <div key={idx} className="w-[220px] rounded-xl  bg-rose-500/20 border border-rose-500/20 shadow-lg transition-all duration-300 hover:scale-105">
              <div className="relative h-64 w-full">
                <Image src={show.image} alt={show.title} fill className="object-cover" />
              </div>
              <p className="font-medium p-2 truncate">{show.title}</p>
              <div className="flex justify-between items-center px-2 pb-2">
                <p>{'₹ ' + show.currency}</p>
                <p className="flex items-center gap-1">
                  <StarIcon className="w-4 h-4 fill-rose-500 text-rose-500" />
                  {show.rating}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <Loading />
  )
}

export default AdminDashboard
