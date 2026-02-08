import { Mail, Ban, Trash2 } from 'lucide-react';

const AdminMailCard = ({ template, onDelete, onBanUser }) => {
  const profile = template.profiles || { email: 'Deleted User', is_banned: false, id: null };

  return (
    <div className="p-6 flex items-start gap-6 hover:bg-emerald-50/30 transition-colors group">
      {/* Thumbnail */}
      <div className="w-24 h-24 bg-emerald-50 rounded-lg overflow-hidden shrink-0 border border-emerald-100 relative">
        {template.image_url ? (
            <img src={template.image_url} alt="Mail" className="w-full h-full object-cover" />
        ) : (
            <div className="w-full h-full flex items-center justify-center text-emerald-300"><Mail /></div>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
               <span className="text-xs font-bold text-emerald-600">{profile.email}</span>
               {profile.is_banned && <span className="bg-red-100 text-red-600 text-[10px] px-1 rounded font-bold">BANNED</span>}
            </div>

            <h3 className="text-sm font-bold text-slate-900 mb-1">{template.subject || "No Subject"}</h3>
            
            <p className="text-xs text-slate-500 line-clamp-2 mb-2">
               {template.content || <span className="italic">No content</span>}
            </p>

            <p className="text-xs text-slate-400 font-mono">
               Created: {new Date(template.created_at).toLocaleDateString()}
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
               onClick={() => onDelete(template.id)} 
               className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
               title="Delete Template"
            >
               <Trash2 size={16}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMailCard;