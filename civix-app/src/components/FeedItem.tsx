
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreHorizontal, MessageSquare, Bookmark, 
  ChevronRight, ArrowBigUp, ArrowBigDown, Share,
  Pencil, Trash2, AlertTriangle, Clock, CheckCircle, Loader2
} from 'lucide-react';

// Utility for consistent city colors
const getCityColor = (city: string) => {
  const colors = [
    'bg-emerald-500 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400', 
    'bg-violet-500 border-violet-200 text-violet-700 dark:bg-violet-500/10 dark:border-violet-500/20 dark:text-violet-400', 
    'bg-purple-500 border-purple-200 text-purple-700 dark:bg-purple-500/10 dark:border-purple-500/20 dark:text-purple-400', 
    'bg-orange-500 border-orange-200 text-orange-700 dark:bg-orange-500/10 dark:border-orange-500/20 dark:text-orange-400', 
    'bg-pink-500 border-pink-200 text-pink-700 dark:bg-pink-500/10 dark:border-pink-500/20 dark:text-pink-400', 
    'bg-cyan-500 border-cyan-200 text-cyan-700 dark:bg-cyan-500/10 dark:border-cyan-500/20 dark:text-cyan-400'
  ];
  let hash = 0;
  for (let i = 0; i < city.length; i++) hash = city.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

// Haversine Distance Calculation
const calculateDistance = (lat1: number, lon1: number, lat2?: number, lon2?: number) => {
  if (!lat2 || !lon2) return null;
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
            Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const d = R * c * 0.621371; // Convert to miles
  return d < 0.1 ? 'Nearby' : `${d.toFixed(1)} mi away`;
};

export const LocationBadge = ({ location, userLocation, coordinates }: { location: string, userLocation: { latitude: number, longitude: number } | null, coordinates?: [number, number] }) => {
  if (!location) return null;
  
  const city = location.split(',')[0].trim();
  const colorClass = getCityColor(city);
  
  let distanceStr = null;
  if (userLocation && coordinates && coordinates.length === 2) {
    distanceStr = calculateDistance(userLocation.latitude, userLocation.longitude, coordinates[1], coordinates[0]);
  }

  return (
    <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${colorClass} transition-all hover:scale-105`}>
      <div className="relative flex items-center justify-center w-2 h-2">
         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-current opacity-75"></span>
         <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-current"></span>
      </div>
      <span className="text-[10px] font-black uppercase tracking-wider">{city}</span>
      {distanceStr && (
        <>
          <span className="w-0.5 h-2 bg-current opacity-30"></span>
          <span className="text-[9px] font-bold opacity-80">{distanceStr}</span>
        </>
      )}
    </div>
  );
};

// --- Confirmation Modal ---
const ConfirmDeleteModal = ({ 
  isOpen, onClose, onConfirm, title 
}: { 
  isOpen: boolean; onClose: () => void; onConfirm: () => void; title?: string 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in zoom-in-95 fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Delete Report</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">This action cannot be undone.</p>
          </div>
        </div>
        
        {title && (
          <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
            <p className="text-sm text-gray-700 dark:text-gray-300 font-medium line-clamp-2">"{title}"</p>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-bold rounded-xl text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-xl text-sm hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Status Dropdown Item ---
const statusOptions = [
  { value: 'pending', label: 'Pending', icon: Clock, color: 'text-orange-500' },
  { value: 'in-progress', label: 'In Progress', icon: Loader2, color: 'text-violet-500' },
  { value: 'resolved', label: 'Resolved', icon: CheckCircle, color: 'text-emerald-500' },
] as const;

export interface FeedItemProps {
  userId?: string;
  user: {
    name: string;
    handle: string;
    time: string;
    avatar: string;
  };
  category: string;
  tag?: string;
  tags?: string[];
  title?: string;
  content: string;
  image?: string;
  images?: string[];
  engagement: {
    likes: string;
    comments: string;
    shares: string;
  };
  status: string;
  userLocation: { latitude: number, longitude: number } | null;
  reportCoordinates?: [number, number];
  comments?: {
    user: string;
    userName: string;
    userAvatar?: string;
    text: string;
    createdAt: string;
  }[];
  isBookmarked?: boolean;
  isUpvoted?: boolean;
  currentUserId?: string;
  onTagClick?: (tag: string) => void;
  onClick?: () => void;
}

const FeedItem = ({ 
  id, userId, user, category, tag, tags, title, content, image, images, engagement, status, location, userLocation, reportCoordinates, comments, isBookmarked, isUpvoted, currentUserId, 
  onEdit, onDelete, onVote, onComment, onShare, onBookmark, onStatusChange, onTagClick, onClick 
}: FeedItemProps & { 
  id: string, 
  location?: string, 
  onEdit: (id: string) => void, 
  onDelete?: (id: string) => void,
  onVote: (id: string) => void, 
  onComment: (id: string, text: string) => void, 
  onShare: (id: string) => void, 
  onBookmark: (id: string) => void,
  onStatusChange?: (id: string, status: string) => void,
  onClick?: () => void
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
        setShowStatusMenu(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleProfileClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (userId) {
          navigate(`/profile/${userId}`);
      } else {
          const rawHandle = user.handle?.replace('@', '');
          if (rawHandle) navigate(`/profile/${rawHandle}`);
      }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(id, commentText);
    setCommentText('');
  };

  const isOwner = Boolean(currentUserId && userId && String(currentUserId) === String(userId));

  return (
    <>
      <div 
        onClick={onClick}
        className="mb-4 bg-white/40 dark:bg-gray-950/20 backdrop-blur-xl border border-white/10 rounded-lg hover:border-white/20 transition-all cursor-pointer group overflow-hidden shadow-sm"
      >
        <div className="p-3 md:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs">
              <img 
                src={user.avatar} 
                onClick={handleProfileClick}
                onError={(e) => {
                  e.currentTarget.src = `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`;
                }}
                className="w-6 h-6 rounded-full object-cover cursor-pointer hover:opacity-80 bg-gray-200 dark:bg-gray-800" 
                alt="" 
              />
              <span className="font-bold text-gray-900 dark:text-white hover:underline cursor-pointer">r/{category?.replace(/\s+/g, '')}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400 hover:underline cursor-pointer" onClick={handleProfileClick}>u/{user.handle?.replace('@', '') || user.name}</span>
              <span className="text-gray-400">•</span>
              <span className="text-gray-500 dark:text-gray-400">{user.time}</span>
              
              {status && (
                 <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                   status === 'pending' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' :
                   status === 'resolved' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' :
                   'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400'
                 }`}>
                   {status}
                 </span>
              )}
            </div>
            
            {/* Three-dot menu with dropdown */}
            <div className="relative" ref={dropdownRef}>
               {isOwner && (
                 <button 
                   onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                   className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-primary transition-all"
                   title="Options"
                 >
                   <MoreHorizontal size={16} />
                 </button>
               )}

               {/* Dropdown Menu */}
               {showDropdown && isOwner && (
                 <div className="absolute right-0 top-8 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                   <button
                     onClick={(e) => { e.stopPropagation(); setShowDropdown(false); onEdit(id); }}
                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                   >
                     <Pencil className="w-4 h-4 text-gray-400" /> Edit Report
                   </button>

                   {/* Status submenu */}
                   <div className="relative">
                     <button
                       onClick={(e) => { e.stopPropagation(); setShowStatusMenu(!showStatusMenu); }}
                       className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                     >
                       <Clock className="w-4 h-4 text-gray-400" /> Update Status
                       <ChevronRight className="w-3 h-3 ml-auto text-gray-400" />
                     </button>
                     
                     {showStatusMenu && (
                       <div className="absolute left-full top-0 ml-1 w-44 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-800 py-1 z-50 animate-in fade-in slide-in-from-left-2 duration-150">
                         {statusOptions.map((opt) => {
                           const Icon = opt.icon;
                           const isActive = status?.toLowerCase() === opt.value;
                           return (
                             <button
                               key={opt.value}
                               onClick={(e) => {
                                 e.stopPropagation();
                                 onStatusChange?.(id, opt.value);
                                 setShowDropdown(false);
                                 setShowStatusMenu(false);
                               }}
                               className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                                 isActive 
                                   ? 'bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white' 
                                   : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'
                               }`}
                             >
                               <Icon className={`w-4 h-4 ${opt.color}`} />
                               {opt.label}
                               {isActive && <span className="ml-auto text-[10px] font-bold text-primary">Current</span>}
                             </button>
                           );
                         })}
                       </div>
                     )}
                   </div>

                   <div className="my-1 border-t border-gray-100 dark:border-gray-800" />

                   <button
                     onClick={(e) => { e.stopPropagation(); setShowDropdown(false); setShowDeleteModal(true); }}
                     className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
                   >
                     <Trash2 className="w-4 h-4" /> Delete Report
                   </button>
                 </div>
               )}
            </div>
          </div>

          {/* Title */}
          {title && (
            <h3 className="text-lg md:text-xl font-bold text-gray-900 dark:text-white mb-2 leading-snug">{title}</h3>
          )}

          {/* Tags/Flair */}
          <div className="flex flex-wrap gap-2 mb-3">
            <LocationBadge location={location || ''} userLocation={userLocation} coordinates={reportCoordinates} />
            {tags && tags.length > 0 ? (
               tags.map(t => (
                 <button 
                   key={t}
                   onClick={(e) => { e.stopPropagation(); onTagClick?.(t); }} 
                   className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                 >
                   #{t}
                 </button>
               ))
            ) : tag ? (
                 <button 
                   onClick={(e) => { e.stopPropagation(); onTagClick?.(tag); }} 
                   className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                 >
                   #{tag}
                 </button>
            ) : null}
          </div>

          {/* Content Body */}
          <div className="text-sm md:text-base text-gray-800 dark:text-gray-200 leading-relaxed mb-3 whitespace-pre-wrap">
            {content}
          </div>

          {/* Images */}
          {((image && image !== 'no-photo.jpg') || (images && images.length > 0)) && (
            <div className="mb-3 rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 max-h-[500px] flex items-center justify-center">
              <img 
                src={image || images?.[0]} 
                className="w-full h-full object-contain max-h-[500px]" 
                loading="lazy"
                alt="Evidence" 
              />
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400">
            {/* Vote Pill */}
            <div className="flex items-center bg-gray-100/50 dark:bg-gray-800/40 backdrop-blur-sm rounded-full overflow-hidden">
               <button 
                 onClick={(e) => { e.stopPropagation(); onVote(id); }}
                 className={`p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors ${isUpvoted ? 'text-orange-500' : 'hover:text-orange-500'}`}
               >
                 <ArrowBigUp className={`w-5 h-5 ${isUpvoted ? 'fill-orange-500' : ''}`} />
               </button>
               <span className={`px-1 text-sm ${isUpvoted ? 'text-orange-600 dark:text-orange-400 font-black' : 'text-gray-900 dark:text-gray-200'}`}>{engagement.likes && engagement.likes !== '0' ? engagement.likes : 'Vote'}</span>
               <button 
                 onClick={(e) => { e.stopPropagation(); }}
                 className="p-2 hover:bg-gray-200/50 dark:hover:bg-gray-700/50 hover:text-violet-500 transition-colors"
               >
                 <ArrowBigDown className="w-5 h-5" />
               </button>
            </div>

            {/* Comment Pill */}
            <button 
               onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
               className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/40 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            >
               <MessageSquare className="w-4 h-4" />
               <span>{comments ? comments.length : engagement.comments}</span>
            </button>

            {/* Share Pill */}
            <button 
               onClick={(e) => { e.stopPropagation(); onShare(id); }}
               className="flex items-center gap-2 bg-gray-100/50 dark:bg-gray-800/40 backdrop-blur-sm px-3 py-2 rounded-full hover:bg-gray-200/50 dark:hover:bg-gray-700/50 transition-colors"
            >
               <Share className="w-4 h-4" />
               <span>Share</span>
            </button>
            
            <button 
                onClick={(e) => { e.stopPropagation(); onBookmark(id); }}
                className={`p-2 rounded-full transition-all hover:bg-gray-100 dark:hover:bg-gray-800 ${isBookmarked ? 'text-primary' : 'text-gray-400'}`}
            >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary' : ''}`} />
            </button>
          </div>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800 animate-in fade-in duration-200" onClick={(e) => e.stopPropagation()}>
              {/* Input */}
              <form onSubmit={handleCommentSubmit} className="mb-6 relative">
                 <input 
                   type="text" 
                   value={commentText}
                   onChange={(e) => setCommentText(e.target.value)}
                   placeholder="Join the conversation..." 
                   className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full py-2.5 px-4 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all text-gray-900 dark:text-white placeholder:text-gray-500"
                 />
                 <div className="absolute right-2 top-1/2 -translate-y-1/2">
                     <button 
                       type="submit"
                       disabled={!commentText.trim()}
                       className="p-1.5 bg-primary text-white rounded-full disabled:opacity-50 hover:bg-violet-600 transition-colors"
                     >
                       <ChevronRight size={14} />
                     </button>
                 </div>
              </form>

              <div className="space-y-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                 {comments && comments.length > 0 ? (
                   comments.map((comment, index) => (
                     <div key={index} className="flex gap-3 relative">
                        {/* Thread Line */}
                        {index !== comments.length - 1 && (
                            <div className="absolute left-[14px] top-8 bottom-[-16px] w-[2px] bg-gray-100 dark:bg-gray-800" />
                        )}
                        
                        {comment.userAvatar ? (
                          <img 
                            src={comment.userAvatar} 
                            alt={comment.userName}
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profile/${comment.user}`);
                            }}
                            className="w-7 h-7 rounded-full object-cover flex-shrink-0 z-10 bg-white cursor-pointer hover:opacity-80 transition-opacity"
                          />
                        ) : (
                          <div 
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/profile/${comment.user}`);
                            }}
                            className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-[10px] font-bold text-gray-500 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                             {comment.userName?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        
                        <div className="flex-1 pb-2">
                           <div className="flex items-center gap-2 mb-1">
                              <span 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/profile/${comment.user}`);
                                }}
                                className="text-xs font-bold text-gray-900 dark:text-white cursor-pointer hover:underline"
                              >
                                  {comment.userName}
                              </span>
                              <span className="text-[10px] text-gray-400">{new Date(comment.createdAt).toLocaleDateString()}</span>
                           </div>
                           <p className="text-sm text-gray-700 dark:text-gray-300">{comment.text}</p>
                           
                           <div className="flex items-center gap-4 mt-2">
                              <button className="text-gray-400 hover:text-orange-500 flex items-center gap-1 text-[10px] font-bold transition-colors">
                                 <ArrowBigUp size={14} /> 1
                              </button>
                              <button className="text-gray-400 hover:text-primary flex items-center gap-1 text-[10px] font-bold transition-colors">
                                 <MessageSquare size={12} /> Reply
                              </button>
                           </div>
                        </div>
                     </div>
                   ))
                 ) : (
                   <p className="text-center text-sm text-gray-400 italic py-4">No comments yet. Be the first to join!</p>
                 )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => {
          setShowDeleteModal(false);
          onDelete?.(id);
        }}
        title={title}
      />
    </>
  );
};

export default FeedItem;
