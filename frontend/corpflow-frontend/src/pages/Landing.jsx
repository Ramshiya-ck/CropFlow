import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function Landing() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (user && user.roles && user.roles.length > 0) {
      const roles = user.roles.map(r => r.toLowerCase());

      if (roles.includes("admin")) {
        navigate("/admin");
      } else if (roles.includes("hr")) {
        navigate("/hr");
      } else if (roles.includes("finance")) {
        navigate("/finance");
      } else if (roles.includes("it")) {
        navigate("/it");
      } else if (roles.includes("manager")) {
        navigate("/manager");
      } else if (roles.includes("employee")) {
        navigate("/employee");
      } else {
        navigate("/employee");
      }
    } else {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 font-medium animate-pulse tracking-widest uppercase text-xs">
          Redirecting to your Workspace...
        </p>
      </div>
    </div>
  );
}