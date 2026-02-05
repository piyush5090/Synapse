import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addGeneratedPost } from '../../features/posts/generatedPostsSlice';
import api from '../../services/api';
import { Upload, X, Save, Loader2 } from 'lucide-react';

const ManualUploader = () => {
  const dispatch = useDispatch();
  const [manualImageFile, setManualImageFile] = useState(null);
  const [manualPreviewUrl, setManualPreviewUrl] = useState(null);
  const [manualCaption, setManualCaption] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);

  const handleManualFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setManualImageFile(file);
      setManualPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSaveManual = async () => {
    if (!manualImageFile) return;
    setUploadLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', manualImageFile);
      formData.append('caption', manualCaption);

      const extractedTags = manualCaption.match(/#[a-z0-9_]+/gi) || [];
      if (extractedTags.length > 0) {
        extractedTags.forEach(tag => formData.append('hashtags[]', tag));
      } else {
        formData.append('hashtags[]', '#manual');
      }

      const res = await api.post('/content/manual', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.data) {
        dispatch(addGeneratedPost(res.data.data));
        handleCancelManual();
      }
    } catch (err) {
      console.error("Manual upload failed:", err);
      alert("Failed to upload post.");
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCancelManual = () => {
    setManualImageFile(null);
    setManualPreviewUrl(null);
    setManualCaption('');
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden h-[800px]">
      <div className="bg-blue-50/50 border-b border-blue-100 px-6 py-4 shrink-0">
        <h2 className="text-sm font-bold text-blue-900 uppercase tracking-wider flex items-center gap-2">
          <Upload size={16} /> Manual Upload
        </h2>
      </div>

      <div className="p-6 flex flex-col gap-6 h-full overflow-hidden">
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto min-h-0">
          {/* Drop Zone / Preview */}
          <div className="relative w-full aspect-video sm:aspect-[4/3] rounded-xl border-2 border-dashed border-slate-100 bg-slate-50 overflow-hidden group transition-all hover:border-blue-200 hover:bg-blue-50/10 shrink-0">
            {manualPreviewUrl ? (
              <>
                <img src={manualPreviewUrl} alt="Upload" className="w-full h-full object-cover" />
                <button onClick={handleCancelManual} className="absolute top-2 right-2 p-1.5 bg-white/90 text-slate-600 rounded-full hover:text-red-600 transition-colors shadow-sm">
                  <X size={14} />
                </button>
              </>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
                <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform text-blue-500">
                  <Upload size={20} />
                </div>
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Click to Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleManualFileChange} />
              </label>
            )}
          </div>

          <div className="flex-1 flex flex-col gap-2 min-h-[100px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wide">Caption & Hashtags</label>
            <textarea
              value={manualCaption}
              onChange={(e) => setManualCaption(e.target.value)}
              placeholder="Type your caption here..."
              className="w-full flex-1 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-700 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none resize-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50 shrink-0">
          <button onClick={handleCancelManual} disabled={!manualPreviewUrl && !manualCaption} className="rounded-xl border border-slate-200 py-3 text-sm font-bold text-slate-900 hover:bg-slate-50 transition-all disabled:opacity-50">Clear</button>
          <button onClick={handleSaveManual} disabled={!manualPreviewUrl || uploadLoading} className="rounded-xl bg-blue-600 py-3 text-sm font-bold text-white hover:bg-blue-700 transition-all flex justify-center gap-2 items-center shadow-lg shadow-blue-600/20 disabled:opacity-50">
            {uploadLoading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save Post
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManualUploader;