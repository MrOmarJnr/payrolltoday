const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "suppliers",
  prefix: "SUP-",
  columns: ["company","contact_person","phone","email","address","tax_number","bank_details","payment_terms","products_supplied","rating","status"],
  search: ["company","contact_person","email"],
  filters: ["status"],
  orderBy: "company ASC",
  writeRoles: ["Procurement Officer", "Finance Officer"],
});
