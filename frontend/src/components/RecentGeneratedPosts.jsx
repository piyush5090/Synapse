import { useSelector, useDispatch } from 'react-redux';
import { removeGeneratedPost } from '../features/posts/generatedPostsSlice'; // Sync Action
import api from '../services/api';
import PostCard from '../cards/PostCard';
import { Loader2 } from 'lucide-react';

const RecentGeneratedPosts = () => {
  const dispatch = useDispatch();
  // Read purely from store
  const { posts, status } = useSelector((state) => state.generatedPosts);

  const handleDelete = async (id) => {
      if(!window.confirm("Delete this generated asset?")) return;
      
      try {
          // 1. Call API
          await api.delete(`/content/${id}`);
          
          // 2. On Success, update Redux
          dispatch(removeGeneratedPost(id));
          
      } catch (err) {
          console.error("Delete failed", err);
          alert("Failed to delete post.");
      }
  };

  if (status === 'loading' && posts.length === 0) {
    return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-300"/></div>;
  }

  if (!posts || posts.length === 0) {
    return <div className="text-center py-8 text-sm text-slate-400">No content generated yet.</div>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} type="generated" data={post} onDelete={handleDelete} />
      ))}
    </div>
  );
};

export default RecentGeneratedPosts;