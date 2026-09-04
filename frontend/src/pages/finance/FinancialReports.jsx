import { useState } from "react";
import { useData } from "../../hooks/useApi";
import { money, exportCsv } from "../../utils/format";
import { PageHeader, Section, DataTable, BarList, Toolbar } from "../../components/ui";

const TABS = [
  { id: "category", label: "By Category", key: "categoryBreakdown" },
  { id: "department", label: "By Department", key: "departmentSpending" },
  { id: "vendor", label: "By Vendor", key: "topVendors" },
];

export default function FinancialReports() {
  const { data } = useData("/dashboards/finance");
  const [tab, setTab] = useState("category");
  const active = TABS.find((t) => t.id === tab);
  const rows = data?.[active.key] || [];

  return (
    <div>
      <PageHeader title="Financial Reports" />

      <div className="flex flex-wrap gap-2 mb-4">
        {TABS.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-xl text-[13px] font-bold transition ${tab === t.id ? "bg-brand-500 text-white" : "bg-white border border-line text-muted hover:text-ink"}`}>
            {t.label}
          </button>
        ))}
      </div>

      <Toolbar onExport={() => exportCsv(`finance_report_${tab}`, rows)} />

      <div className="grid lg:grid-cols-2 gap-4">
        <Section title={active.label}>
          <DataTable rows={rows}
            columns={[
              { key: "label", label: active.label.replace("By ", "") },
              { key: "value", label: "Amount", align: "right", render: (r) => <span className="font-bold">{money(r.value)}</span> },
            ]}
          />
        </Section>
        <Section title="Visual"><BarList data={rows} /></Section>
      </div>
    </div>
  );
}
