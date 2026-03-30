import { useEffect, useState } from "react";
import { myHistory } from "../../api/requests";

export default function History() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myHistory()
      .then((res) => setItems(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Request History</h1>
        <p className="text-sm text-gray-500">Approval timeline across all your requests.</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <p className="text-gray-500">Loading history...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500">No history yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500 text-left">
                <th className="py-2">Request</th>
                <th className="py-2">Action</th>
                <th className="py-2">Comment</th>
                <th className="py-2">When</th>
              </tr>
            </thead>
            <tbody>
              {items.map((h) => (
                <tr key={h.id} className="border-b last:border-none">
                  <td className="py-3 font-medium text-gray-800">
                    {h.request_title} <span className="text-gray-500 text-xs">#{h.request_id}</span>
                  </td>
                  <td className="py-3 capitalize">{h.action}</td>
                  <td className="py-3 text-gray-600">{h.comment || "—"}</td>
                  <td className="py-3 text-gray-500">
                    {new Date(h.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

