import React, { useState, useRef } from 'react';
import { Camera, MapPin, ChevronLeft, Send, X, Check, Maximize2, Car, Construction, Building2, Trash2, Megaphone, type LucideIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { createReport } from '../services/reportService';
import axios from 'axios';
import Map, { Marker, NavigationControl, GeolocateControl } from 'react-map-gl/mapbox';

const categories = [
    { id: 'Car', label: 'Car', icon: Car },
    { id: 'Road', label: 'Road', icon: Construction },
    { id: 'Building', label: 'Building', icon: Building2 },
    { id: 'Dirty', label: 'Dirty', icon: Trash2 },
    { id: 'Public Issue', label: 'Public Issue', icon: Megaphone }
];

const ReportIssuePage: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0].id);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [coordinates, setCoordinates] = useState<[number, number]>([47.6062, -122.3321]); // Lat, Lng
  const [viewState, setViewState] = useState({
    longitude: -122.3321,
    latitude: 47.6062,
    zoom: 13
  });
  const [address, setAddress] = useState('Seattle, WA 98101');
  const [showMapModal, setShowMapModal] = useState(false);
  const [showLocationCheck, setShowLocationCheck] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleDetectLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      return;
    }

    setShowLocationCheck(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setCoordinates([lat, lng]);
        setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
        setShowLocationCheck(false);
        
        setViewState(prev => ({ ...prev, longitude: lng, latitude: lat, zoom: 15 }));
        // If modal is open, fly to location
        if (showMapModal && mapRef.current) {
             mapRef.current.flyTo({ center: [lng, lat], zoom: 15 });
        }
      },
      () => {
        setError('Unable to retrieve your location');
        setShowLocationCheck(false);
      }
    );
  };

  const handleMapClick = (event: any) => {
    const { lng, lat } = event.lngLat;
    setCoordinates([lat, lng]);
    setAddress(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
  };

  const handleSubmit = async () => {
    if (!description) return setError('Please provide a description');
    
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title || `Report - ${category}`);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('status', 'pending');
      
      const locationData = {
        type: 'Point',
        coordinates: [coordinates[1], coordinates[0]], // [long, lat] for GeoJSON
        formattedAddress: address
      };
      formData.append('location', JSON.stringify(locationData));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await createReport(formData);
      navigate('/');
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.response?.data?.error || err.message 
        : (err as Error).message;
      setError(errorMessage || 'Failed to submit report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4 transition-colors shadow-sm">
        <Link to="/" className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">New Civic Report</h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest">Submit Issue</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8 pb-32">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl border border-red-100 dark:border-red-800 animate-pulse">
            {error}
          </div>
        )}

        {/* Category Selection */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Category</h2>
            <span className="text-[10px] font-bold text-gray-400">Required</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {categories.map((cat) => (
                <CategoryCard key={cat.id} label={cat.label} icon={cat.icon} active={category === cat.id} onClick={() => setCategory(cat.id)} />
            ))}
          </div>
        </section>

        {/* Issue Details */}
        <section className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="space-y-1">
            <label className="text-xs font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block">Issue Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Briefly summarize the issue..." 
              className="w-full p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-gray-900 dark:text-white font-bold placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the location, problem details, and any hazards..." 
              className="w-full min-h-[140px] p-4 bg-gray-50 dark:bg-gray-950 border border-gray-200 dark:border-gray-800 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400 resize-none"
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block">Evidence</label>
            <div className="flex gap-4 overflow-x-auto pb-2">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-24 h-24 flex-shrink-0 bg-gray-50 dark:bg-gray-950 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-2 group hover:border-primary hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-all"
              >
                <Camera className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest group-hover:text-primary transition-colors">Add Photo</span>
              </button>
              
              {imagePreview && (
                <div className="w-24 h-24 flex-shrink-0 relative rounded-2xl overflow-hidden group shadow-md">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    onClick={handleRemoveImage}
                    className="absolute top-1 right-1 p-1 bg-black/60 text-white rounded-full hover:bg-red-500 transition-colors backdrop-blur-sm"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Location Section - Refactored */}
        <section className="bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="flex justify-between items-center mb-4">
             <h2 className="text-xs font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest">Location</h2>
             <button 
                onClick={handleDetectLocation}
                className="text-[10px] font-black text-primary flex items-center gap-1 hover:bg-blue-50 dark:hover:bg-blue-900/20 px-3 py-1.5 rounded-lg transition-colors"
                disabled={showLocationCheck}
             >
               <MapPin className={`w-3 h-3 ${showLocationCheck ? 'animate-bounce' : ''}`} />
               {showLocationCheck ? 'LOCATING...' : 'USE MY LOCATION'}
             </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 bg-gray-50 dark:bg-gray-950 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary flex-shrink-0">
                      <MapPin className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                      <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tight truncate">{address}</p>
                      <p className="text-[10px] text-gray-500">Lat: {coordinates[0].toFixed(4)}, Lng: {coordinates[1].toFixed(4)}</p>
                  </div>
              </div>
              <button 
                onClick={() => setShowMapModal(true)}
                className="px-6 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-bold text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity uppercase tracking-wider shadow-lg"
              >
                  <Maximize2 size={16} />
                  Select on Map
              </button>
          </div>
        </section>

        {/* Submit Action */}
        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-16 bg-gradient-to-r from-primary to-blue-600 hover:to-blue-700 text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all transform active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>SUBMITTING...</span>
            </div>
          ) : (
            <>
              <span>SUBMIT REPORT</span>
              <Send className="w-5 h-5" />
            </>
          )}
        </button>
      </main>

      {/* Map Selection Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-[1000] bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
           <div className="bg-white dark:bg-gray-900 w-full max-w-4xl h-[80vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col relative animate-in zoom-in-95 duration-200 border border-white/20">
              <div className="absolute top-4 right-4 z-[10] flex gap-2">
                 <button 
                   onClick={() => setShowMapModal(false)}
                   className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg hover:bg-gray-50 transition-colors uppercase tracking-wider"
                 >
                   Done
                 </button>
              </div>
              
              <div className="flex-1 relative">
                <Map
                    {...viewState}
                    onMove={(evt: any) => setViewState(evt.viewState)}
                    onClick={handleMapClick}
                    style={{ width: '100%', height: '100%' }}
                    mapStyle="mapbox://styles/mapbox/streets-v11"
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
                    ref={mapRef}
                    cursor="crosshair"
                >
                    <NavigationControl position="bottom-right" />
                    <GeolocateControl position="top-left" />
                    <Marker longitude={coordinates[1]} latitude={coordinates[0]} color="red" />
                </Map>
                <div className="absolute top-4 left-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur p-3 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800">
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Selected Location</p>
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{address}</p>
                </div>
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
                    <button 
                        onClick={() => setShowMapModal(false)}
                        className="bg-primary text-white px-8 py-3 rounded-full font-black shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
                    >
                        <Check size={18} />
                        CONFIRM LOCATION
                    </button>
                </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
};

const CategoryCard = ({ label, icon: Icon, active = false, onClick }: { label: string, icon: LucideIcon, active?: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-4 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all h-24 group ${
        active 
        ? 'bg-primary/5 border-primary' 
        : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
    }`}
  >
    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
        active ? 'bg-primary text-white shadow-lg shadow-primary/30' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:bg-gray-200 dark:group-hover:bg-gray-700'
    }`}>
      <Icon size={16} />
    </div>
    <span className={`text-[10px] font-black uppercase tracking-wider ${
        active ? 'text-primary' : 'text-gray-500 dark:text-gray-400'
    }`}>{label}</span>
  </button>
);

export default ReportIssuePage;
