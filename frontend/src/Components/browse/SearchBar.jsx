import React from 'react';

const SearchBar = ({ search, setSearch, onSearch, compact = false }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch && onSearch();
    }
  };

  return (
    <div className={`w-full max-w-4xl mx-auto ${compact ? 'mb-2' : 'mb-4'}`}>
      <div className={`glass-card rounded-xl flex items-center border border-white/10 hover:border-[rgba(99,102,241,0.4)] hover:shadow-[0_0_0_2px_rgba(99,102,241,0.2)] focus-within:animate-circular-glow focus-within:border-[rgba(99,102,241,1)] transition-all duration-300 ${compact ? 'h-8 px-2' : 'h-10 px-3'}`}>
        <span className="material-symbols-outlined ml-1.5 text-on-surface-variant group-focus-within:text-primary transition-colors text-sm">{compact ? 'search' : 'search'}</span>
        <input
          className={`w-full bg-transparent border-2 border-transparent ${compact ? 'px-2 text-xs py-1' : 'px-3 text-sm py-2'} font-plus-jakarta text-on-surface focus:ring-0 focus:outline-none focus:border-primary placeholder-[rgba(163,170,196,0.4)] transition-all duration-300`}
          placeholder="Search..."
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        {search && (
          <button
            className={`${compact ? 'mr-1 p-0.5' : 'mr-1.5 p-1'} text-on-surface-variant hover:text-primary transition-colors`}
            onClick={() => setSearch('')}
            title="Clear search"
          >
            <span className={`material-symbols-outlined ${compact ? 'text-sm' : 'text-base'}`}>close</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
