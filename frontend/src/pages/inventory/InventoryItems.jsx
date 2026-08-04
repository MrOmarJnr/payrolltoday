import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { money, num } from "../../utils/format";

export default function InventoryItems() {
  return (
    <CrudPage
      title="Inventory Items"
      subtitle="Company stock, supplies and IT equipment"
      endpoint="/inv-items"
      addLabel="New Item"
      filters={[{ name: "status", label: "All statuses", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "discontinued", label: "Discontinued" }] }]}
      exportRow={(r) => ({ code: r.item_code, name: r.name, brand: r.brand, qty: r.quantity, avg_cost: r.avg_cost, value: r.quantity * r.avg_cost, status: r.status })}
      columns={[
        { key: "item_code", label: "Code", render: (r) => <span className="font-mono text-[12px]">{r.item_code}</span> },
        { key: "name", label: "Item", render: (r) => <div><p className="font-semibold">{r.name}</p><p className="text-[11px] text-muted">{r.brand}</p></div> },
        { key: "quantity", label: "On hand", align: "right", render: (r) => <span className={r.quantity <= r.reorder_level ? "text-amber-600 font-bold" : "font-bold"}>{num(r.quantity)} {r.unit}</span> },
        { key: "reorder_level", label: "Reorder", align: "right", render: (r) => num(r.reorder_level) },
        { key: "avg_cost", label: "Avg Cost", align: "right", render: (r) => money(r.avg_cost) },
        { key: "value", label: "Value", align: "right", render: (r) => <span className="font-bold">{money(r.quantity * r.avg_cost)}</span> },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ unit: "pcs", quantity: 0, min_quantity: 0, reorder_level: 0, purchase_price: 0, avg_cost: 0, status: "active" }}
      fields={[
        { name: "name", label: "Item Name", required: true },
        { name: "item_code", label: "Item Code", half: true, placeholder: "IT-LAP-001" },
        { name: "brand", label: "Brand", half: true },
        { name: "category_id", label: "Category", type: "select", half: true, options: { endpoint: "/inv-categories", value: "id", label: "name" } },
        { name: "unit", label: "Unit", half: true, placeholder: "pcs / box / ream" },
        { name: "warehouse_id", label: "Warehouse", type: "select", half: true, options: { endpoint: "/warehouses", value: "id", label: "name" } },
        { name: "supplier_id", label: "Supplier", type: "select", half: true, options: { endpoint: "/suppliers", value: "id", label: "company" } },
        { name: "quantity", label: "Current Quantity", type: "number", half: true },
        { name: "min_quantity", label: "Minimum Qty", type: "number", half: true },
        { name: "reorder_level", label: "Reorder Level", type: "number", half: true },
        { name: "purchase_price", label: "Purchase Price", type: "number", half: true },
        { name: "avg_cost", label: "Average Cost", type: "number", half: true },
        { name: "warranty", label: "Warranty", half: true },
        { name: "purchase_date", label: "Purchase Date", type: "date", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "discontinued", label: "Discontinued" }] },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
