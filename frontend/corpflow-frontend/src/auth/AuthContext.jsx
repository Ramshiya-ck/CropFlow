/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("accessToken");
    const storedUser = localStorage.getItem("user");
    if (!token || !storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  });
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPermissions = useCallback(async () => {
    try {
      const res = await api.get("accounts/my-permissions/");
      setPermissions(res.data.map(p => p.feature_name));
    } catch (err) {
      console.error("Failed to fetch permissions", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const res = await api.post("accounts/login/", {
      email,
      password,
    });

    localStorage.setItem("accessToken", res.data.access);
    localStorage.setItem("refreshToken", res.data.refresh);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    setUser(res.data.user);
    await fetchPermissions();
    return res.data.user;
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setPermissions([]);
    setLoading(false);
  };

  const hasPermission = (featureName) => {
    const roles = user?.roles || [];
    if (roles.some((r) => String(r).toLowerCase() === "admin")) return true;
    return permissions.includes(featureName);
  };

  // Re-fetch permissions when we have a user restored/logged-in.
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token && user) {
      fetchPermissions();
    } else {
      setLoading(false);
    }
  }, [fetchPermissions, user]);

  return (
    <AuthContext.Provider value={{ user, permissions, login, logout, hasPermission, loading }}>
      {children}
    </AuthContext.Provider>
  );
}
