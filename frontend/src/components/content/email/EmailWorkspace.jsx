import { useEffect, useState } from 'react';
import api from '../../../services/api';

// Child Components
import EmailAIGenerator from './EmailAIGenerator';
import EmailManualBuilder from './EmailManualBuilder';
import EmailTemplateGallery from '../../gallery/EmailTemplateGallery';

const EmailWorkspace = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // --- Pagination State ---
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 9; // Number of items per page

  // --- Fetch Logic ---
  const fetchTemplates = async (pageNum = 1) => {
    // Only show full loader on first page
    if (pageNum === 1) setLoading(true);

    try {
      const res = await api.get(`/email/templates?page=${pageNum}&limit=${LIMIT}`);
      
      if (res.data.success) {
        const newData = res.data.data;

        if (pageNum === 1) {
          setTemplates(newData); // Replace all
        } else {
          setTemplates((prev) => [...prev, ...newData]); // Append
        }

        // If we got fewer items than the limit, we've reached the end
        if (newData.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      }
    } catch (err) {
      console.error("Failed to load email templates", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    fetchTemplates(1);
  }, []);

  // --- Handlers ---

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchTemplates(nextPage);
  };

  const handleNewTemplate = (newTemplate) => {
    setTemplates((prev) => [newTemplate, ...prev]);
  };

  const handleDelete = (deletedId) => {
    setTemplates((prev) => prev.filter((t) => t.id !== deletedId));
  };

  return (
    <div className="space-y-12">
      {/* Generators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <EmailAIGenerator onCreated={handleNewTemplate} />
        <EmailManualBuilder onCreated={handleNewTemplate} />
      </div>

      {/* Gallery with Pagination */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-emerald-500 rounded-full"></span>
          Saved Email Templates
        </h3>
        
        <EmailTemplateGallery 
          templates={templates} 
          loading={loading} 
          onDeleted={handleDelete}
          // Pagination Props
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </div>
  );
};

export default EmailWorkspace;