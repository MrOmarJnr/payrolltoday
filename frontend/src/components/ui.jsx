/*
|--------------------------------------------------------------------------
| LEF ERP — shared UI kit
|--------------------------------------------------------------------------
| Enterprise building blocks so every module page stays concise & consistent:
| PageHeader, Kpi, StatusChip, Toolbar, Modal, form fields, DataTable, Section,
| and lightweight dependency-free SVG charts (Bar/Line/Donut/Progress).
*/
import { useState, useMemo, useEffect } from "react";
import { Search, Download, Plus, X, Inbox, ChevronLeft, ChevronRight } from "lucide-react";
import { money, num } from "../utils/format";

export const PALETTE = ["#0152d5", "#00c4f6", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#14b8a6", "#6366f1", "#84cc16"];

/* ---------------------------------- Page header --------------------------- */
export function PageHeader({ title, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-extrabold text-ink">{title}</h1>
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

/* ------------------------------------ KPI --------------------------------- */
const TONES = {
  brand: "bg-brand-50 text-brand-600",
  cyan: "bg-cyan-100 text-brand-600",
  green: "bg-emerald-50 text-emerald-600",
  amber: "bg-amber-50 text-amber-600",
  red: "bg-red-50 text-red-600",
  violet: "bg-violet-50 text-violet-600",
};
export function Kpi({ label, value, icon: Icon, tone = "brand", sub, hint }) {
  return (
    <div className="card p-4">
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-semibold text-muted">{label}</p>
        {Icon && <span className={`grid place-items-center w-9 h-9 rounded-xl ${TONES[tone] || TONES.brand}`}><Icon size={17} /></span>}
      </div>
      <p className="text-2xl font-extrabold text-ink mt-2 leading-none">{value}</p>
      {sub && <p className="text-[12px] text-muted mt-1.5">{sub}</p>}
      {hint}
    </div>
  );
}

/* --------------------------------- Status chip ---------------------------- */
const STATUS_MAP = {
  approved: "bg-emerald-50 text-emerald-700", paid: "bg-emerald-50 text-emerald-700", active: "bg-emerald-50 text-emerald-700",
  completed: "bg-emerald-50 text-emerald-700", received: "bg-emerald-50 text-emerald-700", selected: "bg-emerald-50 text-emerald-700",
  in_use: "bg-emerald-50 text-emerald-700", matched: "bg-emerald-50 text-emerald-700", confirmed: "bg-emerald-50 text-emerald-700",
  pending: "bg-amber-50 text-amber-700", submitted: "bg-amber-50 text-amber-700", draft: "bg-slate-100 text-slate-600",
  open: "bg-blue-50 text-blue-700", sent: "bg-blue-50 text-blue-700", partial: "bg-amber-50 text-amber-700",
  shortlisted: "bg-blue-50 text-blue-700", renewal_due: "bg-amber-50 text-amber-700", maintenance: "bg-amber-50 text-amber-700",
  in_store: "bg-slate-100 text-slate-600", ordered: "bg-blue-50 text-blue-700", discrepancy: "bg-red-50 text-red-700",
  exception: "bg-red-50 text-red-700", unmatched: "bg-slate-100 text-slate-600",
  rejected: "bg-red-50 text-red-700", expired: "bg-red-50 text-red-700", terminated: "bg-red-50 text-red-700",
  cancelled: "bg-red-50 text-red-700", inactive: "bg-slate-100 text-slate-600", blacklisted: "bg-red-50 text-red-700",
  retired: "bg-slate-100 text-slate-600", disposed: "bg-slate-100 text-slate-600", closed: "bg-slate-100 text-slate-600",
  awarded: "bg-emerald-50 text-emerald-700", high: "bg-amber-50 text-amber-700", urgent: "bg-red-50 text-red-700",
  normal: "bg-slate-100 text-slate-600", low: "bg-slate-100 text-slate-600",
};
export function StatusChip({ status }) {
  if (!status) return <span className="chip bg-slate-100 text-slate-600">—</span>;
  const key = String(status).toLowerCase();
  const cls = STATUS_MAP[key] || "bg-slate-100 text-slate-600";
  return <span className={`chip ${cls}`}>{String(status).replace(/_/g, " ")}</span>;
}

/* ---------------------------------- Toolbar ------------------------------- */
export function Toolbar({ q, setQ, filters, onExport, children }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      {setQ && (
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 h-10 border border-line w-64 max-w-full">
          <Search size={16} className="text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search"
            className="bg-transparent outline-none text-[13px] flex-1 text-ink" />
        </div>
      )}
      {filters}
      <div className="flex-1" />
      {onExport && <button onClick={onExport} className="btn-ghost"><Download size={15} /> Export</button>}
      {children}
    </div>
  );
}

export function AddButton({ onClick, label = "New" }) {
  return <button onClick={onClick} className="btn-primary"><Plus size={16} /> {label}</button>;
}

/* ----------------------------------- Modal -------------------------------- */
export function Modal({ open, onClose, title, children, footer, wide }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[900] bg-ink/40 backdrop-blur-[2px] flex items-start justify-center p-4 overflow-y-auto" onClick={onClose}>
      <div className={`card w-full ${wide ? "max-w-3xl" : "max-w-lg"} my-8 animate-[popIn_.16s_ease-out]`} onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h3 className="text-[15px] font-extrabold text-ink">{title}</h3>
          <button onClick={onClose} className="text-muted hover:text-ink"><X size={18} /></button>
        </div>
        <div className="p-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && <div className="px-5 py-3.5 bg-canvas border-t border-line flex justify-end gap-2 rounded-b-[0.85rem]">{footer}</div>}
      </div>
    </div>
  );
}

/* -------------------------------- Form fields ----------------------------- */
export function Field({ label, children, required, className = "" }) {
  return (
    <label className={`block ${className}`}>
      <span className="label">{label}{required && <span className="text-red-500"> *</span>}</span>
      <div className="mt-1.5">{children}</div>
    </label>
  );
}
export function TextInput({ placeholder, ...props }) { return <input {...props} className={`input ${props.className || ""}`} />; }
export function TextArea({ placeholder, ...props }) { return <textarea {...props} className={`input ${props.className || ""}`} rows={props.rows || 3} />; }
export function Select({ children, ...props }) { return <select {...props} className={`input ${props.className || ""}`}>{children}</select>; }

export function Grid2({ children }) { return <div className="grid sm:grid-cols-2 gap-4">{children}</div>; }

/* File upload -> returns a stored URL via onChange(url). */
export function FileUpload({ value, onChange, accept = "image/*,.pdf", label = "Upload receipt" }) {
  const [busy, setBusy] = useState(false);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const api = (await import("../services/api")).default;
      const res = await api.post("/uploads", fd, { headers: { "Content-Type": "multipart/form-data" } });
      if (res.data?.success) onChange(res.data.url);
    } catch { /* toast handled globally */ } finally { setBusy(false); }
  };
  // In production (behind nginx) attachment URLs are same-origin (relative).
  // In dev, point straight at the backend on :5000.
  const origin = import.meta.env.VITE_API_URL ? "" : "http://localhost:5000";
  const href = value?.startsWith("http") ? value : origin + (value || "");
  return (
    <div className="flex items-center gap-3">
      <label className="btn-ghost cursor-pointer">
        <input type="file" accept={accept} className="hidden" onChange={upload} />
        {busy ? "Uploading…" : label}
      </label>
      {value && <a href={href} target="_blank" rel="noreferrer" className="text-[12px] font-semibold text-brand-600 underline">View attachment</a>}
    </div>
  );
}

