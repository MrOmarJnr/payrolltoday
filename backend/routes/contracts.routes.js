const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "contracts",
  prefix: "CTR-",
  hasRef: true,
  columns: ["ref","title","supplier_id","start_date","end_date","value","status","document_url","notes"],
  search: ["ref","title"],
  filters: ["status","supplier_id"],
  orderBy: "end_date ASC",
  writeRoles: ["Procurement Officer"],
});
