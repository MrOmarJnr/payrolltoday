export const CURRENCY = "GHS";

export function money(v, opts = {}) {
  const n = Number(v || 0);
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: CURRENCY,
    maximumFractionDigits: opts.decimals ?? 0,
  }).format(n);
}

export function num(v, decimals = 0) {
  return new Intl.NumberFormat("en-GH", { maximumFractionDigits: decimals }).format(Number(v || 0));
}

export function compact(v) {
  return new Intl.NumberFormat("en-GH", { notation: "compact", maximumFractionDigits: 1 }).format(Number(v || 0));
}

export function date(v) {
  if (!v) return "—";
  const d = new Date(v);
  if (isNaN(d)) return String(v).slice(0, 10);
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
}

export function daysUntil(v) {
  if (!v) return null;
  const d = new Date(v);
  return Math.ceil((d - new Date()) / 86400000);
}

// Export an array of objects to CSV and trigger download.
export function exportCsv(filename, rows) {
  if (!rows || !rows.length) return;
  const headers = Object.keys(rows[0]);
  const esc = (val) => {
    const s = val == null ? "" : String(val);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => esc(r[h])).join(","))].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
