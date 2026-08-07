import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, CheckCircle2, PackageCheck, AlertTriangle, Timer } from "lucide-react";
import { Button } from "@/components/ui/button";

const iconMap = {
  parcel_arrived: PackageCheck,
  collected: CheckCircle2,
  reminder: Timer,
  info: Bell,
  alert: AlertTriangle,
};

export default function Notifications() {
  const qc = useQueryClient();
  const { data: notifs } = useQuery({ queryKey: ["notifs"], queryFn: async () => (await api.get("/notifications")).data });
  const markRead = useMutation({
    mutationFn: async (id) => (await api.post(`/notifications/${id}/read`)).data,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifs"] }),
  });

  return (
    <div className="space-y-6" data-testid="notifications-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Notification Center</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">Alerts & Messages</h1>
        <p className="text-slate-500 mt-1 text-sm">System notifications and operational alerts</p>
      </div>

      <Card className="dc-card p-0 overflow-hidden">
        <div className="divide-y divide-slate-100">
          {(notifs || []).length === 0 && (
            <div className="p-12 text-center text-slate-500 text-sm">No notifications</div>
          )}
          {(notifs || []).map(n => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <div key={n.id} className={`p-5 flex gap-4 items-start hover:bg-slate-50 ${!n.read ? "bg-blue-50/30" : ""}`}>
                <div className={`p-2 rounded-lg ${!n.read ? "bg-[#FDECED] text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-slate-900 text-sm">{n.title}</div>
                    {!n.read && <Badge className="bg-blue-600 text-white text-[10px]">New</Badge>}
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{n.message}</p>
                  <div className="text-[10px] text-slate-400 mt-2 uppercase tracking-wider">{new Date(n.created_at).toLocaleString()}</div>
                </div>
                {!n.read && (
                  <Button size="sm" variant="ghost" onClick={() => markRead.mutate(n.id)} data-testid={`mark-read-${n.id}`}>
                    Mark read
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
