import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion'; // eslint-disable-line no-unused-vars

const FeedbackModal = ({ feedback, isOpen, onClose, onUpdateStatus, onDelete }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!feedback) return null;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className="material-symbols-outlined text-amber-400"
            style={{
              fontVariationSettings: "'FILL' 1",
              fontSize: '20px',
              textShadow: star <= rating ? '0 0 10px rgba(251, 191, 36, 0.5)' : 'none'
            }}
          >
            star
          </span>
        ))}
      </div>
    );
  };

  const getStatusColor = (status) => {
    return status === 'new'
      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
      : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="relative w-full max-w-2xl glass-panel rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface-variant">close</span>
            </button>

            {/* Header */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500/20 to-cyan-500/20 flex items-center justify-center border border-indigo-500/30">
                    <span className="material-symbols-outlined text-2xl text-indigo-400">person</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline text-on-surface">
                      {feedback.full_name}
                    </h3>
                    <p className="text-sm text-on-surface-variant">{feedback.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {renderStars(feedback.rating)}
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(feedback.status)}`}>
                    {feedback.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">calendar_today</span>
                  {new Date(feedback.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
                {feedback.updated_at && feedback.updated_at !== feedback.created_at && (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Updated {new Date(feedback.updated_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    })}
                  </span>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-b border-white/5 mb-6" />

            {/* Message */}
            <div className="mb-8">
              <h4 className="text-sm font-bold text-on-surface-variant uppercase tracking-wider mb-3">Feedback Message</h4>
              <div className="bg-surface-container-highest rounded-2xl p-6 border border-subtle">
                <p className="text-on-surface leading-relaxed whitespace-pre-wrap">
                  {feedback.message}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between">
              <button
                onClick={() => {
                  onDelete(feedback.id);
                  onClose();
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-red-500/20 hover:opacity-90 transition-all active:scale-95"
              >
                <span className="material-symbols-outlined text-sm">delete</span>
                Delete
              </button>

              <div className="flex items-center gap-3">
                {feedback.status === 'new' ? (
                  <button
                    onClick={() => {
                      onUpdateStatus(feedback.id, 'reviewed');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">check_circle</span>
                    Mark as Reviewed
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      onUpdateStatus(feedback.id, 'new');
                    }}
                    className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-br from-amber-500 to-orange-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-amber-500/20 hover:opacity-90 transition-all active:scale-95"
                  >
                    <span className="material-symbols-outlined text-sm">undo</span>
                    Mark as New
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 glass hover:bg-white/10 border border-subtle text-on-surface-variant rounded-xl text-sm font-medium transition-all active:scale-95"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FeedbackModal;
