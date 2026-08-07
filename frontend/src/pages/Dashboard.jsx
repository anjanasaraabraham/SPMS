import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Line, PieChart, Pie, Cell, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from "recharts";
import {
  Package, TrendingUp, Clock, AlertCircle, Boxes, CheckCircle2,
  ArrowUpRight, ArrowDownRight, Zap, ShieldCheck, Activity, Layers
} from "lucide-react";

// Digiicampus palette: red primary, muted supporting colors
const COLORS = ["#D34449", "#3B82F6", "#F59E0B", "#10B981", "#8B5CF6"];

function KpiCard({ label, value, target, trend, icon: Icon, tone = "red", suffix = "" }) {
  const tones = {
    red: "text-[#D34449] bg-[#FDECED]",
    blue: "text-blue-600 bg-blue-50",
    green: "text-emerald-600 bg-emerald-50",
    amber: "text-amber-600 bg-amber-50",
    rose: "text-rose-600 bg-rose-50",
  };
  return (
    <div className="dc-card dc-card-hover p-5">
      <div className="flex items-start justify-between">
        <div className={`p-2 rounded-md ${tones[tone]}`}><Icon className="w-4 h-4" /></div>
        {trend != null && (
          <div className={`text-xs flex items-center gap-0.5 font-medium ${trend >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {trend >= 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-semibold text-slate-900 tracking-tight">{value}{suffix}</div>
        <div className="text-xs text-slate-500 mt-1">{label}</div>
        {target && <div className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">Target: {target}</div>}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { data: kpis } = useQuery({ queryKey: ["kpis"], queryFn: async () => (await api.get("/dashboard/kpis")).data });
  const { data: trends } = useQuery({ queryKey: ["trends"], queryFn: async () => (await api.get("/dashboard/trends")).data });
  const { data: recent } = useQuery({ queryKey: ["recent"], queryFn: async () => (await api.get("/parcels?limit=8")).data });

  return (
    <div className="space-y-6" data-testid="dashboard-page">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-1.5">Operations Overview</div>
          <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Parcel Management Dashboard</h1>
          <p className="text-slate-500 mt-1 text-sm">Real-time inventory, service, and productivity intelligence</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-500 dc-card px-3 py-1.5">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Live · updated just now
        </div>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Total Parcels" value={kpis?.total_parcels ?? "—"} icon={Package} tone="red" trend={3.2} />
        <KpiCard label="Today Arrivals" value={kpis?.today_arrivals ?? "—"} icon={TrendingUp} tone="green" trend={8.4} />
        <KpiCard label="Today Pickups" value={kpis?.today_pickups ?? "—"} icon={CheckCircle2} tone="green" trend={5.1} />
        <KpiCard label="Pending" value={kpis?.pending_parcels ?? "—"} icon={Clock} tone="amber" trend={-2.1} />
        <KpiCard label="Overdue" value={kpis?.overdue_parcels ?? "—"} icon={AlertCircle} tone="rose" trend={-6.0} />
        <KpiCard label="Rack Utilization" value={kpis?.rack_utilization ?? "—"} suffix="%" icon={Boxes} tone="blue" target="70–85%" />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        <KpiCard label="Avg Retrieval" value={kpis?.avg_retrieval_time ?? "—"} suffix=" min" icon={Zap} target="<2 min" tone="green" />
        <KpiCard label="Storage Duration" value={kpis?.avg_storage_days ?? "—"} suffix=" d" icon={Layers} tone="blue" target="<3 days" />
        <KpiCard label="Collection Rate" value={kpis?.collection_rate ?? "—"} suffix="%" icon={CheckCircle2} target=">95%" tone="green" />
        <KpiCard label="Accuracy" value={kpis?.inventory_accuracy ?? "—"} suffix="%" icon={ShieldCheck} target=">99%" tone="green" />
        <KpiCard label="Damage Rate" value={kpis?.damage_rate ?? "—"} suffix="%" icon={AlertCircle} target="<1%" tone="rose" />
        <KpiCard label="Throughput" value={kpis?.daily_throughput ?? "—"} icon={Activity} tone="red" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="dc-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-slate-900">Weekly Throughput</h3>
              <p className="text-xs text-slate-500 mt-1">Arrivals vs pickups (last 7 days)</p>
            </div>
            <Badge variant="outline" className="text-[10px] text-[#D34449] border-[#F5C1C3]">Ops KPI</Badge>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={trends?.weekly || []}>
              <defs>
                <linearGradient id="gradA" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#D34449" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#D34449" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gradB" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12 }} />
              <Area type="monotone" dataKey="arrivals" stroke="#D34449" fill="url(#gradA)" strokeWidth={2} />
              <Area type="monotone" dataKey="pickups" stroke="#3B82F6" fill="url(#gradB)" strokeWidth={2} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="dc-card p-6">
          <h3 className="font-semibold text-slate-900">Status Mix</h3>
          <p className="text-xs text-slate-500 mt-1 mb-3">Live inventory status</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={trends?.status || []} dataKey="count" nameKey="status" innerRadius={50} outerRadius={80} paddingAngle={3}>
                {(trends?.status || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="dc-card p-6">
          <h3 className="font-semibold text-slate-900">Courier Distribution</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Volume by carrier</p>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={trends?.by_courier || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="courier" tick={{ fontSize: 11, fill: "#6B7280" }} />
              <YAxis tick={{ fontSize: 11, fill: "#6B7280" }} />
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12 }} />
              <Bar dataKey="count" fill="#D34449" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="dc-card p-6">
          <h3 className="font-semibold text-slate-900">Size Classification</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">Inventory category breakdown</p>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={trends?.by_size || []} dataKey="count" nameKey="size" outerRadius={85}>
                {(trends?.by_size || []).map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ background: "#fff", border: "1px solid #E5E7EB", borderRadius: 6, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="dc-card p-6">
          <h3 className="font-semibold text-slate-900">Decision Support</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">AI-powered operational insights</p>
          <div className="space-y-3">
            {[
              { c: "bg-amber-50 text-amber-700 border-amber-200", t: "Rack B2 approaching 92% utilization. Redistribute medium parcels." },
              { c: "bg-[#FDECED] text-[#D34449] border-[#F5C1C3]", t: "Peak arrival hour: 3–5 PM. Add security staff during window." },
              { c: "bg-emerald-50 text-emerald-700 border-emerald-200", t: "Collection rate exceeds target — pickup reminders effective." },
              { c: "bg-rose-50 text-rose-700 border-rose-200", t: "3 overdue parcels flagged. Escalate to student services." },
            ].map((r, i) => (
              <div key={i} className={`text-xs p-3 rounded-md border ${r.c}`}>{r.t}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent activity */}
      <div className="dc-card p-0 overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Recent Activity</h3>
            <p className="text-xs text-slate-500 mt-1">Latest parcel registrations across the operation</p>
          </div>
          <Badge variant="outline" className="text-[10px]">Live feed</Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm dc-table">
            <thead>
              <tr className="text-left">
                <th>Tracking</th>
                <th>Student</th>
                <th>Courier</th>
                <th>Location</th>
                <th>Status</th>
                <th>Arrival</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(recent || []).slice(0, 8).map(p => (
                <tr key={p.id} className="text-slate-700">
                  <td className="px-5 py-3 font-mono text-xs">{p.tracking_number}</td>
                  <td className="px-5 py-3 text-slate-900 font-medium">{p.student_name} <span className="text-slate-400 font-normal">• {p.student_roll}</span></td>
                  <td className="px-5 py-3">{p.courier}</td>
                  <td className="px-5 py-3">{p.rack_code} / {p.bin_code}</td>
                  <td className="px-5 py-3"><StatusBadge status={p.status} /></td>
                  <td className="px-5 py-3 text-slate-500 text-xs">{new Date(p.arrival_ts).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    ready: "bg-[#FDECED] text-[#D34449] border-[#F5C1C3]",
    collected: "bg-emerald-50 text-emerald-700 border-emerald-200",
    overdue: "bg-rose-50 text-rose-700 border-rose-200",
    pending: "bg-amber-50 text-amber-700 border-amber-200",
  };
  return <span className={`inline-flex text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded-full border ${map[status] || "bg-slate-50 text-slate-600 border-slate-200"}`}>{status}</span>;
}
