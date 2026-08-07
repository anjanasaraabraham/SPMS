import React from "react";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Users, ShieldCheck, GraduationCap, ScrollText } from "lucide-react";

function UserList({ role }) {
  const { data: users } = useQuery({ queryKey: ["users"], queryFn: async () => (await api.get("/users")).data });
  const filtered = (users || []).filter(u => u.role === role);
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr className="text-left text-[10px] uppercase tracking-wider text-slate-500">
            <th className="px-6 py-3 font-semibold">Name</th>
            <th className="px-6 py-3 font-semibold">Email</th>
            {role === "student" && <th className="px-6 py-3 font-semibold">Roll Number</th>}
            <th className="px-6 py-3 font-semibold">Role</th>
            <th className="px-6 py-3 font-semibold">Created</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {filtered.slice(0, 30).map(u => (
            <tr key={u.id} className="hover:bg-slate-50">
              <td className="px-6 py-3 font-medium text-slate-900">{u.name}</td>
              <td className="px-6 py-3 text-slate-600">{u.email}</td>
              {role === "student" && <td className="px-6 py-3 font-mono text-xs">{u.roll_number}</td>}
              <td className="px-6 py-3"><Badge variant="outline" className="capitalize">{u.role.replace("_", " ")}</Badge></td>
              <td className="px-6 py-3 text-xs text-slate-500">{u.created_at ? new Date(u.created_at).toLocaleDateString() : "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="p-4 text-xs text-slate-500">Showing {Math.min(filtered.length, 30)} of {filtered.length} • Total {filtered.length} {role}s</div>
    </div>
  );
}

export default function Administration() {
  return (
    <div className="space-y-8" data-testid="admin-page">
      <div>
        <div className="text-xs font-semibold uppercase tracking-widest text-[#D34449] mb-2">Administration</div>
        <h1 className="text-3xl font-semibold text-slate-900 tracking-tight">User & Access Management</h1>
        <p className="text-slate-500 mt-1 text-sm">Manage students, security staff, operations managers and administrators</p>
      </div>

      <Tabs defaultValue="student">
        <TabsList className="bg-slate-100 p-1">
          <TabsTrigger value="student" data-testid="tab-students"><GraduationCap className="w-3.5 h-3.5 mr-1.5" /> Students</TabsTrigger>
          <TabsTrigger value="security"><ShieldCheck className="w-3.5 h-3.5 mr-1.5" /> Security Staff</TabsTrigger>
          <TabsTrigger value="ops_manager"><Users className="w-3.5 h-3.5 mr-1.5" /> Ops Managers</TabsTrigger>
          <TabsTrigger value="admin">Administrators</TabsTrigger>
          <TabsTrigger value="audit"><ScrollText className="w-3.5 h-3.5 mr-1.5" /> Audit Log</TabsTrigger>
        </TabsList>
        {["student","security","ops_manager","admin"].map(r => (
          <TabsContent key={r} value={r}>
            <Card className="p-0 mt-4 card-shadow overflow-hidden"><UserList role={r} /></Card>
          </TabsContent>
        ))}
        <TabsContent value="audit">
          <Card className="p-6 mt-4 card-shadow">
            <div className="space-y-3">
              {[
                { t: "Admin logged in", u: "System Administrator", ts: "2 min ago" },
                { t: "Parcel registered — TRK52847629", u: "Rajesh Kumar", ts: "12 min ago" },
                { t: "OTP verification success", u: "Rajesh Kumar", ts: "34 min ago" },
                { t: "Rack B2 capacity alert", u: "System", ts: "1 hour ago" },
                { t: "User account created", u: "System Administrator", ts: "3 hours ago" },
              ].map((e, i) => (
                <div key={i} className="flex items-center justify-between p-3 border-b border-slate-100 last:border-0">
                  <div>
                    <div className="text-sm font-medium text-slate-900">{e.t}</div>
                    <div className="text-xs text-slate-500 mt-0.5">by {e.u}</div>
                  </div>
                  <span className="text-xs text-slate-400">{e.ts}</span>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
