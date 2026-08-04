import { useState } from "react";
import { Pencil, KeyRound, Power } from "lucide-react";
import { useList, save } from "../../hooks/useApi";
import { confirmDialog } from "../../services/notify";
import { date } from "../../utils/format";
import { PageHeader, Toolbar, AddButton, DataTable, StatusChip, Modal, Field, TextInput, Select, Grid2 } from "../../components/ui";

const empty = { full_name: "", username: "", email: "", password: "", role_id: "" };

export default function Users() {
  const { rows, loading, reload } = useList("/users");
  const roles = useList("/roles").rows;
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(empty);
  const [pwOpen, setPwOpen] = useState(null);
  const [pw, setPw] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openNew = () => { setForm(empty); setEditing(null); setOpen(true); };
  const openEdit = (r) => { setForm({ full_name: r.full_name, username: r.username, email: r.email, role_id: r.role_id }); setEditing(r.id); setOpen(true); };
  const submit = async () => {
    if (!form.full_name || !form.username || !form.role_id) return;
    const ok = editing ? await save("put", `/users/${editing}`, form) : await save("post", "/users", form);
    if (ok) { setOpen(false); reload(); }
  };
  const resetPw = async () => { if (pw && await save("put", `/users/${pwOpen.id}/reset-password`, { password: pw })) { setPwOpen(null); setPw(""); } };
  const toggle = async (r) => { if (await confirmDialog(`${r.is_active ? "Disable" : "Enable"} ${r.full_name}?`, { danger: r.is_active }) && await save("put", `/users/${r.id}/toggle-status`)) reload(); };

  return (
    <div>
      <PageHeader title="Users" subtitle="Platform accounts and role assignments">
        <AddButton onClick={openNew} label="New User" />
      </PageHeader>

      <Toolbar />
      <div className="card p-1">
        <DataTable loading={loading} rows={rows}
          columns={[
            { key: "full_name", label: "Name", render: (r) => <div><p className="font-semibold">{r.full_name}</p><p className="text-[11px] text-muted">@{r.username}</p></div> },
            { key: "email", label: "Email" },
            { key: "role_name", label: "Role", render: (r) => <StatusChip status={r.role_name || "—"} /> },
            { key: "last_login", label: "Last Login", render: (r) => r.last_login ? date(r.last_login) : "Never" },
            { key: "is_active", label: "Status", render: (r) => <StatusChip status={r.is_active ? "active" : "inactive"} /> },
            {
              key: "a", label: "", align: "right", render: (r) => (
                <div className="flex justify-end gap-1">
                  <button title="Edit" onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-canvas text-muted"><Pencil size={15} /></button>
                  <button title="Reset password" onClick={() => setPwOpen(r)} className="p-1.5 rounded-lg hover:bg-canvas text-muted"><KeyRound size={15} /></button>
                  <button title="Toggle active" onClick={() => toggle(r)} className={`p-1.5 rounded-lg hover:bg-canvas ${r.is_active ? "text-emerald-600" : "text-red-500"}`}><Power size={15} /></button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit User" : "New User"}
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={submit}>{editing ? "Save" : "Create"}</button></>}>
        <div className="space-y-4">
          <Field label="Full Name" required><TextInput value={form.full_name} onChange={set("full_name")} /></Field>
          <Grid2>
            <Field label="Username" required><TextInput value={form.username} onChange={set("username")} /></Field>
            <Field label="Email"><TextInput type="email" value={form.email} onChange={set("email")} /></Field>
          </Grid2>
          <Grid2>
            <Field label="Role" required><Select value={form.role_id} onChange={set("role_id")}><option value="">Select role</option>{roles.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}</Select></Field>
            {!editing && <Field label="Password" required><TextInput type="password" value={form.password} onChange={set("password")} /></Field>}
          </Grid2>
        </div>
      </Modal>

      <Modal open={!!pwOpen} onClose={() => setPwOpen(null)} title={`Reset password — ${pwOpen?.full_name || ""}`}
        footer={<><button className="btn-ghost" onClick={() => setPwOpen(null)}>Cancel</button><button className="btn-primary" onClick={resetPw}>Reset</button></>}>
        <Field label="New Password"><TextInput type="password" value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
      </Modal>
    </div>
  );
}
