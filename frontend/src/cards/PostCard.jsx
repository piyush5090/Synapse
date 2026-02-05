import { Image as ImageIcon, Calendar, Clock, MoreHorizontal, Trash2 } from 'lucide-react';

const PostCard = ({ type = 'generated', data, onDelete }) => {
  const statusColor = {
    pending: "bg-amber-100 text-amber-700",
    published: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  const formattedDate = new Date(data.created_at || data.scheduled_time).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  });

  return (
    <div className="group relative flex flex-col rounded-xl border border-[#E5E5E5] bg-white p-3 transition-all hover:shadow-md h-full">
      {/* Delete Button (Visible on Hover) */}
      <button 
         onClick={(e) => { e.stopPropagation(); onDelete(data.id); }}
         className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 text-slate-400 opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-50 transition-all shadow-sm"
         title="Delete"
      >
         <Trash2 size={14} />
      </button>

      {/* Image Preview */}
      <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-[#FAFAFA] border border-slate-100">
        {data.image_url ? (
            <img src={data.image_url} alt="Post" className="h-full w-full object-cover" />
        ) : (
            <div className="flex h-full w-full items-center justify-center text-[#CCC]">
                <ImageIcon size={24} />
            </div>
        )}
        
        {/* Status Badge (For Scheduled) */}
        {type === 'scheduled' && (
            <div className={`absolute bottom-2 left-2 rounded-md px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider ${statusColor[data.status] || "bg-gray-100 text-gray-700"}`}>
                {data.status}
            </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-between space-y-2">
        <p className="text-xs font-medium text-[#111] line-clamp-2 leading-relaxed" title={data.caption}>
            {data.caption || "No caption generated..."}
        </p>
        
        {/* Metadata */}
        <div className="flex items-center gap-2 text-[10px] text-[#888] pt-2 border-t border-slate-50">
            {type === 'scheduled' ? (
                <>
                    <Calendar size={12} />
                    <span>{formattedDate}</span>
                </>
            ) : (
                <>
                    <Clock size={12} />
                    <span>Created {formattedDate}</span>
                </>
            )}
        </div>
      </div>
    </div>
  );
};

export default PostCard;