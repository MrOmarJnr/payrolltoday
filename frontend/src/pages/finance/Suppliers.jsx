import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { Star } from "lucide-react";

export default function Suppliers() {
  return (
    <CrudPage
      title="Suppliers"
      subtitle="Vendor directory, terms and performance"
      endpoint="/suppliers"
      addLabel="New Supplier"
      filters={[{ name: "status", label: "All statuses", options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "blacklisted", label: "Blacklisted" }] }]}
      exportRow={(r) => ({ company: r.company, contact: r.contact_person, phone: r.phone, email: r.email, terms: r.payment_terms, rating: r.rating, status: r.status })}
      columns={[
        { key: "company", label: "Company", render: (r) => <div><p className="font-semibold">{r.company}</p><p className="text-[11px] text-muted">{r.contact_person}</p></div> },
        { key: "phone", label: "Phone" },
        { key: "email", label: "Email" },
        { key: "payment_terms", label: "Terms", render: (r) => r.payment_terms || "—" },
        { key: "rating", label: "Rating", align: "right", render: (r) => <span className="inline-flex items-center gap-1 font-bold"><Star size={13} className="text-amber-500" fill="#f59e0b" />{Number(r.rating || 0).toFixed(1)}</span> },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ status: "active", rating: 0 }}
      fields={[
        { name: "company", label: "Company Name", required: true, half: true },
        { name: "contact_person", label: "Contact Person", half: true },
        { name: "phone", label: "Phone", half: true },
        { name: "email", label: "Email", half: true },
        { name: "tax_number", label: "Tax Number", half: true },
        { name: "payment_terms", label: "Payment Terms", half: true, placeholder: "Net 30" },
        { name: "products_supplied", label: "Products Supplied", half: true },
        { name: "rating", label: "Rating (0-5)", type: "number", half: true },
        { name: "bank_details", label: "Bank Details", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }, { value: "blacklisted", label: "Blacklisted" }] },
        { name: "address", label: "Address", type: "textarea" },
      ]}
    />
  );
}
