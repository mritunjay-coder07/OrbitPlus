import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { Activity, Globe, Map as MapIcon, RefreshCw } from 'lucide-react';
import ISSMap from './components/ISSMap';
import ISSStats from './components/ISSStats';
import PeopleInSpace from './components/PeopleInSpace';
import NewsSection from './components/NewsSection';
import Chatbot from './components/Chatbot';
import SpeedChart from './components/SpeedChart';
import NewsDistributionChart from './components/NewsDistributionChart';
import ThemeToggle from './components/ThemeToggle';

import { fetchISSNow, fetchAstros, reverseGeocode, fetchNewsAPI, getMockNews } from './utils/api';
import { calculateSpeed } from './utils/calculateSpeed';
import { getCache, setCache } from './utils/cache';

function App() {
  const [issData, setIssData] = useState(null);
  const [history, setHistory] = useState([]);
  const [speedHistory, setSpeedHistory] = useState([]);
  const [speed, setSpeed] = useState('Calculating...');
  const [location, setLocation] = useState('Identifying...');
  const [astros, setAstros] = useState({ people: [], number: 0 });
  const [news, setNews] = useState([]);
  const [newsCategoryFilter, setNewsCategoryFilter] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isNewsLoading, setIsNewsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [theme, setTheme] = useState(() => localStorage.getItem('app-theme') || 'dark');

  useEffect(() => {
    document.body.className = theme === 'light' ? 'light-theme' : '';
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    toast.success(`Theme updated`, { icon: newTheme === 'dark' ? '🌙' : '☀️' });
  };

  const updateISS = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const data = await fetchISSNow();
      setIssData(prev => {
        if (prev) {
          const timeDiff = data.timestamp - prev.timestamp;
          const currentSpeed = calculateSpeed(prev, data, timeDiff);
          setSpeed(currentSpeed);
          if (typeof currentSpeed === 'number') {
            setSpeedHistory(sh => {
              const newEntry = {
                time: new Date(data.timestamp * 1000).toLocaleTimeString([], { hour12: false }),
                speed: Math.round(currentSpeed)
              };
              return [...sh, newEntry].slice(-30);
            });
          }
        }
        return data;
      });
      setHistory(prev => [...prev, data].slice(-15));
      const placeName = await reverseGeocode(data.lat, data.lng);
      setLocation(placeName);
      setError(null);
    } catch (err) {
      setError("Sync Error");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  const loadNews = useCallback(async (category = 'all', forceRefresh = false) => {
    setIsNewsLoading(true);
    try {
      const cacheKey = `news_cache_${category}`;
      const cachedData = forceRefresh ? null : getCache(cacheKey);
      if (cachedData) {
        setNews(cachedData);
      } else {
        let spaceNews = [], techNews = [];
        try {
          if (category === 'space' || category === 'all') spaceNews = await fetchNewsAPI('space');
          if (category === 'tech' || category === 'all') techNews = await fetchNewsAPI('technology');
        } catch (apiErr) {
          spaceNews = getMockNews();
        }
        const combinedNews = category === 'all' ? [...spaceNews, ...techNews] : (category === 'space' ? spaceNews : techNews);
        setNews(combinedNews);
        setCache(cacheKey, combinedNews);
      }
    } catch (err) {
      setNews(getMockNews());
    } finally {
      setIsNewsLoading(false);
    }
  }, []);

  useEffect(() => {
    updateISS();
    fetchAstros().then(setAstros).catch(console.error);
    loadNews();
    const interval = setInterval(updateISS, 15000);
    return () => clearInterval(interval);
  }, [updateISS, loadNews]);

  const chatbotContext = {
    iss: issData,
    speed: speed,
    location: location,
    trackedCount: history.length,
    peopleCount: astros.number,
    astronauts: astros.people,
    news: news
  };

  return (
    <div className="app">
      <main className="dashboard-container">
        <Toaster position="top-right" />
        
        {/* Header Section */}
        <header className="dashboard-header">
          <div className="header-title">
            <h1>Real-Time ISS & News Dashboard</h1>
            <p>Live space tracking, mission analytics, and AI assistant</p>
          </div>
          <div className="header-actions">
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
            <div className="live-badge">
              <div className="live-dot" />
              LIVE MISSION SYNC
            </div>
          </div>
        </header>

        {error && (
          <div className="glass-card flex justify-between items-center p-4 border-error/30 bg-error/10">
            <span className="text-error font-semibold">MISSION SYNC FAILED</span>
            <button onClick={updateISS} className="retry-btn py-2 px-6 text-xs h-auto">Re-initialize</button>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="top-grid">
          {/* Left: Tracking Card */}
          <div className="glass-card tracking-card">
            <div className="flex justify-between items-center">
              <h3 className="section-title m-0"><MapIcon size={22} className="text-accent-blue" /> Mission Tracking</h3>
              <div className="flex items-center gap-4">
                <span className="text-[10px] text-text-secondary uppercase tracking-widest">
                  {isRefreshing ? 'Syncing...' : 'Signal Optimal'}
                </span>
                <button onClick={updateISS} className="refresh-btn p-2">
                  <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>

            <div className="tracking-stats-row">
              <div className="stat-box">
                <span className="label">Latitude</span>
                <span className="value">{issData?.lat?.toFixed(4) || '--'}°</span>
              </div>
              <div className="stat-box">
                <span className="label">Longitude</span>
                <span className="value">{issData?.lng?.toFixed(4) || '--'}°</span>
              </div>
              <div className="stat-box">
                <span className="label">Speed</span>
                <span className="value">{typeof speed === 'number' ? `${Math.round(speed)} km/h` : 'Calc...'}</span>
              </div>
              <div className="stat-box">
                <span className="label">Nearest Region</span>
                <span className="value" style={{ fontSize: '1rem' }}>{location}</span>
              </div>
            </div>

            <ISSMap currentPos={issData} history={history} speed={speed} />
          </div>

          {/* Right: Side Panels */}
          <div className="side-panel">
            <ISSStats 
              issData={issData} 
              trackedCount={history.length}
              speed={speed}
              location={location}
              isRefreshing={isRefreshing}
              onRefresh={updateISS}
            />
            <PeopleInSpace people={astros.people} total={astros.number} />
          </div>
        </div>

        {/* Analytics Section */}
        <section>
          <h2 className="section-title"><Activity size={22} className="text-accent-blue" /> Analytics & Visuals</h2>
          <div className="analytics-grid">
            <SpeedChart history={speedHistory} />
            <NewsDistributionChart 
              news={news} 
              activeFilter={newsCategoryFilter}
              onFilter={setNewsCategoryFilter}
              onReset={() => setNewsCategoryFilter(null)}
            />
          </div>
        </section>

        {/* Breaking News Section */}
        <section>
          <NewsSection 
            news={news} 
            isLoading={isNewsLoading} 
            externalFilter={newsCategoryFilter}
            onClearFilter={() => setNewsCategoryFilter(null)}
            onRefreshCategory={(cat) => loadNews(cat, true)} 
          />
        </section>
      </main>

      <Chatbot appData={chatbotContext} />
    </div>
  );
}

export default App;
