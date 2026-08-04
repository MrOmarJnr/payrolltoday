import CrudPage from "../../components/CrudPage";
import { StatusChip } from "../../components/ui";
import { money } from "../../utils/format";

const ROLES = ["Administrator", "Finance Officer", "Procurement Officer", "HR Officer"];

export default function ApprovalLevels() {
  return (
    <CrudPage
      title="Approval Levels"
      subtitle="Amount thresholds and approver roles per module"
      endpoint="/approval-levels"
      addLabel="New Level"
      filters={[{ name: "module", label: "All modules", options: [{ value: "finance", label: "Finance" }, { value: "procurement", label: "Procurement" }, { value: "inventory", label: "Inventory" }, { value: "hr", label: "HR" }] }]}
      columns={[
        { key: "name", label: "Level", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "module", label: "Module", render: (r) => <StatusChip status={r.module} /> },
        { key: "range", label: "Amount Range", render: (r) => `${money(r.min_amount)} – ${money(r.max_amount)}` },
        { key: "approver_role", label: "Approver" },
        { key: "sequence", label: "Seq", align: "right" },
        { key: "status", label: "Status", render: (r) => <StatusChip status={r.status} /> },
      ]}
      defaults={{ module: "finance", min_amount: 0, max_amount: 0, sequence: 1, status: "active" }}
      fields={[
        { name: "name", label: "Level Name", required: true },
        { name: "module", label: "Module", type: "select", half: true, options: [{ value: "finance", label: "Finance" }, { value: "procurement", label: "Procurement" }, { value: "inventory", label: "Inventory" }, { value: "hr", label: "HR" }] },
        { name: "approver_role", label: "Approver Role", type: "select", half: true, options: ROLES.map((r) => ({ value: r, label: r })) },
        { name: "min_amount", label: "Min Amount", type: "number", half: true },
        { name: "max_amount", label: "Max Amount", type: "number", half: true },
        { name: "sequence", label: "Sequence", type: "number", half: true },
        { name: "status", label: "Status", type: "select", half: true, options: [{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }] },
      ]}
    />
  );
}
