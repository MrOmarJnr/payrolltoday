import { Boxes, PackageX, AlertTriangle, Coins } from "lucide-react";
import { useData } from "../../hooks/useApi";
import { money, num, date } from "../../utils/format";
import { PageHeader, Kpi, Section, Donut, GroupedBars, DataTable, StatusChip } from "../../components/ui";

export default function InventoryDashboard() {
  const { data, loading } = useData("/dashboards/inventory");
  const k = data?.kpis || {};
  return (
    <div>
      <PageHeader title="Inventory Dashboard" subtitle="Stock value, movement and low-stock alerts" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="Total Inventory Value" value={money(k.totalValue)} icon={Coins} tone="brand" />
        <Kpi label="Distinct Items" value={num(k.itemCount)} icon={Boxes} tone="cyan" />
        <Kpi label="Low Stock" value={num(k.lowStock)} icon={AlertTriangle} tone="amber" />
        <Kpi label="Out of Stock" value={num(k.outOfStock)} icon={PackageX} tone="red" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Stock Movement" subtitle="In vs Out — last 6 months" className="lg:col-span-2">
          <GroupedBars data={data?.trend || []} keys={["stock_in", "stock_out"]} format={num} />
        </Section>
        <Section title="Value by Category"><Donut data={data?.valueByCategory || []} /></Section>
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Section title="Low Stock Items">
          <DataTable loading={loading} rows={data?.lowStockItems || []} empty="Everything is well stocked."
            columns={[
              { key: "name", label: "Item", render: (r) => <div><p className="font-semibold">{r.name}</p><p className="text-[11px] text-muted">{r.item_code}</p></div> },
              { key: "quantity", label: "On hand", align: "right", render: (r) => <span className={r.quantity <= 0 ? "text-red-600 font-bold" : "font-bold"}>{num(r.quantity)}</span> },
              { key: "reorder_level", label: "Reorder", align: "right", render: (r) => num(r.reorder_level) },
            ]}
          />
        </Section>
        <Section title="Recent Movements">
          <DataTable loading={loading} rows={data?.recentMovements || []}
            columns={[
              { key: "movement_date", label: "Date", render: (r) => date(r.movement_date) },
              { key: "item_name", label: "Item" },
              { key: "type", label: "Type", render: (r) => <StatusChip status={r.type} /> },
              { key: "quantity", label: "Qty", align: "right", render: (r) => num(r.quantity) },
            ]}
          />
        </Section>
      </div>

      <Section title="Recently Added Items">
        <DataTable loading={loading} rows={data?.recentItems || []}
          columns={[
            { key: "item_code", label: "Code" },
            { key: "name", label: "Item", render: (r) => <span className="font-semibold">{r.name}</span> },
            { key: "quantity", label: "Qty", align: "right", render: (r) => num(r.quantity) },
            { key: "avg_cost", label: "Avg Cost", align: "right", render: (r) => money(r.avg_cost) },
            { key: "value", label: "Value", align: "right", render: (r) => <span className="font-bold">{money(r.quantity * r.avg_cost)}</span> },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
          ]}
        />
      </Section>
    </div>
  );
}
