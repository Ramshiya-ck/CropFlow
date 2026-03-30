import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../auth/AuthContext";

export default function EmployeeDashboard() {
  const navigate = useNavigate();
  const { user, logout, hasPermission } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex bg-[#f8fafc] font-sans">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-72 bg-[#0f172a] text-white flex flex-col p-8 transition-all duration-300 border-r border-white/5 shadow-2xl z-20">
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2 rounded-xl bg-gradient-to-tr from-emerald-500 to-blue-600 shadow-lg shadow-emerald-500/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h2 className="text-2xl font-black tracking-tighter">CorpFlow</h2>
        </div>

        <nav className="space-y-2 flex-1">
          <SidebarItem label="Dashboard" activeIcon={true} />
          {hasPermission("Create Request") && (
            <SidebarItem
              label="Create Request"
              onClick={() => navigate("/employee/create")}
              icon={<path d="M12 4v16m8-8H4" />}
            />
          )}
          <SidebarItem
            label="My Requests"
            onClick={() => navigate("/employee/requests")}
            icon={<path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />}
          />
          <SidebarItem label="Documents" icon={<path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />} />
          <SidebarItem label="Settings" icon={<path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />} />
        </nav>

        <button 
          onClick={handleLogout}
          className="group flex items-center gap-3 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white p-3 rounded-2xl text-sm font-bold transition-all duration-300 shadow-lg shadow-red-500/0 hover:shadow-red-500/20 mt-6"
        >
          <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout Session
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-10 overflow-y-auto">

        {/* ---------- TOP BAR ---------- */}
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-3xl font-extrabold text-[#0f172a] tracking-tight">Welcome Back, {user?.name || "Member"}</h1>
            <p className="text-slate-500 font-medium mt-1">Here's your productivity overview for today.</p>
          </div>

          <div className="flex items-center gap-6">
            <div className="relative group">
              <input
                placeholder="Search workflows..."
                className="bg-white border border-slate-200 px-5 py-3 rounded-2xl shadow-sm w-80 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all duration-300 placeholder-slate-400 font-medium"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <div className="flex items-center gap-4 bg-white p-2 pr-4 rounded-2xl shadow-sm border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {user?.name?.[0] || "U"}
              </div>
              <div>
                <p className="text-sm font-bold text-[#0f172a] leading-tight">{user?.name || "Corporate User"}</p>
                <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-600">Employee Tier 1</p>
              </div>
            </div>
          </div>
        </div>

        {/* ---------- KPI CARDS ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <Metric title="Active Requests" value="18" icon="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" color="emerald" />
          <Metric title="Pending Approvals" value="05" icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" color="amber" />
          <Metric title="Finalized Tasks" value="11" icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" color="blue" />
          <Metric title="Declined" value="02" icon="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" color="rose" />
        </div>

        {/* ---------- MIDDLE GRID ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">

          {/* Chart Placeholder */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8 col-span-2 overflow-hidden relative">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-[#0f172a]">Workflow Performance</h3>
               <button className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-lg hover:bg-emerald-100 transition-colors uppercase tracking-tight">Last 30 Days</button>
            </div>

            <div className="h-64 flex flex-col items-center justify-center text-slate-300 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl group transition-all duration-300 hover:bg-white hover:border-emerald-200">
              <svg className="w-12 h-12 mb-3 opacity-20 group-hover:opacity-100 group-hover:text-emerald-500 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p className="font-bold text-slate-400 group-hover:text-emerald-600 transition-colors uppercase tracking-widest text-xs">Graphical Analysis Engine Loading...</p>
            </div>
          </div>

          {/* Status Pie */}
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h3 className="text-xl font-bold text-[#0f172a] mb-8">Role Distribution</h3>

            <div className="aspect-square flex flex-col items-center justify-center text-slate-300 bg-slate-50 border-2 border-dashed border-slate-200 rounded-full group transition-all duration-300 hover:bg-white hover:border-blue-200 max-w-[240px] mx-auto">
               <div className="w-3/4 h-3/4 border-8 border-slate-100 border-t-blue-500 rounded-full animate-[spin_3s_linear_infinite]" />
               <p className="absolute font-bold text-slate-400 uppercase tracking-widest text-[10px] mt-4">Stat Matrix</p>
            </div>
          </div>
        </div>

        {/* ---------- TABLE ---------- */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">

          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-[#0f172a]">Recent Request Pipeline</h3>
              <p className="text-sm text-slate-500 mt-1 font-medium">Tracking your most recent corporate operations.</p>
            </div>

            <button
              onClick={() => navigate("/employee/requests")}
              className="text-sm font-bold bg-[#0f172a] text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 transition-all duration-300 shadow-lg shadow-slate-900/20 active:scale-95"
            >
              Full Record View
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-slate-400 uppercase text-[10px] tracking-widest font-black border-b border-slate-50">
                  <th className="pb-4 px-4 font-black">Type</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4">Priority</th>
                  <th className="pb-4 text-right pr-4">Timeline</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                <Row type="Annual Leave" status="Pending" priority="Medium" date="Feb 03, 2026" />
                <Row type="Hardware Asset" status="Approved" priority="High" date="Jan 28, 2026" />
                <Row type="Business Travel" status="Rejected" priority="Low" date="Jan 25, 2026" />
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({ label, onClick, icon, activeIcon = false }) {
  return (
    <button
      onClick={onClick}
      className={`group w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-300 ${
        activeIcon 
        ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
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
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
    amber: "from-amber-400 to-orange-500 shadow-amber-500/20",
    blue: "from-blue-500 to-indigo-600 shadow-blue-500/20",
    rose: "from-rose-500 to-pink-600 shadow-rose-500/20"
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-6 group hover:translate-y-[-4px] transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50">
      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${colors[color]} flex items-center justify-center text-white shadow-lg mb-4 transform group-hover:rotate-6 transition-transform`}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <h3 className="text-3xl font-black text-[#0f172a] mt-1 tracking-tight">{value}</h3>
    </div>
  );
}

function Row({ type, status, priority, date }) {
  const statusStyles = {
    Approved: "bg-emerald-50 text-emerald-600 border-emerald-100",
    Rejected: "bg-rose-50 text-rose-600 border-rose-100",
    Pending: "bg-amber-50 text-amber-600 border-amber-100"
  };

  const priorityStyles = {
    High: "text-rose-500",
    Medium: "text-amber-500",
    Low: "text-blue-500"
  };

  return (
    <tr className="group hover:bg-slate-50 transition-colors">
      <td className="py-5 px-4 font-bold text-[#0f172a]">{type}</td>
      <td>
        <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase tracking-tighter border ${statusStyles[status]}`}>
          {status}
        </span>
      </td>
      <td className={`font-bold text-sm ${priorityStyles[priority]}`}>{priority}</td>
      <td className="text-right pr-4 text-slate-400 font-bold text-xs">{date}</td>
    </tr>
  );
}
