import React from 'react';

const TabNavigation = ({ activeTab, onTabChange, tabs }) => {
    return (
        <div className="flex gap-2 p-1 bg-surface-container-highest rounded-2xl overflow-x-auto max-w-full w-fit mb-8">
            {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => onTabChange(tab.id)}
                        className={`whitespace-nowrap px-6 py-3 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                            isActive
                                ? 'bg-gradient-to-br from-primary to-tertiary text-on-primary shadow-lg shadow-primary/20'
                                : 'glass hover:bg-white/10 border border-subtle text-on-surface-variant'
                        }`}
                    >
                        <span className="material-symbols-outlined">{tab.icon}</span>
                        {tab.label}
                        {tab.badge && (
                            <span className="px-2 py-0.5 rounded-full text-xs bg-white/20">
                                {tab.badge}
                            </span>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default TabNavigation;
