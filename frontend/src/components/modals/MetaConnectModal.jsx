import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Share2, X, HelpCircle, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import api from '../../services/api';

const MetaConnectModal = ({ isOpen, onClose, businessId, onSuccess }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setToken('');
      setError(null);
    }
  }, [isOpen]);

  const handleConnect = async (e) => {
    e.preventDefault();
    if (!businessId) return alert("Please create a business profile first.");

    setLoading(true);
    setError(null);

    try {
        const response = await api.post('/meta/connect', {
            business_id: businessId,
            system_token: token
        });

        console.log(response);

        if (response.data.status === 'ok') {
            // Fetch updated list
            const refreshRes = await api.get(`/meta/${businessId}`);
            
            // Pass data back to parent
            onSuccess(refreshRes.data.accounts); 
        }

    } catch (err) {
        console.error("Meta Connection Failed:", err);
        setError(err.response?.data?.error || "Failed to connect. Check token validity.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 10 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 10 }} 
            className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/5"
          >
            {/* Header */}
            <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
                        <Share2 size={16} />
                    </div>
                    <h3 className="font-bold text-slate-900">Connect Meta Assets</h3>
                </div>
                <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-200 hover:text-slate-600 transition-colors">
                    <X size={20} />
                </button>
            </div>

            {/* Body */}
            <div className="p-6">
                <form onSubmit={handleConnect} className="space-y-6">
                    <div className="space-y-2">
                        <label className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
                            <span>System User Access Token</span>
                            <Link to="/docs/system-token" target="_blank" className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 hover:underline">
                                <HelpCircle size={12} /><span>Get Token</span>
                            </Link>
                        </label>
                        <div className="relative">
                            <textarea 
                                value={token} 
                                onChange={(e) => setToken(e.target.value)} 
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs font-mono text-slate-600 focus:border-indigo-500 outline-none resize-none h-32" 
                                placeholder="Paste your EAAG... token here" 
                                required 
                            />
                            <div className="absolute bottom-3 right-3 rounded-md bg-white px-2 py-1 text-[10px] font-medium text-slate-400 shadow-sm border border-slate-100">
                                AES-256 Secured
                            </div>
                        </div>
                        {error && (
                            <div className="flex items-start gap-2 rounded-lg bg-red-50 p-2 text-red-600">
                                <AlertTriangle size={14} className="mt-0.5" />
                                <p className="text-xs font-medium">{error}</p>
                            </div>
                        )}
                    </div>
                    <div className="flex items-center justify-end gap-3 pt-2">
                        <button type="button" onClick={onClose} className="rounded-xl px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50">
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white hover:bg-indigo-600 hover:shadow-indigo-500/30 transition-all disabled:opacity-70"
                        >
                            {loading ? <><Loader2 size={16} className="animate-spin"/> Authenticating...</> : <>Connect Assets <CheckCircle2 size={16} className="opacity-50" /></>}
                        </button>
                    </div>
                </form>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[10px] text-slate-400">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div> Encrypted Connection via Meta Graph API v19.0
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MetaConnectModal;