import { useState, useEffect } from 'react';
import { Mail, Key, Loader2, X, HelpCircle, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const AddSenderModal = ({ isOpen, onClose, onSubmit, isSaving }) => {
  const [formData, setFormData] = useState({ email: '', passkey: '' });
  
  // --- Animation State ---
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setFormData({ email: '', passkey: '' }); // Reset form
      requestAnimationFrame(() => setIsVisible(true));
    } else {
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
          <div>
            <h3 className="font-bold text-lg text-slate-800">Connect Sender</h3>
            <p className="text-xs text-slate-500">Add your Brevo credentials</p>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
          {/* Email Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase flex justify-between">
              Sender Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="email" 
                value={formData.email}
                onChange={e => setFormData({...formData, email: e.target.value})}
                className="w-full pl-10 p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm transition-all"
                placeholder="marketing@company.com"
                required 
              />
            </div>
            <p className="text-[10px] text-slate-400 leading-tight">
              Must match the email you verified in your Brevo dashboard.
            </p>
          </div>
          
          {/* API Key Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 uppercase flex justify-between items-center">
              Brevo API Key (v3)
              <Link 
                to="/docs/brevo-setup" 
                target="_blank" 
                className="text-indigo-600 hover:text-indigo-700 flex items-center gap-1 font-normal normal-case"
              >
                Where do I find this? <ExternalLink className="w-3 h-3" />
              </Link>
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                value={formData.passkey}
                onChange={e => setFormData({...formData, passkey: e.target.value})}
                className="w-full pl-10 p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none text-sm font-mono transition-all"
                placeholder="xkeysib-..."
                required 
              />
            </div>
            <div className="flex gap-2 items-start p-3 bg-amber-50 rounded-lg text-amber-800 text-[11px] leading-relaxed border border-amber-100">
               <HelpCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
               <p>Do <strong>not</strong> use your login password. Generate a new API Key starting with <code>xkeysib-</code> from the "SMTP & API" tab in Brevo.</p>
            </div>
          </div>

          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-lg shadow-slate-200 transition-all active:scale-[0.98]"
            >
              {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Verify & Save Credentials"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddSenderModal;