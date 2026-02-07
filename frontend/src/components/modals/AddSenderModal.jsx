import { useState, useEffect } from 'react';
import { Mail, Key, Loader2, X } from 'lucide-react';

const AddSenderModal = ({ isOpen, onClose, onSubmit, isSaving }) => {
  const [formData, setFormData] = useState({ email: '', passkey: '' });
  
  // --- Animation State ---
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setFormData({ email: '', passkey: '' }); // Reset form
      
      // Trigger Enter Animation
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      // Trigger Exit Animation
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.passkey) return;
    onSubmit(formData);
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
    >
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Add Sender</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                placeholder="marketing@company.com"
                required 
              />
            </div>
          </div>
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase">App Password / Passkey</label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={formData.passkey}
                onChange={e => setFormData({...formData, passkey: e.target.value})}
                className="w-full pl-10 p-2.5 rounded-lg border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                placeholder="xxyy-zzzz-aabb-ccdd"
                required 
              />
            </div>
            <p className="text-[10px] text-slate-400">Use an App Password for Gmail/Outlook. Do not use your login password.</p>
          </div>

          <div className="pt-2 border-t border-slate-50 mt-4">
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm transition-transform active:scale-[0.98]"
            >
              {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSenderModal;