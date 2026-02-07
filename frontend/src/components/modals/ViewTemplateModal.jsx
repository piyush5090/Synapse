import { useEffect, useState } from 'react';
import { X, Calendar, User } from 'lucide-react';

const ViewTemplateModal = ({ isOpen, onClose, template }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // Animation Logic
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender || !template) return null;

  // Data Prep
  const htmlContent = template.content || template.text_content || "";
  const dateStr = new Date(template.created_at).toLocaleDateString('en-US', {
    weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
  });

  return (
    <div 
      className={`fixed inset-0 z-[60] flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-3xl h-[85vh] flex flex-col overflow-hidden transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 shrink-0">
          <div>
            <h3 className="font-bold text-lg text-slate-800 line-clamp-1">{template.subject}</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" /> {dateStr}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Scrollable Preview Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-8 scrollbar-thin scrollbar-thumb-slate-200">
          {/* Email Container Simulation */}
          <div className="bg-white max-w-2xl mx-auto shadow-sm border border-slate-200 rounded-lg overflow-hidden min-h-[400px]">
            
            {/* Header Image */}
            {template.image_url && (
              <div className="w-full relative">
                <img 
                  src={template.image_url} 
                  alt="Email Header" 
                  className="w-full h-auto object-cover"
                />
              </div>
            )}

            {/* Email Body */}
            <div className="p-8 prose prose-sm max-w-none text-slate-700 font-sans">
               <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-white flex justify-end shrink-0">
          <button 
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors shadow-md"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewTemplateModal;