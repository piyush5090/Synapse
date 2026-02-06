import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeGeneratedPost, appendGeneratedPosts, setGeneratedPosts } from '../../features/posts/generatedPostsSlice';
import api from '../../services/api';
import { ArrowRight, Loader2, Trash2 } from 'lucide-react';
import GeneratedPostModal from '../content/GeneratedPostModal'; // Import Modal

const ContentGallery = () => {
  const dispatch = useDispatch();
  const { posts, status, pagination } = useSelector((state) => state.generatedPosts);
  
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // Modal State

  // Delete Action (Passed to Modal)
  const handleDeletePost = async (id) => {
    try {
      await api.delete(`/content/${id}`);
      dispatch(removeGeneratedPost(id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Could not delete post.");
    }
  };

  // Update Action (Passed to Modal to update Redux list locally)
  const handleUpdatePost = (updatedPost) => {
    const updatedList = posts.map(p => p.id === updatedPost.id ? updatedPost : p);
    // Manually updating the list in Redux to reflect changes immediately
    dispatch(setGeneratedPosts({ data: updatedList, pagination })); 
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = (pagination.page || 1) + 1;
      const limit = pagination.limit || 20;
      const res = await api.get(`/content?page=${nextPage}&limit=${limit}`);
      if (res.data.data) {
        dispatch(appendGeneratedPosts({
          data: res.data.data,
          pagination: res.data.pagination
        }));
      }
    } catch (err) {
      console.error("Load more failed", err);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <>
      {/* --- MODAL --- */}
      <GeneratedPostModal 
        isOpen={!!selectedPost}
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
        onDelete={handleDeletePost}
        onUpdate={handleUpdatePost}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Your Content Library</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {posts.length} / {pagination.total || 0} Assets
            </span>
            <ArrowRight className="text-slate-300" size={16} />
          </div>
        </div>

        {status === 'loading' && posts.length > 0 ? (
          <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-slate-300" /></div>
        ) : posts.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
            <p className="text-slate-400 font-medium">Your library is empty.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {posts.map((post) => (
              <div 
                key={post.id} 
                onClick={() => setSelectedPost(post)} // OPEN MODAL ON CLICK
                className="group flex flex-col bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all relative cursor-pointer hover:border-purple-200"
              >
                {/* Image */}
                <div className="aspect-square relative overflow-hidden bg-slate-100">
                  <img src={post.image_url} alt="Post" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy"/>
                </div>
                
                {/* Caption */}
                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-slate-600 line-clamp-2 mb-2 flex-1">{post.caption}</p>
                  <div className="text-[10px] text-slate-400 font-medium">
                    <div className="flex gap-1 overflow-hidden mt-1 flex-wrap">
                      {post.hashtags?.slice(0, 3).map((h, i) => <span key={i} className="text-slate-400">#{h.replace('#', '')}</span>)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination.hasMore && (
          <div className="flex justify-center pt-8 pb-4">
            <button onClick={handleLoadMore} disabled={loadingMore} className="px-8 py-2.5 rounded-full border border-slate-300 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2">
              {loadingMore && <Loader2 size={14} className="animate-spin" />}
              Load More Assets
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ContentGallery;