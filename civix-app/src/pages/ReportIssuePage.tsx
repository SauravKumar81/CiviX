import React from 'react';
import { Camera, MapPin, ChevronLeft, Send, Info, LucideIcon, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const ReportIssuePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans transition-colors duration-300">
      {/* Top Header */}
      <header className="sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex items-center gap-4 transition-colors">
        <Link to="/" className="p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl text-gray-500 dark:text-gray-400 transition-colors">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">New Civic Report</h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">Step 1 of 3: Details & Evidence</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-6 space-y-8">
        {/* Category Selection */}
        <section className="space-y-4">
          <div className="flex justify-between items-end">
            <h2 className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest">Select Category</h2>
            <span className="text-[10px] font-bold text-gray-400 dark:text-gray-500">Required</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <CategoryCard label="Infrastructure" icon={Info} active />
            <CategoryCard label="Public Safety" icon={Info} />
            <CategoryCard label="Environment" icon={Info} />
            <CategoryCard label="Mobility" icon={Info} />
          </div>
        </section>

        {/* Issue Details */}
        <section className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="space-y-4">
            <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors">Describe the issue</label>
            <textarea 
              placeholder="Provide a detailed description of the problem..." 
              className="w-full min-h-[160px] p-5 bg-gray-50 dark:bg-gray-800 border-2 border-transparent rounded-3xl focus:bg-white dark:focus:bg-gray-700 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-4">
            <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors">Visual Evidence</label>
            <div className="grid grid-cols-3 gap-4">
              <div className="aspect-square bg-gray-50 dark:bg-gray-800 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl flex flex-col items-center justify-center gap-2 group cursor-pointer hover:border-primary hover:bg-white dark:hover:bg-gray-700 transition-all">
                <Camera className="w-8 h-8 text-gray-400 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest group-hover:text-primary transition-colors">Add Photo</span>
              </div>
              <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-3xl relative overflow-hidden group">
                <img src="https://images.unsplash.com/photo-1515162816999-a0ca4981440d?auto=format&fit=crop&q=80&w=400" className="w-full h-full object-cover" alt="Preview" />
                <button className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        </section>

        {/* Location Section */}
        <section className="space-y-6 bg-white dark:bg-gray-900 p-8 rounded-[32px] border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
          <div className="flex justify-between items-center">
            <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors">Location</label>
            <button className="text-xs font-black text-primary flex items-center gap-1 hover:underline">
              <MapPin className="w-3 h-3" />
              USE CURRENT LOCATION
            </button>
          </div>
          
          <div className="relative h-64 bg-gray-100 dark:bg-gray-800 rounded-[28px] overflow-hidden border border-gray-100 dark:border-gray-700">
            {/* Fake Map Background */}
            <div className="absolute inset-0 grayscale contrast-125 opacity-40 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-122.3321,47.6062,12/800x600?access_token=pk.placeholder')] bg-cover" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center animate-ping" />
              <div className="absolute w-6 h-6 bg-primary rounded-full border-4 border-white dark:border-gray-900 shadow-lg" />
            </div>
            <div className="absolute bottom-4 left-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm p-4 rounded-2xl flex items-center gap-3 border border-white dark:border-gray-800 transition-colors">
              <MapPin className="w-5 h-5 text-primary" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-tighter truncate">Seattle, WA 98101</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 font-medium transition-colors">1201 3rd Ave, Seattle</p>
              </div>
            </div>
          </div>
        </section>

        {/* Action Button */}
        <button className="w-full h-16 bg-primary hover:bg-blue-700 text-white font-black rounded-[24px] shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.01] active:scale-[0.99] group mt-12 mb-20">
          PROCEED TO REVIEW
          <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </main>
    </div>
  );
};

const CategoryCard = ({ label, icon: Icon, active = false }: { label: string, icon: LucideIcon, active?: boolean }) => (
  <button className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-3 transition-all ${active ? 'bg-blue-50 dark:bg-blue-900/20 border-primary' : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800 hover:border-gray-200 dark:hover:border-gray-700'}`}>
    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${active ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}>
      <Icon size={20} />
    </div>
    <span className={`text-[10px] font-black uppercase tracking-wider ${active ? 'text-primary dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'}`}>{label}</span>
  </button>
);

export default ReportIssuePage;
