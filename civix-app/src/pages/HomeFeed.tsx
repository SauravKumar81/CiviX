import React, { useState, useEffect } from 'react';
import { 
  Home, Compass, FileText, Bell, User, Search, TrendingUp, Map as MapIcon, 
  Plus, MoreHorizontal, Heart, MessageSquare, Share2, Bookmark,
  Menu, X, ChevronLeft, ChevronRight, Moon, Sun, MapPin
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { getReports, updateReport, createReport } from '../services/reportService';
import type { Report } from '../services/reportService';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const HomeFeed: React.FC = () => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [postContent, setPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeFilter, setActiveFilter] = useState<'local' | 'global' | 'mine'>('global');
  const [userLocation, setUserLocation] = useState<{ city?: string; state?: string } | null>(null);

  const fetchReports = async (filterOverride?: 'local' | 'global' | 'mine') => {
    setLoading(true);
    try {
      const filter = filterOverride || activeFilter;
      let filters: any = {};
      
      if (filter === 'local' && userLocation) {
        filters = { city: userLocation.city, state: userLocation.state };
      } else if (filter === 'mine' && user?.id) {
        filters = { user: user.id };
      }
      
      const data = await getReports(filters);
      setReports(data.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) return;
    
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
        const data = await response.json();
        const address = data.address;
        const location = {
          city: address.city || address.town || address.village,
          state: address.state
        };
        setUserLocation(location);
        // We don't automatically trigger fetch here to avoid double loading on mount,
        // but if the user switches to 'local' later, it will work.
      } catch (err) {
        console.error('Reverse geocoding failed:', err);
      }
    });
  };

  useEffect(() => {
    detectLocation();
    fetchReports();
  }, []);

  const handleFilterChange = (filter: 'local' | 'global' | 'mine') => {
    setActiveFilter(filter);
    fetchReports(filter);
  };

  const handleQuickPost = async () => {
    if (!isAuthenticated) return navigate('/login');
    if (!postContent.trim()) return;
    setIsPosting(true);
    try {
      await createReport({
        title: `Quick Alert - ${postContent.slice(0, 20)}...`,
        description: postContent,
        category: 'Other',
        status: 'pending',
        location: {
          type: 'Point',
          coordinates: [-122.3321, 47.6062], // Default Seattle
          formattedAddress: 'Seattle'
        }
      });
      setPostContent('');
      fetchReports();
    } catch (error) {
      console.error('Quick post failed:', error);
    } finally {
      setIsPosting(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-950 font-sans relative overflow-x-hidden transition-colors duration-300">
      {/* Mobile Top Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between px-4 z-50 transition-colors">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <div className="w-5 h-4 bg-white rounded-sm" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">Civix</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </header>

      {/* Sidebar - Desktop & Mobile Drawer */}
      <aside className={`
        fixed h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-40 transition-all duration-300 ease-in-out
        ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${isSidebarCollapsed ? 'lg:w-20' : 'lg:w-64'}
        w-64 flex flex-col
      `}>
        {/* Desktop Toggle Button (Floating on edge) */}
        <button 
          onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          className="hidden lg:flex absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-full items-center justify-center shadow-md text-gray-400 hover:text-primary hover:scale-110 transition-all z-50"
          title={isSidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* Logo Section */}
        <div className={`p-6 flex items-center gap-2 mb-8 ${isSidebarCollapsed ? 'lg:justify-center' : ''}`}>
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
            <div className="w-5 h-4 bg-white rounded-sm" />
          </div>
          <div className={`${isSidebarCollapsed ? 'lg:hidden' : 'block'}`}>
            <h1 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white leading-none">Civix</h1>
            <p className="text-[10px] text-gray-400 font-medium lowercase">Citizen Power</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-1">
          <NavItem 
            icon={<Home className="w-5 h-5" />} 
            label="Home" 
            active={activeFilter === 'global' && location.pathname === '/'} 
            collapsed={isSidebarCollapsed} 
            onClick={() => handleFilterChange('global')}
          />
          <NavItem 
            icon={<Compass className="w-5 h-5" />} 
            label="Explore" 
            active={false} 
            collapsed={isSidebarCollapsed} 
            onClick={() => navigate('/map')}
          />
          
          {/* Reports Group */}
          <div className={`mt-6 mb-2 px-2 text-xs font-black text-gray-400 dark:text-gray-500 uppercase tracking-widest ${isSidebarCollapsed ? 'hidden' : 'block'}`}>
            Reports
          </div>
          
          <NavItem 
            icon={<MapPin className="w-5 h-5" />} 
            label="State and City" 
            active={activeFilter === 'local'} 
            collapsed={isSidebarCollapsed} 
            onClick={() => handleFilterChange('local')}
          />
          <NavItem 
            icon={<Compass className="w-5 h-5" />} 
            label="All Country Reports" 
            active={activeFilter === 'global' && location.pathname !== '/'} 
            collapsed={isSidebarCollapsed} 
            onClick={() => handleFilterChange('global')}
          />
          <NavItem 
            icon={<FileText className="w-5 h-5" />} 
            label="My Reports" 
            active={activeFilter === 'mine'} 
            collapsed={isSidebarCollapsed} 
            onClick={() => {
              if (!isAuthenticated) return navigate('/login');
              handleFilterChange('mine');
            }} 
          />

          <div className="my-4 border-t border-gray-100 dark:border-gray-800" />

          <NavItem 
            icon={<Bell className="w-5 h-5" />} 
            label="Notifications" 
            active={location.pathname === '/notifications'}
            collapsed={isSidebarCollapsed} 
            onClick={() => navigate('/')} 
          />
          <NavItem 
            icon={<User className="w-5 h-5" />} 
            label="Profile" 
            active={location.pathname === '/profile'}
            collapsed={isSidebarCollapsed} 
            onClick={() => navigate('/')} 
          />
        </nav>

        {/* Bottom Section */}
        <div className="px-4 pb-8 mt-auto space-y-4">
          {/* Theme Toggle Button (Desktop Sidebar) */}
          <button 
            onClick={toggleTheme}
            className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white ${isSidebarCollapsed ? 'lg:justify-center lg:px-0' : ''}`}
          >
            <div className="flex-shrink-0">
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <span className={isSidebarCollapsed ? 'lg:hidden' : 'block'}>{theme === 'light' ? 'Dark Mode' : 'Light Mode'}</span>
          </button>

          <button 
            onClick={() => navigate('/report')}
            className={`w-full py-3 bg-primary text-white font-bold rounded-eight shadow-lg shadow-primary/20 flex items-center justify-center gap-2 ${isSidebarCollapsed ? 'px-0' : ''}`}
          >
            <Plus className="w-5 h-5 flex-shrink-0" />
            <span className={isSidebarCollapsed ? 'lg:hidden' : 'block'}>Report Issue</span>
          </button>
          
          <div 
            onClick={() => navigate('/logout')}
            className={`flex items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700 gap-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${isSidebarCollapsed ? 'lg:justify-center' : ''}`}
          >
            <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100" className="w-10 h-10 rounded-full object-cover flex-shrink-0" alt="User" />
            {!isSidebarCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">Alex Chen</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@chen_alex</p>
              </div>
            )}
            {!isSidebarCollapsed && <MoreHorizontal className="w-4 h-4 text-gray-400" />}
          </div>
        </div>
      </aside>

      {/* Overlay for Mobile Drawer */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Main Content Area */}
      <main className={`
        flex-1 flex justify-center bg-white dark:bg-gray-950 transition-all duration-300
        ${isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-64'}
        mt-16 lg:mt-0
      `}>
        <div className="flex w-full max-w-6xl">
          {/* Feed Section */}
          <div className="flex-1 border-r border-gray-100 dark:border-gray-800 min-h-screen">
            <header className="sticky top-16 lg:top-0 z-20 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 px-6 py-4 flex justify-between items-center">
              <h2 className="text-xl font-extrabold text-gray-900 dark:text-white">Civic Feed</h2>
            </header>

            <div className="p-6 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
              {isAuthenticated ? (
                <div className="flex gap-4">
                  <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" className="w-12 h-12 rounded-full object-cover" alt="User" />
                  <div className="flex-1">
                    <textarea 
                      placeholder="What's happening in your neighborhood?" 
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                      className="w-full p-2 text-lg text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none resize-none bg-transparent"
                      rows={2}
                    />
                    <div className="flex justify-between items-center mt-4">
                      <div className="flex gap-4 text-primary">
                        <button 
                          onClick={() => navigate('/report')}
                          className="p-2 hover:bg-primary/10 rounded-lg transition-colors flex items-center gap-2"
                        >
                          <Plus className="w-5 h-5" />
                          <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Advanced Report</span>
                        </button>
                        <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors"><MapIcon className="w-5 h-5" /></button>
                      </div>
                      <button 
                        onClick={handleQuickPost}
                        disabled={isPosting || !postContent.trim()}
                        className="px-6 py-2.5 bg-primary text-white font-bold rounded-full text-sm disabled:opacity-50"
                      >
                        {isPosting ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-4 space-y-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">Sign in to report issues</p>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">Join your community to post updates</p>
                  </div>
                  <button 
                    onClick={() => navigate('/login')}
                    className="px-8 py-2 bg-primary text-white text-xs font-black rounded-full hover:bg-blue-600 transition-all uppercase tracking-widest"
                  >
                    Sign In Now
                  </button>
                </div>
              )}
            </div>

            <div className="flex border-b border-gray-100 dark:border-gray-800 overflow-x-auto scrollbar-hide bg-white dark:bg-gray-950">
              <Tab label="Local Reports" active />
              <Tab label="Following" />
              <Tab label="Priority Hub" />
            </div>

            <div className="bg-gray-50/30 dark:bg-gray-900/10">
              {authLoading || loading ? (
                <div className="flex flex-col items-center justify-center p-20 space-y-4">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Loading city reports...</p>
                </div>
              ) : reports.length > 0 ? (
                reports.map((report) => (
                  <FeedItem 
                    key={report._id}
                    id={report._id || ''}
                    user={{ 
                      name: report.user?.name || "Anonymous", 
                      handle: `@${report.user?.name?.toLowerCase().replace(/\s/g, '') || "citizen"}`, 
                      time: "Just now", 
                      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" 
                    }}
                    category={report.category.toUpperCase()}
                    content={report.description}
                    image={report.imageUrl !== 'no-photo.jpg' ? report.imageUrl : undefined}
                    engagement={{ likes: report.upvotes?.toString() || "0", comments: "0", shares: "0" }}
                    status={report.status.toUpperCase()}
                    location={report.location?.formattedAddress}
                    onEdit={(id) => navigate(`/edit-report/${id}`)}
                    onVote={async (id) => {
                      if (!isAuthenticated) return navigate('/login');
                      try {
                        const reportToVote = reports.find(r => r._id === id);
                        if (reportToVote) {
                          const updatedReport = await updateReport(id, { upvotes: (reportToVote.upvotes || 0) + 1 });
                          setReports(reports.map(r => r._id === id ? updatedReport.data : r));
                        }
                      } catch (err) {
                        console.error('Failed to vote:', err);
                      }
                    }}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center p-20 text-center space-y-4">
                   <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <FileText className="w-10 h-10 text-gray-400" />
                   </div>
                   <div className="space-y-1">
                      <p className="text-gray-900 dark:text-white font-black text-lg">No reports found</p>
                      <p className="text-gray-500 dark:text-gray-400 text-sm">Be the first to report an issue in your area.</p>
                   </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar Widgets */}
          <aside className="hidden xl:block w-80 p-6 space-y-6 flex-shrink-0">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input 
                type="text" 
                placeholder="Search issues..." 
                className="w-full bg-gray-100 dark:bg-gray-900 border-none rounded-full py-2.5 pl-11 pr-4 text-sm focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-800 outline-none transition-all placeholder:text-gray-500"
              />
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6">
              <h3 className="text-base font-bold text-gray-900 dark:text-white mb-6 flex items-center justify-between">
                Local Impact Stats
                <TrendingUp className="w-4 h-4 text-green-500" />
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50/50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-50 dark:border-blue-900/30">
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase mb-1">Reports Solved</p>
                  <p className="text-2xl font-black text-blue-700 dark:text-blue-300">124</p>
                  <p className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1">+12% this month</p>
                </div>
                <div className="bg-teal-50/50 dark:bg-teal-900/20 p-4 rounded-xl border border-teal-50 dark:border-teal-900/30">
                  <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase mb-1">Active Users</p>
                  <p className="text-2xl font-black text-teal-700 dark:text-teal-300">8.2k</p>
                  <p className="text-[10px] text-green-600 dark:text-green-400 font-bold mt-1">+5.4% growth</p>
                </div>
              </div>
              <div className="mt-6 flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs text-gray-600 dark:text-gray-400 font-medium border border-gray-100 dark:border-gray-700">
                <CheckCircle2 className="w-4 h-4 text-green-500" />
                City Hall is currently active
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden">
              <div className="p-5 border-b border-gray-50 dark:border-gray-800">
                <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">Trending in Seattle</h3>
              </div>
              <div className="p-2">
                <TrendingItem category="Infrastructure • Trending" tag="#WestSeattleBridge" reports="2.4k reports" />
                <TrendingItem category="Environment • 4h ago" tag="Lake Union Water Quality" reports="842 reports" />
                <TrendingItem category="Safety • Trending" tag="3rd Ave Lighting" reports="1.1k reports" />
                <button className="w-full text-center py-4 text-sm font-bold text-primary hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors">Show more</button>
              </div>
            </div>
            
            <div className="px-5 text-[10px] text-gray-400 font-medium flex flex-wrap gap-x-4 gap-y-2">
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Cookie Policy</a>
              <a href="#" className="hover:underline">Accessibility</a>
              <span className="dark:text-gray-500">© 2026 Civix Inc.</span>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false, collapsed = false, onClick }: { icon: React.ReactNode, label: string, active?: boolean, collapsed?: boolean, onClick?: () => void }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl font-bold transition-all ${active ? 'bg-blue-50 dark:bg-blue-900/20 text-primary dark:text-blue-400 shadow-sm shadow-blue-100/50 dark:shadow-none' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'} ${collapsed ? 'lg:justify-center lg:px-0' : ''}`}
  >
    <div className="flex-shrink-0">{icon}</div>
    <span className={collapsed ? 'lg:hidden' : 'block'}>{label}</span>
  </button>
);

const Tab = ({ label, active = false }: { label: string, active?: boolean }) => (
  <button className={`flex-1 min-w-[120px] py-4 text-sm font-bold transition-all border-b-2 ${active ? 'border-primary text-primary' : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}>
    {label}
  </button>
);

interface FeedItemProps {
  user: {
    name: string;
    handle: string;
    time: string;
    avatar: string;
  };
  category: string;
  tag?: string;
  content: string;
  image?: string;
  images?: string[];
  engagement: {
    likes: string;
    comments: string;
    shares: string;
  };
  status: string;
}

const FeedItem = ({ id, user, category, tag, content, image, images, engagement, status, location, onEdit, onVote }: FeedItemProps & { id: string, location?: string, onEdit: (id: string) => void, onVote: (id: string) => void }) => (
  <div className="p-4 md:p-6 border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/50 dark:hover:bg-gray-900/50 transition-colors cursor-pointer group bg-white dark:bg-gray-950">
    <div className="flex gap-4">
      <img src={user.avatar} className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-white dark:border-gray-800 shadow-sm flex-shrink-0" alt={user.name} />
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-gray-900 dark:text-white hover:underline truncate">{user.name}</span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400 truncate">{user.handle}</span>
            <span className="text-gray-300 dark:text-gray-700 hidden sm:inline">·</span>
            <span className="text-xs md:text-sm text-gray-500 dark:text-gray-400">{user.time}</span>
          </div>
          <div className="flex gap-2 items-center">
            {tag && <span className="px-2 py-0.5 bg-orange-100/50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 text-[10px] font-black rounded uppercase tracking-wider">{tag}</span>}
            <span className={`px-2 py-0.5 ${status === 'PENDING' ? 'bg-orange-50 dark:bg-orange-900/10 text-orange-500 dark:text-orange-400' : 'bg-blue-50 dark:bg-blue-900/10 text-blue-500 dark:text-blue-400'} text-[10px] font-black rounded uppercase tracking-wider`}>{status}</span>
            <button 
              onClick={(e) => { e.stopPropagation(); onEdit(id); }}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-400 hover:text-primary transition-all ml-1"
              title="Edit Report"
            >
              <FileText className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-1.5 mb-2">
          <p className="text-[10px] font-black text-primary/60 dark:text-blue-400/60 tracking-widest uppercase">{category}</p>
          {location && (
            <>
              <span className="text-gray-300 dark:text-gray-700">·</span>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase flex items-center gap-1">
                <MapPin className="w-2.5 h-2.5" /> {location}
              </p>
            </>
          )}
        </div>
        <p className="text-gray-800 dark:text-gray-200 leading-relaxed mb-4 text-sm md:text-base">{content}</p>
        
        {image && <img src={image} className="rounded-2xl w-full h-[200px] sm:h-[320px] object-cover border border-gray-100 dark:border-gray-800 shadow-sm mb-4" alt="Report" />}
        {images && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {images.map((img: string, i: number) => (
              <img key={i} src={img} className="rounded-2xl w-full h-[150px] sm:h-[240px] object-cover border border-gray-100 dark:border-gray-800 shadow-sm" alt="Report" />
            ))}
          </div>
        )}

        <div className="flex justify-between max-w-sm text-gray-400 dark:text-gray-500 group-hover:text-gray-500 dark:group-hover:text-gray-400 transition-colors pt-2">
          <button 
            onClick={(e) => { e.stopPropagation(); onVote(id); }}
            className="flex items-center gap-2 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            <Heart className="w-4 h-4" /> <span className="text-xs font-bold">{engagement.likes}</span>
          </button>
          <button className="flex items-center gap-2 hover:text-primary dark:hover:text-blue-400 transition-colors"><MessageSquare className="w-4 h-4" /> <span className="text-xs font-bold">{engagement.comments}</span></button>
          <button className="flex items-center gap-2 hover:text-green-500 dark:hover:text-green-400 transition-colors"><Share2 className="w-4 h-4" /> <span className="text-xs font-bold">{engagement.shares}</span></button>
          <button className="flex items-center gap-2 hover:text-gray-900 dark:hover:text-white transition-colors"><Bookmark className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  </div>
);

const TrendingItem = ({ category, tag, reports }: { category: string, tag: string, reports: string }) => (
  <button className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl transition-colors space-y-0.5">
    <p className="text-[10px] font-medium text-gray-500 dark:text-gray-400">{category}</p>
    <p className="text-sm font-bold text-gray-900 dark:text-white">{tag}</p>
    <p className="text-[10px] font-medium text-gray-400 dark:text-gray-500">{reports}</p>
  </button>
);

const CheckCircle2 = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
  </svg>
);

export default HomeFeed;
