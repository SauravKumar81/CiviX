import React, { useState } from 'react';
import { Marker, Popup } from 'react-map-gl/mapbox';

import type { Report } from '../services/reportService';
import { MapPin, Car, Construction, Building2, Trash2, Megaphone } from 'lucide-react';

// --- Sub-components ---

const getCategoryIcon = (category: string) => {
  switch (category) {
    case 'Car': return Car;
    case 'Road': return Construction;
    case 'Building': return Building2;
    case 'Dirty': return Trash2;
    case 'Public Issue': return Megaphone;
    default: return MapPin;
  }
};

export const ReportMarker = ({ report, onClick }: { report: Report; onClick: () => void }) => {
  const [showPopup, setShowPopup] = useState(false);
  const CategoryIcon = getCategoryIcon(report.category);

  // Time ago calculation (simple version for now)
  const timeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  return (
    <>
      <Marker
        longitude={report.location.coordinates[0]}
        latitude={report.location.coordinates[1]}
        anchor="bottom"
        onClick={(e: any) => {
          e.originalEvent.stopPropagation();
          onClick();
          setShowPopup(true);
        }}
      >
        <div className="relative group cursor-pointer hover:scale-110 transition-transform duration-300">
           {/* Main Avatar Marker */}
           <div className={`w-10 h-10 rounded-full border-2 ${
              report.status === 'pending' ? 'border-red-500' : 
              report.status === 'in-progress' ? 'border-orange-500' : 
              'border-emerald-500'
           } shadow-lg overflow-hidden bg-white`}>
              <img 
                src={report.user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} 
                alt="User" 
                className="w-full h-full object-cover"
              />
           </div>
           
           {/* Small Category Badge */}
           <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-sm ${
              report.status === 'pending' ? 'bg-red-500' : 
              report.status === 'in-progress' ? 'bg-orange-500' : 
              'bg-emerald-500'
           }`}>
              <CategoryIcon size={10} strokeWidth={3} />
           </div>
        </div>
      </Marker>

      {showPopup && (
        <Popup
          longitude={report.location.coordinates[0]}
          latitude={report.location.coordinates[1]}
          anchor="top"
          onClose={() => setShowPopup(false)}
          closeOnClick={false}
          className="custom-popup"
          offset={10}
        >
          <div className="p-3 min-w-[200px] max-w-[240px]">
            {/* User Info Header */}
            <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100 dark:border-gray-800">
                <img src={report.user?.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=fallback"} className="w-6 h-6 rounded-full bg-gray-100" />
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">@{report.user?.name || 'Citizen'}</p>
                    <p className="text-[8px] text-gray-400 uppercase tracking-wider">{timeAgo(report.createdAt || new Date().toISOString())}</p>
                </div>
            </div>

            <h4 className="font-bold text-sm mb-1 text-gray-900 leading-tight">{report.title}</h4>
            <p className="text-[10px] text-gray-500 line-clamp-2 mb-2">{report.description}</p>
            
            <div className="flex items-center justify-between mt-2">
                 <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                  report.status === 'pending' ? 'bg-red-100 text-red-600' : 
                  report.status === 'in-progress' ? 'bg-orange-100 text-orange-600' :
                  'bg-emerald-100 text-emerald-600'
                }`}>
                  {report.status}
                </span>
                <span className="text-[8px] font-bold text-gray-400 flex items-center gap-1">
                    <MapPin size={8} /> {report.location.city || 'Nearby'}
                </span>
            </div>
          </div>
        </Popup>
      )}
    </>
  );
};

export const MapTool = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <button className="group relative w-12 h-12 bg-white dark:bg-gray-900 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary transition-all pointer-events-auto">
    {icon}
    <span className="absolute right-14 bg-gray-900 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">{label}</span>
  </button>
);

export const SideIcon = ({ icon, active = false, onClick }: { icon: React.ReactNode; active?: boolean; onClick?: () => void }) => (
  <div 
    onClick={onClick}
    className={`p-3 rounded-2xl transition-all ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-primary shadow-sm' : 'hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer'}`}
  >
    {icon}
  </div>
);

export const FilterTab = ({ icon, label, active = false }: { icon: React.ReactNode; label: string; active?: boolean }) => (
  <button className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${active ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}>
    {icon}
    {label}
  </button>
);
