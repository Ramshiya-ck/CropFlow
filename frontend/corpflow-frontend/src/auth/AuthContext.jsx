import { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);

  const fetchPermissions = async () => {
    try {
      const res = await api.get("accounts/my-permissions/");
      setPermissions(res.data.map(p => p.feature_name));
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    }
  };

  const login = async (email, password) => {
    const res = await api.post("accounts/login/", {
      email,
      password,
    });

    localStorage.setItem("accessToken", res.data.access);
    localStorage.setItem("refreshToken", res.data.refresh);

    setUser(res.data.user);
    await fetchPermissions();
    return res.data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setPermissions([]);
  };

  const hasPermission = (featureName) => {
    if (user?.roles?.includes("admin")) return true;
    return permissions.includes(featureName);
  };

  // Re-fetch permissions on mount if user is logged in
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && !user) {
      // Logic to restore user session could go here if needed
      // For now, assume login handles it
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, permissions, login, logout, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
}
