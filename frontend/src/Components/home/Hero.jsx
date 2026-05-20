import React, { useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { motion } from 'framer-motion' // eslint-disable-line no-unused-vars

const Hero = () => {
  const { userData } = useSelector((state) => state.auth)

  // Animation variants - staggered text entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.15 }
    }
  }

  const fadeInUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1, y: 0,
      transition: { duration: 0.7, delay: delay * 0.1, ease: [0.23, 1, 0.32, 1] }
    }
  })

  // Marketplace items data - realistic product cards (unchanged)
  const marketplaceItems = useMemo(() => [
    { id: 1, title: 'Mechanical Keyboard', price: '₹4,500', category: 'Electronics', condition: 'Like New', icon: 'keyboard', color: 'indigo' },
    { id: 2, title: 'Noise-Cancelling Headphones', price: '₹8,999', category: 'Electronics', condition: 'Excellent', icon: 'headphones', color: 'cyan' },
    { id: 3, title: 'Calculus: Early Transcendentals', price: '₹1,200', category: 'Books', condition: 'Good', icon: 'menu_book', color: 'violet' },
    { id: 4, title: 'iPad Pro 12.9"', price: '₹75,000', category: 'Electronics', condition: 'Like New', icon: 'tablet', color: 'indigo' },
    { id: 5, title: 'Graphing Calculator', price: '₹6,500', category: 'Electronics', condition: 'Very Good', icon: 'calculate', color: 'cyan' },
    { id: 6, title: 'Introduction to Python', price: '₹800', category: 'Books', condition: 'Like New', icon: 'book', color: 'violet' },
    { id: 7, title: 'Wireless Mouse', price: '₹1,800', category: 'Electronics', condition: 'New', icon: 'computer', color: 'indigo' },
    { id: 8, title: 'Dorm Room Desk', price: '₹4,500', category: 'Furniture', condition: 'Good', icon: 'desk', color: 'cyan' },
    { id: 9, title: 'Physics for Scientists', price: '₹1,500', category: 'Books', condition: 'Acceptable', icon: 'auto_stories', color: 'violet' },
    { id: 10, title: 'Yoga Mat', price: '₹1,200', category: 'Sports', condition: 'Like New', icon: 'fitness_center', color: 'indigo' },
    { id: 11, title: 'Coffee Maker', price: '₹3,200', category: 'Home', condition: 'Good', icon: 'kitchen', color: 'cyan' },
    { id: 12, title: 'Study Lamp', price: '₹900', category: 'Home', condition: 'Very Good', icon: 'lightbulb', color: 'violet' }
  ], [])

  const floatingItemsRef = useRef(null)
  if (!floatingItemsRef.current) {
    /* eslint-disable react-hooks/purity */
    const random = (min, max) => Math.random() * (max - min) + min
    const randomChoice = (arr) => arr[Math.floor(Math.random() * arr.length)]
    const items = []
    const zones = [
      { xRange: [5, 25], yRange: [15, 40] },
      { xRange: [75, 95], yRange: [15, 40] },
      { xRange: [5, 25], yRange: [60, 85] },
      { xRange: [75, 95], yRange: [60, 85] },
      { xRange: [40, 60], yRange: [20, 35] },
      { xRange: [40, 60], yRange: [65, 80] },
    ]
    for (let i = 0; i < 12; i++) {
      const depth = i % 3
      const baseScale = depth === 2 ? random(0.85, 1.0) : depth === 1 ? random(0.7, 0.85) : random(0.5, 0.7)
      const blurAmount = depth === 2 ? '0px' : depth === 1 ? '2px' : '4px'
      const opacity = depth === 2 ? random(0.4, 0.5) : depth === 1 ? random(0.3, 0.4) : random(0.2, 0.3)
      const zone = randomChoice(zones)
      const x = random(zone.xRange[0], zone.xRange[1])
      const y = random(zone.yRange[0], zone.yRange[1])
      const duration = random(8, 14)
      const delay = random(0, 4)
      const driftX = random(-1.5, 1.5)
      const driftY = random(-2, 2)
      const rotation = random(-8, 8)
      const item = randomChoice(marketplaceItems)
      items.push({ key: i, item, x, y, scale: baseScale, blur: blurAmount, opacity, duration, delay, driftX, driftY, rotation })
    }
    floatingItemsRef.current = items
    /* eslint-enable react-hooks/purity */
  }
  const floatingItems = floatingItemsRef.current

  const createFloatVariant = (driftX, driftY, rotation, duration) => ({
    animate: {
      x: [0, driftX, 0], y: [0, driftY, 0], rotate: [0, rotation, -rotation / 2, 0],
      transition: { duration, repeat: Infinity, ease: "easeInOut", repeatType: "mirror" }
    }
  })

  return (
    <>
      <section className="relative min-h-[100dvh] flex flex-col justify-center overflow-hidden bg-surface pt-24 pb-16">
        {/* Floating Marketplace Items - z-[1] so they sit behind hero content */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-[1]">
          {floatingItems.map(({ key, item, x, y, scale, blur, opacity, duration, driftX, driftY, rotation }) => (
            <motion.div key={key} className="absolute origin-center" style={{ left: `${x}%`, top: `${y}%`, filter: `blur(${blur})`, opacity }} {...createFloatVariant(driftX, driftY, rotation, duration)} initial={{ x: 0, y: 0, rotate: 0 }}>
              <div className="tilt-card glass-card rounded-2xl overflow-hidden border border-white/10 shadow-lg backdrop-blur-xl" style={{ transform: `scale(${scale})` }}>
                <div className={`aspect-[4/3] relative`}>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className={`material-symbols-outlined text-6xl md:text-7xl text-${item.color}-400/40`}>{item.icon}</span>
                  </div>
                  <div className="absolute top-2 left-2 px-2 py-1 rounded-md bg-indigo-500/20 backdrop-blur-sm border border-indigo-500/30">
                    <span className="text-[10px] font-bold text-primary">{item.condition}</span>
                  </div>
                </div>
                <div className="p-3">
                  <h4 className="font-headline font-bold text-on-surface text-sm mb-1 line-clamp-2 leading-tight">{item.title}</h4>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-on-surface-variant">{item.category}</span>
                    <div className="text-sm font-extrabold gradient-text">{item.price}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Hero Content - z-10 stays on top */}
        <motion.div
          className="hero-content relative z-10 text-center px-4 sm:px-6 max-w-7xl mx-auto flex flex-col items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Welcome Badge */}
          {userData && (
            <motion.div variants={fadeInUp(0)} className="mb-8">
              <span className="inline-flex items-center px-5 py-2.5 rounded-full bg-indigo-500/15 border border-indigo-400/25 text-on-surface text-sm font-medium backdrop-blur-md">
                <span className="material-symbols-outlined text-indigo-400 mr-2 text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>wave</span>
                Welcome back, {userData.name || userData.email?.split('@')[0]}!
              </span>
            </motion.div>
          )}

          {/* =====
              REDESIGNED TYPOGRAPHY SYSTEM
              - Top line: medium weight, large
              - Highlight line: bold gradient, extra large
              - Letter spacing: tracking-tight
              - Line height: tight for headings, relaxed for subtext
              - Glow behind headline for visual depth
              - Staggered fade-in animation
              ===== */}

          <motion.h1
            variants={fadeInUp(1)}
            className="font-headline relative z-10"
          >
            {/* Line 1 — medium weight, large size */}
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight text-on-surface leading-[1.15] sm:leading-[1.1] leading-tight">
              Buy, Sell &amp; Connect
            </span>

            {/* Line 2 — bold gradient on key phrase, extra large */}
            <span
              className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mt-1 sm:mt-2 text-on-surface"
            >
              Inside Your Campus
            </span>
          </motion.h1>

          {/* Subtext — muted, max-width constrained, generous spacing */}
          <motion.p
            variants={fadeInUp(3)}
            className="relative font-body text-base sm:text-lg md:text-xl text-outline mt-5 sm:mt-8 md:mt-10 mb-8 sm:mb-12 md:mb-14 max-w-3xl mx-auto leading-relaxed px-4 sm:px-0"
          >
            The trusted marketplace built exclusively for students.
            <span className="block sm:inline font-semibold dark:text-cyan-400 text-tertiary mt-2 sm:mt-0"> Verified users, zero fees, and campus-safe transactions.</span>
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeInUp(5)}
            className="flex flex-col sm:flex-row flex-wrap items-center sm:justify-center gap-3 sm:gap-5 w-full mx-auto"
          >
            {/* Primary — gradient glow */}
            <Link
              to={userData ? "/add-item" : "/register"}
              className="group relative px-6 py-3.5 sm:px-10 sm:py-4.5 rounded-full text-white font-semibold text-sm sm:text-lg transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] cursor-pointer w-[80%] max-w-[260px] sm:max-w-none sm:w-auto text-center"
              style={{ background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)' }}
            >
              <span className="relative z-10 flex items-center justify-center gap-2.5">
                <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>{userData ? 'add_circle' : 'rocket_launch'}</span>
                {userData ? 'List Your Item Free' : 'Get Started Free'}
              </span>
            </Link>

            {/* Secondary — glass outline */}
            <Link
              to="/browse"
              className="px-6 py-3.5 sm:px-10 sm:py-4.5 rounded-full border border-white/20 text-on-surface font-medium text-sm sm:text-lg hover:bg-black/5 hover:border-indigo-400/40 active:scale-[0.97] cursor-pointer w-[80%] max-w-[260px] sm:max-w-none sm:w-auto text-center"
            >
              <span className="flex items-center justify-center gap-2.5">
                <span className="material-symbols-outlined group-hover:scale-110 transition-transform duration-300" style={{ fontVariationSettings: "'FILL' 1" }}>explore</span>
                Browse Marketplace
              </span>
            </Link>
          </motion.div>

          {/* Feature Strip (Marquee) */}
          <motion.div
            variants={fadeInUp(7)}
            className="w-full mt-16 sm:mt-20 md:mt-24 py-5 rounded-2xl bg-white/[0.02] backdrop-blur-md overflow-hidden border border-white/[0.06] relative"
          >
            <div className="marquee-content">
              {[
                { icon: 'verified', text: 'Verified Student Accounts', color: 'text-indigo-400' },
                { icon: 'verified_user', text: 'Secure Transactions', color: 'text-indigo-400' },
                { icon: 'lock', text: 'Secure Campus Meetups', color: 'text-cyan-400' },
                { icon: 'chat_bubble', text: 'In-App Chat Included', color: 'text-cyan-400' },
                { icon: 'payments', text: 'Zero Fees Forever', color: 'text-violet-400' },
                { icon: 'school', text: 'Verified Students Only', color: 'text-indigo-400' },
                { icon: 'location_on', text: 'Campus-Specific', color: 'text-cyan-400' },
                { icon: 'bolt', text: 'Real-Time Deals', color: 'text-violet-400' }
              ].map((feature, idx) => (
                <div key={`m1-${idx}`} className="flex items-center space-x-3 px-7 md:px-10 whitespace-nowrap min-w-max">
                  <span className={`material-symbols-outlined text-2xl ${feature.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{feature.icon}</span>
                  <span className="font-headline font-bold text-sm md:text-base tracking-tight text-on-surface-variant">
                    {feature.text}
                  </span>
                </div>
              ))}
              {Array.from({ length: 8 }).map((_, idx) => {
                const features = [{ icon: 'verified', text: 'Verified Student Accounts', color: 'text-indigo-400' }, { icon: 'verified_user', text: 'Secure Transactions', color: 'text-indigo-400' }, { icon: 'lock', text: 'Secure Campus Meetups', color: 'text-cyan-400' }, { icon: 'chat_bubble', text: 'In-App Chat Included', color: 'text-cyan-400' }, { icon: 'payments', text: 'Zero Fees Forever', color: 'text-violet-400' }, { icon: 'school', text: 'Verified Students Only', color: 'text-indigo-400' }, { icon: 'location_on', text: 'Campus-Specific', color: 'text-cyan-400' }, { icon: 'bolt', text: 'Real-Time Deals', color: 'text-violet-400' }];
                const feature = features[idx];
                return (
                  <div key={`m2-${idx}`} className="flex items-center space-x-3 px-7 md:px-10 whitespace-nowrap min-w-max">
                    <span className={`material-symbols-outlined text-2xl ${feature.color}`} style={{ fontVariationSettings: "'FILL' 1" }}>{feature.icon}</span>
                    <span className="font-headline font-bold text-sm md:text-base tracking-tight text-on-surface-variant">{feature.text}</span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </motion.div>
      </section>
    </>
  )
}

export default Hero
