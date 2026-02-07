import { useState, useEffect } from 'react';
import api from '../services/api';
import AddRecipientModal from './modals/AddRecipientModal';
import { Users, Trash2, Plus, CheckSquare, Square, Loader2, ArrowDownCircle } from 'lucide-react';

const RecipientManager = () => {
  // Data
  const [recipients, setRecipients] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  
  // UI State
  const [loading, setLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Pagination
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const LIMIT = 5;

  // Selection
  const [selectedIds, setSelectedIds] = useState([]);

  // --- 1. Fetch Logic ---
  const fetchRecipients = async (pageNum = 1, reset = false) => {
    try {
      if (pageNum === 1) setLoading(true);
      const res = await api.get(`/email/recipients?page=${pageNum}&limit=${LIMIT}`);
      
      if (res.data.success) {
        const newData = res.data.data;
        setTotalCount(res.data.count || 0);

        if (reset) {
          setRecipients(newData);
        } else {
          setRecipients(prev => [...prev, ...newData]);
        }
        setHasMore(newData.length === LIMIT);
      }
    } catch (err) {
      console.error("Failed to load recipients", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients(1, true);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchRecipients(nextPage, false);
  };

  // --- 2. Action Handlers ---
  const handleAddSubmit = async (emailList) => {
    setIsProcessing(true);
    try {
      const res = await api.post('/email/recipients', { emails: emailList });
      if (res.data.success) {
        // Refresh list completely to show new items at top
        setPage(1);
        fetchRecipients(1, true);
        setIsModalOpen(false);
        // Optional: Toast success message here
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save recipients.");
    } finally {
      setIsProcessing(false);
    }
  };

  const deleteSelected = async () => {
    if (!window.confirm(`Delete ${selectedIds.length} recipients?`)) return;
    setIsDeleting(true);
    try {
      await Promise.all(selectedIds.map(id => api.delete(`/email/recipients/${id}`)));
      setRecipients(prev => prev.filter(r => !selectedIds.includes(r.id)));
      setTotalCount(prev => prev - selectedIds.length);
      setSelectedIds([]);
    } catch (err) {
      alert("Error deleting items.");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleSelectAll = () => {
    setSelectedIds(selectedIds.length === recipients.length ? [] : recipients.map(r => r.id));
  };

  const toggleSelectOne = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // --- 3. Render ---
  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 flex flex-col h-[400px] overflow-hidden">
        
        {/* Fixed Header */}
        <div className="shrink-0 p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" /> Audience
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {loading && page === 1 ? "Loading..." : `${totalCount} Recipients`}
            </p>
          </div>

          <div className="flex gap-2">
            {selectedIds.length > 0 && (
              <button 
                onClick={deleteSelected}
                disabled={isDeleting}
                className="px-3 py-2 bg-red-50 text-red-600 text-xs font-bold rounded-lg hover:bg-red-100 transition-colors flex items-center gap-2"
              >
                {isDeleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                Delete ({selectedIds.length})
              </button>
            )}
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-3 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
        </div>

        {/* Scrollable List Area */}
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-200">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white sticky top-0 z-10 shadow-sm ring-1 ring-slate-100">
              <tr>
                <th className="p-3 w-10 border-b border-slate-100 bg-slate-50/80 backdrop-blur">
                  <button onClick={toggleSelectAll} className="flex items-center text-slate-400 hover:text-indigo-600">
                     {selectedIds.length > 0 && selectedIds.length === recipients.length 
                       ? <CheckSquare className="w-5 h-5 text-indigo-600" /> 
                       : <Square className="w-5 h-5" />}
                  </button>
                </th>
                <th className="p-3 text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 bg-slate-50/80 backdrop-blur">
                  Email Address
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading && page === 1 ? (
                 [1,2,3].map(i => (
                   <tr key={i}>
                     <td className="p-4"><div className="w-5 h-5 bg-slate-100 rounded animate-pulse"/></td>
                     <td className="p-4"><div className="w-48 h-4 bg-slate-100 rounded animate-pulse"/></td>
                   </tr>
                 ))
              ) : recipients.length === 0 ? (
                <tr>
                  <td colSpan="2" className="py-20 text-center text-slate-400 text-sm">
                    No recipients yet.
                  </td>
                </tr>
              ) : (
                recipients.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 group transition-colors">
                    <td className="p-3">
                      <button onClick={() => toggleSelectOne(r.id)} className={`flex items-center transition-colors ${selectedIds.includes(r.id) ? 'text-indigo-600' : 'text-slate-300 group-hover:text-slate-400'}`}>
                        {selectedIds.includes(r.id) ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                      </button>
                    </td>
                    <td className="p-3 text-sm text-slate-700 font-medium font-mono">{r.email}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Load More Trigger */}
          {hasMore && !loading && recipients.length > 0 && (
            <div className="p-4 flex justify-center border-t border-slate-50">
              <button 
                onClick={handleLoadMore}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 hover:bg-indigo-50 px-4 py-2 rounded-full transition-colors flex items-center gap-2 border border-indigo-100"
              >
                <ArrowDownCircle className="w-3.5 h-3.5" /> Load More
              </button>
            </div>
          )}
          {loading && page > 1 && (
             <div className="p-4 flex justify-center text-slate-400"><Loader2 className="w-5 h-5 animate-spin" /></div>
          )}
        </div>
      </div>

      {/* Modal is completely separated now */}
      <AddRecipientModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleAddSubmit}
        isProcessing={isProcessing}
      />
    </>
  );
};

export default RecipientManager;