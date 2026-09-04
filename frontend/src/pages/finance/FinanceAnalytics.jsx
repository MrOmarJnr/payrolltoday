import { useData } from "../../hooks/useApi";
import { money } from "../../utils/format";
import { PageHeader, Section, LineChart, Donut, BarList, Kpi } from "../../components/ui";
import { TrendingUp, PieChart } from "lucide-react";

export default function FinanceAnalytics() {
  const { data } = useData("/dashboards/finance");
  const k = data?.kpis || {};
  return (
    <div>
      <PageHeader title="Finance Analytics" />

      <div className="grid grid-cols-2 gap-4 mb-4">
        <Kpi label="YTD Spend" value={money(k.year)} icon={TrendingUp} tone="brand" />
        <Kpi label="Monthly Spend" value={money(k.month)} icon={PieChart} tone="cyan" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Spending Trend" subtitle="Last 6 months" className="lg:col-span-2"><LineChart data={data?.trend || []} /></Section>
        <Section title="Category Mix"><Donut data={data?.categoryBreakdown || []} /></Section>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Section title="Department Spending"><BarList data={data?.departmentSpending || []} /></Section>
        <Section title="Top Vendors"><BarList data={data?.topVendors || []} color="#00c4f6" /></Section>
      </div>
    </div>
  );
}
