import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGeneratedPosts, generateNewAd, savePost } from '../features/posts/generatedPostsSlice';

const ContentPage = () => {
  const [prompt, setPrompt] = useState('');
  const dispatch = useDispatch();
  const { posts, status, generationStatus, generationError } = useSelector((state) => state.generatedPosts);
  const { business } = useSelector((state) => state.user);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchGeneratedPosts());
    }
  }, [status, dispatch]);

  const handleGenerate = (e) => {
    e.preventDefault();
    if (!business) {
      alert('Please create a business profile first.');
      return;
    }
    dispatch(generateNewAd({ userPrompt: prompt, businessDetails: business }));
  };
  
  const handleSave = (post) => {
    dispatch(savePost(post));
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold">Generate Content</h1>
      <div className="w-full max-w-2xl p-8 mt-4 space-y-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleGenerate} className="space-y-6">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700">
              Ad Idea / Prompt
            </label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows="3"
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            ></textarea>
          </div>
          <div>
            <button
              type="submit"
              disabled={generationStatus === 'loading'}
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {generationStatus === 'loading' ? 'Generating...' : 'Generate Ad'}
            </button>
          </div>
          {generationError && <p className="text-sm text-red-500">{generationError}</p>}
        </form>
      </div>

      <h2 className="mt-8 text-2xl font-bold">Generated Posts</h2>
      {status === 'loading' && <p>Loading posts...</p>}
      <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div key={post.id || post.image_url} className="p-4 bg-white rounded-lg shadow-md">
            <img src={post.image_url} alt="Generated ad" className="object-cover w-full h-48 rounded-md"/>
            <div className="p-4">
              <p className="text-sm text-gray-600">{post.caption}</p>
              <p className="mt-2 text-sm italic text-gray-500">{post.hashtags.join(' ')}</p>
              {!post.id && ( // Show save button only if the post is not yet saved (doesn't have an id from the DB)
                 <button 
                    onClick={() => handleSave(post)}
                    className="w-full px-4 py-2 mt-4 font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                    Save Post
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentPage;
