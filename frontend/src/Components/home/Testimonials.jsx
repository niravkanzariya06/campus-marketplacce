import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import feedbackService from '../../services/feedbackService'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    feedbackService.getFeedback({ page: 1, limit: 3, sortBy: 'newest' })
      .then(res => {
        setTestimonials(res.documents || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const accentColors = ['dark:text-indigo-400 text-indigo-600', 'dark:text-cyan-400 text-cyan-600', 'dark:text-violet-400 text-violet-600']

  return (
    <section className="py-20 md:py-24 relative overflow-hidden">
      {/* Atmospheric background blooms */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/8 blur-[100px] rounded-full"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cyan-500/8 blur-[90px] rounded-full"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-violet-500/5 blur-[120px] rounded-full"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-4 gradient-text bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
            Student Voices
          </h2>
          <p className="text-on-surface-variant max-w-xl mx-auto leading-relaxed">
            Real experiences from students who've transformed their campus journey through Lumina.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {[1,2,3].map(i => (
              <div key={i} className="glass-card p-6 md:p-8 rounded-3xl animate-pulse">
                <div className="h-4 w-20 bg-white/10 rounded mb-6"></div>
                <div className="h-4 bg-white/10 rounded mb-3"></div>
                <div className="h-4 w-4/5 bg-white/10 rounded mb-8"></div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/10 rounded-full"></div>
                  <div className="h-4 w-24 bg-white/10 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-12">
            <span className="material-symbols-outlined text-6xl text-on-surface-variant/30 mb-4">forum</span>
            <p className="text-on-surface-variant text-lg mb-4">No feedback submitted yet. Be the first!</p>
            <Link
              to="/"
              onClick={() => {
                setTimeout(() => {
                  const el = document.getElementById('feedback')
                  el?.scrollIntoView({ behavior: 'smooth' })
                }, 100)
              }}
              className="text-indigo-400 underline"
            >
              Share your experience
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((t, index) => (
              <motion.div
                key={t.id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="perspective-container group"
              >
                <div className="tilt-card glass-card p-6 md:p-8 rounded-3xl relative" style={{ animationDelay: `${index * 100}ms` }}>
                  {/* Gradient border on hover */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"></div>

                  {/* Quote Icon with glow */}
                  <span className={`material-symbols-outlined text-4xl md:text-5xl opacity-15 absolute top-4 right-4 md:top-6 md:right-6 ${accentColors[index % 3]} blur-sm`}>
                    format_quote
                  </span>

                  {/* Star Rating with accent colors */}
                  <div className="flex items-center space-x-1 mb-6">
                    {[...Array(parseInt(t.rating, 10) || 0)].map((_, i) => (
                      <span key={i} className={`material-symbols-outlined text-lg ${accentColors[index % 3]}`} style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                    ))}
                  </div>

                  {/* Quote */}
                  <p className="text-base md:text-lg leading-relaxed mb-8 text-on-surface font-light">
                    "{t.message}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/40">
                      <span className="text-xl md:text-2xl text-on-surface font-headline font-bold">
                        {(t.fullName || '?')[0].toUpperCase()}
                      </span>
                    </div>
                    <div className="font-bold text-base text-on-surface">{t.fullName}</div>
                  </div>

                  {/* Subtle accent line bottom */}
                  <div className={`absolute bottom-0 left-8 right-8 h-0.5 bg-gradient-to-r ${accentColors[index % 3].replace('text-', 'from-')}/30 to-transparent rounded-full opacity-50`}></div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* View More Feedback Button */}
        {testimonials.length > 0 && (
          <motion.div
            className="mt-14 md:mt-16 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Link
              to="/feedback"
              className="group px-10 md:px-12 py-4 md:py-5 rounded-full glass border border-white/10 text-on-surface font-semibold text-base md:text-lg relative overflow-hidden hover:border-indigo-400/40 no-underline transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 inline-flex items-center gap-3"
            >
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-violet-500/20 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"></div>
              <span className="relative z-10 flex items-center gap-3">
                View More Feedback
                <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform" style={{ fontVariationSettings: "'FILL' 1" }}>
                  arrow_forward
                </span>
              </span>
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  )
}

export default Testimonials
