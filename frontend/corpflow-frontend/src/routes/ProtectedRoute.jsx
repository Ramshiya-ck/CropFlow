import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";

export default function ProtectedRoute({ children }) {
  const { loading } = useContext(AuthContext);
  const token = localStorage.getItem("accessToken");

  if (loading) return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse tracking-widest uppercase text-xs">Verifying Session...</p>
      </div>
    </div>
  );

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}
