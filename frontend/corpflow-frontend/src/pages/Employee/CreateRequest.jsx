import { useState } from "react";
import { createRequest } from "../../api/requests";
import { useNavigate } from "react-router-dom";

export default function CreateRequest() {
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");

  const [data, setData] = useState({
    reason: "",
    amount: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await createRequest({
        title,
        request_type: type,
        data,
      });

      alert("Request submitted successfully!");
      navigate("/employee/requests");
    } catch (err) {
      console.error(err);
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
          Enter request details to start approval workflow.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow p-6 max-w-4xl">

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* TITLE */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">
              Request Title
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="For Asset / Medical Leave"
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-600"
            />
          </div>

          {/* TYPE */}
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

          {/* REASON / ITEM */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Reason / Item
            </label>
            <input
              value={data.reason}
              onChange={(e) =>
                setData({ ...data, reason: e.target.value })
              }
              placeholder="Laptop / Vacation"
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* AMOUNT / DAYS */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Amount / Days / Cost
            </label>
            <input
              value={data.amount}
              onChange={(e) =>
                setData({ ...data, amount: e.target.value })
              }
              placeholder="75000 / 5 days"
              className="w-full border rounded-lg p-2"
            />
          </div>

          {/* SUBMIT */}
          <div className="md:col-span-2">
            <button
              disabled={loading}
              type="submit"
              className="w-full bg-emerald-600 text-white py-2 rounded-lg font-semibold hover:bg-emerald-700 disabled:opacity-60"
            >
              {loading ? "Submitting..." : "Submit Request"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
