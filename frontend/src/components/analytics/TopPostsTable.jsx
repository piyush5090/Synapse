import { ExternalLink, ArrowUpRight } from 'lucide-react';

const TopPostsTable = ({ posts }) => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="text-sm font-bold text-slate-900">Top Performing Posts</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {posts.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-sm">No engagement recorded yet.</div>
        ) : (
            <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500 font-medium">
                <tr>
                <th className="px-6 py-3 w-16">Rank</th>
                <th className="px-6 py-3">Post / Link</th>
                <th className="px-6 py-3 text-right">Clicks</th>
                <th className="px-6 py-3 text-right">Platform</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {posts.map((post, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-400">#{index + 1}</td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-700 truncate max-w-[200px]" title={post.link_id}>
                                {post.caption || `Link: ${post.link_id.slice(0, 8)}...`}
                            </span>
                            <ExternalLink size={12} className="text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-slate-900">{post.count}</td>
                    <td className="px-6 py-4 text-right">
                        <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                            post.platform === 'facebook' ? 'bg-blue-50 text-blue-600' : 
                            post.platform === 'instagram' ? 'bg-pink-50 text-pink-600' : 'bg-slate-100 text-slate-600'
                        }`}>
                            {post.platform}
                        </span>
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        )}
      </div>
    </div>
  );
};

export default TopPostsTable;