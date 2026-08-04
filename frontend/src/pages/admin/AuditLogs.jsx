import { useState } from "react";
import { useList } from "../../hooks/useApi";
import { exportCsv } from "../../utils/format";
import { PageHeader, Toolbar, DataTable, StatusChip } from "../../components/ui";

export default function AuditLogs() {
  const [q, setQ] = useState("");
  const [module, setModule] = useState("");
  const { rows, loading } = useList("/audit-logs", { q, module });

  return (
    <div>
      <PageHeader title="Audit Logs" subtitle="System activity trail across all modules" />

      <Toolbar q={q} setQ={setQ} placeholder="Search actor or action…"
        onExport={() => exportCsv("audit_logs", rows.map((r) => ({ actor: r.actor, action: r.action, module: r.module, entity: r.entity, details: r.details, at: r.created_at })))}
        filters={
          <select value={module} onChange={(e) => setModule(e.target.value)} className="input w-40">
            <option value="">All modules</option>
            {["finance", "inventory", "procurement", "hr"].map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
        }
      />

      <div className="card p-1">
        <DataTable loading={loading} rows={rows}
          columns={[
            { key: "created_at", label: "When", render: (r) => new Date(r.created_at).toLocaleString("en-GB") },
            { key: "actor", label: "Actor", render: (r) => <div><p className="font-semibold">{r.actor}</p><p className="text-[11px] text-muted">{r.actor_role}</p></div> },
            { key: "action", label: "Action", render: (r) => <StatusChip status={r.action} /> },
            { key: "module", label: "Module", render: (r) => <StatusChip status={r.module} /> },
            { key: "entity", label: "Entity", render: (r) => <span className="text-[12px]">{r.entity} {r.entity_id ? `· ${r.entity_id}` : ""}</span> },
            { key: "details", label: "Details" },
          ]}
        />
      </div>
    </div>
  );
}
