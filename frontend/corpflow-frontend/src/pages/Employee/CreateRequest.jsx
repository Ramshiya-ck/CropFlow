import { useState } from "react";
import { createRequest } from "../../api/requests";
import { useNavigate } from "react-router-dom";

export default function CreateRequest() {
  const [type, setType] = useState("");
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createRequest({
        request_type: type,
        data,
      });

      alert("Request submitted successfully!");
      navigate("/employee/requests");
    } catch (err) {
      alert("Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Create New Request
        </h1>
        <p className="text-sm text-gray-500">
          Submit a new request for approval workflow
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl">

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* Request Type */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Request Type
            </label>
            <select
              required
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
            >
              <option value="">Select Type</option>
              <option value="LEAVE">Leave</option>
              <option value="ASSET">Asset</option>
              <option value="TRAVEL">Travel</option>
            </select>
          </div>

          {/* Reason / Item */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Reason / Item
            </label>
            <input
              required
              placeholder="e.g. Medical Leave / Laptop"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
              onChange={(e) =>
                setData({ ...data, reason: e.target.value })
              }
            />
          </div>

          {/* Amount / Days */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount / Days
            </label>
            <input
              placeholder="e.g. 5 days / ₹45000"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
              onChange={(e) =>
                setData({ ...data, amount: e.target.value })
              }
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Upload Bill / Document
            </label>
            <input
              type="file"
              className="w-full border rounded-lg p-2"
              onChange={(e) =>
                setData({
                  ...data,
                  bill: e.target.files[0]?.name,
                })
              }
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
