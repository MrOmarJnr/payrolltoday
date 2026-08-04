/* Stock movements — creating a movement adjusts the item's on-hand quantity */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");

const router = express.Router();
router.use(requireAuth);
const canWrite = authorize("HR Officer", "Procurement Officer");

const SELECT = `
  SELECT m.*, i.name AS item_name, i.item_code, i.unit,
         wf.name AS from_wh_name, wt.name AS to_wh_name
  FROM stock_movements m
  LEFT JOIN inv_items i ON i.id = m.item_id
  LEFT JOIN warehouses wf ON wf.id = m.from_warehouse_id
  LEFT JOIN warehouses wt ON wt.id = m.to_warehouse_id
`;

router.get("/", async (req, res) => {
  try {
    const where = [];
    const params = [];
    if (req.query.type) { where.push("m.type = ?"); params.push(req.query.type); }
    if (req.query.item_id) { where.push("m.item_id = ?"); params.push(req.query.item_id); }
    if (req.query.q) { where.push("(i.name LIKE ? OR m.ref LIKE ?)"); params.push(`%${req.query.q}%`, `%${req.query.q}%`); }
    const sql = SELECT + (where.length ? ` WHERE ${where.join(" AND ")}` : "") + " ORDER BY m.movement_date DESC, m.id DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// type: in | out | transfer | adjustment | return | damaged | disposed
function qtyDelta(type, quantity) {
  const q = Number(quantity || 0);
  if (type === "in" || type === "return") return q;
  if (type === "out" || type === "damaged" || type === "disposed") return -q;
  if (type === "adjustment") return q; // signed value supplied by caller
  return 0; // transfer: net zero on total on-hand
}

router.post("/", canWrite, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const b = req.body;
    const ref = "SM-" + Date.now();
    const delta = qtyDelta(b.type, b.quantity);

    const [[item]] = await conn.query("SELECT quantity FROM inv_items WHERE id=? FOR UPDATE", [b.item_id]);
    if (!item) { await conn.rollback(); return res.status(400).json({ success: false, message: "Item not found." }); }

    await conn.query(
      `INSERT INTO stock_movements (ref, item_id, type, quantity, from_warehouse_id, to_warehouse_id, unit_cost, reason, attachment_url, moved_by, movement_date)
       VALUES (?,?,?,?,?,?,?,?,?,?,?)`,
      [ref, b.item_id, b.type, Number(b.quantity || 0), b.from_warehouse_id || null, b.to_warehouse_id || null,
       Number(b.unit_cost || 0), b.reason || null, b.attachment_url || null, req.user?.username || null,
       b.movement_date || new Date().toISOString().slice(0, 10)]
    );

    if (delta !== 0) {
      await conn.query("UPDATE inv_items SET quantity = GREATEST(quantity + ?, 0) WHERE id=?", [delta, b.item_id]);
    }
    // On a transfer, move the item's default warehouse to the destination.
    if (b.type === "transfer" && b.to_warehouse_id) {
      await conn.query("UPDATE inv_items SET warehouse_id=? WHERE id=?", [b.to_warehouse_id, b.item_id]);
    }
    await conn.commit();
    res.json({ success: true, message: "Stock movement recorded.", ref });
  } catch (e) {
    await conn.rollback();
    console.error(e);
    res.status(500).json({ success: false, message: e.message });
  } finally { conn.release(); }
});

module.exports = router;
