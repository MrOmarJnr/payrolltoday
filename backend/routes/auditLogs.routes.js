const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "audit_logs",
  prefix: "LOG-",
  columns: ["actor","actor_role","action","module","entity","entity_id","details","ip"],
  search: ["actor","action","details"],
  filters: ["module","action"],
  orderBy: "created_at DESC",
  writeRoles: [],
});
