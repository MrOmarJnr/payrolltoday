const pool = require("../config/db");

const getReportsData = async (req, res) => {
  try {
    const [employees] = await pool.query(`
      SELECT
        e.id,
        e.first_name,
        e.last_name,
        e.department_id,
        e.position,
        e.bank_name,
        e.bank_account,
        e.ssnit_number,
        e.photo_url
      FROM employees e
      ORDER BY e.last_name ASC
    `);

    const [departments] = await pool.query(`
      SELECT *
      FROM departments
      ORDER BY name ASC
    `);

    const [attendanceLogs] = await pool.query(`
      SELECT
        id,
        employee_id,
        attendance_date,
        status,
        hours_worked
      FROM attendance_logs
      ORDER BY attendance_date DESC
    `);

    const [runs] = await pool.query(`
      SELECT *
      FROM payroll_runs
      ORDER BY generated_at DESC
    `);

    const payrollRuns = [];

    for (const run of runs) {
      const [items] = await pool.query(
        `
        SELECT *
        FROM payroll_items
        WHERE payroll_run_id = ?
      `,
        [run.id]
      );

      payrollRuns.push({
        ...run,
        items,
      });
    }

    res.json({
      success: true,
      payrollRuns,
      employees,
      departments,
      attendanceLogs,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getReportsData,
};