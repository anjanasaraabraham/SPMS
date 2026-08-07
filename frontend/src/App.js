import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import Login from "@/pages/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import Dashboard from "@/pages/Dashboard";
import StudentPortal from "@/pages/StudentPortal";
import SecurityOps from "@/pages/SecurityOps";
import Inventory from "@/pages/Inventory";
import Reports from "@/pages/Reports";
import Notifications from "@/pages/Notifications";
import Administration from "@/pages/Administration";
import Settings from "@/pages/Settings";
import Processes from "@/pages/Processes";
import RiskRegister from "@/pages/RiskRegister";
import AuditLogs from "@/pages/AuditLogs";

function Protected({ children, roles }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-10 text-slate-500">Loading…</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Toaster position="top-right" richColors />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Protected><DashboardLayout /></Protected>}>
            <Route index element={<Dashboard />} />
            <Route path="student-portal" element={<Protected roles={["student", "admin"]}><StudentPortal /></Protected>} />
            <Route path="security" element={<Protected roles={["security", "admin"]}><SecurityOps /></Protected>} />
            <Route path="inventory" element={<Protected roles={["security", "admin"]}><Inventory /></Protected>} />
            <Route path="reports" element={<Protected roles={["security", "admin"]}><Reports /></Protected>} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="administration" element={<Protected roles={["admin"]}><Administration /></Protected>} />
            <Route path="processes" element={<Protected roles={["admin"]}><Processes /></Protected>} />
            <Route path="risks" element={<Protected roles={["admin"]}><RiskRegister /></Protected>} />
            <Route path="audit" element={<Protected roles={["admin"]}><AuditLogs /></Protected>} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
