const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "vendor_bills",
  prefix: "VB-",
  hasRef: true,
  columns: ["ref","supplier_id","po_id","grn_id","invoice_number","bill_date","due_date","amount","tax","total","match_status","status","notes"],
  search: ["ref","invoice_number"],
  filters: ["status","match_status","supplier_id"],
  orderBy: "created_at DESC",
  writeRoles: ["Finance Officer", "Procurement Officer"],
});
