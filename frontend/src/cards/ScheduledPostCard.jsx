import { useSelector } from 'react-redux';
import { Trash2, Calendar, Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const ScheduledPostCard = ({ data, onDelete }) => {
  
  // 1. Get Social Accounts from Redux to lookup platform details
  const { social_accounts } = useSelector((state) => state.user);

  // 2. Find the specific account for this scheduled post
  const foundAccount = social_accounts.find(acc => acc.id === data.social_account_id);
  
  // 3. Determine Platform Name (Fallback to 'Unknown' if not found yet)
  const platformName = foundAccount?.platform || 'Unknown';

  // Format Date
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  };

  // Helper for Platform Icon
  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
        case 'facebook': return <Facebook size={14} className="text-blue-600" />;
        case 'instagram': return <Instagram size={14} className="text-pink-600" />;
        case 'linkedin': return <Linkedin size={14} className="text-blue-700" />;
        case 'twitter': return <Twitter size={14} className="text-sky-500" />;
        default: return <span className="text-[10px] font-bold text-slate-400">SOCIAL</span>;
    }
  };

  // Safe access to joined data (Image/Caption usually come from the generated post join)
  const imageUrl = data.image_url || data.generated_posts?.image_url;
  const caption = data.caption || data.generated_posts?.caption;

  return (
    <div className="group bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col relative">
      
      {/* Delete Action */}
      <button 
        onClick={() => onDelete(data.id)}
        className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
        title="Cancel Schedule"
      >
        <Trash2 size={14} />
      </button>

      {/* Image Header */}
      <div className="relative h-40 bg-slate-100">
        {imageUrl ? (
          <img src={imageUrl} className="w-full h-full object-cover" alt="Scheduled" />
        ) : (
          <div className="flex items-center justify-center h-full text-slate-300 text-xs font-medium">No Image</div>
        )}
        
        {/* Date Badge */}
        <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-md text-white px-2 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1.5 shadow-sm">
          <Calendar size={10} />
          {formatDate(data.scheduled_time)}
        </div>
      </div>

      {/* Content Body */}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Caption */}
        <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed" title={caption}>
          {caption || "No caption provided."}
        </p>
        
        {/* Footer: Platform & Status */}
        <div className="mt-auto border-t border-slate-100 pt-3 flex items-center justify-between">
           
           {/* Platform Icon (Dynamic Lookup) */}
           <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              {getPlatformIcon(platformName)}
              <span className="text-[10px] font-bold text-slate-600 capitalize">{platformName}</span>
           </div>

           {/* Status Badge */}
           <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
              data.status === 'published' 
                ? 'bg-green-50 text-green-700 border-green-100' 
                : data.status === 'failed'
                ? 'bg-red-50 text-red-700 border-red-100'
                : 'bg-amber-50 text-amber-700 border-amber-100'
           }`}>
              {data.status}
           </span>
        </div>
      </div>
    </div>
  );
};

export default ScheduledPostCard;