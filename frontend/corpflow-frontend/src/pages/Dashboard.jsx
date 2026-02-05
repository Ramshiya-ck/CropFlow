import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white p-6 flex flex-col">
        <h2 className="text-2xl font-bold mb-8">CorpFlow</h2>

        <nav className="space-y-3 flex-1">
          <button className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700">
            Dashboard
          </button>
          <button className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700">
            My Requests
          </button>
          <button className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700">
            Approvals
          </button>
          <button className="block w-full text-left px-3 py-2 rounded hover:bg-slate-700">
            Audit Logs
          </button>
        </nav>

        <button
          onClick={logout}
          className="bg-red-600 hover:bg-red-700 py-2 rounded text-sm"
        >
          Logout
        </button>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome{user ? `, ${user.email}` : ""} 👋
          </h1>
          <span className="text-sm text-gray-500">
            Enterprise Workflow System
          </span>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <StatCard title="Total Requests" value="12" />
          <StatCard title="Pending Approvals" value="5" />
          <StatCard title="Approved" value="6" />
          <StatCard title="Rejected" value="1" />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>

          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Create Request
            </button>

            <button className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700">
              View My Requests
            </button>

            <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Pending Approvals
            </button>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>

          <ul className="divide-y">
            <li className="py-3 text-sm text-gray-600">
              Leave request submitted
            </li>
            <li className="py-3 text-sm text-gray-600">
              Asset request approved by IT
            </li>
            <li className="py-3 text-sm text-gray-600">
              Travel request pending HR approval
            </li>
          </ul>
        </div>

      </main>
    </div>
  );
}

/* Reusable stat card */
function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
    </div>
  );
}
