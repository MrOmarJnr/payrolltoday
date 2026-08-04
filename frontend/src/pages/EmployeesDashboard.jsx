import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import { Users, UserCheck, Building2, CalendarClock } from "lucide-react";
import { PageHeader, Kpi, Section, Donut, BarList, DataTable, StatusChip } from "../components/ui";
import { num, date } from "../utils/format";

export default function EmployeesDashboard() {
  const [emps, setEmps] = useState([]);
  const [depts, setDepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [e, d] = await Promise.all([api.get("/employees"), api.get("/departments")]);
        setEmps(e.data.data || []);
        setDepts(d.data.data || []);
      } catch { /* handled by interceptor */ } finally { setLoading(false); }
    })();
  }, []);

  const active = emps.filter((e) => (e.status || "").toLowerCase() === "active").length;
  const deptName = (id) => depts.find((d) => d.id === id)?.name || "Unassigned";

  const byDept = useMemo(() => {
    const m = {};
    emps.forEach((e) => { const k = deptName(e.department_id); m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
  }, [emps, depts]);

  const byType = useMemo(() => {
    const m = {};
    emps.forEach((e) => { const k = e.employment_type || "Other"; m[k] = (m[k] || 0) + 1; });
    return Object.entries(m).map(([label, value]) => ({ label, value }));
  }, [emps]);

  const recent = useMemo(
    () => [...emps].sort((a, b) => new Date(b.date_employed) - new Date(a.date_employed)).slice(0, 8),
    [emps]
  );

  return (
    <div>
      <PageHeader title="HR Dashboard" subtitle="Workforce overview across the company" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Kpi label="Total Employees" value={num(emps.length)} icon={Users} tone="brand" />
        <Kpi label="Active" value={num(active)} icon={UserCheck} tone="green" />
        <Kpi label="Departments" value={num(depts.length)} icon={Building2} tone="cyan" />
        <Kpi label="Contract / Temp" value={num(emps.filter((e) => ["Contract", "Temporary", "Part-Time"].includes(e.employment_type)).length)} icon={CalendarClock} tone="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Headcount by Department" className="lg:col-span-2"><BarList data={byDept} format={num} /></Section>
        <Section title="Employment Type"><Donut data={byType} format={num} /></Section>
      </div>

      <Section title="Recent Hires">
        <DataTable loading={loading} rows={recent}
          columns={[
            { key: "name", label: "Employee", render: (r) => <span className="font-semibold">{r.first_name} {r.last_name}</span> },
            { key: "position", label: "Position" },
            { key: "dept", label: "Department", render: (r) => deptName(r.department_id) },
            { key: "employment_type", label: "Type", render: (r) => <StatusChip status={r.employment_type} /> },
            { key: "date_employed", label: "Joined", render: (r) => date(r.date_employed) },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
          ]}
        />
      </Section>
    </div>
  );
}
