import React from 'react';
import { LogOut, ArrowLeft, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const LogoutConfirmationPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6 font-sans transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 rounded-[40px] border border-gray-100 dark:border-gray-800 p-10 shadow-2xl shadow-gray-200/50 dark:shadow-none text-center space-y-8 transition-colors">
        <div className="mx-auto w-24 h-24 bg-red-50 dark:bg-red-900/20 rounded-3xl flex items-center justify-center relative">
          <ShieldAlert className="w-12 h-12 text-red-500 animate-pulse" />
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-white dark:bg-gray-900 border-4 border-red-50 dark:border-red-900/20 rounded-full flex items-center justify-center">
             <div className="w-2 h-2 bg-red-500 rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Confirm Logout</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
            Are you sure you want to end your session? You'll need to sign back in to contribute to your community.
          </p>
        </div>

        <div className="space-y-4 pt-4">
          <Link to="/login" className="block">
            <button className="w-full h-16 bg-red-500 hover:bg-red-600 text-white font-black rounded-2xl shadow-xl shadow-red-500/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98]">
              YES, LOG ME OUT
              <LogOut className="w-5 h-5" />
            </button>
          </Link>
          
          <Link to="/" className="block">
            <button className="w-full h-16 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-black rounded-2xl border border-transparent hover:border-gray-200 dark:hover:border-gray-700 flex items-center justify-center gap-3 transition-all active:scale-[0.98]">
              <ArrowLeft className="w-5 h-5" />
              BACK TO FEED
            </button>
          </Link>
        </div>

        <div className="pt-4">
           <p className="text-[10px] text-gray-400 dark:text-gray-500 font-black uppercase tracking-widest">
             © 2026 Civix Civic Engagement Platform
           </p>
        </div>
      </div>
    </div>
  );
};

export default LogoutConfirmationPage;
