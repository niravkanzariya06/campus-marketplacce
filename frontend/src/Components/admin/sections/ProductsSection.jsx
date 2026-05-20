import React, { useState, useEffect } from 'react';
import apiClient from '../../../lib/apiClient';
import { useToast } from '../../../Components/Toast/ToastContainer';

export const TableRowSkeleton = () => {
    const base = 'animate-pulse';
    return (
        <tr className={`flex items-center gap-4 p-4 rounded-xl dark:border-white/5 border-gray-200 ${base} bg-surface-container-high/50`}>
            <td className={`w-10 h-10 rounded-lg bg-surface-container-highest`}></td>
            <td className="flex-1 space-y-2">
                <div className={`h-4 rounded w-3/4 bg-[rgba(255,255,255,0.06)]`}></div>
                <div className={`h-3 rounded w-1/2 bg-[rgba(255,255,255,0.06)]`}></div>
            </td>
            <td className={`h-8 rounded-full px-4 bg-[rgba(255,255,255,0.06)]`}></td>
            <td className="flex gap-2">
                <div className={`h-8 w-8 rounded-lg bg-[rgba(255,255,255,0.06)]`}></div>
                <div className={`h-8 w-8 rounded-lg bg-[rgba(255,255,255,0.06)]`}></div>
            </td>
        </tr>
    );
};

