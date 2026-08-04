const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "assets",
  prefix: "AST-",
  columns: ["asset_tag","serial_number","name","category","assigned_employee_id","assigned_department_id","warehouse_id","purchase_date","purchase_cost","warranty","status","notes"],
  search: ["name","asset_tag","serial_number","category"],
  filters: ["status","category","assigned_department_id"],
  orderBy: "created_at DESC",
  writeRoles: ["HR Officer", "Finance Officer"],
});
