import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function RoleRoute({ role, children }) {
  const { user, loading } = useContext(AuthContext);

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse tracking-widest uppercase text-xs">Loading Security Context...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;

  const roles = Array.isArray(user.roles) ? user.roles : user.role ? [user.role] : [];
  const normalized = roles.map((r) => String(r).toLowerCase());
  if (!normalized.includes(String(role).toLowerCase())) return <Navigate to="/" />;

  return children;
}
