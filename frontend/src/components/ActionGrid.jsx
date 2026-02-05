import { Link } from 'react-router-dom';
import { Sparkles, BarChart3, ArrowRight, TrendingUp, Calendar } from 'lucide-react';

const ActionGrid = () => {
  return (
    <div className="flex flex-col gap-3 h-full">
      
      {/* --- 1. PRIMARY ACTION: GENERATE CONTENT --- */}
      {/* Takes up the most space (flex-1) */}
      <Link 
        to="/content" 
        className="group relative flex-[1.5] flex flex-col justify-between overflow-hidden rounded-2xl bg-slate-900 p-5 text-white shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-slate-900/20 hover:-translate-y-1"
      >
         {/* Texture */}
         <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.15) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
         
         <div className="relative z-10">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg shadow-indigo-900/50 ring-1 ring-white/10 group-hover:scale-110 transition-transform">
                <Sparkles size={18} fill="currentColor" className="text-white/90" />
            </div>
            
            <h3 className="text-lg font-bold tracking-tight text-white">Generate Content</h3>
            <p className="mt-1 text-xs text-slate-400 leading-relaxed max-w-[95%]">
               Create high-fidelity posts with AI in seconds.
            </p>
         </div>

         <div className="relative z-10 mt-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-indigo-400 group-hover:text-white transition-colors">
            <span>Start Creation</span>
            <ArrowRight size={12} className="transition-transform group-hover:translate-x-1" />
         </div>
      </Link>

      {/* --- 2. SECONDARY ACTION: SCHEDULE POST (NEW) --- */}
      <Link 
        to="/schedule" 
        className="group relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-amber-200 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors">
                <Calendar size={18} />
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-amber-700 transition-colors">Schedule Post</h3>
                <span className="text-[10px] font-medium text-slate-500 block -mt-0.5">Plan distribution</span>
            </div>
        </div>
        
        <div className="pr-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight size={16} className="text-slate-400" />
        </div>
      </Link>

      {/* --- 3. TERTIARY ACTION: ANALYTICS --- */}
      <Link 
        to="/analytics" 
        className="group relative flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 hover:border-emerald-200 hover:shadow-md"
      >
        <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100 transition-colors">
                <BarChart3 size={18} />
            </div>
            <div>
                <h3 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">Analytics</h3>
                <div className="flex items-center gap-1">
                   <TrendingUp size={10} className="text-emerald-500" />
                   <span className="text-[10px] font-medium text-slate-500">View growth</span>
                </div>
            </div>
        </div>
        
        <div className="pr-1 opacity-0 -translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
            <ArrowRight size={16} className="text-slate-400" />
        </div>
      </Link>
      
    </div>
  );
};

export default ActionGrid;