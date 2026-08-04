import { useState } from "react";
import { useList, save } from "../../hooks/useApi";
import { num, date, exportCsv } from "../../utils/format";
import { PageHeader, Toolbar, AddButton, DataTable, Modal, Field, TextInput, TextArea, Select, Grid2, StatusChip, FileUpload } from "../../components/ui";

/* Shared implementation for Stock In / Out / Transfer / Adjustment screens */
export default function StockMovementPage({ type, title, subtitle }) {
  const [q, setQ] = useState("");
  const { rows, loading, reload } = useList("/stock-movements", { type, q });
  const items = useList("/inv-items").rows;
  const warehouses = useList("/warehouses").rows;

  const [open, setOpen] = useState(false);
  const base = { item_id: "", quantity: "", from_warehouse_id: "", to_warehouse_id: "", unit_cost: "", reason: "", attachment_url: "", movement_date: new Date().toISOString().slice(0, 10) };
  const [form, setForm] = useState(base);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openNew = () => { setForm(base); setOpen(true); };
  const submit = async () => {
    if (!form.item_id || !form.quantity) return;
    if (await save("post", "/stock-movements", { ...form, type })) { setOpen(false); reload(); }
  };

  const needsFrom = type === "out" || type === "transfer" || type === "adjustment";
  const needsTo = type === "in" || type === "transfer";

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle}>
        <AddButton onClick={openNew} label={`Record ${title}`} />
      </PageHeader>

      <Toolbar q={q} setQ={setQ} placeholder="Search item or reference…"
        onExport={() => exportCsv(title.toLowerCase().replace(/\s+/g, "_"), rows.map((r) => ({ ref: r.ref, item: r.item_name, qty: r.quantity, date: r.movement_date, reason: r.reason })))} />

      <div className="card p-1">
        <DataTable loading={loading} rows={rows}
          columns={[
            { key: "ref", label: "Reference", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
            { key: "item_name", label: "Item", render: (r) => <span className="font-semibold">{r.item_name}</span> },
            { key: "quantity", label: "Qty", align: "right", render: (r) => num(r.quantity) },
            { key: "from_wh_name", label: "From", render: (r) => r.from_wh_name || "—" },
            { key: "to_wh_name", label: "To", render: (r) => r.to_wh_name || "—" },
            { key: "reason", label: "Reason", render: (r) => r.reason || "—" },
            { key: "movement_date", label: "Date", render: (r) => date(r.movement_date) },
            { key: "type", label: "Type", render: (r) => <StatusChip status={r.type} /> },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={`Record ${title}`}
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={submit}>Save</button></>}>
        <div className="space-y-4">
          <Field label="Item" required>
            <Select value={form.item_id} onChange={set("item_id")}>
              <option value="">Select item</option>
              {items.map((i) => <option key={i.id} value={i.id}>{i.name} ({num(i.quantity)} {i.unit})</option>)}
            </Select>
          </Field>
          <Grid2>
            <Field label={type === "adjustment" ? "Adjustment Qty (+/−)" : "Quantity"} required><TextInput type="number" value={form.quantity} onChange={set("quantity")} /></Field>
            <Field label="Unit Cost (GHS)"><TextInput type="number" value={form.unit_cost} onChange={set("unit_cost")} /></Field>
          </Grid2>
          <Grid2>
            {needsFrom && <Field label="From Warehouse"><Select value={form.from_warehouse_id} onChange={set("from_warehouse_id")}><option value="">—</option>{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</Select></Field>}
            {needsTo && <Field label="To Warehouse"><Select value={form.to_warehouse_id} onChange={set("to_warehouse_id")}><option value="">—</option>{warehouses.map((w) => <option key={w.id} value={w.id}>{w.name}</option>)}</Select></Field>}
          </Grid2>
          <Grid2>
            <Field label="Date"><TextInput type="date" value={form.movement_date} onChange={set("movement_date")} /></Field>
            {type === "in" && <Field label="Receipt / Attachment"><FileUpload value={form.attachment_url} onChange={(url) => setForm((f) => ({ ...f, attachment_url: url }))} /></Field>}
          </Grid2>
          <Field label="Reason / Notes"><TextArea value={form.reason} onChange={set("reason")} /></Field>
        </div>
      </Modal>
    </div>
  );
}
