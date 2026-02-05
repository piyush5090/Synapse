import { useSelector, useDispatch } from 'react-redux';
import { removeScheduledPost } from '../features/posts/scheduledPostsSlice';
import api from '../services/api';
import ScheduledPostCard from '../cards/ScheduledPostCard'; // Imported the specific card
import { Loader2 } from 'lucide-react';

const UpcomingSchedule = () => {
  const dispatch = useDispatch();
  const { schedules, status } = useSelector((state) => state.scheduledPosts);

  const handleDelete = async (id) => {
      if(!window.confirm("Cancel this scheduled post?")) return;

      try {
          // 1. Call API
          await api.delete(`/scheduler/${id}`);

          // 2. Update Redux
          dispatch(removeScheduledPost(id));

      } catch (err) {
          console.error("Delete schedule failed", err);
          alert("Failed to cancel schedule.");
      }
  };

  if (status === 'loading' && schedules.length === 0) {
    return <div className="flex justify-center p-4"><Loader2 className="animate-spin text-slate-300"/></div>;
  }

  if (!schedules || schedules.length === 0) {
    return <div className="text-center py-8 text-sm text-slate-400">No upcoming posts.</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {schedules.map((schedule) => (
        <ScheduledPostCard 
            key={schedule.id} 
            data={schedule} 
            onDelete={handleDelete} 
        />
      ))}
    </div>
  );
};

export default UpcomingSchedule;