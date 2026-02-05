import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setGeneratedPosts, setPostsLoading } from '../features/posts/generatedPostsSlice';
import api from '../services/api';

// Child Components
import PageHeader from '../components/content/PageHeader';
import AIGenerator from '../components/content/AIGenerator';
import ManualUploader from '../components/content/ManualUploader';
import ContentGallery from '../components/content/ContentGallery';

const ContentPage = () => {
  const dispatch = useDispatch();
  const { posts, status } = useSelector((state) => state.generatedPosts);
  const { business } = useSelector((state) => state.user);

  // Fetch Initial Posts
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
        console.error("Failed to load content library:", err);
      }
    };
    loadLibrary();
    return () => { isMounted = false; };
  }, [dispatch, status, posts.length]);

  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="mx-auto max-w-7xl p-6 pt-24 lg:p-10 lg:pt-28 space-y-12">
        
        {/* 1. Header */}
        <PageHeader />

        {/* 2. Workspace (Grid) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AIGenerator business={business} />
          <ManualUploader />
        </div>

        {/* 3. Gallery */}
        <ContentGallery posts={posts} status={status} />
        
      </div>
    </div>
  );
};

export default ContentPage;