import { useNavigate } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { getManagerStats, managerPendingRequests, approveRequest, rejectRequest } from "../../api/requests";

export default function ManagerDashboard() {
  const [requests, setRequests] = useState([]); // ✅ pending list
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useContext(AuthContext);

  const [stats, setStats] = useState({
    pending_count: 0,
    team_submissions_count: 0,
    monthly_rejections_count: 0
  });

  const [loading, setLoading] = useState(true);

  // 🔥 FETCH PENDING REQUESTS
  useEffect(() => {
    fetchPendingRequests();
  }, []);

  const fetchPendingRequests = async () => {
    try {
      const res = await managerPendingRequests();
      console.log("PENDING:", res.data);
      setRequests(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 FETCH STATS
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getManagerStats();
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch manager stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  // 🔥 APPROVE
  const handleApprove = async (id) => {
    try {
      await approveRequest(id);
      fetchPendingRequests(); // refresh list
    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 REJECT
  const handleReject = async (id) => {
    try {
      await rejectRequest(id);
      fetchPendingRequests();
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const quickList = requests.slice(0, 5);

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      <aside className="w-72 bg-[#063970] text-white flex flex-col p-8 border-r border-white/10 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="w-11 h-11 rounded-2xl bg-white/10 flex items-center justify-center font-black">M</div>
          <div>
            <h2 className="text-2xl font-black tracking-tight">Manager Hub</h2>
            <p className="text-[10px] uppercase tracking-widest text-blue-200">Workflow oversight</p>
          </div>
        </div>

        <nav className="space-y-2 flex-1">
          <button
            onClick={() => navigate("/manager")}
            className="w-full text-left px-5 py-3.5 rounded-2xl bg-blue-500 text-white text-sm font-bold shadow-lg shadow-blue-500/20"
          >
            Overview
          </button>
          {hasPermission("Approve Workflow") && (
            <button
              onClick={() => navigate("/manager/pending")}
              className="w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold text-blue-100 hover:bg-white/10 transition-all"
            >
              Pending Approvals
            </button>
          )}
        </nav>

        <button onClick={handleLogout} className="mt-auto text-red-200 bg-red-500/10 hover:bg-red-500/20 px-4 py-3 rounded-2xl text-sm font-bold transition-all">
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Manager Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">
              Review team requests, take approval actions, and monitor delivery flow.
            </p>
          </div>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-3">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Active manager</p>
            <p className="text-sm font-bold text-slate-700 mt-1">{user?.name || "Manager"}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Metric title="Awaiting Decision" value={loading ? "..." : stats.pending_count} tone="amber" />
          <Metric title="Team Submissions" value={loading ? "..." : stats.team_submissions_count} tone="blue" />
          <Metric title="Monthly Rejections" value={loading ? "..." : stats.monthly_rejections_count} tone="rose" />
        </div>

        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-xl font-bold text-[#0f172a]">Pending Requests</h2>
              <p className="text-sm text-slate-500 mt-1">Quick action view for the items waiting on you.</p>
            </div>
            <button
              onClick={() => navigate("/manager/pending")}
              className="bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all"
            >
              Open Full Queue
            </button>
          </div>

          {quickList.length === 0 ? (
            <p className="text-slate-500">No pending requests</p>
          ) : (
            <div className="space-y-3">
              {quickList.map((req) => (
                <div
                  key={req.id}
                  className="p-5 border border-slate-100 rounded-2xl flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:bg-slate-50/60 transition-colors"
                >
                  <div>
                    <p className="font-bold text-slate-800">{req.title || "Request"}</p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-600">
                        {req.request_type || "General"}
                      </span>
                      <span className="text-sm text-slate-500">{req.created_by_email || "Employee request"}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => navigate(`/manager/approvals/${req.id}`)}
                      className="bg-slate-100 text-slate-700 px-3 py-2 rounded-xl font-bold text-sm hover:bg-slate-200"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => handleApprove(req.id)}
                      className="bg-green-500 text-white px-3 py-2 rounded-xl font-bold text-sm"
                    >
                      Approve
                    </button>

                    <button
                      onClick={() => handleReject(req.id)}
                      className="bg-red-500 text-white px-3 py-2 rounded-xl font-bold text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}

function Metric({ title, value, tone }) {
  const tones = {
    amber: "bg-amber-50 text-amber-600",
    blue: "bg-blue-50 text-blue-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
      <div className={`w-12 h-12 rounded-2xl ${tones[tone]} flex items-center justify-center mb-4 font-black`}>
        {String(value).slice(0, 2)}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-[#0f172a] mt-1">{value}</h3>
    </div>
  );
}