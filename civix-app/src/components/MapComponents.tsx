import React, { useState } from 'react';
import { Marker, Popup } from 'react-map-gl';
import type { Report } from '../services/reportService';
import { MapPin } from 'lucide-react';

// --- Sub-components ---

export const ReportMarker = ({ report, onClick }: { report: Report; onClick: () => void }) => {
  const [showPopup, setShowPopup] = useState(false);

  return (
    <>
      <Marker
        longitude={report.location.coordinates[0]}
        latitude={report.location.coordinates[1]}
        anchor="bottom"
        onClick={e => {
          e.originalEvent.stopPropagation();
          onClick();
          setShowPopup(true);
        }}
      >
        <MapPin className="text-primary w-8 h-8 fill-primary/20 hover:scale-110 transition-transform cursor-pointer" />
      </Marker>

      {showPopup && (
        <Popup
          longitude={report.location.coordinates[0]}
          latitude={report.location.coordinates[1]}
          anchor="top"
          onClose={() => setShowPopup(false)}
          closeOnClick={false}
          className="custom-popup"
        >
          <div className="p-2 min-w-[150px]">
            <h4 className="font-bold text-sm mb-1 text-gray-900">{report.title}</h4>
            <p className="text-[10px] text-gray-500 line-clamp-2">{report.description}</p>
            <span className={`text-[8px] font-black uppercase mt-2 inline-block px-1.5 py-0.5 rounded ${
              report.status === 'pending' ? 'bg-red-100 text-red-600' : 
              report.status === 'in-progress' ? 'bg-orange-100 text-orange-600' :
              'bg-emerald-100 text-emerald-600'
            }`}>
              {report.status}
            </span>
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
