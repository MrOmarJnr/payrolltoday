import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";

export default function Locations() {
  return (
    <CrudPage
      title="Locations"
      subtitle="Offices, branches and warehouses"
      endpoint="/locations"
      addLabel="New Location"
      filters={[{ name: "type", label: "All types", options: [{ value: "office", label: "Office" }, { value: "branch", label: "Branch" }, { value: "warehouse", label: "Warehouse" }] }]}
      exportRow={(r) => ({ name: r.name, code: r.code, type: r.type, city: r.city, country: r.country })}
      columns={[
        { key: "name", label: "Location", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "code", label: "Code" },
        { key: "type", label: "Type", render: (r) => <StatusChip status={r.type} /> },
        { key: "city", label: "City" },
        { key: "country", label: "Country" },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ type: "office", country: "Ghana", status: "active" }}
      fields={[
        { name: "name", label: "Name", required: true, half: true },
        { name: "code", label: "Code", half: true },
        { name: "type", label: "Type", type: "select", half: true, options: [{ value: "office", label: "Office" }, { value: "branch", label: "Branch" }, { value: "warehouse", label: "Warehouse" }] },
        { name: "city", label: "City", half: true },
        { name: "country", label: "Country", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
        { name: "address", label: "Address", type: "textarea" },
      ]}
    />
  );
}
