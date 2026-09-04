import { CalendarDays, CalendarRange, CalendarClock, TrendingUp, Clock, Receipt } from "lucide-react";
import { useData } from "../../hooks/useApi";
import { money } from "../../utils/format";
import { PageHeader, Kpi, Section, LineChart, Donut, BarList, DataTable, StatusChip } from "../../components/ui";

export default function FinanceDashboard() {
  const { data, loading } = useData("/dashboards/finance");
  const k = data?.kpis || {};

  return (
    <div>
      <PageHeader title="Finance Dashboard" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Kpi label="Today's Expenses" value={money(k.today)} icon={CalendarDays} tone="brand" />
        <Kpi label="This Week" value={money(k.week)} icon={CalendarRange} tone="cyan" />
        <Kpi label="This Month" value={money(k.month)} icon={CalendarClock} tone="violet" />
        <Kpi label="This Year" value={money(k.year)} icon={TrendingUp} tone="green" />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Kpi label="Pending Approvals" value={k.pendingApprovals ?? 0} icon={Clock} tone="amber" sub="Awaiting review" />
        <Kpi label="Pending Reimbursements" value={k.pendingReimbursements ?? 0} icon={Receipt} tone="red" sub="Staff claims" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Expense Trend" subtitle="Last 6 months" className="lg:col-span-2">
          <LineChart data={data?.trend || []} />
        </Section>
        <Section title="Category Breakdown">
          <Donut data={data?.categoryBreakdown || []} />
        </Section>
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Department Spending" className="lg:col-span-3">
          <BarList data={data?.departmentSpending || []} />
        </Section>
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        <Section title="Top Vendors">
          <BarList data={data?.topVendors || []} color="#00c4f6" />
        </Section>
        <Section title="Recent Transactions" className="lg:col-span-2">
          <DataTable
            loading={loading}
            rows={data?.recent || []}
            columns={[
              { key: "ref", label: "Reference", render: (r) => <span className="font-semibold">{r.ref}</span> },
              { key: "category_name", label: "Category" },
              { key: "expense_date", label: "Date", render: (r) => (r.expense_date || "").slice(0, 10) },
              { key: "total", label: "Amount", align: "right", render: (r) => money(r.total) },
              { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
            ]}
          />
        </Section>
      </div>
    </div>
  );
}
