import { useEffect, useState } from 'react';
import { X, Calendar, Clock, User, ShieldCheck, FileText, CheckCircle, AlertOctagon, Timer, Loader2, Users } from 'lucide-react';

const ViewCampaignModal = ({ isOpen, onClose, campaign }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Animation Logic
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender || !campaign) return null;

  const getStatusBadge = (status) => {
    switch(status) {
      case 'sent': 
      case 'success': return <span className="flex items-center gap-1.5 text-xs uppercase font-bold px-2.5 py-1 rounded-full border bg-emerald-100 text-emerald-700 border-emerald-200"><CheckCircle className="w-3.5 h-3.5"/> Sent</span>;
      case 'pending': return <span className="flex items-center gap-1.5 text-xs uppercase font-bold px-2.5 py-1 rounded-full border bg-amber-100 text-amber-700 border-amber-200"><Timer className="w-3.5 h-3.5"/> Pending</span>;
      case 'processing': return <span className="flex items-center gap-1.5 text-xs uppercase font-bold px-2.5 py-1 rounded-full border bg-blue-100 text-blue-700 border-blue-200"><Loader2 className="w-3.5 h-3.5 animate-spin"/> Sending</span>;
      case 'failed': return <span className="flex items-center gap-1.5 text-xs uppercase font-bold px-2.5 py-1 rounded-full border bg-red-100 text-red-700 border-red-200"><AlertOctagon className="w-3.5 h-3.5"/> Failed</span>;
      default: return <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">{status}</span>;
    }
  };

  const recipients = campaign.recipients || [];
  const template = campaign.email_templates || {};
  const sender = campaign.sender_emails || {};
  
  // Format Date
  const dateObj = new Date(campaign.scheduled_at);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 shrink-0">
          <div className="space-y-1">
             <div className="flex items-center gap-3">
               <h3 className="font-bold text-lg text-slate-800">Campaign Details</h3>
               {getStatusBadge(campaign.status)}
             </div>
             <p className="text-sm text-slate-500 font-medium">ID: <span className="font-mono text-xs text-slate-400">{campaign.id.substring(0,8)}...</span></p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-200">
          
          {/* 1. Meta Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><Calendar className="w-3 h-3"/> Scheduled For</span>
                <p className="text-sm font-bold text-slate-800">{dateStr} at {timeStr}</p>
             </div>
             <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase flex items-center gap-1.5"><ShieldCheck className="w-3 h-3"/> Sender Identity</span>
                <p className="text-sm font-bold text-slate-800 truncate" title={sender.email}>{sender.email || "Unknown"}</p>
             </div>
          </div>

          {/* 2. Content Summary */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2 border-b border-slate-100 pb-2">
              <FileText className="w-4 h-4 text-indigo-500" /> Email Content
            </h4>
            <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-2">
               <div>
                 <span className="text-xs font-bold text-slate-400 uppercase">Subject Line</span>
                 <p className="text-sm font-semibold text-slate-800">{template.subject || "No Subject"}</p>
               </div>
               
               {/* Mini Preview Box */}
               <div>
                  <span className="text-xs font-bold text-slate-400 uppercase">Body Preview</span>
                  <div className="mt-1 p-3 bg-slate-50 rounded-lg text-xs text-slate-600 line-clamp-3 font-mono border border-slate-100">
                    {(template.content || "").replace(/<[^>]*>?/gm, '').substring(0, 200)}...
                  </div>
               </div>
            </div>
          </div>

          {/* 3. Recipients List */}
          <div className="space-y-3">
             <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                <h4 className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-500" /> Recipient List
                </h4>
                <span className="text-xs font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-100">
                  {recipients.length} Total
                </span>
             </div>
             
             <div className="max-h-48 overflow-y-auto border border-slate-200 rounded-xl bg-slate-50/30 scrollbar-thin scrollbar-thumb-slate-200">
               <div className="divide-y divide-slate-100">
                 {recipients.map((email, idx) => (
                   <div key={idx} className="px-4 py-2.5 text-xs text-slate-600 font-mono hover:bg-white transition-colors flex items-center gap-3">
                     <span className="text-slate-300 w-4 text-right">{idx + 1}.</span>
                     {email}
                   </div>
                 ))}
               </div>
             </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewCampaignModal;