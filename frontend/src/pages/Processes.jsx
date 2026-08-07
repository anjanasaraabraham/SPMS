import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, XCircle, CheckCircle2 } from "lucide-react";

function ProcessNode({ n, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-emerald-50 border-emerald-200 text-emerald-800",
    amber: "bg-amber-50 border-amber-200 text-amber-800",
    rose: "bg-rose-50 border-rose-200 text-rose-800",
    slate: "bg-slate-100 border-slate-300 text-slate-700",
  };
  return (
    <div className={`px-4 py-3 rounded-lg border text-sm font-medium ${tones[tone]} shadow-sm text-center min-w-[130px]`}>
      {n}
    </div>
  );
}

const AS_IS = [
  { n: "Courier arrives", t: "amber" },
  { n: "Security receives", t: "amber" },
  { n: "Physical ledger entry", t: "rose" },
  { n: "Random storage", t: "rose" },
  { n: "Student arrives", t: "amber" },
  { n: "Manual search", t: "rose" },
  { n: "Handover + signature", t: "amber" },
];

const TO_BE = [
  { n: "Courier arrives", t: "blue" },
  { n: "Enter tracking #", t: "blue" },
  { n: "Auto-fetch student", t: "green" },
  { n: "Classify + auto-assign rack/bin", t: "green" },
  { n: "Generate QR + OTP", t: "green" },
  { n: "Notify student", t: "green" },
  { n: "Student presents OTP/QR", t: "blue" },
  { n: "Verify & release", t: "green" },
];

export default function Processes() {
  return (
    <div className="space-y-8" data-testid="processes-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Process Design</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">As-Is vs To-Be Workflows</h1>
        <p className="text-slate-500 mt-1 text-sm">BPMN-style process transformation for parcel operations</p>
      </div>

      {/* As-Is */}
      <Card className="dc-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-rose-50 text-rose-600"><XCircle className="w-4 h-4" /></div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Current Manual Process (As-Is)</h3>
            <p className="text-xs text-slate-500">Pain points: manual ledger, random storage, slow retrieval</p>
          </div>
          <Badge variant="outline" className="ml-auto bg-rose-50 border-rose-200 text-rose-700">Avg 12+ min per parcel</Badge>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          {AS_IS.map((n, i) => (
            <React.Fragment key={i}>
              <ProcessNode n={n.n} tone={n.t} />
              {i < AS_IS.length - 1 && <ArrowRight className="w-5 h-5 text-slate-400" />}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3">
          {[
            { k: "12+ min", v: "Average retrieval" },
            { k: "8%", v: "Misplacement rate" },
            { k: "Manual", v: "Every step" },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-lg bg-rose-50 border border-rose-100">
              <div className="text-xl font-semibold text-rose-800">{s.k}</div>
              <div className="text-xs text-rose-700">{s.v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* To-Be */}
      <Card className="dc-card p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-4 h-4" /></div>
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Digital Process (To-Be)</h3>
            <p className="text-xs text-slate-500">SPMS-enabled: auto-assignment, OTP verification, live dashboards</p>
          </div>
          <Badge variant="outline" className="ml-auto bg-emerald-50 border-emerald-200 text-emerald-700">Under 2 min per parcel</Badge>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 py-4">
          {TO_BE.map((n, i) => (
            <React.Fragment key={i}>
              <ProcessNode n={n.n} tone={n.t} />
              {i < TO_BE.length - 1 && <ArrowRight className="w-5 h-5 text-slate-400" />}
            </React.Fragment>
          ))}
        </div>
        <div className="mt-6 grid grid-cols-4 gap-3">
          {[
            { k: "<2 min", v: "Retrieval time" },
            { k: "0%", v: "Misplacement" },
            { k: "99.4%", v: "Accuracy" },
            { k: "100%", v: "Digital audit" },
          ].map((s, i) => (
            <div key={i} className="p-3 rounded-lg bg-emerald-50 border border-emerald-100">
              <div className="text-xl font-semibold text-emerald-800">{s.k}</div>
              <div className="text-xs text-emerald-700">{s.v}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* SOPs */}
      <div className="grid md:grid-cols-2 gap-6">
        {[
          { t: "Parcel Receiving", steps: ["Inspect parcel", "Verify student", "Register in SPMS", "Auto-assign rack/bin", "Store parcel", "Notify student"] },
          { t: "Parcel Collection", steps: ["Student generates OTP/QR", "Present at security", "Security verifies OTP", "Retrieve from bin", "Mark collected", "Update inventory"] },
          { t: "Damaged Parcel", steps: ["Capture photo evidence", "Mark damaged in system", "Notify student", "Store separately", "Escalate to ops manager"] },
          { t: "Misplaced Parcel", steps: ["Mark misplaced", "Search assigned rack", "Check inventory log", "Notify admin", "Resolve and log RCA"] },
        ].map((sop, i) => (
          <Card key={i} className="dc-card p-6">
            <h4 className="font-semibold text-slate-900 mb-4">{sop.t} SOP</h4>
            <ol className="space-y-2.5">
              {sop.steps.map((s, j) => (
                <li key={j} className="flex items-start gap-3 text-sm">
                  <span className="w-5 h-5 rounded-full bg-[#FDECED] text-[#D34449] text-[10px] font-semibold grid place-items-center shrink-0 mt-0.5">{j+1}</span>
                  <span className="text-slate-700">{s}</span>
                </li>
              ))}
            </ol>
          </Card>
        ))}
      </div>
    </div>
  );
}
