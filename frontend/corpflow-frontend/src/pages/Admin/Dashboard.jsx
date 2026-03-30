import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { getAdminStats, getFlows, createFlow, deleteFlow, addWorkflowStep, deleteWorkflowStep } from "../../api/requests";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [flows, setFlows] = useState([]);
  const [roles] = useState(["admin", "employee", "manager", "finance", "it", "hr"]);
  const [loading, setLoading] = useState(true);
  
  const { user: currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "users" || activeTab === "permissions") {
        const [usersRes, permissionsRes] = await Promise.all([
          api.get("accounts/admin/users/"),
          api.get("accounts/admin/permissions/"),
        ]);
        setUsers(usersRes.data);
        setPermissions(permissionsRes.data);
      } else if (activeTab === "reports") {
        const statsRes = await getAdminStats();
        setStats(statsRes.data);
      } else if (activeTab === "workflows") {
        const flowsRes = await getFlows();
        setFlows(flowsRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await api.patch(`accounts/admin/users/${userId}/`, { role: newRole });
      fetchData();
    } catch {
      alert("Failed to update role");
    }
  };

  const handleTogglePermission = async (permId, canAccess) => {
    try {
      await api.patch(`accounts/admin/permissions/${permId}/`, { can_access: !canAccess });
      fetchData();
    } catch {
      alert("Failed to update permission");
    }
  };

  const handleCreateFlow = async () => {
    const name = prompt("Flow Name:");
    const type = prompt("Request Type (leave, asset, travel, invoice, etc):");
    if (name && type) {
      try {
        await createFlow({ name, request_type: type, is_active: true });
        fetchData();
      } catch (err) { alert("Failed to create flow"); }
    }
  };

  const handleAddStep = async (flowId) => {
    const role = prompt("Role Name for this step (manager, hr, finance, it):");
    const order = prompt("Step Order (1, 2, 3...):");
    if (role && order) {
      try {
        await addWorkflowStep(flowId, { role_name: role, step_order: parseInt(order), is_final: false });
        fetchData();
      } catch (err) { alert("Failed to add step"); }
    }
  };

  const tabs = [
    { id: "users", label: "Users", icon: "Users" },
    { id: "permissions", label: "Permissions", icon: "LockClosed" },
    { id: "workflows", label: "Workflows", icon: "Template" },
    { id: "reports", label: "Org Reports", icon: "PresentationChartLine" },
  ];

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-8 border-r border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase whitespace-nowrap">Admin Center</h2>
        </div>

        <nav className="space-y-2 flex-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white shadow-lg shadow-indigo-500/20"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-2xl text-sm font-bold transition-all mt-6">
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-500 font-medium mt-1">System-wide governance and resource tracking</p>
          </div>
          <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-slate-100 font-bold text-slate-400 text-xs">
            ADMIN ROOT ACCESS: <span className="text-indigo-600">{currentUser?.name}</span>
          </div>
        </header>

        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-200 rounded-3xl w-full"></div>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-64 bg-slate-200 rounded-3xl"></div>
              <div className="h-64 bg-slate-200 rounded-3xl"></div>
            </div>
          </div>
        ) : (
          <div className="space-y-10">
            {activeTab === "users" && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[#0f172a]">User Infrastructure</h3>
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{users.length} Active Identity Nodes</div>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-5">Verified Name</th>
                      <th className="px-8 py-5">Digital Identifier</th>
                      <th className="px-8 py-5 text-center">Role Mapping</th>
                      <th className="px-8 py-5 text-right">System Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-700">{u.name}</td>
                        <td className="px-8 py-5 text-slate-500 font-medium">{u.email}</td>
                        <td className="px-8 py-5 text-center">
                          <select 
                            value={u.roles?.[0] || 'employee'} 
                            onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                            className="bg-white border border-slate-200 text-xs font-bold px-3 py-1.5 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20"
                          >
                            {roles.map(r => <option key={r} value={r}>{r.toUpperCase()}</option>)}
                          </select>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${u.roles?.[0] === 'admin' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-500'}`}>
                            {u.roles?.[0] || 'standard'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {activeTab === "permissions" && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <h3 className="text-xl font-bold text-[#0f172a] mb-8">Access Matrix Policy</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {roles.map(role => (
                    <div key={role} className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100 shadow-sm">
                      <h4 className="font-black uppercase text-[10px] tracking-widest text-indigo-500 mb-6 flex justify-between">
                        {role} 
                        <span className="text-slate-300">ROLE TIER</span>
                      </h4>
                      <div className="space-y-4">
                        {permissions.filter(p => p.role_name === role).map(p => (
                          <div key={p.id} className="flex items-center justify-between group">
                            <span className="text-sm font-bold text-slate-600">{p.feature_name}</span>
                            <button 
                              onClick={() => handleTogglePermission(p.id, p.can_access)}
                              className={`w-11 h-6 rounded-full relative transition-all duration-300 ${p.can_access ? 'bg-indigo-500' : 'bg-slate-300'}`}
                            >
                              <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${p.can_access ? 'left-6' : 'left-1'}`} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "workflows" && (
              <section className="space-y-8">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold text-[#0f172a]">Workflow Blueprints</h3>
                  <button onClick={handleCreateFlow} className="bg-indigo-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-500/20 hover:bg-indigo-600 transition-all">+ New Blueprint</button>
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {flows.map(flow => (
                    <div key={flow.id} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                      <div className="flex justify-between items-start mb-8">
                        <div>
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="text-lg font-bold text-slate-800">{flow.name}</h4>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded uppercase tracking-tighter">{flow.request_type}</span>
                          </div>
                          <p className="text-xs text-slate-400 font-medium">System UUID: {flow.id}</p>
                        </div>
                        <button onClick={() => deleteFlow(flow.id).then(fetchData)} className="text-red-400 hover:text-red-600 text-xs font-bold">Purge Flow</button>
                      </div>
                      
                      <div className="relative">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-slate-100 -z-10 -translate-y-1/2 hidden md:block"></div>
                        <div className="flex flex-col md:flex-row gap-6 items-center">
                          {flow.steps?.map((step, idx) => (
                            <div key={step.id} className="bg-slate-50 border border-slate-100 px-5 py-4 rounded-2xl flex flex-col items-center gap-2 relative min-w-[140px]">
                              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white border border-slate-100 text-[10px] font-black text-slate-400 w-6 h-6 flex items-center justify-center rounded-full shadow-sm">{idx + 1}</span>
                              <span className="text-xs font-black text-indigo-600 uppercase tracking-widest">{step.role_name}</span>
                              <button onClick={() => deleteWorkflowStep(step.id).then(fetchData)} className="text-[10px] font-bold text-slate-400 hover:text-red-500 transition-colors">REMOVE</button>
                            </div>
                          ))}
                          <button onClick={() => handleAddStep(flow.id)} className="border-2 border-dashed border-slate-200 rounded-2xl px-5 py-4 text-xs font-bold text-slate-400 hover:border-indigo-400 hover:text-indigo-500 transition-all">+ Add Logic Step</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {activeTab === "reports" && stats && (
              <section className="space-y-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {[
                    { label: "Total Requests", val: stats.total, color: "indigo" },
                    { label: "Pending Audit", val: stats.pending, color: "amber" },
                    { label: "Final Approved", val: stats.approved, color: "emerald" },
                    { label: "Denied Access", val: stats.rejected, color: "red" }
                  ].map(item => (
                    <div key={item.label} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 text-center">
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2">{item.label}</p>
                      <p className={`text-4xl font-black text-${item.color}-500`}>{item.val}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Departmental Distribution</h3>
                    <div className="space-y-6">
                      {Object.entries(stats.department_breakdown).map(([dept, count]) => (
                        <div key={dept} className="group">
                          <div className="flex justify-between text-xs font-bold mb-2">
                            <span className="text-slate-600">{dept}</span>
                            <span className="text-indigo-600">{count}</span>
                          </div>
                          <div className="overflow-hidden h-2.5 rounded-full bg-slate-100 border border-slate-50">
                            <div 
                              style={{ width: `${(count / stats.total) * 100 || 0}%` }} 
                              className="h-full bg-indigo-500 group-hover:bg-indigo-600 transition-all duration-1000 shadow-sm"
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8">Request Type Intensity</h3>
                    <div className="grid grid-cols-2 gap-6">
                      {Object.entries(stats.type_breakdown).map(([type, count]) => (
                        <div key={type} className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{type}</p>
                          <p className="text-2xl font-black text-slate-800">{count}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
