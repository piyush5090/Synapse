import { useState } from 'react';
import api from '../services/api'; // Adjust path if needed
import ViewTemplateModal from '../components/modals/ViewTemplateModal';
import { Trash2, Calendar, Edit3, Loader2, Mail, Eye, Save, X } from 'lucide-react';

const EmailTemplateCard = ({ template, onDeleted, onUpdate }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  
  // --- Edit Mode State ---
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Local form state
  const [editSubject, setEditSubject] = useState(template.subject || "");
  // We use the raw content for editing. 
  // NOTE: If your content is complex HTML, editing it in a textarea will show raw tags.
  const [editContent, setEditContent] = useState(template.content || template.text_content || "");

  // Helpers
  const hasImage = !!template.image_url;
  const plainTextPreview = (template.content || "").replace(/<[^>]*>?/gm, '').substring(0, 150) + "...";

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // --- Handlers ---

  const handleEditClick = (e) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleCancelEdit = (e) => {
    e.stopPropagation();
    setIsEditing(false);
    // Reset fields to original
    setEditSubject(template.subject || "");
    setEditContent(template.content || template.text_content || "");
  };

  const handleSave = async (e) => {
    e.stopPropagation();
    setIsSaving(true);
    try {
      const res = await api.put(`/email/templates/${template.id}`, {
        subject: editSubject,
        text_content: editContent
      });

      if (res.data.success) {
        setIsEditing(false);
        // Notify parent to refresh list or update local data
        if (onUpdate) onUpdate(res.data.data); 
      }
    } catch (err) {
      console.error("Update failed", err);
      alert("Failed to update template.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this template permanently?")) return;
    
    setIsDeleting(true);
    try {
      const res = await api.delete(`/email/templates/${template.id}`);
      if (res.data.success) {
        onDeleted(template.id); 
      }
    } catch (err) {
      console.error("Delete failed", err);
      setIsDeleting(false); 
    }
  };

  // --- Render ---

  return (
    <>
      <div 
        className={`group relative bg-white rounded-xl border border-slate-200 overflow-hidden transition-all duration-300 flex flex-col h-[340px] ${isEditing ? 'ring-2 ring-indigo-500 shadow-lg' : 'hover:shadow-lg hover:-translate-y-1 cursor-pointer'}`}
        onClick={() => !isEditing && setIsViewModalOpen(true)}
      >
        
        {/* --- A. Image Section (Hidden while editing to give space) --- */}
        {!isEditing && (
          <div className={`h-32 relative shrink-0 overflow-hidden ${!hasImage ? 'bg-gradient-to-br from-slate-50 to-indigo-50/50 flex items-center justify-center' : 'bg-slate-100'}`}>
            {hasImage ? (
              <img 
                src={template.image_url} 
                alt="Banner" 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              />
            ) : (
              <Mail className="w-10 h-10 text-indigo-200/50" />
            )}
            
            {/* Quick View Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
              <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-slate-700 flex items-center gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                  <Eye className="w-3 h-3" /> Quick View
              </div>
            </div>

            {/* Date Badge */}
            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-slate-600 shadow-sm border border-slate-100 flex items-center gap-1">
              <Calendar className="w-3 h-3 text-indigo-500" />
              {formatDate(template.created_at)}
            </div>
          </div>
        )}

        {/* --- B. Content Body (Editable) --- */}
        <div className="p-4 flex flex-col flex-1 relative bg-white">
          {isEditing ? (
            /* EDIT MODE INPUTS */
            <div className="flex flex-col h-full gap-3" onClick={e => e.stopPropagation()}>
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-bold text-slate-400">Subject Line</label>
                <input 
                  type="text"
                  value={editSubject}
                  onChange={e => setEditSubject(e.target.value)}
                  className="w-full p-2 text-sm font-bold text-slate-800 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
                  placeholder="Subject..."
                />
              </div>
              <div className="space-y-1 flex-1 flex flex-col">
                <label className="text-[10px] uppercase font-bold text-slate-400">Content</label>
                <textarea 
                  value={editContent}
                  onChange={e => setEditContent(e.target.value)}
                  className="w-full flex-1 p-2 text-xs text-slate-600 border border-slate-200 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                  placeholder="Email HTML or Text..."
                />
              </div>
            </div>
          ) : (
            /* VIEW MODE DISPLAY */
            <>
              <h3 className="font-bold text-slate-800 text-sm leading-snug line-clamp-1 mb-2 group-hover:text-indigo-600 transition-colors" title={template.subject}>
                {template.subject || "Untitled Template"}
              </h3>
              
              <div className="flex-1 overflow-hidden relative">
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-4">
                  {plainTextPreview}
                </p>
                <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-white to-transparent" />
              </div>
            </>
          )}
        </div>

        {/* --- C. Action Bar --- */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 shrink-0">
           {isEditing ? (
             /* EDIT MODE ACTIONS */
             <div className="flex w-full gap-2">
               <button 
                 onClick={handleCancelEdit}
                 disabled={isSaving}
                 className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-slate-100 transition-colors flex items-center justify-center gap-1.5"
               >
                 <X className="w-3.5 h-3.5" /> Cancel
               </button>
               <button 
                 onClick={handleSave}
                 disabled={isSaving}
                 className="flex-1 py-2 rounded-lg bg-indigo-600 text-white font-semibold text-xs hover:bg-indigo-700 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
               >
                 {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Save className="w-3.5 h-3.5" /> Save</>}
               </button>
             </div>
           ) : (
             /* VIEW MODE ACTIONS */
             <>
               <button 
                 onClick={handleEditClick}
                 className="flex-1 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 font-semibold text-xs hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-100 transition-colors flex items-center justify-center gap-1.5 shadow-sm"
               >
                  <Edit3 className="w-3.5 h-3.5" /> Edit
               </button>
               
               <button 
                 onClick={handleDelete}
                 disabled={isDeleting}
                 className="p-2 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
                 title="Delete"
               >
                 {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
               </button>
             </>
           )}
        </div>
      </div>

      {/* Preview Modal (Only opens in View Mode) */}
      <ViewTemplateModal 
        isOpen={isViewModalOpen} 
        onClose={() => setIsViewModalOpen(false)} 
        template={template}
      />
    </>
  );
};

export default EmailTemplateCard;