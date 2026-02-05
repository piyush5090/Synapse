import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setBusiness } from '../features/user/userSlice';
import api from '../services/api';
import { Briefcase, Edit2, Plus, Globe, ArrowUpRight, X, Loader2, CheckCircle2, Trash2, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const BusinessProfileCard = ({ business }) => {
  const dispatch = useDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    website_url: ''
  });

  // Open Modal & Pre-fill if editing
  const handleOpenModal = () => {
    setError(null);
    if (business) {
      setFormData({
        name: business.name || '',
        description: business.description || '',
        website_url: business.website_url || ''
      });
    } else {
      setFormData({ name: '', description: '', website_url: '' });
    }
    setIsModalOpen(true);
  };

  // --- HANDLE SUBMIT (CREATE OR UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
        let response;
        if (business) {
            // EDIT MODE: PUT /api/business
            response = await api.put('/business', formData);
        } else {
            // CREATE MODE: POST /api/business
            response = await api.post('/business', formData);
        }

        // Update Redux Store
        if (response.data.business) {
            dispatch(setBusiness(response.data.business));
            setIsModalOpen(false);
        }

    } catch (err) {
        console.error("Business Save Failed:", err);
        setError(err.response?.data?.error || "Failed to save profile.");
    } finally {
        setLoading(false);
    }
  };

  // --- HANDLE DELETE ---
  const handleDelete = async () => {
    if (!window.confirm("Are you sure? This action cannot be undone.")) return;
    
    setLoading(true);
    try {
        // DELETE /api/business
        await api.delete('/business');
        
        // Clear from Redux
        dispatch(setBusiness(null));
        setLoading(false);
        setIsModalOpen(false);
        
    } catch (err) {
        console.error("Delete Failed:", err);
        setError(err.response?.data?.error || "Failed to delete profile.");
        setLoading(false);
    }
  };

  return (
    <>
      {/* --- CARD COMPONENT --- */}
      {!business ? (
        // EMPTY STATE
        <div className="group relative flex h-full min-h-[240px] flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-slate-300 bg-slate-200 text-center transition-all hover:border-indigo-300 hover:bg-indigo-50/30">
          <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
          <div className="relative z-10 p-8 flex flex-col items-center">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md shadow-slate-200 ring-1 ring-slate-900/5 transition-transform group-hover:scale-110 group-hover:rotate-3">
                <Plus size={32} className="text-slate-400 group-hover:text-indigo-600 transition-colors" />
              </div>
              <h3 className="mb-2 text-lg font-bold text-slate-900">Initialize Brand Identity</h3>
              <p className="mb-6 max-w-[200px] text-sm text-slate-500">
                Define your business profile to activate the content engine.
              </p>
              <button
                onClick={handleOpenModal}
                className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-xl shadow-slate-900/20 transition-all hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5"
              >
                <Briefcase size={16} />
                Create Profile
              </button>
          </div>
        </div>
      ) : (
        // FILLED STATE
        <div className="group relative flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-1 transition-all duration-300 hover:-translate-y-1 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)]">
          <div className="relative flex-1 p-5">
             <button 
                onClick={handleOpenModal}
                className="absolute top-4 right-4 p-2 rounded-lg bg-slate-50 text-slate-400 opacity-0 transition-all hover:bg-white hover:text-indigo-600 hover:shadow-md group-hover:opacity-100"
                title="Edit Profile"
             >
                <Edit2 size={16} />
             </button>

             <div className="flex items-start gap-4 mb-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-100 text-slate-700 shadow-sm">
                   <Briefcase size={24} strokeWidth={1.5} />
                </div>
                <div>
                   <h3 className="font-bold text-lg text-slate-900 leading-tight">{business.name}</h3>
                   <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50/50 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-sm">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                      </span>
                      System Active
                   </div>
                </div>
             </div>

             {business.description && (
                 <div className="relative pl-3 border-l-2 border-indigo-100 py-1">
                     <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                        "{business.description}"
                     </p>
                 </div>
             )}
          </div>

          {business.website_url && (
            <div className="mt-auto border-t border-slate-50 bg-slate-50/50 p-4 rounded-b-xl">
               <a
                  href={business.website_url.startsWith('http') ? business.website_url : `https://${business.website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/link flex items-center justify-between text-xs font-medium text-slate-500 hover:text-indigo-600 transition-colors"
               >
                  <div className="flex items-center gap-2">
                     <Globe size={14} className="text-slate-400 group-hover/link:text-indigo-500 transition-colors" />
                     <span className="truncate max-w-[200px]">{business.website_url}</span>
                  </div>
                  <ArrowUpRight size={14} className="opacity-50 group-hover/link:opacity-100 group-hover/link:translate-x-0.5 transition-all" />
               </a>
            </div>
          )}
        </div>
      )}

      {/* --- POPUP MODAL --- */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
            {/* Backdrop */}
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" 
                onClick={() => setIsModalOpen(false)} 
            />
            
            {/* Modal Content */}
            <motion.div 
                initial={{ scale: 0.95, opacity: 0, y: 10 }} 
                animate={{ scale: 1, opacity: 1, y: 0 }} 
                exit={{ scale: 0.95, opacity: 0, y: 10 }}
                className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5"
            >
                {/* Header */}
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-sm">
                            <Briefcase size={16} />
                        </div>
                        <h3 className="font-bold text-slate-900">
                           {business ? 'Edit Brand Identity' : 'Initialize Brand Identity'}
                        </h3>
                    </div>
                    <button onClick={() => setIsModalOpen(false)} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        
                        {/* Name Input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Business Name</label>
                            <input 
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                placeholder="e.g. Acme Coffee Co."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                required
                            />
                        </div>

                        {/* Description Input */}
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                                Brand Description
                            </label>
                            <textarea 
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Describe what you do, your tone of voice, and your target audience..."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all resize-none h-28 leading-relaxed"
                            />
                            <p className="text-[11px] text-slate-400">Our AI uses this to match your brand voice.</p>
                        </div>

                         {/* Website Input */}
                         <div className="space-y-1.5">
                            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">Website URL</label>
                            <div className="relative">
                                <Globe size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input 
                                    type="url"
                                    value={formData.website_url}
                                    onChange={(e) => setFormData({...formData, website_url: e.target.value})}
                                    placeholder="https://acme.com"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-red-600">
                                <AlertTriangle size={16} className="mt-0.5 shrink-0" />
                                <p className="text-sm font-medium">{error}</p>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-between pt-4 border-t border-slate-50 mt-2">
                            {/* Delete Button (Only in Edit Mode) */}
                            {business ? (
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="group flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 transition-all disabled:opacity-50"
                                >
                                    {loading ? <Loader2 size={16} className="animate-spin"/> : <Trash2 size={16} />}
                                    <span className="hidden sm:inline">Delete Profile</span>
                                </button>
                            ) : (
                                <div></div> // Spacer
                            )}

                            <div className="flex items-center gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-900/20 hover:bg-indigo-600 hover:shadow-indigo-500/30 hover:-translate-y-0.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 size={16} className="animate-spin"/>
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            {business ? 'Update Profile' : 'Create Profile'}
                                            <CheckCircle2 size={16} className="opacity-50" />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default BusinessProfileCard;