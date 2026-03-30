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
      {/* STATUS + HEADER */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">{req.title}</h1>
        <p className="text-sm text-gray-500">
          Request ID #{req.id} • {req.request_type}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center mb-6">
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${
            req.status === "approved"
              ? "bg-green-100 text-green-700"
              : req.status === "rejected"
              ? "bg-red-100 text-red-700"
              : req.status === "in_review"
              ? "bg-blue-100 text-blue-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {req.status.toUpperCase()}
        </span>
        <span className="text-sm text-gray-400">
          Created on {req.created_at ? new Date(req.created_at).toLocaleString() : "—"}
        </span>
      </div>

      {/* REQUEST DATA */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold mb-4">Request Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {req.data && Object.entries(req.data).length > 0 ? (
            Object.entries(req.data).map(([key, value]) => (
              <div key={key} className="bg-gray-50 rounded p-3">
                <p className="text-gray-500 capitalize">{key}</p>
                <p className="font-medium">
                  {typeof value === "object" ? JSON.stringify(value) : String(value)}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No data available.</p>
          )}
        </div>
      </div>

      {/* HISTORY */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold mb-4">Approval Timeline</h2>
        {req.history && req.history.length > 0 ? (
          <ul className="space-y-3">
            {req.history.map((h) => (
              <li key={h.id} className="border-l-4 border-emerald-500 pl-4">
                <p className="font-medium">{h.action}</p>
                <p className="text-xs text-gray-500">
                  {h.action_by_email} • {new Date(h.created_at).toLocaleString()}
                </p>
                {h.comment && <p className="text-sm text-gray-600 mt-1">{h.comment}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No history yet.</p>
        )}
      </div>

      {/* DOCUMENTS */}
      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h2 className="font-semibold mb-4">Documents</h2>
        {req.documents && req.documents.length > 0 ? (
          <ul className="space-y-2">
            {req.documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline"
                >
                  Download File
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-sm">No documents uploaded yet.</p>
        )}
      </div>

      {/* ACTIONS */}
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
              navigate("/manager/pending");
            }}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Approve
          </button>

          <button
            onClick={async () => {
              await rejectRequest(id, comment);
              alert("Rejected!");
              navigate("/manager/pending");
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
