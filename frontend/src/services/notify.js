/*
 * App-wide notifications: nice in-app toasts + a styled confirm modal.
 * Usage anywhere (no hooks needed):
 *   import { toast, confirmDialog } from "../services/notify";
 *   toast("Saved", "success");
 *   if (!(await confirmDialog("Delete this?"))) return;
 */
let seq = 0;
const listeners = { toast: [], confirm: [] };

export function onToast(fn) { listeners.toast.push(fn); return () => { listeners.toast = listeners.toast.filter((f) => f !== fn); }; }
export function onConfirm(fn) { listeners.confirm.push(fn); return () => { listeners.confirm = listeners.confirm.filter((f) => f !== fn); }; }

function classify(message) {
  const m = String(message).toLowerCase();
  if (/(fail|error|invalid|not found|not allowed|unable|cannot|denied|missing|required|no rows|empty)/.test(m)) return "error";
  if (/(success|saved|updated|created|deleted|removed|complete|processed|approved|added|sent|done)/.test(m)) return "success";
  return "info";
}

export function toast(message, type, opts = {}) {
  const t = { id: ++seq, message: String(message), type: type || classify(message), duration: opts.duration ?? 4000 };
  if (listeners.toast.length === 0) { console.log(`[${t.type}] ${t.message}`); return t.id; }
  listeners.toast.forEach((fn) => fn(t));
  return t.id;
}

export function confirmDialog(message, opts = {}) {
  return new Promise((resolve) => {
    if (listeners.confirm.length === 0) { resolve(window.confirm(String(message))); return; }
    listeners.confirm.forEach((fn) => fn({
      message: String(message),
      title: opts.title || "Please confirm",
      confirmText: opts.confirmText || "Confirm",
      cancelText: opts.cancelText || "Cancel",
      danger: opts.danger !== false,
      resolve,
    }));
  });
}
