import { useState, useMemo, useRef } from "react";
import { toast, confirmDialog } from "../services/notify";
import api from "../services/api";
import { Search } from "lucide-react";

export function Card({ title, subtitle, actions, children, className = "" }) {
  return (
    <div className={`card p-5 mb-6 ${className}`}>
      {(title || actions) && (
        <div className="flex items-start justify-between mb-4">
          <div>
            {title && <h2 className="text-[15px] font-extrabold text-ink">{title}</h2>}
            {subtitle && <p className="text-xs text-muted mt-0.5">{subtitle}</p>}
          </div>
          <div className="flex gap-2">{actions}</div>
        </div>
      )}
      {children}
    </div>
  );
}

export function Btn({ children, onClick, kind = "primary", type = "button", size = "md" }) {
  const styles = {
    primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-[0_6px_16px_rgba(1,82,213,0.25)]",
    ghost: "bg-canvas hover:bg-brand-50 text-ink",
    danger: "bg-red-600 hover:bg-red-700 text-white",
    success: "bg-emerald-600 hover:bg-emerald-700 text-white",
    cyan: "bg-cyan-400 hover:brightness-95 text-ink",
  };
  const pad = size === "sm" ? "px-2.5 py-1 text-xs" : "px-4 py-2.5 text-sm";
  return (
    <button type={type} onClick={onClick}
      className={`${styles[kind]} ${pad} rounded-xl font-bold transition-all active:scale-[0.98]`}>
      {children}
    </button>
  );
}

export function Field({ label, children }) {
  return (
    <label className="block text-sm">
      {label && <span className="text-muted font-semibold text-xs">{label}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  );
}

export const input =
  "w-full bg-white border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-100 transition";

export function Badge({ text, tone = "slate" }) {
  const tones = {
    slate: "bg-canvas text-muted", green: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-600", amber: "bg-amber-50 text-amber-700",
    blue: "bg-brand-50 text-brand-600", cyan: "bg-cyan-100 text-brand-700",
  };
  return <span className={`chip ${tones[tone] || tones.slate}`}>{String(text).replace(/_/g, " ")}</span>;
}

export function TH({ children, right }) {
  return <th className={`py-2.5 text-[11px] uppercase tracking-wide font-bold text-muted ${right ? "text-right" : "text-left"}`}>{children}</th>;
}

// -------- Pagination --------
export function usePager(items, perPage = 10) {
  const [page, setPage] = useState(1);
  const pages = Math.max(1, Math.ceil((items?.length || 0) / perPage));
  const current = Math.min(page, pages);
  const slice = useMemo(() => (items || []).slice((current - 1) * perPage, current * perPage), [items, current, perPage]);
  return { page: current, setPage, pages, slice, total: items?.length || 0, perPage };
}

export function Pager({ page, pages, setPage, total, perPage }) {
  if (total <= perPage) return null;
  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);
  const nums = [];
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  for (let i = start; i <= Math.min(pages, start + 4); i++) nums.push(i);
  const btn = "min-w-8 h-8 px-2 rounded-lg text-xs font-bold transition";
  return (
    <div className="flex items-center justify-between pt-4 mt-2 border-t border-line">
      <p className="text-xs text-muted font-semibold">{from}–{to} of {total}</p>
      <div className="flex items-center gap-1">
        <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1}
          className={`${btn} ${page === 1 ? "text-muted/40" : "text-ink hover:bg-canvas"}`}>Prev</button>
        {nums.map((n) => (
          <button key={n} onClick={() => setPage(n)}
            className={`${btn} ${n === page ? "bg-brand-500 text-white" : "text-ink hover:bg-canvas"}`}>{n}</button>
        ))}
        <button onClick={() => setPage(Math.min(pages, page + 1))} disabled={page === pages}
          className={`${btn} ${page === pages ? "text-muted/40" : "text-ink hover:bg-canvas"}`}>Next</button>
      </div>
    </div>
  );
}


