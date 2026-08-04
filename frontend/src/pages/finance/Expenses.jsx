import { useState } from "react";
import { Check, X, CreditCard, Trash2, Pencil } from "lucide-react";
import { useList, save } from "../../hooks/useApi";
import { confirmDialog } from "../../services/notify";
import { money, date, exportCsv } from "../../utils/format";
import {
  PageHeader, Toolbar, AddButton, DataTable, StatusChip, Modal, Field, TextInput, TextArea, Select, Grid2, FileUpload,
} from "../../components/ui";

const STATUSES = ["draft", "pending", "approved", "rejected", "paid"];
const METHODS = ["bank_transfer", "cash", "card", "petty_cash", "reimbursement", "cheque"];
const empty = { category_id: "", department_id: "", vendor_id: "", project: "", payment_method: "bank_transfer", amount: "", tax: "", expense_date: "", status: "pending", approval_date: "", receipt_url: "", notes: "" };

export default function Expenses() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const { rows, loading, reload } = useList("/expenses", { q, status });
  const cats = useList("/expense-categories").rows;
  const depts = useList("/departments").rows;
  const vendors = useList("/suppliers").rows;

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const openNew = () => { setForm({ ...empty, expense_date: new Date().toISOString().slice(0, 10) }); setEditing(null); setOpen(true); };
  const openEdit = (r) => { setForm({ ...r, expense_date: (r.expense_date || "").slice(0, 10) }); setEditing(r.id); setOpen(true); };

  const submit = async () => {
    if (!form.category_id || !form.amount) return;
    const ok = editing ? await save("put", `/expenses/${editing}`, form) : await save("post", "/expenses", form);
    if (ok) { setOpen(false); reload(); }
  };
  const setStatusFor = async (r, s) => { if (await save("post", `/expenses/${r.id}/status`, { status: s })) reload(); };
  const remove = async (r) => { if (await confirmDialog(`Delete expense ${r.ref}?`) && await save("delete", `/expenses/${r.id}`)) reload(); };

  const total = rows.reduce((s, r) => s + Number(r.total || 0), 0);

  return (
    <div>
      <PageHeader title="Expenses" subtitle={`${rows.length} records · ${money(total)} total`}>
        <AddButton onClick={openNew} label="New Expense" />
      </PageHeader>

      <Toolbar
        q={q} setQ={setQ} placeholder="Search reference or notes…"
        onExport={() => exportCsv("expenses", rows.map((r) => ({ ref: r.ref, category: r.category_name, dept: r.department_name, date: r.expense_date, amount: r.total, status: r.status })))}
        filters={
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
            <option value="">All statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </Select>
        }
      />

      <div className="card p-1">
        <DataTable
          loading={loading} rows={rows}
          columns={[
            { key: "ref", label: "Reference", render: (r) => <span className="font-semibold">{r.ref}</span> },
            { key: "category_name", label: "Category" },
            { key: "department_name", label: "Department", render: (r) => r.department_name || "—" },
            { key: "vendor_name", label: "Vendor", render: (r) => r.vendor_name || "—" },
            { key: "expense_date", label: "Date", render: (r) => date(r.expense_date) },
            { key: "total", label: "Amount", align: "right", render: (r) => <span className="font-bold">{money(r.total)}</span> },
            { key: "status", label: "Status", render: (r) => <div><StatusChip status={r.status} />{r.approval_date && ["approved", "paid"].includes(r.status) && <p className="text-[10px] text-muted mt-0.5">{date(r.approval_date)}</p>}</div> },
            {
              key: "actions", label: "", align: "right", render: (r) => (
                <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  {r.status === "pending" && <>
                    <button title="Approve" onClick={() => setStatusFor(r, "approved")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><Check size={15} /></button>
                    <button title="Reject" onClick={() => setStatusFor(r, "rejected")} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><X size={15} /></button>
                  </>}
                  {r.status === "approved" && <button title="Mark paid" onClick={() => setStatusFor(r, "paid")} className="p-1.5 rounded-lg hover:bg-brand-50 text-brand-600"><CreditCard size={15} /></button>}
                  <button title="Edit" onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-canvas text-muted"><Pencil size={15} /></button>
                  <button title="Delete" onClick={() => remove(r)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Expense" : "New Expense"}
        footer={<>
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={submit}>{editing ? "Save changes" : "Create expense"}</button>
        </>}>
        <div className="space-y-4">
          <Grid2>
            <Field label="Category" required>
              <Select value={form.category_id} onChange={set("category_id")}>
                <option value="">Select category</option>
                {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </Select>
            </Field>
            <Field label="Department">
              <Select value={form.department_id || ""} onChange={set("department_id")}>
                <option value="">Unassigned</option>
                {depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
              </Select>
            </Field>
          </Grid2>
          <Grid2>
            <Field label="Vendor">
              <Select value={form.vendor_id || ""} onChange={set("vendor_id")}>
                <option value="">None</option>
                {vendors.map((v) => <option key={v.id} value={v.id}>{v.company}</option>)}
              </Select>
            </Field>
            <Field label="Payment Method">
              <Select value={form.payment_method} onChange={set("payment_method")}>
                {METHODS.map((m) => <option key={m} value={m}>{m.replace(/_/g, " ")}</option>)}
              </Select>
            </Field>
          </Grid2>
          <Grid2>
            <Field label="Amount (GHS)" required><TextInput type="number" value={form.amount} onChange={set("amount")} placeholder="0.00" /></Field>
            <Field label="Tax (GHS)"><TextInput type="number" value={form.tax} onChange={set("tax")} placeholder="0.00" /></Field>
          </Grid2>
          <Grid2>
            <Field label="Expense Date"><TextInput type="date" value={form.expense_date} onChange={set("expense_date")} /></Field>
            <Field label="Status">
              <Select value={form.status} onChange={set("status")}>{STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}</Select>
            </Field>
          </Grid2>
          {["approved", "paid"].includes(form.status) && (
            <Field label="Approval Date"><TextInput type="date" value={(form.approval_date || "").slice(0, 10)} onChange={set("approval_date")} /></Field>
          )}
          <Field label="Project"><TextInput value={form.project || ""} onChange={set("project")} placeholder="Optional project / cost centre" /></Field>
          <Field label="Receipt / Invoice"><FileUpload value={form.receipt_url} onChange={(url) => setForm((f) => ({ ...f, receipt_url: url }))} /></Field>
          <Field label="Notes"><TextArea value={form.notes || ""} onChange={set("notes")} /></Field>
        </div>
      </Modal>
    </div>
  );
}
