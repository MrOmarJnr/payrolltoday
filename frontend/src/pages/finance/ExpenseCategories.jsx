import CrudPage from "../../components/CrudPage";

export default function ExpenseCategories() {
  return (
    <CrudPage
      title="Expense Categories"
      subtitle="Categories used when recording expenses"
      endpoint="/expense-categories"
      addLabel="New Category"
      exportRow={(r) => ({ name: r.name, type: r.type })}
      columns={[
        { key: "name", label: "Category", render: (r) => <span className="font-semibold">{r.name}</span> },
        { key: "type", label: "Type", render: (r) => r.type || "operational" },
      ]}
      defaults={{ type: "operational", is_active: 1 }}
      fields={[
        { name: "name", label: "Category Name", required: true },
        { name: "type", label: "Type", type: "select", options: [{ value: "operational", label: "Operational" }, { value: "capital", label: "Capital" }, { value: "administrative", label: "Administrative" }] },
      ]}
    />
  );
}
