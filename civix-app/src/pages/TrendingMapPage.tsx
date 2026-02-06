import React, { useState, useEffect } from 'react';
import { 
  ChevronLeft, Search, Navigation2, Layers, Info, Filter, List, 
  Heart, MessageSquare, Compass, Home, TrendingUp, Map as MapIcon, 
  X, Users, Shield
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getReports } from '../services/reportService';
import type { Report } from '../services/reportService';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ReportMarker, MapTool, SideIcon, FilterTab } from '../components/MapComponents';

// Map Controller to handle centering
const MapController = ({ center, trigger }: { center: [number, number] | null, trigger: number }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 2 });
    }
  }, [center, map, trigger]);
  return null;
};

const TrendingMapPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'LIST'>('MAP');
  // ... existing state
  const [recenterTrigger, setRecenterTrigger] = useState(0);

  // ... (inside MapContainer render)
            <MapContainer 
              center={[47.6062, -122.3321]} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
              className="z-10"
            >
              <MapController center={userPos} trigger={recenterTrigger} />
              
              {/* ... other map children */}

  // ... (inside Overlay Tools div)
          {/* Interactive Overlay Tools */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-[400]">
            <div onClick={() => setRecenterTrigger(prev => prev + 1)} title="Re-center Map">
               <MapTool icon={<Compass className={recenterTrigger > 0 ? "text-primary fill-primary/20" : ""} />} label="Locate Me" />
            </div>
            <div onClick={() => setShowLayerMenu(!showLayerMenu)}>
              <MapTool icon={<Layers />} label="Layers" />
            </div>
            <MapTool icon={<Info />} label="Legend" />
          </div>
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [userCity, setUserCity] = useState<string>("Locating...");
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite' | 'dark'>('standard');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'trending' | 'neighborhoods' | 'official'>('trending');
  const [recenterTrigger, setRecenterTrigger] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // ... existing useEffect code ...
  }, [searchQuery, activeFilter, userPos]); 

  return (
    // ... wrapper div ...
      // ... sidebar ...
      
      <main className="flex-1 flex flex-col relative">
        {/* ... header ... */}

        {/* Map Infrastructure */}
        <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
          {activeTab === 'LIST' ? (
             // ... List View ...
             <div className="h-full overflow-y-auto p-8 bg-slate-50 dark:bg-gray-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]">
               {/* ... */}
             </div>
          ) : loading ? (
             // ... Loading ...
             <div className="absolute inset-0 z-[1000] bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
               {/* ... */}
             </div>
          ) : (
            <MapContainer 
              center={[47.6062, -122.3321]} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
              className="z-10"
            >
              <MapController center={userPos} trigger={recenterTrigger} />
              
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url={
                  mapLayer === 'satellite' 
                    ? "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}" 
                    : mapLayer === 'dark'
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                }
                className={mapLayer === 'standard' ? "dark:invert dark:hue-rotate-180 dark:brightness-95 dark:contrast-125" : ""}
              />
              
              {userPos && (
                <Marker position={userPos} icon={L.icon({
                  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
                  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
                  iconSize: [25, 41],
                  iconAnchor: [12, 41],
                  popupAnchor: [1, -34],
                  shadowSize: [41, 41]
                })}>
                  <Popup>You are here</Popup>
                </Marker>
              )}
              
              {reports.map((report) => (
                <ReportMarker 
                  key={report._id} 
                  report={report} 
                  onClick={() => setSelectedReport(report)}
                />
              ))}
            </MapContainer>
          )}

          {/* Layer Menu Overlay */}
          {/* ... */}

          {/* Interactive Overlay Tools */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-[400]">
            <div onClick={() => setRecenterTrigger(prev => prev + 1)} title="Re-center Map">
               <MapTool icon={<Compass className={recenterTrigger > 0 ? "text-primary fill-primary/20" : ""} />} label="Locate Me" />
            </div>
            <div onClick={() => setShowLayerMenu(!showLayerMenu)}>
              <MapTool icon={<Layers />} label="Layers" />
            </div>
            <MapTool icon={<Info />} label="Legend" />
          </div>

          {/* Floating Search Hub (Desktop/Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-[400] flex gap-2 pointer-events-none">
             <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-2 rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-2xl flex gap-2 pointer-events-auto">
               <div onClick={() => setActiveFilter('trending')}>
                 <FilterTab icon={<TrendingUp size={12} />} label="Trending" active={activeFilter === 'trending'} />
               </div>
               <div onClick={() => setActiveFilter('neighborhoods')}>
                 <FilterTab icon={<Users size={12} />} label="Neighborhoods" active={activeFilter === 'neighborhoods'} />
               </div>
               <div onClick={() => setActiveFilter('official')}>
                 <FilterTab icon={<Shield size={12} />} label="Official" active={activeFilter === 'official'} />
               </div>
             </div>
          </div>

          {/* Selected Issue Preview */}
          {selectedReport && (
            <div className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-[420px] z-[500]">
              <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl p-6 rounded-[32px] border border-white/50 dark:border-gray-800/50 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-500">
                <div className="flex justify-between items-start">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 ${
                        selectedReport.status === 'pending' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' : 
                        selectedReport.status === 'in-progress' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400' :
                        'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'
                      } text-[10px] font-black rounded-lg uppercase tracking-wider`}>
                        {selectedReport.status?.toUpperCase() || 'REPORTED'}
                      </span>
                      <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{selectedReport.category}</span>
                    </div>
                    <h3 className="text-lg font-black text-gray-900 dark:text-white tracking-tight">{selectedReport.title}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 font-medium">
                      <Navigation2 size={10} className="text-primary" /> {selectedReport.location?.formattedAddress || 'Seattle, WA'}
                    </p>
                  </div>
                  <button 
                    onClick={() => setSelectedReport(null)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                <div className="flex gap-4">
                  <div className="relative group/img overflow-hidden rounded-2xl w-20 h-20 flex-shrink-0">
                    <img 
                      src={selectedReport.imageUrl !== 'no-photo.jpg' ? selectedReport.imageUrl : "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400"} 
                      className="w-full h-full object-cover transition-transform group-hover/img:scale-110" 
                      alt="Issue" 
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2">
                      {selectedReport.description}
                    </p>
                    <div className="flex items-center gap-3 mt-2 text-gray-400">
                      <div className="flex items-center gap-1"><Heart size={12} /><span className="text-[10px] font-bold">{selectedReport.upvotes || 0}</span></div>
                      <div className="flex items-center gap-1"><MessageSquare size={12} /><span className="text-[10px] font-bold">4</span></div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <button 
                    onClick={() => navigate('/')}
                    className="py-3 bg-primary text-white font-black rounded-2xl text-xs hover:bg-blue-600 transition-all uppercase tracking-wider"
                  >
                    Go Home
                  </button>
                  <button className="py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl text-xs border border-gray-100 dark:border-gray-700 hover:bg-gray-100 transition-all uppercase tracking-wider">
                    Directions
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default TrendingMapPage;
