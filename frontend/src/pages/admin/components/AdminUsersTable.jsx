import { Ban, CheckCircle, Trash2 } from 'lucide-react';

const AdminUsersTable = ({ user, onBan, onDelete }) => {
  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="px-6 py-4 font-medium text-slate-900">{user.email}</td>
      <td className="px-6 py-4">
        <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-slate-100 text-slate-600'}`}>
          {user.role}
        </span>
      </td>
      <td className="px-6 py-4">
        {user.is_banned ? (
          <span className="inline-flex items-center gap-1 text-red-600 font-bold text-xs bg-red-50 px-2 py-1 rounded"><Ban size={12}/> Banned</span>
        ) : (
          <span className="inline-flex items-center gap-1 text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded"><CheckCircle size={12}/> Active</span>
        )}
      </td>
      <td className="px-6 py-4 text-slate-400 text-xs font-mono">{new Date(user.created_at).toLocaleDateString()}</td>
      <td className="px-6 py-4 text-right flex justify-end gap-2">
         {user.role !== 'admin' && (
           <>
             <button 
                onClick={() => onBan(user.id, user.is_banned)} 
                className={`p-2 rounded-lg transition-colors ${user.is_banned ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}
                title={user.is_banned ? "Unban" : "Ban"}
             >
                {user.is_banned ? <CheckCircle size={16} /> : <Ban size={16} />}
             </button>
             
             <button 
                onClick={() => onDelete(user.id)}
                className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100"
                title="Delete User"
             >
                <Trash2 size={16} />
             </button>
           </>
         )}
      </td>
    </tr>
  );
};

export default AdminUsersTable;