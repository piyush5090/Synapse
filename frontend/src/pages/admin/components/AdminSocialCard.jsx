import { FileImage, Ban, Trash2 } from 'lucide-react';

const AdminSocialCard = ({ post, onDelete, onBanUser }) => {
  // Ensure profile exists (even if deleted)
  const profile = post.profiles || { email: 'Deleted User', is_banned: false, id: null };

  return (
    <div className="p-6 flex items-start gap-6 hover:bg-slate-50/50 transition-colors group">
      {/* Thumbnail */}
      <div className="w-24 h-24 bg-indigo-50 rounded-lg overflow-hidden shrink-0 border border-indigo-100">
        {post.image_url ? (
          <img src={post.image_url} alt="Post" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-indigo-300"><FileImage /></div>
        )}
      </div>
      
      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold text-indigo-600">{profile.email}</span>
              {profile.is_banned && <span className="bg-red-100 text-red-600 text-[10px] px-1 rounded font-bold">BANNED</span>}
            </div>
            
            <p className="text-sm font-medium text-slate-900 line-clamp-2 mb-2">
              {post.caption || <span className="italic text-slate-400">No Caption</span>}
            </p>
            
            {/* Context/Hashtags */}
            {post.hashtags && post.hashtags.length > 0 && (
               <div className="flex flex-wrap gap-1 mb-2">
                 {post.hashtags.slice(0, 3).map((tag, i) => (
                    <span key={i} className="text-[10px] bg-slate-100 text-slate-500 px-1.5 rounded">#{tag}</span>
                 ))}
               </div>
            )}
            
            <p className="text-xs text-slate-400 font-mono">
               Created: {new Date(post.created_at).toLocaleDateString()}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {profile.id && (
              <button 
                 onClick={() => onBanUser(profile.id, profile.is_banned)} 
                 className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                 title="Ban User"
              >
                <Ban size={16} />
              </button>
            )}
            <button 
               onClick={() => onDelete(post.id)} 
               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
               title="Delete Post"
            >
               <Trash2 size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSocialCard;