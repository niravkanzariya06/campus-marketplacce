import React, { useState, useEffect } from 'react';
import feedbackService from '../../../services/feedbackService';
import FeedbackModal from '../FeedbackModal';
import { useToast } from '../../../Components/Toast/ToastContainer';

const FeedbackSection = () => {
    const [allFeedback, setAllFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('newest');
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { showToast } = useToast();

    const fetchAllFeedback = async () => {
        setLoading(true);
        try {
            const params = {
                status: statusFilter === 'all' ? undefined : statusFilter,
                sortBy: sortBy,
                search: search.trim() || undefined,
                limit: 999
            };
            const result = await feedbackService.getFeedback(params);
            setAllFeedback(result.documents || []);
        } catch (error) {
            console.error('Failed to fetch feedback:', error);
            showToast('Failed to load feedback', 'error');
            setAllFeedback([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllFeedback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [statusFilter, sortBy, search]);

    const handleViewFeedback = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const handleUpdateFeedbackStatus = async (feedbackId, newStatus) => {
        try {
            await feedbackService.updateFeedbackStatus(feedbackId, newStatus);
            showToast(`Feedback marked as ${newStatus}`, 'success');
            fetchAllFeedback();
            if (selectedFeedback && selectedFeedback.id === feedbackId) {
                setSelectedFeedback({ ...selectedFeedback, status: newStatus });
            }
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to update feedback status', 'error');
        }
    };

    const handleDeleteFeedback = async (feedbackId) => {
        if (!window.confirm('Are you sure you want to delete this feedback?')) {
            return;
        }
        try {
            await feedbackService.deleteFeedback(feedbackId);
            showToast('Feedback deleted successfully', 'success');
            fetchAllFeedback();
        } catch (error) {
            showToast(error.response?.data?.message || 'Failed to delete feedback', 'error');
        }
    };

    // Counts
    const newCount = allFeedback.filter(f => f.status === 'new').length;
    const reviewedCount = allFeedback.filter(f => f.status === 'reviewed').length;

    return (
        <section className="mt-6">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold font-headline text-on-surface">User Feedback</h2>
                <div className="flex items-center gap-3">
                    {/* Search */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">search</span>
                        <input
                            type="text"
                            placeholder="Search by name or email..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="bg-surface-container-highest border-none rounded-xl py-2.5 pl-10 pr-4 text-sm text-on-surface focus:ring-primary focus:ring-2 focus:ring-primary/50 w-64 placeholder:text-on-surface-variant/50"
                        />
                    </div>
                    {/* Filter by status */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">filter_list</span>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-surface-container-highest border-none rounded-xl py-2.5 pl-10 pr-8 text-sm text-on-surface focus:ring-primary focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                        >
                            <option value="all">All Feedback ({allFeedback.length})</option>
                            <option value="new">New ({newCount})</option>
                            <option value="reviewed">Reviewed ({reviewedCount})</option>
                        </select>
                    </div>
                    {/* Sort */}
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">sort</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-surface-container-highest border-none rounded-xl py-2.5 pl-10 pr-8 text-sm text-on-surface focus:ring-primary focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Feedback Table */}
            <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-surface-container-highest border-b border-white/5">
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">User</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Rating</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Message</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Date</th>
                                <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-on-surface-variant">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20">
                                        <div className="flex justify-center">
                                            <div className="flex items-center gap-3 text-on-surface-variant">
                                                <span className="material-symbols-outlined text-2xl animate-spin">refresh</span>
                                                <span>Loading feedback...</span>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ) : allFeedback.length > 0 ? (
                                allFeedback.map((feedback) => (
                                    <tr key={feedback.id} className="hover:bg-white/[0.02] transition-colors group">
                                        <td className="px-6 py-5">
                                            <div>
                                                <p className="font-bold text-on-surface text-sm">{feedback.full_name}</p>
                                                <p className="text-xs text-on-surface-variant mt-0.5">{feedback.email}</p>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <span
                                                        key={star}
                                                        className="material-symbols-outlined text-sm"
                                                        style={{
                                                            fontVariationSettings: "'FILL' 1",
                                                            color: star <= feedback.rating ? '#fbbf24' : '#52525b'
                                                        }}
                                                    >
                                                        star
                                                    </span>
                                                ))}
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <p className="text-sm text-on-surface line-clamp-2 max-w-xs">
                                                {feedback.message}
                                            </p>
                                        </td>
                                        <td className="px-6 py-5">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                                                feedback.status === 'new'
                                                    ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                                    : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            }`}>
                                                {feedback.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-sm text-on-surface-variant">
                                            {new Date(feedback.created_at).toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => handleViewFeedback(feedback)}
                                                    className="flex items-center gap-1 px-4 py-1.5 glass hover:bg-white/10 border border-subtle text-on-surface-variant rounded-lg text-xs font-medium transition-all active:scale-95"
                                                >
                                                    <span className="material-symbols-outlined text-sm">visibility</span>
                                                    View
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="px-8 py-20">
                                        <div className="flex flex-col items-center justify-center text-on-surface-variant">
                                            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">rate_review</span>
                                            <p className="text-lg font-medium">No feedback yet</p>
                                            <p className="text-sm opacity-60 mt-1">Feedback submissions will appear here</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {allFeedback.length > 0 && (
                    <div className="p-6 flex justify-between items-center text-sm text-on-surface-variant font-medium border-t border-white/5">
                        <span>Showing 1-{allFeedback.length} of {allFeedback.length} feedback entries</span>
                        <div className="flex gap-2">
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30" disabled>
                                <span className="material-symbols-outlined text-sm">chevron_left</span>
                            </button>
                            <button className="w-8 h-8 rounded-lg bg-primary text-on-primary font-bold flex items-center justify-center">1</button>
                            <button className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors disabled:opacity-30" disabled>
                                <span className="material-symbols-outlined text-sm">chevron_right</span>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Feedback Modal */}
            <FeedbackModal
                feedback={selectedFeedback}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedFeedback(null);
                }}
                onUpdateStatus={handleUpdateFeedbackStatus}
                onDelete={handleDeleteFeedback}
            />
        </section>
    );
};

export default FeedbackSection;
