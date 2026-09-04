/* ERP dashboards — aggregated KPIs & chart series for each module.
   Every metric is fetched defensively so one empty/missing source never
   breaks the whole dashboard. */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");

const router = express.Router();
router.use(requireAuth);

async function one(sql, params = [], fallback = 0) {
  try { const [rows] = await pool.query(sql, params); const v = Object.values(rows[0] || {})[0]; return v == null ? fallback : v; }
  catch { return fallback; }
}
async function many(sql, params = []) {
  try { const [rows] = await pool.query(sql, params); return rows; } catch { return []; }
}

/* ----------------------------- FINANCE ----------------------------------- */
router.get("/finance", async (req, res) => {
  const [today, week, month, year] = await Promise.all([
    one("SELECT COALESCE(SUM(total),0) FROM expenses WHERE expense_date = CURDATE()"),
    one("SELECT COALESCE(SUM(total),0) FROM expenses WHERE YEARWEEK(expense_date,1)=YEARWEEK(CURDATE(),1)"),
    one("SELECT COALESCE(SUM(total),0) FROM expenses WHERE YEAR(expense_date)=YEAR(CURDATE()) AND MONTH(expense_date)=MONTH(CURDATE())"),
    one("SELECT COALESCE(SUM(total),0) FROM expenses WHERE YEAR(expense_date)=YEAR(CURDATE())"),
  ]);
  const pendingApprovals = await one("SELECT COUNT(*) FROM expenses WHERE status='pending'");
  const pendingReimb = await one("SELECT COUNT(*) FROM expenses WHERE status='pending' AND payment_method='reimbursement'");

  res.json({
    success: true,
    data: {
      kpis: {
        today: Number(today), week: Number(week), month: Number(month), year: Number(year),
        pendingApprovals: Number(pendingApprovals), pendingReimbursements: Number(pendingReimb),
      },
      departmentSpending: await many(`
        SELECT COALESCE(d.name,'Unassigned') AS label, SUM(e.total) AS value
        FROM expenses e LEFT JOIN departments d ON d.id=e.department_id
        GROUP BY d.name ORDER BY value DESC LIMIT 8`),
      categoryBreakdown: await many(`
        SELECT COALESCE(c.name,'Other') AS label, SUM(e.total) AS value
        FROM expenses e LEFT JOIN expense_categories c ON c.id=e.category_id
        GROUP BY c.name ORDER BY value DESC LIMIT 10`),
      topVendors: await many(`
        SELECT s.company AS label, SUM(e.total) AS value
        FROM expenses e JOIN suppliers s ON s.id=e.vendor_id
        GROUP BY s.company ORDER BY value DESC LIMIT 6`),
      trend: await many(`
        SELECT DATE_FORMAT(expense_date,'%b') AS label, SUM(total) AS value
        FROM expenses WHERE expense_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY YEAR(expense_date), MONTH(expense_date) ORDER BY YEAR(expense_date), MONTH(expense_date)`),
      recent: await many(`
        SELECT e.id, e.ref, e.total, e.status, e.expense_date, c.name AS category_name
        FROM expenses e LEFT JOIN expense_categories c ON c.id=e.category_id
        ORDER BY e.created_at DESC LIMIT 8`),
    },
  });
});

/* ----------------------------- FUEL -------------------------------------- */
router.get("/fuel", async (req, res) => {
  res.json({
    success: true,
    data: {
      kpis: {
        monthCost: Number(await one("SELECT COALESCE(SUM(amount),0) FROM fuel_logs WHERE YEAR(log_date)=YEAR(CURDATE()) AND MONTH(log_date)=MONTH(CURDATE())")),
        yearCost: Number(await one("SELECT COALESCE(SUM(amount),0) FROM fuel_logs WHERE YEAR(log_date)=YEAR(CURDATE())")),
        avgCost: Number(await one("SELECT COALESCE(AVG(amount),0) FROM fuel_logs")),
        pending: Number(await one("SELECT COUNT(*) FROM fuel_logs WHERE status='pending'")),
      },
      byVehicle: await many("SELECT vehicle AS label, SUM(amount) AS value FROM fuel_logs GROUP BY vehicle ORDER BY value DESC LIMIT 8"),
      byDept: await many(`SELECT COALESCE(d.name,'Unassigned') AS label, SUM(f.amount) AS value FROM fuel_logs f LEFT JOIN departments d ON d.id=f.department_id GROUP BY d.name ORDER BY value DESC LIMIT 8`),
      trend: await many(`SELECT DATE_FORMAT(log_date,'%b') AS label, SUM(amount) AS value FROM fuel_logs WHERE log_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH) GROUP BY YEAR(log_date), MONTH(log_date) ORDER BY YEAR(log_date), MONTH(log_date)`),
    },
  });
});

