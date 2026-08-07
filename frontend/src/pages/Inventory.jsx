import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Boxes, Layers, PackageCheck, PackageX, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

function binColor(rack) {
  const u = rack.utilization;
  if (u < 50) return "bg-emerald-500";
  if (u < 75) return "bg-yellow-400";
  if (u < 90) return "bg-orange-500";
  return "bg-red-500";
}
function binCell(occupied) {
  return occupied ? "bg-blue-600 border-blue-700" : "bg-white border-slate-200";
}

export default function Inventory() {
  const { data: racks } = useQuery({ queryKey: ["racks"], queryFn: async () => (await api.get("/racks")).data });
  const { data: bins } = useQuery({ queryKey: ["bins"], queryFn: async () => (await api.get("/bins")).data });
  const [selectedRack, setSelectedRack] = useState(null);
  const [q, setQ] = useState("");

  const selRack = selectedRack || (racks?.[0]);
  const rackBins = (bins || []).filter(b => selRack && b.rack_id === selRack.id);
  const totalBins = bins?.length || 0;
  const occupied = (bins || []).filter(b => b.occupied).length;

  return (
    <div className="space-y-8" data-testid="inventory-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Warehouse Inventory</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Facility Layout & Bin Utilization</h1>
        <p className="text-slate-500 mt-1 text-sm">Color-coded rack/bin visualization with real-time capacity intelligence</p>
      </div>

      {/* Overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { l: "Total Racks", v: racks?.length ?? "—", i: Layers, c: "text-[#D34449] bg-[#FDECED]" },
          { l: "Total Bins", v: totalBins, i: Boxes, c: "text-slate-700 bg-slate-100" },
          { l: "Occupied Bins", v: occupied, i: PackageCheck, c: "text-emerald-600 bg-emerald-50" },
          { l: "Available Bins", v: totalBins - occupied, i: PackageX, c: "text-amber-600 bg-amber-50" },
        ].map((s, i) => (
          <Card key={i} className="dc-card p-5">
            <div className={`p-2 rounded-lg inline-flex ${s.c}`}><s.i className="w-4 h-4" /></div>
            <div className="text-2xl font-semibold text-slate-900 mt-3">{s.v}</div>
            <div className="text-xs text-slate-500 mt-1">{s.l}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Rack list */}
        <Card className="dc-card p-4 lg:col-span-1">
          <div className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-3 px-2">Racks</div>
          <div className="space-y-1.5">
            {(racks || []).map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRack(r)}
                data-testid={`rack-${r.code}`}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selRack?.id === r.id ? "border-blue-500 bg-blue-50" : "border-slate-200 hover:bg-slate-50"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold text-slate-900 text-sm">Rack {r.code}</div>
                    <div className="text-[10px] text-slate-500">{r.category}</div>
                  </div>
                  <div className={`w-2.5 h-2.5 rounded-full ${binColor(r)}`} />
                </div>
                <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                  <div className={`h-full ${binColor(r)}`} style={{ width: `${r.utilization}%` }} />
                </div>
                <div className="text-[10px] text-slate-500 mt-1">
                  {r.occupied_bins}/{r.total_bins} bins • {r.utilization}%
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Rack detail */}
        <Card className="dc-card p-6 lg:col-span-3">
          {selRack && (
            <div>
              <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-2xl font-semibold text-slate-900">Rack {selRack.code}</h3>
                    <Badge variant="outline" className="text-xs">{selRack.category}</Badge>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Total capacity: {selRack.total_bins} bins</p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-semibold text-slate-900">{selRack.utilization}%</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider">Utilization</div>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex gap-4 text-xs text-slate-600 mb-3">
                  <span className="flex items-center gap-2"><span className="w-3 h-3 bg-blue-600 rounded" /> Occupied</span>
                  <span className="flex items-center gap-2"><span className="w-3 h-3 bg-white border border-slate-300 rounded" /> Available</span>
                </div>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  {rackBins.map(b => (
                    <div
                      key={b.id}
                      className={`aspect-square rounded border ${binCell(b.occupied)} flex items-center justify-center text-[9px] font-mono cursor-pointer hover:scale-110 transition-transform`}
                      title={`${b.code} — ${b.occupied ? "Occupied" : "Available"}`}
                    >
                      <span className={b.occupied ? "text-white" : "text-slate-400"}>{b.code.split("-")[1]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="text-2xl font-semibold text-emerald-700">{rackBins.filter(b => !b.occupied).length}</div>
                  <div className="text-[10px] uppercase tracking-wider text-emerald-800 mt-1">Available</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-2xl font-semibold text-[#D34449]">{rackBins.filter(b => b.occupied).length}</div>
                  <div className="text-[10px] uppercase tracking-wider text-blue-800 mt-1">Occupied</div>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <div className="text-2xl font-semibold text-slate-700">{selRack.total_bins}</div>
                  <div className="text-[10px] uppercase tracking-wider text-slate-600 mt-1">Capacity</div>
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Legend for utilization */}
      <Card className="dc-card p-6">
        <h3 className="font-semibold text-slate-900 mb-4">Utilization Heat Map</h3>
        <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
          {(racks || []).map(r => (
            <div key={r.id} className={`p-4 rounded-lg text-white text-center ${binColor(r)}`}>
              <div className="text-xs font-mono">{r.code}</div>
              <div className="text-lg font-bold mt-1">{r.utilization}%</div>
            </div>
          ))}
        </div>
        <div className="flex gap-6 mt-4 text-xs text-slate-600">
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-emerald-500 rounded" />&lt; 50% Optimal</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-yellow-400 rounded" />50–75% Moderate</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-orange-500 rounded" />75–90% High</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 bg-red-500 rounded" />&gt; 90% Critical</span>
        </div>
      </Card>
    </div>
  );
}
