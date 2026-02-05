import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setGeneratedPosts } from '../../features/posts/generatedPostsSlice'; // To trigger refresh/update locally
import api from '../../services/api';
import { X, Save, Trash2, Loader2, Image as ImageIcon } from 'lucide-react';

const GeneratedPostModal = ({ isOpen, onClose, post, onDelete, onUpdate }) => {
  const [caption, setCaption] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (post) {
      setCaption(post.caption || '');
    }
  }, [post]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Update Backend
      const res = await api.put(`/content/${post.id}`, { caption });
      
      // 2. Update Parent/Redux (Optimistic or refetch handled by parent)
      if (onUpdate) onUpdate({ ...post, caption }); 
      
      alert("Post updated successfully.");
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update post.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this generated asset? This cannot be undone.")) {
      onDelete(post.id);
      onClose();
    }
  };

  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex overflow-hidden shadow-2xl relative">
        
        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 backdrop-blur rounded-full text-slate-500 hover:text-slate-900 shadow-sm transition-all"
        >
          <X size={20} />
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 w-full h-full">
            
            {/* LEFT: Image Preview */}
            <div className="bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {post.image_url ? (
                    <img src={post.image_url} alt="Detail" className="w-full h-full object-contain" />
                ) : (
                    <div className="flex flex-col items-center text-slate-400">
                        <ImageIcon size={48} />
                        <span className="text-sm mt-2">No Image Available</span>
                    </div>
                )}
            </div>

            {/* RIGHT: Edit Form */}
            <div className="flex flex-col h-full bg-white">
                <div className="p-6 border-b border-slate-100">
                    <h2 className="text-xl font-bold text-slate-900">Edit Post Details</h2>
                    <p className="text-xs text-slate-500">Refine your caption before scheduling.</p>
                </div>

                <div className="flex-1 p-6 overflow-y-auto">
                    <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Caption & Hashtags</label>
                    <textarea 
                        value={caption}
                        onChange={(e) => setCaption(e.target.value)}
                        className="w-full h-full min-h-[300px] p-4 rounded-xl border border-slate-200 text-sm text-slate-700 leading-relaxed focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 outline-none resize-none bg-slate-50 focus:bg-white transition-all"
                        placeholder="Write your caption here..."
                    />
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <button 
                        onClick={handleDelete}
                        className="px-4 py-2 rounded-lg text-xs font-bold text-red-600 hover:bg-red-50 border border-transparent hover:border-red-100 transition-all flex items-center gap-2"
                    >
                        <Trash2 size={16} /> Delete Asset
                    </button>

                    <div className="flex gap-3">
                        <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-white transition-all">
                            Cancel
                        </button>
                        <button 
                            onClick={handleSave}
                            disabled={isSaving}
                            className="px-8 py-2.5 rounded-xl bg-purple-600 text-sm font-bold text-white hover:bg-purple-700 shadow-lg shadow-purple-600/20 transition-all flex items-center gap-2 disabled:opacity-70"
                        >
                            {isSaving ? <Loader2 size={16} className="animate-spin"/> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </div>
  );
};

export default GeneratedPostModal;