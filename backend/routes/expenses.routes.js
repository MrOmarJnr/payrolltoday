/* Expenses — create/approve workflow + joined listing */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { genId } = require("../utils/resource");

const router = express.Router();
router.use(requireAuth);
const canWrite = authorize("Finance Officer");

const SELECT = `
  SELECT e.*, c.name AS category_name, d.name AS department_name, s.company AS vendor_name
  FROM expenses e
  LEFT JOIN expense_categories c ON c.id = e.category_id
  LEFT JOIN departments d ON d.id = e.department_id
  LEFT JOIN suppliers s ON s.id = e.vendor_id
`;

router.get("/", async (req, res) => {
  try {
    const where = [];
    const params = [];
    if (req.query.status) { where.push("e.status = ?"); params.push(req.query.status); }
    if (req.query.category_id) { where.push("e.category_id = ?"); params.push(req.query.category_id); }
    if (req.query.department_id) { where.push("e.department_id = ?"); params.push(req.query.department_id); }
    if (req.query.q) { where.push("(e.ref LIKE ? OR e.notes LIKE ?)"); params.push(`%${req.query.q}%`, `%${req.query.q}%`); }
    const sql = SELECT + (where.length ? ` WHERE ${where.join(" AND ")}` : "") + " ORDER BY e.expense_date DESC, e.created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT + " WHERE e.id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Not found." });
    res.json({ success: true, data: rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", canWrite, async (req, res) => {
  try {
    const b = req.body;
    const id = genId("EXP-");
    const amount = Number(b.amount || 0);
    const tax = Number(b.tax || 0);
    const total = amount + tax;
    await pool.query(
      `INSERT INTO expenses (id, ref, category_id, department_id, vendor_id, project, payment_method, amount, tax, total, currency, expense_date, status, approval_date, receipt_url, invoice_url, notes, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, id, b.category_id || null, b.department_id || null, b.vendor_id || null, b.project || null,
       b.payment_method || "bank_transfer", amount, tax, total, b.currency || "GHS",
       b.expense_date || new Date().toISOString().slice(0, 10), b.status || "pending", b.approval_date || null,
       b.receipt_url || null, b.invoice_url || null, b.notes || null, req.user?.username || null]
    );
    res.json({ success: true, message: "Expense created.", id });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: e.message }); }
});

router.put("/:id", canWrite, async (req, res) => {
  try {
    const b = req.body;
    const amount = Number(b.amount || 0);
    const tax = Number(b.tax || 0);
    await pool.query(
      `UPDATE expenses SET category_id=?, department_id=?, vendor_id=?, project=?, payment_method=?, amount=?, tax=?, total=?, expense_date=?, status=?, approval_date=?, receipt_url=?, notes=? WHERE id=?`,
      [b.category_id || null, b.department_id || null, b.vendor_id || null, b.project || null,
       b.payment_method || "bank_transfer", amount, tax, amount + tax,
       b.expense_date || null, b.status || "pending", b.approval_date || null, b.receipt_url || null, b.notes || null, req.params.id]
    );
    res.json({ success: true, message: "Expense updated." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Approve / reject / mark paid. Approval captures the date automatically.
router.post("/:id/status", canWrite, async (req, res) => {
  try {
    const { status } = req.body; // approved | rejected | paid
    const approvalDate = req.body.approval_date || (status === "approved" ? new Date().toISOString().slice(0, 10) : null);
    await pool.query(
      "UPDATE expenses SET status=?, approved_by=?, approval_date=COALESCE(?, approval_date) WHERE id=?",
      [status, req.user?.username || "Admin", approvalDate, req.params.id]
    );
    res.json({ success: true, message: `Expense ${status}.` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/:id", canWrite, async (req, res) => {
  try {
    await pool.query("DELETE FROM expenses WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Expense deleted." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
