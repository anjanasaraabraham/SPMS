import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { QRCodeCanvas } from "qrcode.react";
import { StatusBadge } from "./Dashboard";
import { Search, Package, UserCheck, PrinterIcon, ShieldCheck, ScanLine } from "lucide-react";

export default function SecurityOps() {
  const qc = useQueryClient();
  const [form, setForm] = useState({
    tracking_number: "", student_roll: "", courier: "FedEx",
    parcel_size: "small", damaged: false, misplaced: false, notes: ""
  });
  const [student, setStudent] = useState(null);
  const [label, setLabel] = useState(null);

  const [verifyId, setVerifyId] = useState("");
  const [verifyOtp, setVerifyOtp] = useState("");

  const { data: recent } = useQuery({ queryKey: ["recent-ops"], queryFn: async () => (await api.get("/parcels?limit=10")).data });

  const findStudent = async () => {
    if (!form.student_roll) { toast.error("Enter roll number"); return; }
    try {
      const { data } = await api.get(`/students/search?roll=${form.student_roll}`);
      setStudent(data);
      toast.success(`Student found: ${data.name}`);
    } catch (e) { toast.error("Student not found"); setStudent(null); }
  };

  const register = useMutation({
    mutationFn: async () => (await api.post("/parcels", form)).data,
    onSuccess: (parcel) => {
      toast.success(`Parcel registered • ${parcel.rack_code}/${parcel.bin_code}`);
      setLabel(parcel);
      setForm({ tracking_number: "", student_roll: "", courier: "FedEx", parcel_size: "small", damaged: false, misplaced: false, notes: "" });
      setStudent(null);
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(e?.response?.data?.detail || "Failed"),
  });

  const verify = useMutation({
    mutationFn: async () => (await api.post("/parcels/verify", { parcel_id: verifyId, otp: verifyOtp })).data,
    onSuccess: () => {
      toast.success("Parcel released to student");
      setVerifyId(""); setVerifyOtp("");
      qc.invalidateQueries();
    },
    onError: (e) => toast.error(e?.response?.data?.detail || "Verification failed"),
  });

  return (
    <div className="space-y-8" data-testid="security-ops-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Security Operations</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Parcel Receiving & Handover</h1>
        <p className="text-slate-500 mt-1 text-sm">Register incoming parcels and verify pickup with OTP/QR</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Register form */}
        <Card className="p-6 lg:col-span-2 card-shadow">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-600"><Package className="w-4 h-4" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">Receive New Parcel</h3>
              <p className="text-xs text-slate-500">Enter details to auto-assign rack and generate OTP/QR</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Tracking Number</Label>
              <Input data-testid="tracking-input" className="mt-2" value={form.tracking_number} onChange={(e) => setForm({...form, tracking_number: e.target.value})} placeholder="TRK1234567890" />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Courier</Label>
              <Select value={form.courier} onValueChange={(v) => setForm({...form, courier: v})}>
                <SelectTrigger className="mt-2" data-testid="courier-select"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">
                  {["FedEx","DHL","BlueDart","Delhivery","IndiaPost"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Student Roll Number</Label>
              <div className="flex gap-2 mt-2">
                <Input data-testid="roll-input" value={form.student_roll} onChange={(e) => setForm({...form, student_roll: e.target.value.toUpperCase()})} placeholder="CS2024001" />
                <Button type="button" variant="outline" onClick={findStudent} data-testid="find-student-btn">
                  <Search className="w-4 h-4 mr-1.5" /> Verify
                </Button>
              </div>
              {student && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-sm">
                  <UserCheck className="w-4 h-4 text-emerald-600" />
                  <span className="font-medium text-emerald-800">{student.name}</span>
                  <span className="text-emerald-600 text-xs">• {student.email}</span>
                </div>
              )}
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Parcel Size</Label>
              <Select value={form.parcel_size} onValueChange={(v) => setForm({...form, parcel_size: v})}>
                <SelectTrigger className="mt-2" data-testid="size-select"><SelectValue /></SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="small">Small → Rack A</SelectItem>
                  <SelectItem value="medium">Medium → Rack B</SelectItem>
                  <SelectItem value="large">Large → Rack C</SelectItem>
                  <SelectItem value="fragile">Fragile → Rack E</SelectItem>
                  <SelectItem value="priority">Priority → Security Locker</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.damaged} onCheckedChange={(v) => setForm({...form, damaged: !!v})} data-testid="damaged-check" />
                <span className="text-slate-700">Damaged</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <Checkbox checked={form.misplaced} onCheckedChange={(v) => setForm({...form, misplaced: !!v})} data-testid="misplaced-check" />
                <span className="text-slate-700">Misplaced</span>
              </label>
            </div>
            <div className="md:col-span-2">
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Notes</Label>
              <Textarea className="mt-2" rows={2} value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} placeholder="Optional handling notes…" />
            </div>
          </div>
          <div className="flex justify-end mt-6 gap-2">
            <Button
              disabled={register.isPending || !student}
              onClick={() => register.mutate()}
              className="bg-[#D34449] hover:bg-[#B93A3F] text-white"
              data-testid="register-parcel-btn"
            >
              <Package className="w-4 h-4 mr-1.5" />
              {register.isPending ? "Registering…" : "Register & Print Label"}
            </Button>
          </div>
        </Card>

        {/* Verify */}
        <Card className="dc-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><ShieldCheck className="w-4 h-4" /></div>
            <div>
              <h3 className="font-semibold text-slate-900">Verify & Release</h3>
              <p className="text-xs text-slate-500">Student presents OTP/QR</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">Parcel ID</Label>
              <Input className="mt-2 font-mono text-xs" value={verifyId} onChange={(e) => setVerifyId(e.target.value)} placeholder="uuid…" data-testid="verify-id" />
            </div>
            <div>
              <Label className="text-xs font-semibold uppercase tracking-wider text-slate-600">OTP</Label>
              <Input className="mt-2 font-mono text-lg tracking-widest text-center" value={verifyOtp} onChange={(e) => setVerifyOtp(e.target.value)} maxLength={6} placeholder="6-digit" data-testid="verify-otp" />
            </div>
            <Button
              disabled={verify.isPending}
              onClick={() => verify.mutate()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              data-testid="verify-release-btn"
            >
              <ScanLine className="w-4 h-4 mr-1.5" />
              {verify.isPending ? "Verifying…" : "Verify & Release"}
            </Button>
          </div>
        </Card>
      </div>

      {/* Recent transactions */}
      <Card className="dc-card p-0 overflow-hidden">
        <div className="p-6 border-b border-slate-200">
          <h3 className="font-semibold text-slate-900">Recent Transactions</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3 font-semibold">Tracking</th>
                <th className="px-6 py-3 font-semibold">Student</th>
                <th className="px-6 py-3 font-semibold">Location</th>
                <th className="px-6 py-3 font-semibold">OTP</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold">Received</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(recent || []).map(p => (
                <tr key={p.id} className="hover:bg-slate-50 cursor-pointer" onClick={() => { setVerifyId(p.id); setVerifyOtp(p.otp); }}>
                  <td className="px-6 py-3 font-mono text-xs">{p.tracking_number}</td>
                  <td className="px-6 py-3">{p.student_name}</td>
                  <td className="px-6 py-3 text-slate-600">{p.rack_code} / {p.bin_code}</td>
                  <td className="px-6 py-3 font-mono text-xs">{p.otp}</td>
                  <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-6 py-3 text-xs text-slate-500">{new Date(p.arrival_ts).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Label dialog */}
      <Dialog open={!!label} onOpenChange={(v) => !v && setLabel(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader><DialogTitle>Print Parcel Label</DialogTitle></DialogHeader>
          {label && (
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-slate-500">DigiCampus SPMS</div>
                  <div className="font-mono text-sm mt-1">{label.tracking_number}</div>
                </div>
                <QRCodeCanvas value={JSON.stringify({ id: label.id, otp: label.otp })} size={80} />
              </div>
              <div className="text-lg font-semibold text-slate-900">{label.student_name}</div>
              <div className="text-sm text-slate-600">{label.student_roll}</div>
              <div className="border-t border-slate-200 pt-3">
                <div className="text-xs text-slate-500">Assigned Location</div>
                <div className="text-2xl font-bold text-blue-600">Rack {label.rack_code} · Bin {label.bin_code}</div>
              </div>
              <div className="flex justify-between text-xs text-slate-500">
                <span>OTP: <b className="font-mono text-slate-900">{label.otp}</b></span>
                <span>{label.courier}</span>
              </div>
              <Button onClick={() => window.print()} className="w-full mt-2 bg-slate-900 hover:bg-slate-800 text-white">
                <PrinterIcon className="w-4 h-4 mr-1.5" /> Print
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
