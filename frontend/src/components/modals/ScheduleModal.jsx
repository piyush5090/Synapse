import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGeneratedPosts, appendGeneratedPosts } from '../../features/posts/generatedPostsSlice';
import api from '../../services/api';
import { X, Calendar, Clock, Check, Loader2, Image as ImageIcon, Globe, Facebook, Instagram, ChevronDown } from 'lucide-react';

const ScheduleModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  
  // --- REDUX STATE ---
  const { posts: generatedPosts, pagination: genPagination } = useSelector((state) => state.generatedPosts);
  const { social_accounts } = useSelector((state) => state.user);

  // --- LOCAL FORM STATE ---
  const [selectedPostIds, setSelectedPostIds] = useState([]);
  const [selectedAccountIds, setSelectedAccountIds] = useState([]);
  const [scheduledTime, setScheduledTime] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingMoreGen, setLoadingMoreGen] = useState(false);

  // --- INITIAL DATA FETCH ---
  useEffect(() => {
    if (isOpen && generatedPosts.length === 0) {
      const fetchInitial = async () => {
        try {
          const res = await api.get('/content?page=1&limit=10');
          if (res.data.data) {
            dispatch(setGeneratedPosts({ data: res.data.data, pagination: res.data.pagination }));
          }
        } catch (err) {
          console.error("Failed to load generated posts for modal", err);
        }
      };
      fetchInitial();
    }
  }, [isOpen, generatedPosts.length, dispatch]);

  // --- LOAD MORE HANDLER ---
  const handleLoadMoreGen = async () => {
    if (loadingMoreGen) return;
    setLoadingMoreGen(true);
    try {
      const nextPage = (genPagination?.page || 1) + 1;
      const currentLimit = genPagination?.limit || 10;
      
      const res = await api.get(`/content?page=${nextPage}&limit=${currentLimit}`);
      
      if (res.data.data) {
        dispatch(appendGeneratedPosts({ 
            data: res.data.data, 
            pagination: res.data.pagination 
        }));
      }
    } catch (err) {
      console.error("Load more failed", err);
    } finally {
      setLoadingMoreGen(false);
    }
  };

  // --- SELECTION HANDLERS ---
  const togglePostSelection = (id) => {
    setSelectedPostIds(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  const toggleAccountSelection = (id) => {
    setSelectedAccountIds(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  // --- SUBMIT ---
  const handleSubmit = async () => {
    if (selectedPostIds.length === 0) return alert("Please select at least one post.");
    if (selectedAccountIds.length === 0) return alert("Please select at least one social account.");
    if (!scheduledTime) return alert("Please select a date and time.");

    setIsSubmitting(true);

    try {
      const promises = selectedPostIds.map(postId => 
        api.post('/scheduler', {
          generated_post_id: postId,
          social_account_ids: selectedAccountIds,
          scheduled_time: new Date(scheduledTime).toISOString()
        })
      );

      await Promise.all(promises);
      alert("Schedules created successfully!");
      onClose(true); 

    } catch (err) {
      console.error("Scheduling failed:", err);
      alert(err.response?.data?.message || "Failed to create schedule.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-6xl h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* --- Header --- */}
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Schedule New Post</h2>
            <p className="text-xs text-slate-500 font-medium">Configure your campaign details below.</p>
          </div>
          <button onClick={() => onClose(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* --- Main Body (Split Layout) --- */}
        <div className="flex-1 overflow-hidden min-h-0"> {/* Added min-h-0 here */}
          <div className="grid grid-cols-1 lg:grid-cols-3 h-full divide-x divide-slate-100">
            
            {/* LEFT COLUMN: Content Selection (Scrollable) */}
            <div className="lg:col-span-2 flex flex-col h-full bg-slate-50/30 overflow-hidden"> {/* Added overflow-hidden to parent */}
                {/* Sticky Sub-header */}
                <div className="p-4 border-b border-slate-100 bg-white/50 backdrop-blur sticky top-0 z-10 flex justify-between items-center shrink-0">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                        <span className="bg-purple-100 text-purple-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span>
                        Select Content
                    </h3>
                    <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded-md">
                        {selectedPostIds.length} Selected
                    </span>
                </div>
                
                {/* Scrollable Grid - FIX APPLIED HERE: min-h-0 */}
                <div className="flex-1 overflow-y-auto min-h-0 p-4 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                    
                    {generatedPosts.length === 0 ? (
                       <div className="flex flex-col items-center justify-center h-40 text-slate-400">
                          <Loader2 className="animate-spin mb-2" />
                          <span className="text-xs">Loading posts...</span>
                       </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {generatedPosts.map(post => {
                                const isSelected = selectedPostIds.includes(post.id);
                                return (
                                <div 
                                    key={post.id} 
                                    onClick={() => togglePostSelection(post.id)}
                                    className={`relative group cursor-pointer rounded-xl border-2 overflow-hidden transition-all duration-200 ${isSelected ? 'border-purple-600 ring-2 ring-purple-600/20 shadow-md transform scale-[1.02]' : 'border-white bg-white shadow-sm hover:border-purple-200 hover:shadow-md'}`}
                                >
                                    <div className="aspect-square bg-slate-100 relative">
                                        {post.image_url ? (
                                            <img src={post.image_url} className="w-full h-full object-cover" alt="Post" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-slate-300"><ImageIcon /></div>
                                        )}
                                        <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-purple-600 border-purple-600 text-white' : 'bg-white/80 border-slate-300 text-transparent'}`}>
                                            <Check size={14} strokeWidth={4} />
                                        </div>
                                    </div>
                                    <div className="p-3 bg-white">
                                        <p className="text-xs text-slate-600 line-clamp-2 font-medium leading-relaxed">{post.caption}</p>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    )}

                    {/* LOAD MORE BUTTON */}
                    {genPagination?.hasMore && (
                        <div className="py-8 flex justify-center">
                            <button 
                                onClick={handleLoadMoreGen} 
                                disabled={loadingMoreGen}
                                className="group px-6 py-2 bg-white border border-slate-200 text-xs font-bold text-slate-600 rounded-full hover:bg-slate-50 hover:border-purple-300 hover:text-purple-600 transition-all flex items-center gap-2 shadow-sm"
                            >
                                {loadingMoreGen ? (
                                    <Loader2 size={12} className="animate-spin text-purple-600"/>
                                ) : (
                                    <ChevronDown size={14} className="group-hover:translate-y-0.5 transition-transform" />
                                )}
                                {loadingMoreGen ? 'Loading...' : 'Load More Posts'}
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* RIGHT COLUMN: Settings (Fixed) */}
            <div className="lg:col-span-1 flex flex-col h-full bg-white overflow-y-auto p-6 space-y-8">
                
                {/* 2. SELECT ACCOUNTS */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="bg-blue-100 text-blue-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span>
                        Select Accounts
                    </h3>
                    <div className="space-y-3">
                        {social_accounts.length === 0 && (
                            <div className="text-center p-4 border-2 border-dashed border-slate-100 rounded-xl">
                                <p className="text-xs text-slate-400">No accounts connected.</p>
                            </div>
                        )}
                        
                        {social_accounts.map(acc => {
                            const isSelected = selectedAccountIds.includes(acc.id);
                            return (
                                <div 
                                    key={acc.id}
                                    onClick={() => toggleAccountSelection(acc.id)}
                                    className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${isSelected ? 'border-blue-500 bg-blue-50/30' : 'border-slate-100 hover:border-blue-200'}`}
                                >
                                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white border-slate-300'}`}>
                                        {isSelected && <Check size={12} />}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-slate-700 capitalize flex items-center gap-2">
                                            {acc.platform === 'facebook' ? <Facebook size={14} className="text-blue-600"/> : <Instagram size={14} className="text-pink-600"/>}
                                            {acc.platform}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-medium tracking-wide">ID: {acc.platform_account_id || 'Connected'}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </section>

                {/* 3. SELECT TIME */}
                <section>
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                        <span className="bg-amber-100 text-amber-600 w-6 h-6 rounded-full flex items-center justify-center text-xs">3</span>
                        Schedule Time
                    </h3>
                    <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1.5 uppercase">Date & Time</label>
                            <div className="relative">
                                <input 
                                    type="datetime-local" 
                                    value={scheduledTime}
                                    onChange={(e) => setScheduledTime(e.target.value)}
                                    className="w-full p-3 pl-10 bg-slate-300 border border-slate-200 rounded-lg text-sm text-slate-090 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all"
                                />
                                <Calendar size={16} className="absolute left-3 top-3.5 text-slate-900" />
                            </div>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium bg-white p-2 rounded-lg border border-slate-100">
                            <Globe size={12} />
                            <span>Zone: {Intl.DateTimeFormat().resolvedOptions().timeZone}</span>
                        </div>
                    </div>
                </section>

            </div>
          </div>
        </div>

        {/* --- Footer --- */}
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <div className="text-xs text-slate-500 font-medium">
             Creating <strong>{selectedPostIds.length}</strong> posts for <strong>{selectedAccountIds.length}</strong> accounts.
          </div>
          <div className="flex gap-3">
            <button 
                onClick={() => onClose(false)}
                className="px-6 py-2.5 rounded-xl border border-slate-300 text-sm font-bold text-slate-600 hover:bg-white hover:text-slate-800 transition-all"
            >
                Cancel
            </button>
            <button 
                onClick={handleSubmit}
                disabled={isSubmitting || selectedPostIds.length === 0 || selectedAccountIds.length === 0 || !scheduledTime}
                className="px-8 py-2.5 rounded-xl bg-slate-900 text-sm font-bold text-white hover:bg-black hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Clock size={16} />}
                Create Schedule
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ScheduleModal;