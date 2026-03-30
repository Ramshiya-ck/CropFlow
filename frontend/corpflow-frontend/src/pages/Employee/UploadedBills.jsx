import { useEffect, useState } from "react";
import { myDocuments } from "../../api/requests";

export default function UploadedBills() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    myDocuments()
      .then((res) => setDocs(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Uploaded Bills</h1>
        <p className="text-sm text-gray-500">
          Download documents you uploaded for your requests.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        {loading ? (
          <p className="text-gray-500">Loading documents...</p>
        ) : docs.length === 0 ? (
          <p className="text-gray-500">No documents uploaded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-gray-500 text-left">
                <th className="py-2">Request</th>
                <th className="py-2">Status</th>
                <th className="py-2">Document</th>
                <th className="py-2">Uploaded</th>
              </tr>
            </thead>
            <tbody>
              {docs.map((d) => (
                <tr key={d.id} className="border-b last:border-none">
                  <td className="py-3 font-medium text-gray-800">{d.request_title}</td>
                  <td className="py-3 capitalize">{(d.request_status || "").replace("_", " ")}</td>
                  <td className="py-3">
                    {d.file ? (
                      <a
                        href={d.file}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-medium hover:underline"
                      >
                        Download
                      </a>
                    ) : (
                      <span className="text-gray-500">N/A</span>
                    )}
                  </td>
                  <td className="py-3 text-gray-500">
                    {new Date(d.uploaded_at).toLocaleString()}
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

