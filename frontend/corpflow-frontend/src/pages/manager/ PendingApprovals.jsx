import { useEffect, useState } from "react";
import { managerPendingRequests } from "../../api/requests";
import { Link } from "react-router-dom";

export default function PendingApprovals() {
  const [list, setList] = useState([]);

  useEffect(() => {
    managerPendingRequests().then((res) => setList(res.data));
  }, []);

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
              <th>Employee</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {list.map((r) => (
              <tr key={r.id} className="border-b">

                <td>{r.title}</td>
                <td>{r.created_by_email}</td>
                <td>{r.status}</td>

                <td>
                  <Link
                    to={`/manager/requests/${r.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Review
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}
