/* Roles — read for all authenticated users, writes Administrator-only.
   Defensive about the roles table's id column type (unknown at build time). */
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");

const router = express.Router();
router.use(requireAuth);
const adminOnly = authorize(); // Administrator always allowed; no others

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT r.*, (SELECT COUNT(*) FROM users u WHERE u.role_id = r.id) AS user_count
      FROM roles r ORDER BY r.name ASC`);
    res.json({ success: true, data: rows });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.post("/", adminOnly, async (req, res) => {
  try {
    const [cols] = await pool.query("SHOW COLUMNS FROM roles");
    const autoInc = cols.find((c) => c.Field === "id" && /auto_increment/i.test(c.Extra || ""));
    const hasDesc = cols.some((c) => c.Field === "description");
    const { name, description } = req.body;
    if (autoInc) {
      if (hasDesc) await pool.query("INSERT INTO roles (name, description) VALUES (?,?)", [name, description || null]);
      else await pool.query("INSERT INTO roles (name) VALUES (?)", [name]);
    } else {
      const [[mx]] = await pool.query("SELECT MAX(CAST(id AS UNSIGNED)) AS m FROM roles");
      const nextId = (Number(mx.m) || 0) + 1;
      if (hasDesc) await pool.query("INSERT INTO roles (id, name, description) VALUES (?,?,?)", [nextId, name, description || null]);
      else await pool.query("INSERT INTO roles (id, name) VALUES (?,?)", [nextId, name]);
    }
    res.json({ success: true, message: "Role created." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.put("/:id", adminOnly, async (req, res) => {
  try {
    const [cols] = await pool.query("SHOW COLUMNS FROM roles");
    const hasDesc = cols.some((c) => c.Field === "description");
    if (hasDesc) await pool.query("UPDATE roles SET name=?, description=? WHERE id=?", [req.body.name, req.body.description || null, req.params.id]);
    else await pool.query("UPDATE roles SET name=? WHERE id=?", [req.body.name, req.params.id]);
    res.json({ success: true, message: "Role updated." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

router.delete("/:id", adminOnly, async (req, res) => {
  try {
    const [[cnt]] = await pool.query("SELECT COUNT(*) AS c FROM users WHERE role_id=?", [req.params.id]);
    if (cnt.c > 0) return res.status(400).json({ success: false, message: "Cannot delete a role assigned to users." });
    await pool.query("DELETE FROM roles WHERE id=?", [req.params.id]);
    res.json({ success: true, message: "Role deleted." });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = router;
