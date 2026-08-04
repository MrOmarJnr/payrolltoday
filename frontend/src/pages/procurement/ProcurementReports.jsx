import { useData, useList } from "../../hooks/useApi";
import { money, date, exportCsv } from "../../utils/format";
import { PageHeader, Section, BarList, LineChart, DataTable, StatusChip, Toolbar } from "../../components/ui";

export default function ProcurementReports() {
  const { data } = useData("/dashboards/procurement");
  const pos = useList("/purchase-orders").rows;
  const bills = useList("/vendor-bills").rows;

  return (
    <div>
      <PageHeader title="Procurement Reports" subtitle="Purchase analysis, vendor spend and supplier performance" />

      <div className="grid lg:grid-cols-2 gap-4 mb-4">
        <Section title="Vendor Spend"><BarList data={data?.topSuppliers || []} /></Section>
        <Section title="Spend Trend" subtitle="Last 6 months"><LineChart data={data?.spendTrend || []} /></Section>
      </div>

      <Section title="Purchase Order Analysis" className="mb-4">
        <Toolbar onExport={() => exportCsv("purchase_orders", pos.map((p) => ({ ref: p.ref, supplier: p.supplier_name, date: p.order_date, total: p.total, status: p.status })))} />
        <DataTable rows={pos}
          columns={[
            { key: "ref", label: "PO" },
            { key: "supplier_name", label: "Supplier" },
            { key: "order_date", label: "Date", render: (r) => date(r.order_date) },
            { key: "total", label: "Total", align: "right", render: (r) => <span className="font-bold">{money(r.total)}</span> },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
          ]}
        />
      </Section>

      <Section title="Vendor Bills — Payment Status">
        <Toolbar onExport={() => exportCsv("vendor_bills", bills.map((b) => ({ ref: b.ref, invoice: b.invoice_number, total: b.total, status: b.status })))} />
        <DataTable rows={bills}
          columns={[
            { key: "ref", label: "Bill" },
            { key: "invoice_number", label: "Invoice #" },
            { key: "due_date", label: "Due", render: (r) => date(r.due_date) },
            { key: "total", label: "Total", align: "right", render: (r) => money(r.total) },
            { key: "match_status", label: "Matching", render: (r) => <StatusChip status={r.match_status} /> },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
          ]}
        />
      </Section>
    </div>
  );
}
