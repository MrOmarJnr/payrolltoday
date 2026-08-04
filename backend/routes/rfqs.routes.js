const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "rfqs",
  prefix: "RFQ-",
  hasRef: true,
  columns: ["ref","title","request_id","due_date","status","notes","created_by"],
  search: ["ref","title"],
  filters: ["status"],
  orderBy: "created_at DESC",
  writeRoles: ["Procurement Officer"],
});
