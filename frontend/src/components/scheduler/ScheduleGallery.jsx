import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeScheduledPost, appendScheduledPosts, setScheduledPosts } from '../../features/posts/scheduledPostsSlice';
import api from '../../services/api';
import { Loader2 } from 'lucide-react';
import ScheduledPostCard from '../../cards/ScheduledPostCard'; 
import ScheduledPostModal from '../scheduler/ScheduledPostModal'; // Import Modal

const ScheduleGallery = () => {
  const dispatch = useDispatch();
  const { schedules, pagination, status } = useSelector((state) => state.scheduledPosts);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null); // Modal State

  const handleDelete = async (id) => {
    // Only call confirmation if coming directly from card delete button
    // If coming from modal, confirmation is inside modal
    try {
      await api.delete(`/scheduler/${id}`);
      dispatch(removeScheduledPost(id));
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete schedule.");
    }
  };

  const handleUpdate = (updatedItem) => {
    // Update local list
    const updatedList = schedules.map(s => s.id === updatedItem.id ? updatedItem : s);
    dispatch(setScheduledPosts({ data: updatedList, pagination }));
  };

  const handleLoadMore = async () => {
    if (loadingMore) return;
    setLoadingMore(true);
    try {
      const nextPage = (pagination.page || 1) + 1;
      const res = await api.get(`/scheduler?page=${nextPage}&limit=10`);
      if (res.data.data) {
        dispatch(appendScheduledPosts({
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
      <ScheduledPostModal 
        isOpen={!!selectedSchedule}
        post={selectedSchedule}
        onClose={() => setSelectedSchedule(null)}
        onDelete={handleDelete}
        onUpdate={handleUpdate}
      />

      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <h2 className="text-xl font-bold text-slate-900">Upcoming Schedule</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">
              {schedules.length} / {pagination.total || 0} Pending
            </span>
          </div>
        </div>

        {status === 'loading' && schedules.length === 0 ? (
          <div className="py-20 flex justify-center"><Loader2 size={32} className="animate-spin text-slate-300" /></div>
        ) : schedules.length === 0 ? (
          <div className="py-20 text-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
            <p className="text-slate-400 font-medium">No posts scheduled.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {schedules.map((item) => (
              // Wrap card in div to capture click, but keep card delete separate if needed
              // or modify card to accept onClickBody prop.
              // For simplicity: We make the whole card trigger modal, 
              // but we need to stop propagation on the specific delete button inside Card component.
              <div key={item.id} onClick={() => setSelectedSchedule(item)} className="cursor-pointer">
                  <ScheduledPostCard 
                      data={item} 
                      onDelete={(id) => {
                          // This logic should be handled carefully inside Card to e.stopPropagation()
                          // We will rely on Card's delete button logic.
                          handleDelete(id);
                      }} 
                  />
              </div>
            ))}
          </div>
        )}

        {pagination.hasMore && (
          <div className="flex justify-center pt-4">
            <button onClick={handleLoadMore} disabled={loadingMore} className="px-6 py-2 rounded-full border border-slate-300 text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all flex items-center gap-2">
              {loadingMore && <Loader2 size={14} className="animate-spin" />}
              Load More Schedules
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default ScheduleGallery;