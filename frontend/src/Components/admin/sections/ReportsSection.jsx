import React, { useState, useEffect } from 'react';
import reportService from '../../../services/reportService';
import { useToast } from '../../Toast/ToastContainer';

const REASON_LABELS = {
  inappropriate_content: 'Inappropriate Content',
  fake_listing: 'Fake Listing',
  wrong_category: 'Wrong Category',
  spam: 'Spam',
  price_fraud: 'Price Fraud',
  other: 'Other',
};

const REASON_COLORS = {
  inappropriate_content: 'text-red-400 bg-red-500/10 border-red-500/20',
  fake_listing: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  wrong_category: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
  spam: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  price_fraud: 'text-pink-400 bg-pink-500/10 border-pink-500/20',
  other: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
};

const STATUS_COLORS = {
  pending: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  resolved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  dismissed: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const ReportsSection = () => {
  const { showToast } = useToast();
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);

  const fetchReports = async () => {
    try {
      setIsLoading(true);
      const data = await reportService.getReports();
      setReports(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
      showToast('Failed to load reports', 'error', 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleStatusChange = async (reportId, status) => {
    try {
      setActionLoading(reportId);
      await reportService.updateReportStatus(reportId, status);
      showToast(`Report ${status}`, 'success', 2000);
      setReports((prev) =>
        prev.map((r) => (r.id === reportId ? { ...r, status } : r))
      );
    } catch {
      showToast('Failed to update report status', 'error', 3000);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredReports = filterStatus === 'all'
    ? reports
    : reports.filter((r) => r.status === filterStatus);

  return (
    <section className="mt-6 mb-12">
      <div className="glass-panel rounded-3xl p-6 md:p-8 shadow-2xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-2xl text-primary">flag</span>
            </div>
            <div>
              <h3 className="text-2xl font-bold font-headline text-on-surface">Reported Products</h3>
              <p className="text-base text-on-surface-variant/80">
                {reports.length} report{reports.length !== 1 ? 's' : ''} received
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {['all', 'pending', 'resolved', 'dismissed'].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-full text-sm font-bold uppercase tracking-wider border transition-all ${
                  filterStatus === status
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-lg shadow-indigo-500/20'
                    : 'glass text-on-surface-variant border-white/10 hover:border-primary/30'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
            <p className="text-base text-on-surface-variant">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/10 to-tertiary/10 flex items-center justify-center border border-primary/20">
              <span className="material-symbols-outlined text-5xl text-primary/60">flag</span>
            </div>
            <h4 className="text-xl font-bold text-on-surface">
              {filterStatus === 'all' ? 'No Reports Yet' : `No ${filterStatus} reports`}
            </h4>
            <p className="text-base text-on-surface-variant max-w-md">
              {filterStatus === 'all'
                ? 'User-reported products and moderation insights will appear here.'
                : `No reports with status "${filterStatus}" found.`}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="glass rounded-2xl border border-white/8 p-4 md:p-5 hover:border-primary/20 transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  {/* Product Info */}
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    {report.product_image && (
                      <img
                        src={report.product_image}
                        alt={report.product_title || 'Product'}
                        className="w-14 h-14 rounded-xl object-cover bg-white/5 flex-shrink-0"
                        loading="lazy"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-semibold text-on-surface truncate">
                        {report.product_title || 'Unknown Product'}
                      </p>
                      <p className="text-sm text-on-surface-variant/70">
                        Reported by {report.reporter_name || report.reporter_email || 'Anonymous'}
                      </p>
                    </div>
                  </div>

                  {/* Reason & Status */}
                  <div className="flex items-center gap-2 flex-wrap md:flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                        REASON_COLORS[report.reason] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                      }`}
                    >
                      {REASON_LABELS[report.reason] || report.reason}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold border ${
                        STATUS_COLORS[report.status] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'
                      }`}
                    >
                      {report.status}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 md:flex-shrink-0">
                    {report.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatusChange(report.id, 'resolved')}
                          disabled={actionLoading === report.id}
                          className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 text-sm font-semibold border border-emerald-500/20 hover:bg-emerald-500/20 transition-all disabled:opacity-50"
                        >
                          Resolve
                        </button>
                        <button
                          onClick={() => handleStatusChange(report.id, 'dismissed')}
                          disabled={actionLoading === report.id}
                          className="px-3 py-1.5 rounded-lg bg-slate-500/10 text-slate-400 text-sm font-semibold border border-slate-500/20 hover:bg-slate-500/20 transition-all disabled:opacity-50"
                        >
                          Dismiss
                        </button>
                      </>
                    )}
                    {report.status === 'resolved' && (
                      <button
                        onClick={() => handleStatusChange(report.id, 'pending')}
                        disabled={actionLoading === report.id}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/20 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                      >
                        Reopen
                      </button>
                    )}
                    {report.status === 'dismissed' && (
                      <button
                        onClick={() => handleStatusChange(report.id, 'pending')}
                        disabled={actionLoading === report.id}
                        className="px-3 py-1.5 rounded-lg bg-amber-500/10 text-amber-400 text-sm font-semibold border border-amber-500/20 hover:bg-amber-500/20 transition-all disabled:opacity-50"
                      >
                        Reopen
                      </button>
                    )}
                  </div>
                </div>

                {/* Message */}
                {report.message && (
                  <div className="mt-3 pt-3 border-t border-white/5">
                    <p className="text-sm text-on-surface-variant/80 leading-relaxed">
                      {report.message}
                    </p>
                  </div>
                )}

                {/* Timestamp */}
                <p className="text-sm text-on-surface-variant/50 mt-2">
                  {new Date(report.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default ReportsSection;
