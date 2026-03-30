import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";

export default function Landing() {
  const { user, loading } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (user && user.roles && user.roles.length > 0) {
      const role = user.roles[0].toLowerCase();
      if (role === "employee") {
        navigate("/employee");
      } else if (role === "manager") {
        navigate("/manager");
      } else if (role === "finance") {
        navigate("/finance");
      } else if (role === "it") {
        navigate("/it");
      } else if (role === "hr") {
        navigate("/hr");
      } else if (role === "admin") {
        navigate("/admin");
      } else {
        // Fallback or general dashboard if implemented
        navigate("/employee"); 
      }
    } else {
      // If no role or user not loaded properly, go to login or a default
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
