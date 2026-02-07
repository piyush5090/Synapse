import { useState, useEffect } from 'react';
import { BarChart3, Loader2 } from 'lucide-react';
import PlatformChart from '../components/analytics/PlatformChart';
import TopPostsGallery from '../components/gallery/TopPostsGallery'; // NEW IMPORT
import api from '../services/api'; 

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7'); 
  const [loading, setLoading] = useState(true);
  
  // Data State
  const [rawPlatformData, setRawPlatformData] = useState({});
  const [topPosts, setTopPosts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [totals, setTotals] = useState({ facebook: 0, instagram: 0, total: 0 });

  // 1. FETCH
  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            const [perfRes, topRes] = await Promise.all([
                api.get('/analytics/platform-performance'),
                api.get('/analytics/top-posts?limit=10')
            ]);


            if (perfRes.data.status === 'Success') setRawPlatformData(perfRes.data.data);
            if (topRes.data.status === 'Success') {
                const formatted = topRes.data.data.map(p => ({ ...p, count: p.clicks }));
                setTopPosts(formatted);
            }
        } catch (err) {
            console.error("Failed to load analytics", err);
        } finally {
            setLoading(false);
        }
    };
    fetchData();
  }, []);

  // 2. PROCESS
  useEffect(() => {
    if (Object.keys(rawPlatformData).length === 0 && topPosts.length === 0) return;

    const getAllDates = () => {
        const dates = new Set();
        Object.values(rawPlatformData).forEach(dateMap => {
            Object.keys(dateMap).forEach(date => dates.add(date));
        });
        return Array.from(dates).sort();
    };

    const allDates = getAllDates();
    const cutoff = new Date();
    if (timeRange !== 'all') {
        cutoff.setDate(new Date().getDate() - parseInt(timeRange));
    }

    const filteredDates = timeRange === 'all' 
        ? allDates 
        : allDates.filter(d => new Date(d) >= cutoff);

    let fbTotal = 0;
    let igTotal = 0;

    const processedChart = filteredDates.map(dateStr => {
        const fbCount = rawPlatformData['facebook']?.[dateStr] || 0;
        const igCount = rawPlatformData['instagram']?.[dateStr] || 0;
        fbTotal += fbCount;
        igTotal += igCount;
        return {
            date: new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            facebook: fbCount,
            instagram: igCount
        };
    });

    setChartData(processedChart);
    setTotals({
        facebook: fbTotal,
        instagram: igTotal,
        total: fbTotal + igTotal
    });

  }, [timeRange, rawPlatformData, topPosts]);

  // --- LOADER FIX: Added bg-[#F8F9FC] ---
  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-[#F8F9FC]">
        <Loader2 className="animate-spin text-slate-400" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] text-slate-900 font-sans">
      <div className="mx-auto max-w-7xl p-6 pt-24 lg:p-10 lg:pt-28 space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
           <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm">
                    <BarChart3 size={20} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Performance Analytics</h1>
             </div>
             <p className="text-slate-500 ml-1">Engagement metrics over time.</p>
           </div>

           {/* FILTERS */}
           <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['7', '10', 'all'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        timeRange === range ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {range === 'all' ? 'Overall' : `Last ${range} Days`}
                  </button>
              ))}
           </div>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clicks</span>
                <span className="text-3xl font-black text-slate-900">{totals.total}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider z-10">Facebook</span>
                <span className="text-3xl font-black text-slate-900 z-10">{totals.facebook}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider z-10">Instagram</span>
                <span className="text-3xl font-black text-slate-900 z-10">{totals.instagram}</span>
            </div>
        </div>

        {/* CHARTS & GALLERY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
            {/* Chart (2/3 width) */}
            <div className="lg:col-span-2 h-full min-h-[350px]">
                <PlatformChart data={chartData} />
            </div>
            {/* Gallery (1/3 width) */}
            <div className="lg:col-span-1 h-full min-h-[350px]">
                <TopPostsGallery posts={topPosts} />
            </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;