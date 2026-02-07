import { useState } from 'react';
import PageHeader from '../components/content/PageHeader';
import SocialWorkspace from '../components/content/social/SocialWorkspace';
import EmailWorkspace from '../components/content/email/EmailWorkspace';

const ContentPage = () => {
  const [activeTab, setActiveTab] = useState('social'); // 'social' | 'email'

  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="mx-auto max-w-7xl p-6 pt-24 lg:p-10 lg:pt-28 space-y-8">
        
        {/* 1. Shared Header & Toggles */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <PageHeader 
            title={activeTab === 'social' ? "Social Media Library" : "Email Campaigns"} 
            subtitle={activeTab === 'social' ? "Generate and manage your social posts" : "Design and manage email templates"}
          />

          {/* Tab Switcher */}
          <div className="flex p-1 bg-white rounded-xl border border-slate-200 shadow-sm w-fit">
            <button
              onClick={() => setActiveTab('social')}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'social'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Social Content
            </button>
            <button
              onClick={() => setActiveTab('email')}
              className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                activeTab === 'email'
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              Email Content
            </button>
          </div>
        </div>

        {/* 2. Conditional Workspace Rendering */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {activeTab === 'social' ? <SocialWorkspace /> : <EmailWorkspace />}
        </div>
        
      </div>
    </div>
  );
};

export default ContentPage;