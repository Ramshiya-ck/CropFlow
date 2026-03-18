import { useEffect, useState } from "react";
import { managerPendingRequests, approveRequest, rejectRequest } from "../../api/requests";
import { Link } from "react-router-dom";

export default function PendingApprovals() {
  const [list, setList] = useState([]);

  const fetchList = () => {
    managerPendingRequests().then((res) => setList(res.data));
  };

  useEffect(() => {
    fetchList();
  }, []);

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve?")) {
      try {
        await approveRequest(id);
        fetchList();
      } catch (err) {
        alert("Action failed!");
      }
    }
  };

  const handleReject = async (id) => {
    const comment = window.prompt("Enter rejection reason (optional):");
    if (comment !== null) {
      try {
        await rejectRequest(id, comment);
        fetchList();
      } catch (err) {
        alert("Action failed!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-2xl font-bold mb-6">
        Pending Approvals
      </h1>

      <div className="bg-white p-6 rounded-xl shadow">

        <table className="w-full text-sm">

          <thead className="border-b text-gray-500">
            <tr>
              <th className="text-left py-2">Title</th>
              <th className="text-left">Employee</th>
              <th className="text-left">Status</th>
              <th className="text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-b">

                <td className="py-2">{r.title}</td>
                <td>{r.created_by_email}</td>
                <td>{r.status}</td>

                <td className="text-right flex gap-2 justify-end">
                  <button
                    onClick={() => handleApprove(r.id)}
                    className="bg-green-500 text-white px-3 py-1 rounded text-xs hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(r.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <Link
                    to={`/manager/requests/${r.id}`}
                    className="bg-blue-500 text-white px-3 py-1 rounded text-xs hover:bg-blue-600 ml-2"
                  >
                    Details
                  </Link>
                </td>

              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">No pending requests found.</td>
              </tr>
            )}
          </tbody>

        </table>
      </div>
    </div>
  );
}
