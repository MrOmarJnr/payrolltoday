import { useState } from "react";
import { Check, X } from "lucide-react";
import { useList, save } from "../../hooks/useApi";
import { money, date } from "../../utils/format";
import { PageHeader, DataTable, StatusChip, Select } from "../../components/ui";

export default function Approvals() {
  const [status, setStatus] = useState("pending");
  const [moduleF, setModuleF] = useState("");
  const { rows, loading, reload } = useList("/approvals", { status, module: moduleF });

  const decide = async (r, decision) => {
    if (await save("post", `/approvals/${r.id}/decide`, { decision })) reload();
  };

  return (
    <div>
      <PageHeader title="Approvals" subtitle="Pending decisions across finance and procurement" />

      <div className="flex gap-2 mb-4">
        <Select value={status} onChange={(e) => setStatus(e.target.value)} className="w-40">
          <option value="">All statuses</option><option value="pending">Pending</option><option value="approved">Approved</option><option value="rejected">Rejected</option>
        </Select>
        <Select value={moduleF} onChange={(e) => setModuleF(e.target.value)} className="w-40">
          <option value="">All modules</option><option value="finance">Finance</option><option value="procurement">Procurement</option>
        </Select>
      </div>

      <div className="card p-1">
        <DataTable loading={loading} rows={rows} empty="No approvals in this view."
          columns={[
            { key: "ref", label: "Reference", render: (r) => <span className="font-mono text-[12px]">{r.ref}</span> },
            { key: "title", label: "Item", render: (r) => <span className="font-semibold">{r.title}</span> },
            { key: "module", label: "Module", render: (r) => <StatusChip status={r.module} /> },
            { key: "requested_by", label: "Requested By" },
            { key: "amount", label: "Amount", align: "right", render: (r) => money(r.amount) },
            { key: "approver_role", label: "Approver" },
            { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
            {
              key: "a", label: "", align: "right", render: (r) => r.status === "pending" ? (
                <div className="flex justify-end gap-1">
                  <button title="Approve" onClick={() => decide(r, "approved")} className="p-1.5 rounded-lg hover:bg-emerald-50 text-emerald-600"><Check size={16} /></button>
                  <button title="Reject" onClick={() => decide(r, "rejected")} className="p-1.5 rounded-lg hover:bg-red-50 text-red-600"><X size={16} /></button>
                </div>
              ) : <span className="text-[11px] text-muted">{r.decision_by ? `by ${r.decision_by}` : ""}</span>,
            },
          ]}
        />
      </div>
    </div>
  );
}
