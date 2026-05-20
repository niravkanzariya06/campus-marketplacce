import React from 'react'
import { Link } from 'react-router-dom'

const CuratedCollections = () => {
  const collections = [
    {
      title: "Tech",
      iconName: "laptop_mac",
      color: "dark:text-indigo-400 text-indigo-600",
      bg: "bg-indigo-500/15",
      border: "border-indigo-500/30",
      glow: "shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]",
      hoverGlow: "shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)]",
      count: "240+ Items",
      link: "/browse?category=tech"
    },
    {
      title: "Books",
      iconName: "menu_book",
      color: "dark:text-violet-400 text-violet-600",
      bg: "bg-violet-500/15",
      border: "border-violet-500/30",
      glow: "shadow-[0_0_40px_-10px_rgba(139,92,246,0.5)]",
      hoverGlow: "shadow-[0_0_60px_-10px_rgba(139,92,246,0.7)]",
      count: "1.2k+ Items",
      link: "/browse?category=books"
    },
    {
      title: "Lifestyle",
      iconName: "chair",
      color: "dark:text-cyan-400 text-cyan-600",
      bg: "bg-cyan-500/15",
      border: "border-cyan-500/30",
      glow: "shadow-[0_0_40px_-10px_rgba(34,211,238,0.5)]",
      hoverGlow: "shadow-[0_0_60px_-10px_rgba(34,211,238,0.7)]",
      count: "85+ Items",
      link: "/browse?category=lifestyle"
    },
    {
      title: "Services",
      iconName: "design_services",
      color: "dark:text-indigo-400 text-indigo-600",
      bg: "bg-indigo-500/15",
      border: "border-indigo-500/30",
      glow: "shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]",
      hoverGlow: "shadow-[0_0_60px_-10px_rgba(99,102,241,0.7)]",
      count: "42 active",
      link: "/browse?category=services"
    }
  ]

  return (
    <section className="w-full max-w-7xl mx-auto px-4 md:px-8 pt-4 pb-16 md:pt-8 md:pb-20">
      {/* Section Header */}
      <div className="text-center mb-12 md:mb-16">
        <h2 className="font-headline text-2xl md:text-3xl font-extrabold gradient-text bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent mb-4">
          Curated Collections
        </h2>
        <p className="dark:text-gray-400 text-gray-600 text-sm md:text-base max-w-2xl mx-auto">
          Handpicked essentials for your major. Explore gear, books, and services tailored to campus life.
        </p>
      </div>

      {/* Collections Grid - Responsive Rows with orbital animations */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {collections.map((collection, index) => (
          <Link
            key={index}
            to={collection.link}
            className={`group perspective-container floating-orbit-${(index % 3) + 1}`}
          >
            <div className={`
              tilt-card glass-card rounded-3xl p-4 sm:p-6 md:p-8 flex flex-col items-center justify-center text-center cursor-pointer
              relative overflow-hidden transition-all duration-500
              bg-gradient-to-br from-surface-container-highest/80 to-surface-container/80
              border ${collection.border}
              shadow-lg ${collection.glow}
              group-hover:shadow-xl group-hover:${collection.hoverGlow}
              group-hover:scale-[1.05] group-hover:-translate-y-2
              before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-indigo-500/10 before:to-cyan-500/10 before:opacity-0 before:transition-opacity before:duration-500 group-hover:before:opacity-100
              after:absolute after:inset-0 after:rounded-3xl after:border after:border-indigo-400/30 after:opacity-0 after:transition-opacity after:duration-500 group-hover:after:opacity-100
            `}>
              {/* Top edge shine gradient */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              {/* Icon container with dimensional shadow */}
              <div className={`
                w-16 h-16 md:w-20 md:h-20 rounded-2xl flex items-center justify-center mb-4 md:mb-6
                transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
                ${collection.bg} border ${collection.border}
                shadow-[0_8px_32px_-8px_rgba(0,0,0,0.4),0_0_20px_-5px_rgba(99,102,241,0.3)]
                group-hover:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.5),0_0_30px_-5px_rgba(99,102,241,0.5)]
              `}>
                <span className={`material-symbols-outlined text-4xl md:text-5xl ${collection.color}`}>
                  {collection.iconName}
                </span>
              </div>

              {/* Title */}
              <span className="font-headline font-bold text-xl md:text-2xl text-on-surface mb-2 group-hover:text-primary transition-colors duration-300">
                {collection.title}
              </span>

              {/* Count badge */}
              <span className={`
                text-xs md:text-sm font-medium px-3 py-1 rounded-full
                ${collection.bg} border ${collection.border} text-on-surface-variant group-hover:text-on-surface group-hover:bg-gradient-to-r group-hover:from-indigo-500/20 group-hover:to-violet-500/20
                transition-all duration-300
              `}>
                {collection.count}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default CuratedCollections
