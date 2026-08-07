import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { StatusBadge } from "./Dashboard";
import { Download, FileText, FileSpreadsheet, FileJson } from "lucide-react";
import { toast } from "sonner";

function exportCSV(data, filename) {
  if (!data?.length) return toast.error("Nothing to export");
  const cols = Object.keys(data[0]).filter(k => typeof data[0][k] !== "object");
  const csv = [cols.join(","), ...data.map(r => cols.map(c => JSON.stringify(r[c] ?? "")).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); a.href = url; a.download = filename; a.click();
  URL.revokeObjectURL(url);
  toast.success("Exported");
}

function ReportTable({ type }) {
  const { data } = useQuery({
    queryKey: ["report", type],
    queryFn: async () => (await api.get(`/reports/${type}`)).data
  });
  const rows = data?.data || [];

  if (type === "courier") {
    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-slate-50">
            <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
              <th className="px-6 py-3 font-semibold">Courier</th>
              <th className="px-6 py-3 font-semibold">Parcel Count</th>
              <th className="px-6 py-3 font-semibold">Market Share</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((r, i) => {
              const total = rows.reduce((s, x) => s + x.count, 0);
              const pct = ((r.count / total) * 100).toFixed(1);
              return (
                <tr key={i} className="hover:bg-slate-50">
                  <td className="px-6 py-3 font-medium">{r.courier || "Unknown"}</td>
                  <td className="px-6 py-3">{r.count}</td>
                  <td className="px-6 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-32 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-slate-600">{pct}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="p-4 flex justify-end"><Button variant="outline" size="sm" onClick={() => exportCSV(rows, "courier_report.csv")}><Download className="w-3.5 h-3.5 mr-1.5" /> Export CSV</Button></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
            <th className="px-6 py-3 font-semibold">Tracking</th>
            <th className="px-6 py-3 font-semibold">Student</th>
            <th className="px-6 py-3 font-semibold">Courier</th>
            <th className="px-6 py-3 font-semibold">Size</th>
            <th className="px-6 py-3 font-semibold">Location</th>
            <th className="px-6 py-3 font-semibold">Status</th>
            <th className="px-6 py-3 font-semibold">Date</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.slice(0, 50).map(p => (
            <tr key={p.id} className="hover:bg-slate-50">
              <td className="px-6 py-3 font-mono text-xs">{p.tracking_number}</td>
              <td className="px-6 py-3">{p.student_name}</td>
              <td className="px-6 py-3">{p.courier}</td>
              <td className="px-6 py-3 capitalize text-slate-600">{p.parcel_size}</td>
              <td className="px-6 py-3 text-slate-600">{p.rack_code}/{p.bin_code}</td>
              <td className="px-6 py-3"><StatusBadge status={p.status} /></td>
              <td className="px-6 py-3 text-xs text-slate-500">{new Date(p.arrival_ts).toLocaleDateString()}</td>
            </tr>
          ))}
          {!rows.length && <tr><td colSpan={7} className="text-center py-10 text-slate-500 text-sm">No data</td></tr>}
        </tbody>
      </table>
      <div className="p-4 flex justify-end gap-2">
        <Button variant="outline" size="sm" onClick={() => exportCSV(rows, `${type}_report.csv`)} data-testid={`export-${type}`}>
          <FileSpreadsheet className="w-3.5 h-3.5 mr-1.5" /> CSV
        </Button>
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <FileText className="w-3.5 h-3.5 mr-1.5" /> PDF
        </Button>
      </div>
    </div>
  );
}

export default function Reports() {
  return (
    <div className="space-y-8" data-testid="reports-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Reports & Analytics</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Operational Reports</h1>
        <p className="text-slate-500 mt-1 text-sm">Export daily, damage, collection and courier analytics</p>
      </div>

      <Tabs defaultValue="daily">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="daily" data-testid="tab-daily">Daily</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="collection">Collection</TabsTrigger>
          <TabsTrigger value="damage">Damage</TabsTrigger>
          <TabsTrigger value="courier">Courier Analysis</TabsTrigger>
        </TabsList>
        {["daily","pending","collection","damage","courier"].map(t => (
          <TabsContent key={t} value={t}>
            <Card className="p-0 overflow-hidden card-shadow mt-4"><ReportTable type={t} /></Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
