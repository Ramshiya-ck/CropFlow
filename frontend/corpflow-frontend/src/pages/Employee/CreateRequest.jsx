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
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(16,185,129,0.12),_transparent_32%),linear-gradient(to_bottom,#f8fafc,#eef2ff)] p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600">Premium Workspace</p>
            <h1 className="text-4xl font-black text-[#0f172a] tracking-tight mt-2">Create New Request</h1>
            <p className="text-slate-500 font-medium mt-3 max-w-2xl">
              Submit a polished workflow request with the right context, cost, and priority so approvals move faster.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 w-full lg:w-auto">
            <InfoChip label="Flow" value="Smart Routing" />
            <InfoChip label="Review" value="Instant" />
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_0.9fr] gap-6">
          <div className="bg-white/90 backdrop-blur-xl rounded-[28px] shadow-xl shadow-slate-200/50 border border-white/70 p-8">
            <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Request Title">
                <input
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Medical Leave / Laptop Replacement"
                  className="premium-input"
                />
              </Field>

              <Field label="Request Type">
                <select
                  required
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="premium-input"
                >
                  <option value="">Select Type</option>
                  <option value="LEAVE">Leave</option>
                  <option value="ASSET">Asset</option>
                  <option value="TRAVEL">Travel</option>
                </select>
              </Field>

              <Field label="Reason / Item">
                <input
                  value={data.reason}
                  onChange={(e) => setData({ ...data, reason: e.target.value })}
                  placeholder="Vacation / Laptop / Client Travel"
                  className="premium-input"
                />
              </Field>

              <Field label="Amount / Days / Cost">
                <input
                  value={data.amount}
                  onChange={(e) => setData({ ...data, amount: e.target.value })}
                  placeholder="75000 / 5 days"
                  className="premium-input"
                />
              </Field>

              <div className="md:col-span-2 pt-2">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white py-4 font-bold shadow-xl shadow-emerald-500/20 hover:shadow-emerald-500/35 hover:scale-[1.01] transition-all disabled:opacity-60"
                >
                  {loading ? "Submitting..." : "Submit Premium Request"}
                </button>
              </div>
            </form>
          </div>

          <div className="space-y-6">
            <div className="bg-[#0f172a] text-white rounded-[28px] p-8 shadow-2xl shadow-slate-900/20">
              <p className="text-[11px] uppercase tracking-[0.25em] text-emerald-300 font-black">Best Practice</p>
              <h3 className="text-2xl font-black mt-3">Submit complete request data</h3>
              <ul className="mt-6 space-y-4 text-sm text-slate-300 font-medium">
                <li>Use a clear title so approvers know the request purpose immediately.</li>
                <li>Add a short reason that explains why the request is important.</li>
                <li>Include days, budget, or cost to speed up downstream approvals.</li>
              </ul>
            </div>

            <div className="bg-white rounded-[28px] p-8 border border-slate-100 shadow-sm">
              <h3 className="text-lg font-black text-[#0f172a]">Quick Preview</h3>
              <div className="mt-5 space-y-4">
                <PreviewRow label="Title" value={title || "Not set yet"} />
                <PreviewRow label="Type" value={type || "No type selected"} />
                <PreviewRow label="Reason" value={data.reason || "No reason added"} />
                <PreviewRow label="Amount / Days" value={data.amount || "No amount added"} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <span className="block text-[11px] font-black uppercase tracking-[0.22em] text-slate-400 mb-3">{label}</span>
      {children}
    </label>
  );
}

function InfoChip({ label, value }) {
  return (
    <div className="bg-white/80 backdrop-blur border border-white/70 rounded-2xl px-5 py-4 shadow-sm">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="text-lg font-black text-[#0f172a] mt-1">{value}</p>
    </div>
  );
}

function PreviewRow({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-4">
      <p className="text-[10px] font-black uppercase tracking-[0.22em] text-slate-400">{label}</p>
      <p className="text-sm font-bold text-slate-700 mt-2">{value}</p>
    </div>
  );
}
