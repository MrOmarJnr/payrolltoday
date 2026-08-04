/* Fuel logs — amount auto-calc + approval + dept join */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { genId } = require("../utils/resource");

const router = express.Router();
router.use(requireAuth);
const canWrite = authorize("Finance Officer");

const SELECT = `
  SELECT f.*, d.name AS department_name,
    (f.current_odometer - f.prev_odometer) AS distance,
    CASE WHEN f.litres > 0 AND f.current_odometer > f.prev_odometer
         THEN ROUND((f.current_odometer - f.prev_odometer) / f.litres, 2)
         ELSE NULL END AS km_per_litre
  FROM fuel_logs f
  LEFT JOIN departments d ON d.id = f.department_id
`;

router.get("/", async (req, res) => {
  try {
    const where = [];
    const params = [];
    if (req.query.status) { where.push("f.status = ?"); params.push(req.query.status); }
    if (req.query.department_id) { where.push("f.department_id = ?"); params.push(req.query.department_id); }
    if (req.query.q) { where.push("(f.vehicle LIKE ? OR f.reg_no LIKE ? OR f.driver LIKE ?)"); params.push(`%${req.query.q}%`, `%${req.query.q}%`, `%${req.query.q}%`); }
    const sql = SELECT + (where.length ? ` WHERE ${where.join(" AND ")}` : "") + " ORDER BY f.log_date DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", canWrite, async (req, res) => {
  try {
    const b = req.body;
    const id = genId("FUEL-");
    const litres = Number(b.litres || 0);
    const ppl = Number(b.price_per_litre || 0);
    const amount = b.amount ? Number(b.amount) : litres * ppl;
    await pool.query(
      `INSERT INTO fuel_logs (id, ref, vehicle_id, vehicle, reg_no, driver, department_id, station, fuel_type, litres, price_per_litre, amount, prev_odometer, current_odometer, receipt_url, log_date, status, notes, created_by)
       VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
      [id, id, b.vehicle_id || null, b.vehicle || null, b.reg_no || null, b.driver || null, b.department_id || null,
       b.station || null, b.fuel_type || "Petrol", litres, ppl, amount,
       Number(b.prev_odometer || 0), Number(b.current_odometer || 0), b.receipt_url || null,
       b.log_date || new Date().toISOString().slice(0, 10), b.status || "pending", b.notes || null, req.user?.username || null]
    );
    res.json({ success: true, message: "Fuel log recorded.", id });
  } catch (e) { console.error(e); res.status(500).json({ success: false, message: e.message }); }
});

router.put("/:id", canWrite, async (req, res) => {
  try {
    const b = req.body;
    const litres = Number(b.litres || 0);
    const ppl = Number(b.price_per_litre || 0);
    const amount = b.amount ? Number(b.amount) : litres * ppl;
    await pool.query(
      `UPDATE fuel_logs SET vehicle_id=?, vehicle=?, reg_no=?, driver=?, department_id=?, station=?, fuel_type=?, litres=?, price_per_litre=?, amount=?, prev_odometer=?, current_odometer=?, receipt_url=?, log_date=?, status=?, notes=? WHERE id=?`,
      [b.vehicle_id || null, b.vehicle, b.reg_no, b.driver, b.department_id || null, b.station, b.fuel_type, litres, ppl, amount,
       Number(b.prev_odometer || 0), Number(b.current_odometer || 0), b.receipt_url || null, b.log_date, b.status, b.notes || null, req.params.id]
    );
    res.json({ success: true, message: "Fuel log updated." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/:id/status", canWrite, async (req, res) => {
  try {
    await pool.query("UPDATE fuel_logs SET status=?, approved_by=? WHERE id=?", [req.body.status, req.user?.username || "Admin", req.params.id]);
    res.json({ success: true, message: `Fuel log ${req.body.status}.` });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/:id", canWrite, async (req, res) => {
  try {
    await pool.query("DELETE FROM fuel_logs WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Fuel log deleted." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
