/**
 * Simple localStorage caching utility
 */

export const setCache = (key, data) => {
  const cacheData = {
    data,
    timestamp: Date.now(),
  };
  localStorage.setItem(key, JSON.stringify(cacheData));
};

export const getCache = (key, ttlMinutes = 15) => {
  const cached = localStorage.getItem(key);
  if (!cached) return null;

  try {
    const { data, timestamp } = JSON.parse(cached);
    const age = (Date.now() - timestamp) / (1000 * 60);

    if (age < ttlMinutes) {
      return data;
    }
    
    // Cache expired
    localStorage.removeItem(key);
    return null;
  } catch (e) {
    return null;
  }
};
