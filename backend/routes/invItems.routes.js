const { resourceRouter } = require("../utils/resource");
module.exports = resourceRouter({
  table: "inv_items",
  prefix: "ITM-",
  columns: ["item_code","name","description","brand","category_id","unit","quantity","min_quantity","reorder_level","purchase_price","avg_cost","supplier_id","warehouse_id","purchase_date","warranty","status"],
  search: ["name","item_code","brand"],
  filters: ["category_id","warehouse_id","status"],
  orderBy: "name ASC",
  writeRoles: ["HR Officer"],
});
