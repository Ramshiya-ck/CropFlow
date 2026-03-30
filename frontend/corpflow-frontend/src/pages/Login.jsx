import { useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const user = await login(email, password);
      
      // Role-based redirection
      if (user && user.roles && user.roles.length > 0) {
        const role = user.roles[0].toLowerCase();
        if (role === "employee") {
          navigate("/employee");
        } else if (role === "manager") {
          navigate("/manager");
        } else if (role === "finance") {
          navigate("/finance");
        } else if (role === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        navigate("/");
      }
    } catch (err) {
      setError("Invalid email or password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0f172a] relative overflow-hidden font-sans">
      {/* Dynamic Background Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full blur-[120px]" />

      <div className="w-full max-w-md z-10 px-4">
        {/* Card with Glassmorphism */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-10 transform transition-all hover:scale-[1.01]">
          
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-block p-3 rounded-2xl bg-gradient-to-tr from-emerald-500 to-blue-600 mb-4 shadow-lg shadow-emerald-500/20">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">CorpFlow</h1>
            <p className="text-slate-400 text-sm mt-3 font-medium uppercase tracking-widest">
              Premium Enterprise Suite
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center animate-pulse">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                Corporate Email
              </label>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-1">
                Secure Password
              </label>
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all duration-300"
              />
            </div>

            <div className="pt-2">
              <button
                disabled={loading}
                type="submit"
                className="w-full relative group overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl shadow-emerald-900/20 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-50 active:scale-95"
              >
                <span className="relative z-10">
                  {loading ? "Authenticating..." : "Sign In to Dashboard"}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center space-y-4">
            <p className="text-slate-400 text-sm font-medium transition-all">
              New to the platform?{" "}
              <Link to="/register" className="text-emerald-500 hover:text-emerald-400 font-bold transition-colors">
                Initialize Profile
              </Link>
            </p>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest opacity-50">
              &copy; {new Date().getFullYear()} CORPFLOW SYSTEMS &bull; SECURED ACCESS
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
