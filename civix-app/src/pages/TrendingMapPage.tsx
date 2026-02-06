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
const MapController = ({ center }: { center: [number, number] | null }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, 13, { duration: 2 });
    }
  }, [center, map]);
  return null;
};

const TrendingMapPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'LIST'>('MAP');
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [userCity, setUserCity] = useState<string>("Locating...");
  const [mapLayer, setMapLayer] = useState<'standard' | 'satellite' | 'dark'>('standard');
  const [showLayerMenu, setShowLayerMenu] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Fix for default Leaflet icon not showing in Vite
    const DefaultIcon = L.icon({
      iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
      iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      tooltipAnchor: [16, -28],
      shadowSize: [41, 41]
    });
    L.Marker.prototype.options.icon = DefaultIcon;

    const fetchReports = async () => {
      try {
        const data = await getReports();
        const reportsList = data.data;
        setReports(reportsList);
        if (reportsList.length > 0) {
          // Keep selection null initially so we can focus on user location provided below
          // setSelectedReport(reportsList[0]); 
        }
      } catch (error) {
        console.error('Error fetching reports for map:', error);
      } finally {
        setLoading(false);
      }
    };

    // Auto-detect location & City Name
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          setUserPos([lat, lon]);
          
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
            const data = await res.json();
            const city = data.address?.city || data.address?.town || data.address?.village || "Unknown Location";
            setUserCity(city);
          } catch (e) {
            console.error("Reverse geocode failed", e);
            setUserCity("Seattle"); // Fallback
          }
        },
        (err) => console.error("Loc error", err)
      );
    }

    fetchReports();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950 font-sans overflow-hidden transition-colors duration-300">
      {/* Sidebar for navigation consistency */}
      <aside className="hidden lg:flex flex-col w-20 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 items-center py-8 z-50">
        <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center mb-12 shadow-lg shadow-primary/20 cursor-pointer hover:scale-110 transition-transform" onClick={() => navigate('/')}>
          <div className="w-6 h-5 bg-white rounded-sm" />
        </div>
        <div className="flex-1 flex flex-col gap-8">
          <SideIcon icon={<Compass className="text-primary" />} active />
          <SideIcon icon={<Home className="text-gray-400 hover:text-primary transition-colors cursor-pointer" onClick={() => navigate('/')} />} />
          <SideIcon icon={<TrendingUp className="text-gray-400 hover:text-primary" />} />
          <SideIcon icon={<MapIcon className="text-gray-400 hover:text-primary" />} />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative">
        {/* Dynamic Header */}
        <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex flex-col gap-4 z-30 transition-colors">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Explore Issues</h1>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Seattle • Live Updates</p>
                </div>
              </div>
            </div>
            
            <div className="hidden sm:flex bg-gray-100 dark:bg-gray-800 p-1 rounded-2xl border border-gray-100 dark:border-gray-700">
              <button 
                onClick={() => setActiveTab('MAP')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'MAP' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-blue-400' : 'text-gray-400'}`}
              >
                <Navigation2 size={14} /> MAP
              </button>
              <button 
                onClick={() => setActiveTab('LIST')}
                className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${activeTab === 'LIST' ? 'bg-white dark:bg-gray-700 shadow-sm text-primary dark:text-blue-400' : 'text-gray-400'}`}
              >
                <List size={14} /> LIST
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search districts, issues..." 
                className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-white dark:focus:bg-gray-700 focus:border-primary outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
              />
            </div>
            <button className="h-12 w-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all">
              <Filter size={18} />
            </button>
          </div>
        </header>

        {/* Map Infrastructure */}
        {/* Content Switcher: Map vs Mind Map */}
        <div className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
          {activeTab === 'LIST' ? (
            <div className="h-full overflow-y-auto p-8 bg-slate-50 dark:bg-gray-950 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#1f2937_1px,transparent_1px)] [background-size:16px_16px]">
              <div className="max-w-5xl mx-auto relative min-h-[800px]">
                {/* Central Node */}
                <div className="absolute left-1/2 top-10 -translate-x-1/2 z-20">
                   <div className="bg-primary text-white p-6 rounded-3xl shadow-2xl shadow-primary/30 flex flex-col items-center justify-center w-48 h-48 border-4 border-white dark:border-gray-800 animate-in zoom-in duration-500">
                      <Compass size={40} className="mb-2 animate-pulse" />
                      <h2 className="text-xl font-black uppercase tracking-widest text-center">Civic<br/>Explorer</h2>
                   </div>
                   {/* Connectors */}
                   <div className="absolute top-1/2 left-1/2 w-[400px] h-[2px] bg-gray-300 dark:bg-gray-700 -translate-x-1/2 -z-10 rotate-90 origin-center translate-y-[100px]" />
                   <div className="absolute top-1/2 left-1/2 w-[600px] h-[2px] bg-gray-300 dark:bg-gray-700 -translate-x-1/2 -z-10 translate-y-[150px]" />
                </div>

                {/* Branch 1: Local (Left) */}
                <div className="absolute left-0 top-80 w-[30%]">
                   <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 border-emerald-500 shadow-xl mb-6 relative z-10">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white"><MapIcon size={16} /></div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider">{userCity}</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase">Your Vicinity</p>
                   </div>
                   <div className="space-y-3 pl-4 border-l-2 border-emerald-200 dark:border-emerald-900/30">
                      {(reports.filter(r => r.location?.formattedAddress?.includes(userCity) || r.location?.city === userCity).slice(0, 3).length > 0 
                        ? reports.filter(r => r.location?.formattedAddress?.includes(userCity) || r.location?.city === userCity).slice(0, 3) 
                        : reports.slice(0, 3) 
                      ).map(r => (
                        <div key={r._id} onClick={() => setSelectedReport(r)} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                           <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{r.title}</h4>
                           <p className="text-[10px] text-gray-500 mt-1 flex items-center gap-1"><MapIcon size={8}/> {r.location?.formattedAddress || 'Nearby'}</p>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Branch 2: Trending (Center Bottom) */}
                <div className="absolute left-1/2 -translate-x-1/2 top-[450px] w-[30%]">
                   <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 border-orange-500 shadow-xl mb-6 relative z-10 mx-auto">
                      <div className="absolute -top-3 -right-3 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white"><TrendingUp size={16} /></div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider text-center">Trending</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase text-center">Global Hotspots</p>
                   </div>
                   <div className="grid grid-cols-1 gap-3">
                      {[...reports].sort((a,b) => (b.upvotes || 0) - (a.upvotes || 0)).slice(0, 3).map(r => (
                        <div key={r._id} onClick={() => setSelectedReport(r)} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm hover:scale-105 transition-transform cursor-pointer">
                           <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-black bg-orange-100 text-orange-600 px-2 py-0.5 rounded uppercase">Viral</span>
                              <span className="text-[10px] text-gray-400">{(r.upvotes || 0) * 12 + 450} views</span>
                           </div>
                           <h4 className="font-bold text-gray-900 dark:text-white text-sm line-clamp-1">{r.title}</h4>
                        </div>
                      ))}
                   </div>
                </div>

                {/* Branch 3: Official (Right) */}
                <div className="absolute right-0 top-80 w-[30%]">
                   <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border-2 border-blue-500 shadow-xl mb-6 relative z-10 ml-auto">
                      <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white"><Shield size={16} /></div>
                      <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-wider text-right">Official</h3>
                      <p className="text-xs text-gray-400 font-bold uppercase text-right">City Updates</p>
                   </div>
                   <div className="space-y-3 pr-4 border-r-2 border-blue-200 dark:border-blue-900/30 text-right">
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
                           <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Main St. Closure</h4>
                           <p className="text-[10px] text-blue-600 dark:text-blue-300 mt-1">Scheduled Maintenance • 2 days</p>
                      </div>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800 shadow-sm">
                           <h4 className="font-bold text-blue-900 dark:text-blue-100 text-sm">Town Hall Q&A</h4>
                           <p className="text-[10px] text-blue-600 dark:text-blue-300 mt-1">Friday 6 PM • City Center</p>
                      </div>
                   </div>
                </div>

              </div>
            </div>
          ) : loading ? (
            <div className="absolute inset-0 z-[1000] bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm flex flex-col items-center justify-center space-y-4">
               <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
               <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Synchronizing Map...</p>
            </div>
          ) : (
            <MapContainer 
              center={[47.6062, -122.3321]} 
              zoom={13} 
              scrollWheelZoom={true}
              style={{ height: '100%', width: '100%', zIndex: 1 }}
              className="z-10"
            >
              <MapController center={userPos} />
              
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
          {showLayerMenu && (
             <div className="absolute top-6 right-20 bg-white dark:bg-gray-800 p-2 rounded-xl shadow-xl z-[450] flex flex-col gap-1 border border-gray-100 dark:border-gray-700 animate-in slide-in-from-right-2">
                {(['standard', 'satellite', 'dark'] as const).map(layer => (
                  <button
                    key={layer}
                    onClick={() => { setMapLayer(layer); setShowLayerMenu(false); }}
                    className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg text-left ${mapLayer === layer ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400'}`}
                  >
                    {layer}
                  </button>
                ))}
             </div>
          )}

          {/* Interactive Overlay Tools */}
          <div className="absolute top-6 right-6 flex flex-col gap-2 z-[400]">
            <div onClick={() => setShowLayerMenu(!showLayerMenu)}>
              <MapTool icon={<Layers />} label="Layers" />
            </div>
            <MapTool icon={<Info />} label="Legend" />
          </div>

          {/* Floating Search Hub (Desktop/Bottom Left) */}
          <div className="absolute bottom-6 left-6 z-[400] flex gap-2 pointer-events-none">
             <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl p-2 rounded-2xl border border-white/50 dark:border-gray-800/50 shadow-2xl flex gap-2 pointer-events-auto">
               <FilterTab icon={<TrendingUp size={12} />} label="Trending" active />
               <FilterTab icon={<Users size={12} />} label="Neighborhoods" />
               <FilterTab icon={<Shield size={12} />} label="Official" />
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
