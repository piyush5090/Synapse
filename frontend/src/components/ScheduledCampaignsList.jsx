import { useState, useEffect } from 'react';
import api from '../services/api';
import ScheduledCampaignCard from '../cards/ScheduledCampaignCard';
import { Loader2, RefreshCw, Send, ArrowDownCircle } from 'lucide-react';

const ScheduledCampaignsList = ({ refreshTrigger }) => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // --- Fetch Logic ---
  const fetchCampaigns = async (pageNum = 1, reset = false) => {
    if (pageNum === 1) setLoading(true);
    try {
      const res = await api.get(`/email/campaigns?page=${pageNum}&limit=4`);
      if (res.data.success) {
        const newData = res.data.data;
        setCampaigns(prev => reset ? newData : [...prev, ...newData]);
        setHasMore(newData.length === 4);
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  useEffect(() => {
    setPage(1);
    fetchCampaigns(1, true);
  }, [refreshTrigger]);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCampaigns(nextPage, false);
  };

  // --- Delete Logic ---
  const handleDeleteCampaign = async (id) => {
    try {
      const res = await api.delete(`/email/campaigns/${id}`);
      if (res.data.success) {
        // Remove from list immediately
        setCampaigns(prev => prev.filter(c => c.id !== id));
      }
    } catch (err) {
      alert("Failed to delete campaign.");
      console.error(err);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full min-h-[400px]">
      {/* Header */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <Send className="w-4 h-4 text-indigo-600"/> Campaign Queue
        </h3>
        <button 
          onClick={() => fetchCampaigns(1, true)} 
          className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors" 
          title="Refresh List"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-slate-200">
        {loading && page === 1 && campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 gap-2 text-slate-400">
             <Loader2 className="w-6 h-6 animate-spin text-indigo-400" />
             <span className="text-xs">Loading queue...</span>
          </div>
        ) : campaigns.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400 text-sm">
            <Send className="w-8 h-8 mb-2 opacity-20" />
            No campaigns scheduled yet.
          </div>
        ) : (
          campaigns.map(camp => (
            <ScheduledCampaignCard 
              key={camp.id} 
              campaign={camp} 
              onDelete={handleDeleteCampaign} 
            />
          ))
        )}

        {/* Load More */}
        {hasMore && campaigns.length > 0 && (
          <button 
            onClick={handleLoadMore} 
            disabled={loading}
            className="w-full py-2.5 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg flex justify-center items-center gap-2 border border-dashed border-indigo-100 mt-2"
          >
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowDownCircle className="w-3 h-3" />} 
            Load More History
          </button>
        )}
      </div>
    </div>
  );
};

export default ScheduledCampaignsList;