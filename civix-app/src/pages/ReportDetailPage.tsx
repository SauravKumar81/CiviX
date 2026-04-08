
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getReport, addComment, upvoteReport } from '../services/reportService';
import { useAuth } from '../context/AuthContext';
import FeedItem from '../components/FeedItem';

const ReportDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (id) {
      loadReport(id);
    }
  }, [id]);

  const loadReport = async (reportId: string) => {
    try {
      setLoading(true);
      const data = await getReport(reportId);
      // Ensure we have correct structure
      if (data.data) {
        setReport(data.data);
      } else {
        setError('Report load failed');
      }
    } catch (err) {
      setError('Error loading report');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (reportId: string) => {
    if (!isAuthenticated) {
      return navigate('/login');
    }
    
    try {
       const res = await upvoteReport(reportId);
       if (res.success) {
         setReport(res.data);
       }
    } catch (err) {
       console.error(err);
    }
  };

  const handleComment = async (reportId: string, text: string) => {
      if (!isAuthenticated) return navigate('/login');
      try {
          const res = await addComment(reportId, text);
          if (res.success) {
            // Reload to get fresh comments with populated user
             loadReport(reportId);
          }
      } catch (err) {
          console.error(err);
      }
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
       <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (error || !report) return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col items-center justify-center gap-4">
          <p className="text-gray-500">{error || 'Report not found'}</p>
          <button onClick={() => navigate('/feed')} className="text-primary hover:underline">Go Home</button>
      </div>
  );

  // Safely extract user
  const reportUser = report.user || {};
  const userName = reportUser.name || "Anonymous";
  const userHandle = reportUser.username ? `@${reportUser.username}` : `@${userName.toLowerCase().replace(/\s/g, '')}`;
  const userAvatar = (reportUser.avatar && reportUser.avatar !== 'no-photo.jpg') ? reportUser.avatar : `https://api.dicebear.com/7.x/initials/svg?seed=${userName}`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors font-bold">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">Report Details</h1>
      </div>

      <div className="max-w-3xl mx-auto pt-4 px-0 md:px-4">
        <FeedItem 
            id={report._id}
            userId={reportUser?._id || (reportUser as any)?.id || (typeof reportUser === 'string' ? reportUser : undefined)}
            user={{
                name: userName,
                handle: userHandle,
                time: (() => {
                  const date = new Date(report.createdAt);
                  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
                  let interval = seconds / 31536000;
                  if (interval > 1) return Math.floor(interval) + 'y ago';
                  interval = seconds / 2592000;
                  if (interval > 1) return Math.floor(interval) + 'mo ago';
                  interval = seconds / 86400;
                  if (interval > 1) return Math.floor(interval) + 'd ago';
                  interval = seconds / 3600;
                  if (interval > 1) return Math.floor(interval) + 'h ago';
                  interval = seconds / 60;
                  if (interval > 1) return Math.floor(interval) + 'm ago';
                  return 'Just now';
                })(),
                avatar: userAvatar
            }}
            category={report.category?.toUpperCase() || 'GENERAL'}
            tag={report.tags?.[0]}
            tags={report.tags}
            title={report.title}
            content={report.description}
            image={report.imageUrl && report.imageUrl !== 'no-photo.jpg' ? report.imageUrl : undefined}
            images={report.images}
            engagement={{ 
              likes: report.upvotes?.toString() || "0", 
              comments: report.comments ? report.comments.length.toString() : "0", 
              shares: report.shares?.toString() || "0" 
            }}
            status={report.status?.toUpperCase() || 'PENDING'}
            location={report.location?.formattedAddress}
            userLocation={null} 
            reportCoordinates={report.location?.coordinates}
            comments={report.comments?.map((c: any) => ({
                user: c.user?._id || c.user,
                userName: c.user?.name || 'User',
                userAvatar: c.user?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${c.user?.name || 'User'}`,
                text: c.text,
                createdAt: c.createdAt
            }))}
            isBookmarked={false} 
            isUpvoted={report.upvotedBy?.includes(user?.id || '')}
            currentUserId={user?.id}
            onVote={handleVote}
            onComment={handleComment}
            onShare={() => {}}
            onEdit={(id) => navigate(`/edit-report/${id}`)}
            onBookmark={() => {}}
            onTagClick={() => {}}
        />
      </div>
    </div>
  );
};

export default ReportDetailPage;
