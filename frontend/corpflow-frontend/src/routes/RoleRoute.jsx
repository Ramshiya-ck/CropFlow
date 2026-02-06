import { Navigate } from "react-router-dom";

export default function RoleRoute({ role, children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) return <Navigate to="/" />;

  return children;
}
