import { useEffect, useMemo, useState } from "react";
import { myRequests } from "../../api/requests";
import { Link, useLocation } from "react-router-dom";

export default function MyRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const isStatusView = location.pathname === "/employee/status";
  const heading = isStatusView ? "Status Tracking" : "My Request List";
  const subheading = isStatusView
    ? "Monitor approval progress, timeline changes, and final outcomes."
    : "Track your submitted requests, approval status, and detailed history.";

  const pendingCount = list.filter((r) => r.status === "pending" || r.status === "in_review").length;
  const approvedCount = list.filter((r) => r.status === "approved").length;
  const rejectedCount = list.filter((r) => r.status === "rejected").length;

  const sortedList = useMemo(
    () => [...list].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)),
    [list]
  );

  useEffect(() => {
    myRequests()
      .then((res) => setList(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.10),_transparent_30%),linear-gradient(to_bottom,#f8fafc,#eef2ff)] p-8">
      <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600">
            {isStatusView ? "Live Tracker" : "Request Center"}
          </p>
          <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mt-2">{heading}</h1>
          <p className="text-sm text-slate-500 mt-2 font-medium">
            {subheading}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full lg:w-auto">
          <SummaryCard label="Open" value={pendingCount} tone="amber" />
          <SummaryCard label="Approved" value={approvedCount} tone="emerald" />
          <SummaryCard label="Rejected" value={rejectedCount} tone="rose" />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-slate-500">Loading requests...</div>
        ) : list.length === 0 ? (
          <div className="p-10 text-center text-slate-400 font-medium">No requests submitted yet.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/70 text-slate-400 text-left">
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Title</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Type</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Status</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest">Created</th>
                <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {sortedList.map((r) => (
                <RequestRow key={r.id} r={r} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- Row Component ---------------- */

function RequestRow({ r }) {
  const badge =
    r.status === "approved"
      ? "bg-emerald-100 text-emerald-700"
      : r.status === "rejected"
      ? "bg-rose-100 text-rose-700"
      : r.status === "in_review"
      ? "bg-blue-100 text-blue-700"
      : "bg-amber-100 text-amber-700";

  return (
    <tr className="hover:bg-slate-50/60 transition-colors">
      <td className="py-4 px-6 font-bold text-slate-800">
        <div>
          <p>{r.title}</p>
          <p className="text-[11px] font-medium text-slate-400 mt-1">#{r.id}</p>
        </div>
      </td>

      <td className="px-6">
        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
          {r.request_type}
        </span>
      </td>

      <td className="px-6">
        <span
          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${badge}`}
        >
          {r.status.replace("_", " ")}
        </span>
      </td>

      <td className="px-6 text-slate-500 text-sm font-medium">
        {new Date(r.created_at).toLocaleDateString()}
      </td>

      <td className="px-6 text-right">
        <Link
          to={`/employee/requests/${r.id}`}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-50 px-4 py-2 text-emerald-700 font-bold hover:bg-emerald-100 hover:text-emerald-800 transition-all"
        >
          View Details
        </Link>
      </td>
    </tr>
  );
}

function SummaryCard({ label, value, tone }) {
  const styles = {
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-emerald-50 text-emerald-600",
    rose: "bg-rose-50 text-rose-600",
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 min-w-[140px]">
      <div className={`w-10 h-10 rounded-2xl ${styles[tone]} flex items-center justify-center mb-3 font-black`}>
        {String(value).slice(0, 2)}
      </div>
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-2xl font-black text-[#0f172a] mt-1">{value}</p>
    </div>
  );
}
