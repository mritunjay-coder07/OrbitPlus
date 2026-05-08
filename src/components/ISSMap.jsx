import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Gauge, MapPin } from 'lucide-react';

const issIcon = L.divIcon({
  className: 'custom-iss-icon',
  html: `
    <div style="
      width: 40px; 
      height: 40px; 
      background: rgba(0, 242, 255, 0.2); 
      border: 2px solid #00f2ff; 
      border-radius: 50%; 
      display: flex; 
      align-items: center; 
      justify-content: center;
      box-shadow: 0 0 15px #00f2ff;
    ">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00f2ff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2v20M2 12h20M5 5l14 14M19 5L5 19"></path>
      </svg>
    </div>
  `,
  iconSize: [40, 40],
  iconAnchor: [20, 20]
});

function ChangeView({ center }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

const ISSMap = ({ currentPos, history = [], speed }) => {
  if (!currentPos || !currentPos.lat || !currentPos.lng) {
    return (
      <div className="iss-map-wrapper flex flex-col items-center justify-center bg-black/20 gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-accent-blue"></div>
        <p className="text-accent-blue font-semibold animate-pulse">Syncing with ISS Telemetry...</p>
      </div>
    );
  }

  const positions = history
    ? history
        .filter(p => p && typeof p.lat === 'number' && typeof p.lng === 'number')
        .map(p => [p.lat, p.lng])
    : [];

  const center = [currentPos.lat, currentPos.lng];

  return (
    <div className="iss-map-wrapper">
      <MapContainer 
        center={center} 
        zoom={3} 
        scrollWheelZoom={true}
        className="iss-leaflet-map"
      >
        <TileLayer
          attribution='&copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <ChangeView center={center} />
        {positions.length > 0 && (
          <Polyline 
            positions={positions} 
            color="#00f2ff" 
            weight={2} 
            opacity={0.8}
            dashArray="10, 10"
          />
        )}
        <Marker position={center} icon={issIcon}>
          <Popup className="custom-map-popup">
            <div className="p-2 space-y-2">
              <h4 className="font-bold border-b border-white/10 pb-1 mb-2">ISS Real-Time</h4>
              <div className="flex items-center gap-2 text-xs">
                <MapPin size={14} className="text-accent-blue" />
                <span>Lat: {currentPos?.lat?.toFixed(4)}°</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Navigation size={14} className="text-accent-blue" />
                <span>Lng: {currentPos?.lng?.toFixed(4)}°</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Gauge size={14} className="text-accent-purple" />
                <span>Speed: {typeof speed === 'number' ? `${Math.round(speed)} km/h` : 'Calculating...'}</span>
              </div>
            </div>
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default ISSMap;
