import React from "react"
import { FiHome, FiShoppingBag, FiHeart } from "react-icons/fi"
import { CgProfile } from "react-icons/cg"
import { TiMessages } from "react-icons/ti"
import { MdAdminPanelSettings } from "react-icons/md" // NEW
import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux" // NEW

const NavItems = ({ mobile = false }) => {
  const { isAdmin } = useSelector(state => state.auth) // NEW

  const navItems = [
    { to: "/", label: "Home", icon: <FiHome size={15} /> },
    { to: "/browse", label: "Browse", icon: <FiShoppingBag size={15} /> },
    { to: "/favorites", label: "Favorites", icon: <FiHeart size={15} /> },
    { to: "/chat", label: "Messages", icon: <TiMessages size={15} /> },
  ]

  // NEW: Add admin link if user is admin
  if (isAdmin) {
    navItems.push({ to: "/admin", label: "Admin", icon: <MdAdminPanelSettings size={15} /> })
  }

  return (
    <nav>
      <ul
        className={`
          flex ${mobile ? "flex justify-center gap-7 mb-10 items-center flex-wrap" : "items-center gap-2"}
          text-sm font-medium
        `}
      >
        {navItems.map(({ to, label, icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                `
                flex items-center gap-2 h-10 px-4 rounded-lg transition-all duration-300
                ${isActive ? "glass text-on-surface border-indigo-500/50" : "text-outline hover:text-on-surface hover:glass hover:scale-105"}
                `
              }
            >
              {icon}
              <span>{label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

export default NavItems