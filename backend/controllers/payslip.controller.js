const pool = require("../config/db");

const getPayslips = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        pi.id,
        pi.payroll_run_id,
        pi.employee_id,
        pi.employee_name,
        pr.period_month,
        pi.gross_salary,
        pi.net_salary,
        pi.paye
      FROM payroll_items pi
      INNER JOIN payroll_runs pr
      ON pi.payroll_run_id = pr.id
      ORDER BY pr.period_month DESC
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPayslipData = async (req, res) => {
  try {
    const { employeeId, periodMonth } = req.params;

    const [[company]] = await pool.query(`
      SELECT *
      FROM company_settings
      LIMIT 1
    `);

    const [[employee]] = await pool.query(
      `
      SELECT *
      FROM employees
      WHERE id = ?
      `,
      [employeeId]
    );

    const [[item]] = await pool.query(
      `
      SELECT
        pi.*,
        pr.period_month
      FROM payroll_items pi
      INNER JOIN payroll_runs pr
      ON pi.payroll_run_id = pr.id
      WHERE pi.employee_id = ?
      AND pr.period_month = ?
      LIMIT 1
      `,
      [employeeId, periodMonth]
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Payslip not found",
      });
    }

    res.json({
      success: true,
      company,
      employee,
      payslip: item,
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
  getPayslips,
  getPayslipData,
};