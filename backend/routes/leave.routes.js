/* Leave — HR logs leave on an employee's behalf and tracks approval status.
   Not employee self-service: HR Officer/Administrator create and update
   records here. created_by/approved_by + approval_date give a per-employee
   audit trail. */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { genId } = require("../utils/resource");

const router = express.Router();
router.use(requireAuth);
const canWrite = authorize("HR Officer");

const SELECT = `
  SELECT l.*, CONCAT(e.first_name, ' ', e.last_name) AS employee_name, d.name AS department_name
  FROM leave_requests l
  LEFT JOIN employees e ON e.id = l.employee_id
  LEFT JOIN departments d ON d.id = e.department_id
`;

router.get("/", async (req, res) => {
  try {
    const where = [];
    const params = [];
    if (req.query.status) { where.push("l.status = ?"); params.push(req.query.status); }
    if (req.query.employee_id) { where.push("l.employee_id = ?"); params.push(req.query.employee_id); }
    if (req.query.q) { where.push("(e.first_name LIKE ? OR e.last_name LIKE ?)"); params.push(`%${req.query.q}%`, `%${req.query.q}%`); }
    const sql = SELECT + (where.length ? ` WHERE ${where.join(" AND ")}` : "") + " ORDER BY l.start_date DESC, l.created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.query(SELECT + " WHERE l.id = ? LIMIT 1", [req.params.id]);
    if (!rows.length) return res.status(404).json({ success: false, message: "Not found." });
    res.json({ success: true, data: rows[0] });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", canWrite, async (req, res) => {
  try {
    const b = req.body;
    if (!b.employee_id || !b.start_date || !b.end_date) {
      return res.status(400).json({ success: false, message: "Employee, start date and end date are required." });
    }
    const id = genId("LV-");
    const days = Math.round(((new Date(b.end_date) - new Date(b.start_date)) / 86400000 + 1) * 10) / 10;
    await pool.query(
      `INSERT INTO leave_requests (id, employee_id, leave_type, start_date, end_date, days, reason, status, created_by)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [id, b.employee_id, b.leave_type || "Annual", b.start_date, b.end_date, days, b.reason || null,
       b.status || "pending", req.user?.username || null]
    );
    res.json({ success: true, message: "Leave record created.", id });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: e.message }); }
});

router.put("/:id", canWrite, async (req, res) => {
  try {
    const b = req.body;
    const days = Math.round(((new Date(b.end_date) - new Date(b.start_date)) / 86400000 + 1) * 10) / 10;
    await pool.query(
      `UPDATE leave_requests SET employee_id=?, leave_type=?, start_date=?, end_date=?, days=?, reason=? WHERE id=?`,
      [b.employee_id, b.leave_type || "Annual", b.start_date, b.end_date, days, b.reason || null, req.params.id]
    );
    res.json({ success: true, message: "Leave record updated." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Approve / reject. Captures who approved it and when — the audit trail.
router.post("/:id/status", canWrite, async (req, res) => {
  try {
    const { status } = req.body; // approved | rejected
    await pool.query(
      "UPDATE leave_requests SET status=?, approved_by=?, approval_date=CURDATE() WHERE id=?",
      [status, req.user?.username || "Admin", req.params.id]
    );
    res.json({ success: true, message: `Leave ${status}.` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/:id", canWrite, async (req, res) => {
  try {
    await pool.query("DELETE FROM leave_requests WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Leave record deleted." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
