/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  getAdminStats, getFlows, createFlow, deleteFlow, addWorkflowStep, deleteWorkflowStep,
  adminGetRoles, adminCreateRole, adminDeleteRole,
  adminGetUsersFull, adminCreateUserFull, adminUpdateUserFull, adminDeleteUser,
  adminGetGroups, adminCreateGroup, adminDeleteGroup,
  adminGetRequestsFull, adminDeleteRequest,
  adminGetWorkflowInstances
} from "../../api/requests";

const emptyUserForm = { email: "", name: "", password: "", role: "employee" };
const emptyRoleForm = { name: "" };
const emptyAuthorityForm = { name: "" };
const emptyFlowForm = { name: "", request_type: "", is_active: true };
const emptyStepForm = { flowId: "", step_order: "", role_name: "", is_final: false };

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [settingsTab, setSettingsTab] = useState("security");
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [stats, setStats] = useState(null);
  const [flows, setFlows] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [groupList, setGroupList] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [wfInstances, setWfInstances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [roleForm, setRoleForm] = useState(emptyRoleForm);
  const [authorityForm, setAuthorityForm] = useState(emptyAuthorityForm);
  const [flowForm, setFlowForm] = useState(emptyFlowForm);
  const [stepForm, setStepForm] = useState(emptyStepForm);

  const { user: currentUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "overview") {
        const [statsRes, usersRes, rolesRes, flowsRes, requestsRes] = await Promise.all([
          getAdminStats(),
          adminGetUsersFull(),
          adminGetRoles(),
          getFlows(),
          adminGetRequestsFull(),
        ]);
        setStats(statsRes.data);
        setUsers(usersRes.data);
        setRoleList(rolesRes.data);
        setFlows(flowsRes.data);
        setAllRequests(requestsRes.data);
      } else if (activeTab === "users") {
        const [usersRes, rolesRes] = await Promise.all([adminGetUsersFull(), adminGetRoles()]);
        setUsers(usersRes.data);
        setRoleList(rolesRes.data);
      } else if (activeTab === "roles") {
        const [rolesRes, groupsRes] = await Promise.all([adminGetRoles(), adminGetGroups()]);
        setRoleList(rolesRes.data);
        setGroupList(groupsRes.data);
      } else if (activeTab === "workflows") {
        const [flowsRes, instRes, rolesRes] = await Promise.all([
          getFlows(),
          adminGetWorkflowInstances(),
          adminGetRoles(),
        ]);
        setFlows(flowsRes.data);
        setWfInstances(instRes.data);
        setRoleList(rolesRes.data);
      } else if (activeTab === "requests") {
        const res = await adminGetRequestsFull();
        setAllRequests(res.data);
      } else if (activeTab === "settings") {
        const [rolesRes, permsRes] = await Promise.all([
          adminGetRoles(),
          api.get("accounts/admin/permissions/"),
        ]);
        setRoleList(rolesRes.data);
        setPermissions(permsRes.data);
      }
    } catch (err) {
      console.error("Failed to fetch admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await adminUpdateUserFull(userId, { role: newRole });
      fetchData();
    } catch {
      alert("Failed to update user role.");
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

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      await adminCreateUserFull(userForm);
      setUserForm(emptyUserForm);
      fetchData();
    } catch {
      alert("Failed to create user");
    }
  };

  const handleCreateRole = async (e) => {
    e.preventDefault();
    if (!roleForm.name.trim()) return;
    try {
      await adminCreateRole({ name: roleForm.name.trim() });
      setRoleForm(emptyRoleForm);
      fetchData();
    } catch {
      alert("Failed to create role");
    }
  };

  const handleCreateAuthority = async (e) => {
    e.preventDefault();
    if (!authorityForm.name.trim()) return;
    try {
      await adminCreateGroup({ name: authorityForm.name.trim() });
      setAuthorityForm(emptyAuthorityForm);
      fetchData();
    } catch {
      alert("Failed to create authority");
    }
  };

  const handleCreateFlow = async (e) => {
    e.preventDefault();
    try {
      await createFlow(flowForm);
      setFlowForm(emptyFlowForm);
      fetchData();
    } catch {
      alert("Failed to deploy workflow");
    }
  };

  const handleCreateStep = async (e) => {
    e.preventDefault();
    if (!stepForm.flowId) return;
    try {
      await addWorkflowStep(stepForm.flowId, {
        step_order: parseInt(stepForm.step_order, 10),
        role_name: stepForm.role_name,
        is_final: stepForm.is_final,
      });
      setStepForm(emptyStepForm);
      fetchData();
    } catch {
      alert("Failed to add workflow step");
    }
  };

  const tabs = [
    { id: "overview", label: "Dashboard" },
    { id: "users", label: "Users" },
    { id: "roles", label: "Roles & Authority" },
    { id: "workflows", label: "Workflows" },
    { id: "requests", label: "Requests" },
    { id: "settings", label: "Settings" },
  ];

  const uniqueFeatures = Array.from(new Set(permissions.map((p) => p.feature_name))).sort();

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-8 border-r border-white/5 shadow-2xl shrink-0">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-black tracking-tighter uppercase">Enterprise Admin</h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Control center</p>
          </div>
        </div>

        <nav className="space-y-1.5 flex-1 overflow-y-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 border border-transparent ${
                activeTab === tab.id
                  ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/20 shadow-sm"
                  : "text-slate-400 hover:bg-white/5 hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="flex items-center justify-center gap-3 bg-red-500/5 hover:bg-red-500/10 text-red-400 p-3 rounded-2xl text-xs font-bold transition-all mt-6 border border-red-500/10"
        >
          Sign Out
        </button>
      </aside>

      <main className="flex-1 p-10 overflow-y-auto bg-[#f8fafc]">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">
              {activeTab === "overview" ? "Admin Dashboard" : activeTab === "roles" ? "Roles & Authority" : activeTab === "settings" ? "Admin Settings" : `${activeTab[0].toUpperCase()}${activeTab.slice(1)}`}
            </h1>
            <p className="text-slate-500 font-medium mt-1">Authorized system oversight for {currentUser?.email}</p>
          </div>
          <div className="flex items-center gap-3 bg-white rounded-2xl p-2 shadow-sm border border-slate-100 pr-5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center text-white font-bold text-xs">
              {currentUser?.name?.[0] || "A"}
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{currentUser?.name}</span>
          </div>
        </header>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="space-y-6">
            {activeTab === "overview" && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <StatCard label="Users" val={users.length || stats?.total_users || 0} color="indigo" />
                  <StatCard label="Roles" val={roleList.length} color="emerald" />
                  <StatCard label="Workflows" val={flows.length} color="amber" />
                  <StatCard label="Requests" val={allRequests.length || stats?.total || 0} color="rose" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
                  <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-[#0f172a]">Platform Snapshot</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live overview</span>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <MiniStat label="Pending" value={stats?.pending || 0} />
                      <MiniStat label="Approved" value={stats?.approved || 0} />
                      <MiniStat label="Rejected" value={stats?.rejected || 0} />
                      <MiniStat label="Active Flows" value={wfInstances.length} />
                    </div>
                  </section>

                  <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <h3 className="text-lg font-bold text-[#0f172a] mb-6">Quick Access</h3>
                    <div className="space-y-3">
                      <QuickLink label="Manage users" onClick={() => setActiveTab("users")} />
                      <QuickLink label="Role & authority setup" onClick={() => setActiveTab("roles")} />
                      <QuickLink label="Workflow designer" onClick={() => setActiveTab("workflows")} />
                      <QuickLink label="Security settings" onClick={() => { setActiveTab("settings"); setSettingsTab("security"); }} />
                    </div>
                  </section>
                </div>
              </>
            )}

            {activeTab === "users" && (
              <div className="grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] gap-6">
                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <h3 className="text-lg font-bold text-[#0f172a] mb-6">Create User</h3>
                  <form onSubmit={handleCreateUser} className="space-y-4">
                    <FormField label="Full Name">
                      <input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} className="form-input" />
                    </FormField>
                    <FormField label="Email">
                      <input type="email" value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} className="form-input" />
                    </FormField>
                    <FormField label="Password">
                      <input type="password" value={userForm.password} onChange={(e) => setUserForm({ ...userForm, password: e.target.value })} className="form-input" />
                    </FormField>
                    <FormField label="Role">
                      <select value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} className="form-input">
                        {roleList.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                      </select>
                    </FormField>
                    <button type="submit" className="primary-btn w-full">Create User</button>
                  </form>
                </section>

                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="p-8 border-b border-slate-50 bg-slate-50/30">
                    <h3 className="text-lg font-bold text-[#0f172a]">User Directory</h3>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                        <th className="px-8 py-5">Name</th>
                        <th className="px-8 py-5">Email</th>
                        <th className="px-8 py-5">Role</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-8 py-5 font-bold text-slate-700">{u.name}</td>
                          <td className="px-8 py-5 text-slate-500">{u.email}</td>
                          <td className="px-8 py-5">
                            <select
                              value={u.roles?.[0] || "employee"}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              className="form-input text-xs py-2"
                            >
                              {roleList.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                            </select>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <button onClick={() => adminDeleteUser(u.id).then(fetchData)} className="text-rose-500 hover:text-rose-700 font-bold">Delete</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </section>
              </div>
            )}

            {activeTab === "roles" && (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#0f172a]">Roles Form</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Authority model</span>
                  </div>
                  <form onSubmit={handleCreateRole} className="flex gap-3 mb-6">
                    <input
                      value={roleForm.name}
                      onChange={(e) => setRoleForm({ name: e.target.value })}
                      placeholder="Create new role"
                      className="form-input flex-1"
                    />
                    <button type="submit" className="primary-btn">Add Role</button>
                  </form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {roleList.map((r) => (
                      <div key={r.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest text-slate-800">{r.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">SYSTEM ROLE</p>
                        </div>
                        <button onClick={() => adminDeleteRole(r.id).then(fetchData)} className="text-rose-500 hover:text-rose-700 font-bold">Delete</button>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-[#0f172a]">Authority Form</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Groups / teams</span>
                  </div>
                  <form onSubmit={handleCreateAuthority} className="flex gap-3 mb-6">
                    <input
                      value={authorityForm.name}
                      onChange={(e) => setAuthorityForm({ name: e.target.value })}
                      placeholder="Create authority group"
                      className="form-input flex-1"
                    />
                    <button type="submit" className="primary-btn">Add Authority</button>
                  </form>
                  <div className="space-y-3">
                    {groupList.map((g) => (
                      <div key={g.id} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex justify-between items-center">
                        <div>
                          <p className="text-sm font-black uppercase tracking-widest text-slate-800">{g.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-1">AUTHORITY GROUP</p>
                        </div>
                        <button onClick={() => adminDeleteGroup(g.id).then(fetchData)} className="text-rose-500 hover:text-rose-700 font-bold">Delete</button>
                      </div>
                    ))}
                    {groupList.length === 0 && <div className="text-sm text-slate-400">No authority groups yet.</div>}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "workflows" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[#0f172a]">Deploy Logic</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Workflow form</span>
                    </div>
                    <form onSubmit={handleCreateFlow} className="space-y-4">
                      <FormField label="Flow Name">
                        <input value={flowForm.name} onChange={(e) => setFlowForm({ ...flowForm, name: e.target.value })} className="form-input" placeholder="Leave Flow" />
                      </FormField>
                      <FormField label="Request Type">
                        <input value={flowForm.request_type} onChange={(e) => setFlowForm({ ...flowForm, request_type: e.target.value })} className="form-input" placeholder="LEAVE" />
                      </FormField>
                      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <input type="checkbox" checked={flowForm.is_active} onChange={(e) => setFlowForm({ ...flowForm, is_active: e.target.checked })} />
                        Active flow
                      </label>
                      <button type="submit" className="primary-btn w-full">Deploy Logic</button>
                    </form>
                  </section>

                  <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-[#0f172a]">Step Form</h3>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Add workflow step</span>
                    </div>
                    <form onSubmit={handleCreateStep} className="space-y-4">
                      <FormField label="Workflow">
                        <select value={stepForm.flowId} onChange={(e) => setStepForm({ ...stepForm, flowId: e.target.value })} className="form-input">
                          <option value="">Select workflow</option>
                          {flows.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
                        </select>
                      </FormField>
                      <div className="grid grid-cols-2 gap-4">
                        <FormField label="Step Order">
                          <input type="number" value={stepForm.step_order} onChange={(e) => setStepForm({ ...stepForm, step_order: e.target.value })} className="form-input" />
                        </FormField>
                        <FormField label="Role Name">
                          <select value={stepForm.role_name} onChange={(e) => setStepForm({ ...stepForm, role_name: e.target.value })} className="form-input">
                            <option value="">Select role</option>
                            {roleList.map((r) => <option key={r.id} value={r.name}>{r.name}</option>)}
                          </select>
                        </FormField>
                      </div>
                      <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <input type="checkbox" checked={stepForm.is_final} onChange={(e) => setStepForm({ ...stepForm, is_final: e.target.checked })} />
                        Final step
                      </label>
                      <button type="submit" className="primary-btn w-full">Add Step</button>
                    </form>
                  </section>
                </div>

                <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                  <h3 className="text-lg font-bold text-[#0f172a] mb-6">Workflow List</h3>
                  <div className="space-y-4">
                    {flows.map((f) => (
                      <div key={f.id} className="p-5 border border-slate-100 rounded-2xl bg-slate-50/50">
                        <div className="flex justify-between items-start gap-6">
                          <div className="flex-1">
                            <p className="text-sm font-black text-slate-800 uppercase tracking-widest">{f.name}</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-1">TYPE: {f.request_type}</p>
                            <div className="space-y-2 mt-4">
                              {f.steps?.map((step) => (
                                <div key={step.id} className="text-xs text-slate-600 flex justify-between items-center bg-white p-3 rounded-xl border border-slate-100">
                                  <span>Step {step.step_order}: {step.role_name} {step.is_final ? "(Final)" : ""}</span>
                                  <button onClick={() => deleteWorkflowStep(step.id).then(fetchData)} className="text-rose-500 hover:text-rose-700 font-bold">Delete</button>
                                </div>
                              ))}
                            </div>
                          </div>
                          <button onClick={() => deleteFlow(f.id).then(fetchData)} className="text-rose-500 hover:text-rose-700 font-bold">Delete Flow</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="bg-indigo-900 text-white rounded-3xl shadow-xl border border-white/5 p-8">
                  <h3 className="text-lg font-bold mb-6">Live Execution Instances</h3>
                  <div className="space-y-4">
                    {wfInstances.map((inst) => (
                      <div key={inst.id} className="bg-white/5 border border-white/10 p-4 rounded-xl flex justify-between items-center">
                        <div>
                          <p className="text-sm font-bold">{inst.request_title}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">At Step: {inst.current_step_name || "Processing"}</p>
                        </div>
                        <span className="px-3 py-1 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-indigo-300">Active</span>
                      </div>
                    ))}
                    {wfInstances.length === 0 && <p className="text-white/20 text-xs font-bold uppercase tracking-widest text-center py-10">No active execution pipelines detected</p>}
                  </div>
                </section>
              </div>
            )}

            {activeTab === "requests" && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex justify-between items-center">
                  <h3 className="text-lg font-bold text-[#0f172a]">Request Explorer</h3>
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{allRequests.length} requests</div>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-50">
                      <th className="px-8 py-5">Title</th>
                      <th className="px-8 py-5">Requester</th>
                      <th className="px-8 py-5">Type</th>
                      <th className="px-8 py-5">Status</th>
                      <th className="px-8 py-5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {allRequests.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-8 py-5 font-bold text-slate-700">{r.title}</td>
                        <td className="px-8 py-5 text-slate-500">{r.created_by_email}</td>
                        <td className="px-8 py-5"><span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-black rounded uppercase">{r.request_type}</span></td>
                        <td className="px-8 py-5">
                          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                            r.status === "approved" ? "bg-emerald-100 text-emerald-600" :
                            r.status === "rejected" ? "bg-rose-100 text-rose-600" : "bg-slate-100 text-slate-500"
                          }`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <button onClick={() => adminDeleteRequest(r.id).then(fetchData)} className="text-rose-500 hover:text-rose-700 font-bold">Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </section>
            )}

            {activeTab === "settings" && (
              <section className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
                <div className="flex gap-3 mb-8">
                  {["security", "role-permissions", "profile"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setSettingsTab(tab)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        settingsTab === tab ? "bg-indigo-600 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                      }`}
                    >
                      {tab === "role-permissions" ? "Role & Permissions" : tab[0].toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {settingsTab === "security" && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <SettingCard title="Session Security" desc="Monitor token lifetime and login safety policy." />
                    <SettingCard title="Access Monitoring" desc="Review role escalation and privileged access flow." />
                    <SettingCard title="Environment Safety" desc="Keep admin-only controls protected and auditable." />
                  </div>
                )}

                {settingsTab === "role-permissions" && (
                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 bg-slate-50/50">
                          <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Role</th>
                          {uniqueFeatures.map((fName) => (
                            <th key={fName} className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center whitespace-nowrap">{fName}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {roleList.map((role) => (
                          <tr key={role.id} className="hover:bg-slate-50/30 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border bg-slate-50 text-slate-600 border-slate-200">
                                {role.name}
                              </span>
                            </td>
                            {uniqueFeatures.map((fName) => {
                              const perm = permissions.find((p) => p.role_name === role.name && p.feature_name === fName);
                              const canAccess = perm ? perm.can_access : false;
                              return (
                                <td key={fName} className="px-6 py-4 text-center">
                                  <button
                                    onClick={() => perm && handleTogglePermission(perm.id, perm.can_access)}
                                    disabled={!perm}
                                    className={`w-10 h-6 rounded-full relative transition-all duration-300 ${canAccess ? "bg-indigo-600" : "bg-slate-200"} ${!perm ? "opacity-50 cursor-not-allowed" : ""}`}
                                  >
                                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${canAccess ? "left-5" : "left-1"}`} />
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {settingsTab === "profile" && (
                  <div className="max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SettingInfo label="Admin Name" value={currentUser?.name || "-"} />
                      <SettingInfo label="Admin Email" value={currentUser?.email || "-"} />
                      <SettingInfo label="Primary Role" value={currentUser?.roles?.[0] || "admin"} />
                      <SettingInfo label="Access Scope" value="Enterprise Administration" />
                    </div>
                  </div>
                )}
              </section>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

function FormField({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{label}</span>
      {children}
    </label>
  );
}

function StatCard({ label, val, color }) {
  const colors = {
    indigo: "from-indigo-600 to-blue-500",
    amber: "from-amber-400 to-orange-500",
    emerald: "from-emerald-500 to-teal-600",
    rose: "from-rose-500 to-pink-600",
  };
  return (
    <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-lg transition-all group">
      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 group-hover:text-indigo-500 transition-colors">{label}</p>
      <p className={`text-4xl font-black bg-gradient-to-br ${colors[color]} bg-clip-text text-transparent`}>{val}</p>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-5">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-3xl font-black text-[#0f172a] mt-2">{value}</p>
    </div>
  );
}

function QuickLink({ label, onClick }) {
  return (
    <button onClick={onClick} className="w-full text-left px-5 py-4 rounded-2xl bg-slate-50 hover:bg-slate-100 border border-slate-100 text-sm font-bold text-slate-700 transition-all">
      {label}
    </button>
  );
}

function SettingCard({ title, desc }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
      <h4 className="text-sm font-black uppercase tracking-widest text-slate-800">{title}</h4>
      <p className="text-sm text-slate-500 mt-3 font-medium">{desc}</p>
    </div>
  );
}

function SettingInfo({ label, value }) {
  return (
    <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-700 mt-2">{value}</p>
    </div>
  );
}
