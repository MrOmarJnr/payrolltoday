/* Approvals queue — approving/rejecting cascades to the linked record */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");

const router = express.Router();
router.use(requireAuth);
const canDecide = authorize("Finance Officer", "Procurement Officer");

router.get("/", async (req, res) => {
  try {
    const where = [];
    const params = [];
    if (req.query.status) { where.push("status = ?"); params.push(req.query.status); }
    if (req.query.module) { where.push("module = ?"); params.push(req.query.module); }
    const sql = "SELECT * FROM approvals" + (where.length ? ` WHERE ${where.join(" AND ")}` : "") + " ORDER BY created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Cascade the decision to the underlying record where applicable
async function cascade(conn, ap, decision) {
  const newStatus = decision === "approved" ? "approved" : "rejected";
  if (ap.entity === "expense") {
    await conn.query("UPDATE expenses SET status=? WHERE id=?", [newStatus, ap.entity_id]);
  } else if (ap.entity === "fuel") {
    await conn.query("UPDATE fuel_logs SET status=? WHERE id=?", [newStatus, ap.entity_id]);
  } else if (ap.entity === "purchase_request") {
    await conn.query("UPDATE purchase_requests SET status=? WHERE id=?", [decision === "approved" ? "approved" : "rejected", ap.entity_id]);
  } else if (ap.entity === "vendor_bill") {
    await conn.query("UPDATE vendor_bills SET status=? WHERE id=?", [newStatus, ap.entity_id]);
  }
}

router.post("/:id/decide", canDecide, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const decision = req.body.decision === "approved" ? "approved" : "rejected";
    const [[ap]] = await conn.query("SELECT * FROM approvals WHERE id=? FOR UPDATE", [req.params.id]);
    if (!ap) { await conn.rollback(); return res.status(404).json({ success: false, message: "Approval not found." }); }

    await conn.query(
      "UPDATE approvals SET status=?, decision_by=?, decision_at=NOW(), comment=? WHERE id=?",
      [decision, req.user?.username || "Admin", req.body.comment || null, req.params.id]
    );
    await cascade(conn, ap, decision);
    await conn.query(
      `INSERT INTO audit_logs (actor, actor_role, action, module, entity, entity_id, details)
       VALUES (?,?,?,?,?,?,?)`,
      [req.user?.username || "Admin", req.user?.role || null, decision, ap.module, ap.entity, ap.entity_id, `${decision} ${ap.ref || ""}`]
    );
    await conn.commit();
    res.json({ success: true, message: `Request ${decision}.` });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ success: false, message: e.message });
  } finally { conn.release(); }
});

module.exports = router;
