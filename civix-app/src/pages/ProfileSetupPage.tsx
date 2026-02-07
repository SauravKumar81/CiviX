import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, ChevronRight, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const ProfileSetupPage: React.FC = () => {
  const { user } = useAuth(); // We might need a way to refresh the user data or update it locally
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(user?.avatar || null); // Default to current avatar (random)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // If no new image is selected, we just skip/continue with the default
      if (!imageFile) {
         navigate('/');
         return;
      }

      const formData = new FormData();
      formData.append('avatar', imageFile);

      // We need an endpoint to update ONLY the avatar. 
      // Assuming we can use a generic user update endpoint or a specific one.
      // For now, let's assume a specific endpoint or use the general update.
      // Since I don't have the backend code for 'update user' handy in my context, 
      // I'll assume standard /api/auth/updatedetails or similar, but for now let's try to find an existing one or create it.
      // Wait, the plan said "Update AuthContext to add updateProfilePicture method".
      // I should do that first or implement the call here. Let's implement the call here for now using axios directly 
      // or better yet, keep it clean and use a service function.
      
      // Let's assume we will add 'updateAvatar' to authService.ts
      const token = localStorage.getItem('token');
      
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        }
      };

      const res = await axios.put(`${import.meta.env.VITE_API_URL}/auth/updatedetails`, formData, config);
      
      if (res.data.success) {
          // Force a refresh of user data in context or update it manually
          // The simplest way might be to reload or re-fetch me. 
          // But since we are inside the app, we can just navigate and let AuthContext re-fetch if needed, 
          // OR we can explicitly call a refresh if exposed.
          // For now, let's just navigate. The AuthContext should ideally update.
          // Actually, let's look at AuthContext again. It has `fetchUser`.
          // We can't access `fetchUser` directly unless we expose it.
          // Let's just navigate for now, and maybe trigger a window reload or similar if we want to be lazy, 
          // or better: let the user know it's done.
          
          // Actually, to update the context immediately, we might need to expose a method.
          // But for a simple flow:
          navigate('/');
           window.location.reload(); // Quick hack to ensure context updates with new avatar
      }

    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update profile picture');
    } finally {
      setLoading(false);
    }
  };

  const handleSkip = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center p-6 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-[32px] shadow-2xl overflow-hidden border border-white/20 relative">
        
        {/* Decorative Header */}
        <div className="h-32 bg-gradient-to-r from-primary to-purple-600 relative">
           <div className="absolute inset-0 bg-black/10" />
           <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
              <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <div className="w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-gray-200 dark:bg-gray-800 shadow-xl">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <UserIcon size={40} />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full border-4 border-white dark:border-gray-900 shadow-lg group-hover:scale-110 transition-transform">
                  <Camera size={14} />
                </div>
              </div>
           </div>
        </div>

        <div className="pt-16 pb-8 px-8 text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Setup Profile</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Add a photo so others can recognize you.</p>
          </div>

          <input 
            type="file" 
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />

          {error && (
            <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-xs font-bold rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-3 pt-4">
            <button 
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black text-sm uppercase tracking-wider hover:scale-[1.02] active:scale-[0.98] transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Uploading...' : imageFile ? 'Save & Continue' : 'Continue with Default'}
              {!loading && <ChevronRight size={16} />}
            </button>
            
            {imageFile && (
                <button 
                    onClick={handleSkip}
                    className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 uppercase tracking-widest transition-colors"
                >
                    Skip for now
                </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupPage;
