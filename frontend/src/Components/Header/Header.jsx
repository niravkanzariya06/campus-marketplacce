import React, { useState, useRef, useEffect } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { FiHome, FiShoppingBag, FiHeart, FiMenu, FiPlus, FiX } from "react-icons/fi"
import { TiMessages } from "react-icons/ti"
import { MdAdminPanelSettings } from "react-icons/md"
import { Sun, Moon, LogOut, User } from "lucide-react"
import Logo from "./Logo"
import NavItems from "./NavItems"
import HeaderActions from "./headerAction/HeaderActions"
import { useTheme } from "../Theme/ThemeProvider"
import { useSelector, useDispatch } from "react-redux"
import authService from "../../services/authService"
import { logout } from "../../store/authSlice"
import { useToast } from "../Toast/ToastContainer"

const Header = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { theme, toggleTheme } = useTheme()
  const isLoggedIn = useSelector((state) => state.auth.status)
  const user = useSelector((state) => state.auth.userData)
  const { isAdmin } = useSelector((state) => state.auth)

  const [open, setOpen] = useState(false)
  const dropdownRef = useRef(null)

  const navItems = [
    { to: "/", label: "Home", icon: <FiHome size={18} /> },
    { to: "/browse", label: "Browse", icon: <FiShoppingBag size={18} /> },
    { to: "/favorites", label: "Favorites", icon: <FiHeart size={18} /> },
    { to: "/chat", label: "Messages", icon: <TiMessages size={18} /> },
  ]

  if (isAdmin) {
    navItems.push({ to: "/admin", label: "Admin", icon: <MdAdminPanelSettings size={18} /> })
  }

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(false)
    try {
      await authService.logout()
      dispatch(logout())
      showToast('Logged out successfully', 'success', 3000)
      navigate("/")
    } catch {
      showToast('Failed to logout. Please try again.', 'error', 4000)
    }
  }

  const handleThemeToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()
    toggleTheme()
    setOpen(false)
  }

  const navTo = (path) => {
    setOpen(false)
    navigate(path)
  }

  const getInitials = (name) => {
    if (!name) return "U"
    return name.charAt(0).toUpperCase()
  }

  return (
    <header className="w-full h-16 glass fixed top-0 z-50 transition-all duration-300 border-b border-subtle">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-full">

        {/* Left - Logo */}
        <Logo />

        {/* Center - Nav (Desktop only) */}
        <div className="hidden md:block">
          <NavItems />
        </div>

        {/* Right - Actions (Desktop only) */}
        <div className="hidden md:flex items-center gap-3">
          <HeaderActions />
        </div>

        {/* Mobile - Hamburger (Right) */}
        <button
          className="md:hidden ml-auto text-2xl text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          {open ? <FiX /> : <FiMenu />}
        </button>
      </div>

      {/* Mobile Dropdown Backdrop */}
      <div
        className={`md:hidden fixed inset-0 top-16 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={() => setOpen(false)}
      />

      {/* Mobile Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`md:hidden fixed top-16 right-0 w-full max-w-sm z-50 bg-[#1a1a2e]/98 backdrop-blur-xl border-l border-white/10 shadow-2xl transition-all duration-300 origin-top-right overflow-y-auto max-h-[calc(100vh-64px)] ${open ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-4 space-y-1">
          {/* Navigation Links */}
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  isActive
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-white/90 hover:bg-white/5"
                }`
              }
            >
              {icon}
              <span className="font-medium">{label}</span>
            </NavLink>
          ))}

          {isLoggedIn && (
            <button
              onClick={() => navTo("/add-item")}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/90 hover:bg-white/5 transition-all w-full"
            >
              <FiPlus className="text-lg" />
              <span className="font-medium">List Item</span>
            </button>
          )}

          <div className="border-t border-subtle my-2" />

          {/* User Section */}
          {isLoggedIn && user ? (
            <div className="p-3">
              <div className="flex items-center gap-3 px-2 py-2">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-tertiary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {getInitials(user.name || user.email)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{user.name || user.email}</p>
                  <p className="text-xs text-white/60 truncate">{user.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-2">
                <button
                  onClick={handleThemeToggle}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-all text-white text-sm"
                >
                  {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                  {theme === 'dark' ? 'Light' : 'Dark'}
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all text-sm"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
              <button
                onClick={() => navTo("/profile")}
                className="mt-2 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-sm transition-all w-full"
              >
                <User className="w-4 h-4" />
                View Profile
              </button>
            </div>
          ) : (
            <div className="px-4 py-3 space-y-2">
              <button
                onClick={() => navTo("/login")}
                className="block w-full text-center py-2.5 rounded-xl border border-primary/30 text-primary font-medium text-sm hover:bg-primary/10 transition-all"
              >
                Log in
              </button>
              <button
                onClick={() => navTo("/register")}
                className="block w-full text-center py-2.5 rounded-xl bg-gradient-to-r from-primary to-tertiary text-white font-medium text-sm hover:opacity-90 transition-all"
              >
                Sign up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
