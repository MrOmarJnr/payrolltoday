import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { money, date, daysUntil } from "../../utils/format";

export default function Contracts() {
  return (
    <CrudPage
      title="Contracts"
      subtitle="Supplier agreements, values and renewals"
      endpoint="/contracts"
      addLabel="New Contract"
      filters={[{ name: "status", label: "All statuses", options: [{ value: "active", label: "Active" }, { value: "renewal_due", label: "Renewal due" }, { value: "expired", label: "Expired" }, { value: "terminated", label: "Terminated" }] }]}
      exportRow={(r) => ({ ref: r.ref, title: r.title, start: r.start_date, end: r.end_date, value: r.value, status: r.status })}
      columns={[
        { key: "ref", label: "Ref", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
        { key: "title", label: "Contract", render: (r) => <span className="font-semibold">{r.title}</span> },
        { key: "value", label: "Value", align: "right", render: (r) => money(r.value) },
        { key: "end_date", label: "Expiry", render: (r) => { const d = daysUntil(r.end_date); return <div><p>{date(r.end_date)}</p>{d != null && d <= 60 && <p className="text-[11px] text-amber-600 font-semibold">{d < 0 ? "Expired" : `${d} days left`}</p>}</div>; } },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ status: "active", value: 0 }}
      fields={[
        { name: "title", label: "Contract Title", required: true },
        { name: "supplier_id", label: "Supplier", type: "select", half: true, options: { endpoint: "/suppliers", value: "id", label: "company" } },
        { name: "value", label: "Value (GHS)", type: "number", half: true },
        { name: "start_date", label: "Start Date", type: "date", half: true },
        { name: "end_date", label: "End Date", type: "date", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "active", label: "Active" }, { value: "renewal_due", label: "Renewal due" }, { value: "expired", label: "Expired" }, { value: "terminated", label: "Terminated" }] },
        { name: "document_url", label: "Document URL", half: true },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
