import { useState } from "react";
import { Check, X, Trash2, Pencil, CalendarClock } from "lucide-react";
import { useList, save } from "../hooks/useApi";
import { confirmDialog } from "../services/notify";
import { date } from "../utils/format";
import {
  PageHeader, Kpi, Toolbar, AddButton, DataTable, StatusChip, Modal, Field, TextInput, TextArea, Select, Grid2,
} from "../components/ui";

const LEAVE_TYPES = ["Annual", "Sick", "Casual", "Maternity", "Paternity", "Unpaid", "Other"];
const empty = { employee_id: "", leave_type: "Annual", start_date: "", end_date: "", reason: "" };

export default function Leave() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("");
  const { rows, loading, reload } = useList("/leave", { q, status });
  const employees = useList("/employees").rows;

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const [editing, setEditing] = useState(null);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const openNew = () => { setForm(empty); setEditing(null); setOpen(true); };
  const openEdit = (r) => {
    setForm({
      employee_id: r.employee_id, leave_type: r.leave_type,
      start_date: (r.start_date || "").slice(0, 10), end_date: (r.end_date || "").slice(0, 10),
      reason: r.reason || "",
    });
    setEditing(r.id); setOpen(true);
  };

  const submit = async () => {
    if (!form.employee_id || !form.start_date || !form.end_date) return;
    const ok = editing ? await save("put", `/leave/${editing}`, form) : await save("post", "/leave", form);
    if (ok) { setOpen(false); reload(); }
  };
  const setStatusFor = async (r, s) => { if (await save("post", `/leave/${r.id}/status`, { status: s })) reload(); };
  const remove = async (r) => { if (await confirmDialog("Delete this leave record?") && await save("delete", `/leave/${r.id}`)) reload(); };

  const today = new Date().toISOString().slice(0, 10);
  const onLeaveToday = rows.filter((r) => r.status === "approved" && r.start_date?.slice(0, 10) <= today && r.end_date?.slice(0, 10) >= today).length;
  const pending = rows.filter((r) => r.status === "pending").length;
  const thisMonth = new Date().toISOString().slice(0, 7);
  const approvedThisMonth = rows.filter((r) => r.status === "approved" && (r.approval_date || "").slice(0, 7) === thisMonth).length;

  return (
    <div>
      <PageHeader title="Leave">
        <AddButton onClick={openNew} label="Log Leave" />
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Kpi label="On Leave Today" value={onLeaveToday} icon={CalendarClock} tone="brand" />
        <Kpi label="Pending" value={pending} icon={CalendarClock} tone="amber" />
        <Kpi label="Approved (Month)" value={approvedThisMonth} icon={CalendarClock} tone="green" />
        <Kpi label="Total Records" value={rows.length} icon={CalendarClock} tone="cyan" />
      </div>

      <Toolbar
        q={q} setQ={setQ}
        filters={
          <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
            <option value="">All statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </Select>
        }
      />

      <div className="card p-1">
        <DataTable
          loading={loading} rows={rows}
          empty="No leave records yet. HR can log one with “Log Leave”."
          columns={[
            { key: "employee_name", label: "Employee", render: (r) => <div><p className="font-semibold">{r.employee_name || "—"}</p><p className="text-[11px] text-muted">{r.department_name || "—"}</p></div> },
            { key: "leave_type", label: "Type" },
            { key: "start_date", label: "From", render: (r) => date(r.start_date) },
            { key: "end_date", label: "To", render: (r) => date(r.end_date) },
            { key: "days", label: "Days", align: "right" },
            { key: "status", label: "Status", render: (r) => <div><StatusChip status={r.status} />{r.approval_date && r.status !== "pending" && <p className="text-[10px] text-muted mt-0.5">by {r.approved_by} · {date(r.approval_date)}</p>}</div> },
            {
              key: "actions", label: "", align: "right", render: (r) => (
                <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                  {r.status === "pending" && <>
                    <button title="Approve" onClick={() => setStatusFor(r, "approved")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><Check size={15} /></button>
                    <button title="Reject" onClick={() => setStatusFor(r, "rejected")} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><X size={15} /></button>
                  </>}
                  <button title="Edit" onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-canvas text-muted"><Pencil size={15} /></button>
                  <button title="Delete" onClick={() => remove(r)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? "Edit Leave Record" : "Log Leave"}
        footer={<>
          <button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button>
          <button className="btn-primary" onClick={submit}>{editing ? "Save changes" : "Create record"}</button>
        </>}>
        <div className="space-y-4">
          <Field label="Employee" required>
            <Select value={form.employee_id} onChange={set("employee_id")}>
              <option value="">Select employee</option>
              {employees.map((e) => <option key={e.id} value={e.id}>{e.first_name} {e.last_name}</option>)}
            </Select>
          </Field>
          <Grid2>
            <Field label="Leave Type" required>
              <Select value={form.leave_type} onChange={set("leave_type")}>
                {LEAVE_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
          </Grid2>
          <Grid2>
            <Field label="From" required><TextInput type="date" value={form.start_date} onChange={set("start_date")} /></Field>
            <Field label="To" required><TextInput type="date" value={form.end_date} onChange={set("end_date")} /></Field>
          </Grid2>
          <Field label="Reason"><TextArea value={form.reason} onChange={set("reason")} /></Field>
        </div>
      </Modal>
    </div>
  );
}
