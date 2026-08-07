import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "@/lib/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("spms_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [loading, setLoading] = useState(!!localStorage.getItem("spms_token") && !user);

  useEffect(() => {
    const token = localStorage.getItem("spms_token");
    if (token && !user) {
      api.get("/auth/me").then(({ data }) => {
        setUser(data);
        localStorage.setItem("spms_user", JSON.stringify(data));
      }).catch(() => {}).finally(() => setLoading(false));
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("spms_token", data.token);
    localStorage.setItem("spms_user", JSON.stringify(data.user));
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem("spms_token");
    localStorage.removeItem("spms_user");
    setUser(null);
    window.location.href = "/login";
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
