import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getReports } from '../services/reportService';
import type { Report } from '../services/reportService';
import { 
  Calendar, Award, TrendingUp, FileText, 
  Settings, LogOut, ChevronLeft, Bookmark, Share, Eye, Edit3, X, CheckCircle2
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { followUser, unfollowUser, getPublicProfile, updateProfile, getBookmarks } from '../services/authService';

const ProfilePage: React.FC = () => {
  const { user, logout } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<any>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [savedReports, setSavedReports] = useState<Report[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'posts' | 'comments' | 'saved'>('overview');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    username: '',
    bio: '',
    location: '',
    avatar: ''
  });
  const [editLoading, setEditLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const normalizeId = (val?: string) => val?.toLowerCase().replace(/^@/, '');
  const isOwnProfile = !id || (user && (user.id === id || normalizeId(user.username) === normalizeId(id)));

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      try {
        if (isOwnProfile) {
          if (!user) return;
          setProfileUser(user);
          
          if (['overview', 'posts', 'comments'].includes(activeTab)) {
            const data = await getReports({ user: user.id });
            setReports(data.data);
          }
          if (activeTab === 'overview' || activeTab === 'saved') {
            const bookmarks = await getBookmarks();
            setSavedReports(bookmarks.data);
          }
        } else {
          const data = await getPublicProfile(id!);
          setProfileUser(data.data);
          
          if (data.data._id) {
            const reportData = await getReports({ user: data.data._id });
            setReports(reportData.data);
            setSavedReports([]); // Ensure we don't bleed our saves into their feed
          }
          
          if (user && data.data.followers && data.data.followers.includes(user.id)) {
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
  }, [id, user, isOwnProfile, activeTab]);

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
      const formData = new FormData();
      formData.append('name', editForm.name);
      formData.append('username', editForm.username);
      formData.append('bio', editForm.bio);
      formData.append('location', editForm.location);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      } else if (editForm.avatar) {
        formData.append('avatar', editForm.avatar);
      }

      await updateProfile(formData);
      window.location.reload(); 
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setEditLoading(false);
    }
  };

  const openEditModal = () => {
    setEditForm({
      name: profileUser?.name || '',
      username: profileUser?.username || '',
      bio: profileUser?.bio || '',
      location: profileUser?.location || '',
      avatar: profileUser?.avatar || ''
    });
    setAvatarFile(null);
    setIsEditModalOpen(true);
  };

  const myReports = reports;
  const totalReports = myReports.length;
  const resolvedReports = myReports.filter(r => r.status === 'resolved').length;
  const totalUpvotes = myReports.reduce((acc, curr) => acc + (curr.upvotes || 0), 0);
  const impactScore = (resolvedReports * 50) + (totalUpvotes * 10) + (totalReports * 5);

  const tabs: ('overview' | 'posts' | 'comments' | 'saved')[] = isOwnProfile ? ['overview', 'posts', 'comments', 'saved'] : ['overview', 'posts', 'comments'];

  return (
    <div className="min-h-screen bg-[#0B1416] text-[#D7DADC] font-sans pb-20">
      
      {/* Top Navbar Simulation / Back Button */}
      <div className="w-full h-14 bg-[#1A282D] border-b border-[#27353B] flex items-center px-4 sticky top-0 z-40">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 hover:bg-[#27353B] px-3 py-1.5 rounded-full transition-colors text-sm font-bold">
           <ChevronLeft size={18} /> Back
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto pt-8 px-4 flex flex-col lg:flex-row gap-6">
        
        {/* Main Left Content Area */}
        <div className="flex-1 max-w-[800px]">
           {/* Top Header info (Avatar + Name) */}
           <div className="flex items-center gap-4 mb-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-[#1A282D] overflow-hidden bg-[#27353B] shadow-lg">
                   <img 
                     src={(profileUser?.avatar && profileUser.avatar !== 'no-photo.jpg') ? profileUser.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${profileUser?.name || 'User'}`} 
                     onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profileUser?.name || 'User'}`; }}
                     className="w-full h-full object-cover" 
                     alt="" 
                   />
                </div>
              </div>
              <div className="flex flex-col">
                 <h1 className="text-2xl font-black text-white">{profileUser?.name}</h1>
                 <p className="text-sm text-gray-400 font-medium">u/{profileUser?.username || profileUser?.name?.toLowerCase().replace(/\s/g, '') || 'citizen'}</p>
              </div>
           </div>

           {/* Tabs */}
           <div className="flex gap-2 overflow-x-auto mb-6 scrollbar-hide border-b border-[#27353B] pb-[1px]">
              {tabs.map((tab) => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2.5 rounded-full text-sm font-bold capitalize transition-colors flex-shrink-0
                    ${activeTab === tab ? 'bg-[#27353B] text-white' : 'text-gray-400 hover:bg-[#1A282D]'}`}
                >
                  {tab}
                </button>
              ))}
           </div>

           {/* Active Tab Content */}
           <div className="space-y-4">
              {loading ? (
                <div className="py-20 flex justify-center"><div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" /></div>
              ) : (
                <>
                  {/* Feed Rendering Engine */}
                  {['overview', 'posts', 'comments', 'saved'].includes(activeTab) && (() => {
                     const activities: any[] = [];
                     
                     myReports.forEach(r => {
                       activities.push({
                         id: `post-${r._id}`,
                         type: 'post',
                         date: new Date(r.createdAt || Date.now()),
                         report: r
                       });
                       
                       r.comments?.forEach((c: any) => {
                         // Comments on my post
                         if (c.user !== profileUser?._id) {
                           activities.push({
                             id: `comment-${r._id}-${c._id || Math.random()}`,
                             type: 'comment_received',
                             date: new Date(c.createdAt || Date.now()),
                             report: r,
                             comment: c
                           });
                         }
                       });
                     });

                     savedReports.forEach(r => {
                       activities.push({
                         id: `saved-${r._id}`,
                         type: 'saved',
                         date: new Date(r.createdAt || Date.now()),
                         report: r
                       });
                     });

                     activities.sort((a, b) => b.date.getTime() - a.date.getTime());

                     // Apply Filter based on Tab
                     const filteredActivities = activities.filter(act => {
                       if (activeTab === 'overview') return true;
                       if (activeTab === 'posts') return act.type === 'post';
                       if (activeTab === 'comments') return act.type === 'comment_received';
                       if (activeTab === 'saved') return act.type === 'saved';
                       return true;
                     });

                     if (filteredActivities.length === 0) {
                        return (
                          <div className="text-center py-20 bg-[#1A282D] rounded-xl border border-dashed border-[#27353B]">
                             <div className="w-16 h-16 bg-[#27353B] rounded-full flex items-center justify-center mx-auto mb-4">
                                <FileText className="text-gray-400" />
                             </div>
                             <h3 className="font-bold text-white">No {activeTab} yet</h3>
                          </div>
                        );
                     }

                     return filteredActivities.map(act => (
                        <div key={act.id} className="bg-[#1A282D] p-4 rounded-xl border border-[#27353B] flex gap-4 transition-colors hover:border-[#3A4A51] cursor-pointer" onClick={() => navigate(`/report/${act.report._id}`)}>
                           <div className="flex flex-col items-center gap-1 w-8 pt-1">
                             {act.type === 'post' && <TrendingUp size={16} className="text-gray-500" />}
                             {act.type === 'comment_received' && <FileText size={16} className="text-emerald-500" />}
                             {act.type === 'saved' && <Bookmark size={16} className="text-blue-500 fill-blue-500" />}
                           </div>
                           <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1 text-xs text-gray-400 font-medium">
                                 {act.type === 'post' && <span className="text-white font-bold">{isOwnProfile ? 'You posted this' : `${profileUser?.name} posted this`}</span>}
                                 {act.type === 'comment_received' && <span className="text-emerald-400 font-bold">{act.comment.userName || 'Someone'} commented on {isOwnProfile ? 'your' : 'this'} post</span>}
                                 {act.type === 'saved' && <span className="text-blue-400 font-bold">You saved this</span>}
                                 <span>•</span>
                                 <span>{act.date.toLocaleDateString()}</span>
                              </div>
                              {act.type === 'comment_received' && (
                                <div className="p-3 bg-[#0B1416] rounded-lg mb-3 border border-[#27353B] text-sm text-gray-300">
                                  "{act.comment.text}"
                                </div>
                              )}
                              <h3 className="font-bold text-white text-base mb-1">{act.report.title}</h3>
                              <p className="text-sm text-gray-500 line-clamp-1 mb-2">{act.report.description}</p>
                           </div>
                        </div>
                     ));
                  })()}


                </>
              )}
           </div>
        </div>

        {/* Right Sidebar - Dynamic User Panel */}
        <div className="w-full lg:w-[320px] shrink-0">
           <div className="bg-[#1A282D] rounded-xl border border-[#27353B] overflow-hidden sticky top-20">
              
              {/* Banner Area */}
              <div className="h-24 bg-gradient-to-br from-blue-900 via-indigo-900 to-[#1A282D] relative">
                 <button className="absolute top-3 right-3 p-1.5 bg-black/30 hover:bg-black/50 rounded-full transition-colors backdrop-blur-sm">
                   <Share size={14} className="text-white" />
                 </button>
              </div>

              {/* Profile Card Content */}
              <div className="p-4 pt-12 relative animate-in fade-in duration-300">
                 <div className="absolute -top-10 left-4 w-16 h-16 rounded-xl border-4 border-[#1A282D] bg-[#27353B] overflow-hidden shadow-lg">
                    <img 
                       src={(profileUser?.avatar && profileUser.avatar !== 'no-photo.jpg') ? profileUser.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${profileUser?.name || 'User'}`} 
                       onError={(e) => { e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${profileUser?.name || 'User'}`; }}
                       className="w-full h-full object-cover bg-[#0B1416]" 
                       alt="" 
                    />
                 </div>

                 <h2 className="text-lg font-black text-white">{profileUser?.name || 'Citizen'}</h2>
                 <p className="text-xs text-gray-400 font-medium mb-4">u/{profileUser?.username || 'user'}</p>

                 {!isOwnProfile ? (
                   <button 
                     onClick={handleFollowToggle}
                     disabled={followLoading}
                     className={`w-full py-2 mb-6 rounded-full font-bold text-sm transition-colors flex justify-center items-center gap-2 ${
                       isFollowing 
                       ? 'border border-[#D7DADC] text-[#D7DADC] hover:bg-[#27353B]' 
                       : 'bg-white text-black hover:bg-gray-200'
                     }`}
                   >
                     {followLoading ? '...' : isFollowing ? 'Following' : 'Follow'}
                   </button>
                 ) : (
                   <button 
                     onClick={() => {
                        const baseUrl = window.location.origin;
                        navigator.clipboard.writeText(`${baseUrl}/profile/${profileUser?._id}`);
                        alert('Profile link copied!');
                     }}
                     className="w-full py-2 mb-6 rounded-full font-bold text-sm border border-[#D7DADC] text-[#D7DADC] hover:bg-[#27353B] transition-colors flex justify-center items-center gap-2"
                   >
                     <Share size={16} /> Share Profile
                   </button>
                 )}

                 {/* Stats Grid */}
                 <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-lg font-bold text-white mb-0.5">{profileUser?.followers?.length || profileUser?.followersCount || 0}</div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Followers</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white mb-0.5">{impactScore}</div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Karma</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white mb-0.5 mt-2 flex items-center gap-1">
                        <Calendar size={12} className="text-gray-500" />
                        {new Date(profileUser?.createdAt || Date.now()).toLocaleDateString(undefined, { year: '2-digit', month: 'short'})}
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Civix Age</div>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white mb-0.5 mt-2 flex items-center gap-1">
                        <FileText size={12} className="text-blue-500" />
                        {totalReports}
                      </div>
                      <div className="text-[10px] uppercase font-bold tracking-wider text-gray-500">Contributions</div>
                    </div>
                 </div>

                 {/* Achievements */}
                 <div className="mb-6 pt-6 border-t border-[#27353B]">
                    <h3 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-3 block">Achievements</h3>
                    <div className="flex gap-2 items-center">
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-500 to-orange-400 flex items-center justify-center p-1 shadow-md shadow-orange-500/20" title="Newcomer">
                         <Award size={16} className="text-white" />
                       </div>
                       {resolvedReports > 0 && (
                         <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center p-1 shadow-md shadow-emerald-500/20" title="Problem Solver">
                           <CheckCircle2 size={16} className="text-white" />
                         </div>
                       )}
                       <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center p-1 shadow-md shadow-purple-500/20" title="Feed Finder">
                         <Eye size={16} className="text-white" />
                       </div>
                    </div>
                 </div>

                 {/* Settings / Owner Controls */}
                 {isOwnProfile && (
                   <div className="pt-6 border-t border-[#27353B] space-y-4">
                      <h3 className="text-xs uppercase font-bold tracking-wider text-gray-500 mb-2 block">Settings</h3>
                      
                      <div className="flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#27353B] flex items-center justify-center"><Edit3 size={14} /></div>
                            <div>
                               <div className="text-sm font-bold text-white">Profile</div>
                               <div className="text-[10px] text-gray-500 font-medium">Customize your profile</div>
                            </div>
                         </div>
                         <button onClick={openEditModal} className="px-3 py-1 bg-[#27353B] hover:bg-[#3A4A51] rounded-full text-xs font-bold text-white transition-colors">Update</button>
                      </div>

                      <div className="flex items-center justify-between group">
                         <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-[#27353B] flex items-center justify-center"><Settings size={14} /></div>
                            <div>
                               <div className="text-sm font-bold text-white">Account</div>
                               <div className="text-[10px] text-gray-500 font-medium">Manage preferences</div>
                            </div>
                         </div>
                         <button onClick={() => navigate('/account')} className="px-3 py-1 bg-[#27353B] hover:bg-[#3A4A51] rounded-full text-xs font-bold text-white transition-colors">Settings</button>
                      </div>

                      <button onClick={logout} className="w-full mt-4 flex items-center justify-center gap-2 py-2 border border-red-500/20 text-red-400 hover:bg-red-500/10 rounded-xl text-sm font-bold transition-colors">
                        <LogOut size={16} /> Log Out
                      </button>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* Edit Profile Modal (Dark Mode Optimized) */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#1A282D] w-full max-w-md rounded-2xl p-6 shadow-2xl border border-[#27353B] animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-white">Edit Profile</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="p-2 hover:bg-[#27353B] rounded-full text-gray-400 transition-colors">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">Full Name</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({...editForm, name: e.target.value})} className="w-full p-3 bg-[#0B1416] text-white rounded-xl border border-[#27353B] focus:border-blue-500 outline-none transition-colors" />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">Username</label>
                <input type="text" value={editForm.username} onChange={(e) => setEditForm({...editForm, username: e.target.value})} className="w-full p-3 bg-[#0B1416] text-white rounded-xl border border-[#27353B] focus:border-blue-500 outline-none transition-colors" />
              </div>
              
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">Bio</label>
                <textarea value={editForm.bio} onChange={(e) => setEditForm({...editForm, bio: e.target.value})} className="w-full p-3 bg-[#0B1416] text-white rounded-xl border border-[#27353B] focus:border-blue-500 outline-none h-24 resize-none transition-colors" placeholder="Tell us about yourself..." />
              </div>

              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">Location</label>
                <input type="text" value={editForm.location} onChange={(e) => setEditForm({...editForm, location: e.target.value})} className="w-full p-3 bg-[#0B1416] text-white rounded-xl border border-[#27353B] focus:border-blue-500 outline-none transition-colors" placeholder="City, State" />
              </div>

               <div>
                <label className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1 block">Avatar URL or Upload</label>
                <div className="flex gap-2 items-center">
                   <input type="text" value={editForm.avatar} onChange={(e) => setEditForm({...editForm, avatar: e.target.value})} className="flex-1 p-3 bg-[#0B1416] text-white rounded-xl border border-[#27353B] focus:border-blue-500 outline-none transition-colors text-sm" placeholder="https://..." />
                   <div className="relative shrink-0 w-24">
                      <input type="file" accept="image/*" onChange={(e) => { if (e.target.files?.[0]) setAvatarFile(e.target.files[0]); }} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
                      <button type="button" className="w-full h-11 bg-[#27353B] hover:bg-[#3A4A51] rounded-xl font-bold text-white transition-colors flex items-center justify-center text-xs uppercase tracking-wider">
                        {avatarFile ? 'Selected' : 'Upload'}
                      </button>
                   </div>
                </div>
              </div>

              <div className="pt-6 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 py-3 font-bold text-gray-400 hover:text-white hover:bg-[#27353B] rounded-xl transition-colors">Cancel</button>
                <button type="submit" disabled={editLoading} className="flex-1 py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors disabled:opacity-50">
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

export default ProfilePage;
