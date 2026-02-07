import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Loader2, ArrowDownCircle } from 'lucide-react';
import api from '../services/api';
import ScheduledCampaignCard from '../cards/ScheduledCampaignCard';

const EmailCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 3; // Show 3 items per page on dashboard

  // --- Fetch Logic ---
  const fetchCampaigns = async (pageNum = 1) => {
    if (pageNum === 1) setLoading(true);
    try {
      const res = await api.get(`/email/campaigns?page=${pageNum}&limit=${LIMIT}`);
      if (res.data.success) {
        const newData = res.data.data;
        if (pageNum === 1) {
          setCampaigns(newData);
        } else {
          setCampaigns(prev => [...prev, ...newData]);
        }
        setHasMore(newData.length === LIMIT);
      }
    } catch (err) {
      console.error("Failed to load campaigns", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCampaigns(nextPage);
  };

  const handleDelete = async (id) => {
    try {
      const res = await api.delete(`/email/campaigns/${id}`);
      if (res.data.success) {
        setCampaigns(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Failed to delete campaign");
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-sky-50 rounded-lg">
            <Mail size={20} className="text-sky-600"/>
          </div>
          <h2 className="text-xl font-bold text-slate-800">Email Campaigns</h2>
        </div>
        <Link to="/email-campaigns" className="flex items-center gap-1 text-sm font-medium text-slate-500 hover:text-indigo-600 transition-colors">
            Manage Campaigns <ArrowRight size={16} />
        </Link>
      </div>

      {/* List Container */}
      <div className="space-y-3">
        {loading && page === 1 ? (
          /* Loading Skeleton */
          [1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-white border border-slate-100 rounded-xl animate-pulse"></div>
          ))
        ) : campaigns.length === 0 ? (
          /* Empty State */
          <div className="p-8 text-center bg-white border border-slate-100 rounded-xl border-dashed">
            <p className="text-sm text-slate-400">No active campaigns.</p>
            <Link to="/email-campaigns" className="text-sm font-bold text-indigo-600 hover:underline mt-1 block">
              Create your first blast
            </Link>
          </div>
        ) : (
          /* Campaign Cards */
          campaigns.map(camp => (
            <ScheduledCampaignCard 
              key={camp.id} 
              campaign={camp} 
              onDelete={handleDelete}
            />
          ))
        )}

        {/* Load More Button */}
        {hasMore && !loading && campaigns.length > 0 && (
          <button 
            onClick={handleLoadMore}
            className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-indigo-600 hover:bg-white bg-slate-50 rounded-xl border border-dashed border-slate-200 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowDownCircle className="w-3 h-3" />}
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default EmailCampaigns;