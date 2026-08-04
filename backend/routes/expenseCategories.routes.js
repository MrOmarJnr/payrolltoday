const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "expense_categories",
  prefix: "EXCAT-",
  columns: ["name", "type", "is_active"],
  search: ["name"],
  filters: ["type", "is_active"],
  orderBy: "name ASC",
  writeRoles: ["Finance Officer"],
});
