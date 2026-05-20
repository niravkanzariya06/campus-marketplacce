import React, { useEffect, useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import feedbackService from '../services/feedbackService'

const FeedbackPage = () => {
  const [feedbacks, setFeedbacks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState({ total: 0, totalPages: 0, limit: 6 })
  const [sortBy, setSortBy] = useState('newest')

  const PAGE_SIZE = 6

  const fetchFeedback = useCallback(async (page, sort) => {
    setLoading(true)
    try {
      const res = await feedbackService.getFeedback({ page, sortBy: sort, limit: PAGE_SIZE })
      setFeedbacks(res?.documents || [])
      setPagination(res?.pagination || { total: 0, page: 1, limit: PAGE_SIZE, totalPages: 0 })
      setLoading(false)
    } catch {
      setError('Failed to load feedback.')
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchFeedback(currentPage, sortBy)
  }, [currentPage, sortBy, fetchFeedback])

  const accentColors = ['text-indigo-400', 'text-cyan-400', 'text-violet-400']

  const handlePage = (page) => {
    if (page >= 1 && page <= pagination.totalPages) {
      setCurrentPage(page)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  // Generate page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = []
    const totalPagesToDisplay = 3
    let start = Math.max(1, currentPage - totalPagesToDisplay)
    let end = Math.min(pagination.totalPages, currentPage + totalPagesToDisplay)

    if (start > 1) pages.push(1)
    if (start > 2) pages.push('...')

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    if (end < pagination.totalPages - 1) pages.push('...')
    if (end < pagination.totalPages) pages.push(pagination.totalPages)

    return pages
  }

  return (
    <section className="py-20 md:py-24 relative overflow-hidden min-h-screen">
      {/* Atmospheric background blooms */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/8 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/8 blur-[90px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 mb-8 transition-colors group">
          <span className="material-symbols-outlined group-hover:-translate-x-1 transition-transform">arrow_back</span>
          Back to Home
        </Link>

        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-4 gradient-text bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
            All Student Feedback
          </h2>
          <p className="dark:text-gray-400 text-gray-600 max-w-xl mx-auto leading-relaxed">
            Every voice matters. Here's what our campus community has shared.
          </p>
        </div>

        {/* Sort toggle */}
        <div className="flex justify-center mb-8 md:mb-12">
          <div className="flex gap-2 glass rounded-full p-1">
            <button
              onClick={() => { setSortBy('newest'); setCurrentPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                sortBy === 'newest' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' : 'dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900'
              }`}
            >
              Newest First
            </button>
            <button
              onClick={() => { setSortBy('oldest'); setCurrentPage(1) }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                sortBy === 'oldest' ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md' : 'dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900'
              }`}
            >
              Oldest First
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="glass-card p-6 md:p-8 rounded-3xl animate-pulse">
                <div className="h-4 w-20 bg-white/10 rounded mb-6"></div>
                <div className="h-4 bg-white/10 rounded mb-3"></div>
                <div className="h-4 w-4/5 bg-white/10 rounded mb-8"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                  <div>
                    <div className="h-4 w-24 bg-white/10 rounded mb-2"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-400 text-lg">{error}</p>
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="text-center py-20">
            <span className="material-symbols-outlined text-6xl text-gray-600 mb-4">forum</span>
            <p className="dark:text-gray-400 text-gray-600 text-lg">No feedback submitted yet.</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {feedbacks.map((fb, index) => (
                <motion.div
                  key={fb.id || fb.$id || index}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                  className="perspective-container group"
                >
                  <div className="tilt-card glass-card p-6 md:p-8 rounded-3xl relative">
                    <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                    {/* Quote icon */}
                    <span className={`material-symbols-outlined text-4xl md:text-5xl opacity-15 absolute top-4 right-4 md:top-6 md:right-6 ${accentColors[index % 3]} blur-sm`}>
                      format_quote
                    </span>

                    {/* Star Rating */}
                    <div className="flex items-center space-x-1 mb-6">
                      {[...Array(parseInt(fb.rating, 10) || 0)].map((_, i) => (
                        <span key={i} className={`material-symbols-outlined text-lg ${accentColors[index % 3]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                          star
                        </span>
                      ))}
                    </div>

                    {/* Feedback text */}
                    <p className="text-base md:text-lg leading-relaxed mb-8 dark:text-gray-200/90 text-gray-700 font-light">
                      "{fb.message}"
                    </p>

                    {/* Author + date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/40">
                          <span className="text-xl md:text-2xl text-gray-300 font-headline font-bold">
                            {(fb.fullName || '?')[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="font-bold text-base dark:text-gray-100 text-gray-800">{fb.fullName}</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Pagination Controls */}
            {pagination.totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 md:gap-3 mt-12 md:mt-16"
              >
                {/* Previous button */}
                <button
                  onClick={() => handlePage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 hover:border-indigo-400/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:border-white/10"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>chevron_left</span>
                </button>

                {/* Page numbers */}
                {getPageNumbers().map((p, i) =>
                  p === '...' ? (
                    <span key={`ell-${i}`} className="text-gray-500 px-2">...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => handlePage(p)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        currentPage === p
                          ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/30'
                          : 'glass border border-white/10 dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 hover:border-indigo-400/40'
                      }`}
                    >
                      {p}
                    </button>
                  )
                )}

                {/* Next button */}
                <button
                  onClick={() => handlePage(currentPage + 1)}
                  disabled={currentPage === pagination.totalPages}
                  className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center dark:text-gray-400 text-gray-600 hover:dark:text-white hover:text-gray-900 hover:border-indigo-400/40 transition-all disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:text-gray-400 disabled:hover:border-white/10"
                >
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>chevron_right</span>
                </button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default FeedbackPage
