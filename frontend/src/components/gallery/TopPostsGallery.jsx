import { MousePointer2, Facebook, Instagram, Globe, Calendar } from 'lucide-react';

const TopPostsGallery = ({ posts }) => {
  
  const getPlatformIcon = (platform) => {
    switch (platform?.toLowerCase()) {
        case 'facebook': return <Facebook size={12} className="text-blue-600" />;
        case 'instagram': return <Instagram size={12} className="text-pink-600" />;
        default: return <Globe size={12} className="text-slate-400" />;
    }
  };

  // Helper to format date nicely (e.g., "Feb 12, 2:30 PM")
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col h-full overflow-hidden">
      
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
        <h3 className="text-sm font-bold text-slate-900">Top Performing</h3>
        <span className="text-[10px] font-bold text-slate-400 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
            By Clicks
        </span>
      </div>
      
      {/* Scrollable Gallery List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-slate-200">
        {posts.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <MousePointer2 size={24} className="mb-2 opacity-20" />
                No data yet.
            </div>
        ) : (
            posts.map((post, index) => (
            <div key={index} className="group relative bg-white border border-slate-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-purple-100 transition-all flex gap-3">
                
                {/* Rank Badge */}
                <div className={`absolute -top-2 -left-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shadow-sm border border-white ${
                    index === 0 ? 'bg-yellow-400 text-yellow-900' :
                    index === 1 ? 'bg-slate-300 text-slate-700' :
                    index === 2 ? 'bg-amber-600 text-amber-100' :
                    'bg-slate-100 text-slate-500'
                }`}>
                    #{index + 1}
                </div>

                {/* Image Thumbnail */}
                <div className="w-20 h-20 shrink-0 bg-slate-100 rounded-lg overflow-hidden relative">
                    {post.image_url ? (
                        <img src={post.image_url} alt="Post" className="w-full h-full object-cover" />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                            <Globe size={20} />
                        </div>
                    )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-slate-50 border border-slate-100 w-fit">
                                {getPlatformIcon(post.platform)}
                                <span className="text-[10px] font-bold text-slate-600 capitalize">{post.platform}</span>
                            </div>
                        </div>
                        <p className="text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed" title={post.caption}>
                            {post.caption || "No caption available"}
                        </p>
                    </div>

                    <div className="flex items-end justify-between mt-2">
                         {/* PUBLISHED AT DATE */}
                         <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded-md">
                            <Calendar size={10} />
                            <span>{formatDate(post.published_at)}</span>
                         </div>

                         {/* CLICK COUNT */}
                         <div className="text-right">
                             <span className="block text-xl font-black text-slate-900 leading-none">{post.count}</span>
                             <span className="text-[9px] font-bold text-slate-400 uppercase">Clicks</span>
                         </div>
                    </div>
                </div>
            </div>
            ))
        )}
      </div>
    </div>
  );
};

export default TopPostsGallery;