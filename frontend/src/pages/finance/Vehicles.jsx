import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";

export default function Vehicles() {
  return (
    <CrudPage
      title="Vehicles"
      subtitle="Company vehicles used for fuel tracking"
      endpoint="/vehicles"
      addLabel="New Vehicle"
      filters={[{ name: "status", label: "All statuses", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] }]}
      exportRow={(r) => ({ name: r.name, reg_no: r.reg_no, fuel_type: r.fuel_type, status: r.status })}
      columns={[
        { key: "name", label: "Vehicle", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "reg_no", label: "Reg. Number", render: (r) => <span className="font-mono text-[12px]">{r.reg_no || "—"}</span> },
        { key: "fuel_type", label: "Fuel Type" },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ fuel_type: "Diesel", status: "active" }}
      fields={[
        { name: "name", label: "Vehicle Name / Model", required: true, half: true },
        { name: "reg_no", label: "Registration Number", half: true, placeholder: "GR-0000-00" },
        { name: "department_id", label: "Assigned Department", type: "select", half: true, options: { endpoint: "/departments", value: "id", label: "name" } },
        { name: "fuel_type", label: "Fuel Type", type: "select", half: true, options: [{ value: "Petrol", label: "Petrol" }, { value: "Diesel", label: "Diesel" }, { value: "LPG", label: "LPG" }] },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
