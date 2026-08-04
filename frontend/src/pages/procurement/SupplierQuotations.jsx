import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { money, date } from "../../utils/format";

export default function SupplierQuotations() {
  return (
    <CrudPage
      title="Supplier Quotations"
      subtitle="Quotes received from suppliers against RFQs"
      endpoint="/supplier-quotations"
      addLabel="New Quotation"
      filters={[{ name: "status", label: "All statuses", options: [{ value: "received", label: "Received" }, { value: "shortlisted", label: "Shortlisted" }, { value: "selected", label: "Selected" }, { value: "rejected", label: "Rejected" }] }]}
      exportRow={(r) => ({ ref: r.ref, total: r.total, delivery_days: r.delivery_days, rating: r.rating, status: r.status })}
      columns={[
        { key: "ref", label: "Ref", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
        { key: "quote_date", label: "Date", render: (r) => date(r.quote_date) },
        { key: "total", label: "Total", align: "right", render: (r) => <span className="font-bold">{money(r.total)}</span> },
        { key: "delivery_days", label: "Delivery", align: "right", render: (r) => `${r.delivery_days || 0} days` },
        { key: "warranty", label: "Warranty", render: (r) => r.warranty || "—" },
        { key: "rating", label: "Rating", align: "right", render: (r) => Number(r.rating || 0).toFixed(1) },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ status: "received", subtotal: 0, tax: 0, total: 0, delivery_days: 0, rating: 0 }}
      fields={[
        { name: "rfq_id", label: "RFQ", type: "select", half: true, options: { endpoint: "/rfqs", value: "id", label: "title" } },
        { name: "supplier_id", label: "Supplier", type: "select", half: true, options: { endpoint: "/suppliers", value: "id", label: "company" } },
        { name: "quote_date", label: "Quote Date", type: "date", half: true },
        { name: "valid_until", label: "Valid Until", type: "date", half: true },
        { name: "subtotal", label: "Subtotal", type: "number", half: true },
        { name: "tax", label: "Tax", type: "number", half: true },
        { name: "total", label: "Total", type: "number", half: true },
        { name: "delivery_days", label: "Delivery (days)", type: "number", half: true },
        { name: "warranty", label: "Warranty", half: true },
        { name: "rating", label: "Quality Rating (0-5)", type: "number", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "received", label: "Received" }, { value: "shortlisted", label: "Shortlisted" }, { value: "selected", label: "Selected" }, { value: "rejected", label: "Rejected" }] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
