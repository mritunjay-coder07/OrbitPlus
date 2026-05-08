const PROXY = 'https://corsproxy.io/?';
const ISS_URL = `${PROXY}${encodeURIComponent('http://api.open-notify.org/iss-now.json')}`;
const ASTROS_URL = `${PROXY}${encodeURIComponent('http://api.open-notify.org/astros.json')}`;

export const fetchISSNow = async () => {
  const response = await fetch(ISS_URL);
  if (!response.ok) throw new Error('Failed to fetch ISS location');
  const data = await response.json();
  return {
    lat: parseFloat(data.iss_position.latitude),
    lng: parseFloat(data.iss_position.longitude),
    timestamp: data.timestamp,
  };
};

export const fetchAstros = async () => {
  const response = await fetch(ASTROS_URL);
  if (!response.ok) throw new Error('Failed to fetch people in space');
  return await response.json();
};

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=10&addressdetails=1`, {
      headers: {
        'Accept-Language': 'en-US,en;q=0.5',
        'User-Agent': 'Orbitplus-ISS-Dashboard'
      }
    });

    if (!response.ok) return 'Over ocean / remote area';

    const data = await response.json();
    if (data.error || !data.display_name) return 'Over ocean / remote area';

    const addr = data.address;
    const location = addr.city || addr.town || addr.village || addr.state || addr.country || 'Over ocean / remote area';
    const country = addr.country ? `, ${addr.country}` : '';

    return location === addr.country ? location : `${location}${country}`;
  } catch (error) {
    return 'Over ocean / remote area';
  }
};

export const fetchNewsAPI = async (category = 'space') => {
  const apiKey = import.meta.env.VITE_NEWS_API_KEY;
  if (!apiKey) throw new Error('No API Key');

  let url = '';
  if (category === 'space') {
    url = `https://newsapi.org/v2/everything?q=space OR astronomy OR NASA&language=en&pageSize=10&sortBy=publishedAt&apiKey=${apiKey}`;
  } else {
    url = `https://newsapi.org/v2/top-headlines?category=technology&language=en&pageSize=10&apiKey=${apiKey}`;
  }

  const response = await fetch(url);
  const data = await response.json();

  if (data.status === 'error') throw new Error(data.message);

  return data.articles.map((article, index) => ({
    id: `${category}-${index}`,
    title: article.title,
    source: article.source.name,
    author: article.author || 'Unknown',
    description: article.description,
    publishedAt: article.publishedAt,
    url: article.url,
    urlToImage: article.urlToImage || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000'
  }));
};

export const getMockNews = () => [
  {
    id: 'mock-1',
    title: "James Webb Telescope Discovers Atmospheric Gases on Super-Earth",
    source: "Space.com",
    author: "Elizabeth Howell",
    description: "Astronomers have detected carbon dioxide and methane in the atmosphere of a planet orbiting a nearby star, suggesting potential habitability.",
    publishedAt: "2024-05-08T10:00:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-2',
    title: "SpaceX Successfully Launches 23 Starlink Satellites from Florida",
    source: "NASA Spaceflight",
    author: "John Kraus",
    description: "The Falcon 9 rocket lifted off from Cape Canaveral Space Force Station, continuing the rapid expansion of the constellation.",
    publishedAt: "2024-05-07T22:30:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-3',
    title: "New ISS Research Explores How Microgravity Affects Muscle Aging",
    source: "NASA News",
    author: "Science Team",
    description: "Scientists on the International Space Station are conducting experiments to understand cellular changes in long-term spaceflight.",
    publishedAt: "2024-05-06T15:45:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-4',
    title: "NASA's Voyager 1 Sends Engineering Updates from Interstellar Space",
    source: "Jet Propulsion Lab",
    author: "NASA Media",
    description: "The veteran spacecraft has resumed sending coherent data after months of binary gibberish, exciting scientists globally.",
    publishedAt: "2024-05-05T09:12:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-5',
    title: "Blue Origin Announces New Launch Date for NS-25 Mission",
    source: "SpaceNews",
    author: "Jeff Foust",
    description: "The New Shepard rocket will carry six explorers past the Kármán line this Sunday, following technical reviews.",
    publishedAt: "2024-05-04T18:30:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1541185933-ef5d8ed016c2?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-6',
    title: "Lunar Gateway: Habitat Modules Enter Final Assembly Phase",
    source: "ESA",
    author: "European Space Agency",
    description: "The first lunar space station is taking shape as international partners deliver core structural components for integration.",
    publishedAt: "2024-05-03T14:00:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1454789548928-9efd52dc4031?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-7',
    title: "China's Chang'e-6 Mission Successfully Enters Lunar Orbit",
    source: "CNSA",
    author: "Xinhua",
    description: "The mission aims to collect samples from the lunar far side, a first in human history, using complex orbital maneuvers.",
    publishedAt: "2024-05-02T11:20:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1522030239044-12f014385ca0?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-8',
    title: "Mars Sample Return: Scientists Propose Cheaper Alternative Missions",
    source: "Sky & Telescope",
    author: "Kelly Beatty",
    description: "New proposals suggest using commercial launch providers to slash costs of returning Martian soil to Earth for analysis.",
    publishedAt: "2024-05-01T20:00:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-9',
    title: "Starliner Ready for Historic Crewed Flight Test This Month",
    source: "Boeing",
    author: "Mission Control",
    description: "Astronauts Butch Wilmore and Suni Williams are in quarantine ahead of the first crewed launch of the CST-100 spacecraft.",
    publishedAt: "2024-04-30T15:00:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&q=80&w=1000"
  },
  {
    id: 'mock-10',
    title: "Europa Clipper: NASA's Largest Planetary Spacecraft Begins Final Checks",
    source: "Space Exploration",
    author: "Astronomy Now",
    description: "The mission will study Jupiter's icy moon Europa to determine if there are places below the surface that could support life.",
    publishedAt: "2024-04-29T12:00:00Z",
    url: "#",
    urlToImage: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&q=80&w=1000"
  }
];
