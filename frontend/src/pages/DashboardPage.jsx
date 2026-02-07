import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { setBusiness, setSocialAccounts } from '../features/user/userSlice';
import { setGeneratedPosts, setPostsLoading } from '../features/posts/generatedPostsSlice';
import { setScheduledPosts, setSchedulesLoading } from '../features/posts/scheduledPostsSlice';
import api from '../services/api';

// Components
import BusinessProfileCard from '../cards/BusinessProfileCard';
import MetaConnectionCard from '../cards/MetaConnectionCard';
import ActionGrid from '../components/ActionGrid';
import RecentGeneratedPosts from '../components/RecentGeneratedPosts';
import UpcomingSchedule from '../components/UpcomingSchedule';
import EmailCampaigns from '../components/EmailCampains';
import { Loader2, Sparkles, Calendar, Mail, LayoutDashboard, ArrowRight } from 'lucide-react';

const DashboardPage = () => {
  const dispatch = useDispatch();
  
  // Read data from Redux
  const { business } = useSelector((state) => state.user);
  
  // Loading State for Initial Fetch 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadDashboardData = async () => {
      try {
        // 1. Fetching Business and User's data
        let currentBusiness = business;
        if (!currentBusiness) {
             const businessRes = await api.get('/business'); 
             currentBusiness = businessRes.data.business;
             if (isMounted && currentBusiness) dispatch(setBusiness(currentBusiness));
        }

        if (currentBusiness?.id) {
             const metaRes = await api.get(`/meta/${currentBusiness.id}`);
             if (isMounted && metaRes.data.accounts) dispatch(setSocialAccounts(metaRes.data.accounts));
        }

        // 2. Fetching Generated Posts (pagination)
        dispatch(setPostsLoading()); 
        const postsRes = await api.get('/content?page=1&limit=5');
        if (isMounted && postsRes.data) {
            dispatch(setGeneratedPosts({
                data: postsRes.data.data,
                pagination: postsRes.data.pagination
            }));
        }

        // 3. Fetching Scheduled Posts (pagination)
        dispatch(setSchedulesLoading()); 
        const schedRes = await api.get('/scheduler?page=1&limit=4');
        if (isMounted && schedRes.data) {
            dispatch(setScheduledPosts({
                data: schedRes.data.data,
                pagination: schedRes.data.pagination
            }));
        }

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadDashboardData();

    return () => { isMounted = false; };
  }, [dispatch, business]);

  if (loading && !business) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#F8F9FC]">
        <div className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin text-slate-900" size={32} />
            <span className="text-sm font-medium text-slate-500">Loading Workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="mx-auto max-w-7xl p-6 pt-24 lg:p-10 lg:pt-28 space-y-10">
        
        {/* Header */}
        <div className="flex flex-col border-b border-slate-200 pb-6">
           <div className="flex items-center gap-3 mb-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm">
                  <LayoutDashboard size={20} />
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Dashboard</h1>
           </div>
           <p className="text-slate-500 ml-1">Welcome back. Here is your autonomous marketing overview.</p>
        </div>

        {/* Top Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
           <div className="h-full"><BusinessProfileCard business={business} /></div>
           <div className="h-full"><MetaConnectionCard /></div>
           <div className="h-full"><ActionGrid /></div>
        </div>

        {/* Content Streams */}
        <div className="space-y-10">
           
           {/* Section A: Generated Content */}
           <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden">
              <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                  {/* Left Title */}
                  <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
                          <Sparkles size={16} />
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Generated Content</h2>
                  </div>

                  {/* Right Action */}
                  <Link 
                    to="/content" 
                    className="group flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-purple-600 transition-colors"
                  >
                    View All
                    <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
              </div>
              <div className="p-6">
                  <RecentGeneratedPosts />
              </div>
           </div>

           {/* Section B & C: Split Grid */}
           <div className="flex flex-col lg:flex-col gap-8">
               
               {/* Scheduled Content */}
               <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                      {/* Left Title */}
                      <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
                              <Calendar size={16} />
                          </div>
                          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Scheduled Content</h2>
                      </div>

                      {/* Right Action */}
                      <Link 
                        to="/schedule" 
                        className="group flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-amber-600 transition-colors"
                      >
                        View All
                        <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                      </Link>
                  </div>
                  <div className="p-6 flex-1">
                      <UpcomingSchedule />
                  </div>
               </div>

               {/* Email Campaigns */}
               <div className="flex-1 rounded-2xl border border-slate-200 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.02)] overflow-hidden flex flex-col h-full">
                  <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sky-100 text-sky-600">
                          <Mail size={16} />
                      </div>
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Email Campaigns</h2>
                  </div>
                  <div className="p-6 flex-1">
                      <EmailCampaigns />
                  </div>
               </div>

           </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;