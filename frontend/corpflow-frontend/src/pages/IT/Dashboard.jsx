import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { getDepartmentDashboard } from "../../api/requests";

export default function ITDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("provisioning");
  const [data, setData] = useState({ requests: [], assets: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getDepartmentDashboard("IT");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch IT dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs = [
    { id: "provisioning", label: "Asset Provisioning", icon: "Server" },
    { id: "requests", label: "Laptop/Software Requests", icon: "DesktopComputer" },
    { id: "assignment", label: "Device Assignment", icon: "Identification" },
    { id: "security", label: "Security Checks", icon: "ShieldCheck" },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-8 border-r border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-white">IT Admin</h2>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
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
              Infrastructure management and technical support
            </p>
          </div>
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100">IT Portal</div>
            <div className="px-4 py-2 text-xs font-bold text-blue-600 uppercase tracking-wider">{user?.name}</div>
          </div>
        </header>

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <ITMetric label="Open Queue" value={data.requests.length} tone="blue" />
            <ITMetric label="Available Assets" value={data.assets.filter((a) => a.status === "available").length} tone="emerald" />
            <ITMetric label="Assigned Assets" value={data.assets.filter((a) => a.status === "assigned").length} tone="violet" />
          </div>
        )}

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "provisioning" && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-slate-800">Pending Provisioning</h3>
                  <button className="text-xs font-bold text-blue-600 hover:underline">View All Assets</button>
                </div>
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Item</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Requested By</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Specs/Reason</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.requests.filter(r => ['hardware','software','asset'].includes(r.request_type?.toLowerCase())).map(req => (
                      <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-700 capitalize">{req.request_type}</td>
                        <td className="px-8 py-5 text-slate-600 font-medium">{req.created_by_email}</td>
                        <td className="px-8 py-5 text-slate-500 text-sm italic">{req.data?.reason || 'Business use'}</td>
                        <td className="px-8 py-5 text-right">
                          <button className="px-4 py-2 bg-blue-500 text-white rounded-xl text-xs font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">Mark Ready</button>
                        </td>
                      </tr>
                    ))}
                    {data.requests.filter(r => ['hardware','software','asset'].includes(r.request_type?.toLowerCase())).length === 0 && (
                      <tr>
                        <td colSpan="4" className="px-8 py-10 text-center text-slate-400 font-medium">No pending items.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            )}

            {activeTab === "assignment" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-6">Available Inventory</h3>
                  <div className="space-y-4">
                    {data.assets.filter(a => a.status === 'available').map(asset => (
                      <div key={asset.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <div>
                          <p className="font-bold text-slate-700">{asset.name}</p>
                          <p className="text-xs text-slate-400 font-mono">SN: {asset.serial_number || 'PENDING'}</p>
                        </div>
                        <button className="px-4 py-2 bg-white border border-slate-200 text-blue-600 rounded-xl text-xs font-bold hover:bg-blue-50">Assign</button>
                      </div>
                    ))}
                    {data.assets.filter(a => a.status === 'available').length === 0 && (
                      <p className="text-center text-slate-400 py-4 italic text-sm">No available assets.</p>
                    )}
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 mb-6">Recent Assignments</h3>
                  <div className="space-y-4">
                    {data.assets.filter(a => a.status === 'assigned').map(asset => (
                      <div key={asset.id} className="flex items-center justify-between p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                         <div>
                          <p className="font-bold text-emerald-800">{asset.name}</p>
                          <p className="text-xs text-emerald-600">Assigned to: {asset.assigned_to_email}</p>
                        </div>
                        <span className="text-[10px] font-black text-emerald-500 uppercase">ACTIVE</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            {activeTab === "security" && (
              <div className="space-y-6">
                <div className="bg-[#0f172a] p-8 rounded-3xl text-white shadow-2xl">
                  <h3 className="text-xl font-bold mb-4">Real-time Security Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Threats</p>
                      <p className="text-2xl font-black text-emerald-400">0</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Uptime</p>
                      <p className="text-2xl font-black text-blue-400">99.9%</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Patches</p>
                      <p className="text-2xl font-black text-amber-400">12</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                      <p className="text-slate-400 text-xs font-bold uppercase mb-1">Compliance</p>
                      <p className="text-2xl font-black text-purple-400">100%</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                   <h3 className="font-bold text-slate-800 mb-6">Active Security Audits</h3>
                   <div className="space-y-4">
                      {['Endpoint Protection Sync', 'Firewall Policy Update', 'SSO Vulnerability Scan'].map(audit => (
                        <div key={audit} className="flex items-center justify-between p-4 border-b border-slate-50">
                          <span className="text-sm font-bold text-slate-700">{audit}</span>
                          <span className="text-xs font-medium text-slate-400">Running...</span>
                        </div>
                      ))}
                   </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function ITMetric({ label, value, tone }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    emerald: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
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