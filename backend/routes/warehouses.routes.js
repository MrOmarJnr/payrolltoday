const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "warehouses",
  prefix: "WH-",
  columns: ["name","code","location_id","manager","capacity","status"],
  search: ["name","code","manager"],
  filters: ["status","location_id"],
  orderBy: "name ASC",
  writeRoles: ["HR Officer"],
});
