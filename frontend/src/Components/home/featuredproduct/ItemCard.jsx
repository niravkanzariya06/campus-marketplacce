import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import { FiHeart } from 'react-icons/fi'
import { FaHeart } from 'react-icons/fa'
import { useSelector } from 'react-redux'
import favoriteService from '../../../services/favoriteService'
import { Package } from 'lucide-react'

const ItemCard = ({ imgUrl, name, price, id, showFavorite = true }) => {
  const user = useSelector((state) => state.auth.userData)
  const [isFavorited, setIsFavorited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoading, setImageLoading] = useState(true)

  useEffect(() => {
    const checkFavorite = async () => {
      if (user && id) {
        const favorited = await favoriteService.isFavorited(user.$id, id)
        setIsFavorited(favorited)
      }
    }
    checkFavorite()
  }, [user, id])

  const handleFavoriteClick = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      alert('Please login to add favorites')
      return
    }

    if (loading) return

    try {
      setLoading(true)
      if (isFavorited) {
        await favoriteService.removeFavorite(user.$id, id)
        setIsFavorited(false)
      } else {
        await favoriteService.addFavorite(user.$id, id)
        setIsFavorited(true)
      }
    } catch (error) {
      console.error('Error toggling favorite:', error)
      alert('Failed to update favorite')
    } finally {
      setLoading(false)
    }
  }

  // Fixed height card container to ensure all cards same height
  return (
    <Link to={`/product/${id}`} className="block group">
      <div className="h-full relative rounded-2xl p-3 sm:p-4 md:p-6 bg-white/5 backdrop-blur dark:border-white/10 border-gray-200 hover:scale-105 transition-all duration-300 flex flex-col">
        {/* Product Image - Centered, contained */}
        <div className="flex-1 flex items-center justify-center mb-3 sm:mb-4 min-h-[140px] sm:min-h-[192px] relative">
          {imageLoading && !imageError && imgUrl && (
            <div className="absolute inset-0 rounded-xl animate-pulse-skeleton bg-white/5"></div>
          )}
          {imageError || !imgUrl ? (
            <div className="flex items-center justify-center w-full h-full bg-white/5 rounded-xl">
              <Package className="w-10 h-10 text-gray-500" />
            </div>
          ) : (
            <img
              src={imgUrl}
              alt={name}
              className="h-36 sm:h-48 object-contain rounded-xl transition-opacity duration-300"
              loading="lazy"
              onLoad={() => setImageLoading(false)}
              onError={() => { setImageError(true); setImageLoading(false); }}
            />
          )}
        </div>

        {/* Product Name */}
        <h3 className="text-sm sm:text-base md:text-lg font-medium text-text-onSurface dark:text-white/90 leading-tight mb-2 sm:mb-4 line-clamp-2">
          {name}
        </h3>

        {/* Bottom Section: Price + Button */}
        <div className="mt-auto space-y-3">
          <div className="text-base sm:text-lg md:text-xl font-bold text-cyan-400">
            ₹{parseFloat(price).toLocaleString('en-IN')}
          </div>

          {showFavorite && (
            <button
              onClick={handleFavoriteClick}
              className={`absolute top-3 right-3 sm:top-6 sm:right-6 z-10 p-1.5 sm:p-2 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 transition-all duration-200 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
              title={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              {isFavorited ? (
                <FaHeart className="w-4 h-4 text-red-500" />
              ) : (
                <FiHeart className="w-4 h-4 text-gray-400 group-hover:text-red-400" />
              )}
            </button>
          )}

          <div className="w-full py-2 sm:py-3 rounded-xl border border-white/20 text-xs sm:text-sm font-medium text-text-onSurface dark:text-white/80 hover:bg-white/10 transition-all duration-200 text-center">
            View Details
          </div>
        </div>
      </div>
    </Link>
  )
}

export default ItemCard