const ProductsSection = ({ onApprove, onReject }) => {
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('newest');
    const { showToast } = useToast();

    const fetchAllProducts = async () => {
        setLoading(true);
        try {
            const response = await apiClient.get('/products/all-products');
            const data = response.data?.data || response.data || [];
            const productsArray = Array.isArray(data) ? data : [];
            setAllProducts(productsArray);
        } catch (error) {
            console.error('Failed to fetch products:', error);
            showToast('Failed to load products', 'error');
            setAllProducts([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Filter products based on status
    const filteredProducts = allProducts.filter(p => {
        if (statusFilter === 'all') return true;
        return p.status === statusFilter;
    });

    // Sort products based on sortBy
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === 'newest') {
            return new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0);
        } else if (sortBy === 'price-low-high') {
            return parseFloat(a.price) - parseFloat(b.price);
        } else if (sortBy === 'price-high-low') {
            return parseFloat(b.price) - parseFloat(a.price);
        }
        return 0;
    });

    // Calculate counts
    const pendingCount = allProducts.filter(p => p.status === 'pending').length;

    const getInitials = (name) => {
        if (!name) return "U";
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    // Use parent handlers if provided, otherwise use local fetch
    const handleApprove = async (productId) => {
        if (onApprove) {
            onApprove(productId);
        } else {
            try {
                await apiClient.patch(`/products/${productId}/approve`);
                showToast('Product approved successfully', 'success');
                fetchAllProducts();
            } catch (error) {
                showToast(error.response?.data?.message || 'Failed to approve product', 'error');
            }
        }
    };

    const handleReject = async (productId) => {
        if (onReject) {
            onReject(productId);
        } else {
            try {
                await apiClient.patch(`/products/${productId}/reject`);
                showToast('Product rejected', 'success');
                fetchAllProducts();
            } catch (error) {
                showToast(error.response?.data?.message || 'Failed to reject product', 'error');
            }
        }
    };

    const TableRows = () => {
        if (loading) {
            return Array.from({ length: 5 }).map((_, i) => (
                <TableRowSkeleton key={i} />
            ));
        }
        if (sortedProducts.length === 0) {
            return (
                <tr>
                    <td colSpan={5} className="px-8 py-20">
                        <div className="flex flex-col items-center justify-center text-on-surface-variant">
                            <span className="material-symbols-outlined text-6xl mb-4 opacity-30">inventory_2</span>
                            <p className="text-lg font-medium">No products in this category</p>
                            <p className="text-sm opacity-60 mt-1">Try selecting a different filter</p>
                        </div>
                    </td>
                </tr>
            );
        }
        return sortedProducts.map((product) => (
            <tr key={product.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-surface-bright p-1 shadow-inner border border-white/5">
                            {product.image_url ? (
                                <img
                                    alt={product.title}
                                    src={product.image_url}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="material-symbols-outlined text-on-surface-variant/40">inventory_2</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="font-bold text-on-surface text-sm line-clamp-1">
                                {product.title}
                            </p>
                            <p className="text-xs text-on-surface-variant mt-0.5">Category: {product.category || 'General'}</p>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-5 font-headline font-semibold text-tertiary">
                    ₹{parseFloat(product.price).toLocaleString('en-IN')}
                </td>
                <td className="px-6 py-5">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-slate-700 overflow-hidden">
                            {product.sellerImage ? (
                                <img
                                    alt={product.sellerName}
                                    src={product.sellerImage}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold dark:text-white text-gray-700">
                                    {getInitials(product.sellerName)}
                                </div>
                            )}
                        </div>
                        <span className="text-sm font-medium text-on-surface">
                            {product.sellerName || 'Unknown'}
                        </span>
                    </div>
                </td>
                <td className="px-6 py-5">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${product.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                            product.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                product.status === 'rejected' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                                    'bg-gray-500/10 text-gray-400 border border-gray-500/20'
                        }`}>
                        {product.status || 'pending'}
                    </span>
                </td>
                <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        {product.status === 'pending' ? (
                            <>
                                <button
                                    onClick={() => handleApprove(product.id)}
                                    className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-br from-emerald-500 to-green-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-emerald-500/20 hover:opacity-90 transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-sm">check</span> Approve
                                </button>
                                <button
                                    onClick={() => handleReject(product.id)}
                                    className="flex items-center gap-1 px-4 py-1.5 bg-gradient-to-br from-red-500 to-orange-500 text-white rounded-lg text-xs font-bold shadow-lg shadow-red-500/20 hover:opacity-90 transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-sm">close</span> Reject
                                </button>
                            </>
                        ) : (
                            <button className="flex items-center gap-1 px-4 py-1.5 glass hover:bg-white/10 border border-subtle text-on-surface-variant rounded-lg text-xs font-medium transition-all active:scale-95">
                                <span className="material-symbols-outlined text-sm">visibility</span> View
                            </button>
                        )}
                    </div>
                </td>
            </tr>
        ));
    };

    return (
        <section>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                {/* Total Listings */}
                <div className="glass-panel tilt-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-primary/20 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
                            <span className="material-symbols-outlined text-xl">inventory_2</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">trending_up</span> +12%
                        </span>
                    </div>
                    <h3 className="text-on-surface-variant text-sm font-medium">Total listings</h3>
                    <p className="text-3xl font-bold font-headline mt-1 text-on-surface">{allProducts.length}</p>
                </div>

                {/* Active Users */}
                <div className="glass-panel tilt-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-secondary/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-secondary/20 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-secondary/10 text-secondary">
                            <span className="material-symbols-outlined text-xl">person</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">trending_up</span> +8%
                        </span>
                    </div>
                    <h3 className="text-on-surface-variant text-sm font-medium">Active users</h3>
                    <p className="text-3xl font-bold font-headline mt-1 text-on-surface">156</p>
                </div>

                {/* Pending Approval */}
                <div className="glass-panel tilt-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-tertiary/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-tertiary/20 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-tertiary/10 text-tertiary">
                            <span className="material-symbols-outlined text-xl">pending_actions</span>
                        </div>
                        <span className="text-xs font-bold text-red-400 bg-red-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">trending_down</span> -5%
                        </span>
                    </div>
                    <h3 className="text-on-surface-variant text-sm font-medium">Pending approval</h3>
                    <p className="text-3xl font-bold font-headline mt-1 text-on-surface">{pendingCount}</p>
                </div>

                {/* Completed Trades */}
                <div className="glass-panel tilt-card p-6 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-400/10 blur-3xl rounded-full -mr-12 -mt-12 group-hover:bg-indigo-400/20 transition-colors"></div>
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2.5 rounded-xl bg-indigo-400/10 text-indigo-400">
                            <span className="material-symbols-outlined text-xl">handshake</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full flex items-center gap-1">
                            <span className="material-symbols-outlined text-[10px]">trending_up</span> +23%
                        </span>
                    </div>
                    <h3 className="text-on-surface-variant text-sm font-medium">Completed trades</h3>
                    <p className="text-3xl font-bold font-headline mt-1 text-on-surface">89</p>
                </div>
            </div>

            {/* Product Table Section */}
            <div className="mt-8 mb-12">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                    <h2 className="text-2xl font-bold font-headline text-on-surface">Product Listings</h2>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-sm">filter_list</span>
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="bg-surface-container-highest border-none rounded-xl py-2.5 pl-10 pr-8 text-sm text-on-surface focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 text-sm">sort</span>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-surface-container-highest border-none rounded-xl py-2.5 pl-10 pr-8 text-sm text-on-surface focus:ring-primary appearance-none cursor-pointer"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price-low-high">Price: Low to High</option>
                                <option value="price-high-low">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="glass-panel rounded-3xl overflow-hidden shadow-2xl">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse min-w-[800px]">
                            <thead>
                                <tr className="bg-surface-container-highest border-b border-white/5">
                                    <th className="px-8 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Product Details</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Price</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Seller</th>
                                    <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                                    <th className="px-6 py-4 text-right text-xs font-bold uppercase tracking-wider text-on-surface-variant">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {TableRows()}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {!loading && sortedProducts.length > 0 && (
                        <div className="p-6 flex justify-between items-center text-sm text-on-surface-variant font-medium border-t border-white/5">
                            <span>Showing 1-{sortedProducts.length} of {sortedProducts.length} products</span>
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
            </div>
        </section>
    );
};

export default ProductsSection;
