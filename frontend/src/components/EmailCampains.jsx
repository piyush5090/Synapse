import { Link } from 'react-router-dom';
import { ArrowRight, Mail, Clock } from 'lucide-react';

const EmailCampaigns = () => {
  const campaigns = [
     { id: 1, subject: "February Newsletter", status: "scheduled", time: "Feb 10, 9:00 AM", sent: 0 },
     { id: 2, subject: "Welcome Series", status: "active", time: "Ongoing", sent: 1240 },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
            <Mail size={20} className="text-sky-600"/>
            <h2 className="text-xl font-bold text-[#111]">Email Campaigns</h2>
        </div>
        <Link to="/email" className="flex items-center gap-1 text-sm font-medium text-[#666] hover:text-[#111]">
            Manage Emails <ArrowRight size={16} />
        </Link>
      </div>

      <div className="rounded-2xl border border-[#E5E5E5] bg-white overflow-hidden">
        {campaigns.length > 0 ? (
             <table className="w-full text-left text-sm">
                <thead className="bg-[#FAFAFA] border-b border-[#F0F0F0] text-[#888]">
                    <tr>
                        <th className="px-6 py-3 font-medium">Campaign</th>
                        <th className="px-6 py-3 font-medium">Status</th>
                        <th className="px-6 py-3 font-medium">Schedule</th>
                        <th className="px-6 py-3 font-medium">Sent</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-[#F0F0F0]">
                    {campaigns.map(camp => (
                        <tr key={camp.id} className="group hover:bg-[#FAFAFA] transition-colors">
                            <td className="px-6 py-4 font-medium text-[#111]">{camp.subject}</td>
                            <td className="px-6 py-4">
                                <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${camp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                    {camp.status}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-[#666] flex items-center gap-2">
                                <Clock size={14} /> {camp.time}
                            </td>
                            <td className="px-6 py-4 text-[#111] font-mono">{camp.sent.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        ) : (
            <div className="p-8 text-center text-sm text-[#888]">
                No active email campaigns.
            </div>
        )}
      </div>
    </div>
  );
};

export default EmailCampaigns;