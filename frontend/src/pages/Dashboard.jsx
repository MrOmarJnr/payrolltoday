import { useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { Search, Users, UserCheck, Clock3, Building2 } from "lucide-react";
import { Card } from "./_shiftui";

const d2 = (n) => String(n).padStart(2, "0");
const fmtDay = (iso) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
};
const toMin = (t) => {
  if (!t) return null;
  const [h, m] = String(t).split(":").map(Number);
  return h * 60 + (m || 0);
};

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [logs, setLogs] = useState([]);
  const [lateThreshold, setLateThreshold] = useState(510); // 08:30 default
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("logged");
  const [q, setQ] = useState("");
  const [selectedDate, setSelectedDate] = useState(""); // empty = latest day with data

  useEffect(() => {
    (async () => {
      try {
        const [e, d, a, s] = await Promise.all([
          api.get("/employees"), api.get("/departments"), api.get("/attendance"), api.get("/settings").catch(() => null),
        ]);
        setEmployees(e.data.data || []); setDepartments(d.data.data || []); setLogs(a.data.data || []);
        const c = s?.data?.company;
        if (c?.late_target_time) {
          const [th, tm] = String(c.late_target_time).split(":").map(Number);
          setLateThreshold(th * 60 + (tm || 0) + Number(c.late_grace_mins || 0));
        }
      } catch (err) { console.error(err); } finally { setLoading(false); }
    })();
  }, []);

  const empById = useMemo(() => Object.fromEntries(employees.map((e) => [e.id, e])), [employees]);
  const dateKey = (l) => String(l.attendance_date).slice(0, 10);
  // A clocked-in log is LATE if its clock-in is past the (target + grace) threshold,
  // OR the backend already stored it as Late. Consistent everywhere.
  const isLate = (l) => l.clock_in && (l.status === "Late" || (toMin(l.clock_in) != null && toMin(l.clock_in) > lateThreshold));

  const latestDate = useMemo(() => {
    const dates = logs.map(dateKey).filter(Boolean).sort();
    return dates.length ? dates[dates.length - 1] : new Date().toISOString().slice(0, 10);
  }, [logs]);

  // Manager can pick any date; empty selection falls back to the latest day.
  const activeDate = selectedDate || latestDate;
  const isToday = activeDate === new Date().toISOString().slice(0, 10);

  const todayLogs = useMemo(() => logs.filter((l) => dateKey(l) === activeDate), [logs, activeDate]);

  const counts = useMemo(() => {
    const clocked = todayLogs.filter((l) => l.clock_in);
    return {
      logged: new Set(clocked.map((l) => l.employee_id)).size,
      ontime: clocked.filter((l) => !isLate(l)).length,
      late: clocked.filter((l) => isLate(l)).length,
    };
  }, [todayLogs, lateThreshold]);

  const series = useMemo(() => {
    const byDay = {};
    logs.forEach((l) => {
      const k = dateKey(l);
      if (!k || !l.clock_in) return;
      byDay[k] = byDay[k] || { early: 0, late: 0 };
      if (isLate(l)) byDay[k].late++; else byDay[k].early++;
    });
    return Object.keys(byDay).sort().slice(-7).map((k) => ({ key: k, ...byDay[k] }));
  }, [logs, lateThreshold]);
  const maxVal = Math.max(1, ...series.map((s) => Math.max(s.early, s.late)));

  const rows = useMemo(() => {
    const list = todayLogs.filter((l) => l.clock_in).map((l) => {
      const e = empById[l.employee_id];
      return {
        id: l.id, name: e ? `${e.first_name} ${e.last_name}` : l.employee_id,
        role: e?.position || "—", login: l.clock_in, date: l.attendance_date, late: isLate(l),
      };
    });
    const f = tab === "ontime" ? list.filter((r) => !r.late) : tab === "late" ? list.filter((r) => r.late) : list;
    return q ? f.filter((r) => r.name.toLowerCase().includes(q.toLowerCase())) : f;
  }, [todayLogs, empById, tab, q, lateThreshold]);

  const deptCards = useMemo(() => departments.map((dep) => {
    const staff = todayLogs.filter((l) => empById[l.employee_id]?.department_id === dep.id && l.clock_in);
    return {
      name: dep.name, code: dep.code,
      total: employees.filter((e) => e.department_id === dep.id).length,
      ontime: staff.filter((l) => !isLate(l)).length,
      late: staff.filter((l) => isLate(l)).length,
    };
  }).filter((d) => d.total > 0), [departments, employees, todayLogs, empById, lateThreshold]);

  const stat = [
    { label: "Total Staff", value: employees.length, icon: Users, tone: "bg-brand-50 text-brand-500" },
    { label: "Clocked In", value: counts.logged, icon: UserCheck, tone: "bg-emerald-50 text-emerald-600" },
    { label: "Late", value: counts.late, icon: Clock3, tone: "bg-cyan-100 text-brand-600" },
    { label: "Departments", value: deptCards.length, icon: Building2, tone: "bg-amber-50 text-amber-600" },
  ];

  if (loading) return <div className="card p-8 text-muted">Loading dashboard…</div>;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_330px] gap-6 items-start">
      <div className="space-y-6">
        <div className="card p-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] uppercase tracking-wide font-bold text-muted">Viewing attendance for</p>
            <p className="text-lg font-extrabold text-ink">{fmtDay(activeDate)}{isToday && <span className="ml-2 chip bg-emerald-50 text-emerald-700">Today</span>}</p>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={activeDate}
              max={new Date().toISOString().slice(0, 10)}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-canvas border border-line rounded-xl px-3 py-2 text-sm font-semibold text-ink outline-none"
            />
            <button
              onClick={() => setSelectedDate(new Date().toISOString().slice(0, 10))}
              className="px-3 py-2 rounded-xl text-[13px] font-bold bg-brand-500 text-white hover:bg-brand-600 transition">
              Today
            </button>
            {selectedDate && (
              <button
                onClick={() => setSelectedDate("")}
                className="px-3 py-2 rounded-xl text-[13px] font-bold bg-white border border-line text-muted hover:text-ink transition">
                Latest
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stat.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="card p-4">
                <span className={`grid place-items-center w-10 h-10 rounded-xl ${s.tone}`}><Icon size={18} /></span>
                <p className="text-2xl font-extrabold text-ink mt-3">{s.value}</p>
                <p className="text-xs text-muted font-semibold">{s.label}</p>
              </div>
            );
          })}
        </div>

        <Card title="Attendance Status" subtitle={`On-time vs late · last ${series.length} days`}
          actions={<div className="flex items-center gap-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-muted"><span className="w-2.5 h-2.5 rounded-full bg-brand-500" /> On-time</span>
            <span className="flex items-center gap-1.5 text-muted"><span className="w-2.5 h-2.5 rounded-full bg-cyan-400" /> Late</span>
          </div>}>
          {series.length === 0 ? (
            <div className="h-56 grid place-items-center text-muted text-sm">No attendance data yet.</div>
          ) : (
            <div className="relative h-64 pt-8">
              <div className="absolute inset-x-0 top-8 bottom-8 flex flex-col justify-between pointer-events-none">
                {[0, 1, 2, 3].map((i) => <div key={i} className="border-t border-line/70" />)}
              </div>
              <div className="relative flex items-end justify-around gap-4 h-48">
                {series.map((s) => (
                  <div key={s.key} onClick={() => setSelectedDate(s.key)}
                    className={`group relative flex-1 flex flex-col items-center justify-end gap-2 h-full cursor-pointer rounded-lg transition ${s.key === activeDate ? "bg-brand-50" : "hover:bg-canvas"}`}
                    title={`View ${fmtDay(s.key)}`}>
                    <div className="pointer-events-none absolute -top-9 z-10 opacity-0 group-hover:opacity-100 transition-opacity
                                    bg-ink text-white rounded-lg px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap shadow-[var(--shadow-pop)]">
                      <div className="font-bold">{fmtDay(s.key)}</div>
                      <div className="flex gap-3 mt-0.5">
                        <span className="text-brand-200">On-time {s.early}</span>
                        <span className="text-cyan-100">Late {s.late}</span>
                      </div>
                    </div>
                    <div className="flex items-end justify-center gap-1.5 w-full h-full">
                      <div className="w-4 rounded-t-md bg-brand-500 group-hover:bg-brand-600 transition-all" style={{ height: `${(s.early / maxVal) * 100}%`, minHeight: s.early ? 4 : 0 }} />
                      <div className="w-4 rounded-t-md bg-cyan-400 transition-all" style={{ height: `${(s.late / maxVal) * 100}%`, minHeight: s.late ? 4 : 0 }} />
                    </div>
                    <span className="text-[11px] text-muted font-semibold">{fmtDay(s.key).slice(0, 6)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

        <div>
          <p className="text-[11px] uppercase tracking-wide font-bold text-muted mb-3">All Departments · {fmtDay(activeDate)}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {deptCards.map((d) => (
              <div key={d.code} className="card p-4">
                <div className="flex items-center justify-between">
                  <p className="text-3xl font-extrabold text-ink">{d2(d.total)}</p>
                  <div className="text-right text-xs space-y-0.5">
                    <p className="text-muted">On-time <span className="font-bold text-ink ml-1">{d2(d.ontime)}</span></p>
                    <p className="text-muted">Late <span className="font-bold text-cyan-400 ml-1">{d2(d.late)}</span></p>
                  </div>
                </div>
                <p className="mt-3 text-sm font-bold text-ink">{d.name}</p>
                <p className="text-[11px] text-muted">{d.code}</p>
              </div>
            ))}
            {deptCards.length === 0 && <div className="card p-6 text-muted text-sm">No department attendance for {fmtDay(activeDate)}.</div>}
          </div>
        </div>
      </div>

      <div className="card p-4 xl:sticky xl:top-[84px]">
        <div className="flex border-b border-line -mx-4 px-4 mb-3">
          {[["logged", "Logged in"], ["ontime", "On Time"], ["late", "Late"]].map(([k, label]) => (
            <button key={k} onClick={() => setTab(k)}
              className={`relative pb-3 pt-1 mr-5 text-[13px] font-bold transition ${tab === k ? "text-brand-500" : "text-muted hover:text-ink"}`}>
              {label} <span className="text-muted font-semibold">({counts[k]})</span>
              {tab === k && <span className="absolute left-0 -bottom-px h-0.5 w-full bg-brand-500 rounded-full" />}
            </button>
          ))}
        </div>
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-2.5 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search employees"
            className="w-full bg-canvas rounded-xl pl-9 pr-3 py-2 text-sm outline-none" />
        </div>
        <div className="space-y-1 max-h-[560px] overflow-y-auto -mx-1 px-1">
          {rows.map((r) => (
            <div key={r.id} className="flex items-center gap-3 p-2 rounded-xl hover:bg-canvas">
              <span className="grid place-items-center w-9 h-9 rounded-full bg-brand-50 text-brand-600 text-xs font-extrabold shrink-0">
                {r.name.split(" ").map((x) => x[0]).slice(0, 2).join("")}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-bold text-ink truncate">{r.name}</p>
                <p className="text-[11px] text-muted truncate">{r.role}</p>
                <p className="text-[11px] text-muted leading-tight">Login · {r.login || "—"}</p>
                <p className="text-[10px] text-muted/80">{fmtDay(r.date)}</p>
              </div>
              <span className={`chip ${r.late ? "bg-cyan-100 text-brand-700" : "bg-emerald-50 text-emerald-700"}`}>
                {r.late ? "Late" : "On time"}
              </span>
            </div>
          ))}
          {rows.length === 0 && <p className="text-center text-muted text-sm py-8">No employees to show.</p>}
        </div>
      </div>
    </div>
  );
}
