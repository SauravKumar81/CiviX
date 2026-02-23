import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, ArrowLeft, Lock, Trash2, Mail, Shield, AlertTriangle } from 'lucide-react';
import { updatePassword, deleteAccount } from '../services/authService';

const AccountPage = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await updatePassword({ currentPassword, newPassword });
      setSuccess('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you absolutely sure? This action cannot be undone.')) {
        return;
    }
    
    // Double confirmation
    const verify = window.prompt('Type "DELETE" to confirm account deletion.');
    if (verify !== 'DELETE') return;

    try {
        await deleteAccount();
        logout();
        navigate('/login');
    } catch (err: any) {
        setError('Failed to delete account.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      <div className="bg-white dark:bg-gray-900 sticky top-0 z-30 shadow-sm border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-2xl mx-auto px-4 h-16 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full">
                 <ArrowLeft className="w-6 h-6 text-gray-700 dark:text-gray-300" />
              </button>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Account Settings</h1>
           </div>
           
           <button 
             onClick={toggleTheme}
             className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
           >
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
           </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
        
        {/* Profile Info */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <Shield className="w-5 h-5 text-primary" /> Profile Info
           </h2>
           <div className="space-y-4">
              <div>
                 <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Full Name</label>
                 <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-medium">
                    {user?.name || 'N/A'}
                 </div>
              </div>
              <div>
                 <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Email Address</label>
                 <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-xl text-gray-700 dark:text-gray-300 font-medium flex items-center gap-2">
                    <Mail size={16} /> {user?.email || 'N/A'}
                 </div>
              </div>
              <div className="pt-2">
                 <p className="text-xs text-gray-400">To change these details, visit your Profile page.</p>
              </div>
           </div>
        </section>

        {/* Password Update */}
        <section className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800">
           <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
             <Lock className="w-5 h-5 text-orange-500" /> Change Password
           </h2>
           
           <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                 <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Current Password</label>
                 <input 
                   type="password"
                   value={currentPassword}
                   onChange={(e) => setCurrentPassword(e.target.value)}
                   className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                   placeholder="Enter current password"
                   required
                 />
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">New Password</label>
                     <input 
                       type="password"
                       value={newPassword}
                       onChange={(e) => setNewPassword(e.target.value)}
                       className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                       placeholder="New password"
                       required
                       minLength={6}
                     />
                  </div>
                  <div>
                     <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Confirm Password</label>
                     <input 
                       type="password"
                       value={confirmPassword}
                       onChange={(e) => setConfirmPassword(e.target.value)}
                       className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none text-gray-900 dark:text-white"
                       placeholder="Confirm password"
                       required
                       minLength={6}
                     />
                  </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 text-sm font-bold rounded-xl">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 dark:bg-green-900/10 text-green-600 dark:text-green-400 text-sm font-bold rounded-xl">
                  {success}
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-xl hover:opacity-90 transition-opacity"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
           </form>
        </section>

        {/* Danger Zone */}
        <section className="bg-red-50 dark:bg-red-900/10 rounded-2xl p-6 border border-red-100 dark:border-red-900/20">
           <h2 className="text-lg font-bold text-red-600 dark:text-red-400 mb-2 flex items-center gap-2">
             <AlertTriangle className="w-5 h-5" /> Danger Zone
           </h2>
           <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
             Deleting your account will permanently remove all your data, posts, and history. This action cannot be undone.
           </p>
           
           <button 
             onClick={handleDeleteAccount}
             className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold rounded-xl border border-red-200 dark:border-red-800/50 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
           >
             <Trash2 size={18} /> Delete Account
           </button>
        </section>
        
        <div className="text-center pt-8">
            <button
               onClick={logout} 
               className="text-gray-500 font-bold hover:text-gray-700 dark:hover:text-gray-300"
            >
                Log Out
            </button>
            <p className="text-xs text-gray-300 mt-2">Civix App v1.0.0</p>
        </div>

      </div>
    </div>
  );
};

export default AccountPage;
