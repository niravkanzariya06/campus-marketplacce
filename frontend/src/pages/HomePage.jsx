import React, { useMemo } from 'react'
import usePageTitle from '../hooks/usePageTitle'
import { useSelector } from 'react-redux'
import Hero from '../Components/home/Hero'
import CuratedCollections from '../Components/home/CuratedCollections'
import CampusPulse from '../Components/home/CampusPulse'
import Testimonials from '../Components/home/Testimonials'
import FeedbackForm from '../Components/home/FeedbackForm'

const HomePage = () => {
  usePageTitle('Home');
  const products = useSelector((state) => state.products.products)
  const activeProducts = products.filter(p => p.status === "approved" || p.status === "active")

  // Get 4 trending products for the grid
  const trendingProducts = useMemo(() => {
    if (activeProducts.length === 0) return []
    // Take first 4 products (or all if less than 4)
    return activeProducts.slice(0, 4)
  }, [activeProducts])

  return (
    <div className='w-full flex flex-col items-center relative'>
      {/* Hero Section (includes feature strip) */}
      <Hero />

      {/* Curated Collections Section */}
      <CuratedCollections />

      {/* Campus Pulse Section - Trending Products - 5rem spacing */}
      <div className="w-full mt-20 md:mt-24 mb-20 md:mb-24 px-4 md:px-8">
        <CampusPulse trendingProducts={trendingProducts} />
      </div>

      {/* Testimonials - 5rem spacing */}
      <div className="w-full mb-20 md:mb-24 px-4 md:px-8">
        <Testimonials />
      </div>

      {/* Feedback Form - 5rem spacing */}
      <div id="feedback" className="w-full mb-20 md:mb-24 px-4 md:px-8">
        <FeedbackForm />
      </div>
    </div>
  )
}

export default HomePage