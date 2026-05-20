import React, { useEffect, useState } from 'react';
import { FiX, FiCheckCircle, FiAlertCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';

/**
 * Toast component for displaying temporary notifications
 * @param {string} message - The notification message
 * @param {string} type - success | error | info | warning
 * @param {number} duration - Milliseconds before auto-close (0 for no auto-close)
 * @param {function} onClose - Callback when toast closes
 */
const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(onClose, 300);
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(onClose, 300);
  };

  const icons = {
    success: <FiCheckCircle className="w-5 h-5" />,
    error: <FiAlertCircle className="w-5 h-5" />,
    info: <FiInfo className="w-5 h-5" />,
    warning: <FiAlertTriangle className="w-5 h-5" />,
  };

  const styles = {
    success: {
      container: 'glass border-l-4 border-indigo-500/60',
      icon: 'text-indigo-400',
      text: 'text-indigo-200',
      glow: 'shadow-[0_0_20px_rgba(99,102,241,0.4)]'
    },
    error: {
      container: 'glass border-l-4 border-red-500/60',
      icon: 'text-red-400',
      text: 'text-red-200',
      glow: 'shadow-[0_0_20px_rgba(239,68,68,0.4)]'
    },
    info: {
      container: 'glass border-l-4 border-cyan-400/60',
      icon: 'text-cyan-400',
      text: 'text-cyan-200',
      glow: 'shadow-[0_0_20px_rgba(34,211,238,0.4)]'
    },
    warning: {
      container: 'glass border-l-4 border-amber-400/60',
      icon: 'text-amber-400',
      text: 'text-amber-200',
      glow: 'shadow-[0_0_20px_rgba(245,158,11,0.4)]'
    }
  };

  const style = styles[type] || styles.info;

  return (
    <div
      role="alert"
      className={`
        flex items-start gap-3 min-w-72 max-w-md p-4 rounded-lg border shadow-lg
        backdrop-blur-sm
        transition-all duration-300 ease-out
        ${style.container}
        ${isExiting ? 'opacity-0 translate-x-8' : 'opacity-100 translate-x-0 animate-slideIn'}
        ${style.glow}
      `}
    >
      <div className={`shrink-0 pt-0.5 ${style.icon}`}>
        {icons[type]}
      </div>
      <p className={`flex-1 text-sm font-medium ${style.text}`}>
        {message}
      </p>
      <button
        onClick={handleClose}
        className="shrink-0 p-1 hover:bg-white/10 rounded transition-colors"
        aria-label="Close notification"
      >
        <FiX className={`w-4 h-4 ${style.text}`} />
      </button>
    </div>
  );
};

export default Toast;