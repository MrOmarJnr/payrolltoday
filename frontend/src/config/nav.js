/*
|--------------------------------------------------------------------------
| LEF ERP — Central navigation + role-based access config
|--------------------------------------------------------------------------
| Single source of truth used by both Sidebar and MainLayout.
|
| Roles (must match the `roles` table):
|   Administrator, HR Officer, Payroll Officer, Finance Officer,
|   Procurement Officer, Read Only.  Administrator sees everything.
|
| Landing page = the Attendance dashboard (id "dashboard").
*/
import {
  LayoutDashboard, BarChart3, Users, Building2, Clock, CalendarClock,
  DollarSign, FileText, Fuel, Wallet, PiggyBank, LineChart, ReceiptText, Tag, Car, Truck,
  Boxes, Warehouse, PackagePlus, PackageMinus, SlidersHorizontal, Laptop,
  ClipboardList, ShoppingCart, Send, FileSpreadsheet,
  Settings, ShieldCheck, ScrollText,
} from "lucide-react";

export const NAV_GROUPS = [
  {
    title: "",
    items: [
      { id: "dashboard", label: "Attendance", icon: LayoutDashboard },
      { id: "exec-dashboard", label: "Executive Dashboard", icon: BarChart3 },
    ],
  },
  {
    title: "Human Resources",
    items: [
      { id: "hr-dashboard", label: "HR Dashboard", icon: LayoutDashboard },
      { id: "employees", label: "Employees", icon: Users },
      { id: "departments", label: "Departments", icon: Building2 },
      { id: "attendance", label: "Attendance", icon: Clock },
      { id: "leave", label: "Leave", icon: CalendarClock },
      { id: "payroll", label: "Payroll", icon: DollarSign },
      { id: "payslips", label: "Payslips", icon: FileText },
      { id: "reports", label: "HR Reports", icon: BarChart3 },
    ],
  },
  {
    title: "Finance",
    items: [
      { id: "fin-dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "expenses", label: "Expenses", icon: ReceiptText },
      { id: "expense-categories", label: "Expense Categories", icon: Tag },
      { id: "vendors", label: "Vendors", icon: Truck },
      { id: "fuel", label: "Fuel Management", icon: Fuel },
      { id: "vehicles", label: "Vehicles", icon: Car },
      { id: "budgets", label: "Budgets", icon: PiggyBank },
      { id: "petty-cash", label: "Petty Cash", icon: Wallet },
      { id: "fin-reports", label: "Financial Reports", icon: FileSpreadsheet },
      { id: "fin-analytics", label: "Analytics", icon: LineChart },
    ],
  },
  {
    title: "Inventory",
    items: [
      { id: "inv-dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "inv-items", label: "Inventory Items", icon: Boxes },
      { id: "inv-categories", label: "Categories", icon: Tag },
      { id: "warehouses", label: "Warehouses", icon: Warehouse },
      { id: "stock-in", label: "Stock In", icon: PackagePlus },
      { id: "stock-out", label: "Stock Out", icon: PackageMinus },
      { id: "adjustments", label: "Stock Adjustments", icon: SlidersHorizontal },
      { id: "assets", label: "Assets", icon: Laptop },
      { id: "inv-reports", label: "Inventory Reports", icon: BarChart3 },
    ],
  },
  {
    title: "Procurement",
    items: [
      { id: "proc-dashboard", label: "Dashboard", icon: LayoutDashboard },
      { id: "purchase-requests", label: "Purchase Requests", icon: ClipboardList },
      { id: "purchase-orders", label: "Purchase Orders", icon: ShoppingCart },
      { id: "rfqs", label: "RFQs", icon: Send },
      { id: "supplier-quotations", label: "Supplier Quotations", icon: FileSpreadsheet },
      { id: "vendor-bills", label: "Vendor Bills", icon: ReceiptText },
      { id: "suppliers", label: "Suppliers", icon: Truck },
      { id: "proc-reports", label: "Procurement Reports", icon: BarChart3 },
    ],
  },
  {
    title: "Administration",
    items: [
      { id: "users", label: "Users", icon: Users },
      { id: "roles", label: "Roles", icon: ShieldCheck },
      { id: "audit-logs", label: "Audit Logs", icon: ScrollText },
      { id: "settings", label: "Settings", icon: Settings },
    ],
  },
];

export const ALL_TABS = [...new Set(NAV_GROUPS.flatMap((g) => g.items.map((i) => i.id)))];

const FINANCE = ["fin-dashboard", "expenses", "expense-categories", "vendors", "fuel", "vehicles", "budgets", "petty-cash", "fin-reports", "fin-analytics"];
const INVENTORY = ["inv-dashboard", "inv-items", "inv-categories", "warehouses", "stock-in", "stock-out", "adjustments", "assets", "inv-reports"];
const PROCUREMENT = ["proc-dashboard", "purchase-requests", "purchase-orders", "rfqs", "supplier-quotations", "vendor-bills", "suppliers", "proc-reports"];

export const PERMISSIONS = {
  Administrator: ALL_TABS,
  "HR Officer": [
    "dashboard", "hr-dashboard", "employees", "departments", "attendance", "leave", "reports",
    ...INVENTORY,
  ],
  "Payroll Officer": ["dashboard", "attendance", "payroll", "payslips", "reports"],
  "Finance Officer": [
    "dashboard", "exec-dashboard", ...FINANCE,
    "vendor-bills", "purchase-orders", "proc-reports", "suppliers", "assets", "inv-reports",
  ],
  "Procurement Officer": ["dashboard", ...PROCUREMENT, "inv-items", "inv-dashboard"],
  "Read Only": ["dashboard", "exec-dashboard", "reports", "payslips", "fin-reports", "inv-reports", "proc-reports"],
};

export function canAccess(role, tab) {
  const list = PERMISSIONS[role] || PERMISSIONS.Administrator;
  return tab === "dashboard" || list.includes(tab);
}

export const PAGE_TITLES = Object.fromEntries(
  NAV_GROUPS.flatMap((g) => g.items.map((i) => [i.id, i.label]))
);