// -------- Bulk import (Excel/CSV) + template download --------
export function downloadCsv(filename, headers, rows = []) {
  const esc = (v) => {
    const t = v == null ? "" : String(v);
    return /[",\n]/.test(t) ? '"' + t.replace(/"/g, '""') + '"' : t;
  };
  const lines = [headers.map(esc).join(",")].concat(rows.map((r) => r.map(esc).join(",")));
  const blob = new Blob([lines.join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
  URL.revokeObjectURL(a.href);
}

export function BulkImport({ url, filename, headers, sample = [], onDone }) {
  const ref = useRef(null);
  const [busy, setBusy] = useState(false);
  const upload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await api.post(url, fd, { headers: { "Content-Type": "multipart/form-data" } });
      const d = res.data || {};
      let msg = `Import complete\nCreated: ${d.created || 0}   Updated: ${d.updated || 0}   Skipped: ${d.skipped || 0}`;
      if (d.errors && d.errors.length) msg += "\n\nIssues:\n" + d.errors.slice(0, 12).join("\n");
      toast(msg);
      onDone && onDone();
    } catch (err) {
      toast(err.response?.data?.message || "Import failed.");
    } finally {
      setBusy(false);
      if (ref.current) ref.current.value = "";
    }
  };
  return (
    <div className="flex gap-2">
      <input ref={ref} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={upload} />
      <Btn kind="ghost" size="sm" onClick={() => downloadCsv(filename, headers, sample)}>Template</Btn>
      <Btn kind="cyan" size="sm" onClick={() => ref.current?.click()}>{busy ? "Importing..." : "Bulk import"}</Btn>
    </div>
  );
}


// -------- Searchable, selectable, paginated table state --------
export function useTable(items, { searchText, perPage = 10 } = {}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(() => new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q || !searchText) return items || [];
    return (items || []).filter((it) => String(searchText(it) || "").toLowerCase().includes(q));
  }, [items, query, searchText]);

  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const current = Math.min(page, pages);
  const slice = useMemo(
    () => filtered.slice((current - 1) * perPage, current * perPage),
    [filtered, current, perPage]
  );

  const toggle = (id) =>
    setSelected((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });
  const pageIds = slice.map((r) => r.id);
  const allOnPage = pageIds.length > 0 && pageIds.every((id) => selected.has(id));
  const toggleAll = () =>
    setSelected((prev) => {
      const n = new Set(prev);
      if (allOnPage) pageIds.forEach((id) => n.delete(id));
      else pageIds.forEach((id) => n.add(id));
      return n;
    });
  const clear = () => setSelected(new Set());

  return {
    query, setQuery, filtered, slice, page: current, setPage, pages, perPage,
    total: filtered.length, selected, toggle, toggleAll, allOnPage, clear,
    selectedIds: Array.from(selected),
  };
}

export function TableToolbar({ table, onBulkDelete, placeholder = "Search…", right }) {
  const n = table.selected.size;
  return (
    <div className="flex items-center justify-between gap-3 mb-3 flex-wrap">
      <div className="relative w-full max-w-xs">
        <Search size={15} className="absolute left-3 top-2.5 text-muted" />
        <input value={table.query} onChange={(e) => { table.setQuery(e.target.value); table.setPage(1); }}
          placeholder={placeholder}
          className="w-full bg-canvas rounded-xl pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-100" />
      </div>
      <div className="flex items-center gap-2">
        {right}
        {n > 0 && onBulkDelete && (
          <Btn kind="danger" size="sm" onClick={onBulkDelete}>Delete {n} selected</Btn>
        )}
      </div>
    </div>
  );
}

export function SelectTh({ table }) {
  return (
    <th className="py-2.5 w-9">
      <input type="checkbox" checked={table.allOnPage} onChange={table.toggleAll}
        className="w-4 h-4 accent-brand-500 align-middle" aria-label="Select all on page" />
    </th>
  );
}

export function SelectTd({ table, id }) {
  return (
    <td className="w-9">
      <input type="checkbox" checked={table.selected.has(id)} onChange={() => table.toggle(id)}
        className="w-4 h-4 accent-brand-500 align-middle" aria-label="Select row" />
    </td>
  );
}