/* ---------------------------------- Section ------------------------------- */
export function Section({ title, subtitle, children, actions, className = "" }) {
  return (
    <div className={`card p-5 ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between mb-4">
          <div>
            {title && <h3 className="text-[15px] font-extrabold text-ink">{title}</h3>}
            {subtitle && <p className="text-[12px] text-muted mt-0.5">{subtitle}</p>}
          </div>
          {actions}
        </div>
      )}
      {children}
    </div>
  );
}

/* --------------------------------- Pagination ----------------------------- */
export function Pagination({ page, pages, total, perPage, onChange }) {
  if (total <= perPage) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const nums = [];
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  for (let i = start; i <= Math.min(pages, start + 4); i++) nums.push(i);
  const btn = "min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition grid place-items-center";
  return (
    <div className="flex items-center justify-between px-3 py-3 border-t border-line">
      <p className="text-xs text-muted font-semibold">{from}–{to} of {total}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => onChange(Math.max(1, page - 1))} disabled={page === 1} className={`${btn} ${page === 1 ? "text-muted/40" : "text-ink hover:bg-canvas"}`}><ChevronLeft size={15} /></button>
        {nums.map((n) => (
          <button key={n} onClick={() => onChange(n)} className={`${btn} ${n === page ? "bg-brand-500 text-white" : "text-ink hover:bg-canvas"}`}>{n}</button>
        ))}
        <button onClick={() => onChange(Math.min(pages, page + 1))} disabled={page === pages} className={`${btn} ${page === pages ? "text-muted/40" : "text-ink hover:bg-canvas"}`}><ChevronRight size={15} /></button>
      </div>
    </div>
  );
}

/* --------------------------------- DataTable ------------------------------ */
export function DataTable({ columns, rows, loading, empty = "No records found.", onRowClick, perPage = 10, paginate = true }) {
  const [page, setPage] = useState(1);
  const total = rows?.length || 0;
  const pages = Math.max(1, Math.ceil(total / perPage));
  useEffect(() => { if (page > pages) setPage(1); }, [pages, page]);
  const view = useMemo(
    () => (paginate ? (rows || []).slice((page - 1) * perPage, page * perPage) : rows || []),
    [rows, page, perPage, paginate]
  );

  if (loading) return <div className="py-16 text-center text-muted text-sm">Loading…</div>;
  if (!total)
    return (
      <div className="py-16 flex flex-col items-center text-muted">
        <Inbox size={30} className="mb-2 opacity-50" />
        <p className="text-sm">{empty}</p>
      </div>
    );
  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>{columns.map((c) => <th key={c.key} className="th" style={{ textAlign: c.align || "left" }}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {view.map((r, i) => (
              <tr key={r.id || i} className={`transition-colors duration-150 hover:bg-canvas ${onRowClick ? "cursor-pointer" : ""}`} onClick={() => onRowClick?.(r)}>
                {columns.map((c) => (
                  <td key={c.key} className="td" style={{ textAlign: c.align || "left" }}>
                    {c.render ? c.render(r) : r[c.key] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {paginate && <Pagination page={page} pages={pages} total={total} perPage={perPage} onChange={setPage} />}
    </div>
  );
}

/* --------------------------------- Progress ------------------------------- */
export function Progress({ value, max = 100, tone }) {
  const pct = Math.min(100, Math.round((Number(value) / (Number(max) || 1)) * 100));
  const color = tone || (pct >= 100 ? "#ef4444" : pct >= 80 ? "#f59e0b" : "#0152d5");
  return (
    <div className="w-full h-2 rounded-full bg-canvas overflow-hidden">
      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

/* ============================== CHARTS (SVG) ============================== */
export function BarChart({ data = [], height = 200, color = PALETTE[0], format = num }) {
  if (!data.length) return <EmptyChart />;
  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);
  const bw = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${60}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
      {data.map((d, i) => {
        const h = (Number(d.value) / max) * 52;
        return <rect key={i} x={i * bw + bw * 0.2} y={56 - h} width={bw * 0.6} height={Math.max(h, 0.5)} rx="1.2" fill={color} />;
      })}
    </svg>
  );
}

// Renders a bar chart with axis labels & values below (block layout, not pure SVG).
export function BarList({ data = [], color = PALETTE[0], format = money }) {
  if (!data.length) return <EmptyChart />;
  const max = Math.max(...data.map((d) => Number(d.value) || 0), 1);
  return (
    <div className="space-y-3">
      {data.map((d, i) => (
        <div key={i}>
          <div className="flex justify-between text-[12px] mb-1">
            <span className="font-semibold text-ink truncate pr-2">{d.label}</span>
            <span className="text-muted shrink-0">{format(d.value)}</span>
          </div>
          <div className="h-2 rounded-full bg-canvas overflow-hidden">
            <div className="h-full rounded-full" style={{ width: `${(Number(d.value) / max) * 100}%`, background: color }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function LineChart({ data = [], height = 220, color = PALETTE[0], format = money }) {
  if (!data.length) return <EmptyChart />;
  const vals = data.map((d) => Number(d.value) || 0);
  const max = Math.max(...vals, 1);
  const min = Math.min(...vals, 0);
  const W = 100, H = 60, pad = 4;
  const x = (i) => (data.length === 1 ? W / 2 : pad + (i * (W - 2 * pad)) / (data.length - 1));
  const y = (v) => H - pad - ((v - min) / (max - min || 1)) * (H - 2 * pad);
  const points = data.map((d, i) => `${x(i)},${y(Number(d.value))}`).join(" ");
  const area = `${pad},${H - pad} ${points} ${W - pad},${H - pad}`;
  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ width: "100%", height }}>
        <defs>
          <linearGradient id={`g-${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={area} fill={`url(#g-${color.slice(1)})`} />
        <polyline points={points} fill="none" stroke={color} strokeWidth="1.4" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => <circle key={i} cx={x(i)} cy={y(Number(d.value))} r="1" fill={color} />)}
      </svg>
      <div className="flex justify-between mt-2 text-[10px] text-muted">
        {data.map((d, i) => <span key={i}>{d.label}</span>)}
      </div>
    </div>
  );
}

