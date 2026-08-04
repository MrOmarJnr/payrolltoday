import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { canAccess, PAGE_TITLES } from "../config/nav";

// Dashboards
import Dashboard from "../pages/Dashboard";                 // Attendance (landing)
import ExecutiveDashboard from "../pages/ExecutiveDashboard";
import EmployeesDashboard from "../pages/EmployeesDashboard"; // HR dashboard

// HR
import Employees from "../pages/Employees";
import Departments from "../pages/Departments";
import Attendance from "../pages/Attendance";
import Leave from "../pages/Leave";
import Payroll from "../pages/Payroll";
import Payslips from "../pages/Payslips";
import Reports from "../pages/Reports";
import Settings from "../pages/Settings";

// Finance
import FinanceDashboard from "../pages/finance/FinanceDashboard";
import Expenses from "../pages/finance/Expenses";
import ExpenseCategories from "../pages/finance/ExpenseCategories";
import FuelManagement from "../pages/finance/FuelManagement";
import Vehicles from "../pages/finance/Vehicles";
import Budgets from "../pages/finance/Budgets";
import PettyCash from "../pages/finance/PettyCash";
import FinancialReports from "../pages/finance/FinancialReports";
import FinanceAnalytics from "../pages/finance/FinanceAnalytics";

// Inventory
import InventoryDashboard from "../pages/inventory/InventoryDashboard";
import InventoryItems from "../pages/inventory/InventoryItems";
import InventoryCategories from "../pages/inventory/InventoryCategories";
import Warehouses from "../pages/inventory/Warehouses";
import StockIn from "../pages/inventory/StockIn";
import StockOut from "../pages/inventory/StockOut";
import StockAdjustments from "../pages/inventory/StockAdjustments";
import Assets from "../pages/inventory/Assets";
import InventoryReports from "../pages/inventory/InventoryReports";

// Procurement
import ProcurementDashboard from "../pages/procurement/ProcurementDashboard";
import PurchaseRequests from "../pages/procurement/PurchaseRequests";
import PurchaseOrders from "../pages/procurement/PurchaseOrders";
import RFQs from "../pages/procurement/RFQs";
import SupplierQuotations from "../pages/procurement/SupplierQuotations";
import VendorBills from "../pages/procurement/VendorBills";
import Suppliers from "../pages/procurement/Suppliers";
import ProcurementReports from "../pages/procurement/ProcurementReports";

// Administration
import Users from "../pages/admin/Users";
import Roles from "../pages/admin/Roles";
import AuditLogs from "../pages/admin/AuditLogs";

const PAGES = {
  dashboard: Dashboard,
  "exec-dashboard": ExecutiveDashboard,
  "hr-dashboard": EmployeesDashboard,
  employees: Employees,
  departments: Departments,
  attendance: Attendance,
  leave: Leave,
  payroll: Payroll,
  payslips: Payslips,
  reports: Reports,
  settings: Settings,
  "fin-dashboard": FinanceDashboard,
  expenses: Expenses,
  "expense-categories": ExpenseCategories,
  vendors: Suppliers,
  fuel: FuelManagement,
  vehicles: Vehicles,
  budgets: Budgets,
  "petty-cash": PettyCash,
  "fin-reports": FinancialReports,
  "fin-analytics": FinanceAnalytics,
  "inv-dashboard": InventoryDashboard,
  "inv-items": InventoryItems,
  "inv-categories": InventoryCategories,
  warehouses: Warehouses,
  "stock-in": StockIn,
  "stock-out": StockOut,
  adjustments: StockAdjustments,
  assets: Assets,
  "inv-reports": InventoryReports,
  "proc-dashboard": ProcurementDashboard,
  "purchase-requests": PurchaseRequests,
  "purchase-orders": PurchaseOrders,
  rfqs: RFQs,
  "supplier-quotations": SupplierQuotations,
  "vendor-bills": VendorBills,
  suppliers: Suppliers,
  "proc-reports": ProcurementReports,
  users: Users,
  roles: Roles,
  "audit-logs": AuditLogs,
};

export default function MainLayout({ authUser, onLogout }) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const role = authUser?.role || "Administrator";

  const renderContent = () => {
    if (!canAccess(role, activeTab)) {
      return (
        <div className="card p-8">
          <h2 className="text-xl font-bold text-red-600">Access Denied</h2>
          <p className="text-muted mt-2">You do not have permission to access {PAGE_TITLES[activeTab] || "this module"}.</p>
        </div>
      );
    }
    const Page = PAGES[activeTab] || Dashboard;
    return <Page authUser={authUser} setActiveTab={setActiveTab} />;
  };

  return (
    <div className="min-h-screen bg-canvas flex text-ink">
      <Sidebar
        authUser={authUser}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Header authUser={authUser} activeTab={activeTab} onLogout={onLogout} setActiveTab={setActiveTab} />
        <main className="flex-1 p-6 max-w-[1600px] w-full mx-auto">{renderContent()}</main>
      </div>
    </div>
  );
}
