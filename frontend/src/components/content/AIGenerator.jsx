import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addGeneratedPost } from '../../features/posts/generatedPostsSlice';
import api from '../../services/api';
import { Sparkles, Save, RefreshCcw, Image as ImageIcon, Loader2, AlertTriangle, CheckSquare, Square } from 'lucide-react';

const AIGenerator = ({ business }) => {
  const dispatch = useDispatch();

  // Local State
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGeneratedImage, setAiGeneratedImage] = useState(null);
  const [aiCaption, setAiCaption] = useState('');
  const [imagePrompt, setImagePrompt] = useState('');
  const [genOptionText, setGenOptionText] = useState(true);
  const [genOptionImage, setGenOptionImage] = useState(true);
  const [generationLoading, setGenerationLoading] = useState(false);
  const [imageError, setImageError] = useState(null);

  // Handlers
  const handleGenerate = async () => {
    if (!business?.id) return alert('Please create a business profile first.');
    if (!genOptionText && !genOptionImage) return alert('Select at least one option.');

    setGenerationLoading(true);
    setImageError(null);
    if (genOptionImage) setAiGeneratedImage(null);

    try {
      const res = await api.post('/content/generate-ad', {
        userPrompt: aiPrompt,
        businessDetails: business,
        generateImage: genOptionImage,
        generateText: genOptionText
      });

      const data = res.data.data;

      // Update Text
      if (genOptionText && data.caption) {
        const hashtagsString = (data.hashtags || []).map(t => t.startsWith('#') ? t : `#${t}`).join(' ');
        setAiCaption(`${data.caption}\n\n${hashtagsString}`);
      }

      // Update Image
      if (genOptionImage) {
        if (data.image_url) {
          setAiGeneratedImage(data.image_url);
          setImagePrompt(data.image_prompt);
        } else {
          setImageError("Quota exceeded. Try uploading manually.");
        }
      }
    } catch (err) {
      console.error("Generation failed:", err);
      alert(err.response?.data?.message || "Generation failed.");
    } finally {
      setGenerationLoading(false);
    }
  };

  const handleSaveAiPost = async () => {
    if (!aiGeneratedImage) return alert("Image is required to save.");

    try {
      const extractedTags = aiCaption.match(/#[a-z0-9_]+/gi) || [];
      const res = await api.post('/content', {
        user_prompt: aiPrompt,
        caption: aiCaption,
        hashtags: extractedTags,
        image_prompt: imagePrompt || "Generated via Synapse AI",
        image_url: aiGeneratedImage
      });

      if (res.data.data) {
        dispatch(addGeneratedPost(res.data.data));
        handleCancelAi();
      }
    } catch (err) {
      console.error("Save failed", err);
      alert("Failed to save post.");
    }
  };

  const handleCancelAi = () => {
    setAiGeneratedImage(null);
    setAiCaption('');
    setImagePrompt('');
    setImageError(null);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[800px]">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-100 px-6 py-4 flex justify-between items-center shrink-0">
        <h2 className="text-sm font-bold text-purple-900 uppercase tracking-wider flex items-center gap-2">
          <Sparkles size={16} /> AI Generator
        </h2>
        {generationLoading && <span className="text-xs font-bold text-purple-600 animate-pulse tracking-wide">PROCESSING...</span>}
      </div>

      <div className="p-6 flex flex-col h-full overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0 mb-4">
          
          {/* Preview Image */}
          <div className="relative w-full aspect-video sm:aspect-[4/3] rounded-xl border-2 border-dashed border-slate-100 bg-slate-50 flex flex-col items-center justify-center overflow-hidden shrink-0 transition-all group">
            {aiGeneratedImage ? (
              <>
                <img src={aiGeneratedImage} alt="AI Generated" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">AI Generated</div>
              </>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                {imageError ? (
                  <div className="text-center px-4">
                    <AlertTriangle size={32} className="mb-2 text-amber-500 mx-auto" />
                    <span className="text-xs font-bold text-amber-600 uppercase tracking-wider block max-w-[250px]">{imageError}</span>
                  </div>
                ) : (
                  <>
                    <ImageIcon size={32} className="mb-2 opacity-20" />
                    <span className="text-xs font-medium uppercase tracking-wider opacity-60">Image Preview</span>
                  </>
                )}
              </div>
            )}

            {/* Nano Loader */}
            {generationLoading && (
              <div className="absolute inset-0 z-50 bg-white/95 backdrop-blur-sm flex flex-col items-center justify-center">
                <div className="mb-8 relative">
                  <div className="text-2xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-500 to-indigo-600 animate-pulse">
                    GENERATING_ASSETS
                  </div>
                </div>
                <div className="w-48 h-1.5 bg-slate-100 rounded-full overflow-hidden relative">
                  <div className="absolute top-0 left-0 h-full w-1/3 bg-gradient-to-r from-transparent via-purple-500 to-transparent animate-[shimmer_1s_infinite_linear]" style={{ transform: 'skewX(-20deg)' }}></div>
                </div>
              </div>
            )}
          </div>

          {/* Caption Box */}
          <div className="flex-1 flex flex-col gap-2 min-h-[100px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide flex justify-between">
              <span>Caption & Hashtags</span>
              {(aiCaption || aiGeneratedImage) && <span className="text-purple-600">Editable</span>}
            </label>
            <textarea
              value={aiCaption}
              onChange={(e) => setAiCaption(e.target.value)}
              disabled={(!aiCaption && !aiGeneratedImage) || generationLoading}
              placeholder="Caption will appear here..."
              className="w-full flex-1 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none resize-none disabled:bg-slate-50 transition-all"
            />
          </div>
        </div>

        {/* Buttons */}
        {(aiGeneratedImage || aiCaption) && (
          <div className="grid grid-cols-2 gap-3 pb-4 shrink-0">
            <button onClick={handleCancelAi} className="rounded-xl border border-slate-200 py-2 text-sm font-bold text-slate-600 hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all flex justify-center gap-2 items-center">
              <RefreshCcw size={16} /> Discard
            </button>
            <button onClick={handleSaveAiPost} disabled={!aiGeneratedImage} className="rounded-xl bg-emerald-600 py-2 text-sm font-bold text-white hover:bg-emerald-700 transition-all flex justify-center gap-2 items-center shadow-lg shadow-emerald-600/20 disabled:opacity-50">
              <Save size={16} /> Save Post
            </button>
          </div>
        )}

        {/* Input Area */}
        <div className="pt-4 border-t border-slate-100 shrink-0 bg-white">
          <div className="flex gap-4 mb-3">
            <label className="flex items-center gap-2 cursor-pointer group">
              <button onClick={() => setGenOptionText(!genOptionText)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${genOptionText ? 'bg-purple-600 border-purple-600' : 'border-slate-300 bg-white'}`}>
                {genOptionText && <Sparkles size={10} className="text-white" />}
              </button>
              <span className="text-xs font-bold text-slate-600 group-hover:text-purple-600">Generate Text</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer group">
              <button onClick={() => setGenOptionImage(!genOptionImage)} className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${genOptionImage ? 'bg-purple-600 border-purple-600' : 'border-slate-300 bg-white'}`}>
                {genOptionImage && <ImageIcon size={10} className="text-white" />}
              </button>
              <span className="text-xs font-bold text-slate-600 group-hover:text-purple-600">Generate Image</span>
            </label>
          </div>

          <div className="relative">
            <textarea
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder={aiGeneratedImage ? "Refine your prompt..." : "Describe your ad concept..."}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 p-4 pr-32 text-sm focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 outline-none resize-none h-20 transition-all shadow-inner"
            />
            <button
              onClick={handleGenerate}
              disabled={!aiPrompt.trim() || generationLoading || (!genOptionText && !genOptionImage)}
              className="absolute top-2 right-2 bottom-2 rounded-lg bg-slate-900 px-4 text-xs font-bold text-white hover:bg-purple-600 transition-all disabled:opacity-50 flex items-center gap-2 shadow-md"
            >
              {generationLoading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
              {aiGeneratedImage || aiCaption ? 'Retry' : 'Generate'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIGenerator;