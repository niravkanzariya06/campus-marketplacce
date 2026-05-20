import React from "react"
import { FiShoppingBag } from "react-icons/fi"
import { Link } from "react-router-dom"

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-2 transition-colors duration-300">
      <div className="w-9 h-9 flex items-center justify-center rounded-lg glass border border-subtle transition-all duration-300 hover:scale-105">
        <FiShoppingBag size={18} className="text-indigo-400" />
      </div>
      <span className="text-base sm:text-2xl gradient-text font-bold truncate max-w-[200px] sm:max-w-none">Campus Marketplace</span>
    </Link>
  )
}

export default Logo
