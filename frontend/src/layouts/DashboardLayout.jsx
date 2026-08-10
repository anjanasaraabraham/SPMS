import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { api } from "@/lib/api";
import {
  Home, Package, ShieldCheck, Boxes, FileBarChart, Bell,
  Users, Settings as SettingsIcon, Workflow, AlertTriangle,
  Search, LogOut, ScrollText, Menu, X
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const LOGO_URL = "https://customer-assets-eiarnc6j.emergentagent.net/job_spms-inventory-hub/artifacts/lxkaa9dr_GLIMG%20Logo.png";

const NAV_BY_ROLE = {
  student: [
    { to: "/", label: "Dashboard", icon: Home, end: true },
    { to: "/student-portal", label: "My Parcels", icon: Package },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ],
  security: [
    { to: "/", label: "Dashboard", icon: Home, end: true },
    { to: "/security", label: "Receive Parcel", icon: ShieldCheck },
    { to: "/inventory", label: "Inventory", icon: Boxes },
    { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ],
  admin: [
    { to: "/", label: "Dashboard", icon: Home, end: true },
    { to: "/administration", label: "Users", icon: Users },
    { to: "/inventory", label: "Inventory", icon: Boxes },
    { to: "/security", label: "Receive Parcel", icon: ShieldCheck },
    { to: "/processes", label: "Process Design", icon: Workflow },
    { to: "/risks", label: "Risk Register", icon: AlertTriangle },
    { to: "/reports", label: "Reports", icon: FileBarChart },
    { to: "/audit", label: "Audit Logs", icon: ScrollText },
    { to: "/notifications", label: "Notifications", icon: Bell },
    { to: "/settings", label: "Settings", icon: SettingsIcon },
  ],
};

function SidebarNav({ user, items, onNavigate }) {
  const initials = (user?.name || "U").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Profile header */}
      <div className="p-5 relative overflow-hidden shrink-0">
        <div className="absolute inset-0 dc-header opacity-95" />
        <div className="relative z-10 flex flex-col items-center text-white">
          <Avatar className="h-14 w-14 border-2 border-white/60 shadow-lg">
            <AvatarFallback className="bg-white text-[#D34449] text-base font-semibold">{initials}</AvatarFallback>
          </Avatar>
          <div className="mt-2 text-sm font-semibold text-center">{user?.name}</div>
          <div className="text-[10px] uppercase tracking-widest opacity-90 mt-0.5 capitalize">{user?.role}</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-2">
        {items.map((n) => (
          <NavLink
            key={n.to}
            to={n.to}
            end={n.end}
            onClick={onNavigate}
            data-testid={`nav-${n.label.toLowerCase().replace(/\s/g, '-')}`}
            className={({ isActive }) =>
              `flex items-center gap-3 px-5 py-3 text-sm border-b border-slate-100 transition-colors ${
                isActive
                  ? "sidebar-link-active font-medium"
                  : "text-slate-700 hover:bg-[#FDECED] hover:text-[#D34449]"
              }`
            }
          >
            <n.icon className="w-4 h-4 shrink-0" />
            <span>{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const [q, setQ] = useState("");
  const [results, setResults] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [mobileSearch, setMobileSearch] = useState(false);

  const items = NAV_BY_ROLE[user?.role] || NAV_BY_ROLE.student;
  const initials = (user?.name || "U").split(" ").map(s => s[0]).slice(0, 2).join("").toUpperCase();

  const doSearch = async (e) => {
    e.preventDefault();
    if (!q.trim()) { setResults(null); return; }
    try {
      const { data } = await api.get("/search", { params: { q } });
      setResults(data.parcels);
    } catch { setResults([]); }
  };

  return (
    <div className="min-h-screen bg-[#F5F6F8]">
      {/* Top red header */}
      <header className="dc-header text-white sticky top-0 z-40 shadow-sm">
        <div className="h-14 md:h-16 flex items-center px-3 md:px-6 gap-2 md:gap-4">
          {/* Mobile hamburger */}
          <Sheet open={drawerOpen} onOpenChange={setDrawerOpen}>
            <SheetTrigger asChild>
              <button
                data-testid="mobile-menu-btn"
                className="lg:hidden p-2 rounded-md hover:bg-white/10 shrink-0"
                aria-label="Open menu"
              >
                <Menu className="w-5 h-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-72 bg-white">
              <SidebarNav user={user} items={items} onNavigate={() => setDrawerOpen(false)} />
            </SheetContent>
          </Sheet>

          {/* Logo + GLIMG */}
          <div className="flex items-center gap-2 md:gap-3 shrink-0 min-w-0">
            <div className="bg-white rounded-md p-1 shadow-sm shrink-0">
              <img src={LOGO_URL} alt="Great Lakes Gurgaon" className="h-8 md:h-11 w-auto object-contain" />
            </div>
            <div className="hidden sm:block min-w-0">
              <div className="text-base md:text-xl font-bold tracking-wider leading-tight truncate">GLIMG</div>
              <div className="text-[9px] md:text-[10px] opacity-90 leading-tight tracking-wide truncate">Parcel Management</div>
            </div>
          </div>

          {/* Search — full on md+, icon on mobile */}
          <form onSubmit={doSearch} className="flex-1 max-w-2xl mx-auto relative hidden md:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              data-testid="global-search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search Digiicampus — parcel, student, tracking…"
              className="pl-10 h-10 bg-white text-slate-800 border-0 rounded-full text-sm placeholder:text-slate-400"
            />
            {results && (
              <div className="absolute left-0 right-0 top-12 max-h-96 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-2 text-slate-800">
                {results.length === 0 && <div className="p-3 text-sm text-slate-500">No results</div>}
                {results.map(p => (
                  <div key={p.id} className="p-3 hover:bg-[#FDECED] rounded-md cursor-pointer" onClick={() => setResults(null)}>
                    <div className="text-sm font-medium">{p.tracking_number} — {p.student_name}</div>
                    <div className="text-xs text-slate-500">Rack {p.rack_code} / Bin {p.bin_code} • {p.courier}</div>
                  </div>
                ))}
              </div>
            )}
          </form>

          {/* Push right on mobile */}
          <div className="flex-1 md:hidden" />

          {/* Right actions */}
          <div className="flex items-center gap-1 md:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setMobileSearch(!mobileSearch)}
              data-testid="mobile-search-btn"
              className="md:hidden p-2 rounded-full hover:bg-white/10"
              aria-label="Search"
            >
              {mobileSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
            </button>
            <NavLink to="/notifications" className="relative p-2 rounded-full hover:bg-white/10" data-testid="notifications-icon">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-yellow-300 rounded-full" />
            </NavLink>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-0.5 rounded-full hover:bg-white/10" data-testid="profile-menu">
                  <Avatar className="h-8 w-8 md:h-9 md:w-9 border-2 border-white/50">
                    <AvatarFallback className="bg-white text-[#D34449] text-xs font-semibold">{initials}</AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white">
                <DropdownMenuLabel className="text-xs">
                  <div className="font-medium text-slate-900">{user?.name}</div>
                  <div className="text-slate-500 font-normal">{user?.email}</div>
                  <div className="text-[10px] mt-1 uppercase tracking-widest text-[#D34449] font-semibold capitalize">{user?.role}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} data-testid="logout-btn" className="text-[#D34449] cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" /> Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile search bar (collapsible) */}
        {mobileSearch && (
          <div className="md:hidden px-3 pb-3 bg-white/5">
            <form onSubmit={doSearch} className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                data-testid="mobile-global-search"
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search parcel, student, tracking…"
                className="pl-9 h-9 bg-white text-slate-800 border-0 rounded-full text-sm"
              />
              {results && (
                <div className="absolute left-0 right-0 top-11 max-h-80 overflow-y-auto bg-white border border-slate-200 rounded-lg shadow-xl z-50 p-2 text-slate-800">
                  {results.length === 0 && <div className="p-3 text-sm text-slate-500">No results</div>}
                  {results.map(p => (
                    <div key={p.id} className="p-3 hover:bg-[#FDECED] rounded-md" onClick={() => { setResults(null); setMobileSearch(false); }}>
                      <div className="text-sm font-medium">{p.tracking_number} — {p.student_name}</div>
                      <div className="text-xs text-slate-500">Rack {p.rack_code} / Bin {p.bin_code}</div>
                    </div>
                  ))}
                </div>
              )}
            </form>
          </div>
        )}
      </header>

      {/* Main body */}
      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex w-60 xl:w-64 shrink-0 bg-white border-r border-slate-200 min-h-[calc(100vh-4rem)] sticky top-16 flex-col" data-testid="sidebar">
          <SidebarNav user={user} items={items} />
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 p-4 sm:p-5 lg:p-8 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
