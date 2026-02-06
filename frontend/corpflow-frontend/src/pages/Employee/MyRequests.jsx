import { useEffect, useState } from "react";
import { myRequests } from "../../api/requests";
import { Link } from "react-router-dom";

export default function MyRequests() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myRequests()
      .then((res) => setList(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          My Requests
        </h1>
        <p className="text-sm text-gray-500">
          Track all your submitted requests and approval status.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow p-6">

        {loading ? (
          <p className="text-gray-500">Loading requests...</p>
        ) : list.length === 0 ? (
          <p className="text-gray-500">No requests submitted yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500 text-left">
                <th className="py-2">Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {list.map((r) => (
                <RequestRow key={r.id} r={r} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

/* ---------------- Row Component ---------------- */

function RequestRow({ r }) {
  const badge =
    r.status === "approved"
      ? "bg-green-100 text-green-700"
      : r.status === "rejected"
      ? "bg-red-100 text-red-700"
      : r.status === "in_review"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <tr className="border-b last:border-none">

      <td className="py-3 font-medium text-gray-800">
        {r.title}
      </td>

      <td className="capitalize">{r.request_type}</td>

      <td>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${badge}`}
        >
          {r.status.replace("_", " ")}
        </span>
      </td>

      <td className="text-gray-500 text-sm">
        {new Date(r.created_at).toLocaleDateString()}
      </td>

      <td>
        <Link
          to={`/employee/requests/${r.id}`}
          className="text-emerald-700 font-medium hover:underline"
        >
          View
        </Link>
      </td>

    </tr>
  );
}
