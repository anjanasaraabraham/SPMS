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

const LOGO_URL = "https://customer-assets-eiarnc6j.emergentagent.net/job_spms-inventory-hub/artifacts/lxkaa9dr_GLIMG%20Logo.png";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [role, setRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!role) e.role = "Please select a role.";
    if (!email.trim()) e.email = "Please enter your email.";
    if (!password) e.password = "Please enter your password.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async (e) => {
    e?.preventDefault();
    if (!validate()) return;
    setBusy(true);
    try {
      const user = await login(email.trim(), password);
      if (user.role !== role) {
        toast.warning(`Signed in — note: account role is "${user.role}", not "${role}".`);
      } else {
        toast.success(`Welcome, ${user.name}`);
      }
      nav("/");
    } catch (err) {
      const msg = err?.response?.data?.detail || "Invalid email or password";
      setErrors({ submit: typeof msg === "string" ? msg : "Invalid credentials" });
      toast.error(typeof msg === "string" ? msg : "Invalid credentials");
    } finally { setBusy(false); }
  };

  const fillDemo = (r) => {
    setRole(r.id);
    setEmail(r.email);
    setPassword(r.password);
    setErrors({});
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
          <div className="flex flex-col items-center mb-5">
            <img src={LOGO_URL} alt="Great Lakes Gurgaon" className="h-24 w-auto object-contain drop-shadow-lg" />
          </div>

          {/* Login card */}
          <div className="glass-card rounded-2xl p-8">
            <div className="text-center mb-6">
              <h1 className="text-3xl font-bold text-slate-900 leading-tight tracking-tight">
                Welcome to Digiicampus
              </h1>
              <div className="text-xs text-slate-500 mt-3">Sign in to continue</div>
              <div className="mt-4 h-px bg-slate-200" />
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
                      onClick={() => { setRole(r.id); setErrors({ ...errors, role: undefined }); }}
                      data-testid={`role-${r.id}`}
                      className={`p-3 rounded-lg border-2 transition-all flex flex-col items-center gap-1.5 ${
                        active
                          ? "border-[#D34449] bg-[#FDECED] text-[#D34449] shadow-sm"
                          : errors.role
                            ? "border-rose-300 bg-rose-50/60 text-slate-600 hover:border-rose-400"
                            : "border-slate-200 bg-white/70 text-slate-600 hover:border-slate-300"
                      }`}
                    >
                      <r.icon className="w-5 h-5" />
                      <span className="text-xs font-medium">{r.label}</span>
                    </button>
                  );
                })}
              </div>
              {errors.role && (
                <div className="mt-2 text-xs text-rose-600 flex items-center gap-1" data-testid="error-role">
                  <span className="inline-block w-1 h-1 bg-rose-600 rounded-full" /> {errors.role}
                </div>
              )}
            </div>

            <form onSubmit={submit} className="space-y-4" data-testid="login-form" noValidate>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Email / Registration ID</label>
                <Input
                  data-testid="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); if (errors.email) setErrors({ ...errors, email: undefined }); }}
                  placeholder="you@digicampus.edu"
                  className={`mt-1.5 h-11 bg-white ${errors.email ? "border-rose-400 focus-visible:ring-rose-200" : "border-slate-200"}`}
                />
                {errors.email && <div className="mt-1 text-xs text-rose-600" data-testid="error-email">{errors.email}</div>}
              </div>
              <div>
                <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-600">Password</label>
                <div className="relative mt-1.5">
                  <Input
                    data-testid="login-password"
                    type={showPw ? "text" : "password"}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); if (errors.password) setErrors({ ...errors, password: undefined }); }}
                    placeholder="••••••••"
                    className={`h-11 bg-white pr-10 ${errors.password ? "border-rose-400 focus-visible:ring-rose-200" : "border-slate-200"}`}
                  />
                  <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && <div className="mt-1 text-xs text-rose-600" data-testid="error-password">{errors.password}</div>}
              </div>

              {errors.submit && (
                <div className="p-3 rounded-md bg-rose-50 border border-rose-200 text-xs text-rose-700" data-testid="error-submit">
                  {errors.submit}
                </div>
              )}

              <Button
                data-testid="login-submit"
                type="submit"
                disabled={busy}
                className="w-full h-11 bg-[#D34449] hover:bg-[#B93A3F] text-white font-medium shadow-sm rounded-lg disabled:opacity-60"
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
