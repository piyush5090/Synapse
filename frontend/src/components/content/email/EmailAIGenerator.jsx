import { useState } from 'react';
import api from '../../../services/api';
import { Loader2, Sparkles, Wand2, Image as ImageIcon, Type, RefreshCw, Code, Eye, PencilLine } from 'lucide-react';

const EmailAIGenerator = ({ onCreated }) => {
  const [prompt, setPrompt] = useState('');
  const [generateMode, setGenerateMode] = useState('both'); // 'text' | 'both'
  const [activeView, setActiveView] = useState('preview'); // 'preview' | 'code'
  
  // Loading States
  const [isGeneratingText, setIsGeneratingText] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Data State
  const [generatedResult, setGeneratedResult] = useState(null); 

  // --- Handlers ---
  const handleSubjectChange = (e) => {
    setGeneratedResult(prev => ({ ...prev, subject: e.target.value }));
  };

  const handleContentChange = (e) => {
    setGeneratedResult(prev => ({ ...prev, content: e.target.value }));
  };

  const handleGenerate = async () => {
    if (!prompt) return;
    
    setGeneratedResult(null);
    setIsGeneratingText(true);
    if (generateMode === 'both') setIsGeneratingImage(true);

    try {
      // 1. Generate Text
      const textRes = await api.post('/email/templates/generate-text', {
        topic: prompt,
        tone: 'professional'
      });

      if (textRes.data.success) {
        setGeneratedResult({
          subject: textRes.data.data.subject,
          content: textRes.data.data.content,
          imageUrl: null
        });
        
        setIsGeneratingText(false);

        // 2. Generate Image
        if (generateMode === 'both') {
          api.post('/email/templates/generate-image', { prompt })
            .then((imageRes) => {
              if (imageRes.data.success) {
                setGeneratedResult((prev) => ({
                  ...prev,
                  imageUrl: imageRes.data.imageUrl
                }));
              }
            })
            .catch((err) => console.error("Image Gen Failed", err))
            .finally(() => setIsGeneratingImage(false));
        }
      }

    } catch (err) {
      console.error("Generation Failed:", err);
      setIsGeneratingText(false);
      setIsGeneratingImage(false);
    }
  };

  const handleSave = async () => {
    if (!generatedResult) return;
    setIsSaving(true);

    try {
      const payload = {
        name: prompt.substring(0, 30) + (prompt.length > 30 ? "..." : ""), 
        subject: generatedResult.subject,
        text_content: generatedResult.content, 
        image_url: generatedResult.imageUrl 
      };

      const res = await api.post('/email/templates', payload);

      if (res.data.success) {
        onCreated(res.data.data);
        setGeneratedResult(null);
        setPrompt('');
      }
    } catch (err) {
      console.error("Save Failed:", err);
      alert("Failed to save template.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[800px] transition-all duration-300">
      
      {/* 1. Header & Toolbar */}
      <div className="shrink-0 p-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-emerald-600" />
          AI Email Creator
        </h2>

        {/* View Toggles */}
        {generatedResult && (
          <div className="flex bg-slate-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveView('code')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'code' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Code className="w-3.5 h-3.5" /> HTML
            </button>
            <button
              onClick={() => setActiveView('preview')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                activeView === 'preview' ? 'bg-white shadow-sm text-emerald-600' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" /> Preview
            </button>
          </div>
        )}
      </div>

      {/* 2. Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-slate-200">
        
        {!generatedResult && !isGeneratingText ? (
          /* --- INPUT MODE --- */
          <div className="flex flex-col gap-6 h-full animate-in fade-in slide-in-from-bottom-4">
            <div className="flex gap-2 p-1 bg-slate-100 rounded-lg w-fit">
              <button
                onClick={() => setGenerateMode('text')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  generateMode === 'text' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'
                }`}
              >
                <Type className="w-4 h-4" /> Text Only
              </button>
              <button
                onClick={() => setGenerateMode('both')}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  generateMode === 'both' ? 'bg-white shadow text-emerald-700' : 'text-slate-500'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> Text + Image
              </button>
            </div>

            <textarea
              className="w-full h-40 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none resize-none text-slate-700 placeholder:text-slate-400"
              placeholder={generateMode === 'both' 
                ? "Describe your email topic and the banner image style..." 
                : "Describe the email topic..."}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />

            <button
              onClick={handleGenerate}
              disabled={!prompt}
              className="mt-auto w-full py-4 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-md"
            >
              <Wand2 className="w-4 h-4" /> Generate Draft
            </button>
          </div>

        ) : isGeneratingText ? (
           /* --- LOADING STATE --- */
           <div className="flex flex-col items-center justify-center h-full space-y-4 animate-in fade-in">
              <div className="relative">
                <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
                </div>
              </div>
              <p className="text-slate-500 font-medium">Writing your email content...</p>
           </div>

        ) : (
          /* --- RESULT MODE --- */
          <div className="flex flex-col h-full gap-4 animate-in fade-in zoom-in-95">
            
            {/* A. IMAGE SECTION */}
            {generateMode === 'both' && (
              <div className="shrink-0 relative rounded-xl overflow-hidden border border-slate-200 bg-slate-50 h-48">
                {generatedResult.imageUrl ? (
                  <img src={generatedResult.imageUrl} alt="AI Banner" className="w-full h-full object-cover animate-in fade-in duration-700" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-100 text-slate-400 gap-3">
                     <div className="w-full h-full absolute bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]"></div>
                     <Sparkles className="w-6 h-6 animate-spin-slow text-indigo-400" />
                     <span className="text-xs font-medium animate-pulse text-indigo-500">Creating AI Art...</span>
                  </div>
                )}
              </div>
            )}

            {/* B. SUBJECT */}
            <div className="shrink-0">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                Subject Line <PencilLine className="w-3 h-3" />
              </label>
              <input
                value={generatedResult.subject}
                onChange={handleSubjectChange}
                className="w-full p-3 bg-white border border-slate-200 rounded-lg text-slate-800 font-medium text-sm focus:ring-2 focus:ring-emerald-500 outline-none transition-shadow"
              />
            </div>

            {/* C. EDITOR AREA (The "Bulletproof" Layout) */}
            <div className="flex-1 flex flex-col min-h-[300px] border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                {/* We use relative + absolute inset-0 to ensure the editor fills exactly 100% of this container */}
                <div className="relative flex-1">
                    {activeView === 'preview' ? (
                        <div className="absolute inset-0 p-4 overflow-y-auto prose prose-sm max-w-none scrollbar-thin scrollbar-thumb-slate-200">
                             <div dangerouslySetInnerHTML={{ __html: generatedResult.content }} />
                        </div>
                    ) : (
                        <textarea 
                            className="absolute inset-0 w-full h-full p-4 bg-slate-100 text-emerald-400 font-mono text-sm resize-none focus:outline-none scrollbar-thin scrollbar-thumb-slate-700"
                            value={generatedResult.content}
                            onChange={handleContentChange}
                            spellCheck="false"
                        />
                    )}
                </div>
            </div>

            {/* D. ACTIONS */}
            <div className="shrink-0 grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setGeneratedResult(null)}
                className="py-3 px-4 rounded-lg border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" /> Discard
              </button>
              <button 
                onClick={handleSave}
                disabled={isSaving || isGeneratingImage}
                className="py-3 px-4 rounded-lg bg-emerald-600 text-white font-medium hover:bg-emerald-700 shadow-md shadow-emerald-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="animate-spin w-4 h-4" /> : "Save Template"}
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default EmailAIGenerator;