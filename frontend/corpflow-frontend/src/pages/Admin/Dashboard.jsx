import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [roles] = useState(["admin", "employee", "manager", "finance"]);
  const [loading, setLoading] = useState(true);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersRes, permissionsRes] = await Promise.all([
        api.get("accounts/admin/users/"),
        api.get("accounts/admin/permissions/"),
      ]);
      setUsers(usersRes.data);
      setPermissions(permissionsRes.data);
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
    } catch (err) {
      alert("Failed to update role");
    }
  };

  const handleTogglePermission = async (permId, canAccess) => {
    try {
      await api.patch(`accounts/admin/permissions/${permId}/`, { can_access: !canAccess });
      fetchData();
    } catch (err) {
      alert("Failed to update permission");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-8 transition-all border-r border-white/5 shadow-2xl">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-purple-500 to-blue-600 shadow-lg shadow-purple-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter uppercase">Admin Panel</h2>
        </div>

        <nav className="space-y-2 flex-1">
          <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold bg-purple-500 text-white shadow-lg">
            User Management
          </button>
          <button className="w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold text-slate-400 hover:bg-white/5 hover:text-white">
            Permission Matrix
          </button>
        </nav>

        <button onClick={() => { logout(); navigate("/login"); }} className="flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-2xl text-sm font-bold transition-all mt-6">
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-[#0f172a]">Organization Control Center</h1>
          <p className="text-slate-500 font-medium">Manage corporate identities and system-wide feature access.</p>
        </div>

        {/* Users Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 mb-10">
          <h3 className="text-xl font-bold text-[#0f172a] mb-6">User Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 uppercase text-[10px] tracking-widest font-black border-b">
                  <th className="pb-4 px-4 text-left">User</th>
                  <th className="pb-4">Email</th>
                  <th className="pb-4">Current Role</th>
                  <th className="pb-4 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {users.map(u => (
                  <tr key={u.id} className="hover:bg-slate-50">
                    <td className="py-4 px-4 font-bold">{u.name}</td>
                    <td className="py-4 text-slate-500">{u.email}</td>
                    <td className="py-4">
                      <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-600 text-xs font-bold uppercase">{u.roles?.[0]}</span>
                    </td>
                    <td className="py-4 text-right pr-4">
                      <select 
                        value={u.roles?.[0]} 
                        onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                        className="text-xs font-bold border rounded-lg p-1"
                      >
                        {roles.map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Permissions Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <h3 className="text-xl font-bold text-[#0f172a] mb-6">Feature Access Matrix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roles.map(role => (
              <div key={role} className="bg-slate-50 rounded-2xl p-6">
                <h4 className="font-bold uppercase text-xs tracking-widest text-slate-400 mb-4">{role}</h4>
                <div className="space-y-3">
                  {permissions.filter(p => p.role === (roles.indexOf(role) + 1)).map(p => (
                    <div key={p.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-700">{p.feature_name}</span>
                      <button 
                        onClick={() => handleTogglePermission(p.id, p.can_access)}
                        className={`w-10 h-5 rounded-full relative transition-colors ${p.can_access ? 'bg-emerald-500' : 'bg-slate-300'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${p.can_access ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
