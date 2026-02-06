import React from 'react';
import { Mail, Lock, Chrome, Apple, ArrowRight, Shield, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

const LoginPage: React.FC = () => {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 font-sans bg-white dark:bg-gray-950 transition-colors duration-300">
      {/* Visual Side - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-primary relative overflow-hidden group">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg">
              <div className="w-6 h-5 bg-primary rounded-sm" />
            </div>
            <span className="text-2xl font-black text-white tracking-tight uppercase">Civix</span>
          </div>

          <div className="space-y-6 max-w-lg">
            <h1 className="text-6xl font-black text-white leading-[0.9] tracking-tighter">
              COLLECTIVE <br />
              <span className="text-blue-200">POWER</span> FOR <br />
              YOUR CITY.
            </h1>
            <p className="text-xl text-blue-100/80 font-medium leading-relaxed">
              Join thousands of citizens reporting issues and building better neighborhoods together.
            </p>
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 gap-8">
          <Stat icon={<Shield />} value="12k+" label="Issues Resolved" />
          <Stat icon={<Users />} value="85k" label="Active Citizens" />
        </div>
      </div>

      {/* Form Side */}
      <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-24 bg-white dark:bg-gray-950">
        <div className="max-w-md w-full mx-auto space-y-10">
          <div className="space-y-2">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400 font-medium text-lg">Enter your details to access your dashboard</p>
          </div>

          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors group-focus-within:text-primary">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-primary" />
                  <input 
                    type="email" 
                    placeholder="name@company.com" 
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-black text-gray-900 dark:text-gray-200 uppercase tracking-widest block transition-colors group-focus-within:text-primary">Password</label>
                  <a href="#" className="text-sm font-bold text-primary hover:text-blue-700 transition-colors">Forgot Password?</a>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-primary" />
                  <input 
                    type="password" 
                    placeholder="••••••••" 
                    className="w-full h-14 pl-12 pr-4 bg-gray-50 dark:bg-gray-900 border-2 border-transparent rounded-2xl focus:bg-white dark:focus:bg-gray-800 focus:border-primary outline-none transition-all text-gray-900 dark:text-white font-medium placeholder:text-gray-400"
                  />
                </div>
              </div>
            </div>

            <Link to="/">
              <button className="w-full h-14 bg-primary hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] mt-8">
                Sign In
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-100 dark:border-gray-800" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white dark:bg-gray-950 text-gray-400 font-bold tracking-widest uppercase text-[10px]">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <SocialButton icon={<Chrome className="w-5 h-5" />} label="Google" />
              <SocialButton icon={<Apple className="w-5 h-5" />} label="Apple ID" />
            </div>
          </div>

          <p className="text-center font-bold text-gray-500 dark:text-gray-400">
            Don't have an account? <a href="#" className="text-primary hover:text-blue-700 transition-colors">Create Account</a>
          </p>
        </div>
      </div>
    </div>
  );
};

const Stat = ({ icon, value, label }: { icon: React.ReactNode, value: string, label: string }) => (
  <div className="space-y-1">
    <div className="flex items-center gap-2 text-white/60 mb-2">
      {React.cloneElement(icon as React.ReactElement, { size: 18 })}
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </div>
    <div className="text-3xl font-black text-white tracking-tight">{value}</div>
  </div>
);

const SocialButton = ({ icon, label }: { icon: React.ReactNode, label: string }) => (
  <button className="h-14 flex items-center justify-center gap-3 border-2 border-gray-100 dark:border-gray-800 rounded-2xl font-black text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-all active:scale-[0.95]">
    {icon}
    <span>{label}</span>
  </button>
);

export default LoginPage;
