const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "budgets",
  prefix: "BUD-",
  columns: ["name","fiscal_year","scope","department_id","category_id","project","period","allocated","spent","status","notes"],
  search: ["name","fiscal_year"],
  filters: ["scope","status","fiscal_year"],
  orderBy: "created_at DESC",
  writeRoles: ["Finance Officer"],
});
