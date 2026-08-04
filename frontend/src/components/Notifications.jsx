import { useEffect, useState } from "react";
import { onToast, onConfirm } from "../services/notify";
import { CheckCircle2, AlertCircle, Info, X, AlertTriangle } from "lucide-react";

const STYLES = {
  success: { icon: CheckCircle2, ring: "border-emerald-200", chip: "bg-emerald-50 text-emerald-600" },
  error: { icon: AlertCircle, ring: "border-red-200", chip: "bg-red-50 text-red-600" },
  info: { icon: Info, ring: "border-brand-200", chip: "bg-brand-50 text-brand-600" },
};

export default function Notifications() {
  const [toasts, setToasts] = useState([]);
  const [conf, setConf] = useState(null);

  useEffect(() => {
    const offT = onToast((t) => {
      setToasts((prev) => [...prev, t]);
      if (t.duration) setTimeout(() => setToasts((p) => p.filter((x) => x.id !== t.id)), t.duration);
    });
    const offC = onConfirm((payload) => setConf(payload));
    return () => { offT(); offC(); };
  }, []);

  const dismiss = (id) => setToasts((p) => p.filter((x) => x.id !== id));
  const answer = (val) => { conf?.resolve(val); setConf(null); };

  return (
    <>
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-2.5 w-80 max-w-[92vw]">
        {toasts.map((t) => {
          const s = STYLES[t.type] || STYLES.info;
          const Icon = s.icon;
          return (
            <div key={t.id} role="status"
              className={`card ${s.ring} p-3.5 flex items-start gap-3 animate-[slideIn_.18s_ease-out]`}>
              <span className={`grid place-items-center w-8 h-8 rounded-lg shrink-0 ${s.chip}`}><Icon size={17} /></span>
              <p className="text-[13px] text-ink font-medium flex-1 leading-snug whitespace-pre-line">{t.message}</p>
              <button onClick={() => dismiss(t.id)} className="text-muted hover:text-ink shrink-0"><X size={15} /></button>
            </div>
          );
        })}
      </div>

      {/* Confirm modal */}
      {conf && (
        <div className="fixed inset-0 z-[1010] bg-ink/40 backdrop-blur-[2px] flex items-center justify-center p-4"
          onClick={() => answer(false)}>
          <div className="card p-0 w-full max-w-sm overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-5 flex items-start gap-3">
              <span className={`grid place-items-center w-10 h-10 rounded-xl shrink-0 ${conf.danger ? "bg-red-50 text-red-600" : "bg-brand-50 text-brand-600"}`}>
                <AlertTriangle size={20} />
              </span>
              <div>
                <h3 className="text-[15px] font-extrabold text-ink">{conf.title}</h3>
                <p className="text-sm text-muted mt-1 whitespace-pre-line">{conf.message}</p>
              </div>
            </div>
            <div className="px-5 py-3.5 bg-canvas flex justify-end gap-2">
              <button onClick={() => answer(false)}
                className="px-4 py-2 rounded-xl text-sm font-bold text-ink bg-white border border-line hover:bg-canvas">{conf.cancelText}</button>
              <button onClick={() => answer(true)}
                className={`px-4 py-2 rounded-xl text-sm font-bold text-white ${conf.danger ? "bg-red-600 hover:bg-red-700" : "bg-brand-500 hover:bg-brand-600"}`}>{conf.confirmText}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
