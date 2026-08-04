const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "approval_levels",
  prefix: "APL-",
  columns: ["name","module","min_amount","max_amount","approver_role","sequence","status"],
  search: ["name","approver_role"],
  filters: ["module","status"],
  orderBy: "module ASC, sequence ASC",
  writeRoles: [],
});
