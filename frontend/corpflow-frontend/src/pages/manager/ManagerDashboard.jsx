import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

export default function ManagerDashboard() {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-[#063970] text-white flex flex-col p-8 transition-all duration-300 border-r border-white/5 shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-400 to-indigo-600 shadow-lg shadow-blue-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 21a11.955 11.955 0 01-9.618-7.016m18.236 0a11.958 11.958 0 00-18.236 0m18.236 0H12.5m-6.5 0h12.5" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter">CorpFlow</h2>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem label="Manager Overview" activeIcon={true} />
          {hasPermission("Approve Workflow") && (
            <SidebarItem
              label="Pending Approvals"
              onClick={() => navigate("/manager/pending")}
              icon={<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />}
            />
          )}
          <SidebarItem
            label="Team Performance"
            icon={<path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />}
          />
          {hasPermission("View Reports") && (
            <SidebarItem label="Reports" icon={<path d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />} />
          )}
        </nav>

        <button 
          onClick={handleLogout}
          className="group flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-red-500/0 hover:shadow-red-500/20 mt-6"
        >
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign Out
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* ---------- TOP BAR ---------- */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Manager Portal</h1>
            <p className="text-slate-500 font-medium mt-1">Reviewing organization-wide workflows and approvals.</p>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
              {user?.name?.[0] || "M"}
            </div>
            <div>
              <p className="text-sm font-bold text-[#0f172a] leading-tight">{user?.name || "Senior Manager"}</p>
              <p className="text-[10px] uppercase tracking-widest font-bold text-blue-600">Executive Access</p>
            </div>
          </div>
        </div>

        {/* ---------- KPI CARDS ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Metric title="Awaiting Decision" value="05" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="amber" />
          <Metric title="Team Submissions" value="14" icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" color="blue" />
          <Metric title="Monthly Rejections" value="02" icon="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" color="rose" />
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 text-center flex flex-col items-center justify-center min-h-[400px]">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 mb-6 font-black text-2xl tracking-tighter">
            5
          </div>
          <h3 className="text-2xl font-bold text-[#0f172a] mb-2 px-1">Critical Tasks Awaiting Your Action</h3>
          <p className="text-slate-500 max-w-md mx-auto mb-8 font-medium px-1">
            There are several high-priority requests in the pipeline that require management oversight.
          </p>
          {hasPermission("Approve Workflow") && (
            <button
              onClick={() => navigate("/manager/pending")}
              className="group relative flex items-center gap-3 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all duration-300 shadow-xl shadow-blue-500/20 active:scale-95"
            >
              Access Approval Console
              <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </button>
          )}
        </div>

      </main>
    </div>
  );
}

function SidebarItem({ label, onClick, icon, activeIcon = false }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
        activeIcon 
        ? "bg-blue-500 text-white shadow-lg shadow-blue-500/20" 
        : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <svg className={`w-5 h-5 transition-colors ${activeIcon ? "text-white" : "text-slate-500 group-hover:text-white"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon || (
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        )}
      </svg>
      {label}
    </button>
  );
}

function Metric({ title, value, icon, color }) {
  const colors = {
    amber: "from-amber-400 to-orange-500 shadow-amber-500/20",
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    rose: "from-rose-500 to-pink-600 shadow-rose-500/20"
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 group hover:translate-y-[-4px] transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-lg mb-4 transform group-hover:rotate-6 transition-transform`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-4xl font-black text-[#0f172a] mt-1 tracking-tight">{value}</h3>
    </div>
  );
}
