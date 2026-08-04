/*
|--------------------------------------------------------------------------
| Generic REST resource factory
|--------------------------------------------------------------------------
| Builds a standard CRUD Express router for a table so the many ERP master
| entities don't each need hand-written boilerplate. Returns the SAME
| { success, data } response shape used by the existing HR controllers.
|
| Usage:
|   const { resourceRouter } = require("../utils/resource");
|   module.exports = resourceRouter({
|     table: "suppliers",
|     prefix: "SUP-",
|     columns: ["company","contact_person", ...],   // writable columns
|     search: ["company","email"],                    // ?q= searches these
|     filters: ["status"],                            // ?status=active
|     orderBy: "created_at DESC",
|   });
*/
const express = require("express");
const pool = require("../config/db");
const { requireAuth } = require("../middleware/auth.middleware");
const { authorize } = require("../middleware/authorize.middleware");

function genId(prefix) {
  return `${prefix}${Date.now()}${Math.floor(Math.random() * 90 + 10)}`;
}

function pick(body, columns) {
  const out = {};
  for (const c of columns) {
    if (body[c] !== undefined) out[c] = body[c] === "" ? null : body[c];
  }
  return out;
}

function resourceRouter(cfg) {
  const {
    table,
    prefix = "ID-",
    columns = [],
    search = [],
    filters = [],
    orderBy = "created_at DESC",
    hasRef = false, // if true, set ref = id on create when not supplied
    selectSql = null, // optional custom SELECT (e.g. with JOINs); must alias base table cols
    writeRoles = null, // e.g. ["Finance Officer"] — Administrator is always allowed
  } = cfg;

  const router = express.Router();
  const baseSelect = selectSql || `SELECT * FROM ${table}`;

  // All resource routes require a valid login; writes may be role-restricted.
  router.use(requireAuth);
  const guard = writeRoles ? [authorize(...writeRoles)] : [];

  // LIST
  router.get("/", async (req, res) => {
    try {
      const where = [];
      const params = [];

      if (req.query.q && search.length) {
        where.push("(" + search.map((c) => `${c} LIKE ?`).join(" OR ") + ")");
        search.forEach(() => params.push(`%${req.query.q}%`));
      }
      for (const f of filters) {
        if (req.query[f] !== undefined && req.query[f] !== "") {
          where.push(`${table}.${f} = ?`);
          params.push(req.query[f]);
        }
      }

      const sql =
        baseSelect +
        (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
        (orderBy ? ` ORDER BY ${orderBy}` : "");

      const [rows] = await pool.query(sql, params);
      return res.json({ success: true, data: rows });
    } catch (error) {
      console.error(`[${table}] list`, error);
      return res.status(500).json({ success: false, message: `Failed to load ${table}.` });
    }
  });

  // GET ONE
  router.get("/:id", async (req, res) => {
    try {
      const [rows] = await pool.query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [req.params.id]);
      if (!rows.length) return res.status(404).json({ success: false, message: "Not found." });
      return res.json({ success: true, data: rows[0] });
    } catch (error) {
      console.error(`[${table}] get`, error);
      return res.status(500).json({ success: false, message: "Failed to load record." });
    }
  });

  // CREATE
  router.post("/", ...guard, async (req, res) => {
    try {
      const data = pick(req.body, columns);
      const id = genId(prefix);
      data.id = id;
      if (hasRef && !data.ref) data.ref = id;

      const keys = Object.keys(data);
      const placeholders = keys.map(() => "?").join(", ");
      await pool.query(
        `INSERT INTO ${table} (${keys.join(", ")}) VALUES (${placeholders})`,
        keys.map((k) => data[k])
      );
      return res.json({ success: true, message: "Created successfully.", id });
    } catch (error) {
      console.error(`[${table}] create`, error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // UPDATE
  router.put("/:id", ...guard, async (req, res) => {
    try {
      const data = pick(req.body, columns);
      const keys = Object.keys(data);
      if (!keys.length) return res.json({ success: true, message: "Nothing to update." });

      await pool.query(
        `UPDATE ${table} SET ${keys.map((k) => `${k} = ?`).join(", ")} WHERE id = ?`,
        [...keys.map((k) => data[k]), req.params.id]
      );
      return res.json({ success: true, message: "Updated successfully." });
    } catch (error) {
      console.error(`[${table}] update`, error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  // DELETE
  router.delete("/:id", ...guard, async (req, res) => {
    try {
      await pool.query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
      return res.json({ success: true, message: "Deleted successfully." });
    } catch (error) {
      console.error(`[${table}] delete`, error);
      return res.status(500).json({ success: false, message: error.message });
    }
  });

  return router;
}

module.exports = { resourceRouter, genId, pick };
