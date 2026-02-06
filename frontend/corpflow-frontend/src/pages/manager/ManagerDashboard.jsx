import { useNavigate } from "react-router-dom";

export default function ManagerDashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Card title="Pending Approvals" value="5" />
        <Card title="Team Requests" value="14" />
        <Card title="Rejected This Month" value="2" />

      </div>

      <div className="mt-8">
        <button
          onClick={() => navigate("/manager/approvals")}
          className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
        >
          View Pending Approvals
        </button>
      </div>
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold mt-2">{value}</h3>
    </div>
  );
}
