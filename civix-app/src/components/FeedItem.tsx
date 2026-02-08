
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MoreHorizontal, MessageSquare, Bookmark, 
  ChevronRight, ArrowBigUp, ArrowBigDown, Share 
} from 'lucide-react';

// Utility for consistent city colors
const getCityColor = (city: string) => {
  const colors = [
    'bg-emerald-500 border-emerald-200 text-emerald-700 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400', 
    'bg-blue-500 border-blue-200 text-blue-700 dark:bg-blue-500/10 dark:border-blue-500/20 dark:text-blue-400', 
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
  
  // Extract city/neighborhood roughly (simplified)
  const city = location.split(',')[0].trim();
  const colorClass = getCityColor(city);
  
  let distanceStr = null;
  if (userLocation && coordinates && coordinates.length === 2) {
    // Assuming coordinates are [lon, lat] from GeoJSON
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
    text: string;
    createdAt: string;
  }[];
  isBookmarked?: boolean;
  currentUserId?: string;
  onTagClick?: (tag: string) => void;
  onClick?: () => void;
}

const FeedItem = ({ 
  id, userId, user, category, tag, tags, title, content, image, images, engagement, status, location, userLocation, reportCoordinates, comments, isBookmarked, currentUserId, 
  onEdit, onVote, onComment, onShare, onBookmark, onTagClick, onClick 
}: FeedItemProps & { 
  id: string, 
  location?: string, 
  onEdit: (id: string) => void, 
  onVote: (id: string) => void, 
  onComment: (id: string, text: string) => void, 
  onShare: (id: string) => void, 
  onBookmark: (id: string) => void,
  onClick?: () => void
}) => {
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const navigate = useNavigate();

  const handleProfileClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (userId) {
          navigate(`/profile/${userId}`);
      }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(id, commentText);
    setCommentText('');
  };

  return (
    <div 
      onClick={onClick}
      className="mb-4 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer group overflow-hidden"
    >
      <div className="p-3 md:p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs">
            <img 
              src={user.avatar} 
              onClick={handleProfileClick}
              className="w-6 h-6 rounded-full object-cover cursor-pointer hover:opacity-80" 
              alt={user.name} 
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
                 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
               }`}>
                 {status}
               </span>
            )}
          </div>
          
          <div className="flex items-center">
             {currentUserId === userId && (
                <button 
                  onClick={(e) => { e.stopPropagation(); onEdit(id); }}
                  className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded text-gray-400 hover:text-primary transition-all"
                  title="Edit Report"
                >
                  <MoreHorizontal size={16} />
                </button>
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
          <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
             <button 
               onClick={(e) => { e.stopPropagation(); onVote(id); }}
               className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-orange-500 transition-colors"
             >
               <ArrowBigUp className={`w-5 h-5 ${false ? 'text-orange-500 fill-orange-500' : ''}`} />
             </button>
             <span className="px-1 text-sm text-gray-900 dark:text-gray-200">{engagement.likes && engagement.likes !== '0' ? engagement.likes : 'Vote'}</span>
             <button 
               onClick={(e) => { e.stopPropagation(); }}
               className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-blue-500 transition-colors"
             >
               <ArrowBigDown className="w-5 h-5" />
             </button>
          </div>

          {/* Comment Pill */}
          <button 
             onClick={(e) => { e.stopPropagation(); setShowComments(!showComments); }}
             className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
             <MessageSquare className="w-4 h-4" />
             <span>{comments ? comments.length : engagement.comments}</span>
          </button>

          {/* Share Pill */}
          <button 
             onClick={(e) => { e.stopPropagation(); onShare(id); }}
             className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 px-3 py-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
            {/* Input - "Join the conversation" style */}
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
                     className="p-1.5 bg-primary text-white rounded-full disabled:opacity-50 hover:bg-blue-600 transition-colors"
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
                      
                      <div className="w-7 h-7 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0 z-10 text-[10px] font-bold text-gray-500">
                         {comment.userName?.charAt(0).toUpperCase()}
                      </div>
                      
                      <div className="flex-1 pb-2">
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs font-bold text-gray-900 dark:text-white">{comment.userName}</span>
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
  );
};

export default FeedItem;
