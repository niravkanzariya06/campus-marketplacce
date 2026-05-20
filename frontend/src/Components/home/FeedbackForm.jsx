import React, { useState } from 'react'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars
import feedbackService from '../../services/feedbackService'

const FeedbackForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    rating: 0,
    message: ''
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Validation rules (matches backend)
  const validateForm = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length > 255) {
      newErrors.fullName = 'Full name is too long (max 255 characters)'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    } else if (formData.email.trim().length > 255) {
      newErrors.email = 'Email is too long (max 255 characters)'
    }

    if (formData.rating === 0) {
      newErrors.rating = 'Please select a rating'
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Feedback message is required'
    } else if (formData.message.trim().length > 2000) {
      newErrors.message = 'Message is too long (max 2000 characters)'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  // Handle star rating click
  const handleRatingClick = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }))
    if (errors.rating) {
      setErrors(prev => ({
        ...prev,
        rating: ''
      }))
    }
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Submit to backend API
      await feedbackService.submitFeedback({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        rating: formData.rating,
        message: formData.message.trim()
      })

      setIsSubmitting(false)
      setIsSubmitted(true)

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false)
        setFormData({
          fullName: '',
          email: '',
          rating: 0,
          message: ''
        })
      }, 3000)
    } catch (error) {
      setIsSubmitting(false)

      // Display error message
      const errorMessage = error.response?.data?.message || error.message || 'Failed to submit feedback. Please try again.'
      alert(errorMessage) // Simple approach, can be enhanced with toast
    }
  }

  return (
    <section className="w-full max-w-4xl mx-auto px-4 md:px-8 py-20 md:py-24">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-headline text-3xl md:text-4xl font-extrabold mb-4 gradient-text bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent">
          Share Your Experience
        </h2>
        <p className="dark:text-gray-300 text-gray-600 max-w-xl mx-auto leading-relaxed">
          Help us improve Lumina. Your feedback shapes the future of campus marketplace.
        </p>
      </div>

      {/* Feedback Form Card - Glassmorphism */}
      <div className="glass-card rounded-2xl p-6 md:p-10 relative overflow-hidden">
        {/* Gradient accent border on hover */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-violet-500/5 to-cyan-500/10 opacity-0 hover:opacity-100 transition-opacity duration-500 -z-10"></div>

        {isSubmitted ? (
          // Success Message
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <span className="material-symbols-outlined text-white text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                check_circle
              </span>
            </div>
            <h3 className="font-headline font-bold text-2xl md:text-3xl dark:text-white text-gray-900 mb-3">
              Thank You!
            </h3>
            <p className="dark:text-gray-300 text-gray-600 max-w-md mx-auto">
              Your feedback has been submitted successfully. We appreciate you taking the time to help us improve.
            </p>
          </motion.div>
        ) : (
          // Form
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label htmlFor="fullName" className="block text-sm font-medium dark:text-gray-300 text-gray-600">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className={`lumina-input w-full px-4 py-3 rounded-xl ${
                  errors.fullName ? 'border-red-500/50 focus:border-red-500 focus:shadow-red-500/20' : ''
                }`}
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium dark:text-gray-300 text-gray-600">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`lumina-input w-full px-4 py-3 rounded-xl ${
                  errors.email ? 'border-red-500/50 focus:border-red-500 focus:shadow-red-500/20' : ''
                }`}
                placeholder="your.email@university.edu"
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Star Rating */}
            <div className="space-y-3">
              <label className="block text-sm font-medium dark:text-gray-300 text-gray-600">
                Rating <span className="dark:text-gray-500 text-gray-400 font-normal">(required)</span>
              </label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    onClick={() => handleRatingClick(star)}
                    whileHover={{ scale: 1.15 }}
                    whileTap={{ scale: 0.95 }}
                    className="relative focus:outline-none"
                  >
                    <span
                      className={`material-symbols-outlined text-4xl md:text-5xl transition-all duration-300 ${
                        star <= formData.rating
                          ? 'text-amber-400'
                          : 'text-gray-600 hover:text-gray-500'
                      }`}
                      style={{
                        fontVariationSettings: "'FILL' 1",
                        textShadow: star <= formData.rating
                          ? '0 0 20px rgba(251, 191, 36, 0.5)'
                          : 'none'
                      }}
                    >
                      star
                    </span>
                  </motion.button>
                ))}
              </div>
              {formData.rating > 0 && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-amber-400"
                >
                  {formData.rating === 1 && "Poor - We'll do better"}
                  {formData.rating === 2 && "Fair - Room for improvement"}
                  {formData.rating === 3 && "Good - Thanks for your feedback!"}
                  {formData.rating === 4 && "Very Good - We appreciate it!"}
                  {formData.rating === 5 && "Excellent - You rock! 🎉"}
                </motion.p>
              )}
              {errors.rating && (
                <p className="text-red-400 text-xs flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">error</span>
                  {errors.rating}
                </p>
              )}
            </div>

            {/* Feedback Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-sm font-medium dark:text-gray-300 text-gray-600">
                Your Feedback <span className="text-red-400">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={5}
                className={`lumina-input w-full px-4 py-3 rounded-xl resize-none ${
                  errors.message ? 'border-red-500/50 focus:border-red-500 focus:shadow-red-500/20' : ''
                }`}
                placeholder="Tell us what you love, what could be better, or any ideas you have..."
              />
              <div className="flex justify-between items-center">
                {errors.message ? (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">error</span>
                    {errors.message}
                  </p>
                ) : (
                  <div></div>
                )}
                <span className={`text-xs ${formData.message.length >= 10 && formData.message.length <= 2000 ? 'dark:text-cyan-400 text-cyan-600' : 'dark:text-gray-500 text-gray-400'}`}>
                  {formData.message.length}/2000 characters
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold text-base md:text-lg hover:from-indigo-500 hover:to-violet-500 transition-all duration-300 shadow-[0_0_30px_-10px_rgba(99,102,241,0.6)] hover:shadow-[0_0_50px_-10px_rgba(139,92,246,0.8)] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 relative overflow-hidden group"
            >
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-500 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-300"></div>

              <span className="relative z-10 flex items-center justify-center gap-3">
                {isSubmitting ? (
                  <>
                    <span className="material-symbols-outlined animate-spin">refresh</span>
                    Submitting...
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                      send
                    </span>
                    Submit Feedback
                  </>
                )}
              </span>
            </motion.button>
          </form>
        )}
      </div>
    </section>
  )
}

export default FeedbackForm
