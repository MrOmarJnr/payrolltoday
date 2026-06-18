const pool = require("../config/db");

async function calculatePAYE(taxableIncome) {
  const [bands] = await pool.query(`
    SELECT *
    FROM tax_bands
    ORDER BY limit_value ASC
  `);

  let remaining = Number(taxableIncome);
  let previousLimit = 0;
  let paye = 0;

  for (const band of bands) {
    const currentLimit = band.limit_value;

    if (currentLimit === null) {
      paye += remaining * (Number(band.rate) / 100);
      break;
    }

    const taxableBand = currentLimit - previousLimit;

    if (remaining > taxableBand) {
      paye += taxableBand * (Number(band.rate) / 100);
      remaining -= taxableBand;
    } else {
      paye += remaining * (Number(band.rate) / 100);
      remaining = 0;
      break;
    }

    previousLimit = currentLimit;
  }

  return Number(paye.toFixed(2));
}

async function calculatePayroll(employeeId, periodMonth) {
  const [[employee]] = await pool.query(
    `
    SELECT
      e.*,
      d.name AS department_name,
      s.*
    FROM employees e
    LEFT JOIN departments d
      ON e.department_id = d.id
    LEFT JOIN salary_setups s
      ON e.id = s.employee_id
    WHERE e.id = ?
    `,
    [employeeId]
  );

  if (!employee) {
    throw new Error("Employee not found");
  }

  const [[settings]] = await pool.query(
    `SELECT * FROM company_settings LIMIT 1`
  );

  const [attendance] = await pool.query(
    `
    SELECT *
    FROM attendance_logs
    WHERE employee_id = ?
    AND DATE_FORMAT(attendance_date,'%Y-%m') = ?
    `,
    [employeeId, periodMonth]
  );

  const lateDays = attendance.filter(
    (x) => x.status === "Late"
  ).length;

  const basicSalary = Number(employee.basic_salary || 0);

  const transportAllowance =
    Number(employee.transport_allowance || 0);

  const housingAllowance =
    Number(employee.housing_allowance || 0);

  const utilityAllowance =
    Number(employee.utility_allowance || 0);

  const riskAllowance =
    Number(employee.risk_allowance || 0);

  const otherAllowances =
    Number(employee.other_allowances || 0);

  const grossSalary =
    basicSalary +
    transportAllowance +
    housingAllowance +
    utilityAllowance +
    riskAllowance +
    otherAllowances;

  const employeeSsnit =
  grossSalary *
  (Number(settings.employee_ssnit_rate || 5.5) / 100);

const employerSsnit =
  grossSalary *
  (Number(settings.employer_ssnit_rate || 13) / 100);

  const taxableIncome =
    grossSalary - employeeSsnit;

  const paye = await calculatePAYE(
    taxableIncome
  );

 const latePenaltyPerIncident =
  Number(settings.incident_deduction_amount || 50);

const latenessDeduction =
  lateDays * latePenaltyPerIncident;

  const otherDeductions =
    Number(employee.other_deductions || 0);

  const totalDeductions =
    employeeSsnit +
    paye +
    latenessDeduction +
    otherDeductions;

  const netSalary =
    grossSalary - totalDeductions;

  return {
    employeeId: employee.id,
    employeeName:
      `${employee.first_name} ${employee.last_name}`,

    departmentName:
      employee.department_name || "Unassigned",

    basicSalary,

    transportAllowance,
    housingAllowance,
    utilityAllowance,
    riskAllowance,
    otherAllowances,

    grossSalary,

    employeeSsnit:
      Number(employeeSsnit.toFixed(2)),

    employerSsnit:
      Number(employerSsnit.toFixed(2)),

    taxableIncome:
      Number(taxableIncome.toFixed(2)),

    paye,

    lateDaysCount: lateDays,

    latenessDeduction:
      Number(latenessDeduction.toFixed(2)),

    otherDeductions,

    netSalary:
      Number(netSalary.toFixed(2)),
  };
}

module.exports = {
  calculatePayroll,
};