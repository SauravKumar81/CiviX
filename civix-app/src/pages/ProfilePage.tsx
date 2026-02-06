import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReports } from '../services/reportService';
import type { Report } from '../services/reportService';
import { 
  MapPin, Calendar, Award, TrendingUp, FileText, 
  Settings, LogOut, ChevronLeft, Shield, CheckCircle2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const [myReports, setMyReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.id) {
        try {
          const data = await getReports({ user: user.id });
          setMyReports(data.data);
        } catch (error) {
          console.error("Failed to fetch user reports", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchUserData();
  }, [user]);

  // Gamification Stats
  const totalReports = myReports.length;
  const resolvedReports = myReports.filter(r => r.status === 'resolved').length;
  const totalUpvotes = myReports.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);
  const impactScore = (resolvedReports * 50) + (totalUpvotes * 10) + (totalReports * 5);
  
  const getRank = (score: number) => {
    if (score > 1000) return "Civic Guardian";
    if (score > 500) return "Community Activist";
    if (score > 100) return "Concerned Citizen";
    return "Newcomer";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans pb-20">
      {/* Header / Banner */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-6 py-8">
           <button 
             onClick={() => navigate('/')}
             className="flex items-center gap-2 text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
           >
             <ChevronLeft size={20} /> Back to Feed
           </button>

           <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-2xl overflow-hidden">
                   <img 
                     src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=200" 
                     className="w-full h-full object-cover" 
                     alt={user?.name} 
                   />
                </div>
                <div className="absolute bottom-1 right-1 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center text-white">
                  <CheckCircle2 size={14} />
                </div>
              </div>
              
              <div className="flex-1 text-center md:text-left">
                 <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{user?.name}</h1>
                 <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">{user?.email}</p>
                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Award size={14} /> {getRank(impactScore)}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={14} /> Member since 2024
                    </span>
                 </div>
              </div>

              <div className="flex gap-3">
                 <button className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-colors">
                    <Settings size={20} />
                 </button>
                 <button 
                   onClick={logout}
                   className="p-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 transition-colors"
                 >
                    <LogOut size={20} />
                 </button>
              </div>
           </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
           <StatCard 
             icon={<TrendingUp className="text-orange-500" />} 
             label="Impact Score" 
             value={impactScore.toString()} 
             sub="Top 5% in Seattle" 
           />
           <StatCard 
             icon={<FileText className="text-blue-500" />} 
             label="Issues Reported" 
             value={totalReports.toString()} 
             sub={`${resolvedReports} Resolved`} 
           />
           <StatCard 
             icon={<Shield className="text-purple-500" />} 
             label="Verification Level" 
             value="Level 2" 
             sub="Phone Verified" 
           />
        </div>

        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           <FileText className="text-gray-400" /> Resolution History
        </h2>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
           </div>
        ) : myReports.length > 0 ? (
           <div className="space-y-4">
              {myReports.map(report => (
                <div key={report._id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-4 transition-transform hover:scale-[1.01] cursor-pointer">
                   <img 
                     src={report.imageUrl !== 'no-photo.jpg' ? report.imageUrl : "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=200"} 
                     className="w-20 h-20 rounded-xl object-cover" 
                     alt="Report" 
                   />
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                         <span className="text-[10px] uppercase font-black tracking-wider text-gray-400 mb-1 block">{report.category}</span>
                         <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                           report.status === 'resolved' ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'
                         }`}>
                           {report.status}
                         </span>
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white truncate">{report.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1 mt-1">{report.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-xs text-gray-400 font-medium">
                         <span className="flex items-center gap-1"><TrendingUp size={12}/> {report.upvotes || 0} Upvotes</span>
                         <span className="flex items-center gap-1"><MapPin size={12}/> {report.location.formattedAddress || 'Seattle, WA'}</span>
                      </div>
                   </div>
                </div>
              ))}
           </div>
        ) : (
           <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-3xl border border-dashed border-gray-200 dark:border-gray-800">
              <div className="w-16 h-16 bg-gray-50 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                 <FileText className="text-gray-400" />
              </div>
              <h3 className="font-bold text-gray-900 dark:text-white">No reports yet</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Submit your first civic issue today!</p>
           </div>
        )}
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, sub }: { icon: React.ReactNode, label: string, value: string, sub: string }) => (
  <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm relative overflow-hidden group">
     <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity scale-150 transform translate-x-1/4 -translate-y-1/4">
       {icon}
     </div>
     <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">{icon}</div>
        <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{label}</span>
     </div>
     <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{value}</div>
     <div className="text-xs font-medium text-emerald-500">{sub}</div>
  </div>
);

export default ProfilePage;
