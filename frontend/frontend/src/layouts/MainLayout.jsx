import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";

import Dashboard from "../pages/Dashboard";
import Departments from "../pages/Departments";
import Employees from "../pages/Employees";
import Attendance from "../pages/Attendance";
import Payroll from "../pages/Payroll";
import Payslips from "../pages/Payslips";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

export default function MainLayout({
  authUser,
  onLogout,
}) {
  const [activeTab, setActiveTab] =
    useState("dashboard");

  const [sidebarCollapsed, setSidebarCollapsed] =
    useState(false);

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

  const canAccess = (page) => {
    return permissions[
      authUser?.role || "Administrator"
    ]?.includes(page);
  };

  const renderContent = () => {
    if (
      activeTab !== "dashboard" &&
      !canAccess(activeTab)
    ) {
      return (
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <h2 className="text-xl font-bold text-red-600">
            Access Denied
          </h2>

          <p className="text-slate-500 mt-2">
            You do not have permission
            to access this module.
          </p>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return <Dashboard />;

      case "employees":
        return <Employees />;

      case "departments":
        return <Departments />;

      case "attendance":
        return <Attendance />;

      case "payroll":
        return <Payroll />;

      case "payslips":
        return <Payslips />;

      case "reports":
        return <Reports />;

      case "settings":
        return <Settings />;

      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <Sidebar
        authUser={authUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={
          setSidebarCollapsed
        }
      />

      <div className="flex-1 flex flex-col">
        <Header
          authUser={authUser}
          activeTab={activeTab}
          onLogout={onLogout}
        />

        <main className="flex-1 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}