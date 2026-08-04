const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "supplier_quotations",
  prefix: "SQ-",
  hasRef: true,
  columns: ["ref","rfq_id","supplier_id","quote_date","valid_until","subtotal","tax","total","delivery_days","warranty","rating","status","notes"],
  search: ["ref"],
  filters: ["status","rfq_id","supplier_id"],
  orderBy: "created_at DESC",
  writeRoles: ["Procurement Officer"],
});
