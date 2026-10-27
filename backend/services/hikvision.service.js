const DigestFetch = require("digest-fetch").default;
const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function formatDateOnly(date = new Date()) {
  return (
    date.getFullYear() +
    "-" +
    String(date.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(date.getDate()).padStart(2, "0")
  );
}

function toMysqlDate(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return formatDateOnly(date);
}

function toMysqlDateTime(value) {

  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const hh = String(date.getHours()).padStart(2, "0");
  const mi = String(date.getMinutes()).padStart(2, "0");
  const ss = String(date.getSeconds()).padStart(2, "0");

  return `${yyyy}-${mm}-${dd} ${hh}:${mi}:${ss}`;
}

function toTimeString(value) {
  if (!value) return null;

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toTimeString().split(" ")[0];
}

function calculateHours(firstScan, lastScan, scanCount) {
  if (!firstScan || !lastScan || Number(scanCount) <= 1) {
    return 0;
  }

  const start = new Date(firstScan);
  const end = new Date(lastScan);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    end <= start
  ) {
    return 0;
  }

  return Number(
    ((end - start) / (1000 * 60 * 60)).toFixed(2)
  );
}

async function getAttendanceStatus(firstScan) {

  const [[settings]] = await pool.query(`
      SELECT
          late_target_time,
          late_grace_mins
      FROM company_settings
      LIMIT 1
  `);

  const clockIn = new Date(firstScan);

  if (Number.isNaN(clockIn.getTime())) {
      return "Present";
  }

  const [hour, minute, second] =
      settings.late_target_time
          .split(":")
          .map(Number);

  const cutoff = new Date(firstScan);

  cutoff.setHours(hour);
  cutoff.setMinutes(
      minute + Number(settings.late_grace_mins)
  );
  cutoff.setSeconds(second);

  if (clockIn > cutoff) {
      return "Late";
  }

  return "Present";
}

async function getActiveDevice() {
  const [rows] = await pool.query(`
    SELECT *
    FROM hikvision_settings
    WHERE is_active = 1
    LIMIT 1
  `);

  if (!rows.length) {
    throw new Error("No Hikvision device configured");
  }

  return rows[0];
}

/*
|--------------------------------------------------------------------------
| Device Info
|--------------------------------------------------------------------------
*/

async function getDeviceInfo() {
  const device = await getActiveDevice();

  const client = new DigestFetch(
    device.username,
    device.password
  );

  const response = await client.fetch(
    `http://${device.device_ip}/ISAPI/System/deviceInfo`
  );

  return await response.text();
}

/*
|--------------------------------------------------------------------------
| Get Access Events
|--------------------------------------------------------------------------
*/

