import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatusBadge } from "./Dashboard";
import { QRCodeCanvas } from "qrcode.react";
import { Package, Clock, MapPin, Truck, KeyRound, QrCode, Timer } from "lucide-react";

export default function StudentPortal() {
  const { data: parcels } = useQuery({
    queryKey: ["my-parcels"],
    queryFn: async () => (await api.get("/parcels?limit=100")).data,
  });
  const [openId, setOpenId] = useState(null);
  const open = parcels?.find(p => p.id === openId);

  const active = (parcels || []).filter(p => p.status !== "collected");
  const history = (parcels || []).filter(p => p.status === "collected");

  return (
    <div className="space-y-8" data-testid="student-portal-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Student Portal</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">My Parcels</h1>
        <p className="text-slate-500 mt-1 text-sm">View incoming parcels, generate OTP or QR to collect at security desk</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { l: "Ready to Collect", v: active.filter(p => p.status === "ready").length, i: Package, c: "text-[#D34449] bg-[#FDECED]" },
          { l: "Pending Delivery", v: active.filter(p => p.status === "pending").length, i: Timer, c: "text-amber-600 bg-amber-50" },
          { l: "Collected", v: history.length, i: Clock, c: "text-emerald-600 bg-emerald-50" },
        ].map((s, i) => (
          <Card key={i} className="dc-card p-5">
            <div className={`p-2 rounded-lg inline-flex ${s.c}`}><s.i className="w-4 h-4" /></div>
            <div className="text-2xl font-semibold text-slate-900 mt-3">{s.v}</div>
            <div className="text-xs text-slate-500 mt-1">{s.l}</div>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Active Parcels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {active.length === 0 && (
            <Card className="p-8 col-span-full text-center text-slate-500 text-sm">No active parcels.</Card>
          )}
          {active.map(p => (
            <Card key={p.id} className="dc-card dc-card-hover p-5" data-testid={`parcel-card-${p.id}`}>
              <div className="flex justify-between items-start mb-3">
                <StatusBadge status={p.status} />
                <span className="text-[10px] text-slate-400">#{p.tracking_number}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-900 font-medium mb-1"><Truck className="w-3.5 h-3.5 text-slate-400" /> {p.courier}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-1"><MapPin className="w-3.5 h-3.5" /> Rack {p.rack_code} • Bin {p.bin_code}</div>
              <div className="flex items-center gap-2 text-xs text-slate-500 mb-4"><Clock className="w-3.5 h-3.5" /> Arrived {new Date(p.arrival_ts).toLocaleDateString()}</div>
              <Button size="sm" onClick={() => setOpenId(p.id)} className="w-full bg-[#D34449] hover:bg-[#B93A3F] text-white" data-testid={`view-otp-${p.id}`}>
                <QrCode className="w-3.5 h-3.5 mr-1.5" /> View OTP & QR
              </Button>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-lg font-semibold text-slate-900 mb-4">Pickup History</h2>
        <Card className="dc-card p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
                  <th className="px-6 py-3 font-semibold">Tracking</th>
                  <th className="px-6 py-3 font-semibold">Courier</th>
                  <th className="px-6 py-3 font-semibold">Location</th>
                  <th className="px-6 py-3 font-semibold">Collected</th>
                  <th className="px-6 py-3 font-semibold">Method</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {history.slice(0, 10).map(p => (
                  <tr key={p.id} className="hover:bg-slate-50">
                    <td className="px-6 py-3 font-mono text-xs">{p.tracking_number}</td>
                    <td className="px-6 py-3">{p.courier}</td>
                    <td className="px-6 py-3">{p.rack_code} / {p.bin_code}</td>
                    <td className="px-6 py-3 text-xs">{p.pickup_ts ? new Date(p.pickup_ts).toLocaleString() : "—"}</td>
                    <td className="px-6 py-3"><Badge variant="outline">{p.verification_method || "OTP"}</Badge></td>
                  </tr>
                ))}
                {history.length === 0 && (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500 text-sm">No pickup history yet.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpenId(null)}>
        <DialogContent className="max-w-md bg-white">
          <DialogHeader>
            <DialogTitle>Parcel Verification</DialogTitle>
          </DialogHeader>
          {open && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-block p-4 bg-white border-2 border-slate-100 rounded-xl">
                  <QRCodeCanvas value={JSON.stringify({ id: open.id, otp: open.otp })} size={180} />
                </div>
              </div>
              <div className="text-center">
                <div className="text-xs uppercase tracking-widest text-slate-500 mb-2">One-Time PIN</div>
                <div className="text-4xl font-mono font-bold text-[#D34449] tracking-widest">{open.otp}</div>
              </div>
              <div className="border-t border-slate-200 pt-4 space-y-2 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Tracking</span><span className="font-mono text-xs">{open.tracking_number}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Courier</span><span className="font-medium">{open.courier}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Location</span><span className="font-medium">Rack {open.rack_code} · Bin {open.bin_code}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Deadline</span><span>{new Date(open.pickup_deadline).toLocaleDateString()}</span></div>
              </div>
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
                Present the OTP or QR to security personnel to collect your parcel.
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
