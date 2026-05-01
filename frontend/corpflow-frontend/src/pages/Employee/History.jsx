import { useEffect, useState } from "react";
import { myHistory } from "../../api/requests";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myHistory()
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.10),_transparent_28%),linear-gradient(to_bottom,#f8fafc,#eef2ff)] p-8">
      <div className="mb-8">
        <p className="text-[11px] font-black uppercase tracking-[0.25em] text-blue-600">Timeline Archive</p>
        <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mt-2">Request History</h1>
        <p className="text-sm text-slate-500 font-medium mt-3">Approval timeline across all your requests.</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-slate-500">Loading history...</div>
        ) : items.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-medium">No history yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 text-left">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Request</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Action</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Comment</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {items.map((h) => (
                <tr key={h.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-800">
                    {h.request_title} <span className="text-slate-400 text-xs">#{h.request_id}</span>
                  </td>
                  <td className="py-4 px-6">
                    <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-widest">
                      {h.action}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-slate-600">{h.comment || "—"}</td>
                  <td className="py-4 px-6 text-slate-500">
                    {new Date(h.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

