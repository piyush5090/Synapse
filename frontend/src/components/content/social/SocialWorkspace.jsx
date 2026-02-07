import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGeneratedPosts, setPostsLoading } from '../../../features/posts/generatedPostsSlice';
import api from '../../../services/api';

// Your Existing Components
import AIGenerator from '../AIGenerator'; // You might want to move these into /social folder too
import ManualUploader from '../ManualUploader';
import ContentGallery from '../../gallery/ContentGallery';

const SocialWorkspace = () => {
  const dispatch = useDispatch();
  const { posts, status } = useSelector((state) => state.generatedPosts);
  const { business } = useSelector((state) => state.user);

  useEffect(() => {
    let isMounted = true;
    const loadLibrary = async () => {
      if (status === 'success' && posts.length > 0) return;
      try {
        dispatch(setPostsLoading());
        const response = await api.get('/content?page=1&limit=20');
        if (isMounted && response.data.data) {
          dispatch(setGeneratedPosts({
            data: response.data.data,
            pagination: response.data.pagination
          }));
        }
      } catch (err) {
        console.error("Failed to load social library:", err);
      }
    };
    loadLibrary();
    return () => { isMounted = false; };
  }, [dispatch, status, posts.length]);

  return (
    <div className="space-y-12">
      {/* Generators Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AIGenerator business={business} />
        <ManualUploader />
      </div>

      {/* Gallery */}
      <div>
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="w-2 h-8 bg-indigo-500 rounded-full"></span>
          Your Social Posts
        </h3>
        <ContentGallery posts={posts} status={status} />
      </div>
    </div>
  );
};

export default SocialWorkspace;