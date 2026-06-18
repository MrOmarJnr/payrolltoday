import {
  LayoutDashboard,
  Users,
  Building2,
  Clock,
  DollarSign,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

export default function Sidebar({
  authUser,
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
}) {
  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: <LayoutDashboard size={18} />,
    },
    {
      id: "employees",
      label: "Employees",
      icon: <Users size={18} />,
    },
    {
      id: "departments",
      label: "Departments",
      icon: <Building2 size={18} />,
    },
    {
      id: "attendance",
      label: "Attendance",
      icon: <Clock size={18} />,
    },
    {
      id: "payroll",
      label: "Payroll",
      icon: <DollarSign size={18} />,
    },
    {
      id: "payslips",
      label: "Payslips",
      icon: <FileText size={18} />,
    },
    {
      id: "reports",
      label: "Reports",
      icon: <BarChart3 size={18} />,
    },
    {
      id: "settings",
      label: "Settings",
      icon: <Settings size={18} />,
    },
  ];

  const permissions = {
    Administrator: [
      "dashboard",
      "employees",
      "departments",
      "attendance",
      "payroll",
      "payslips",
      "reports",
      "settings",
    ],

    "HR Officer": [
      "dashboard",
      "employees",
      "departments",
      "attendance",
      "reports",
    ],

    "Payroll Officer": [
      "dashboard",
      "attendance",
      "payroll",
      "payslips",
      "reports",
    ],

    "Read Only": [
      "dashboard",
      "reports",
      "payslips",
    ],
  };

  const userRole = authUser?.role || "Administrator";

  const filteredNavItems = navItems.filter((item) =>
    permissions[userRole]?.includes(item.id)
  );

  return (
    <aside
      className={`bg-slate-950 text-slate-300 border-r border-slate-800 transition-all duration-300 ${
        sidebarCollapsed ? "w-20" : "w-72"
      }`}
    >
      <div className="p-4 border-b border-slate-800">
        <div className="flex items-center justify-between">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              

              <div>
                <p className="text-[13px] uppercase tracking-[0.22em] text-blue-300 font-bold">
                  LEF Signature LTD
                </p>

                <h1 className="text-sm font-black text-white">
                  Payroll Basic
                </h1>

                <p className="text-[12px] text-slate-500 mt-1">
                  {userRole}
                </p>
              </div>
            </div>
          )}

          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-slate-400 hover:text-white"
          >
            ☰
          </button>
        </div>
      </div>

      <nav className="p-4 space-y-2">
        {filteredNavItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center ${
              sidebarCollapsed
                ? "justify-center"
                : "gap-3"
            } px-3 py-3 rounded-2xl text-sm font-semibold transition-all ${
              activeTab === item.id
                ? "bg-blue-600 text-white"
                : "hover:bg-slate-900 hover:text-white"
            }`}
          >
            {item.icon}

            {!sidebarCollapsed && (
              <span>{item.label}</span>
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
}