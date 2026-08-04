import { useState } from "react";
import { Plus, Trash2, Send, PackageCheck } from "lucide-react";
import { useList, save } from "../../hooks/useApi";
import { confirmDialog } from "../../services/notify";
import { money, date, num } from "../../utils/format";
import { PageHeader, Toolbar, AddButton, DataTable, StatusChip, Modal, Field, TextInput, TextArea, Select, Grid2, FileUpload } from "../../components/ui";

const empty = { supplier_id: "", request_id: "", order_date: "", delivery_date: "", payment_terms: "", discount: 0, tax: 0, status: "draft", attachment_url: "", notes: "" };
const blankItem = { description: "", quantity: 1, unit_price: 0, discount: 0, tax: 0 };

export default function PurchaseOrders() {
  const [q, setQ] = useState("");
  const { rows, loading, reload } = useList("/purchase-orders", { q });
  const suppliers = useList("/suppliers").rows;
  const requests = useList("/purchase-requests", { status: "approved" }).rows;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [items, setItems] = useState([{ ...blankItem }]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openNew = () => { setForm({ ...empty, order_date: new Date().toISOString().slice(0, 10) }); setItems([{ ...blankItem }]); setOpen(true); };
  const setItem = (i, k, v) => setItems(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const subtotal = items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.unit_price || 0), 0);
  const total = subtotal - Number(form.discount || 0) + Number(form.tax || 0);

  const submit = async () => {
    if (!form.supplier_id) return;
    if (await save("post", "/purchase-orders", { ...form, items })) { setOpen(false); reload(); }
  };
  const decide = async (r, s) => { if (await save("post", `/purchase-orders/${r.id}/status`, { status: s })) reload(); };
  const remove = async (r) => { if (await confirmDialog(`Delete PO ${r.ref}?`) && await save("delete", `/purchase-orders/${r.id}`)) reload(); };

  return (
    <div>
      <PageHeader title="Purchase Orders" subtitle="Orders issued to suppliers">
        <AddButton onClick={openNew} label="New PO" />
      </PageHeader>

      <Toolbar q={q} setQ={setQ} placeholder="Search POs…" />

      <div className="card p-1">
        <DataTable loading={loading} rows={rows}
          columns={[
            { key: "ref", label: "PO", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
            { key: "supplier_name", label: "Supplier", render: (r) => <span className="font-semibold">{r.supplier_name || "—"}</span> },
            { key: "order_date", label: "Ordered", render: (r) => date(r.order_date) },
            { key: "delivery_date", label: "Delivery", render: (r) => date(r.delivery_date) },
            { key: "item_count", label: "Items", align: "right", render: (r) => num(r.item_count) },
            { key: "total", label: "Total", align: "right", render: (r) => <span className="font-bold">{money(r.total)}</span> },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
            {
              key: "a", label: "", align: "right", render: (r) => (
                <div className="flex justify-end gap-1">
                  {r.status === "draft" && <button title="Send" onClick={() => decide(r, "sent")} className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600"><Send size={15} /></button>}
                  {["sent", "confirmed", "partial"].includes(r.status) && <button title="Mark received" onClick={() => decide(r, "received")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><PackageCheck size={15} /></button>}
                  <button title="Delete" onClick={() => remove(r)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Purchase Order" wide
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={submit}>Create PO</button></>}>
        <div className="space-y-4">
          <Grid2>
            <Field label="Supplier" required><Select value={form.supplier_id} onChange={set("supplier_id")}><option value="">Select supplier</option>{suppliers.map((s) => <option key={s.id} value={s.id}>{s.company}</option>)}</Select></Field>
            <Field label="From Request"><Select value={form.request_id} onChange={set("request_id")}><option value="">None</option>{requests.map((r) => <option key={r.id} value={r.id}>{r.ref} — {r.title}</option>)}</Select></Field>
          </Grid2>
          <Grid2>
            <Field label="Order Date"><TextInput type="date" value={form.order_date} onChange={set("order_date")} /></Field>
            <Field label="Delivery Date"><TextInput type="date" value={form.delivery_date} onChange={set("delivery_date")} /></Field>
          </Grid2>
          <Field label="Payment Terms"><TextInput value={form.payment_terms} onChange={set("payment_terms")} placeholder="Net 30" /></Field>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label">Line Items</span>
              <button onClick={() => setItems([...items, { ...blankItem }])} className="text-[12px] font-bold text-brand-600 inline-flex items-center gap-1"><Plus size={13} /> Add item</button>
            </div>
            <div className="space-y-2">
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input className="input col-span-5" placeholder="Description" value={it.description} onChange={(e) => setItem(i, "description", e.target.value)} />
                  <input className="input col-span-2" type="number" placeholder="Qty" value={it.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)} />
                  <input className="input col-span-2" type="number" placeholder="Unit price" value={it.unit_price} onChange={(e) => setItem(i, "unit_price", e.target.value)} />
                  <span className="col-span-2 text-right text-[12px] font-semibold text-ink">{money(Number(it.quantity || 0) * Number(it.unit_price || 0))}</span>
                  <button onClick={() => setItems(items.filter((_, idx) => idx !== i))} className="col-span-1 grid place-items-center text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
          </div>

          <Grid2>
            <Field label="Discount (GHS)"><TextInput type="number" value={form.discount} onChange={set("discount")} /></Field>
            <Field label="Tax (GHS)"><TextInput type="number" value={form.tax} onChange={set("tax")} /></Field>
          </Grid2>
          <div className="text-right text-sm">
            <p className="text-muted">Subtotal {money(subtotal)}</p>
            <p className="font-extrabold text-ink text-base mt-1">Total {money(total)}</p>
          </div>
          <Field label="Attachment (quote / PO document)"><FileUpload value={form.attachment_url} onChange={(url) => setForm((f) => ({ ...f, attachment_url: url }))} label="Upload document" /></Field>
          <Field label="Notes"><TextArea value={form.notes} onChange={set("notes")} /></Field>
        </div>
      </Modal>
    </div>
  );
}
