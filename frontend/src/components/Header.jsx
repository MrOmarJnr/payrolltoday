import { useState } from "react";
import { ChevronDown, CalendarDays, LogOut, User, Settings } from "lucide-react";
import { PAGE_TITLES } from "../config/nav";

export default function Header({ authUser, activeTab, onLogout, setActiveTab }) {
  const [open, setOpen] = useState(false);

  const role = authUser?.role || "Administrator";
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", month: "short", day: "2-digit", year: "numeric" });
  const initials = (authUser?.fullName || "User").split(" ").map((x) => x[0]).slice(0, 2).join("").toUpperCase();

  return (
    <header className="h-[68px] bg-white border-b border-line px-6 flex items-center justify-between sticky top-0 z-20">
      <div className="flex items-center gap-6">
        <div className="hidden lg:flex items-center gap-2.5">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-50 text-brand-500"><CalendarDays size={18} /></span>
          <div className="leading-tight">
            <p className="text-[11px] text-muted font-semibold">Today</p>
            <p className="text-[13px] font-extrabold text-ink">{today}</p>
          </div>
        </div>
        <div className="md:block pl-6 md:border-l border-line">
          <p className="text-[15px] font-extrabold text-ink">{PAGE_TITLES[activeTab] || "Dashboard"}</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="relative">
          <button onClick={() => setOpen(!open)} className="flex items-center gap-2.5 rounded-full pl-1 pr-2 py-1 transition-colors duration-150 hover:bg-canvas">
            <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-500 text-white text-xs font-extrabold">{initials}</span>
            <div className="text-left hidden sm:block leading-tight">
              <p className="text-[13px] font-bold text-ink">{authUser?.fullName || "Admin"}</p>
              <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">{role}</p>
            </div>
            <ChevronDown size={16} className="text-muted" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-line bg-white shadow-[var(--shadow-pop)] overflow-hidden animate-[popIn_.16s_var(--ease-out)]">
              <button className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-canvas text-ink"><User size={16} /> My Profile</button>
              <button onClick={() => { setActiveTab?.("settings"); setOpen(false); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-150 hover:bg-canvas text-ink"><Settings size={16} /> Account Settings</button>
              <div className="border-t border-line" />
              <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 transition-colors duration-150 hover:bg-red-50"><LogOut size={16} /> Log Out</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
