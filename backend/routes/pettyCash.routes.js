/* Petty cash — accounts + transactions with running balance */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");
const { genId } = require("../utils/resource");

const router = express.Router();
router.use(requireAuth);
const canWrite = authorize("Finance Officer");

// Accounts
router.get("/accounts", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT a.*, l.name AS location_name FROM petty_cash_accounts a
      LEFT JOIN locations l ON l.id = a.location_id ORDER BY a.name ASC`);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/accounts", canWrite, async (req, res) => {
  try {
    const b = req.body;
    const id = genId("PCA-");
    const flt = Number(b.float_amount || 0);
    await pool.query(
      `INSERT INTO petty_cash_accounts (id, name, location_id, custodian, float_amount, balance, status) VALUES (?,?,?,?,?,?,?)`,
      [id, b.name, b.location_id || null, b.custodian || null, flt, flt, "active"]
    );
    res.json({ success: true, message: "Petty cash account created.", id });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// Transactions (optionally ?account_id=)
router.get("/txns", async (req, res) => {
  try {
    const params = [];
    let sql = "SELECT * FROM petty_cash_txns";
    if (req.query.account_id) { sql += " WHERE account_id = ?"; params.push(req.query.account_id); }
    sql += " ORDER BY txn_date DESC, id DESC";
    const [rows] = await pool.query(sql, params);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/txns", canWrite, async (req, res) => {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const b = req.body;
    const [[acct]] = await conn.query("SELECT balance FROM petty_cash_accounts WHERE id=? FOR UPDATE", [b.account_id]);
    if (!acct) { await conn.rollback(); return res.status(400).json({ success: false, message: "Account not found." }); }

    const amount = Number(b.amount || 0);
    const type = b.type || "expense";
    // float / replenishment increase balance; withdrawal / expense decrease it
    const increases = type === "float" || type === "replenishment";
    const newBalance = Number(acct.balance) + (increases ? amount : -amount);

    const ref = "PC-" + Date.now();
    await conn.query(
      `INSERT INTO petty_cash_txns (account_id, ref, type, amount, balance_after, description, status, txn_date, created_by)
       VALUES (?,?,?,?,?,?,?,?,?)`,
      [b.account_id, ref, type, amount, newBalance, b.description || null, "approved",
       b.txn_date || new Date().toISOString().slice(0, 10), req.user?.username || null]
    );
    await conn.query("UPDATE petty_cash_accounts SET balance=? WHERE id=?", [newBalance, b.account_id]);
    await conn.commit();
    res.json({ success: true, message: "Transaction recorded.", balance: newBalance });
  } catch (e) {
    await conn.rollback();
    res.status(500).json({ success: false, message: e.message });
  } finally { conn.release(); }
});

module.exports = router;
