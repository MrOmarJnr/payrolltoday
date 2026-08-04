import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { money, date } from "../../utils/format";

const CATS = ["Laptops", "Servers", "Printers", "UPS", "Vehicles", "Routers", "Switches", "Air Conditioners", "Projectors", "Furniture", "Networking"];

export default function Assets() {
  return (
    <CrudPage
      title="Assets"
      subtitle="Company fixed assets & equipment register"
      endpoint="/assets"
      addLabel="New Asset"
      filters={[
        { name: "status", label: "All statuses", options: [{ value: "in_use", label: "In use" }, { value: "in_store", label: "In store" }, { value: "maintenance", label: "Maintenance" }, { value: "retired", label: "Retired" }, { value: "disposed", label: "Disposed" }] },
      ]}
      exportRow={(r) => ({ tag: r.asset_tag, name: r.name, category: r.category, serial: r.serial_number, cost: r.purchase_cost, status: r.status })}
      columns={[
        { key: "asset_tag", label: "Tag", render: (r) => <span className="font-mono text-[12px]">{r.asset_tag}</span> },
        { key: "name", label: "Asset", render: (r) => <div><p className="font-semibold">{r.name}</p><p className="text-[11px] text-muted">{r.category}</p></div> },
        { key: "serial_number", label: "Serial" },
        { key: "purchase_date", label: "Purchased", render: (r) => date(r.purchase_date) },
        { key: "purchase_cost", label: "Cost", align: "right", render: (r) => money(r.purchase_cost) },
        { key: "warranty", label: "Warranty", render: (r) => r.warranty || "—" },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ status: "in_store", purchase_cost: 0 }}
      fields={[
        { name: "name", label: "Asset Name", required: true, half: true },
        { name: "category", label: "Category", type: "select", half: true, options: CATS.map((c) => ({ value: c, label: c })) },
        { name: "asset_tag", label: "Asset Tag", half: true, placeholder: "LEF-LAP-001" },
        { name: "serial_number", label: "Serial Number", half: true },
        { name: "assigned_department_id", label: "Assigned Department", type: "select", half: true, options: { endpoint: "/departments", value: "id", label: "name" } },
        { name: "warehouse_id", label: "Warehouse", type: "select", half: true, options: { endpoint: "/warehouses", value: "id", label: "name" } },
        { name: "purchase_date", label: "Purchase Date", type: "date", half: true },
        { name: "purchase_cost", label: "Purchase Cost", type: "number", half: true },
        { name: "warranty", label: "Warranty", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "in_use", label: "In use" }, { value: "in_store", label: "In store" }, { value: "maintenance", label: "Maintenance" }, { value: "retired", label: "Retired" }, { value: "disposed", label: "Disposed" }] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
