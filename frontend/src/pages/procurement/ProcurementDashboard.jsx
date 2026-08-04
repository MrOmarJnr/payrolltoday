import { ClipboardList, ShoppingCart, CheckSquare, Send, Truck, Coins } from "lucide-react";
import { useData } from "../../hooks/useApi";
import { money, num, date } from "../../utils/format";
import { PageHeader, Kpi, Section, LineChart, BarList, DataTable, StatusChip } from "../../components/ui";

export default function ProcurementDashboard() {
  const { data, loading } = useData("/dashboards/procurement");
  const k = data?.kpis || {};
  return (
    <div>
      <PageHeader title="Procurement Dashboard" subtitle="Purchasing lifecycle, supplier performance and spend" />

      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-6">
        <Kpi label="Pending Requests" value={num(k.pendingRequests)} icon={ClipboardList} tone="amber" />
        <Kpi label="Pending POs" value={num(k.pendingPOs)} icon={ShoppingCart} tone="brand" />
        <Kpi label="Pending Approvals" value={num(k.pendingApprovals)} icon={CheckSquare} tone="red" />
        <Kpi label="Open RFQs" value={num(k.openRFQs)} icon={Send} tone="cyan" />
        <Kpi label="Pending Deliveries" value={num(k.pendingDeliveries)} icon={Truck} tone="violet" />
        <Kpi label="Spend (Month)" value={money(k.monthSpend)} icon={Coins} tone="green" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Procurement Spend" subtitle="Last 6 months" className="lg:col-span-2"><LineChart data={data?.spendTrend || []} /></Section>
        <Section title="Supplier Performance" subtitle="Rating out of 5"><BarList data={data?.supplierPerformance || []} format={(v) => Number(v).toFixed(1)} color="#22c55e" /></Section>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Section title="Top Suppliers by Spend"><BarList data={data?.topSuppliers || []} /></Section>
        <Section title="Recent Purchase Orders" className="lg:col-span-2">
          <DataTable loading={loading} rows={data?.recentPurchases || []}
            columns={[
              { key: "ref", label: "PO", render: (r) => <span className="font-semibold">{r.ref}</span> },
              { key: "supplier_name", label: "Supplier" },
              { key: "order_date", label: "Date", render: (r) => date(r.order_date) },
              { key: "total", label: "Total", align: "right", render: (r) => money(r.total) },
              { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
            ]}
          />
        </Section>
      </div>
    </div>
  );
}
