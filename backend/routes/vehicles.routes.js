const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "vehicles",
  prefix: "VEH-",
  columns: ["name", "reg_no", "department_id", "fuel_type", "status", "notes"],
  search: ["name", "reg_no"],
  filters: ["status", "department_id"],
  orderBy: "name ASC",
  writeRoles: ["Finance Officer"],
});
