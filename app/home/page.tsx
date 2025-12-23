'use client'
import React from 'react'
import Navbar from '@/components/navbar'
import { HeroCarousal } from '@/components/hero-carousal'
import FeaturedSection from '@/components/featured-section'

const HomePage = () => {
  return (
    <div>
      <HeroCarousal />
      <FeaturedSection />
    </div>
  )
}

export default HomePage
