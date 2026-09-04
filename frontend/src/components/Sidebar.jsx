import { useState } from "react";
import { ChevronsLeft, ChevronDown } from "lucide-react";
import { NAV_GROUPS, canAccess } from "../config/nav";

export default function Sidebar({ authUser, activeTab, setActiveTab, sidebarCollapsed, setSidebarCollapsed }) {
  const role = authUser?.role || "Administrator";
  const c = sidebarCollapsed;
  const [collapsedGroups, setCollapsedGroups] = useState({});

  const toggleGroup = (title) =>
    setCollapsedGroups((p) => ({ ...p, [title]: !p[title] }));

  return (
    <aside className={`bg-white border-r border-line flex flex-col transition-all duration-300 shrink-0 ${c ? "w-[76px]" : "w-64"} h-screen sticky top-0`}>
      {/* Brand */}
      <div className={`h-[68px] flex items-center border-b border-line ${c ? "justify-center" : "px-5 justify-between"}`}>
        <div className="flex items-center gap-2.5">
          {!c && (
            <div className="leading-tight">
              <p className="text-[13px] font-extrabold text-ink">LEF Signature</p>
              <p className="text-[10px] text-muted font-semibold">ERP Platform</p>
            </div>
          )}
        </div>
        {!c && (
          <button onClick={() => setSidebarCollapsed(true)} className="text-muted hover:text-ink">
            <ChevronsLeft size={18} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-4">
        {NAV_GROUPS.map((g, gi) => {
          const items = g.items.filter((it) => canAccess(role, it.id));
          if (!items.length) return null;
          const groupCollapsed = collapsedGroups[g.title];
          return (
            <div key={gi}>
              {!c && g.title && (
                <button
                  onClick={() => toggleGroup(g.title)}
                  className="w-full px-3 mb-1.5 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] font-bold text-muted/70 hover:text-muted"
                >
                  <span>{g.title}</span>
                  <ChevronDown size={13} className={`transition-transform ${groupCollapsed ? "-rotate-90" : ""}`} />
                </button>
              )}
              {!groupCollapsed && (
                <div className="space-y-1">
                  {items.map((it) => {
                    const Icon = it.icon;
                    const active = activeTab === it.id;
                    return (
                      <button
                        key={it.id}
                        onClick={() => setActiveTab(it.id)}
                        title={it.label}
                        className={`w-full flex items-center ${c ? "justify-center" : "gap-3"} px-3 py-2 rounded-lg text-[13px] font-semibold transition-colors duration-150 active:scale-[0.98]
                          ${active
                            ? "bg-brand-500 text-white"
                            : "text-muted hover:bg-canvas hover:text-ink"}`}
                      >
                        <Icon size={18} className="shrink-0" />
                        {!c && <span className="truncate">{it.label}</span>}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {c && (
        <button onClick={() => setSidebarCollapsed(false)} className="m-3 grid place-items-center h-9 rounded-xl text-muted hover:bg-canvas hover:text-ink">
          <ChevronsLeft size={18} className="rotate-180" />
        </button>
      )}
    </aside>
  );
}
