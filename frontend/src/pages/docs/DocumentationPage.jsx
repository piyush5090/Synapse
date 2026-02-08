import { BookOpen, Share2, PenTool, Calendar, BarChart3, ArrowRight, Key, Building2, Mail, Users, FileText, Send } from 'lucide-react';
import { Link } from 'react-router-dom';

const DocumentationPage = () => {
  return (
    <div className="min-h-screen bg-[#F8F9FC] text-slate-900 font-sans py-12 pt-24 px-4 md:px-8">
      
      {/* --- HERO HEADER --- */}
      <div className="max-w-5xl mx-auto text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider mb-6 border border-blue-100">
          <BookOpen size={14} /> Knowledge Base
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
          Master Synapse in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">5 Minutes</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Your complete guide to automating social media and email marketing campaigns from a single dashboard.
        </p>
      </div>

      <div className="max-w-5xl mx-auto space-y-20">

        {/* ================= SECTION 1: SOCIAL MEDIA ================= */}
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                    <Share2 size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Social Media Automation</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* --- STEP 1: ACCOUNT & BUSINESS SETUP (Full Width) --- */}
                <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                    <Building2 size={80} className="text-indigo-600" />
                </div>
                
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">1</div>
                    <h3 className="text-xl font-bold">Business Profile Setup</h3>
                </div>
                
                <p className="text-slate-500 leading-relaxed max-w-3xl">
                    Before anything else, create your account and complete your <strong>Business Profile</strong>. 
                    Synapse asks for your <em>Website URL</em> and <em>Business Description</em>. 
                    <br className="hidden md:block" />
                    <span className="text-sm mt-2 block text-indigo-600 font-medium">
                    Why is this vital? Our AI uses this data to learn your brand voice and generate content that actually sounds like you.
                    </span>
                </p>
                </div>

                {/* --- STEP 2: CONNECT ACCOUNTS --- */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</div>
                        <h3 className="text-xl font-bold">Connect Socials</h3>
                    </div>
                    
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        Link your Facebook Page and Instagram Business Account. This requires a specific 
                        <strong> System User Token</strong> from Meta to allow automation.
                    </p>

                    <Link to="/docs/system-token" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-100 w-full justify-between group/link">
                        <span className="flex items-center gap-2">
                            <Key size={16} /> Get System User Token
                        </span>
                        <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* --- STEP 3: CREATE CONTENT --- */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">3</div>
                        <h3 className="text-xl font-bold">Generate AI Content</h3>
                    </div>
                    
                    <p className="text-slate-500 leading-relaxed">
                        Head to the <strong>Content</strong> tab. Describe your idea simply (e.g., "Monday Motivation quote"). 
                        Synapse AI uses your Business Profile context to generate a caption, hashtags, and a perfectly sized image.
                    </p>
                </div>

                {/* --- STEP 4: SCHEDULE --- */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-pink-300 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">4</div>
                        <h3 className="text-xl font-bold">Schedule or Publish</h3>
                    </div>
                    
                    <p className="text-slate-500 leading-relaxed">
                        Once generated, choose a date and time. Synapse locks your slot. 
                        Our system handles the rest, ensuring your post goes live exactly when you want it.
                    </p>
                </div>
            </div>
        </div>

        {/* ================= SECTION 2: EMAIL CAMPAIGNS ================= */}
        <div>
            <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-200">
                    <Mail size={20} />
                </div>
                <h2 className="text-2xl font-black text-slate-900">Email Marketing</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                
                {/* --- STEP 1: CONNECT SENDER --- */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-emerald-300 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">1</div>
                        <h3 className="text-xl font-bold">Connect Sender (Brevo)</h3>
                    </div>
                    <p className="text-slate-500 mb-6 leading-relaxed">
                        To ensure high deliverability, connect a sender identity using Brevo (free SMTP). This bypasses spam filters and allows bulk sending.
                    </p>
                    <Link to="/docs/brevo-setup" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-50 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-colors border border-emerald-100 w-full justify-between group/link">
                        <span className="flex items-center gap-2">
                            <Key size={16} /> Get Brevo API Key
                        </span>
                        <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* --- STEP 2: MANAGE AUDIENCE --- */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-blue-300 transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Users size={64} className="text-blue-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</div>
                        <h3 className="text-xl font-bold">Import Audience</h3>
                    </div>
                    <p className="text-slate-500 leading-relaxed">
                        Build your mailing list easily. You can add subscribers <strong>manually</strong> one-by-one, or <strong>Bulk Import via CSV</strong>. 
                        Synapse automatically cleans duplicates and validates email formats.
                    </p>
                </div>

                {/* --- STEP 3: CREATE TEMPLATES --- */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <FileText size={64} className="text-amber-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">3</div>
                        <h3 className="text-xl font-bold">Design Templates</h3>
                    </div>
                    <ul className="space-y-3 text-slate-500 text-sm list-disc list-inside">
                        <li><strong>AI Generator:</strong> Type a prompt (e.g., "Product Launch for Sneakers") and get a complete HTML email with a header image.</li>
                        <li><strong>Rich Text Editor:</strong> Write custom newsletters with bold text, links, and formatting.</li>
                        <li><strong>Save & Reuse:</strong> Store unlimited templates for future campaigns.</li>
                    </ul>
                </div>

                {/* --- STEP 4: SEND CAMPAIGNS --- */}
                <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Send size={64} className="text-indigo-600" />
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">4</div>
                        <h3 className="text-xl font-bold">Launch Campaign</h3>
                    </div>
                    <p className="text-slate-500 leading-relaxed mb-4">
                        Combine your Audience + Template + Sender into a Campaign.
                    </p>
                    <div className="flex gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                        <span className="bg-slate-50 px-2 py-1 rounded border">Instant Send</span>
                        <span className="bg-slate-50 px-2 py-1 rounded border">Scheduled Blast</span>
                    </div>
                </div>

            </div>
        </div>

      </div>
    </div>
  );
};

export default DocumentationPage;