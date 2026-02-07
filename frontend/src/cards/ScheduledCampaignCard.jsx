import { useState } from 'react';
import { Calendar, Clock, Loader2, CheckCircle, AlertOctagon, Timer, Trash2 } from 'lucide-react';
import ViewCampaignModal from '../components/modals/ViewCampaignModal';

const ScheduledCampaignCard = ({ campaign, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(false); // Modal State

  const handleDeleteClick = async (e) => {
    e.stopPropagation(); // Stop click from bubbling to the card
    if (!window.confirm("Are you sure you want to delete this campaign?")) return;
    
    setIsDeleting(true);
    await onDelete(campaign.id);
    setIsDeleting(false);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'sent': 
      case 'success':
        return <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle className="w-3 h-3"/> Sent</span>;
      case 'pending': 
        return <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border bg-amber-100 text-amber-700 border-amber-200"><Timer className="w-3 h-3"/> Pending</span>;
      case 'processing': 
        return <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border bg-blue-100 text-blue-700 border-blue-200"><Loader2 className="w-3 h-3 animate-spin"/> Sending</span>;
      case 'failed': 
        return <span className="flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border bg-red-100 text-red-700 border-red-200"><AlertOctagon className="w-3 h-3"/> Failed</span>;
      default: return <span className="text-[10px] uppercase font-bold text-slate-400">{status}</span>;
    }
  };

  return (
    <>
      <div 
        onClick={() => setIsViewOpen(true)}
        className="p-4 border border-slate-100 rounded-xl hover:border-indigo-200 hover:bg-slate-50/50 transition-all bg-white shadow-sm group relative cursor-pointer"
      >
        {/* Header: Subject & Status */}
        <div className="flex justify-between items-start mb-2 pr-8">
          <h4 className="font-bold text-slate-800 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors" title={campaign.email_templates?.subject}>
            {campaign.email_templates?.subject || "No Subject"}
          </h4>
          {getStatusBadge(campaign.status)}
        </div>

        {/* Meta Data */}
        <div className="flex items-center gap-4 text-xs text-slate-500">
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
             <Calendar className="w-3 h-3 text-slate-400" /> {new Date(campaign.scheduled_at).toLocaleDateString()}
          </span>
          <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded border border-slate-100">
             <Clock className="w-3 h-3 text-slate-400" /> {new Date(campaign.scheduled_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </span>
        </div>

        {/* Delete Button (Always Visible, z-index ensures it sits above card click) */}
        <button 
          onClick={handleDeleteClick}
          disabled={isDeleting || campaign.status === 'processing'}
          className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50 z-10"
          title="Delete Campaign"
        >
          {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Campaign Detail Modal */}
      <ViewCampaignModal 
        isOpen={isViewOpen} 
        onClose={() => setIsViewOpen(false)} 
        campaign={campaign}
      />
    </>
  );
};

export default ScheduledCampaignCard;