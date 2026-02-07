import { useState, useRef } from 'react';
import api from '../../../services/api';
import { PenTool, Save, Eye, Code, Loader2, ImagePlus, X } from 'lucide-react';

const EmailManualBuilder = ({ onCreated }) => {
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [isSaving, setIsSaving] = useState(false);
  
  // Image State
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    subject: '',
    content: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Image Handling ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); 
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // --- Submit Logic ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.content) return;

    setIsSaving(true);
    try {
      let uploadedImageUrl = null;

      // 1. Upload Image First (if selected)
      if (selectedFile) {
        const imageFormData = new FormData();
        imageFormData.append('image', selectedFile); 

        const uploadRes = await api.post('/email/templates/upload-image', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });

        if (uploadRes.data.success) {
          uploadedImageUrl = uploadRes.data.imageUrl;
        }
      }

      // 2. Save Template
      const autoName = formData.subject.length > 50 
        ? formData.subject.substring(0, 47) + "..." 
        : formData.subject;

      const res = await api.post('/email/templates', {
        name: autoName,
        subject: formData.subject,
        text_content: formData.content,
        image_url: uploadedImageUrl
      });

      if (res.data.success) {
        onCreated(res.data.data);
        
        // Reset Form
        setFormData({ subject: '', content: '' });
        handleRemoveImage();
        setActiveTab('write');
      }
    } catch (err) {
      console.error("Failed to save template:", err);
      alert("Failed to save template. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[800px]">
      
      {/* 1. Header */}
      <div className="shrink-0 p-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <PenTool className="w-5 h-5 text-blue-600" />
          Manual Builder
        </h2>
        
        {/* View Toggle */}
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('write')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'write' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            title="Edit Code"
          >
            <Code className="w-3.5 h-3.5" /> Code
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${activeTab === 'preview' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}
            title="Preview"
          >
            <Eye className="w-3.5 h-3.5" /> Preview
          </button>
        </div>
      </div>

      {/* 2. Form Body */}
      <form onSubmit={handleSubmit} className="flex-1 flex flex-col p-6 gap-6 overflow-hidden">
        
        {/* Top Section: Image & Subject (Scrollable if needed, but usually fits) */}
        <div className="flex flex-col gap-4 shrink-0">
            {/* Image Upload Area */}
            <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Header Image (Optional)
            </label>
            
            {!previewUrl ? (
                <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl h-20 flex flex-col items-center justify-center text-slate-400 hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all"
                >
                <div className="flex items-center gap-2">
                    <ImagePlus className="w-5 h-5" />
                    <span className="text-sm font-medium">Upload Banner</span>
                </div>
                </div>
            ) : (
                <div className="relative rounded-xl overflow-hidden border border-slate-200 group h-32 w-full bg-slate-50">
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 p-1.5 bg-white/90 rounded-full text-slate-600 hover:text-red-500 hover:bg-white shadow-sm opacity-0 group-hover:opacity-100 transition-all"
                >
                    <X className="w-4 h-4" />
                </button>
                </div>
            )}
            <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept="image/*"
            />
            </div>

            {/* Subject Input */}
            <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-500 uppercase">Subject Line</label>
            <input
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Special Offer: 50% Off Everything!"
                className="w-full p-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                required
            />
            </div>
        </div>

        {/* Middle Section: Content Editor (Fills remaining space) */}
        <div className="flex-1 flex flex-col min-h-0 border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="relative flex-1">
                {activeTab === 'write' ? (
                     <textarea
                     name="content"
                     value={formData.content}
                     onChange={handleChange}
                     placeholder="<p>Write your email content here...</p>"
                     className="absolute inset-0 w-full h-full p-4 font-mono text-sm text-slate-700 resize-none focus:outline-none scrollbar-thin scrollbar-thumb-slate-200"
                     required
                     spellCheck="false"
                   />
                ) : (
                    <div className="absolute inset-0 p-4 overflow-y-auto prose prose-sm max-w-none scrollbar-thin scrollbar-thumb-slate-200 bg-slate-50">
                    {previewUrl && (
                        <img src={previewUrl} alt="Header" className="w-full h-auto rounded-lg mb-4 object-cover max-h-48" />
                    )}
                    {formData.content ? (
                        <div dangerouslySetInnerHTML={{ __html: formData.content }} />
                    ) : (
                        <p className="text-slate-400 italic text-center mt-10">No content to preview...</p>
                    )}
                    </div>
                )}
            </div>
        </div>

        {/* Bottom Section: Action Button */}
        <div className="shrink-0 pt-2">
            <button
            type="submit"
            disabled={isSaving}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-sm"
            >
            {isSaving ? (
                <><Loader2 className="animate-spin w-4 h-4" /> Saving...</>
            ) : (
                <><Save className="w-4 h-4" /> Save Template</>
            )}
            </button>
        </div>
      </form>
    </div>
  );
};

export default EmailManualBuilder;