import { useState } from "react";
import { Fuel, Gauge, TrendingUp, Clock, Check, X, Trash2 } from "lucide-react";
import { useList, useData, save } from "../../hooks/useApi";
import { confirmDialog } from "../../services/notify";
import { money, num, date, exportCsv } from "../../utils/format";
import {
  PageHeader, Toolbar, AddButton, DataTable, StatusChip, Modal, Field, TextInput, TextArea, Select, Grid2, Kpi, Section, LineChart, BarList, FileUpload,
} from "../../components/ui";

const empty = { vehicle_id: "", vehicle: "", reg_no: "", driver: "", department_id: "", station: "", fuel_type: "Diesel", litres: "", price_per_litre: "", prev_odometer: "", current_odometer: "", receipt_url: "", log_date: "", status: "pending", notes: "" };

export default function FuelManagement() {
  const [q, setQ] = useState("");
  const { rows, loading, reload } = useList("/fuel", { q });
  const { data: dash, reload: reloadDash } = useData("/dashboards/fuel");
  const vehicles = useList("/vehicles").rows;
  const depts = useList("/departments").rows;
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(empty);
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const k = dash?.kpis || {};

  // Selecting a vehicle auto-populates its reg number & department. "other" = manual.
  const chooseVehicle = (e) => {
    const id = e.target.value;
    if (id === "other" || id === "") {
      setForm({ ...form, vehicle_id: id, reg_no: "", vehicle: "" });
    } else {
      const v = vehicles.find((x) => x.id === id);
      setForm({ ...form, vehicle_id: id, vehicle: v?.name || "", reg_no: v?.reg_no || "", department_id: v?.department_id || form.department_id, fuel_type: v?.fuel_type || form.fuel_type });
    }
  };

  const litres = Number(form.litres || 0);
  const distance = Number(form.current_odometer || 0) - Number(form.prev_odometer || 0);
  const efficiency = litres > 0 && distance > 0 ? (distance / litres).toFixed(2) : null;

  const openNew = () => { setForm({ ...empty, log_date: new Date().toISOString().slice(0, 10) }); setOpen(true); };
  const submit = async () => {
    if ((!form.vehicle_id) || !form.litres) return;
    if (await save("post", "/fuel", form)) { setOpen(false); reload(); reloadDash(); }
  };
  const decide = async (r, s) => { if (await save("post", `/fuel/${r.id}/status`, { status: s })) { reload(); reloadDash(); } };
  const remove = async (r) => { if (await confirmDialog(`Delete fuel log ${r.ref}?`) && await save("delete", `/fuel/${r.id}`)) { reload(); reloadDash(); } };

  const isOther = form.vehicle_id === "other";

  return (
    <div>
      <PageHeader title="Fuel Management" subtitle="Vehicle fuel consumption, cost tracking and approvals">
        <AddButton onClick={openNew} label="Log Fuel" />
      </PageHeader>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Kpi label="This Month" value={money(k.monthCost)} icon={Fuel} tone="brand" />
        <Kpi label="This Year" value={money(k.yearCost)} icon={TrendingUp} tone="cyan" />
        <Kpi label="Average / Fill" value={money(k.avgCost)} icon={Gauge} tone="violet" />
        <Kpi label="Pending Approvals" value={k.pending ?? 0} icon={Clock} tone="amber" />
      </div>

      <div className="grid lg:grid-cols-3 gap-4 mb-4">
        <Section title="Fuel Cost Trend" subtitle="Last 6 months" className="lg:col-span-2"><LineChart data={dash?.trend || []} /></Section>
        <Section title="Cost by Vehicle"><BarList data={dash?.byVehicle || []} /></Section>
      </div>

      <Toolbar q={q} setQ={setQ} placeholder="Search vehicle, reg or driver…"
        onExport={() => exportCsv("fuel_logs", rows.map((r) => ({ ref: r.ref, vehicle: r.vehicle, reg: r.reg_no, litres: r.litres, distance: r.distance, km_per_litre: r.km_per_litre, amount: r.amount, date: r.log_date, status: r.status })))} />

      <div className="card p-1">
        <DataTable loading={loading} rows={rows}
          columns={[
            { key: "vehicle", label: "Vehicle", render: (r) => <div><p className="font-semibold">{r.vehicle || "—"}</p><p className="text-[11px] text-muted">{r.reg_no || "N/A"}</p></div> },
            { key: "driver", label: "Driver" },
            { key: "litres", label: "Litres", align: "right", render: (r) => num(r.litres, 1) },
            { key: "distance", label: "Distance (km)", align: "right", render: (r) => r.distance > 0 ? num(r.distance) : "—" },
            { key: "km_per_litre", label: "km / L", align: "right", render: (r) => r.km_per_litre ? <span className="font-semibold">{num(r.km_per_litre, 2)}</span> : "—" },
            { key: "amount", label: "Amount", align: "right", render: (r) => <span className="font-bold">{money(r.amount)}</span> },
            { key: "log_date", label: "Date", render: (r) => date(r.log_date) },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
            {
              key: "a", label: "", align: "right", render: (r) => (
                <div className="flex justify-end gap-1">
                  {r.status === "pending" && <>
                    <button onClick={() => decide(r, "approved")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><Check size={15} /></button>
                    <button onClick={() => decide(r, "rejected")} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><X size={15} /></button>
                  </>}
                  <button onClick={() => remove(r)} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><Trash2 size={15} /></button>
                </div>
              ),
            },
          ]}
        />
      </div>

      <Modal open={open} onClose={() => setOpen(false)} title="Log Fuel Purchase" wide
        footer={<><button className="btn-ghost" onClick={() => setOpen(false)}>Cancel</button><button className="btn-primary" onClick={submit}>Save log</button></>}>
        <div className="space-y-4">
          <Grid2>
            <Field label="Vehicle" required>
              <Select value={form.vehicle_id} onChange={chooseVehicle}>
                <option value="">Select vehicle</option>
                {vehicles.map((v) => <option key={v.id} value={v.id}>{v.name} {v.reg_no ? `(${v.reg_no})` : ""}</option>)}
                <option value="other">Other (Genset / equipment)</option>
              </Select>
            </Field>
            <Field label="Registration Number">
              <TextInput value={form.reg_no} onChange={set("reg_no")} placeholder={isOther ? "N/A" : "auto"} disabled={!isOther} />
            </Field>
          </Grid2>
          {isOther && (
            <Field label="Description (what was fuelled)"><TextInput value={form.vehicle} onChange={set("vehicle")} placeholder="e.g. Generator - HQ" /></Field>
          )}
          <Grid2>
            <Field label="Driver / Operator"><TextInput value={form.driver} onChange={set("driver")} /></Field>
            <Field label="Department">
              <Select value={form.department_id} onChange={set("department_id")}><option value="">Unassigned</option>{depts.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</Select>
            </Field>
          </Grid2>
          <Grid2>
            <Field label="Fuel Station"><TextInput value={form.station} onChange={set("station")} /></Field>
            <Field label="Fuel Type"><Select value={form.fuel_type} onChange={set("fuel_type")}><option>Petrol</option><option>Diesel</option><option>LPG</option></Select></Field>
          </Grid2>
          <Grid2>
            <Field label="Litres" required><TextInput type="number" value={form.litres} onChange={set("litres")} /></Field>
            <Field label="Price / Litre (GHS)"><TextInput type="number" value={form.price_per_litre} onChange={set("price_per_litre")} /></Field>
          </Grid2>
          <Grid2>
            <Field label="Previous Odometer (km)"><TextInput type="number" value={form.prev_odometer} onChange={set("prev_odometer")} /></Field>
            <Field label="Current Odometer (km)"><TextInput type="number" value={form.current_odometer} onChange={set("current_odometer")} /></Field>
          </Grid2>
          {efficiency && (
            <div className="rounded-xl bg-brand-50 text-brand-700 px-4 py-2.5 text-[13px] font-semibold">
              Distance since last fill: {num(distance)} km · Consumption: {efficiency} km per litre
            </div>
          )}
          <Grid2>
            <Field label="Date"><TextInput type="date" value={form.log_date} onChange={set("log_date")} /></Field>
            <Field label="Receipt"><FileUpload value={form.receipt_url} onChange={(url) => setForm((f) => ({ ...f, receipt_url: url }))} /></Field>
          </Grid2>
          <Field label="Notes"><TextArea value={form.notes} onChange={set("notes")} /></Field>
        </div>
      </Modal>
    </div>
  );
}
