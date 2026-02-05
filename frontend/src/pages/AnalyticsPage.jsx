import { useState, useEffect } from 'react';
import { BarChart3, Calendar, Filter, Download } from 'lucide-react';
import PlatformChart from '../components/analytics/PlatformChart';
import TopPostsTable from '../components/analytics/TopPostsTable';
import api from '../services/api'; // Assuming you have an endpoint, or we use mock data below

const AnalyticsPage = () => {
  const [timeRange, setTimeRange] = useState('7'); // '7', '10', 'all'
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState([]);
  const [topPosts, setTopPosts] = useState([]);
  const [totals, setTotals] = useState({ facebook: 0, instagram: 0, total: 0 });

  // --- DATA PROCESSING LOGIC ---
  const processAnalytics = (events) => {
    // 1. Filter by Date
    const now = new Date();
    const cutoff = new Date();
    if (timeRange !== 'all') {
        cutoff.setDate(now.getDate() - parseInt(timeRange));
    }

    const filtered = timeRange === 'all' 
        ? events 
        : events.filter(e => new Date(e.created_at) >= cutoff);

    // 2. Aggregate for Chart (Group by Date)
    const groupedByDate = filtered.reduce((acc, curr) => {
        const date = new Date(curr.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        if (!acc[date]) acc[date] = { date, facebook: 0, instagram: 0 };
        
        if (curr.platform === 'facebook') acc[date].facebook += 1;
        if (curr.platform === 'instagram') acc[date].instagram += 1;
        
        return acc;
    }, {});

    // Convert to Array & Sort chronologically
    const chartArray = Object.values(groupedByDate).sort((a, b) => new Date(a.date) - new Date(b.date));

    // 3. Aggregate for Top Posts
    const groupedByLink = filtered.reduce((acc, curr) => {
        if (!acc[curr.link_id]) {
            acc[curr.link_id] = { link_id: curr.link_id, count: 0, platform: curr.platform }; // Add caption if available in join
        }
        acc[curr.link_id].count += 1;
        return acc;
    }, {});

    const topPostsArray = Object.values(groupedByLink).sort((a, b) => b.count - a.count).slice(0, 5);

    // 4. Totals
    const totalFb = filtered.filter(e => e.platform === 'facebook').length;
    const totalIg = filtered.filter(e => e.platform === 'instagram').length;

    setChartData(chartArray);
    setTopPosts(topPostsArray);
    setTotals({ facebook: totalFb, instagram: totalIg, total: filtered.length });
  };

  useEffect(() => {
    const fetchData = async () => {
        setLoading(true);
        try {
            // Replace with actual API call: await api.get('/analytics');
            // Using your provided JSON structure for simulation:
            const mockResponse = [
                { "id": 20, "created_at": "2026-02-05 11:28:03", "link_id": "54b3...", "platform": "facebook" },
                { "id": 21, "created_at": "2026-02-05 11:28:03", "link_id": "54b3...", "platform": "facebook" },
                { "id": 27, "created_at": "2026-02-05 11:41:21", "link_id": "54b3...", "platform": "facebook" },
                { "id": 31, "created_at": "2026-02-05 11:43:07", "link_id": "b337...", "platform": "instagram" },
                { "id": 32, "created_at": "2026-02-05 11:43:07", "link_id": "b337...", "platform": "instagram" },
                { "id": 35, "created_at": "2026-02-04 10:00:00", "link_id": "b337...", "platform": "instagram" }, // Old date test
                // ... add more from your data
            ];
            
            // Simulating API latency
            setTimeout(() => {
                processAnalytics(mockResponse); // Pass the raw array here
                setLoading(false);
            }, 500);

        } catch (err) {
            console.error("Failed to load analytics", err);
            setLoading(false);
        }
    };

    fetchData();
  }, [timeRange]);

  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] text-slate-900 font-sans">
      <div className="mx-auto max-w-7xl p-6 pt-24 lg:p-10 lg:pt-28 space-y-8">
        
        {/* --- HEADER --- */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-6 gap-4">
           <div>
             <div className="flex items-center gap-3 mb-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 text-slate-900 shadow-sm">
                    <BarChart3 size={20} />
                </div>
                <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Performance Analytics</h1>
             </div>
             <p className="text-slate-500 ml-1">Track engagement across your social channels.</p>
           </div>

           {/* Filter Controls */}
           <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              {['7', '10', 'all'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                        timeRange === range 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {range === 'all' ? 'Overall' : `Last ${range} Days`}
                  </button>
              ))}
           </div>
        </div>

        {/* --- KPI CARDS --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clicks</span>
                <span className="text-3xl font-black text-slate-900">{totals.total}</span>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider z-10">Facebook</span>
                <span className="text-3xl font-black text-slate-900 z-10">{totals.facebook}</span>
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-blue-600"><BarChart3 size={80} /></div>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1 relative overflow-hidden">
                <span className="text-xs font-bold text-pink-600 uppercase tracking-wider z-10">Instagram</span>
                <span className="text-3xl font-black text-slate-900 z-10">{totals.instagram}</span>
                <div className="absolute right-[-10px] bottom-[-10px] opacity-10 text-pink-600"><BarChart3 size={80} /></div>
            </div>
        </div>

        {/* --- CHARTS & TABLES --- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[500px]">
            
            {/* Left: Chart (2/3 width) */}
            <div className="lg:col-span-2 h-full">
                <PlatformChart data={chartData} />
            </div>

            {/* Right: Top Posts (1/3 width) */}
            <div className="lg:col-span-1 h-full">
                <TopPostsTable posts={topPosts} />
            </div>

        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;