import { useState } from "react";
import { Plus, Trash2, Check, X } from "lucide-react";
import { useList, save } from "../../hooks/useApi";
import { confirmDialog } from "../../services/notify";
import { money, date, num } from "../../utils/format";
import { PageHeader, Toolbar, AddButton, DataTable, StatusChip, Modal, Field, TextInput, TextArea, Select, Grid2, FileUpload } from "../../components/ui";

const empty = { title: "", requested_by: "", department_id: "", priority: "normal", needed_by: "", justification: "", status: "submitted", attachment_url: "" };
const blankItem = { description: "", quantity: 1, unit: "pcs", est_price: 0 };

export default function PurchaseRequests() {
  const [q, setQ] = useState("");
  const { rows, loading, reload } = useList("/purchase-requests", { q });
  const depts = useList("/departments").rows;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [items, setItems] = useState([{ ...blankItem }]);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openNew = () => { setForm({ ...empty, needed_by: "" }); setItems([{ ...blankItem }]); setOpen(true); };
  const setItem = (i, k, v) => setItems(items.map((it, idx) => (idx === i ? { ...it, [k]: v } : it)));
  const addItem = () => setItems([...items, { ...blankItem }]);
  const rmItem = (i) => setItems(items.filter((_, idx) => idx !== i));
  const total = items.reduce((s, it) => s + Number(it.quantity || 0) * Number(it.est_price || 0), 0);

  const submit = async () => {
    if (!form.title) return;
    if (await save("post", "/purchase-requests", { ...form, items })) { setOpen(false); reload(); }
  };
  const decide = async (r, s) => { if (await save("post", `/purchase-requests/${r.id}/status`, { status: s })) reload(); };
  const remove = async (r) => { if (await confirmDialog(`Delete request ${r.ref}?`) && await save("delete", `/purchase-requests/${r.id}`)) reload(); };

  return (
    <div>
      <PageHeader title="Purchase Requests" subtitle="Employee purchase requests through approval to PO">
        <AddButton onClick={openNew} label="New Request" />
      </PageHeader>

      <Toolbar q={q} setQ={setQ} placeholder="Search requests…" />

      <div className="card p-1">
        <DataTable loading={loading} rows={rows}
          columns={[
            { key: "ref", label: "Ref", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
            { key: "title", label: "Title", render: (r) => <span className="font-semibold">{r.title}</span> },
            { key: "department_name", label: "Department", render: (r) => r.department_name || "—" },
            { key: "priority", label: "Priority", render: (r) => <StatusChip status={r.priority} /> },
            { key: "item_count", label: "Items", align: "right", render: (r) => num(r.item_count) },
            { key: "total_est", label: "Est. Total", align: "right", render: (r) => money(r.total_est) },
            { key: "needed_by", label: "Needed By", render: (r) => date(r.needed_by) },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
            {
              key: "a", label: "", align: "right", render: (r) => (
                <div className="flex justify-end gap-1">
                  {["submitted", "draft"].includes(r.status) && <>
                    <button title="Approve" onClick={() => decide(r, "approved")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><Check size={15} /></button>
                    <button title="Reject" onClick={() => decide(r, "rejected")} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><X size={15} /></button>
                  </>}
                  <button title="Delete" onClick={() => remove(r)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Purchase Request" wide
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={submit}>Submit request</button></>}>
        <div className="space-y-4">
          <Field label="Title" required><TextInput value={form.title} onChange={set("title")} placeholder="e.g. New laptops for Finance team" /></Field>
          <Grid2>
            <Field label="Requested By"><TextInput value={form.requested_by} onChange={set("requested_by")} /></Field>
            <Field label="Department"><Select value={form.department_id} onChange={set("department_id")}><option value="">—</option>{depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select></Field>
          </Grid2>
          <Grid2>
            <Field label="Priority"><Select value={form.priority} onChange={set("priority")}><option value="low">Low</option><option value="normal">Normal</option><option value="high">High</option><option value="urgent">Urgent</option></Select></Field>
            <Field label="Needed By"><TextInput type="date" value={form.needed_by} onChange={set("needed_by")} /></Field>
          </Grid2>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="label">Line Items</span>
              <button onClick={addItem} className="text-[12px] font-bold text-brand-600 inline-flex items-center gap-1"><Plus size={13} /> Add item</button>
            </div>
            <div className="space-y-2">
              {items.map((it, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-center">
                  <input className="input col-span-5" placeholder="Description" value={it.description} onChange={(e) => setItem(i, "description", e.target.value)} />
                  <input className="input col-span-2" type="number" placeholder="Qty" value={it.quantity} onChange={(e) => setItem(i, "quantity", e.target.value)} />
                  <input className="input col-span-2" placeholder="Unit" value={it.unit} onChange={(e) => setItem(i, "unit", e.target.value)} />
                  <input className="input col-span-2" type="number" placeholder="Est. price" value={it.est_price} onChange={(e) => setItem(i, "est_price", e.target.value)} />
                  <button onClick={() => rmItem(i)} className="col-span-1 grid place-items-center text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
                </div>
              ))}
            </div>
            <p className="text-right text-sm font-bold text-ink mt-2">Estimated total: {money(total)}</p>
          </div>

          <Field label="Justification"><TextArea value={form.justification} onChange={set("justification")} /></Field>
          <Field label="Attachment (optional)"><FileUpload value={form.attachment_url} onChange={(url) => setForm((f) => ({ ...f, attachment_url: url }))} label="Upload document" /></Field>
        </div>
      </Modal>
    </div>
  );
}
