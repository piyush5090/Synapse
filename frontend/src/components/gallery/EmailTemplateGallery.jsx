import { Loader2, Mail, ArrowDownCircle } from 'lucide-react';
import EmailTemplateCard from '../../cards/EmailTemplateCard'; // Import the new card

const EmailTemplateGallery = ({ 
  templates, 
  loading, 
  onDeleted, 
  onLoadMore, 
  hasMore 
}) => {
  
  // --- 1. Loading Skeleton ---
  if (loading && (!templates || templates.length === 0)) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-2xl h-[420px] border border-slate-100 shadow-sm animate-pulse flex flex-col overflow-hidden">
            <div className="h-40 bg-slate-100"></div>
            <div className="p-6 space-y-4 flex-1">
              <div className="h-6 bg-slate-100 rounded w-3/4"></div>
              <div className="h-32 bg-slate-50 rounded-lg"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // --- 2. Empty State ---
  if (!templates || templates.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-dashed border-slate-200">
        <div className="w-20 h-20 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Mail className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No templates found</h3>
        <p className="text-slate-500 max-w-md mt-2">
          Your library is empty. Use the AI Generator or Manual Builder to create your first campaign.
        </p>
      </div>
    );
  }

  // --- 3. The Grid ---
  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {templates.map((template) => (
          <EmailTemplateCard 
            key={template.id} 
            template={template} 
            onDeleted={onDeleted}
            // onEdit={(t) => console.log('Edit', t)} // Hook up edit later if needed
          />
        ))}
      </div>

      {/* --- 4. Pagination Button --- */}
      {hasMore && (
        <div className="flex justify-center pt-6 pb-12">
          <button
            onClick={onLoadMore}
            disabled={loading}
            className="group flex items-center gap-2 px-8 py-3 bg-white border border-slate-200 rounded-full text-slate-600 font-semibold shadow-sm hover:border-indigo-300 hover:text-indigo-600 hover:shadow-md transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowDownCircle className="w-5 h-5 group-hover:translate-y-0.5 transition-transform" />}
            Load More Templates
          </button>
        </div>
      )}
    </div>
  );
};

export default EmailTemplateGallery;