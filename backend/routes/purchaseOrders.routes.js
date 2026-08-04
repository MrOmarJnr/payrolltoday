/* Purchase Orders — header + line items + supplier join + status workflow */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { genId } = require("../utils/resource");

const router = express.Router();
router.use(requireAuth);
const canWrite = authorize("Procurement Officer");

const SELECT = `
  SELECT po.*, s.company AS supplier_name,
    (SELECT COUNT(*) FROM purchase_order_items i WHERE i.po_id = po.id) AS item_count
  FROM purchase_orders po
  LEFT JOIN suppliers s ON s.id = po.supplier_id
`;

router.get("/", async (req, res) => {
  try {
    const where = [];
    const params = [];
    if (req.query.status) { where.push("po.status = ?"); params.push(req.query.status); }
    if (req.query.supplier_id) { where.push("po.supplier_id = ?"); params.push(req.query.supplier_id); }
    if (req.query.q) { where.push("(po.ref LIKE ?)"); params.push(`%${req.query.q}%`); }
    const sql = SELECT + (where.length ? ` WHERE ${where.join(" AND ")}` : "") + " ORDER BY po.created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const [[header]] = await pool.query(SELECT + " WHERE po.id = ?", [req.params.id]);
    if (!header) return res.status(404).json({ success: false, message: "Not found." });
    const [items] = await pool.query("SELECT * FROM purchase_order_items WHERE po_id = ?", [req.params.id]);
    res.json({ success: true, data: { ...header, items } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", canWrite, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const b = req.body;
    const id = genId("PO-");
    const items = Array.isArray(b.items) ? b.items : [];
    let subtotal = 0;
    const computed = items.map((it) => {
      const line = Number(it.quantity || 0) * Number(it.unit_price || 0) - Number(it.discount || 0) + Number(it.tax || 0);
      subtotal += Number(it.quantity || 0) * Number(it.unit_price || 0);
      return { ...it, line_total: line };
    });
    const discount = Number(b.discount || 0);
    const tax = Number(b.tax || 0);
    const total = subtotal - discount + tax;

    await conn.query(
      `INSERT INTO purchase_orders (id, ref, request_id, supplier_id, order_date, delivery_date, payment_terms, subtotal, discount, tax, total, status, attachment_url, notes, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, id, b.request_id || null, b.supplier_id || null, b.order_date || new Date().toISOString().slice(0, 10),
       b.delivery_date || null, b.payment_terms || null, subtotal, discount, tax, total, b.status || "draft",
       b.attachment_url || null, b.notes || null, req.user?.username || null]
    );
    for (const it of computed) {
      await conn.query(
        `INSERT INTO purchase_order_items (po_id, item_id, description, quantity, unit_price, discount, tax, line_total) VALUES (?,?,?,?,?,?,?,?)`,
        [id, it.item_id || null, it.description, Number(it.quantity || 0), Number(it.unit_price || 0),
         Number(it.discount || 0), Number(it.tax || 0), it.line_total]
      );
    }
    await conn.commit();
    res.json({ success: true, message: "Purchase order created.", id });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ success: false, message: e.message });
  } finally { conn.release(); }
});

router.post("/:id/status", canWrite, async (req, res) => {
  try {
    await pool.query("UPDATE purchase_orders SET status=? WHERE id=?", [req.body.status, req.params.id]);
    res.json({ success: true, message: `PO ${req.body.status}.` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/:id", canWrite, async (req, res) => {
  try {
    await pool.query("DELETE FROM purchase_order_items WHERE po_id=?", [req.params.id]);
    await pool.query("DELETE FROM purchase_orders WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "PO deleted." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
