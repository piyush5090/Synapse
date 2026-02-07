import { useState } from 'react';
import { Trash2, ShieldCheck, Loader2 } from 'lucide-react';

const SenderCard = ({ sender, onDelete }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteClick = async () => {
    // 1. Confirm First
    if (!window.confirm(`Remove connection for ${sender.email}?`)) return;
    
    setIsDeleting(true);
    // 2. Call Parent Handler
    await onDelete(sender.id);
    // 3. Stop loading (if delete failed and component is still mounted)
    setIsDeleting(false);
  };

  return (
    <div className="group flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all bg-white shadow-sm">
      <div className="flex items-center gap-3 overflow-hidden">
        {/* Icon */}
        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200">
          <ShieldCheck className="w-4 h-4" />
        </div>
        
        {/* Info */}
        <div className="truncate">
          <p className="text-sm font-bold text-slate-700 truncate">{sender.email}</p>
          <div className="flex items-center gap-2">
            <p className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 rounded">
              {sender.provider || 'SMTP'}
            </p>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest">********</p>
          </div>
        </div>
      </div>

      {/* Delete Action */}
      <button 
        onClick={handleDeleteClick}
        disabled={isDeleting}
        className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all active:scale-95"
        title="Remove Account"
      >
        {isDeleting ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
      </button>
    </div>
  );
};

export default SenderCard;