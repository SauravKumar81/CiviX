import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Shield, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { register } from '../services/authService';
import { useAuth } from '../context/AuthContext';

const SignupPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login: authLogin } = useAuth();

  useEffect(() => {
    // Check for pre-filled data from Google redirect
    const state = location.state as { email?: string; name?: string } | null;
    if (state?.email) setEmail(state.email);
    if (state?.name) setName(state.name);
  }, [location.state]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      return setError('Please fill in all fields');
    }
    if (password !== confirmPassword) {
      return setError('Passwords do not match');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    setError('');

    try {
      const response = await register({ name, email, password });
      if (response.token) {
        authLogin(response.token);
        navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex font-sans transition-colors duration-300">
      <div className="hidden lg:flex w-1/2 bg-primary relative overflow-hidden items-center justify-center p-24">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.1)_0%,transparent_60%)]" />
        <div className="relative z-10 text-white space-y-8 max-w-lg">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-3xl rounded-3xl flex items-center justify-center shadow-2xl border border-white/30">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <div>
            <h1 className="text-6xl font-black tracking-tighter mb-4 leading-tight">Join the<br />Movement.</h1>
            <p className="text-xl text-blue-100/80 font-medium leading-relaxed">
              Every voice counts. Join Civix to help build a more responsive and transparent community.
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center px-8 sm:px-12 lg:px-24 py-12 relative overflow-y-auto">
        <div className="max-w-md w-full mx-auto space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">Start impacting your community today</p>
          </div>

          <form onSubmit={handleSignup} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full h-14 bg-gray-100 dark:bg-gray-900 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white dark:focus:bg-gray-800 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full h-14 bg-gray-100 dark:bg-gray-900 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white dark:focus:bg-gray-800 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full h-14 bg-gray-100 dark:bg-gray-900 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white dark:focus:bg-gray-800 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full h-14 bg-gray-100 dark:bg-gray-900 border-2 border-transparent rounded-2xl pl-12 pr-4 text-sm font-bold focus:bg-white dark:focus:bg-gray-800 focus:border-primary outline-none transition-all text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-2xl animate-in fade-in slide-in-from-top-2">
                <p className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider text-center">{error}</p>
              </div>
            )}

            <button 
              type="submit" 
              disabled={loading}
              className="w-full h-14 bg-primary text-white font-black rounded-2xl hover:bg-blue-600 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : (
                <>
                  SIGN UP <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="text-center space-y-4 pt-6">
            <p className="text-sm font-bold text-gray-500">
              Already have an account? {' '}
              <Link to="/login" className="text-primary hover:underline">Log In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
