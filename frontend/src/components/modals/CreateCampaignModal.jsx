import { useState, useEffect } from 'react';
import api from '../../services/api';
import { X, Loader2, Calendar, Check, AlertCircle, ShieldCheck, FileText, ChevronDown, Users, CheckSquare, Square, MinusSquare } from 'lucide-react';

const CreateCampaignModal = ({ isOpen, onClose, onSuccess }) => {
  // --- Animation State ---
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  // --- Data State ---
  const [senders, setSenders] = useState([]);
  const [templates, setTemplates] = useState([]);
  
  // Recipient Pagination State
  const [recipientsList, setRecipientsList] = useState([]);
  const [recipientPage, setRecipientPage] = useState(1);
  const [recipientsHasMore, setRecipientsHasMore] = useState(true);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);

  // --- Selection State ---
  const [selectedSender, setSelectedSender] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [selectedRecipientIds, setSelectedRecipientIds] = useState(new Set());
  const [scheduleTime, setScheduleTime] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // --- Animation Effect ---
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      fetchInitialData();
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // --- Data Fetching ---
  const fetchInitialData = async () => {
    try {
      const [senderRes, tmplRes] = await Promise.all([
        api.get('/email/senders'),
        api.get('/email/templates')
      ]);
      if(senderRes.data.success) setSenders(senderRes.data.data);
      if(tmplRes.data.success) setTemplates(tmplRes.data.data);
      
      setRecipientsList([]);
      setRecipientPage(1);
      setSelectedRecipientIds(new Set());
      fetchRecipientsPage(1);
    } catch (err) {
      console.error("Init data failed", err);
    }
  };

  const fetchRecipientsPage = async (page) => {
    setIsLoadingRecipients(true);
    try {
      const res = await api.get(`/email/recipients?page=${page}&limit=20`); 
      if (res.data.success) {
        const newData = res.data.data;
        setRecipientsList(prev => page === 1 ? newData : [...prev, ...newData]);
        setRecipientsHasMore(newData.length === 20);
      }
    } catch (err) { console.error(err); }
    finally { setIsLoadingRecipients(false); }
  };

  const loadMoreRecipients = (e) => {
    e.preventDefault();
    const next = recipientPage + 1;
    setRecipientPage(next);
    fetchRecipientsPage(next);
  };

  // --- Selection Logic ---
  const toggleRecipient = (id) => {
    const newSet = new Set(selectedRecipientIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      if (newSet.size >= 400) return alert("Max 400 recipients allowed per blast.");
      newSet.add(id);
    }
    setSelectedRecipientIds(newSet);
  };

  const toggleSelectAll = () => {
    const allLoadedIds = recipientsList.map(r => r.id);
    const allSelected = allLoadedIds.every(id => selectedRecipientIds.has(id));

    if (allSelected) {
      // Deselect all loaded
      const newSet = new Set(selectedRecipientIds);
      allLoadedIds.forEach(id => newSet.delete(id));
      setSelectedRecipientIds(newSet);
    } else {
      // Select all loaded (up to limit)
      const newSet = new Set(selectedRecipientIds);
      let addedCount = 0;
      for (const id of allLoadedIds) {
        if (newSet.size >= 400) {
          alert(`Limit reached! Selected ${newSet.size} recipients.`);
          break;
        }
        if (!newSet.has(id)) {
          newSet.add(id);
          addedCount++;
        }
      }
      setSelectedRecipientIds(newSet);
    }
  };

  // Helper to determine Select All icon state
  const getSelectAllIcon = () => {
    if (recipientsList.length === 0) return <Square className="w-4 h-4" />;
    const allLoadedSelected = recipientsList.every(r => selectedRecipientIds.has(r.id));
    const someLoadedSelected = recipientsList.some(r => selectedRecipientIds.has(r.id));

    if (allLoadedSelected) return <CheckSquare className="w-4 h-4 text-indigo-600" />;
    if (someLoadedSelected) return <MinusSquare className="w-4 h-4 text-indigo-600" />;
    return <Square className="w-4 h-4 text-slate-300" />;
  };

  const handleCreate = async () => {
    if (!selectedSender || !selectedTemplate || !scheduleTime || selectedRecipientIds.size === 0) {
      return alert("Please fill in all fields (Sender, Template, Recipients, Time).");
    }
    
    setIsSubmitting(true);
    try {
      const payload = {
        senderId: selectedSender,
        templateId: selectedTemplate,
        recipientIds: Array.from(selectedRecipientIds),
        scheduledAt: new Date(scheduleTime).toISOString()
      };

      const res = await api.post('/email/campaigns', payload);
      if (res.data.success) {
        onSuccess();
        onClose();
      }
    } catch (err) {
      alert("Failed to create campaign: " + (err.response?.data?.error || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${isVisible ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 opacity-0'}`}>
      <div className={`bg-white rounded-2xl shadow-2xl w-full max-w-2xl flex flex-col max-h-[90vh] transition-all duration-300 ease-out ${isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'}`}>
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Create Campaign</h2>
            <p className="text-sm text-slate-500">Configure your email blast</p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><X className="w-5 h-5 text-slate-500" /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* 1. Template */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <FileText className="w-4 h-4" /> 1. Select Content Template
            </label>
            <select 
              className="w-full p-3 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none transition-shadow"
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
            >
              <option value="">-- Choose a Template --</option>
              {templates.map(t => (
                <option key={t.id} value={t.id}>{t.name || t.subject} ({new Date(t.created_at).toLocaleDateString()})</option>
              ))}
            </select>
          </div>

          {/* 2. Sender */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4" /> 2. Select Sender Identity
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {senders.map(sender => (
                <label key={sender.id} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${selectedSender === sender.id ? 'border-indigo-500 bg-indigo-50/50 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-indigo-200'}`}>
                  <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${selectedSender === sender.id ? 'border-indigo-600' : 'border-slate-300'}`}>
                    {selectedSender === sender.id && <div className="w-2.5 h-2.5 bg-indigo-600 rounded-full" />}
                  </div>
                  <span className="text-sm font-medium text-slate-700 truncate">{sender.email}</span>
                  <input type="radio" name="sender" value={sender.id} className="hidden" onChange={() => setSelectedSender(sender.id)} />
                </label>
              ))}
              {senders.length === 0 && <p className="text-sm text-slate-400 italic">No senders found. Add one in the dashboard.</p>}
            </div>
          </div>

          {/* 3. Recipients */}
          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                <Users className="w-4 h-4" /> 3. Select Recipients
              </label>
              <div className="flex items-center gap-3">
                {/* Select All Toggle */}
                {recipientsList.length > 0 && (
                  <button 
                    onClick={toggleSelectAll} 
                    className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    {getSelectAllIcon()}
                    Select All Loaded
                  </button>
                )}
                <span className={`text-xs font-bold ${selectedRecipientIds.size > 400 ? 'text-red-500' : 'text-indigo-600'}`}>
                  {selectedRecipientIds.size} / 400 Selected
                </span>
              </div>
            </div>
            
            <div className="h-56 border border-slate-200 rounded-xl overflow-hidden flex flex-col bg-slate-50/30">
               <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin scrollbar-thumb-slate-200">
                 {recipientsList.map(r => (
                   <label key={r.id} className="flex items-center gap-3 p-2 hover:bg-white rounded-lg cursor-pointer transition-colors group">
                     <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedRecipientIds.has(r.id) ? 'bg-indigo-600 border-indigo-600' : 'border-slate-300 bg-white'}`}>
                        {selectedRecipientIds.has(r.id) && <Check className="w-3 h-3 text-white" />}
                     </div>
                     <input 
                       type="checkbox" 
                       checked={selectedRecipientIds.has(r.id)} 
                       onChange={() => toggleRecipient(r.id)}
                       className="hidden"
                     />
                     <span className="text-sm text-slate-700 font-mono group-hover:text-indigo-700">{r.email}</span>
                   </label>
                 ))}
                 
                 {recipientsHasMore && (
                   <button 
                     onClick={loadMoreRecipients}
                     disabled={isLoadingRecipients}
                     className="w-full py-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 rounded-lg mt-2 flex justify-center gap-2 items-center"
                   >
                     {isLoadingRecipients ? <Loader2 className="w-3 h-3 animate-spin" /> : <ChevronDown className="w-3 h-3" />}
                     Load More Recipients
                   </button>
                 )}
                 {recipientsList.length === 0 && <p className="text-center text-slate-400 text-sm py-4">No recipients found.</p>}
               </div>
            </div>
          </div>

          {/* 4. Schedule */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
              <Calendar className="w-4 h-4" /> 4. Schedule Launch
            </label>
            <input 
              type="datetime-local" 
              className="w-full p-3 bg-slate-300 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              value={scheduleTime}
              onChange={(e) => setScheduleTime(e.target.value)}
            />
            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-blue-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p>Emails are processed in the background. Ensure your SMTP provider allows the volume you are sending.</p>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-50 transition-colors">Cancel</button>
          <button 
            onClick={handleCreate} 
            disabled={isSubmitting}
            className="px-6 py-3 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 shadow-md transition-all disabled:opacity-50 flex items-center gap-2 active:scale-95"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm & Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;