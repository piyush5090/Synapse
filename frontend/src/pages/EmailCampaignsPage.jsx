import { useState } from 'react';
import PageHeader from '../components/content/PageHeader';
import SenderManager from '../components/SenderManager';
import RecipientManager from '../components/RecipientManager';
import ScheduledCampaignsList from '../components/ScheduledCampaignsList';
import CreateCampaignModal from '../components/modals/CreateCampaignModal';
import { Plus } from 'lucide-react';

const EmailCampaignsPage = () => {
  const [isCampaignModalOpen, setIsCampaignModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); 

  // Function to refresh the list after a campaign is created
  const handleCampaignSuccess = () => {
    setRefreshKey(prev => prev + 1); 
  };

  return (
    <div className="min-h-screen w-full bg-[#F8F9FC] text-slate-900 font-sans">
      <div className="mx-auto max-w-7xl p-6 pt-24 lg:p-10 lg:pt-28 space-y-8">
        
        {/* Page Header + Create Button */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <PageHeader 
            title="Campaign Configuration" 
            subtitle="Manage your sender identities, audience lists, and schedules."
          />
          <button 
            onClick={() => setIsCampaignModalOpen(true)}
            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold shadow-lg shadow-slate-300 hover:bg-slate-800 transition-all flex items-center gap-2 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create Campaign
          </button>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-full">
          
          {/* Left Column: Senders & Queue (4 cols) */}
          <div className="lg:col-span-4 space-y-6 flex flex-col">
            {/* 1. Senders Manager */}
            <div className="flex-none max-h-[400px]">
               <SenderManager />
            </div>
            {/* 2. Scheduled Campaigns List */}
            <div className="flex-1 min-h-[400px]">
               <ScheduledCampaignsList refreshTrigger={refreshKey} />
            </div>
          </div>

          {/* Right Column: Audience Manager (8 cols) */}
          <div className="lg:col-span-8 h-full min-h-[800px]">
            <RecipientManager />
          </div>
        </div>

      </div>

      {/* Campaign Modal */}
      <CreateCampaignModal 
        isOpen={isCampaignModalOpen}
        onClose={() => setIsCampaignModalOpen(false)}
        onSuccess={handleCampaignSuccess}
      />
    </div>
  );
};

export default EmailCampaignsPage;