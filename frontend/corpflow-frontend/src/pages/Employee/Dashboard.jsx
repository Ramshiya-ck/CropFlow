import { useNavigate } from "react-router-dom";

export default function EmployeeDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex bg-slate-100">

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-emerald-900 text-white flex flex-col p-6">
        <h2 className="text-2xl font-bold mb-10">CorpFlow</h2>

        <nav className="space-y-3 flex-1">
          <SidebarItem label="Dashboard" />
          <SidebarItem
            label="Create Request"
            onClick={() => navigate("/employee/create")}
          />
          <SidebarItem
            label="My Requests"
            onClick={() => navigate("/employee/requests")}
          />
          <SidebarItem label="Documents" />
          <SidebarItem label="Help & Support" />
        </nav>

        <button className="bg-red-600 hover:bg-red-700 py-2 rounded-lg text-sm">
          Logout
        </button>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1 p-8">

        {/* ---------- TOP BAR ---------- */}
        <div className="flex justify-between items-center mb-8">

          <input
            placeholder="Search requests..."
            className="bg-white px-4 py-2 rounded-lg shadow w-72 focus:outline-none"
          />

          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">Employee</span>
            <img
              src="https://i.pravatar.cc/40"
              className="rounded-full"
              alt="avatar"
            />
          </div>
        </div>

        {/* ---------- KPI CARDS ---------- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Metric title="Total Requests" value="18" />
          <Metric title="Pending" value="5" />
          <Metric title="Approved" value="11" />
          <Metric title="Rejected" value="2" />
        </div>

        {/* ---------- MIDDLE GRID ---------- */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">

          {/* Chart Placeholder */}
          <div className="bg-white rounded-xl shadow p-6 col-span-2">
            <h3 className="font-semibold mb-4">
              Request Activity (Monthly)
            </h3>

            <div className="h-56 flex items-center justify-center text-gray-400 border rounded-lg">
              📊 Chart Component Later
            </div>
          </div>

          {/* Status Pie */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="font-semibold mb-4">Request Status</h3>

            <div className="h-56 flex items-center justify-center text-gray-400 border rounded-lg">
              🥧 Pie Chart Later
            </div>
          </div>
        </div>

        {/* ---------- TABLE ---------- */}
        <div className="bg-white rounded-xl shadow p-6">

          <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Recent Requests</h3>

            <button
              onClick={() => navigate("/employee/requests")}
              className="text-sm bg-emerald-600 text-white px-4 py-1.5 rounded hover:bg-emerald-700"
            >
              View All
            </button>
          </div>

          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="py-2">Type</th>
                <th>Status</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <Row type="Leave" status="Pending" />
              <Row type="Asset" status="Approved" />
              <Row type="Travel" status="Rejected" />
            </tbody>
          </table>
        </div>

      </main>
    </div>
  );
}

/* ================= COMPONENTS ================= */

function SidebarItem({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      className="text-left px-4 py-2 rounded-lg hover:bg-emerald-700"
    >
      {label}
    </button>
  );
}

function Metric({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}

function Row({ type, status }) {
  const badge =
    status === "Approved"
      ? "bg-green-100 text-green-700"
      : status === "Rejected"
      ? "bg-red-100 text-red-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <tr className="border-b">
      <td className="py-3">{type}</td>
      <td>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${badge}`}
        >
          {status}
        </span>
      </td>
      <td>2026-02-03</td>
      <td>
        <button className="text-emerald-700 hover:underline">
          Details
        </button>
      </td>
    </tr>
  );
}
