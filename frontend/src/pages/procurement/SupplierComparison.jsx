import { useState, useMemo } from "react";
import { Award } from "lucide-react";
import { useList } from "../../hooks/useApi";
import { money } from "../../utils/format";
import { PageHeader, Section, Select, Field } from "../../components/ui";

export default function SupplierComparison() {
  const rfqs = useList("/rfqs").rows;
  const quotes = useList("/supplier-quotations").rows;
  const suppliers = useList("/suppliers").rows;
  const [rfqId, setRfqId] = useState("");

  const supplierName = (id) => suppliers.find((s) => s.id === id)?.company || "—";
  const filtered = useMemo(() => quotes.filter((q) => !rfqId || q.rfq_id === rfqId), [quotes, rfqId]);

  const best = useMemo(() => {
    if (!filtered.length) return {};
    return {
      price: Math.min(...filtered.map((q) => Number(q.total) || Infinity)),
      delivery: Math.min(...filtered.map((q) => Number(q.delivery_days) || Infinity)),
      rating: Math.max(...filtered.map((q) => Number(q.rating) || 0)),
    };
  }, [filtered]);

  const cell = (isBest, children) => (
    <td className={`td text-center ${isBest ? "bg-emerald-50 font-bold text-emerald-700" : ""}`}>{children}</td>
  );

  return (
    <div>
      <PageHeader title="Supplier Comparison" subtitle="Compare quotations side-by-side to select the best supplier" />

      <div className="max-w-xs mb-4">
        <Field label="Filter by RFQ">
          <Select value={rfqId} onChange={(e) => setRfqId(e.target.value)}>
            <option value="">All RFQs</option>
            {rfqs.map((r) => <option key={r.id} value={r.id}>{r.ref} — {r.title}</option>)}
          </Select>
        </Field>
      </div>

      <Section title="Comparison Matrix" subtitle="Best value in each column is highlighted">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="th">Supplier</th>
                <th className="th text-center">Total Price</th>
                <th className="th text-center">Delivery</th>
                <th className="th text-center">Warranty</th>
                <th className="th text-center">Quality Rating</th>
                <th className="th text-center">Status</th>
                <th className="th text-center">Recommendation</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => {
                const score = (best.price === Number(q.total) ? 1 : 0) + (best.delivery === Number(q.delivery_days) ? 1 : 0) + (best.rating === Number(q.rating) ? 1 : 0);
                return (
                  <tr key={q.id} className="hover:bg-canvas">
                    <td className="td font-semibold">{supplierName(q.supplier_id)}</td>
                    {cell(best.price === Number(q.total), money(q.total))}
                    {cell(best.delivery === Number(q.delivery_days), `${q.delivery_days || 0} days`)}
                    <td className="td text-center">{q.warranty || "—"}</td>
                    {cell(best.rating === Number(q.rating), Number(q.rating || 0).toFixed(1))}
                    <td className="td text-center capitalize">{q.status}</td>
                    <td className="td text-center">
                      {score >= 2 ? <span className="chip bg-emerald-50 text-emerald-700"><Award size={12} /> Recommended</span> : <span className="text-muted text-[12px]">—</span>}
                    </td>
                  </tr>
                );
              })}
              {!filtered.length && <tr><td colSpan={7} className="td text-center text-muted py-10">No quotations to compare.</td></tr>}
            </tbody>
          </table>
        </div>
      </Section>
    </div>
  );
}
