import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../auth/AuthContext";
import { getDepartmentDashboard, approveRequest, rejectRequest } from "../../api/requests";

export default function FinanceDashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("approvals");
  const [data, setData] = useState({ requests: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await getDepartmentDashboard("FINANCE");
      setData(res.data);
    } catch (err) {
      console.error("Failed to fetch Finance dashboard data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, action) => {
    try {
      if (action === "approve") await approveRequest(id);
      else await rejectRequest(id);
      fetchDashboardData();
    } catch (err) {
      alert("Action failed");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const tabs = [
    { id: "approvals", label: "Expense Approvals", icon: "Cash" },
    { id: "invoices", label: "Invoice Review", icon: "DocumentText" },
    { id: "budget", label: "Budget Monitoring", icon: "ChartBar" },
    { id: "payments", label: "Payment Status", icon: "CreditCard" },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-8 border-r border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter text-white">Finance</h2>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
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
              Financial governance and auditory control
            </p>
          </div>
          <div className="flex bg-white rounded-2xl p-1 shadow-sm border border-slate-100">
            <div className="px-4 py-2 text-xs font-bold text-slate-400 uppercase tracking-wider border-r border-slate-100">Finance Portal</div>
            <div className="px-4 py-2 text-xs font-bold text-emerald-600 uppercase tracking-wider">{user?.name}</div>
          </div>
        </header>

        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
            <div className="h-40 bg-slate-200 rounded-3xl w-full"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {(activeTab === "approvals" || activeTab === "invoices") && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Requester</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Type</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Amount/Context</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.requests.filter(r => activeTab === 'approvals' ? ['asset','travel'].includes(r.request_type) : r.request_type === 'invoice').map(req => (
                      <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/30 transition-colors">
                        <td className="px-8 py-5 font-semibold text-slate-700">{req.created_by_email}</td>
                        <td className="px-8 py-5 text-slate-600 font-medium capitalize">{req.request_type}</td>
                        <td className="px-8 py-5 font-bold text-slate-900">
                          {req.data?.amount ? `$${req.data.amount}` : 'N/A'}
                          {req.data?.is_over_budget && (
                            <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded animate-pulse">OVER BUDGET</span>
                          )}
                        </td>
                        <td className="px-8 py-5">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            req.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                            req.status === 'pending' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          {req.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <button onClick={() => handleAction(req.id, 'approve')} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">Approve</button>
                              <button onClick={() => handleAction(req.id, 'reject')} className="px-4 py-2 bg-red-500 text-white rounded-xl text-xs font-bold hover:bg-red-600 transition-all shadow-lg shadow-red-500/20">Reject</button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                    {data.requests.filter(r => activeTab === 'approvals' ? ['asset','travel'].includes(r.request_type) : r.request_type === 'invoice').length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-medium">No items found for this view.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </section>
            )}

            {activeTab === "budget" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Annual Budget Progress</h3>
                  <div className="relative pt-1">
                    <div className="overflow-hidden h-4 mb-4 text-xs flex rounded-full bg-emerald-100">
                      <div style={{ width: "75%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-emerald-500"></div>
                    </div>
                    <div className="flex justify-between text-xs font-bold">
                      <span className="text-emerald-600">Spent: $750,000</span>
                      <span className="text-slate-400">Total: $1,000,000</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-6">Budget Alerts</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                      <span className="text-sm font-bold text-red-700">IT Infrastructure CapEx</span>
                      <span className="text-xs font-black text-red-600">98% DEPLETED</span>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-amber-50 rounded-2xl border border-amber-100">
                      <span className="text-sm font-bold text-amber-700">Marketing Events</span>
                      <span className="text-xs font-black text-amber-600">85% USED</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "payments" && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-50 bg-slate-50/50">
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Vendor/Employee</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Reference</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Scheduled Date</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.requests.filter(r => r.status === 'approved').map(req => (
                      <tr key={req.id} className="border-b border-slate-50">
                        <td className="px-8 py-5 font-semibold text-slate-700">{req.created_by_email}</td>
                        <td className="px-8 py-5 text-slate-500 font-mono text-xs font-bold">INV-{req.id}-2024</td>
                        <td className="px-8 py-5 text-slate-600 font-medium">April 05, 2024</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 bg-blue-100 text-blue-600 text-[10px] font-black rounded-full uppercase tracking-widest">SCHEDULED</span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20">Release Payment</button>
                        </td>
                      </tr>
                    ))}
                    {data.requests.filter(r => r.status === 'approved').length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-medium">No payments pending release.</td>
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

