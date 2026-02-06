import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRequestDetail,
  approveRequest,
  rejectRequest,
} from "../../api/requests";

export default function ApprovalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [req, setReq] = useState(null);
  const [comment, setComment] = useState("");

  useEffect(() => {
    getRequestDetail(id).then((res) => setReq(res.data));
  }, [id]);

  if (!req) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <h1 className="text-2xl font-bold mb-4">
        {req.title}
      </h1>

      <div className="bg-white p-6 rounded-xl shadow mb-6">

        <p><b>Type:</b> {req.request_type}</p>
        <p><b>Status:</b> {req.status}</p>

        <h3 className="font-semibold mt-4 mb-2">
          Request Data
        </h3>

        <pre className="bg-gray-50 p-3 rounded">
          {JSON.stringify(req.data, null, 2)}
        </pre>
      </div>

      {/* Actions */}
      <div className="bg-white p-6 rounded-xl shadow">

        <textarea
          placeholder="Comment (optional)"
          className="border w-full p-2 rounded mb-4"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className="flex gap-4">

          <button
            onClick={async () => {
              await approveRequest(id);
              alert("Approved!");
              navigate("/manager/approvals");
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Approve
          </button>

          <button
            onClick={async () => {
              await rejectRequest(id, comment);
              alert("Rejected!");
              navigate("/manager/approvals");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Reject
          </button>

        </div>
      </div>
    </div>
  );
}
