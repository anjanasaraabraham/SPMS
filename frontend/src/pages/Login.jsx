import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, ShieldCheck, UserCog, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

const ROLES = [
  { id: "student", label: "Student", email: "student@digicampus.edu", password: "password123", icon: GraduationCap },
  { id: "security", label: "Security", email: "security@digicampus.edu", password: "password123", icon: ShieldCheck },
  { id: "admin", label: "Administrator", email: "admin@digicampus.edu", password: "admin123", icon: UserCog },
];

const LOGO_URL = "https://customer-assets-eiarnc6j.emergentagent.net/job_spms-inventory-hub/artifacts/wsl44i71_image.png";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e?.preventDefault();
    if (!role) { toast.error("Please select a role."); return; }
    if (!email) { toast.error("Please enter your email."); return; }
    if (!password) { toast.error("Please enter your password."); return; }
    setBusy(true);
    try {
      const user = await login(email, password);
      if (user.role !== role) {
        toast.warning(`Signed in but selected role differs (account is ${user.role}).`);
      } else {
        toast.success(`Welcome, ${user.name}`);
      }
      nav("/");
    } catch (err) {
      toast.error(err?.response?.data?.detail || "Invalid credentials");
    } finally { setBusy(false); }
  };

  const fillDemo = (r) => {
    setRole(r.id);
    setEmail(r.email);
    setPassword(r.password);
    toast.info(`${r.label} demo prefilled. Click Sign in.`);
  };

  return (
    <div className="min-h-screen relative campus-bg">
      {/* Header watermark */}
      <div className="absolute top-6 left-6 z-10 text-white/90 text-xs uppercase tracking-widest hidden sm:block">
        Great Lakes Institute of Management · Gurgaon
      </div>

      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Logo above card */}
          <div className="flex flex-col items-center mb-4">
            <div className="bg-white rounded-2xl shadow-xl p-4 border border-white/50">
              <img src={LOGO_URL} alt="Great Lakes Gurgaon" className="h-20 w-auto object-contain" />
            </div>
          </div>

          {/* Login card */}
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-6">
              <div className="text-[10px] uppercase tracking-[0.2em] text-slate-500 mb-2">Welcome to</div>
              <h1 className="text-2xl font-semibold text-slate-900 leading-tight">
                Student Parcel<br />Management System
              </h1>
              <div className="text-xs text-slate-500 mt-2">Integrated with Digiicampus</div>
              <div className="mt-4 h-px bg-slate-200" />
              <div className="text-sm font-medium text-slate-700 mt-4">Sign in to continue</div>
            </div>

            {/* Role selector */}
            <div className="mb-5">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-600 mb-2">Select your role</div>
              <div className="grid grid-cols-3 gap-2">
                {ROLES.map((r) => {
                  const active = role === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      data-testid={`role-${r.id}`}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1.5 ${
                        active
                          ? "border-[#D34449] bg-[#FDECED] text-[#D34449] shadow-sm"
                          : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <r.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{r.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <form onSubmit={submit} className="space-y-4" data-testid="login-form">
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Email / Registration ID</label>
                <Input
                  data-testid="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@digicampus.edu"
                  className="mt-1.5 h-11 bg-white border-slate-200"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Password</label>
                <div className="relative mt-1.5">
                  <Input
                    data-testid="login-password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="h-11 bg-white border-slate-200 pr-10"
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <Button
                data-testid="login-submit"
                type="submit"
                disabled={busy}
                className="w-full h-11 bg-[#D34449] hover:bg-[#B93A3F] text-white font-medium shadow-sm rounded-lg"
              >
                {busy ? "Signing in…" : "Sign in to Digiicampus"}
              </Button>
              <div className="flex items-center justify-between text-xs">
                <button type="button" className="text-slate-500 hover:text-[#D34449]">Forgot password?</button>
                <button type="button" className="text-slate-500 hover:text-[#D34449]">Need assistance?</button>
              </div>
            </form>

            {/* Demo buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200">
              <div className="text-[10px] uppercase tracking-widest text-slate-400 text-center mb-2">Demo accounts (click to prefill)</div>
              <div className="flex gap-2 justify-center">
                {ROLES.map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => fillDemo(r)}
                    data-testid={`demo-${r.id}`}
                    className="text-[11px] px-3 py-1.5 rounded-full bg-slate-100 hover:bg-[#FDECED] hover:text-[#D34449] text-slate-600 transition-colors"
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center text-[10px] text-white/70 mt-6">
            powered by Digii · © 2026 Great Lakes Institute of Management
          </div>
        </div>
      </div>
    </div>
  );
}
