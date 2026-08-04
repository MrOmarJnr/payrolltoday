import {
  Users, Clock, Wallet, PiggyBank, Boxes, Laptop, AlertTriangle,
  ClipboardList, ShoppingCart, CheckSquare, Fuel, TrendingUp,
} from "lucide-react";
import { useData } from "../hooks/useApi";
import { money, num, date } from "../utils/format";
import { PageHeader, Kpi, Section, LineChart, BarList, DataTable, StatusChip } from "../components/ui";

export default function Dashboard() {
  const { data, loading } = useData("/dashboards/executive");
  const k = data?.kpis || {};

  return (
    <div>
      <PageHeader title="Executive Dashboard" subtitle="Company-wide view across HR, Finance, Inventory and Procurement" />

      {/* Row 1 — headline KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Kpi label="Total Employees" value={num(k.totalEmployees)} icon={Users} tone="brand" />
        <Kpi label="Attendance Today" value={num(k.attendanceToday)} icon={Clock} tone="cyan" />
        <Kpi label="Monthly Expenses" value={money(k.monthlyExpenses)} icon={Wallet} tone="violet" />
        <Kpi label="Budget Remaining" value={money(k.budgetRemaining)} icon={PiggyBank} tone="green" />
      </div>

      {/* Row 2 — operations KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Kpi label="Inventory Value" value={money(k.inventoryValue)} icon={Boxes} tone="brand" />
        <Kpi label="Total Assets" value={num(k.totalAssets)} icon={Laptop} tone="cyan" />
        <Kpi label="Low Stock Items" value={num(k.lowStock)} icon={AlertTriangle} tone="amber" />
        <Kpi label="Fuel Cost (Month)" value={money(k.fuelCostMonth)} icon={Fuel} tone="violet" />
      </div>

      {/* Row 3 — pending work */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Pending Purchase Requests" value={num(k.pendingPRs)} icon={ClipboardList} tone="amber" />
        <Kpi label="Pending Purchase Orders" value={num(k.pendingPOs)} icon={ShoppingCart} tone="brand" />
        <Kpi label="Pending Approvals" value={num(k.pendingApprovals)} icon={CheckSquare} tone="red" />
        <Kpi label="YTD Expenses" value={money(k.totalExpensesYear)} icon={TrendingUp} tone="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Monthly Spending Trend" subtitle="Last 6 months" className="lg:col-span-2"><LineChart data={data?.spendingTrend || []} /></Section>
        <Section title="Top Departments"><BarList data={data?.topDepartments || []} /></Section>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Top Expense Categories"><BarList data={data?.topCategories || []} color="#00c4f6" /></Section>
        <Section title="Top Suppliers"><BarList data={data?.topSuppliers || []} color="#22c55e" /></Section>
        <Section title="Low Stock Alerts">
          <DataTable loading={loading} rows={data?.lowStockItems || []} empty="Everything is well stocked."
            columns={[
              { key: "name", label: "Item", render: (r) => <div><p className="font-semibold text-[13px]">{r.name}</p><p className="text-[11px] text-muted">{r.item_code}</p></div> },
              { key: "quantity", label: "On hand", align: "right", render: (r) => <span className={r.quantity <= 0 ? "text-red-600 font-bold" : "text-amber-600 font-bold"}>{num(r.quantity)}</span> },
            ]}
          />
        </Section>
      </div>

      <Section title="Recent Activity">
        <DataTable loading={loading} rows={data?.recentActivities || []} empty="No recent activity."
          columns={[
            { key: "created_at", label: "When", render: (r) => new Date(r.created_at).toLocaleString("en-GB") },
            { key: "actor", label: "Actor", render: (r) => <span className="font-semibold">{r.actor}</span> },
            { key: "action", label: "Action", render: (r) => <StatusChip status={r.action} /> },
            { key: "module", label: "Module", render: (r) => <StatusChip status={r.module} /> },
            { key: "details", label: "Details" },
          ]}
        />
      </Section>
    </div>
  );
}
