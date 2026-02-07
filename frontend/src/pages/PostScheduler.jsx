import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setScheduledPosts, setSchedulesLoading } from '../features/posts/scheduledPostsSlice';
import { setSocialAccounts } from '../features/user/userSlice';
import api from '../services/api';

// Components
import ScheduleModal from '../components/modals/ScheduleModal';
import ScheduleGallery from '../components/gallery/ScheduleGallery';
import { Calendar, Plus } from 'lucide-react';

const PostScheduler = () => {
  const dispatch = useDispatch();
  const { business } = useSelector((state) => state.user);
  
  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- FETCH SCHEDULES ---
  const fetchSchedules = async () => {
    try {
      dispatch(setSchedulesLoading());
      const res = await api.get('/scheduler?page=1&limit=20'); // Fetch Page 1
      if (res.data.data) {
        dispatch(setScheduledPosts({
          data: res.data.data,
          pagination: res.data.pagination
        }));
      }
    } catch (err) {
      console.error("Failed to fetch schedules:", err);
    }
  };

  // --- FETCH SOCIAL ACCOUNTS (Required for modal) ---
  const fetchSocials = async () => {
    if (business?.id) {
        try {
            const res = await api.get(`/meta/${business.id}`);
            if (res.data.accounts) {
                dispatch(setSocialAccounts(res.data.accounts));
            }
        } catch (err) {
            console.error("Failed to load social accounts", err);
        }
    }
  };

  useEffect(() => {
    fetchSchedules();
    fetchSocials();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, business?.id]);

  // Callback when modal closes (specifically on success)
  const handleModalClose = (refreshNeeded) => {
    setIsModalOpen(false);
    if (refreshNeeded === true) {
      fetchSchedules(); // Reload the list to show new schedules
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Modal */}
      <ScheduleModal isOpen={isModalOpen} onClose={handleModalClose} />

      <div className="mx-auto max-w-7xl p-6 pt-24 lg:p-10 lg:pt-28 space-y-12">
        
        {/* Header with Action */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
           <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm">
                    <Calendar size={20} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Post Scheduler</h1>
             </div>
             <p className="text-slate-500 ml-1">Plan and automate your content distribution.</p>
           </div>

           <button 
             onClick={() => setIsModalOpen(true)}
             className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-purple-600 transition-all shadow-lg shadow-slate-900/20 hover:shadow-purple-600/20 flex items-center gap-2"
           >
             <Plus size={18} />
             Schedule Post
           </button>
        </div>

        {/* Gallery */}
        <ScheduleGallery />

      </div>
    </div>
  );
};

export default PostScheduler;