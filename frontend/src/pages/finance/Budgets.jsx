import { useState } from "react";
import { Trash2, Pencil, AlertTriangle } from "lucide-react";
import { useList, save } from "../../hooks/useApi";
import { confirmDialog } from "../../services/notify";
import { money, exportCsv } from "../../utils/format";
import { PageHeader, Toolbar, AddButton, DataTable, StatusChip, Modal, Field, TextInput, TextArea, Select, Grid2, Progress } from "../../components/ui";

const empty = { name: "", fiscal_year: String(new Date().getFullYear()), scope: "department", department_id: "", category_id: "", project: "", period: "annual", allocated: "", spent: "0", status: "active", notes: "" };

export default function Budgets() {
  const [q, setQ] = useState("");
  const { rows, loading, reload } = useList("/budgets", { q });
  const depts = useList("/departments").rows;
  const cats = useList("/expense-categories").rows;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openNew = () => { setForm(empty); setEditing(null); setOpen(true); };
  const openEdit = (r) => { setForm({ ...r }); setEditing(r.id); setOpen(true); };
  const submit = async () => {
    if (!form.name || !form.allocated) return;
    const ok = editing ? await save("put", `/budgets/${editing}`, form) : await save("post", "/budgets", form);
    if (ok) { setOpen(false); reload(); }
  };
  const remove = async (r) => { if (await confirmDialog(`Delete budget "${r.name}"?`) && await save("delete", `/budgets/${r.id}`)) reload(); };

  const totalAlloc = rows.reduce((s, r) => s + Number(r.allocated || 0), 0);
  const totalSpent = rows.reduce((s, r) => s + Number(r.spent || 0), 0);
  const appliesTo = (r) => {
    if (r.scope === "department") return depts.find((d) => d.id === r.department_id)?.name || "—";
    if (r.scope === "category") return cats.find((c) => c.id === r.category_id)?.name || "—";
    return r.project || "—";
  };

  return (
    <div>
      <PageHeader title="Budget Management" subtitle={`Allocated ${money(totalAlloc)} · Spent ${money(totalSpent)} · Remaining ${money(totalAlloc - totalSpent)}`}>
        <AddButton onClick={openNew} label="New Budget" />
      </PageHeader>

      <Toolbar q={q} setQ={setQ} placeholder="Search budgets…"
        onExport={() => exportCsv("budgets", rows.map((r) => ({ name: r.name, year: r.fiscal_year, allocated: r.allocated, spent: r.spent, remaining: r.allocated - r.spent })))} />

      <div className="card p-1">
        <DataTable loading={loading} rows={rows}
          columns={[
            { key: "name", label: "Budget", render: (r) => <div><p className="font-semibold">{r.name}</p><p className="text-[11px] text-muted uppercase">{r.scope} · {r.fiscal_year}</p></div> },
            { key: "applies", label: "Applies To", render: (r) => appliesTo(r) },
            { key: "allocated", label: "Allocated", align: "right", render: (r) => money(r.allocated) },
            { key: "spent", label: "Spent", align: "right", render: (r) => money(r.spent) },
            { key: "remaining", label: "Remaining", align: "right", render: (r) => <span className={Number(r.allocated - r.spent) < 0 ? "text-red-600 font-bold" : "font-bold"}>{money(r.allocated - r.spent)}</span> },
            {
              key: "util", label: "Utilization", render: (r) => {
                const pct = r.allocated ? Math.round((r.spent / r.allocated) * 100) : 0;
                return <div className="w-40"><div className="flex items-center gap-1.5 mb-1">{pct >= 100 && <AlertTriangle size={12} className="text-red-500" />}<span className="text-[11px] text-muted">{pct}%</span></div><Progress value={r.spent} max={r.allocated} /></div>;
              },
            },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
            {
              key: "a", label: "", align: "right", render: (r) => (
                <div className="flex justify-end gap-1">
                  <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-canvas text-muted"><Pencil size={15} /></button>
                  <button onClick={() => remove(r)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Budget" : "New Budget"}
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={submit}>{editing ? "Save" : "Create"}</button></>}>
        <div className="space-y-4">
          <Field label="Budget Name" required><TextInput value={form.name} onChange={set("name")} placeholder="e.g. IT Department 2026" /></Field>
          <Grid2>
            <Field label="Fiscal Year"><TextInput value={form.fiscal_year} onChange={set("fiscal_year")} /></Field>
            <Field label="Scope"><Select value={form.scope} onChange={set("scope")}><option value="department">Department</option><option value="category">Category</option><option value="project">Project</option></Select></Field>
          </Grid2>
          <Grid2>
            <Field label="Department"><Select value={form.department_id || ""} onChange={set("department_id")}><option value="">—</option>{depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select></Field>
            <Field label="Category"><Select value={form.category_id || ""} onChange={set("category_id")}><option value="">—</option>{cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</Select></Field>
          </Grid2>
          <Grid2>
            <Field label="Allocated (GHS)" required><TextInput type="number" value={form.allocated} onChange={set("allocated")} /></Field>
            <Field label="Period"><Select value={form.period} onChange={set("period")}><option value="annual">Annual</option><option value="quarterly">Quarterly</option><option value="monthly">Monthly</option></Select></Field>
          </Grid2>
          <Field label="Notes"><TextArea value={form.notes || ""} onChange={set("notes")} /></Field>
        </div>
      </Modal>
    </div>
  );
}
