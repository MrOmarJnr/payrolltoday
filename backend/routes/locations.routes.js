const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "locations",
  prefix: "LOC-",
  columns: ["name","code","type","address","city","country","status"],
  search: ["name","code","city"],
  filters: ["status","type"],
  orderBy: "name ASC",
  writeRoles: [],
});
