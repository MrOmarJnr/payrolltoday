const DigestFetch = require("digest-fetch").default;
const pool = require("../config/db");

async function getDeviceInfo() {
  const [rows] = await pool.query(
    "SELECT * FROM hikvision_settings WHERE is_active = 1 LIMIT 1"
  );

  if (!rows.length) {
    throw new Error("No Hikvision device configured");
  }

  const device = rows[0];

  const client = new DigestFetch(
    device.username,
    device.password
  );

  const response = await client.fetch(
    `http://${device.device_ip}/ISAPI/System/deviceInfo`
  );

  return await response.text();
}


async function getAccessEvents() {
  const [rows] = await pool.query(
    "SELECT * FROM hikvision_settings WHERE is_active = 1 LIMIT 1"
  );

  if (!rows.length) {
    throw new Error("No Hikvision device configured");
  }

  const device = rows[0];

  const client = new DigestFetch(
    device.username,
    device.password
  );

  const today = new Date();

  const date =
    today.getFullYear() +
    "-" +
    String(today.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(today.getDate()).padStart(2, "0");

  let position = 0;
  const maxResults = 30;
  const allEvents = [];

  while (true) {
    const body = {
      AcsEventCond: {
        searchID: "1",
        searchResultPosition: position,
        maxResults,
        major: 0,
        minor: 0,
        startTime: `${date}T00:00:00+00:00`,
        endTime: `${date}T23:59:59+00:00`,
      },
    };

    const response = await client.fetch(
      `http://${device.device_ip}/ISAPI/AccessControl/AcsEvent?format=json`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );

    const json = JSON.parse(await response.text());
    const infoList = json.AcsEvent?.InfoList || [];

    allEvents.push(...infoList);

    if (json.AcsEvent?.responseStatusStrg !== "MORE") {
      break;
    }

    position += maxResults;
  }

  return JSON.stringify({
    AcsEvent: {
      InfoList: allEvents,
    },
  });
}


async function syncEvents() {
  const events = await getAccessEvents();
  const json = JSON.parse(events);

  // Get last synced serial number
  const [syncRows] = await pool.query(`
    SELECT *
    FROM hikvision_sync_logs
    ORDER BY id DESC
    LIMIT 1
  `);

  const syncId =
    syncRows.length > 0
      ? syncRows[0].id
      : null;

  const lastSerialNo =
    syncRows.length > 0
      ? Number(syncRows[0].last_serial_no || 0)
      : 0;

  let inserted = 0;
  let maxSerial = lastSerialNo;

  for (const event of json.AcsEvent.InfoList || []) {

    // Skip events already processed
    if (
      event.serialNo &&
      Number(event.serialNo) <= lastSerialNo
    ) {
      continue;
    }

    // Track highest serial number seen
    if (
      event.serialNo &&
      Number(event.serialNo) > maxSerial
    ) {
      maxSerial = Number(event.serialNo);
    }

    const employeeNo = event.employeeNoString;

    // Skip system events
    if (!employeeNo) continue;
    if (employeeNo === "0001") continue;

    await pool.query(
      `
      INSERT IGNORE INTO biometric_logs
      (
        serial_no,
        employee_id,
        employee_name,
        event_type,
        event_time,
        source
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        event.serialNo,
        employeeNo,
        event.name || "",
        event.currentVerifyMode || "",
        event.time,
        "hikvision",
      ]
    );

    inserted++;
  }

  // Update sync tracker
  if (syncId) {
    await pool.query(
      `
      UPDATE hikvision_sync_logs
      SET
        last_serial_no = ?,
        last_sync_time = NOW()
      WHERE id = ?
      `,
      [
        maxSerial,
        syncId
      ]
    );
  } else {
    await pool.query(
      `
      INSERT INTO hikvision_sync_logs
      (
        last_serial_no,
        last_sync_time
      )
      VALUES
      (
        ?,
        NOW()
      )
      `,
      [maxSerial]
    );
  }

  return {
    inserted,
    lastSerialNo,
    maxSerial
  };
}

async function processAttendance() {

  const [rows] = await pool.query(`
    SELECT
      employee_id,
      DATE(event_time) attendance_date,
      MIN(event_time) first_scan,
      MAX(event_time) last_scan
    FROM biometric_logs
    GROUP BY employee_id, DATE(event_time)
  `);

  let processed = 0;

  for (const row of rows) {

    const clockIn = new Date(row.first_scan);
    const clockOut = new Date(row.last_scan);

    const hoursWorked =
      (clockOut - clockIn) / (1000 * 60 * 60);

    let status = "Present";

    if (
      clockIn.getHours() > 8 ||
      (
        clockIn.getHours() === 8 &&
        clockIn.getMinutes() > 0
      )
    ) {
      status = "Late";
    }

    await pool.query(
      `
      INSERT INTO attendance_logs
      (
        id,
        employee_id,
        attendance_date,
        clock_in,
        clock_out,
        status,
        hours_worked,
        source
      )
      VALUES
      (
        UUID(),
        ?, ?, ?, ?, ?, ?, 'Hikvision'
      )
      ON DUPLICATE KEY UPDATE
        clock_in = VALUES(clock_in),
        clock_out = VALUES(clock_out),
        status = VALUES(status),
        hours_worked = VALUES(hours_worked),
        source = VALUES(source)
      `,
      [
        row.employee_id,
        row.attendance_date,
        clockIn.toTimeString().split(" ")[0],
        clockOut.toTimeString().split(" ")[0],
        status,
        Number(hoursWorked.toFixed(2))
      ]
    );

    processed++;
  }

  return {
    processed
  };
}
module.exports = {
  getDeviceInfo,
  getAccessEvents,
  syncEvents,
  processAttendance
};
