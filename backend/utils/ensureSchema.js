const pool = require("../config/db");

/*
| Idempotent schema upgrades applied at startup, so no manual SQL is needed.
|
| employees.device_employee_no — the Employee No. enrolled on the Hikvision
| device / iVMS, for when it differs from employees.id. Optional: when blank,
| the sync falls back to employees.id.
*/
async function ensureSchema() {
  const [cols] = await pool.query(
    `SELECT 1 FROM information_schema.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE()
       AND TABLE_NAME = 'employees'
       AND COLUMN_NAME = 'device_employee_no'`
  );

  if (!cols.length) {
    await pool.query(
      `ALTER TABLE employees
         ADD COLUMN device_employee_no VARCHAR(50) NULL,
         ADD UNIQUE KEY uk_employees_device_no (device_employee_no)`
    );
    console.log("Schema: added employees.device_employee_no");
  }
}

module.exports = ensureSchema;
