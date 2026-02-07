import { useState, useRef, useEffect } from 'react';
import Papa from 'papaparse';
import { FileSpreadsheet, X, Loader2 } from 'lucide-react';

const AddRecipientModal = ({ isOpen, onClose, onSubmit, isProcessing }) => {
  const [activeTab, setActiveTab] = useState('manual');
  const [manualText, setManualText] = useState('');
  const [csvFile, setCsvFile] = useState(null);
  const fileInputRef = useRef(null);
  const [localError, setLocalError] = useState('');
  
  // --- Animation State ---
  const [isVisible, setIsVisible] = useState(false); // Controls CSS classes
  const [shouldRender, setShouldRender] = useState(false); // Controls DOM existence

  useEffect(() => {
    if (isOpen) {
      // 1. Mount DOM
      setShouldRender(true);
      
      // 2. Reset Form Data on Open
      setManualText('');
      setCsvFile(null);
      setLocalError('');
      setActiveTab('manual');

      // 3. Trigger Enter Animation (Next Frame)
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      // 1. Trigger Exit Animation
      setIsVisible(false);

      // 2. Unmount DOM after transition (300ms matches duration-300)
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  // --- Processing Logic ---
  const handleProcessAndSubmit = async () => {
    setLocalError('');
    let emailList = [];

    try {
      if (activeTab === 'manual') {
        // Parse Text
        emailList = manualText.split(/[\n, ]+/).map(e => e.trim()).filter(e => e.includes('@'));
      } else {
        // Parse CSV
        if (!csvFile) return setLocalError("Please select a CSV file.");
        emailList = await new Promise((resolve, reject) => {
          Papa.parse(csvFile, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              const emails = results.data
                .map(row => row.email || row.Email || row.EMAIL)
                .filter(e => e && e.includes('@'));
              resolve(emails);
            },
            error: (err) => reject(err)
          });
        });
      }

      if (emailList.length === 0) return setLocalError("No valid email addresses found.");
      onSubmit(emailList);
      
    } catch (err) {
      console.error(err);
      setLocalError("Failed to parse file. Check format.");
    }
  };

  return (
    <div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-all duration-300 ease-out ${
        isVisible ? 'bg-black/60 backdrop-blur-sm opacity-100' : 'bg-black/0 backdrop-blur-none opacity-0'
      }`}
    >
      {/* Modal Card */}
      <div 
        className={`bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh] transition-all duration-300 ease-out ${
          isVisible ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-8 opacity-0'
        }`}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-lg text-slate-800">Add Recipients</h3>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-slate-200/50 transition-colors"
          >
            <X className="w-5 h-5 text-slate-400 hover:text-slate-600" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-100">
          <button 
            onClick={() => setActiveTab('manual')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'manual' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Manual Input
          </button>
          <button 
            onClick={() => setActiveTab('csv')}
            className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === 'csv' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:bg-slate-50'}`}
          >
            Upload CSV
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto">
          {localError && (
             <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100 animate-in slide-in-from-top-2 fade-in">
               {localError}
             </div>
          )}

          {activeTab === 'manual' ? (
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <label className="text-xs font-bold text-slate-500 uppercase">Paste Emails</label>
              <textarea 
                className="w-full h-40 p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono resize-none placeholder:text-slate-300 transition-shadow"
                placeholder={"john@example.com\nsarah@test.com"}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
              />
              <p className="text-[10px] text-slate-400">Separate by commas, spaces, or new lines.</p>
            </div>
          ) : (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-200 rounded-xl h-40 flex flex-col items-center justify-center text-slate-400 hover:border-indigo-400 hover:bg-indigo-50/50 cursor-pointer transition-all duration-200 group"
              >
                <FileSpreadsheet className="w-8 h-8 mb-2 text-indigo-300 group-hover:text-indigo-500 transition-colors" />
                <span className="text-sm font-medium text-slate-500 group-hover:text-indigo-600">
                  {csvFile ? csvFile.name : "Click to upload .csv file"}
                </span>
                <span className="text-xs mt-1 text-slate-300">Column "email" required</span>
              </div>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={(e) => setCsvFile(e.target.files[0])} 
                className="hidden" 
                accept=".csv"
              />
              
              <div className="bg-blue-50 p-3 rounded-lg flex gap-3">
                <div className="shrink-0 pt-0.5"><div className="w-4 h-4 rounded-full bg-blue-200 text-blue-600 flex items-center justify-center text-[10px] font-bold">i</div></div>
                <p className="text-xs text-blue-700 leading-relaxed">
                  CSV must have a header row with a column named <strong>email</strong>.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-100 bg-slate-50/50">
          <button 
            onClick={handleProcessAndSubmit}
            disabled={isProcessing}
            className="w-full py-3 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 flex justify-center items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
          >
            {isProcessing ? <Loader2 className="animate-spin w-4 h-4" /> : (activeTab === 'manual' ? "Add Emails" : "Process CSV")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRecipientModal;