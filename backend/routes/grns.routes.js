/* Goods Received Notes — receiving goods auto-updates inventory on-hand */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { genId } = require("../utils/resource");

const router = express.Router();
router.use(requireAuth);
const canWrite = authorize("Procurement Officer", "HR Officer");

const SELECT = `
  SELECT g.*, po.ref AS po_ref, s.company AS supplier_name
  FROM grns g
  LEFT JOIN purchase_orders po ON po.id = g.po_id
  LEFT JOIN suppliers s ON s.id = po.supplier_id
`;

router.get("/", async (req, res) => {
  try {
    const where = [];
    const params = [];
    if (req.query.status) { where.push("g.status = ?"); params.push(req.query.status); }
    if (req.query.q) { where.push("(g.ref LIKE ?)"); params.push(`%${req.query.q}%`); }
    const sql = SELECT + (where.length ? ` WHERE ${where.join(" AND ")}` : "") + " ORDER BY g.created_at DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.get("/:id", async (req, res) => {
  try {
    const [[header]] = await pool.query(SELECT + " WHERE g.id = ?", [req.params.id]);
    if (!header) return res.status(404).json({ success: false, message: "Not found." });
    const [items] = await pool.query("SELECT * FROM grn_items WHERE grn_id = ?", [req.params.id]);
    res.json({ success: true, data: { ...header, items } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", canWrite, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const b = req.body;
    const id = genId("GRN-");
    const items = Array.isArray(b.items) ? b.items : [];
    const hasDiscrepancy = items.some((i) => Number(i.damaged_qty || 0) > 0 || Number(i.shortage_qty || 0) > 0);
    const status = b.status || (hasDiscrepancy ? "discrepancy" : "completed");

    await conn.query(
      `INSERT INTO grns (id, ref, po_id, received_date, received_by, status, notes) VALUES (?,?,?,?,?,?,?)`,
      [id, id, b.po_id || null, b.received_date || new Date().toISOString().slice(0, 10),
       b.received_by || req.user?.username || null, status, b.notes || null]
    );

    for (const it of items) {
      const received = Number(it.received_qty || 0);
      const damaged = Number(it.damaged_qty || 0);
      await conn.query(
        `INSERT INTO grn_items (grn_id, item_id, description, ordered_qty, received_qty, damaged_qty, shortage_qty) VALUES (?,?,?,?,?,?,?)`,
        [id, it.item_id || null, it.description || null, Number(it.ordered_qty || 0), received, damaged, Number(it.shortage_qty || 0)]
      );
      // Auto stock-in: good units = received - damaged
      const good = received - damaged;
      if (it.item_id && good > 0) {
        await conn.query("UPDATE inv_items SET quantity = quantity + ? WHERE id=?", [good, it.item_id]);
        await conn.query(
          `INSERT INTO stock_movements (ref, item_id, type, quantity, to_warehouse_id, reason, reference_doc, moved_by, movement_date)
           VALUES (?,?,?,?,?,?,?,?,?)`,
          ["SM-" + Date.now() + Math.floor(Math.random() * 99), it.item_id, "in", good, null, "GRN receipt", id, req.user?.username || null, new Date().toISOString().slice(0, 10)]
        );
      }
    }

    // Mark the PO as received/partial
    if (b.po_id) {
      await conn.query("UPDATE purchase_orders SET status=? WHERE id=?", [hasDiscrepancy ? "partial" : "received", b.po_id]);
    }
    await conn.commit();
    res.json({ success: true, message: "Goods received & inventory updated.", id, status });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  } finally { conn.release(); }
});

module.exports = router;
