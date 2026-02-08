import { useState, useEffect } from 'react';
import api from '../../services/api';
import { Shield, Users, FileImage, Mail, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Import the Separate Components
import AdminUsersTable from './components/AdminUsersTable';
import AdminSocialCard from './components/AdminSocialCard';
import AdminMailCard from './components/AdminMailCard';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'social' | 'mail'
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // --- Handlers ---
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setPage(1);
    setData([]);
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      let endpoint = '';
      if (activeTab === 'users') endpoint = `/admin/users?page=${page}&limit=10`;
      if (activeTab === 'social') endpoint = `/admin/content/social?page=${page}&limit=10`;
      if (activeTab === 'mail')   endpoint = `/admin/content/mail?page=${page}&limit=10`;

      const res = await api.get(endpoint);
      
      const list = res.data.data || [];
      setData(list);

      // Backend returns different keys for total counts
      const total = activeTab === 'users' ? res.data.total_users : (res.data.total || 0);
      setTotalPages(Math.ceil(total / 10) || 1);

    } catch (err) {
      console.error(err);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab, page]);

  // Shared Actions passed down to components
  const handleBanUser = async (userId, currentStatus) => {
    if(!window.confirm(`Are you sure you want to ${currentStatus ? 'UNBAN' : 'BAN'} this user?`)) return;
    try {
      await api.patch(`/admin/users/${userId}/ban`, { banStatus: !currentStatus });
      toast.success("User status updated");
      fetchData(); // Refresh data
    } catch (err) {
      toast.error("Ban action failed");
    }
  };

  const handleDeleteContent = async (id) => {
    if(!window.confirm("Delete this content permanently?")) return;
    try {
      // activeTab matches the :type param in routes ('social' or 'mail')
      await api.delete(`/admin/content/${activeTab}/${id}`);
      toast.success("Content deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleDeleteUser = async (userId) => {
    if(!window.confirm("DELETE USER PERMANENTLY? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/users/${userId}`);
      toast.success("User deleted");
      fetchData();
    } catch (err) {
      toast.error("Delete user failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6 pt-24">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 flex items-center gap-3">
            <Shield className="text-indigo-600" size={32} /> Admin Console
          </h1>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-1.5 rounded-xl border border-slate-200 w-fit shadow-sm">
          <TabButton active={activeTab === 'users'} onClick={() => handleTabChange('users')} icon={<Users size={16}/>} label="Users" />
          <TabButton active={activeTab === 'social'} onClick={() => handleTabChange('social')} icon={<FileImage size={16}/>} label="Social Content" />
          <TabButton active={activeTab === 'mail'} onClick={() => handleTabChange('mail')} icon={<Mail size={16}/>} label="Email Templates" />
        </div>

        {/* Content Area */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px] flex flex-col">
          
          {loading ? (
            <div className="flex-1 flex items-center justify-center text-slate-400 gap-2">
              <Loader2 className="animate-spin" /> Loading...
            </div>
          ) : (
            <div className="flex-1">
              
              {/* 1. USERS TABLE */}
              {activeTab === 'users' && (
                <div className="overflow-x-auto">
                   <table className="w-full text-left text-sm">
                      <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase text-xs font-bold">
                        <tr>
                          <th className="px-6 py-4">User</th>
                          <th className="px-6 py-4">Role</th>
                          <th className="px-6 py-4">Status</th>
                          <th className="px-6 py-4">Created At</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                         {data.map(user => (
                            <AdminUsersTable 
                              key={user.id} 
                              user={user} 
                              onBan={handleBanUser} 
                              onDelete={handleDeleteUser} 
                            />
                         ))}
                      </tbody>
                   </table>
                </div>
              )}

              {/* 2. SOCIAL CARDS */}
              {activeTab === 'social' && (
                 <div className="divide-y divide-slate-100">
                    {data.length === 0 && <div className="p-12 text-center text-slate-400">No social content found.</div>}
                    {data.map(post => (
                       <AdminSocialCard 
                         key={post.id} 
                         post={post} 
                         onDelete={handleDeleteContent} 
                         onBanUser={handleBanUser} 
                       />
                    ))}
                 </div>
              )}

              {/* 3. MAIL CARDS */}
              {activeTab === 'mail' && (
                 <div className="divide-y divide-slate-100">
                    {data.length === 0 && <div className="p-12 text-center text-slate-400">No email templates found.</div>}
                    {data.map(template => (
                       <AdminMailCard 
                         key={template.id} 
                         template={template} 
                         onDelete={handleDeleteContent} 
                         onBanUser={handleBanUser} 
                       />
                    ))}
                 </div>
              )}

            </div>
          )}

          {/* Pagination */}
          <div className="p-4 border-t border-slate-100 flex justify-center gap-4 items-center bg-slate-50/50 mt-auto">
             <button disabled={page === 1} onClick={() => setPage(p => p - 1)} className="text-xs font-bold text-slate-500 disabled:opacity-30">Previous</button>
             <span className="text-xs font-medium text-slate-400">Page {page} of {totalPages}</span>
             <button disabled={page >= totalPages} onClick={() => setPage(p => p + 1)} className="text-xs font-bold text-slate-500 disabled:opacity-30">Next</button>
          </div>

        </div>
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${active ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-100'}`}>
    {icon} {label}
  </button>
);

export default AdminDashboard;