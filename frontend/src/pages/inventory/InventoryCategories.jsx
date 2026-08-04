import CrudPage from "../../components/CrudPage";

export default function InventoryCategories() {
  return (
    <CrudPage
      title="Inventory Categories"
      subtitle="Classification of stock items"
      endpoint="/inv-categories"
      addLabel="New Category"
      exportRow={(r) => ({ name: r.name, code: r.code, description: r.description })}
      columns={[
        { key: "name", label: "Name", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "code", label: "Code" },
        { key: "description", label: "Description", render: (r) => r.description || "—" },
      ]}
      defaults={{ is_active: 1 }}
      fields={[
        { name: "name", label: "Category Name", required: true, half: true },
        { name: "code", label: "Code", half: true },
        { name: "description", label: "Description", type: "textarea" },
      ]}
    />
  );
}
