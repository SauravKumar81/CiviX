import React, { useEffect, useState } from 'react';
import { Hash } from 'lucide-react';
import axios from 'axios';

interface TrendingTag {
  tag: string;
  count: number;
}

interface TrendingTagsProps {
  onTagClick?: (tag: string) => void;
  activeTag?: string | null;
}

const TrendingTags: React.FC<TrendingTagsProps> = ({ onTagClick, activeTag }) => {
  const [tags, setTags] = useState<TrendingTag[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/reports/tags/trending`);
        if (res.data.success) {
          setTags(res.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch trending tags', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  if (loading || tags.length === 0) return null;

  return (
    <div className="mb-6 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="flex items-center gap-2 px-1">
        <Hash className="w-4 h-4 text-primary" />
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Trending Now</h3>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <button
            key={t.tag}
            onClick={() => onTagClick?.(t.tag)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border flex items-center gap-2 ${
              activeTag === t.tag
                ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border-gray-100 dark:border-gray-800 hover:border-primary/30 hover:bg-primary/5'
            }`}
          >
            <span>#{t.tag}</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[9px] ${
              activeTag === t.tag 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
            }`}>
              {t.count}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default TrendingTags;
