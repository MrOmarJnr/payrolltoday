import { CalendarClock } from "lucide-react";
import { PageHeader, Kpi, Section, DataTable, StatusChip } from "../components/ui";

/* HR Leave — presentation scaffold. Wire to a /leave endpoint when the
   leave backend is added; the layout & design are ready for it. */
const SAMPLE = [
  { id: 1, employee: "Ama Boateng", type: "Annual", from: "2026-08-10", to: "2026-08-14", days: 5, status: "approved" },
  { id: 2, employee: "Kojo Mensah", type: "Sick", from: "2026-08-05", to: "2026-08-06", days: 2, status: "approved" },
  { id: 3, employee: "Sena Adjei", type: "Casual", from: "2026-08-18", to: "2026-08-18", days: 1, status: "pending" },
  { id: 4, employee: "Yaw Darko", type: "Annual", from: "2026-09-01", to: "2026-09-12", days: 10, status: "pending" },
];

export default function Leave() {
  return (
    <div>
      <PageHeader title="Leave" subtitle="Employee leave requests and balances" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="On Leave Today" value="2" icon={CalendarClock} tone="brand" />
        <Kpi label="Pending Requests" value="2" icon={CalendarClock} tone="amber" />
        <Kpi label="Approved (Month)" value="7" icon={CalendarClock} tone="green" />
        <Kpi label="Avg Balance (days)" value="14" icon={CalendarClock} tone="cyan" />
      </div>
      <Section title="Leave Requests">
        <DataTable rows={SAMPLE}
          columns={[
            { key: "employee", label: "Employee", render: (r) => <span className="font-semibold">{r.employee}</span> },
            { key: "type", label: "Type" },
            { key: "from", label: "From" },
            { key: "to", label: "To" },
            { key: "days", label: "Days", align: "right" },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
          ]}
        />
      </Section>
    </div>
  );
}
