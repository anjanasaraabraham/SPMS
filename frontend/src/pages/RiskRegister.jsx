import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ShieldCheck, TrendingUp } from "lucide-react";

const RISKS = [
  { id: "R01", risk: "Rack Full / Overflow", impact: "High", probability: "Medium", severity: "amber", mitigation: "Overflow Rack D + real-time utilization alerts at 85%" },
  { id: "R02", risk: "Wrong Student Collection", impact: "High", probability: "Low", severity: "amber", mitigation: "OTP + QR dual verification, ID cross-check required" },
  { id: "R03", risk: "Parcel Misplacement", impact: "Medium", probability: "Low", severity: "green", mitigation: "Rack/bin auto-tracking, inventory reconciliation daily" },
  { id: "R04", risk: "System Downtime", impact: "High", probability: "Low", severity: "amber", mitigation: "Manual backup ledger, offline barcode workflow" },
  { id: "R05", risk: "QR/OTP Failure", impact: "Medium", probability: "Low", severity: "green", mitigation: "Manual verification with student ID + roll number" },
  { id: "R06", risk: "Parcel Damage", impact: "Medium", probability: "Medium", severity: "amber", mitigation: "Fragile handling SOP, damage checkbox at receipt" },
  { id: "R07", risk: "Notification Failure", impact: "Low", probability: "Low", severity: "green", mitigation: "In-app + email + SMS multi-channel delivery" },
];

const sevMap = {
  green: "bg-emerald-50 text-emerald-700 border-emerald-200",
  amber: "bg-amber-50 text-amber-700 border-amber-200",
  rose: "bg-rose-50 text-rose-700 border-rose-200",
};

export default function RiskRegister() {
  return (
    <div className="space-y-8" data-testid="risk-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Risk Management</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Risk Register & Mitigation</h1>
        <p className="text-slate-500 mt-1 text-sm">Operational risks and their mitigation strategies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { l: "Total Risks", v: RISKS.length, i: AlertTriangle, c: "bg-amber-50 text-amber-600" },
          { l: "High Severity", v: RISKS.filter(r => r.severity === "amber").length, i: TrendingUp, c: "bg-rose-50 text-rose-600" },
          { l: "Mitigated", v: RISKS.filter(r => r.severity === "green").length, i: ShieldCheck, c: "bg-emerald-50 text-emerald-600" },
        ].map((s, i) => (
          <Card key={i} className="dc-card p-5">
            <div className={`p-2 rounded-lg inline-flex ${s.c}`}><s.i className="w-4 h-4" /></div>
            <div className="text-2xl font-semibold mt-3">{s.v}</div>
            <div className="text-xs text-slate-500 mt-1">{s.l}</div>
          </Card>
        ))}
      </div>

      <Card className="p-0 overflow-hidden card-shadow">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
                <th className="px-6 py-3 font-semibold">ID</th>
                <th className="px-6 py-3 font-semibold">Risk</th>
                <th className="px-6 py-3 font-semibold">Impact</th>
                <th className="px-6 py-3 font-semibold">Probability</th>
                <th className="px-6 py-3 font-semibold">Severity</th>
                <th className="px-6 py-3 font-semibold">Mitigation Strategy</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {RISKS.map(r => (
                <tr key={r.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 font-mono text-xs text-slate-500">{r.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{r.risk}</td>
                  <td className="px-6 py-4"><Badge variant="outline">{r.impact}</Badge></td>
                  <td className="px-6 py-4"><Badge variant="outline">{r.probability}</Badge></td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border ${sevMap[r.severity]}`}>
                      {r.severity === "green" ? "Low" : r.severity === "amber" ? "Medium" : "High"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-600 text-xs">{r.mitigation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
