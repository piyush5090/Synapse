import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { X, Calendar, Trash2, Loader2, Facebook, Instagram, Linkedin, Twitter, Clock, Globe } from 'lucide-react';

const ScheduledPostModal = ({ isOpen, onClose, post, onDelete, onUpdate }) => {
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  
  // Platform Lookup
  const { social_accounts } = useSelector((state) => state.user);
  const foundAccount = social_accounts.find(acc => acc.id === post?.social_account_id);
  const platformName = foundAccount?.platform || 'Unknown';
  const platformId = foundAccount?.platform_account_id || 'N/A';

  useEffect(() => {
    if (post?.scheduled_time) {
      // Format for datetime-local input (YYYY-MM-DDTHH:mm)
      const date = new Date(post.scheduled_time);
      const localIso = new Date(date.getTime() - (date.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
      setScheduledTime(localIso);
    }
  }, [post]);

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const isoDate = new Date(scheduledTime).toISOString();
      
      // 1. API Call
      await api.put(`/scheduler/${post.id}`, { scheduled_time: isoDate });
      
      // 2. Parent Update
      if (onUpdate) onUpdate({ ...post, scheduled_time: isoDate });

      alert("Schedule time updated.");
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update schedule.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Cancel this schedule? This will remove it from the queue.")) {
      onDelete(post.id);
      onClose();
    }
  };

  // Helper Icon
  const getPlatformIcon = (p) => {
    switch (p?.toLowerCase()) {
        case 'facebook': return <Facebook className="text-blue-600" size={20} />;
        case 'instagram': return <Instagram className="text-pink-600" size={20} />;
        default: return <Globe className="text-slate-400" size={20} />;
    }
  };

  if (!isOpen || !post) return null;

  // Safe data access
  const imageUrl = post.image_url || post.generated_posts?.image_url;
  const caption = post.caption || post.generated_posts?.caption;
  const isPending = post.status === 'pending';

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-4xl h-[70vh] flex overflow-hidden shadow-2xl relative">
        
        <button onClick={onClose} className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full text-slate-500 hover:text-slate-900 shadow-sm transition-all"><X size={20} /></button>

        <div className="grid grid-cols-1 md:grid-cols-2 w-full h-full">
            
            {/* LEFT: Image */}
            <div className="bg-slate-100 flex items-center justify-center relative">
                {imageUrl ? (
                    <img src={imageUrl} alt="Scheduled" className="w-full h-full object-cover" />
                ) : (
                    <span className="text-slate-400 text-sm">No Image</span>
                )}
                {/* Status Badge Overlay */}
                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide shadow-sm border ${
                    post.status === 'published' ? 'bg-green-100 text-green-700 border-green-200' :
                    post.status === 'failed' ? 'bg-red-100 text-red-700 border-red-200' :
                    'bg-amber-100 text-amber-700 border-amber-200'
                }`}>
                    {post.status}
                </div>
            </div>

            {/* RIGHT: Info */}
            <div className="flex flex-col h-full bg-white">
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

                <div className="flex-1 p-6 overflow-y-auto space-y-6">
                    {/* Time Picker */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block flex justify-between">
                            <span>Scheduled For</span>
                            {!isPending && <span className="text-red-500 font-normal normal-case">Not editable ({post.status})</span>}
                        </label>
                        <div className="relative">
                            <input 
                                type="datetime-local"
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                disabled={!isPending} 
                                className="w-full p-3 pl-10 rounded-xl border border-slate-200 text-sm text-slate-700 focus:ring-2 focus:ring-amber-500/50 outline-none disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed transition-all"
                            />
                            <Clock size={16} className="absolute left-3 top-3.5 text-slate-400" />
                        </div>
                    </div>

                    {/* Read-Only Caption */}
                    <div>
                        <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Caption Preview</label>
                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-sm text-slate-600 leading-relaxed max-h-[150px] overflow-y-auto">
                            {caption || <span className="italic text-slate-400">No caption provided.</span>}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <button onClick={handleDelete} className="px-4 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-2">
                        <Trash2 size={16} /> Cancel Schedule
                    </button>

                    {isPending && (
                        <button 
                            onClick={handleUpdate}
                            disabled={isSaving}
                            className="px-6 py-2.5 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-slate-800 shadow-lg shadow-slate-900/10 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Calendar size={16} />}
                            Update Time
                        </button>
                    )}
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ScheduledPostModal;