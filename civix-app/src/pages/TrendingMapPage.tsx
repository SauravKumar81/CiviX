import React, { useState } from 'react';
import { 
  ChevronLeft, Search, Navigation2, Layers, Info, Filter, List, 
  MapPin, Heart, MessageSquare, ChevronDown
} from 'lucide-react';
import { Link } from 'react-router-dom';

const TrendingMapPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'MAP' | 'LIST'>('MAP');

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-950 font-sans transition-colors duration-300 overflow-hidden">
      {/* Dynamic Header */}
      <header className="flex-shrink-0 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex flex-col gap-4 z-30 transition-colors">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/" className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 transition-colors">
              <ChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Trending Issues</h1>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Seattle Central • Live Updates</p>
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
              placeholder="Search by neighborhood or issue type..." 
              className="w-full h-12 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-medium focus:bg-white dark:focus:bg-gray-700 focus:border-primary outline-none transition-all text-gray-900 dark:text-white placeholder:text-gray-400"
            />
          </div>
          <button className="h-12 w-12 flex items-center justify-center bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl text-gray-900 dark:text-white hover:bg-white dark:hover:bg-gray-700 transition-all">
            <Filter size={18} />
          </button>
        </div>
      </header>

      {/* Main Map Content */}
      <main className="flex-1 relative bg-gray-100 dark:bg-gray-900 overflow-hidden">
        {/* Fake Map Container */}
        <div className="absolute inset-0 grayscale dark:invert dark:hue-rotate-180 dark:brightness-90 contrast-125 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.3321,47.6062,13/1200x800?access_token=pk.placeholder')] bg-cover" />
        
        {/* Interactive Overlay Tools */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 z-20">
          <MapTool icon={<Layers />} label="Layers" />
          <MapTool icon={<Info />} label="Legend" />
          <div className="h-px bg-gray-200 dark:bg-gray-700 my-2" />
          <MapTool icon={<div className="font-black text-xs">+</div>} label="Zoom In" />
          <MapTool icon={<div className="font-black text-xs">-</div>} label="Zoom Out" />
        </div>

        {/* Floating Issue Cards / Pins */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Sample Pins */}
          <MapPinItem x="40%" y="35%" severity="HIGH" label="Water Main Break" />
          <MapPinItem x="55%" y="60%" severity="MEDIUM" label="Pothole Hotspot" />
          <MapPinItem x="30%" y="70%" severity="LOW" label="Graffiti" />
        </div>

        {/* Selected Issue Preview (Mobile Optimized) */}
        <div className="absolute bottom-6 left-6 right-6 sm:left-6 sm:right-auto sm:w-[400px] z-20">
          <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-6 rounded-[32px] border border-white dark:border-gray-800 shadow-2xl space-y-4 animate-in slide-in-from-bottom-5 duration-500 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-[10px] font-black rounded uppercase tracking-wider mb-2 inline-block">CRITICAL IMPACT</span>
                <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Main Street Gridlock</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Cap Hill • Reported 14m ago</p>
              </div>
              <button className="p-2 bg-gray-50 dark:bg-gray-800 rounded-full text-gray-400"><ChevronDown /></button>
            </div>

            <div className="flex gap-4">
              <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=400" className="w-20 h-20 rounded-2xl object-cover" alt="Issue" />
              <div className="flex-1 space-y-2">
                <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-relaxed line-clamp-2">
                  Total signaling failure at the 4-way intersection. Drivers are taking risks...
                </p>
                <div className="flex items-center gap-4 text-gray-400">
                  <div className="flex items-center gap-1"><Heart size={14} className="text-red-500" /><span className="text-[10px] font-bold">142</span></div>
                  <div className="flex items-center gap-1"><MessageSquare size={14} /><span className="text-[10px] font-bold">24</span></div>
                </div>
              </div>
            </div>

            <button className="w-full py-3.5 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
              VIEW FULL REPORT
            </button>
          </div>
        </div>

        {/* Map Legend (Bottom Right) */}
        <div className="absolute bottom-6 right-6 hidden md:block">
          <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm p-4 rounded-2xl border border-white dark:border-gray-800 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 space-y-3 shadow-lg transition-colors">
            <div className="flex items-center gap-2 transition-colors"><div className="w-2 h-2 rounded-full bg-red-500" /> High Priority</div>
            <div className="flex items-center gap-2 transition-colors"><div className="w-2 h-2 rounded-full bg-orange-500" /> Medium</div>
            <div className="flex items-center gap-2 transition-colors"><div className="w-2 h-2 rounded-full bg-blue-500" /> Resolved</div>
          </div>
        </div>
      </main>
    </div>
  );
};

const MapTool = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="group relative w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition-all pointer-events-auto">
    {icon}
    <span className="absolute right-14 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{label}</span>
  </button>
);

const MapPinItem = ({ x, y, severity, label }: { x: string, y: string, severity: 'HIGH' | 'MEDIUM' | 'LOW', label: string }) => {
  const color = severity === 'HIGH' ? 'bg-red-500' : severity === 'MEDIUM' ? 'bg-orange-500' : 'bg-blue-500';
  return (
    <div className="absolute transition-transform hover:scale-110 pointer-events-auto cursor-pointer" style={{ left: x, top: y }}>
      <div className="relative">
        <div className={`w-4 h-4 ${color} rounded-full border-2 border-white dark:border-gray-900 shadow-lg`} />
        <div className={`absolute inset-0 -m-2 rounded-full ${color} opacity-20 animate-ping`} />
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 bg-white dark:bg-gray-900 px-2 py-1 rounded-md shadow-sm border border-gray-100 dark:border-gray-800 whitespace-nowrap hidden sm:block transition-colors">
          <p className="text-[8px] font-black text-gray-900 dark:text-white uppercase tracking-tighter transition-colors">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default TrendingMapPage;
