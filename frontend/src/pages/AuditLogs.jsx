import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollText, User, Package, Shield, AlertTriangle } from "lucide-react";

const LOGS = [
  { icon: User, ts: "2 min ago", u: "System Administrator", event: "Administrator signed in", tag: "auth", tone: "blue" },
  { icon: Package, ts: "12 min ago", u: "Rajesh Kumar", event: "Parcel registered — TRK52847629 for CS2024001", tag: "parcel", tone: "green" },
  { icon: Shield, ts: "34 min ago", u: "Rajesh Kumar", event: "OTP verification success — parcel released", tag: "verify", tone: "green" },
  { icon: AlertTriangle, ts: "1 hour ago", u: "System", event: "Rack B2 capacity alert triggered (92%)", tag: "system", tone: "amber" },
  { icon: User, ts: "3 hours ago", u: "System Administrator", event: "New user account created", tag: "admin", tone: "blue" },
  { icon: Package, ts: "5 hours ago", u: "Rajesh Kumar", event: "12 parcels registered in bulk", tag: "parcel", tone: "green" },
  { icon: AlertTriangle, ts: "1 day ago", u: "System", event: "Damage flag raised on parcel TRK18374629", tag: "damage", tone: "rose" },
  { icon: Shield, ts: "1 day ago", u: "Rajesh Kumar", event: "Failed OTP attempt — student ID CS2024044", tag: "security", tone: "rose" },
];

const tones = {
  blue: "bg-blue-50 text-blue-600 border-blue-200",
  green: "bg-emerald-50 text-emerald-600 border-emerald-200",
  amber: "bg-amber-50 text-amber-600 border-amber-200",
  rose: "bg-rose-50 text-rose-600 border-rose-200",
};

export default function AuditLogs() {
  return (
    <div className="space-y-6" data-testid="audit-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Administration</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Audit Logs</h1>
        <p className="text-slate-500 mt-1 text-sm">System-wide activity and security events</p>
      </div>

      <Card className="dc-card p-0 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {LOGS.map((l, i) => (
            <div key={i} className="flex items-start gap-4 p-5 hover:bg-slate-50">
              <div className={`p-2 rounded-lg border ${tones[l.tone]}`}>
                <l.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="text-sm font-medium text-slate-900">{l.event}</div>
                  <Badge variant="outline" className="text-[10px]">{l.tag}</Badge>
                </div>
                <div className="text-xs text-slate-500 mt-1">by {l.u}</div>
              </div>
              <div className="text-xs text-slate-400 whitespace-nowrap">{l.ts}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