async function getAccessEvents() {
  const device = await getActiveDevice();

  const client = new DigestFetch(device.username, device.password);

const now = new Date();

const start = new Date(now);
start.setDate(start.getDate() - 2);

const startDate = formatDateOnly(start);
const endDate = formatDateOnly(now);

  let position = 0;
  const maxResults = 30;
  const allEvents = [];
  const searchID = `sync-${Date.now()}`;

  while (true) {
   const body = {
  AcsEventCond: {
    searchID,
    searchResultPosition: position,
    maxResults,
    major: 5,
    minor: 0,
   startTime: `${startDate}T00:00:00+00:00`,
  endTime: `${endDate}T23:59:59+00:00`,
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

    const text = await response.text();

    let json;
    try {
      json = JSON.parse(text);
    } catch (error) {
      console.error("Invalid Hikvision JSON:", text);
      throw error;
    }

    const infoList = json.AcsEvent?.InfoList || [];

    console.log("HIK PAGE:", {
      searchID,
      position,
      returned: infoList.length,
      first: infoList[0]?.time,
      last: infoList[infoList.length - 1]?.time,
    });

    allEvents.push(...infoList);

    if (infoList.length === 0) break;
  if (infoList.length < 30) break;

    position += infoList.length;
  }

  return JSON.stringify({
    AcsEvent: {
      InfoList: allEvents,
    },
  });
}

/*
|--------------------------------------------------------------------------
| Update Attendance For One Employee/Day
|--------------------------------------------------------------------------
*/

async function updateAttendanceForEmployeeDay(
  employeeId,
  attendanceDate
) {
  const [[existing]] = await pool.query(
    `
    SELECT
      id,
      source,
      clock_in,
      clock_out,
      is_manual
    FROM attendance_logs
    WHERE employee_id = ?
    AND attendance_date = ?
    LIMIT 1
    `,
    [
      employeeId,
      attendanceDate,
    ]
  );


  const [[summary]] = await pool.query(
    `
    SELECT
      MIN(event_time) AS first_scan,
      MAX(event_time) AS last_scan,
      COUNT(*) AS scan_count
    FROM biometric_logs
    WHERE employee_id = ?
    AND DATE(event_time) = ?
    `,
    [
      employeeId,
      attendanceDate,
    ]
  );

  if (!summary || !summary.first_scan) {
    return {
      updated: false,
      reason: "no_biometric_events",
    };
  }

  const firstScan = summary.first_scan;
  const lastScan = summary.last_scan;
  const scanCount = Number(summary.scan_count || 0);

  const clockIn = toTimeString(firstScan);

  let clockOut = null;

  if (
    scanCount > 1 &&
    new Date(lastScan).getTime() !==
      new Date(firstScan).getTime()
  ) {
    clockOut = toTimeString(lastScan);
  }

  const hoursWorked = calculateHours(
    firstScan,
    lastScan,
    scanCount
  );

const status = await getAttendanceStatus(firstScan);

if (
  existing &&
  (
    Number(existing.is_manual) === 1 ||
    String(existing.source || "").toLowerCase() === "manual"
  )
) {

  // Manual record already has clock out.
  if (existing.clock_out) {

    console.log(
      `Manual attendance protected: ${employeeId} ${attendanceDate}`
    );

    return {
      updated: false,
      reason: "manual_protected",
    };
  }

  // Manual record only has clock in.
  // Complete it with Hikvision clock out.

  if (clockOut) {

    await pool.query(
      `
      UPDATE attendance_logs
      SET
        clock_out = ?,
        hours_worked = ?,
        source = 'manual'
      WHERE id = ?
      `,
      [
        clockOut,
        hoursWorked,
        existing.id
      ]
    );

    console.log(
      `Manual clock out added: ${employeeId}`
    );

    return {
      updated: true,
      reason: "manual_clockout_added",
    };
  }

  return {
    updated: false,
    reason: "manual_waiting_for_clockout",
  };
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
      source,
      is_manual
    )
    VALUES
    (
      UUID(),
      ?, ?, ?, ?, ?, ?, 'hikvision', 0
    )
  ON DUPLICATE KEY UPDATE
    clock_in =
        CASE
            WHEN clock_in IS NULL THEN VALUES(clock_in)
            ELSE LEAST(clock_in, VALUES(clock_in))
        END,

    clock_out =
        CASE
            WHEN VALUES(clock_out) IS NULL THEN clock_out
            WHEN clock_out IS NULL THEN VALUES(clock_out)
            ELSE GREATEST(clock_out, VALUES(clock_out))
        END,

    status = VALUES(status),
    hours_worked = VALUES(hours_worked),
    source = 'hikvision',
    is_manual = 0
    `,
    [
      employeeId,
      attendanceDate,
      clockIn,
      clockOut,
      status,
      hoursWorked,
    ]
  );

  return {
    updated: true,
    reason: "updated",
  };
}

/*
|--------------------------------------------------------------------------
| Sync Hikvision Events
|--------------------------------------------------------------------------
*/
async function syncEvents() {
  const events = await getAccessEvents();
  const json = JSON.parse(events);

  const infoList = json.AcsEvent?.InfoList || [];

  let inserted = 0;
  let skipped = 0;

  console.log(`TOTAL EVENTS FROM DEVICE: ${infoList.length}`);

  for (const event of infoList) {

    if (!event.employeeNoString) {
      skipped++;
      continue;
    }

    const employeeNo = String(event.employeeNoString || "").trim();

    if (!employeeNo || employeeNo === "0001") {
      skipped++;
      continue;
    }

    const employeeName = String(event.name || "").trim();

    const serialNo = Number(event.serialNo || 0);

    const eventTime = toMysqlDateTime(event.time);

    if (!eventTime) {
      skipped++;
      continue;
    }

    // Stage every scan, even if the employee isn't in the app yet (e.g. added
    // to iVMS first). processRawLogs leaves those pending until the employee
    // is created, so no attendance is lost.
    await pool.query(
      `
      INSERT IGNORE INTO hikvision_raw_logs
      (
          serial_no,
          employee_id,
          employee_name,
          event_type,
          event_time,
          source,
          raw_json
      )
      VALUES
      (
          ?,?,?,?,?,?,?
      )
      `,
      [
        serialNo,
        employeeNo,
        employeeName,
        String(event.currentVerifyMode || ""),
        eventTime,
        "hikvision",
        JSON.stringify(event)
      ]
    );

    inserted++;
  }

  console.log(
    `RAW IMPORT COMPLETE => Inserted:${inserted} Skipped:${skipped}`
  );

  return {
    inserted,
    skipped
  };
}

/*
|--------------------------------------------------------------------------
| Process Raw Logs
|--------------------------------------------------------------------------
*/


async function processRawLogs() {

    const [rows] = await pool.query(`
        SELECT *
        FROM hikvision_raw_logs
        WHERE imported = 0
        ORDER BY serial_no ASC
    `);

    let imported = 0;
    let skipped = 0;
    let attendanceUpdated = 0;

    for (const row of rows) {

        // Skip invalid employees
        if (!row.employee_id) {
            skipped++;
            continue;
        }

        // Make sure employee exists
        // row.employee_id is the device's Employee No. It is mapped to an app
        // employee via employees.device_employee_no when set (this wins), and
        // otherwise is the app ID itself.
        const [[employee]] = await pool.query(`
            SELECT id
            FROM employees
            WHERE device_employee_no=? OR id=?
            ORDER BY (device_employee_no=?) DESC
            LIMIT 1
        `,[row.employee_id, row.employee_id, row.employee_id]);

        // Employee not created in the app yet: keep the log pending (imported=0)
        // so it is picked up automatically once the matching ID exists.
        if(!employee){
            skipped++;
            continue;
        }

        // Insert into biometric logs
 try {

    await pool.query(`
        INSERT INTO biometric_logs
        (
            serial_no,
            employee_id,
            employee_name,
            event_type,
            event_time,
            source
        )
        VALUES
        (
            ?,?,?,?,?,?
        )
    `,[
        row.serial_no,
        employee.id,
        row.employee_name,
        row.event_type,
        row.event_time,
        "hikvision"
    ]);

} catch (err) {

    if (err.code !== "ER_DUP_ENTRY") {
        throw err;
    }

    console.log(
        `Duplicate skipped -> ${employee.id} ${row.event_time}`
    );

}
        // Build attendance
        const attendanceDate = toMysqlDate(row.event_time);

        if(attendanceDate){

            const result =
                await updateAttendanceForEmployeeDay(
                    employee.id,
                    attendanceDate
                );

            if(result.updated){
                attendanceUpdated++;
            }

        }

        // Mark processed
        await pool.query(`
            UPDATE hikvision_raw_logs
            SET imported=1
            WHERE id=?
        `,[row.id]);

        imported++;
    }

    console.log(
        `RAW PROCESS COMPLETE -> Imported:${imported} Attendance:${attendanceUpdated} Skipped:${skipped}`
    );

    return {
        imported,
        attendanceUpdated,
        skipped
    };

}
/*
|--------------------------------------------------------------------------
| Process Attendance
| - Rebuilds attendance from biometric logs
| - Safe because manual records are protected
|--------------------------------------------------------------------------
*/

async function processAttendance() {
  const [rows] = await pool.query(`
    SELECT
      employee_id,
      DATE(event_time) AS attendance_date
    FROM biometric_logs
    WHERE employee_id IS NOT NULL
    GROUP BY employee_id, DATE(event_time)
  `);

  let processed = 0;
  let skipped = 0;
  let protectedManual = 0;

  for (const row of rows) {
    const employeeId = String(
      row.employee_id || ""
    ).trim();

    const attendanceDate = formatDateOnly(
      new Date(row.attendance_date)
    );

    const result =
      await updateAttendanceForEmployeeDay(
        employeeId,
        attendanceDate
      );

    if (result.updated) {
      processed++;
    } else {
      skipped++;
    }

    if (result.reason === "manual_protected") {
      protectedManual++;
    }
  }

  console.log(
    `Attendance processing complete. Processed:${processed} Skipped:${skipped} ManualProtected:${protectedManual}`
  );

  return {
    processed,
    skipped,
    protectedManual,
  };
}

module.exports = {
  getDeviceInfo,
    getAccessEvents,
    syncEvents,
    processRawLogs,
    processAttendance,
};