import { useSelector } from 'react-redux';
import { X, Trash2, Facebook, Instagram, Globe, Clock, Calendar } from 'lucide-react';

const ScheduledPostModal = ({ isOpen, onClose, post, onDelete }) => {
  
  // --- Platform Lookup ---
  const { social_accounts } = useSelector((state) => state.user);
  const foundAccount = social_accounts.find(acc => acc.id === post?.social_account_id);
  const platformName = foundAccount?.platform || 'Unknown';
  const platformId = foundAccount?.platform_account_id || 'N/A';

  // --- Handlers ---
  const handleDelete = () => {
    if (window.confirm("Cancel this schedule? This will remove it from the queue.")) {
      onDelete(post.id);
      onClose();
    }
  };

  // --- Helper Icons ---
  const getPlatformIcon = (p) => {
    switch (p?.toLowerCase()) {
        case 'facebook': return <Facebook className="text-blue-600" size={20} />;
        case 'instagram': return <Instagram className="text-pink-600" size={20} />;
        default: return <Globe className="text-slate-400" size={20} />;
    }
  };

  if (!isOpen || !post) return null;

  // --- Data Prep ---
  const imageUrl = post.image_url || post.generated_posts?.image_url;
  const caption = post.caption || post.generated_posts?.caption;
  
  // Format Date for Display
  const dateObj = new Date(post.scheduled_time);
  const dateStr = dateObj.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[70vh] flex overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button 
            onClick={onClose} 
            className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full text-slate-500 hover:text-slate-900 shadow-sm transition-all"
        >
            <X size={20} />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
            
            {/* LEFT: Image Section */}
            <div className="bg-slate-100 flex items-center justify-center relative">
                {imageUrl ? (
                    <img src={imageUrl} alt="Scheduled" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-slate-400 text-sm">No Image</span>
                )}
                
                {/* Status Badge */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${
                    post.status === 'published' ? 'bg-green-100 text-green-700 border-green-200' :
                    post.status === 'failed' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                    {post.status}
                </div>
            </div>

            {/* RIGHT: Info Section */}
            <div className="flex flex-col h-full bg-white">
                
                {/* Header */}
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-bold text-slate-900">Scheduled Post Details</h2>
                    <div className="flex items-center gap-2 mt-2 bg-slate-50 p-2 rounded-lg border border-slate-100 w-fit">
                        {getPlatformIcon(platformName)}
                        <div className="flex flex-col">
                            <span className="text-xs font-bold text-slate-700 capitalize">{platformName}</span>
                            <span className="text-[10px] text-slate-400">ID: {platformId}</span>
                        </div>
                    </div>
                </div>

                {/* Body Content */}
                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    
                    {/* Time Display (Read Only) */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Scheduled For</label>
                        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-100 rounded-xl text-amber-900">
                            <div className="bg-white p-2 rounded-lg shadow-sm">
                                <Calendar size={18} className="text-amber-600" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">{dateStr}</p>
                                <p className="text-xs opacity-80 flex items-center gap-1">
                                    <Clock size={10} /> {timeStr}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Caption Display */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Caption</label>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed max-h-[200px] overflow-y-auto font-medium">
                            {caption || <span className="italic text-slate-400">No caption provided.</span>}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <button 
                        onClick={handleDelete} 
                        className="px-4 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-2 border border-transparent hover:border-red-100"
                    >
                        <Trash2 size={16} /> Cancel Schedule
                    </button>

                    <button 
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 bg-white text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledPostModal;