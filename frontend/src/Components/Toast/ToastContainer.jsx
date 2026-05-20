/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

const ToastContext = createContext();

/**
 * Hook to use toast notifications throughout the app
 * @returns {object} - { showToast }
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

/**
 * Toast Provider component - wrap your app with this to enable toast notifications
 * Usage:
 *   const { showToast } = useToast();
 *   showToast('Success!', 'success', 3000);
 *   showToast('Error occurred', 'error', 4000);
 *   showToast('Warning', 'warning');
 *   showToast('Info', 'info', 5000);
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now() + Math.random();

    const validTypes = ['success', 'error', 'info', 'warning'];
    const normalizedType = validTypes.includes(type) ? type : 'info';

    setToasts((prev) => [...prev, { id, message, type: normalizedType, duration }]);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container - positioned at top right */}
      <div className="fixed top-20 right-4 z-50 flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              message={toast.message}
              type={toast.type}
              duration={toast.duration}
              onClose={() => removeToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