export function GroupedBars({ data = [], keys = [], colors = PALETTE, height = 220, format = money }) {
  if (!data.length) return <EmptyChart />;
  const max = Math.max(...data.flatMap((d) => keys.map((k) => Number(d[k]) || 0)), 1);
  return (
    <div>
      <div className="flex items-end gap-4 justify-around" style={{ height }}>
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
            <div className="flex items-end gap-1 h-full w-full justify-center">
              {keys.map((k, ki) => (
                <div key={k} title={`${k}: ${format(d[k])}`} className="rounded-t w-3 sm:w-5"
                  style={{ height: `${(Number(d[k]) / max) * 100}%`, background: colors[ki % colors.length], minHeight: 2 }} />
              ))}
            </div>
            <span className="text-[10px] text-muted truncate max-w-full">{d.label}</span>
          </div>
        ))}
      </div>
      <div className="flex gap-4 justify-center mt-3">
        {keys.map((k, ki) => (
          <span key={k} className="flex items-center gap-1.5 text-[11px] text-muted capitalize">
            <span className="w-2.5 h-2.5 rounded-sm" style={{ background: colors[ki % colors.length] }} /> {k.replace(/_/g, " ")}
          </span>
        ))}
      </div>
    </div>
  );
}

export function Donut({ data = [], size = 180, format = money }) {
  const total = data.reduce((s, d) => s + (Number(d.value) || 0), 0);
  if (!total) return <EmptyChart />;
  let acc = 0;
  const R = 15.9155, C = 2 * Math.PI * R;
  return (
    <div className="flex flex-col sm:flex-row items-center gap-5">
      <svg viewBox="0 0 42 42" style={{ width: size, height: size }}>
        <circle cx="21" cy="21" r={R} fill="none" stroke="#eef1f5" strokeWidth="5" />
        {data.map((d, i) => {
          const frac = (Number(d.value) || 0) / total;
          const dash = `${frac * C} ${C - frac * C}`;
          const off = C * (0.25 - acc);
          acc += frac;
          return <circle key={i} cx="21" cy="21" r={R} fill="none" stroke={PALETTE[i % PALETTE.length]}
            strokeWidth="5" strokeDasharray={dash} strokeDashoffset={off} />;
        })}
        <text x="21" y="20.5" textAnchor="middle" fontSize="4.5" fontWeight="800" fill="#091e42">{format(total)}</text>
        <text x="21" y="25" textAnchor="middle" fontSize="2.6" fill="#6b778c">Total</text>
      </svg>
      <div className="space-y-1.5 flex-1 w-full">
        {data.slice(0, 8).map((d, i) => (
          <div key={i} className="flex items-center justify-between text-[12px]">
            <span className="flex items-center gap-2 text-ink truncate pr-2">
              <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ background: PALETTE[i % PALETTE.length] }} />
              <span className="truncate">{d.label}</span>
            </span>
            <span className="text-muted shrink-0">{format(d.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function EmptyChart() {
  return <div className="h-40 grid place-items-center text-[12px] text-muted">No data yet</div>;
}
