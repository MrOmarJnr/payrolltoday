import { useState } from "react";
import { Megaphone, Plus, Trash2 } from "lucide-react";
import { date } from "../utils/format";
import { PageHeader, AddButton, Modal, Field, TextInput, TextArea, Select } from "../components/ui";

/* HR Announcements — interactive scaffold (in-session). Swap the local state
   for a /announcements endpoint when the backend is added. */
const seed = [
  { id: 1, title: "Q3 Town Hall", body: "All-staff town hall on Friday at 3pm in the main hall.", audience: "All Staff", created_at: "2026-08-01" },
  { id: 2, title: "New ERP Modules Live", body: "Finance, Inventory and Procurement modules are now available in the portal.", audience: "All Staff", created_at: "2026-08-04" },
  { id: 3, title: "IT Maintenance", body: "Network maintenance this weekend; expect brief downtime Saturday night.", audience: "IT", created_at: "2026-08-03" },
];

export default function Announcements() {
  const [items, setItems] = useState(seed);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ title: "", body: "", audience: "All Staff" });
  const add = () => {
    if (!form.title) return;
    setItems([{ id: Date.now(), ...form, created_at: new Date().toISOString().slice(0, 10) }, ...items]);
    setForm({ title: "", body: "", audience: "All Staff" }); setOpen(false);
  };

  return (
    <div>
      <PageHeader title="Announcements" subtitle="Company-wide and targeted communications">
        <AddButton onClick={() => setOpen(true)} label="New Announcement" />
      </PageHeader>

      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
        {items.map((a) => (
          <div key={a.id} className="card p-5">
            <div className="flex items-start justify-between">
              <span className="grid place-items-center w-9 h-9 rounded-xl bg-brand-50 text-brand-600"><Megaphone size={17} /></span>
              <button onClick={() => setItems(items.filter((x) => x.id !== a.id))} className="text-muted hover:text-red-600"><Trash2 size={15} /></button>
            </div>
            <h3 className="font-extrabold text-ink mt-3">{a.title}</h3>
            <p className="text-sm text-muted mt-1.5 leading-relaxed">{a.body}</p>
            <div className="flex items-center justify-between mt-4 text-[11px] text-muted">
              <span className="chip bg-brand-50 text-brand-600">{a.audience}</span>
              <span>{date(a.created_at)}</span>
            </div>
          </div>
        ))}
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="New Announcement"
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={add}>Publish</button></>}>
        <div className="space-y-4">
          <Field label="Title" required><TextInput value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></Field>
          <Field label="Audience"><Select value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}><option>All Staff</option><option>Management</option><option>IT</option><option>Finance</option><option>Operations</option></Select></Field>
          <Field label="Message"><TextArea rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} /></Field>
        </div>
      </Modal>
    </div>
  );
}
