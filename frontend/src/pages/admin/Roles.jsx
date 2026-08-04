import CrudPage from "../../components/CrudPage";
import { num } from "../../utils/format";

export default function Roles() {
  return (
    <CrudPage
      title="Roles"
      subtitle="Access roles and how many users hold each"
      endpoint="/roles"
      addLabel="New Role"
      search={false}
      columns={[
        { key: "name", label: "Role", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "description", label: "Description", render: (r) => r.description || "—" },
        { key: "user_count", label: "Users", align: "right", render: (r) => num(r.user_count) },
      ]}
      fields={[
        { name: "name", label: "Role Name", required: true },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
