import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getRequestDetail } from "../../api/requests";

export default function RequestDetail() {
  const { id } = useParams();
  const [req, setReq] = useState(null);

  useEffect(() => {
    getRequestDetail(id).then((res) => setReq(res.data));
  }, [id]);

  if (!req) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <p className="text-gray-500">Loading request...</p>
      </div>
    );
  }

  const badge =
    req.status === "approved"
      ? "bg-green-100 text-green-700"
      : req.status === "rejected"
      ? "bg-red-100 text-red-700"
      : req.status === "in_review"
      ? "bg-blue-100 text-blue-700"
      : "bg-yellow-100 text-yellow-700";

  return (
    <div className="min-h-screen bg-gray-100 p-8 space-y-6">

      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">
          {req.title}
        </h1>
        <p className="text-sm text-gray-500">
          Request ID #{req.id} • {req.request_type}
        </p>
      </div>

      {/* STATUS */}
      <div className="bg-white rounded-xl shadow p-5 flex justify-between items-center">
        <span
          className={`px-4 py-1 rounded-full text-sm font-semibold ${badge}`}
        >
          {req.status.toUpperCase()}
        </span>

        <span className="text-sm text-gray-400">
          Created on{" "}
          {new Date(req.created_at).toLocaleString()}
        </span>
      </div>

      {/* DATA SECTION */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Request Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {Object.entries(req.data).map(([key, value]) => (
            <div key={key} className="bg-gray-50 rounded p-3">
              <p className="text-gray-500 capitalize">{key}</p>
              <p className="font-medium">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORY */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Approval Timeline</h2>

        <ul className="space-y-3">
          {req.history.map((h) => (
            <li
              key={h.id}
              className="border-l-4 border-emerald-500 pl-4"
            >
              <p className="font-medium">{h.action}</p>
              <p className="text-xs text-gray-500">
                {h.action_by_email} •{" "}
                {new Date(h.created_at).toLocaleString()}
              </p>
              {h.comment && (
                <p className="text-sm text-gray-600 mt-1">
                  {h.comment}
                </p>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* DOCUMENTS */}
      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="font-semibold mb-4">Documents</h2>

        {req.documents.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No documents uploaded yet.
          </p>
        ) : (
          <ul className="space-y-2">
            {req.documents.map((doc) => (
              <li key={doc.id}>
                <a
                  href={doc.file}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-700 hover:underline"
                >
                  📄 Download File
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>

    </div>
  );
}
