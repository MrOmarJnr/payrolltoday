const pool = require("../config/db");
const { calculatePayroll } = require("../lib/payrollEngine");

const getPayrollRuns = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM payroll_runs
      ORDER BY generated_at DESC
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
const getPayrollItems = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM payroll_items
      ORDER BY employee_name ASC
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

const processPayroll = async (req, res) => {
  try {
    const { periodMonth } = req.body;

    if (!periodMonth) {
      return res.status(400).json({
        success: false,
        message: "Payroll month is required.",
      });
    }

    const [employees] = await pool.query(`
      SELECT id
      FROM employees
      WHERE status = 'Active'
    `);

    const payrollRunId = `RUN-${Date.now()}`;

    await pool.query(
      `
      INSERT INTO payroll_runs
      (
        id,
        period_month,
        generated_by,
        total_basic_salary,
        total_gross_salary,
        total_ssnit_employee,
        total_ssnit_employer,
        total_paye,
        total_deductions,
        total_net_salary,
        items_count
      )
      VALUES
      (?,?,?,?,?,?,?,?,?,?,?)
      `,
      [
        payrollRunId,
        periodMonth,
        "Administrator",
        0,
        0,
        0,
        0,
        0,
        0,
        0,
        employees.length,
      ]
    );

    let totalBasicSalary = 0;
    let totalGrossSalary = 0;
    let totalEmployeeSsnit = 0;
    let totalEmployerSsnit = 0;
    let totalPaye = 0;
    let totalDeductions = 0;
    let totalNetSalary = 0;

    for (const employee of employees) {
      const item = await calculatePayroll(employee.id, periodMonth);

      await pool.query(
        `
        INSERT INTO payroll_items
        (
          id,
          payroll_run_id,
          employee_id,
          employee_name,
          department_name,
          basic_salary,
          transport_allowance,
          housing_allowance,
          utility_allowance,
          risk_allowance,
          other_allowances,
          gross_salary,
          employee_ssnit,
          employer_ssnit,
          late_days_count,
          lateness_deduction,
          taxable_income,
          paye,
          other_deductions,
          net_salary
        )
        VALUES
        (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
        `,
        [
          `ITEM-${Date.now()}-${employee.id}`,
          payrollRunId,
          item.employeeId,
          item.employeeName,
          item.departmentName,
          item.basicSalary,
          item.transportAllowance,
          item.housingAllowance,
          item.utilityAllowance,
          item.riskAllowance,
          item.otherAllowances,
          item.grossSalary,
          item.employeeSsnit,
          item.employerSsnit,
          item.lateDaysCount,
          item.latenessDeduction,
          item.taxableIncome,
          item.paye,
          item.otherDeductions,
          item.netSalary,
        ]
      );

      totalBasicSalary += item.basicSalary;
      totalGrossSalary += item.grossSalary;
      totalEmployeeSsnit += item.employeeSsnit;
      totalEmployerSsnit += item.employerSsnit;
      totalPaye += item.paye;
      totalDeductions +=
        item.employeeSsnit +
        item.paye +
        item.latenessDeduction +
        item.otherDeductions;
      totalNetSalary += item.netSalary;
    }

    await pool.query(
      `
      UPDATE payroll_runs
      SET
        total_basic_salary = ?,
        total_gross_salary = ?,
        total_ssnit_employee = ?,
        total_ssnit_employer = ?,
        total_paye = ?,
        total_deductions = ?,
        total_net_salary = ?,
        items_count = ?
      WHERE id = ?
      `,
      [
        totalBasicSalary,
        totalGrossSalary,
        totalEmployeeSsnit,
        totalEmployerSsnit,
        totalPaye,
        totalDeductions,
        totalNetSalary,
        employees.length,
        payrollRunId,
      ]
    );

    return res.json({
      success: true,
      payrollRunId,
      message: "Payroll processed successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getPayrollRuns,
  processPayroll,
  getPayrollItems,
};