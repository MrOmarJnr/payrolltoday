import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { date } from "../../utils/format";

export default function RFQs() {
  return (
    <CrudPage
      title="Request for Quotations"
      subtitle="Invite suppliers to quote and collect responses"
      endpoint="/rfqs"
      addLabel="New RFQ"
      filters={[{ name: "status", label: "All statuses", options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }, { value: "awarded", label: "Awarded" }, { value: "cancelled", label: "Cancelled" }] }]}
      exportRow={(r) => ({ ref: r.ref, title: r.title, due: r.due_date, status: r.status })}
      columns={[
        { key: "ref", label: "Ref", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
        { key: "title", label: "Title", render: (r) => <span className="font-semibold">{r.title}</span> },
        { key: "due_date", label: "Due", render: (r) => date(r.due_date) },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ status: "open" }}
      fields={[
        { name: "title", label: "RFQ Title", required: true },
        { name: "due_date", label: "Due Date", type: "date", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "open", label: "Open" }, { value: "closed", label: "Closed" }, { value: "awarded", label: "Awarded" }, { value: "cancelled", label: "Cancelled" }] },
        { name: "notes", label: "Notes / Scope", type: "textarea" },
      ]}
    />
  );
}
