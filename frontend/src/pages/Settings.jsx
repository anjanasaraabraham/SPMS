import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

export default function Settings() {
  const { user } = useAuth();
  return (
    <div className="space-y-8" data-testid="settings-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Settings</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">System Configuration</h1>
        <p className="text-slate-500 mt-1 text-sm">Personal preferences and system parameters</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="dc-card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Profile</h3>
          <div className="space-y-4">
            <div>
              <Label className="text-xs uppercase tracking-wider text-slate-500">Name</Label>
              <Input className="mt-2" value={user?.name || ""} readOnly />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-slate-500">Email</Label>
              <Input className="mt-2" value={user?.email || ""} readOnly />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider text-slate-500">Role</Label>
              <Input className="mt-2 capitalize" value={user?.role?.replace("_"," ") || ""} readOnly />
            </div>
          </div>
        </Card>

        <Card className="dc-card p-6">
          <h3 className="font-semibold text-slate-900 mb-4">Notifications</h3>
          <div className="space-y-4">
            {[
              { l: "Parcel arrival alerts", d: "Instant in-app notification when parcel arrives", on: true },
              { l: "Pickup reminders", d: "24h before pickup deadline", on: true },
              { l: "Overdue alerts", d: "Escalation after deadline", on: true },
              { l: "System alerts", d: "Rack full, damage, misplacement", on: false },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <div>
                  <div className="text-sm font-medium text-slate-900">{s.l}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{s.d}</div>
                </div>
                <Switch defaultChecked={s.on} />
              </div>
            ))}
          </div>
        </Card>

        <Card className="dc-card p-6 md:col-span-2">
          <h3 className="font-semibold text-slate-900 mb-4">Operational Thresholds</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { l: "Rack full alert", v: "85%" },
              { l: "Overdue threshold", v: "5 days" },
              { l: "Retrieval target", v: "2 min" },
              { l: "Accuracy target", v: "99%" },
            ].map((s, i) => (
              <div key={i}>
                <Label className="text-xs uppercase tracking-wider text-slate-500">{s.l}</Label>
                <Input className="mt-2" defaultValue={s.v} />
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-end">
            <Button className="bg-[#D34449] hover:bg-[#B93A3F] text-white" onClick={() => toast.success("Settings saved")}>Save Changes</Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
