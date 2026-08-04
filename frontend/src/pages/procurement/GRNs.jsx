import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import api from "../../services/api";
import { useList, save } from "../../hooks/useApi";
import { date, num } from "../../utils/format";
import { PageHeader, Toolbar, AddButton, DataTable, StatusChip, Modal, Field, TextInput, TextArea, Select, Grid2 } from "../../components/ui";

const blankItem = { item_id: "", description: "", ordered_qty: 0, received_qty: 0, damaged_qty: 0, shortage_qty: 0 };

export default function GRNs() {
  const [q, setQ] = useState("");
  const { rows, loading, reload } = useList("/grns", { q });
  const pos = useList("/purchase-orders").rows;
  const items = useList("/inv-items").rows;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ po_id: "", received_date: "", received_by: "", notes: "" });
  const [lines, setLines] = useState([{ ...blankItem }]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openNew = () => { setForm({ po_id: "", received_date: new Date().toISOString().slice(0, 10), received_by: "", notes: "" }); setLines([{ ...blankItem }]); setOpen(true); };
  const setLine = (i, k, v) => setLines(lines.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));

  // When a PO is chosen, pre-fill lines from its items
  const choosePO = async (e) => {
    const po_id = e.target.value;
    setForm({ ...form, po_id });
    if (po_id) {
      const res = await api.get(`/purchase-orders/${po_id}`);
      const its = res.data?.data?.items || [];
      if (its.length) setLines(its.map((it) => ({ item_id: it.item_id || "", description: it.description, ordered_qty: it.quantity, received_qty: it.quantity, damaged_qty: 0, shortage_qty: 0 })));
    }
  };

  const submit = async () => {
    if (await save("post", "/grns", { ...form, items: lines })) { setOpen(false); reload(); }
  };

  return (
    <div>
      <PageHeader title="Goods Received Notes" subtitle="Receive goods, record discrepancies — inventory updates automatically">
        <AddButton onClick={openNew} label="New GRN" />
      </PageHeader>

      <Toolbar q={q} setQ={setQ} placeholder="Search GRNs…" />

      <div className="card p-1">
        <DataTable loading={loading} rows={rows}
          columns={[
            { key: "ref", label: "GRN", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
            { key: "po_ref", label: "PO", render: (r) => r.po_ref || "—" },
            { key: "supplier_name", label: "Supplier", render: (r) => r.supplier_name || "—" },
            { key: "received_date", label: "Received", render: (r) => date(r.received_date) },
            { key: "received_by", label: "By", render: (r) => r.received_by || "—" },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Goods Received Note" wide
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={submit}>Receive goods</button></>}>
        <div className="space-y-4">
          <Grid2>
            <Field label="Purchase Order"><Select value={form.po_id} onChange={choosePO}><option value="">Select PO</option>{pos.map((p) => <option key={p.id} value={p.id}>{p.ref} — {p.supplier_name}</option>)}</Select></Field>
            <Field label="Received Date"><TextInput type="date" value={form.received_date} onChange={set("received_date")} /></Field>
          </Grid2>
          <Field label="Received By"><TextInput value={form.received_by} onChange={set("received_by")} /></Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label">Received Items</span>
              <button onClick={() => setLines([...lines, { ...blankItem }])} className="text-[12px] font-bold text-brand-600 inline-flex items-center gap-1"><Plus size={13} /> Add line</button>
            </div>
            <div className="grid grid-cols-12 gap-2 mb-1 text-[10px] uppercase font-bold text-muted px-1">
              <span className="col-span-4">Item</span><span className="col-span-2 text-center">Ordered</span><span className="col-span-2 text-center">Received</span><span className="col-span-2 text-center">Damaged</span><span className="col-span-1 text-center">Short</span><span className="col-span-1" />
            </div>
            <div className="space-y-2">
              {lines.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <Select className="col-span-4" value={it.item_id} onChange={(e) => setLine(i, "item_id", e.target.value)}>
                    <option value="">{it.description || "Select item"}</option>
                    {items.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}
                  </Select>
                  <input className="input col-span-2" type="number" value={it.ordered_qty} onChange={(e) => setLine(i, "ordered_qty", e.target.value)} />
                  <input className="input col-span-2" type="number" value={it.received_qty} onChange={(e) => setLine(i, "received_qty", e.target.value)} />
                  <input className="input col-span-2" type="number" value={it.damaged_qty} onChange={(e) => setLine(i, "damaged_qty", e.target.value)} />
                  <input className="input col-span-1" type="number" value={it.shortage_qty} onChange={(e) => setLine(i, "shortage_qty", e.target.value)} />
                  <button onClick={() => setLines(lines.filter((_, idx) => idx !== i))} className="col-span-1 grid place-items-center text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </div>
          <Field label="Notes"><TextArea value={form.notes} onChange={set("notes")} /></Field>
        </div>
      </Modal>
    </div>
  );
}
