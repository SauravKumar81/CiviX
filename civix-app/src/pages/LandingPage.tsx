import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Activity, Shield, ChevronRight, Menu, X, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, useScroll, useTransform } from 'framer-motion';

const LandingPage: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();

  const headerBg = useTransform(
    scrollYProgress,
    [0, 0.05],
    ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/feed');
    }
  }, [isAuthenticated, navigate]);

  // Framer motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: custom * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    })
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans overflow-x-hidden selection:bg-violet-500/30">
      
      {/* Grid Background */}
      <div className="fixed inset-0 pointer-events-none z-0" 
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
          maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse at top center, black 40%, transparent 100%)'
        }}
      />

      {/* Hero Glows */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none z-0"></div>
      <div className="absolute top-[10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Header */}
      <motion.header 
        style={{ backgroundColor: headerBg }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-white/5 transition-colors duration-500"
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => navigate('/')}>
              <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center transition-transform group-hover:scale-105">
                <div className="w-4 h-3 bg-black rounded-[2px]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Civix</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <a href="#platform" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Platform</a>
              <a href="#mission" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Mission</a>
              <a href="#community" className="text-sm font-medium text-gray-400 hover:text-white transition-colors">Community</a>
            </nav>

            {/* Actions */}
            <div className="hidden md:flex items-center gap-6">
              <button 
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
              >
                Log in
              </button>
              <button 
                onClick={() => navigate('/signup')}
                className="px-5 py-2.5 bg-white hover:bg-gray-100 text-black text-sm font-bold rounded-full transition-all flex items-center gap-2 group"
              >
                Get Started
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex md:hidden items-center">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden border-t border-white/5 bg-black/95 backdrop-blur-2xl px-6 py-6 space-y-4 absolute w-full"
          >
            <a href="#platform" className="block text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>Platform</a>
            <a href="#mission" className="block text-lg font-medium text-white" onClick={() => setIsMobileMenuOpen(false)}>Mission</a>
            <div className="pt-6 flex flex-col gap-4 border-t border-white/10 mt-4">
              <button onClick={() => navigate('/login')} className="w-full py-3 text-center border border-white/20 rounded-xl font-medium text-white">Log in</button>
              <button onClick={() => navigate('/signup')} className="w-full py-3 text-center bg-white text-black rounded-xl font-bold">Get Started</button>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 lg:pt-56 lg:pb-32 z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative text-center flex flex-col items-center">
          
          <motion.div 
            custom={1} initial="hidden" animate="visible" variants={fadeUp}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-gray-300 text-xs font-medium tracking-wide mb-8 backdrop-blur-md"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400" />
            <span>The new standard for civic action</span>
          </motion.div>
          
          <motion.h1 
            custom={2} initial="hidden" animate="visible" variants={fadeUp}
            className="text-6xl md:text-8xl lg:text-[7.5rem] font-bold tracking-tighter text-white mb-8 leading-[0.95] max-w-5xl"
            style={{ textShadow: '0 10px 40px rgba(0,0,0,0.5)' }}
          >
            Report local issues. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 via-gray-300 to-gray-500">
              Transform your city.
            </span>
          </motion.h1>
          
          <motion.p 
            custom={3} initial="hidden" animate="visible" variants={fadeUp}
            className="max-w-2xl text-lg md:text-xl text-gray-400 mb-12 leading-relaxed font-light"
          >
            Civix is the operating system for proactive neighborhoods. View real-time infrastructure issues, crowdsource solutions, and demand accountability with a beautifully designed platform.
          </motion.p>

          <motion.div 
            custom={4} initial="hidden" animate="visible" variants={fadeUp}
            className="flex flex-col sm:flex-row items-center gap-5 w-full sm:w-auto"
          >
            <button 
              onClick={() => navigate('/signup')}
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-gray-100 text-black text-base font-semibold rounded-full transition-all flex items-center justify-center gap-2 group shadow-[0_0_30px_-5px_rgba(255,255,255,0.3)]"
            >
              Start Reporting
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button 
              onClick={() => navigate('/map')}
              className="w-full sm:w-auto px-8 py-4 bg-transparent border border-white/20 hover:bg-white/5 text-white text-base font-semibold rounded-full transition-all flex items-center justify-center gap-2 backdrop-blur-sm"
            >
              <MapPin className="w-4 h-4 text-violet-400" />
              Explore Map
            </button>
          </motion.div>
        </div>
      </section>

      {/* Abstract Dashboard Mockup */}
      <section className="relative pb-32 z-10 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative rounded-[2rem] border border-white/10 bg-black/40 backdrop-blur-2xl shadow-2xl overflow-hidden"
        >
          {/* Mockup Header */}
          <div className="h-12 border-b border-white/5 flex items-center px-4 gap-2 bg-gradient-to-b from-white/5 to-transparent">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          {/* Mockup Content */}
          <div className="aspect-[16/9] md:aspect-[21/9] bg-gradient-to-br from-gray-900 to-black relative flex">
             <div className="w-64 border-r border-white/5 hidden md:block p-6">
                <div className="h-4 w-24 bg-white/10 rounded mb-8"></div>
                <div className="space-y-4">
                  <div className="h-4 w-full bg-white/5 rounded"></div>
                  <div className="h-4 w-3/4 bg-white/5 rounded"></div>
                  <div className="h-4 w-5/6 bg-white/5 rounded"></div>
                </div>
             </div>
             <div className="flex-1 p-6 sm:p-10 relative overflow-hidden">
                {/* Map abstract */}
                <div className="absolute inset-0 opacity-20" style={{
                  backgroundImage: `radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)`,
                  backgroundSize: '100% 100%'
                }}></div>
                <div className="flex justify-between items-end mb-10">
                  <div>
                    <div className="text-3xl font-bold text-white mb-2">Live Map</div>
                    <div className="text-gray-400">140 active reports in your area</div>
                  </div>
                  <div className="h-10 w-32 bg-violet-600/20 border border-violet-500/30 rounded-full"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="h-32 bg-white/5 border border-white/5 rounded-2xl p-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                         <div className="h-3 w-1/2 bg-white/20 rounded"></div>
                         <div className="h-2 w-3/4 bg-white/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                  <div className="h-32 bg-white/5 border border-white/5 rounded-2xl p-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white/10 rounded-xl"></div>
                      <div className="flex-1 space-y-2">
                         <div className="h-3 w-2/3 bg-white/20 rounded"></div>
                         <div className="h-2 w-1/2 bg-white/10 rounded"></div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section id="platform" className="py-32 relative z-10 border-t border-white/5 bg-black">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-20 md:w-2/3">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-white mb-6">Designed for impact.</h2>
            <p className="text-xl text-gray-400 font-light">
              Everything you need to modernize civic engagement, built with uncompromised attention to detail.
            </p>
          </div>

          <motion.div 
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-3 gap-6"
          >
            <FeatureCard 
              icon={<MapPin />}
              title="Real-time Mapping"
              description="Visualize infrastructure issues instantly with interactive, high-performance web maps."
              gradient="from-blue-500/20 to-transparent"
            />
            <FeatureCard 
              icon={<Users />}
              title="Community Consensus"
              description="Upvote critical problems. When issues gain traction, they demand immediate attention from officials."
              gradient="from-violet-500/20 to-transparent"
            />
            <FeatureCard 
              icon={<Activity />}
              title="Impact Tracking"
              description="Follow the lifecycle of a report. Receive notifications when city workers update status to 'Resolved'."
              gradient="from-fuchsia-500/20 to-transparent"
            />
          </motion.div>
        </div>
      </section>

      {/* Social Proof / Stats Area */}
      <section className="py-32 border-t border-white/5 relative overflow-hidden bg-black z-10">
        
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[300px] bg-violet-600/10 rounded-[100%] blur-[100px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8 text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
              className="flex flex-col items-center"
            >
              <div className="text-6xl md:text-7xl font-bold tracking-tighter text-white mb-4">50k<span className="text-violet-500">+</span></div>
              <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">Active Citizens</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col items-center"
            >
              <div className="text-6xl md:text-7xl font-bold tracking-tighter text-white mb-4">10k<span className="text-violet-500">+</span></div>
              <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">Issues Resolved</div>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col items-center"
            >
              <div className="text-6xl md:text-7xl font-bold tracking-tighter text-white mb-4">120</div>
              <div className="text-gray-400 font-medium tracking-wide uppercase text-sm">Cities Covered</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10 border-t border-white/5 bg-gradient-to-b from-black to-zinc-950">
        <div className="max-w-4xl mx-auto text-center px-6">
          <Shield className="w-12 h-12 text-violet-400 mx-auto mb-8 opacity-80" />
          <h2 className="text-5xl md:text-6xl font-bold tracking-tighter text-white mb-6">Ready to upgrade your city?</h2>
          <p className="text-xl text-gray-400 font-light mb-10 max-w-2xl mx-auto">
            Join thousands of engaged citizens. It takes 30 seconds to set up, and it's completely free forever.
          </p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-10 py-5 bg-white hover:bg-gray-200 text-black text-lg font-semibold rounded-full transition-transform hover:scale-105 shadow-[0_0_40px_-10px_rgba(255,255,255,0.2)]"
          >
            Create your free account
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-black pt-20 pb-10 z-10 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center border border-white/10">
                <div className="w-3 h-2 bg-white rounded-[1px]" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Civix</span>
            </div>
            <div className="flex gap-8">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">GitHub</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm font-medium">Discord</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 border-t border-white/10 pt-8">
            <div className="text-sm text-gray-500 font-medium">
              © 2026 Civix Inc. All rights reserved.
            </div>
            <div className="flex gap-6 text-sm text-gray-500 font-medium">
              <a href="#" className="hover:text-gray-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-gray-300 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, gradient }: { icon: React.ReactNode, title: string, description: string, gradient: string }) => (
  <motion.div 
    variants={{
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    }}
    className="group relative p-8 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors overflow-hidden"
  >
    <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}></div>
    <div className="relative z-10">
      <div className="w-12 h-12 rounded-xl bg-white/10 border border-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform duration-500">
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-6 h-6' })}
      </div>
      <h3 className="text-xl font-semibold text-white mb-3 tracking-tight">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-light">{description}</p>
    </div>
  </motion.div>
);

export default LandingPage;
