import { useState, useEffect } from 'react';
import api from '../services/api';
import AddSenderModal from './modals/AddSenderModal';
import SenderCard from '../cards/SenderCard';
import { Plus, Loader2 } from 'lucide-react';

const SenderManager = () => {
  const [senders, setSenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Fetch Senders
  useEffect(() => {
    let mounted = true;
    const fetchSenders = async () => {
      try {
        const res = await api.get('/email/senders');
        if (res.data.success && mounted) setSenders(res.data.data);
      } catch (err) {
        console.error("Failed to fetch senders", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchSenders();
    return () => { mounted = false; };
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/email/senders/${id}`);
      // Only remove from UI if API succeeds
      setSenders(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error("Delete Error:", err);
      // Check for Foreign Key constraint error (likely cause)
      if (err.response?.data?.error?.includes('foreign key constraint')) {
        alert("Cannot delete this sender because it has been used in past campaigns. Deleting it would break your campaign history.");
      } else {
        alert("Failed to delete sender. Please try again.");
      }
    }
  };

  const handleAddSubmit = async (data) => {
    setIsSaving(true);
    try {
      const res = await api.post('/email/senders', data);
      if (res.data.success) {
        setSenders(prev => [res.data.data, ...prev]);
        setIsModalOpen(false);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add sender. Ensure your App Password is correct.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-full">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800">Sender Accounts</h3>
            <p className="text-xs text-slate-500 mt-1">SMTP Credentials</p>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="p-4 space-y-3 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          {loading ? (
            <div className="flex justify-center p-8"><Loader2 className="animate-spin text-indigo-400 w-6 h-6" /></div>
          ) : senders.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-center text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-xl m-2">
              <p>No accounts connected.</p>
              <button onClick={() => setIsModalOpen(true)} className="text-indigo-500 font-bold mt-1 hover:underline">Add First Sender</button>
            </div>
          ) : (
            senders.map(sender => (
              <SenderCard 
                key={sender.id} 
                sender={sender} 
                onDelete={handleDelete} 
              />
            ))
          )}
        </div>
      </div>

      <AddSenderModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddSubmit}
        isSaving={isSaving}
      />
    </>
  );
};

export default SenderManager;