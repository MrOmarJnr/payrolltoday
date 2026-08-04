/*
|--------------------------------------------------------------------------
| CrudPage — configurable list + create/edit/delete page
|--------------------------------------------------------------------------
| Powers the many ERP master-data screens with one consistent implementation.
|
| Props:
|   title, subtitle, endpoint, addLabel
|   columns : DataTable columns (an actions column is appended automatically)
|   fields  : [{ name, label, type, options, required, half, placeholder }]
|             type ∈ text | number | date | textarea | select
|             options: [{ value, label }] OR { endpoint, value, label } to load
|   search  : boolean (enables ?q=)
|   filters : [{ name, label, options:[{value,label}] }]
|   exportRow : (row) => flat object for CSV (optional)
|   defaults : initial form values (optional)
|   canEdit, canDelete : booleans (default true)
*/
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useList, save } from "../hooks/useApi";
import { confirmDialog } from "../services/notify";
import { exportCsv } from "../utils/format";
import { PageHeader, Toolbar, AddButton, DataTable, Modal, Field, TextInput, TextArea, Select, Grid2 } from "./ui";

function OptionSelect({ field, value, onChange }) {
  // static options
  if (Array.isArray(field.options)) {
    return (
      <Select value={value ?? ""} onChange={onChange}>
        <option value="">{field.placeholder || "Select…"}</option>
        {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </Select>
    );
  }
  // remote options
  const { rows } = useList(field.options.endpoint);
  return (
    <Select value={value ?? ""} onChange={onChange}>
      <option value="">{field.placeholder || "Select…"}</option>
      {rows.map((r) => <option key={r[field.options.value]} value={r[field.options.value]}>{r[field.options.label]}</option>)}
    </Select>
  );
}

export default function CrudPage({
  title, subtitle, endpoint, addLabel = "New", columns, fields = [],
  search = true, filters = [], exportRow, defaults = {}, canEdit = true, canDelete = true, headerExtra,
}) {
  const [q, setQ] = useState("");
  const [filterVals, setFilterVals] = useState({});
  const params = { ...(search ? { q } : {}), ...filterVals };
  const { rows, loading, reload } = useList(endpoint, params);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(defaults);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const openNew = () => { setForm(defaults); setEditing(null); setOpen(true); };
  const openEdit = (r) => {
    const f = { ...r };
    fields.forEach((fl) => { if (fl.type === "date" && f[fl.name]) f[fl.name] = String(f[fl.name]).slice(0, 10); });
    setForm(f); setEditing(r.id); setOpen(true);
  };
  const submit = async () => {
    for (const fl of fields) if (fl.required && !form[fl.name]) return;
    const ok = editing ? await save("put", `${endpoint}/${editing}`, form) : await save("post", endpoint, form);
    if (ok) { setOpen(false); reload(); }
  };
  const remove = async (r) => {
    if (await confirmDialog("Delete this record? This cannot be undone.") && await save("delete", `${endpoint}/${r.id}`)) reload();
  };

  const allColumns = [
    ...columns,
    ...((canEdit || canDelete) ? [{
      key: "__a", label: "", align: "right", render: (r) => (
        <div className="flex justify-end gap-1">
          {canEdit && <button onClick={() => openEdit(r)} className="p-1.5 rounded-lg hover:bg-canvas text-muted"><Pencil size={15} /></button>}
          {canDelete && <button onClick={() => remove(r)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>}
        </div>
      ),
    }] : []),
  ];

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle || `${rows.length} records`}>
        {headerExtra}
        <AddButton onClick={openNew} label={addLabel} />
      </PageHeader>

      <Toolbar
        q={search ? q : undefined} setQ={search ? setQ : undefined}
        onExport={exportRow ? () => exportCsv(title.toLowerCase().replace(/\s+/g, "_"), rows.map(exportRow)) : undefined}
        filters={filters.map((f) => (
          <Select key={f.name} value={filterVals[f.name] || ""} onChange={(e) => setFilterVals({ ...filterVals, [f.name]: e.target.value })} className="w-40">
            <option value="">{f.label}</option>
            {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </Select>
        ))}
      />

      <div className="card p-1">
        <DataTable loading={loading} rows={rows} columns={allColumns} />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title={editing ? `Edit ${title}` : addLabel} wide={fields.length > 6}
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={submit}>{editing ? "Save changes" : "Create"}</button></>}>
        <div className="grid sm:grid-cols-2 gap-4">
          {fields.map((fl) => (
            <div key={fl.name} className={fl.half ? "" : "sm:col-span-2"}>
              <Field label={fl.label} required={fl.required}>
                {fl.type === "textarea" ? <TextArea value={form[fl.name] || ""} onChange={set(fl.name)} placeholder={fl.placeholder} />
                  : fl.type === "select" ? <OptionSelect field={fl} value={form[fl.name]} onChange={set(fl.name)} />
                    : <TextInput type={fl.type || "text"} value={form[fl.name] ?? ""} onChange={set(fl.name)} placeholder={fl.placeholder} />}
              </Field>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
