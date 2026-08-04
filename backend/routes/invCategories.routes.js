const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "inv_categories",
  prefix: "INVCAT-",
  columns: ["name","code","description","is_active"],
  search: ["name","code"],
  filters: ["is_active"],
  orderBy: "name ASC",
  writeRoles: ["HR Officer"],
});
