/*
|--------------------------------------------------------------------------
| Attendance sync — receives clock in/out events from the Aura mobile app
|--------------------------------------------------------------------------
| Authenticated with a shared secret header (x-sync-key = SYNC_API_KEY), NOT a
| user JWT, because the caller is the Aura backend (server-to-server).
|
| It resolves the LEF employee (by email, then by id) and upserts the day's
| row in `attendance_logs` using the existing UNIQUE(employee_id, attendance_date):
|   CLOCK_IN  -> sets clock_in (keeps earliest) + Present/Late status
|   CLOCK_OUT -> sets clock_out + hours_worked
| source is tagged 'Mobile'.
*/
const express = require("express");
const crypto = require("crypto");
const pool = require("../config/db");

const router = express.Router();

// Shared-secret guard
router.use((req, res, next) => {
  const key = req.headers["x-sync-key"];
  if (!process.env.SYNC_API_KEY || key !== process.env.SYNC_API_KEY) {
    return res.status(401).json({ success: false, message: "Invalid or missing sync key." });
  }
  next();
});

const pad = (n) => String(n).padStart(2, "0");
function parts(ts) {
  const d = ts ? new Date(ts) : new Date();
  if (isNaN(d)) throw new Error("Invalid timestamp");
  // Ghana is UTC+0; use UTC components so date/time match the ISO value.
  return {
    date: `${d.getUTCFullYear()}-${pad(d.getUTCMonth() + 1)}-${pad(d.getUTCDate())}`,
    time: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}:${pad(d.getUTCSeconds())}`,
  };
}

async function computeStatus(time) {
  try {
    const [[cs]] = await pool.query("SELECT late_target_time, late_grace_mins FROM company_settings LIMIT 1");
    if (!cs || !cs.late_target_time) return "Present";
    const [th, tm, tss = 0] = String(cs.late_target_time).split(":").map(Number);
    const threshold = th * 3600 + tm * 60 + Number(tss) + Number(cs.late_grace_mins || 0) * 60;
    const [ch, cm, css = 0] = time.split(":").map(Number);
    return (ch * 3600 + cm * 60 + Number(css)) > threshold ? "Late" : "Present";
  } catch { return "Present"; }
}

router.post("/clock", async (req, res) => {
  try {
    const { email, employee_id, type, timestamp } = req.body || {};
    const kind = String(type || "").toUpperCase();
    if (kind !== "CLOCK_IN" && kind !== "CLOCK_OUT") {
      return res.status(400).json({ success: false, message: "type must be CLOCK_IN or CLOCK_OUT." });
    }

    // Resolve employee: by id first, then by email
    let empId = null;
    if (employee_id) {
      const [r] = await pool.query("SELECT id FROM employees WHERE id = ? LIMIT 1", [employee_id]);
      if (r.length) empId = r[0].id;
    }
    if (!empId && email) {
      const [r] = await pool.query("SELECT id FROM employees WHERE email = ? LIMIT 1", [email]);
      if (r.length) empId = r[0].id;
    }
    if (!empId) {
      return res.status(404).json({ success: false, message: `No LEF employee found for ${email || employee_id}.` });
    }

    const { date, time } = parts(timestamp);

    if (kind === "CLOCK_IN") {
      const status = await computeStatus(time);
      await pool.query(
        `INSERT INTO attendance_logs (id, employee_id, attendance_date, clock_in, status, source, is_manual)
         VALUES (?, ?, ?, ?, ?, 'Mobile', 0)
         ON DUPLICATE KEY UPDATE
           clock_in = IF(clock_in IS NULL OR VALUES(clock_in) < clock_in, VALUES(clock_in), clock_in),
           status   = VALUES(status),
           source   = 'Mobile'`,
        [crypto.randomUUID(), empId, date, time, status]
      );
      return res.json({ success: true, message: "Clock-in synced.", employee_id: empId, date, time, status });
    }

    // CLOCK_OUT
    await pool.query(
      `INSERT INTO attendance_logs (id, employee_id, attendance_date, clock_out, source, is_manual)
       VALUES (?, ?, ?, ?, 'Mobile', 0)
       ON DUPLICATE KEY UPDATE
         clock_out    = VALUES(clock_out),
         hours_worked = IF(clock_in IS NOT NULL,
                           ROUND(TIME_TO_SEC(TIMEDIFF(VALUES(clock_out), clock_in)) / 3600, 2),
                           hours_worked),
         source       = 'Mobile'`,
      [crypto.randomUUID(), empId, date, time]
    );
    return res.json({ success: true, message: "Clock-out synced.", employee_id: empId, date, time });
  } catch (e) {
    console.error("[attendance-sync]", e);
    return res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
