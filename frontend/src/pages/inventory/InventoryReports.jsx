import { useData, useList } from "../../hooks/useApi";
import { money, num, exportCsv } from "../../utils/format";
import { PageHeader, Section, Donut, DataTable, Toolbar, StatusChip } from "../../components/ui";

export default function InventoryReports() {
  const { data } = useData("/dashboards/inventory");
  const items = useList("/inv-items").rows;
  const valuation = items.map((i) => ({ code: i.item_code, name: i.name, qty: i.quantity, avg_cost: i.avg_cost, value: i.quantity * i.avg_cost }));
  const totalValue = valuation.reduce((s, r) => s + r.value, 0);

  return (
    <div>
      <PageHeader title="Inventory Reports" subtitle={`Stock valuation · Total ${money(totalValue)}`} />

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Value by Category"><Donut data={data?.valueByCategory || []} /></Section>
        <Section title="Stock Valuation" className="lg:col-span-2">
          <Toolbar onExport={() => exportCsv("stock_valuation", valuation)} />
          <DataTable rows={valuation}
            columns={[
              { key: "code", label: "Code" },
              { key: "name", label: "Item", render: (r) => <span className="font-semibold">{r.name}</span> },
              { key: "qty", label: "Qty", align: "right", render: (r) => num(r.qty) },
              { key: "avg_cost", label: "Avg Cost", align: "right", render: (r) => money(r.avg_cost) },
              { key: "value", label: "Value", align: "right", render: (r) => <span className="font-bold">{money(r.value)}</span> },
            ]}
          />
        </Section>
      </div>

      <Section title="Low Stock & Reorder Report">
        <DataTable rows={items.filter((i) => i.quantity <= i.reorder_level)} empty="No items below reorder level."
          columns={[
            { key: "item_code", label: "Code" },
            { key: "name", label: "Item", render: (r) => <span className="font-semibold">{r.name}</span> },
            { key: "quantity", label: "On hand", align: "right", render: (r) => <span className={r.quantity <= 0 ? "text-red-600 font-bold" : "text-amber-600 font-bold"}>{num(r.quantity)}</span> },
            { key: "reorder_level", label: "Reorder Level", align: "right", render: (r) => num(r.reorder_level) },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.quantity <= 0 ? "out of stock" : "low"} /> },
          ]}
        />
      </Section>
    </div>
  );
}
