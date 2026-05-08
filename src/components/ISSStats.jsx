import React from 'react';
import { MapPin, Navigation, Gauge, History, RefreshCw } from 'lucide-react';

const ISSStats = ({ issData, trackedCount, speed, location, isRefreshing, onRefresh }) => {
  return (
    <div className="glass-card">
      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">
            <MapPin size={14} className="inline mr-1" /> Latitude
          </div>
          <div className="stat-value">{issData?.lat ? issData.lat.toFixed(4) : '--'}°</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">
            <Navigation size={14} className="inline mr-1" /> Longitude
          </div>
          <div className="stat-value">{issData?.lng ? issData.lng.toFixed(4) : '--'}°</div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <Gauge size={14} className="inline mr-1" /> Speed
          </div>
          <div className="stat-value">
            {speed === 'Calculating...' ? speed : `${Math.round(speed)} km/h`}
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-label">
            <History size={14} className="inline mr-1" /> Tracked
          </div>
          <div className="stat-value">{trackedCount} positions</div>
        </div>

        <div className="stat-item" style={{ gridColumn: 'span 2' }}>
          <div className="stat-label">Nearest Location</div>
          <div className="stat-value" style={{ fontSize: '1.1rem', color: '#fff' }}>
            {location}
          </div>
        </div>

        <button 
          className="refresh-btn" 
          onClick={onRefresh} 
          disabled={isRefreshing}
        >
          <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
          {isRefreshing ? 'Refreshing...' : 'Refresh Now'}
        </button>
      </div>
    </div>
  );
};

export default ISSStats;
