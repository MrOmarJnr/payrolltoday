/* Purchase Requests — header + line items + status workflow */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { genId } = require("../utils/resource");

const router = express.Router();
router.use(requireAuth);
const canWrite = authorize("Procurement Officer");

const SELECT = `
  SELECT pr.*, d.name AS department_name,
    (SELECT COUNT(*) FROM purchase_request_items i WHERE i.request_id = pr.id) AS item_count
  FROM purchase_requests pr
  LEFT JOIN departments d ON d.id = pr.department_id
`;

router.get("/", async (req, res) => {
  try {
    const where = [];
    const params = [];
    if (req.query.status) { where.push("pr.status = ?"); params.push(req.query.status); }
    if (req.query.q) { where.push("(pr.ref LIKE ? OR pr.title LIKE ?)"); params.push(`%${req.query.q}%`, `%${req.query.q}%`); }
    const sql = SELECT + (where.length ? ` WHERE ${where.join(" AND ")}` : "") + " ORDER BY pr.created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const [[header]] = await pool.query(SELECT + " WHERE pr.id = ?", [req.params.id]);
    if (!header) return res.status(404).json({ success: false, message: "Not found." });
    const [items] = await pool.query("SELECT * FROM purchase_request_items WHERE request_id = ?", [req.params.id]);
    res.json({ success: true, data: { ...header, items } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", canWrite, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const b = req.body;
    const id = genId("PR-");
    const items = Array.isArray(b.items) ? b.items : [];
    const totalEst = items.reduce((s, i) => s + Number(i.quantity || 0) * Number(i.est_price || 0), 0);

    await conn.query(
      `INSERT INTO purchase_requests (id, ref, title, requested_by, department_id, priority, needed_by, status, justification, total_est, attachment_url, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, id, b.title, b.requested_by || req.user?.username, b.department_id || null, b.priority || "normal",
       b.needed_by || null, b.status || "submitted", b.justification || null, totalEst, b.attachment_url || null, req.user?.username || null]
    );
    for (const it of items) {
      await conn.query(
        `INSERT INTO purchase_request_items (request_id, description, quantity, unit, est_price, notes) VALUES (?,?,?,?,?,?)`,
        [id, it.description, Number(it.quantity || 0), it.unit || "pcs", Number(it.est_price || 0), it.notes || null]
      );
    }
    await conn.commit();
    res.json({ success: true, message: "Purchase request submitted.", id });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ success: false, message: e.message });
  } finally { conn.release(); }
});

router.post("/:id/status", canWrite, async (req, res) => {
  try {
    await pool.query("UPDATE purchase_requests SET status=? WHERE id=?", [req.body.status, req.params.id]);
    res.json({ success: true, message: `Request ${req.body.status}.` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/:id", canWrite, async (req, res) => {
  try {
    await pool.query("DELETE FROM purchase_request_items WHERE request_id=?", [req.params.id]);
    await pool.query("DELETE FROM purchase_requests WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Request deleted." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
