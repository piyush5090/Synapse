import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSocialAccounts } from '../features/user/userSlice';
import api from '.././services/api';
import { Share2, Plus, Trash2, Facebook, Instagram } from 'lucide-react';
import MetaConnectModal from '../components/modals/MetaConnectModal';

const MetaConnectionCard = () => {
  const dispatch = useDispatch();
  const { business, social_accounts } = useSelector((state) => state.user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- ACTIONS ---
  const handleDisconnect = async () => {
    if (!business?.id) return;
    if (!window.confirm("Are you sure? This will disconnect all social assets.")) return;

    try {
        await api.delete(`/meta/${business.id}`);
        dispatch(setSocialAccounts([]));
    } catch (err) {
        console.error("Disconnect Failed", err);
        alert("Failed to disconnect accounts.");
    }
  };

  // Callback for when modal succeeds
  const handleSuccess = (newAccounts) => {
    dispatch(setSocialAccounts(newAccounts));
    setIsModalOpen(false);
  };

  return (
    <>
      <div className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] transition-all hover:shadow-[0_8px_24px_rgba(0,0,0,0.04)]">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-50 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-sm ring-1 ring-blue-100">
              <Share2 size={20} />
            </div>
            <div>
               <h3 className="font-bold text-slate-900 leading-tight">Meta Accounts</h3>
               <p className="text-[10px] font-medium text-slate-500 uppercase tracking-wider">Integration Status</p>
            </div>
          </div>
          
          {social_accounts && social_accounts.length > 0 ? (
             <div
                onClick={handleDisconnect}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-red-100 bg-red-50 text-red-500 shadow-sm transition-all hover:bg-red-100 hover:border-red-200 active:scale-95 cursor-pointer"
                title="Disconnect All Assets"
             >
                <Trash2 size={16} />
             </div>
          ) : (
             <button 
                onClick={() => setIsModalOpen(true)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 shadow-sm transition-all hover:border-blue-200 hover:text-blue-600 active:scale-95"
                title="Add Connection"
             >
                <Plus size={16} />
             </button>
          )}
        </div>

        {/* Content Body */}
        <div className="flex-1 p-5">
          {!social_accounts || social_accounts.length === 0 ? (
             /* --- EMPTY STATE --- */
             <div className="flex h-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50/50 py-8 text-center transition-colors group-hover:border-blue-200 group-hover:bg-blue-50/20">
                <div className="mb-3 rounded-full bg-white p-3 shadow-sm ring-1 ring-slate-100">
                    <Share2 size={24} className="text-slate-300" />
                </div>
                <h4 className="text-sm font-semibold text-slate-900">No Assets Linked</h4>
                <p className="mb-5 max-w-[180px] text-xs text-slate-500">
                    Connect Facebook & Instagram to enable auto-posting.
                </p>
                <button onClick={() => setIsModalOpen(true)} className="inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-700 shadow-sm transition-all hover:border-blue-300 hover:text-blue-600 hover:shadow-md">
                    <Plus size={14} /> Initialize Connection
                </button>
             </div>
          ) : (
             /* --- CONNECTED STATE --- */
             <div className="space-y-3">
                 {social_accounts.map((acc, i) => {
                     const isInstagram = acc.platform === 'instagram';
                     return (
                         <div key={i} className="flex items-center justify-between rounded-xl border border-slate-100 bg-white p-3 shadow-sm transition-all hover:border-blue-100 hover:shadow-md">
                             <div className="flex items-center gap-3">
                                 <div className={`flex h-10 w-10 items-center justify-center rounded-full ${isInstagram ? 'bg-pink-50 text-pink-600 ring-1 ring-pink-100' : 'bg-blue-50 text-blue-600 ring-1 ring-blue-100'}`}>
                                     {isInstagram ? <Instagram size={18} /> : <Facebook size={18} />}
                                 </div>
                                 <div className="overflow-hidden">
                                     <p className="text-sm font-bold text-slate-700 truncate max-w-[140px]">
                                         {acc.account_name}
                                     </p>
                                     <div className="flex items-center gap-1.5">
                                         <span className={`text-[10px] font-bold uppercase tracking-wider ${isInstagram ? 'text-pink-500' : 'text-blue-500'}`}>
                                            {isInstagram ? 'Instagram' : 'Facebook'}
                                         </span>
                                         <span className="text-[10px] text-slate-300">•</span>
                                         <span className="text-[10px] font-mono text-slate-400 truncate max-w-[80px]">
                                            ID: {acc.account_id}
                                         </span>
                                     </div>
                                 </div>
                             </div>
                             
                             <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-100 shrink-0">
                                 <span className="relative flex h-1.5 w-1.5">
                                   <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                   <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                                 </span>
                                 Live
                             </div>
                         </div>
                     );
                 })}
                 <div className="pt-2 text-center">
                    <p className="text-[10px] text-slate-400">
                        {social_accounts.length} asset{social_accounts.length !== 1 && 's'} active.
                    </p>
                 </div>
             </div>
          )}
        </div>
      </div>

      <MetaConnectModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        businessId={business?.id}
        onSuccess={handleSuccess}
      />
    </>
  );
};

export default MetaConnectionCard;