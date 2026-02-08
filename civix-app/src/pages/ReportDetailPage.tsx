
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { getReport, addComment, updateReport } from '../services/reportService';
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
      if (data.success) {
        setReport(data.data);
      } else {
        setError('Failed to load report');
      }
    } catch (err) {
      setError('Error loading report');
    } finally {
      setLoading(false);
    }
  };

  const handleVote = async (id: string) => {
    if (!isAuthenticated) return navigate('/login');
    
    const newUpvotes = (report.upvotes || 0) + 1;
    
    // Optimistic update
    setReport((prev: any) => ({
      ...prev,
      upvotes: newUpvotes
    }));

    try {
      await updateReport(id, { upvotes: newUpvotes } as any);
    } catch (err) {
      console.error("Failed to update vote", err);
      // Revert on failure
      setReport((prev: any) => ({
        ...prev,
        upvotes: (prev.upvotes || 0) - 1
      }));
    }
  };

  const handleComment = async (id: string, text: string) => {
    if (!isAuthenticated) return navigate('/login');
    try {
      const res = await addComment(id, text);
      if (res.success) {
          // Update state with new comment
          const newComment = res.data.comments[res.data.comments.length - 1];
          setReport((prev: any) => ({
              ...prev,
              comments: [...(prev.comments || []), newComment]
          }));
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
          <button onClick={() => navigate('/')} className="text-primary hover:underline">Go Home</button>
      </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-4 py-3 flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
        <h1 className="text-lg font-bold text-gray-900 dark:text-white truncate">Report Details</h1>
      </div>

      <div className="max-w-3xl mx-auto pt-4 px-0 md:px-4">
        <FeedItem 
            id={report._id}
            userId={report.user?._id || report.user} // report.user might be populated object or id string depending on API
            user={{
                name: report.user?.name || "Anonymous",
                handle: `@${report.user?.name?.toLowerCase().replace(/\s/g, '') || "citizen"}`,
                time: new Date(report.createdAt).toLocaleDateString(),
                avatar: report.user?.avatar || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100" // Fallback similar to HomeFeed
            }}
            category={report.category?.toUpperCase() || 'GENERAL'}
            tag={report.tags?.[0]}
            tags={report.tags}
            title={report.title}
            content={report.description}
            image={report.imageUrl !== 'no-photo.jpg' ? report.imageUrl : undefined} // Use imageUrl consistent with HomeFeed
            images={report.images}
            engagement={{ 
              likes: report.upvotes?.toString() || "0", 
              comments: report.comments?.length.toString() || "0", 
              shares: report.shares?.toString() || "0" 
            }}
            status={report.status?.toUpperCase() || 'PENDING'}
            location={report.location?.formattedAddress}
            userLocation={null} 
            reportCoordinates={report.location?.coordinates}
            comments={report.comments}
            isBookmarked={false} 
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
