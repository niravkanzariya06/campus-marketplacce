import React from "react"
import { Link } from "react-router-dom"
import { Github, Linkedin, Twitter } from "lucide-react"

const Footer = () => {
  return (
    <footer className="w-full glass border-t border-subtle relative z-10">
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 text-center sm:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center sm:items-start animate-fadeIn">
          <Link
            to="/"
            className="text-2xl font-bold tracking-wide text-on-surface transition-all duration-300 hover:scale-105"
          >
            Campus Marketplace
          </Link>
          <p className="mt-3 text-sm text-on-surface-variant max-w-xs leading-relaxed">
            Buy & sell within your campus community. Safe, local, and convenient.
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center sm:items-start animate-fadeIn" style={{ animationDelay: '0.1s' }}>
          <h3 className="text-lg font-semibold mb-4 text-on-surface">Marketplace</h3>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li>
              <Link
                to="/browse"
                className="hover:text-cyan-400 transition-colors duration-300 hover:scale-105 inline-block"
              >
                Browse Products
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                className="hover:text-cyan-400 transition-colors duration-300 hover:scale-105 inline-block"
              >
                My Profile
              </Link>
            </li>
            <li>
              <Link
                to="/messages"
                className="hover:text-cyan-400 transition-colors duration-300 hover:scale-105 inline-block"
              >
                Messages
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div className="flex flex-col items-center sm:items-start animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          <h3 className="text-lg font-semibold mb-4 text-on-surface">Legal</h3>
          <ul className="space-y-3 text-sm text-on-surface-variant">
            <li>
              <Link
                to="/terms"
                className="hover:text-cyan-400 transition-colors duration-300 hover:scale-105 inline-block"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/privacy"
                className="hover:text-cyan-400 transition-colors duration-300 hover:scale-105 inline-block"
              >
                Privacy Policy
              </Link>
            </li>
          </ul>
        </div>

        {/* Social */}
        <div className="flex flex-col items-center sm:items-start animate-fadeIn" style={{ animationDelay: '0.3s' }}>
          <h3 className="text-lg font-semibold mb-4 text-on-surface">Connect</h3>
          <div className="flex gap-3">
            <a
              href="https://github.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg glass text-on-surface-variant hover:text-cyan-400 hover:scale-110 transition-all duration-300 border border-subtle"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="https://linkedin.com/in/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg glass text-on-surface-variant hover:text-cyan-400 hover:scale-110 transition-all duration-300 border border-subtle"
              aria-label="LinkedIn"
            >
              <Linkedin size={20} />
            </a>
            <a
              href="https://twitter.com/yourusername"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg glass text-on-surface-variant hover:text-cyan-400 hover:scale-110 transition-all duration-300 border border-subtle"
              aria-label="Twitter"
            >
              <Twitter size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="py-4 px-4 text-center text-sm text-on-surface-variant border-t border-subtle">
        <p className="animate-fadeIn">
          © {new Date().getFullYear()} Campus Marketplace. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer
