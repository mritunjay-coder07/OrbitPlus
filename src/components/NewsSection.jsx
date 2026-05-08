import React, { useState, useMemo } from 'react';
import { Newspaper, ExternalLink, Search, SortAsc, RefreshCw, X } from 'lucide-react';

const NewsSection = ({ news, isLoading, onRefreshCategory, externalFilter, onClearFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const filteredAndSortedNews = useMemo(() => {
    let result = news.filter(item => {
      const matchesSearch = 
        item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.source?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.author?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCategory = externalFilter 
        ? (externalFilter === 'Space' ? (item.id.startsWith('space') || item.id.startsWith('mock')) : item.id.startsWith('tech'))
        : true;

      return matchesSearch && matchesCategory;
    });

    if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => new Date(a.publishedAt) - new Date(b.publishedAt));
    } else if (sortBy === 'source') {
      result.sort((a, b) => a.source.localeCompare(b.source));
    }

    return result.slice(0, 10); // Always limit to 10
  }, [news, searchTerm, sortBy, externalFilter]);

  return (
    <div className="glass-card">
      {/* 1. Title Area */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold flex items-center gap-3">
          <Newspaper size={26} className="text-accent-blue" />
          Breaking News
        </h3>
      </div>

      {/* 2. Category Buttons Row */}
      <div className="category-filters">
        <button 
          onClick={() => onRefreshCategory('space')} 
          className={`cat-btn ${externalFilter === 'Space' ? 'active' : ''}`}
        >
          Space Intelligence
        </button>
        <button 
          onClick={() => onRefreshCategory('tech')} 
          className={`cat-btn ${externalFilter === 'Tech' ? 'active' : ''}`}
        >
          Technology Hub
        </button>
        {externalFilter && (
          <button 
            onClick={onClearFilter} 
            className="text-xs text-text-secondary hover:text-white bg-transparent border-none cursor-pointer flex items-center gap-1 ml-2"
          >
            <X size={14} /> Clear Filter
          </button>
        )}
      </div>

      {/* 3. Controls Row (Search, Sort, Refresh) */}
      <div className="news-controls">
        <div className="news-search-wrapper">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
          <input 
            type="text" 
            placeholder="Search Global Intel Database..." 
            className="news-search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <select 
          className="news-sort-select"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="newest">Sort: Newest First</option>
          <option value="oldest">Sort: Oldest First</option>
          <option value="source">Sort: Source A-Z</option>
        </select>
        
        <button 
          onClick={() => onRefreshCategory('all')} 
          className="news-refresh-btn" 
          title="Refresh All News"
        >
          <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
        </button>
      </div>
      
      {/* 4. Vertical News List */}
      <div className="news-list">
        {isLoading ? (
          [1, 2, 3, 4, 5].map(i => (
            <div key={i} className="news-row-item skeleton"></div>
          ))
        ) : filteredAndSortedNews.length > 0 ? (
          filteredAndSortedNews.map((item) => (
            <div key={item.id} className="news-row-item">
              <img 
                src={item.urlToImage} 
                alt="" 
                className="news-thumb"
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=200'; }}
              />
              <div className="news-content-middle">
                <div className="news-info-line">
                  <span className="font-bold">{item.source}</span>
                  <span>•</span>
                  <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{item.author !== 'Unknown' ? item.author : 'Intelligence Bureau'}</span>
                </div>
                <h4 className="news-title">{item.title}</h4>
                <p className="news-description">{item.description}</p>
              </div>
              <div className="news-action">
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="read-more-btn" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                  Intel <ExternalLink size={14} className="ml-1" />
                </a>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-text-secondary py-10 glass-card">
            No intelligence records found matching your current query.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsSection;
