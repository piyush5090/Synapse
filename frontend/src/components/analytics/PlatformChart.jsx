import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const PlatformChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-[300px] flex items-center justify-center text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        No analytics data available for this period.
      </div>
    );
  }

  return (
    <div className="h-[350px] w-full bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
      <h3 className="text-sm font-bold text-slate-700 mb-6">Traffic Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorFb" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b5998" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#3b5998" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorIg" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E1306C" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#E1306C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
          />
          <CartesianGrid vertical={false} stroke="#f1f5f9" />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            itemStyle={{ fontSize: '12px', fontWeight: 600 }}
          />
          <Legend iconType="circle" wrapperStyle={{ paddingTop: '20px' }}/>
          <Area 
            type="monotone" 
            dataKey="facebook" 
            name="Facebook"
            stroke="#3b5998" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorFb)" 
          />
          <Area 
            type="monotone" 
            dataKey="instagram" 
            name="Instagram"
            stroke="#E1306C" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorIg)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PlatformChart;