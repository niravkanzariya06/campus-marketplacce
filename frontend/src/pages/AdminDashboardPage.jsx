import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import TabNavigation from '../Components/admin/TabNavigation';
import ProductsSection from '../Components/admin/sections/ProductsSection';
import FeedbackSection from '../Components/admin/sections/FeedbackSection';
import ReportsSection from '../Components/admin/sections/ReportsSection';

const AdminDashboard = () => {
    const { userData, isAdmin } = useSelector(state => state.auth);
    const navigate = useNavigate();

    // Tab navigation state
    const [activeTab, setActiveTab] = useState('products'); // 'products', 'feedback', 'reports'


    useEffect(() => {
        if (!isAdmin) {
            navigate('/');
        }
    }, [isAdmin, navigate]);

    // Tab configuration
    const tabs = [
        {
            id: 'products',
            label: 'Products',
            icon: 'inventory_2'
        },
        {
            id: 'feedback',
            label: 'Feedback',
            icon: 'rate_review'
        },
        {
            id: 'reports',
            label: 'Reports',
            icon: 'assessment'
        }
    ];

    // Render the active tab content
    const renderTabContent = () => {
        switch (activeTab) {
            case 'products':
                return <ProductsSection />;
            case 'feedback':
                return <FeedbackSection />;
            case 'reports':
                return <ReportsSection />;
            default:
                return <ProductsSection />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 mt-6 pb-12">
            {/* Header Section */}
            <header className="mb-6 flex flex-col md:flex-row md:justify-between md:items-end gap-4 md:gap-6">
                <div>
                    <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold font-headline bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent tracking-tight">Admin Dashboard</h1>
                    <p className="text-on-surface-variant mt-2 text-sm sm:text-base lg:text-lg">Welcome back, {userData?.name || 'Administrator'}</p>
                </div>
                <div className="flex flex-wrap gap-4">
                    <button className="glass-panel px-6 py-2.5 rounded-xl text-sm font-semibold text-on-surface hover:bg-white/10 transition-all active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">file_download</span> Export Report
                    </button>
                    <button className="bg-gradient-to-br from-primary to-tertiary px-6 py-2.5 rounded-xl text-sm font-bold text-on-primary shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 flex items-center gap-2">
                        <span className="material-symbols-outlined text-lg">add</span> New Entry
                    </button>
                </div>
            </header>

            {/* Tab Navigation */}
            <TabNavigation
                activeTab={activeTab}
                onTabChange={setActiveTab}
                tabs={tabs}
            />

            {/* Tab Content */}
            <div className="mt-6">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default AdminDashboard;
