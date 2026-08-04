import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { money, date } from "../../utils/format";

export default function VendorBills() {
  return (
    <CrudPage
      title="Vendor Bills"
      subtitle="Supplier invoices, 3-way matching and payment status"
      endpoint="/vendor-bills"
      addLabel="New Bill"
      filters={[
        { name: "status", label: "All statuses", options: [{ value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "paid", label: "Paid" }, { value: "rejected", label: "Rejected" }] },
        { name: "match_status", label: "All matching", options: [{ value: "matched", label: "Matched" }, { value: "unmatched", label: "Unmatched" }, { value: "exception", label: "Exception" }] },
      ]}
      exportRow={(r) => ({ ref: r.ref, invoice: r.invoice_number, total: r.total, match: r.match_status, status: r.status })}
      columns={[
        { key: "ref", label: "Ref", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
        { key: "invoice_number", label: "Invoice #" },
        { key: "bill_date", label: "Date", render: (r) => date(r.bill_date) },
        { key: "due_date", label: "Due", render: (r) => date(r.due_date) },
        { key: "total", label: "Total", align: "right", render: (r) => <span className="font-bold">{money(r.total)}</span> },
        { key: "match_status", label: "Matching", render: (r) => <StatusChip status={r.match_status} /> },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ status: "pending", match_status: "unmatched", amount: 0, tax: 0, total: 0 }}
      fields={[
        { name: "supplier_id", label: "Supplier", type: "select", half: true, options: { endpoint: "/suppliers", value: "id", label: "company" } },
        { name: "invoice_number", label: "Invoice Number", half: true },
        { name: "po_id", label: "Purchase Order", type: "select", half: true, options: { endpoint: "/purchase-orders", value: "id", label: "ref" } },
        { name: "grn_id", label: "GRN", type: "select", half: true, options: { endpoint: "/grns", value: "id", label: "ref" } },
        { name: "bill_date", label: "Bill Date", type: "date", half: true },
        { name: "due_date", label: "Due Date", type: "date", half: true },
        { name: "amount", label: "Amount", type: "number", half: true },
        { name: "tax", label: "Tax", type: "number", half: true },
        { name: "total", label: "Total", type: "number", half: true },
        { name: "match_status", label: "Match Status", type: "select", half: true, options: [{ value: "matched", label: "Matched" }, { value: "unmatched", label: "Unmatched" }, { value: "exception", label: "Exception" }] },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "pending", label: "Pending" }, { value: "approved", label: "Approved" }, { value: "paid", label: "Paid" }, { value: "rejected", label: "Rejected" }] },
        { name: "notes", label: "Notes", type: "textarea" },
      ]}
    />
  );
}
