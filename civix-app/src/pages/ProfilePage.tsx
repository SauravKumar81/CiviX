import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReports } from '../services/reportService';
import { getBookmarks } from '../services/authService';
import type { Report } from '../services/reportService';
import { 
  MapPin, Calendar, Award, TrendingUp, FileText, 
  Settings, LogOut, ChevronLeft, Shield, CheckCircle2, Bookmark
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { followUser, unfollowUser, getPublicProfile, updateProfile } from '../services/authService';
import { X, Camera } from 'lucide-react';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { id } = useParams<{ id: string }>(); // Optional ID from URL
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'reports' | 'saved'>('reports');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    bio: '',
    location: '',
    avatar: ''
  });
  const [editLoading, setEditLoading] = useState(false);

  const isOwnProfile = !id || (user && user.id === id);

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (isOwnProfile) {
          // My Profile
          if (!user) return; // Wait for auth
          setProfileUser(user);
          
          // Fetch my reports
          const data = await getReports({ user: user.id });
          setReports(data.data);
          
          // Fetch saved reports (only for me)
          // ... logic kept same for saved ...
        } else {
          // Public Profile
          const data = await getPublicProfile(id!);
          setProfileUser(data.data);
          setReports(data.data.reports || []); // Assuming backend returns reports, else fetch separate
          
          // Separate fetch for public reports if backend didn't include
          const reportData = await getReports({ user: id });
          setReports(reportData.data);

          // Check if I follow them
          if (user && data.data.followers.includes(user.id)) {
            setIsFollowing(true);
          }
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [id, user, isOwnProfile]);

  const handleFollowToggle = async () => {
    if (!user) return navigate('/login');
    setFollowLoading(true);
    try {
      if (isFollowing) {
        await unfollowUser(profileUser._id);
        setIsFollowing(false);
        setProfileUser((prev: any) => ({ ...prev, followersCount: prev.followersCount - 1 }));
      } else {
        await followUser(profileUser._id);
        setIsFollowing(true);
        setProfileUser((prev: any) => ({ ...prev, followersCount: prev.followersCount + 1 }));
      }
    } catch (error) {
      console.error("Follow action failed", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditLoading(true);
    try {
      await updateProfile(editForm);
      setProfileUser((prev: any) => ({ ...prev, ...editForm }));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setEditLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: profileUser.name || '',
      bio: profileUser.bio || '',
      location: profileUser.location || '',
      avatar: profileUser.avatar || ''
    });
    setIsEditModalOpen(true);
  };

  // Gamification Stats
  const myReports = reports;
  const listReports = activeTab === 'reports' ? reports : []; // Rename logic slightly if needed, but for now alias
  // Logic for saved reports is currently placeholder
  const savedReports: Report[] = []; 

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
                 <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">{profileUser?.name}</h1>
                 {profileUser?.bio && <p className="text-gray-600 dark:text-gray-300 italic mb-2">{profileUser.bio}</p>}
                 {profileUser?.location && <div className="flex items-center justify-center md:justify-start gap-1 text-gray-500 dark:text-gray-400 text-sm font-bold uppercase tracking-wider mb-2"><MapPin size={12} /> {profileUser.location}</div>}
                 
                 {isOwnProfile && <p className="text-gray-500 dark:text-gray-400 font-medium mb-4">{profileUser?.email}</p>}
                 
                 {!isOwnProfile && (
                   <p className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest mb-4">
                     {profileUser?.followersCount || 0} Followers · {profileUser?.followingCount || 0} Following
                   </p>
                 )}

                 <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Award size={14} /> {profileUser?.rank || 'Citizen'}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={14} /> Member since {new Date(profileUser?.createdAt || Date.now()).getFullYear()}
                    </span>
                 </div>
              </div>

              <div className="flex gap-3">
                 {!isOwnProfile ? (
                   <button 
                     onClick={handleFollowToggle}
                     disabled={followLoading}
                     className={`px-6 py-3 rounded-xl font-bold transition-all shadow-lg ${isFollowing 
                       ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700' 
                       : 'bg-primary text-white hover:bg-blue-700 shadow-primary/30'}`}
                   >
                     {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                   </button>
                 ) : (
                   <>
                     <button 
                       onClick={openEditModal}
                       className="p-3 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-xl text-gray-600 dark:text-gray-300 transition-colors"
                     >
                        <Settings size={20} />
                     </button>
                     <button 
                       onClick={logout}
                       className="p-3 bg-red-50 dark:bg-red-900/10 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-xl text-red-600 dark:text-red-400 transition-colors"
                     >
                        <LogOut size={20} />
                     </button>
                   </>
                 )}
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

        {/* Tabs */}
        <div className="flex gap-6 border-b border-gray-100 dark:border-gray-800 mb-6">
           <button 
             onClick={() => setActiveTab('my_reports')}
             className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'my_reports' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300'}`}
           >
              My Activity
           </button>
           <button 
             onClick={() => setActiveTab('saved')}
             className={`pb-3 text-sm font-bold uppercase tracking-wider transition-colors border-b-2 ${activeTab === 'saved' ? 'text-primary border-primary' : 'text-gray-400 border-transparent hover:text-gray-600 dark:hover:text-gray-300'}`}
           >
              Saved Reports
           </button>
        </div>

        <h2 className="text-xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-2">
           {activeTab === 'my_reports' ? <FileText className="text-gray-400" /> : <Bookmark className="text-gray-400" />} 
           {activeTab === 'my_reports' ? 'Resolution History' : 'Saved Issues'}
        </h2>

        {loading ? (
           <div className="flex justify-center py-20">
             <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
           </div>
        ) : (activeTab === 'my_reports' ? myReports : savedReports).length > 0 ? (
           <div className="space-y-4">
              {(activeTab === 'my_reports' ? myReports : savedReports).map(report => (
                <div key={report._id} className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-100 dark:border-gray-800 flex gap-4 transition-transform hover:scale-[1.01] cursor-pointer" onClick={() => navigate(`/edit-report/${report._id}`)}>
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
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{activeTab === 'my_reports' ? "Submit your first civic issue today!" : "Bookmark important issues to see them here."}</p>
           </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl p-6 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900 dark:text-white">Edit Profile</h3>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Full Name</label>
                <input 
                  type="text" 
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Bio</label>
                <textarea 
                  value={editForm.bio}
                  onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none h-24 resize-none"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Location</label>
                <input 
                  type="text" 
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none"
                  placeholder="City, State"
                />
              </div>

               <div>
                <label className="text-xs font-bold uppercase text-gray-500 mb-1 block">Avatar URL</label>
                <input 
                  type="text" 
                  value={editForm.avatar}
                  onChange={(e) => setEditForm({...editForm, avatar: e.target.value})}
                  className="w-full p-3 bg-gray-50 dark:bg-gray-800 rounded-xl border-none focus:ring-2 focus:ring-primary outline-none"
                  placeholder="https://..."
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsEditModalOpen(false)}
                  className="flex-1 py-3 font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={editLoading}
                  className="flex-1 py-3 bg-primary text-white font-bold rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {editLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
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
