import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { num } from "../../utils/format";

export default function Warehouses() {
  return (
    <CrudPage
      title="Warehouses"
      subtitle="Storage locations across the company"
      endpoint="/warehouses"
      addLabel="New Warehouse"
      filters={[{ name: "status", label: "All statuses", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] }]}
      exportRow={(r) => ({ name: r.name, code: r.code, manager: r.manager, capacity: r.capacity, status: r.status })}
      columns={[
        { key: "name", label: "Warehouse", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "code", label: "Code" },
        { key: "manager", label: "Manager", render: (r) => r.manager || "—" },
        { key: "capacity", label: "Capacity", align: "right", render: (r) => num(r.capacity) },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ status: "active", capacity: 0 }}
      fields={[
        { name: "name", label: "Warehouse Name", required: true, half: true },
        { name: "code", label: "Code", half: true },
        { name: "location_id", label: "Location", type: "select", half: true, options: { endpoint: "/locations", value: "id", label: "name" } },
        { name: "manager", label: "Manager", half: true },
        { name: "capacity", label: "Capacity (units)", type: "number", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
      ]}
    />
  );
}