/* --------------------------- INVENTORY ----------------------------------- */
router.get("/inventory", async (req, res) => {
  res.json({
    success: true,
    data: {
      kpis: {
        totalValue: Number(await one("SELECT COALESCE(SUM(quantity*avg_cost),0) FROM inv_items")),
        itemCount: Number(await one("SELECT COUNT(*) FROM inv_items")),
        lowStock: Number(await one("SELECT COUNT(*) FROM inv_items WHERE quantity>0 AND quantity<=reorder_level")),
        outOfStock: Number(await one("SELECT COUNT(*) FROM inv_items WHERE quantity<=0")),
      },
      valueByCategory: await many(`
        SELECT COALESCE(c.name,'Uncategorised') AS label, SUM(i.quantity*i.avg_cost) AS value
        FROM inv_items i LEFT JOIN inv_categories c ON c.id=i.category_id
        GROUP BY c.name ORDER BY value DESC LIMIT 10`),
      recentItems: await many("SELECT id, name, item_code, quantity, avg_cost, status FROM inv_items ORDER BY created_at DESC LIMIT 6"),
      recentMovements: await many(`
        SELECT m.id, m.type, m.quantity, m.movement_date, i.name AS item_name
        FROM stock_movements m LEFT JOIN inv_items i ON i.id=m.item_id
        ORDER BY m.movement_date DESC, m.id DESC LIMIT 8`),
      lowStockItems: await many("SELECT id, name, item_code, quantity, reorder_level FROM inv_items WHERE quantity<=reorder_level ORDER BY quantity ASC LIMIT 8"),
      trend: await many(`
        SELECT DATE_FORMAT(movement_date,'%b') AS label,
          SUM(CASE WHEN type='in' THEN quantity ELSE 0 END) AS stock_in,
          SUM(CASE WHEN type='out' THEN quantity ELSE 0 END) AS stock_out
        FROM stock_movements WHERE movement_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY YEAR(movement_date), MONTH(movement_date) ORDER BY YEAR(movement_date), MONTH(movement_date)`),
    },
  });
});

/* --------------------------- EXECUTIVE ----------------------------------- */
router.get("/executive", async (req, res) => {
  res.json({
    success: true,
    data: {
      kpis: {
        totalEmployees: Number(await one("SELECT COUNT(*) FROM employees")),
        attendanceToday: Number(await one("SELECT COUNT(*) FROM attendance WHERE DATE(created_at)=CURDATE()")),
        totalExpensesYear: Number(await one("SELECT COALESCE(SUM(total),0) FROM expenses WHERE YEAR(expense_date)=YEAR(CURDATE())")),
        monthlyExpenses: Number(await one("SELECT COALESCE(SUM(total),0) FROM expenses WHERE YEAR(expense_date)=YEAR(CURDATE()) AND MONTH(expense_date)=MONTH(CURDATE())")),
        inventoryValue: Number(await one("SELECT COALESCE(SUM(quantity*avg_cost),0) FROM inv_items")),
        totalAssets: Number(await one("SELECT COUNT(*) FROM assets")),
        lowStock: Number(await one("SELECT COUNT(*) FROM inv_items WHERE quantity<=reorder_level")),
        pendingApprovals: Number(await one("SELECT COUNT(*) FROM expenses WHERE status='pending'")),
        fuelCostMonth: Number(await one("SELECT COALESCE(SUM(amount),0) FROM fuel_logs WHERE YEAR(log_date)=YEAR(CURDATE()) AND MONTH(log_date)=MONTH(CURDATE())")),
      },
      topDepartments: await many(`
        SELECT COALESCE(d.name,'Unassigned') AS label, SUM(e.total) AS value
        FROM expenses e LEFT JOIN departments d ON d.id=e.department_id
        GROUP BY d.name ORDER BY value DESC LIMIT 6`),
      topCategories: await many(`
        SELECT COALESCE(c.name,'Other') AS label, SUM(e.total) AS value
        FROM expenses e LEFT JOIN expense_categories c ON c.id=e.category_id
        GROUP BY c.name ORDER BY value DESC LIMIT 6`),
      topSuppliers: await many(`
        SELECT s.company AS label, COALESCE(SUM(e.total),0) AS value
        FROM expenses e JOIN suppliers s ON s.id=e.vendor_id
        GROUP BY s.company ORDER BY value DESC LIMIT 6`),
      spendingTrend: await many(`
        SELECT DATE_FORMAT(expense_date,'%b') AS label, SUM(total) AS value
        FROM expenses WHERE expense_date >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
        GROUP BY YEAR(expense_date), MONTH(expense_date) ORDER BY YEAR(expense_date), MONTH(expense_date)`),
      recentActivities: await many("SELECT actor, action, module, entity, details, created_at FROM audit_logs ORDER BY created_at DESC LIMIT 10"),
      lowStockItems: await many("SELECT id, name, item_code, quantity, reorder_level FROM inv_items WHERE quantity<=reorder_level ORDER BY quantity ASC LIMIT 6"),
    },
  });
});

module.exports = router;
