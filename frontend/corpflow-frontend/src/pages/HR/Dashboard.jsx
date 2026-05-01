import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { getDepartmentDashboard, approveRequest, rejectRequest } from "../../api/requests";

export default function HRDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("leaves");
  const [data, setData] = useState({ requests: [], employees: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getDepartmentDashboard("HR");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch HR dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === "approve") await approveRequest(id);
      else await rejectRequest(id);
      fetchDashboardData();
    } catch {
      alert("Action failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs = [
    { id: "leaves", label: "Leave Approvals", icon: "Calendar" },
    { id: "history", label: "Employee History", icon: "UserGroup" },
    { id: "policies", label: "Policy Checks", icon: "ShieldCheck" },
    { id: "clearance", label: "Final Clearance", icon: "BadgeCheck" },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-8 border-r border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-fuchsia-500 to-purple-600 shadow-lg shadow-fuchsia-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11a4 4 0 100-8 4 4 0 000 8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-white">HR Admin</h2>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={handleLogout}
          className="group flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-2xl text-sm font-bold transition-all duration-300 mt-6"
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
            <p className="text-slate-500 font-medium mt-1">
              Workforce management and compliance portal
            </p>
          </div>
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100">HR Portal</div>
            <div className="px-4 py-2 text-xs font-bold text-fuchsia-600 uppercase tracking-wider">{user?.name}</div>
          </div>
        </header>

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <DashCard label="Open HR Queue" value={data.requests.length} tone="fuchsia" />
            <DashCard label="Employees" value={data.employees.length} tone="violet" />
            <DashCard label="Leave Requests" value={data.requests.filter((r) => r.request_type?.toLowerCase() === "leave").length} tone="emerald" />
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "leaves" && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.requests.filter(r => r.request_type.toLowerCase() === 'leave').map(req => (
                      <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5 font-semibold text-slate-700">{req.created_by_email}</td>
                        <td className="px-8 py-5 text-slate-600 font-medium capitalize">{req.request_type}</td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                            (req.status === 'pending' || req.status === 'in_review') ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {(req.status === 'pending' || req.status === 'in_review') && (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleAction(req.id, 'approve')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Approve</button>
                              <button onClick={() => handleAction(req.id, 'reject')} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {data.requests.filter(r => r.request_type.toLowerCase() === 'leave').length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-medium">No pending leave requests found.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            )}

            {activeTab === "history" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.employees.map(emp => (
                  <div key={emp.id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-fuchsia-200 transition-all hover:shadow-xl hover:shadow-fuchsia-500/5">
                    <div className="w-12 h-12 bg-fuchsia-100 rounded-2xl flex items-center justify-center text-fuchsia-600 font-bold mb-4 group-hover:scale-110 transition-transform">
                      {emp.name.charAt(0)}
                    </div>
                    <h3 className="font-bold text-slate-800 text-lg">{emp.name}</h3>
                    <p className="text-slate-500 text-sm font-medium mb-4">{emp.email}</p>
                    <button className="w-full py-3 bg-slate-50 text-slate-600 rounded-2xl text-xs font-bold hover:bg-fuchsia-500 hover:text-white transition-all">View Full History</button>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "policies" && (
              <div className="grid grid-cols-1 gap-6">
                {["Data Protection Policy", "Code of Ethics", "Harassment Prevention", "Remote Work Guidelines"].map(policy => (
                  <div key={policy} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <span className="font-bold text-slate-700">{policy}</span>
                    </div>
                    <div className="flex gap-3">
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-600 text-[10px] font-black rounded-full uppercase tracking-widest">Active</span>
                      <button className="text-fuchsia-600 text-xs font-bold hover:underline">Update</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "clearance" && (
               <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Employee</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Department</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Process</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.requests.filter(r => r.request_type.toLowerCase() === 'clearance').map(req => (
                      <tr key={req.id} className="border-b border-slate-50">
                        <td className="px-8 py-5 font-semibold text-slate-700">{req.created_by_email}</td>
                        <td className="px-8 py-5 text-slate-600 font-medium">Operations</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-fuchsia-100 text-fuchsia-600 text-[10px] font-black rounded-full uppercase tracking-widest">In Progress</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-all">Review Steps</button>
                        </td>
                      </tr>
                    ))}
                    {data.requests.filter(r => r.request_type.toLowerCase() === 'clearance').length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-medium">No active clearance processes.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function DashCard({ label, value, tone }) {
  const tones = {
    fuchsia: "bg-fuchsia-50 text-fuchsia-600",
    violet: "bg-violet-50 text-violet-600",
    emerald: "bg-emerald-50 text-emerald-600",
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6">
      <div className={`w-12 h-12 rounded-2xl ${tones[tone]} flex items-center justify-center font-black mb-4`}>
        {String(value).slice(0, 2)}
      </div>
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
      <p className="text-3xl font-black text-[#0f172a] mt-1">{value}</p>
    </div>
  );
}

