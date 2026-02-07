import React, { useState, useRef, useEffect } from 'react';
import { Camera, MapPin, ChevronLeft, Info, X, Check, type LucideIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { getReport, updateReport } from '../services/reportService';
import axios from 'axios';
import Map, { Marker, NavigationControl } from 'react-map-gl/mapbox';



// mapboxgl.workerClass = require('worker-loader!mapbox-gl/dist/mapbox-gl-csp-worker').default;

const EditReportPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [status, setStatus] = useState<'pending' | 'in-progress' | 'resolved'>('pending');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
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
  const [showLocationCheck, setShowLocationCheck] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReportData = async () => {
      if (!id) return;
      try {
        const response = await getReport(id);
        const report = response.data;
        setTitle(report.title);
        setDescription(report.description);
        setCategory(report.category);
        setStatus(report.status);
        if (report.imageUrl && report.imageUrl !== 'no-photo.jpg') {
          setImagePreview(report.imageUrl);
        }
        if (report.location?.coordinates) {
          // GeoJSON is [lng, lat]
          const lng = report.location.coordinates[0];
          const lat = report.location.coordinates[1];
          setCoordinates([lat, lng]);
          setViewState(prev => ({ ...prev, longitude: lng, latitude: lat }));
          setAddress(report.location.formattedAddress || 'Selected Location');
        }
      } catch (err) {
        setError('Failed to load report data');
        console.error(err);
      } finally {
        setFetching(false);
      }
    };
    fetchReportData();
  }, [id]);

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
        
        mapRef.current?.flyTo({ center: [lng, lat], zoom: 15 });
        setViewState(prev => ({ ...prev, longitude: lng, latitude: lat, zoom: 15 }));
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
    if (!id) return;
    
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('category', category);
      formData.append('status', status);
      
      const locationData = {
        type: 'Point',
        coordinates: [coordinates[1], coordinates[0]], // [long, lat] for GeoJSON
        formattedAddress: address
      };
      formData.append('location', JSON.stringify(locationData));

      if (imageFile) {
        formData.append('image', imageFile);
      }

      await updateReport(id, formData); // Type cast since service might expect Partial<Report>
      navigate('/');
    } catch (err) {
      const errorMessage = axios.isAxiosError(err) 
        ? err.response?.data?.message || err.response?.data?.error || err.message 
        : (err as Error).message;
      setError(errorMessage || 'Failed to update report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 font-black uppercase tracking-widest text-[10px]">Loading Report Details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4 transition-colors">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Edit Civic Report</h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Update issue status & details</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8 pb-32">
        {error && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm font-bold rounded-2xl border border-red-100 dark:border-red-800">
            {error}
          </div>
        )}

        {/* Status Selection */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest">Update Status</h2>
          <div className="flex gap-3">
             <button onClick={() => setStatus('pending')} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all border-2 ${status === 'pending' ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-500 text-orange-600' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'}`}>Pending</button>
             <button onClick={() => setStatus('in-progress')} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all border-2 ${status === 'in-progress' ? 'bg-blue-50 dark:bg-blue-900/20 border-primary text-primary' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'}`}>In Progress</button>
             <button onClick={() => setStatus('resolved')} className={`flex-1 py-3 rounded-2xl font-black text-[10px] uppercase tracking-wider transition-all border-2 ${status === 'resolved' ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 text-emerald-600' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 text-gray-400'}`}>Resolved</button>
          </div>
        </section>

        {/* Category Selection */}
        <section className="space-y-4">
          <h2 className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest">Change Category</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CategoryCard label="Infrastructure" icon={Info} active={category === 'Infrastructure'} onClick={() => setCategory('Infrastructure')} />
            <CategoryCard label="Public Safety" icon={Info} active={category === 'Public Safety'} onClick={() => setCategory('Public Safety')} />
            <CategoryCard label="Environment" icon={Info} active={category === 'Environment'} onClick={() => setCategory('Environment')} />
            <CategoryCard label="Mobility" icon={Info} active={category === 'Mobility'} onClick={() => setCategory('Mobility')} />
          </div>
        </section>

        <section className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="space-y-4">
            <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors">Report Title</label>
            <input 
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent rounded-3xl focus:bg-white dark:focus:bg-gray-800 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full min-h-[160px] p-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent rounded-3xl focus:bg-white dark:focus:bg-gray-800 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors">Visual Evidence</label>
            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              <input type="file" ref={fileInputRef} onChange={handleImageChange} accept="image/*" className="hidden" />
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="aspect-square bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-primary hover:bg-white dark:hover:bg-gray-700 transition-all overflow-hidden"
              >
                <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest">Update Photo</span>
              </div>
              
              {imagePreview && (
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl relative overflow-hidden group">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                  <button onClick={handleRemoveImage} className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full hover:bg-red-500 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="flex justify-between items-center">
            <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors">Location</label>
            <button onClick={handleDetectLocation} className="text-xs font-black text-primary flex items-center gap-1 hover:underline active:scale-95">
              <MapPin className={`w-3 h-3 ${showLocationCheck ? 'animate-bounce' : ''}`} />
              {showLocationCheck ? 'DETECTING...' : 'USE CURRENT LOCATION'}
            </button>
          </div>
          
          <div className="relative h-80 bg-gray-100 dark:bg-gray-800 rounded-[28px] overflow-hidden border border-gray-100 dark:border-gray-700 shadow-inner">
            <Map
              {...viewState}
              onMove={(evt: any) => setViewState(evt.viewState)}
              onClick={handleMapClick}
              style={{ width: '100%', height: '100%' }}
              mapStyle="mapbox://styles/mapbox/streets-v11"
              mapboxAccessToken={import.meta.env.VITE_MAPBOX_TOKEN}
              ref={mapRef}
            >
              <NavigationControl position="bottom-right" />
              <Marker longitude={coordinates[1]} latitude={coordinates[0]} color="red" />
            </Map>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md p-4 rounded-2xl flex items-center gap-3 border border-white dark:border-gray-800 shadow-xl z-[400]">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 dark:text-white uppercase truncate">{address}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest">Selected Spot</p>
              </div>
            </div>
          </div>
        </section>

        <button 
          onClick={handleSubmit}
          disabled={loading}
          className="w-full h-20 bg-primary hover:bg-blue-700 text-white font-black rounded-[28px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] group mt-12 disabled:opacity-50"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>SAVING CHANGES...</span>
            </div>
          ) : (
            <>
              <span>SAVE CHANGES</span>
              <Check className="w-5 h-5 group-hover:scale-125 transition-transform" />
            </>
          )}
        </button>
      </main>
    </div>
  );
};

const CategoryCard = ({ label, icon: Icon, active = false, onClick }: { label: string, icon: LucideIcon, active?: boolean, onClick: () => void }) => (
  <button onClick={onClick} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${active ? 'bg-blue-50 dark:bg-blue-900/20 border-primary' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800'}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
      <Icon size={20} />
    </div>
    <span className={`text-[10px] font-black uppercase tracking-wider ${active ? 'text-primary' : 'text-gray-500'}`}>{label}</span>
  </button>
);

export default EditReportPage;
