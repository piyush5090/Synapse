import { ArrowLeft, CheckCircle2, AlertTriangle, ExternalLink, Copy, Smartphone, LayoutGrid, ShieldAlert } from 'lucide-react';
import { Link } from 'react-router-dom';

const SystemTokenGuide = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 font-sans py-12 pt-20 px-4 md:px-8">
      
      <div className="max-w-3xl mx-auto">
        
        {/* Navigation */}
        <Link to="/docs" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 font-medium mb-8 transition-colors">
          <ArrowLeft size={18} /> Back to Docs
        </Link>

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 text-purple-600 text-xs font-bold uppercase tracking-wider mb-4 border border-purple-100">
            Advanced Setup
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
            Generating a System User Token
          </h1>
          <p className="text-lg text-slate-500">
            Synapse requires a permanent token from your Meta Business Suite. Please ensure you meet the prerequisites below before starting.
          </p>
        </div>

        {/* --- PREREQUISITES (CRITICAL) --- */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-8">
            <h3 className="text-amber-900 font-bold flex items-center gap-2 mb-3">
                <ShieldAlert size={20} /> Critical Prerequisites
            </h3>
            <div className="space-y-3">
                <div className="flex items-start gap-3">
                    <div className="mt-1 min-w-[16px]"><CheckCircle2 size={16} className="text-amber-600" /></div>
                    <p className="text-amber-800 text-sm">
                        <strong>Instagram Business Account:</strong> Your Instagram must be switched to a Professional/Business account. Personal accounts will not work.
                    </p>
                </div>
                <div className="flex items-start gap-3">
                    <div className="mt-1 min-w-[16px]"><CheckCircle2 size={16} className="text-amber-600" /></div>
                    <p className="text-amber-800 text-sm">
                        <strong>Connected Accounts:</strong> Your Instagram Business Account <u>must</u> be linked to your Facebook Page. 
                        (Go to FB Page Settings &rarr; Linked Accounts &rarr; Instagram).
                    </p>
                </div>
            </div>
        </div>

        {/* STEPS CONTAINER */}
        <div className="space-y-6">

            {/* STEP 1: CREATE APP (UPDATED) */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">1</span>
                    Create a Meta App
                </h3>
                <p className="text-slate-600 mb-4">
                    You need a container app to handle API permissions.
                </p>
                <ul className="space-y-3 text-slate-600 list-disc list-inside ml-2 mb-4">
                    <li>Go to <a href="https://developers.facebook.com/" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Meta for Developers</a>.</li>
                    <li>Click <strong>My Apps</strong> &rarr; <strong>Create App</strong>.</li>
                    <li>Select <strong>Other</strong> &rarr; <strong>Business</strong>.</li>
                    <li>Give it a name (e.g., "Synapse Automation") and connect it to your <strong>Business Account</strong>.</li>
                    
                    {/* --- NEW STEP INSERTED HERE --- */}
                    <li className="font-medium text-slate-800 bg-blue-50 p-2 rounded-lg border border-blue-100">
                        When asked for Use Cases, ensure you select both: <br/>
                        <span className="text-blue-600 block mt-1 ml-4">• "Manage messaging & content on Instagram"</span>
                        <span className="text-blue-600 block ml-4">• "Manage everything on your Page"</span>
                    </li>
                </ul>
            </div>

            {/* STEP 2: BUSINESS SETTINGS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">2</span>
                    Go to Business Settings
                </h3>
                <p className="text-slate-600 mb-4">
                    Now switch to the Business Manager to create the bot user.
                </p>
                <a href="https://business.facebook.com/settings" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-blue-600 font-bold hover:underline">
                    Open Meta Business Settings <ExternalLink size={14} />
                </a>
            </div>

            {/* STEP 3: CREATE SYSTEM USER */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">3</span>
                    Create a System User
                </h3>
                <ul className="space-y-3 text-slate-600 list-disc list-inside ml-2">
                    <li>On the left sidebar, click <strong>Users</strong> → <strong>System Users</strong>.</li>
                    <li>Click <strong>Add</strong>.</li>
                    <li>Name the user <span className="font-mono bg-slate-100 px-1 rounded text-slate-800">Synapse Bot</span>.</li>
                    <li>Set the Role to <strong>Admin</strong>.</li>
                </ul>
            </div>

            {/* STEP 4: ADD ASSETS */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center text-sm">4</span>
                    Add Assets
                </h3>
                <p className="text-slate-600 mb-4">
                    Click <strong>Add Assets</strong> button for your new System User and assign:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-sm font-medium">Your Facebook Page</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <CheckCircle2 size={16} className="text-green-500" />
                        <span className="text-sm font-medium">Your Instagram Account</span>
                    </div>
                    <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-100 md:col-span-2">
                        <LayoutGrid size={16} className="text-blue-500" />
                        <span className="text-sm font-medium">The App you created in Step 1</span>
                    </div>
                </div>
                <p className="text-slate-500 text-sm italic">Ensure "Full Control" toggles are ON for all assets.</p>
            </div>

            {/* STEP 5: GENERATE TOKEN */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 border-l-4 border-l-purple-500">
                <h3 className="text-lg font-bold flex items-center gap-3 mb-4">
                    <span className="w-8 h-8 rounded-lg bg-purple-600 text-white flex items-center justify-center text-sm">5</span>
                    Generate the Token
                </h3>
                <p className="text-slate-600 mb-4">
                    Click <strong>Generate New Token</strong>. Select the App from Step 1, then check these permissions:
                </p>
                
                <div className="bg-slate-900 rounded-xl p-4 font-mono text-sm text-purple-300 space-y-1 overflow-x-auto">
                    <div>pages_read_engagement</div>
                    <div>pages_manage_posts</div>
                    <div>pages_show_list</div>
                    <div>instagram_basic</div>
                    <div>instagram_content_publish</div>
                    <div>business_management</div>
                </div>
            </div>

            {/* FINAL STEP */}
            <div className="bg-green-50 border border-green-200 rounded-2xl p-6 md:p-8 flex items-start gap-4">
                <div className="p-2 bg-white rounded-full text-green-600 shadow-sm shrink-0">
                    <Copy size={24} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-green-900 mb-1">Copy & Paste</h3>
                    <p className="text-green-800 leading-relaxed">
                        Copy the long string generated. Paste this into the <strong>System User Token</strong> field in your Synapse Settings.
                        <br/><span className="text-xs font-bold opacity-75 uppercase mt-1 block">Warning: You won't be able to see this token again.</span>
                    </p>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default SystemTokenGuide;