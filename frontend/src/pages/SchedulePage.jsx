import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScheduledPosts, scheduleNewPost } from '../features/posts/scheduledPostsSlice';
import { fetchGeneratedPosts } from '../features/posts/generatedPostsSlice';

const SchedulePage = () => {
  const dispatch = useDispatch();
  const { scheduledPosts, status } = useSelector((state) => state.scheduledPosts);
  const { posts: generatedPosts } = useSelector((state) => state.generatedPosts);
  
  const [selectedPost, setSelectedPost] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  // Assuming social_account_ids would be fetched and stored elsewhere, using a placeholder for now
  const [socialAccountIds, setSocialAccountIds] = useState([]); 

  useEffect(() => {
    dispatch(fetchScheduledPosts());
    dispatch(fetchGeneratedPosts());
  }, [dispatch]);

  const handleSchedule = (e) => {
    e.preventDefault();
    if (!selectedPost || !scheduledTime || socialAccountIds.length === 0) {
      alert('Please select a post, a time, and at least one social account.');
      return;
    }
    dispatch(scheduleNewPost({ generated_post_id: selectedPost, social_account_ids: socialAccountIds, scheduled_time: scheduledTime }));
  };

  return (
    <div className="container p-4 mx-auto">
      <h1 className="text-2xl font-bold">Schedule a Post</h1>
      <div className="w-full max-w-2xl p-8 mt-4 space-y-6 bg-white rounded-lg shadow-md">
        <form onSubmit={handleSchedule} className="space-y-6">
          <div>
            <label htmlFor="post-select" className="block text-sm font-medium text-gray-700">
              Choose a post to schedule
            </label>
            <select
              id="post-select"
              value={selectedPost}
              onChange={(e) => setSelectedPost(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select a post</option>
              {generatedPosts.map((post) => (
                <option key={post.id} value={post.id}>
                  {post.caption.substring(0, 50)}...
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="scheduledTime" className="block text-sm font-medium text-gray-700">
              Schedule Time
            </label>
            <input
              id="scheduledTime"
              type="datetime-local"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {/* Placeholder for social account selection */}
          <div>
             <label className="block text-sm font-medium text-gray-700">Social Accounts</label>
             <div className="p-2 mt-1 border border-dashed rounded-md">
                <p className="text-sm text-gray-500">Social account selection UI will be here.</p>
             </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-2 font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Schedule Post
            </button>
          </div>
        </form>
      </div>


      <h2 className="mt-8 text-2xl font-bold">Scheduled Posts</h2>
      {status === 'loading' && <p>Loading scheduled posts...</p>}
      {status === 'succeeded' && scheduledPosts.length === 0 && (
        <p>No posts scheduled yet.</p>
      )}
      <ul>
        {scheduledPosts.map((post) => (
          <li key={post.id}>{post.id} - {post.status}</li>
        ))}
      </ul>
    </div>
  );
};

export default SchedulePage;
