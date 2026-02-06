import { BookOpen, Share2, PenTool, Calendar, BarChart3, ArrowRight, Key, Building2 } from 'lucide-react';
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
          Your complete guide to automating social media from setting up your brand to analyzing the results.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* --- STEP 1: ACCOUNT & BUSINESS SETUP (Full Width) --- */}
        <div className="md:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-indigo-300 transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Building2 size={80} className="text-indigo-600" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">1</div>
            <h2 className="text-xl font-bold">Sign Up & Business Profile</h2>
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
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Share2 size={64} className="text-blue-600" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold">2</div>
            <h2 className="text-xl font-bold">Connect Socials</h2>
          </div>
          
          <p className="text-slate-500 mb-6 leading-relaxed">
            Link your Facebook Page and Instagram Business Account. This requires a specific 
            <strong> System User Token</strong> from Meta to allow automation.
          </p>

          {/* THE IMPORTANT LINK */}
          <Link to="/docs/system-token" className="inline-flex items-center gap-2 px-4 py-3 rounded-xl bg-blue-50 text-blue-700 font-bold text-sm hover:bg-blue-100 transition-colors border border-blue-100 w-full justify-between group/link">
            <span className="flex items-center gap-2">
                <Key size={16} /> Get System User Token
            </span>
            <ArrowRight size={16} className="group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* --- STEP 3: CREATE CONTENT --- */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-purple-300 transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <PenTool size={64} className="text-purple-600" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold">3</div>
            <h2 className="text-xl font-bold">Generate Content</h2>
          </div>
          
          <p className="text-slate-500 leading-relaxed">
            Head to the <strong>Content</strong> tab. Describe your idea simply (e.g., "Monday Motivation quote"). 
            Synapse AI uses your Business Profile context to generate a caption, hashtags, and a perfectly sized image.
          </p>
        </div>

        {/* --- STEP 4: SCHEDULE --- */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-pink-300 transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={64} className="text-pink-600" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-700 font-bold">4</div>
            <h2 className="text-xl font-bold">Schedule or Publish</h2>
          </div>
          
          <p className="text-slate-500 leading-relaxed">
            Once generated, choose a date and time. Synapse locks your slot. 
            Our system handles the rest, ensuring your post goes live exactly when you want it, even if you are offline.
          </p>
        </div>

        {/* --- STEP 5: ANALYZE --- */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden group hover:border-amber-300 transition-all">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 size={64} className="text-amber-600" />
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold">5</div>
            <h2 className="text-xl font-bold">Track Performance</h2>
          </div>
          
          <p className="text-slate-500 leading-relaxed">
            Synapse automatically converts links in your posts to short-links. 
            Visit the <strong>Dashboard</strong> to see real-time click data, filtered to exclude bots and scrapers.
          </p>
        </div>

      </div>
    </div>
  );
};

export default DocumentationPage;