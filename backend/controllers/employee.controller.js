const pool = require("../config/db");

const XLSX = require("xlsx");
const fs = require("fs");

/*
|--------------------------------------------------------------------------
| GET EMPLOYEES
|--------------------------------------------------------------------------
*/

const getEmployees = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT
        e.*,
        d.name AS department_name,

        ss.basic_salary,
        ss.transport_allowance,
        ss.housing_allowance,
        ss.utility_allowance,
        ss.risk_allowance,
        ss.other_allowances,
        ss.other_deductions

      FROM employees e

      LEFT JOIN departments d
        ON d.id = e.department_id

      LEFT JOIN salary_setups ss
        ON ss.employee_id = e.id

      ORDER BY e.last_name ASC
    `);

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load employees.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| GET EMPLOYEE
|--------------------------------------------------------------------------
*/

const getEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(
      `
      SELECT
        e.*,
        d.name AS department_name,

        ss.basic_salary,
        ss.transport_allowance,
        ss.housing_allowance,
        ss.utility_allowance,
        ss.risk_allowance,
        ss.other_allowances,
        ss.other_deductions

      FROM employees e

      LEFT JOIN departments d
        ON d.id = e.department_id

      LEFT JOIN salary_setups ss
        ON ss.employee_id = e.id

      WHERE e.id = ?
    `,
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    return res.json({
      success: true,
      data: rows[0],
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load employee.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| NEXT EMPLOYEE ID
|--------------------------------------------------------------------------
*/

async function nextEmployeeId(db) {
  const [lastEmployee] = await db.query(`
    SELECT id
    FROM employees
    WHERE id LIKE 'LSEMP%'
    ORDER BY CAST(SUBSTRING(id, 6) AS UNSIGNED) DESC
    LIMIT 1
  `);

  if (lastEmployee.length === 0) return "LSEMP001";

  const lastNumber = parseInt(lastEmployee[0].id.replace("LSEMP", ""), 10);

  return `LSEMP${String(lastNumber + 1).padStart(3, "0")}`;
}

/*
|--------------------------------------------------------------------------
| CREATE EMPLOYEE
|--------------------------------------------------------------------------
*/

const createEmployee = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const {
      first_name,
      last_name,
      other_names,
      gender,
      date_of_birth,
      phone_number,
      email,
      address,
      date_employed,
      department_id,
      position,
      employment_type,
      bank_name,
      bank_account,
      ssnit_number,
      ghana_card_number,
      status,
      photo_url,

      basic_salary,
      transport_allowance,
      housing_allowance,
      utility_allowance,
      risk_allowance,
      other_allowances,
      other_deductions,
    } = req.body;

    // HR types the ID (it must equal the Employee No. enrolled in iVMS, and
    // permanent/temporary staff use different ranges); blank falls back to
    // the next LSEMP number.
    const requestedId = String(req.body.employee_id || "").trim();
    let employeeId;

    if (requestedId) {
      if (!/^[A-Za-z0-9_-]{1,50}$/.test(requestedId)) {
        await conn.rollback();
        return res.status(400).json({
          success: false,
          message:
            "Employee ID may only contain letters, numbers, dashes and underscores.",
        });
      }

      const [taken] = await conn.query(
        "SELECT id FROM employees WHERE id = ? LIMIT 1",
        [requestedId]
      );

      if (taken.length > 0) {
        await conn.rollback();
        return res.status(409).json({
          success: false,
          message: `Employee ID ${requestedId} already exists.`,
        });
      }

      employeeId = requestedId;
    } else {
      employeeId = await nextEmployeeId(conn);
    }

    await conn.query(
      `
      INSERT INTO employees
      (
        id,
        first_name,
        last_name,
        other_names,
        gender,
        date_of_birth,
        phone_number,
        email,
        address,
        date_employed,
        department_id,
        position,
        employment_type,
        bank_name,
        bank_account,
        ssnit_number,
        ghana_card_number,
        status,
        photo_url
      )
      VALUES
      (
        ?,?,?,?,?,?,?,?,?,?,
        ?,?,?,?,?,?,?,?,?
      )
    `,
      [
        employeeId,
        first_name,
        last_name,
        other_names,
        gender,
        date_of_birth,
        phone_number,
        email,
        address,
        date_employed,
        department_id,
        position,
        employment_type,
        bank_name,
        bank_account,
        ssnit_number,
        ghana_card_number,
        status,
        photo_url,
      ]
    );

    await conn.query(
      `
      INSERT INTO salary_setups
      (
        employee_id,
        basic_salary,
        transport_allowance,
        housing_allowance,
        utility_allowance,
        risk_allowance,
        other_allowances,
        other_deductions
      )
      VALUES
      (
        ?,?,?,?,?,?,?,?
      )
    `,
      [
        employeeId,
        basic_salary || 0,
        transport_allowance || 0,
        housing_allowance || 0,
        utility_allowance || 0,
        risk_allowance || 0,
        other_allowances || 0,
        other_deductions || 0,
      ]
    );

    await conn.commit();

    return res.json({
      success: true,
      message: "Employee created successfully.",
    });
  } catch (error) {
    await conn.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create employee.",
    });
  } finally {
    conn.release();
  }
};

/*
|--------------------------------------------------------------------------
| DELETE EMPLOYEE
|--------------------------------------------------------------------------
*/

const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM employees
      WHERE id = ?
    `,
      [id]
    );

    return res.json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete employee.",
    });
  }
};


/*
|--------------------------------------------------------------------------
| UPDATE EMPLOYEE
|--------------------------------------------------------------------------
*/
const updateEmployee = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const { id } = req.params;

    const {
      first_name,
      last_name,
      other_names,
      gender,
      date_of_birth,
      phone_number,
      email,
      address,
      date_employed,
      department_id,
      position,
      employment_type,
      bank_name,
      bank_account,
      ssnit_number,
      ghana_card_number,
      status,
      photo_url,

      basic_salary,
      transport_allowance,
      housing_allowance,
      utility_allowance,
      risk_allowance,
      other_allowances,
      other_deductions,
    } = req.body;

    // Employee Details
    await conn.query(
      `
      UPDATE employees
      SET
        first_name=?,
        last_name=?,
        other_names=?,
        gender=?,
        date_of_birth=?,
        phone_number=?,
        email=?,
        address=?,
        date_employed=?,
        department_id=?,
        position=?,
        employment_type=?,
        bank_name=?,
        bank_account=?,
        ssnit_number=?,
        ghana_card_number=?,
        status=?,
        photo_url=?
      WHERE id=?
      `,
      [
        first_name,
        last_name,
        other_names,
        gender,
        date_of_birth,
        phone_number,
        email,
        address,
        date_employed,
        department_id,
        position,
        employment_type,
        bank_name,
        bank_account,
        ssnit_number,
        ghana_card_number,
        status,
        photo_url,
        id,
      ]
    );

    // Salary Details
  await conn.query(
`
INSERT INTO salary_setups
(
  employee_id,
  basic_salary,
  transport_allowance,
  housing_allowance,
  utility_allowance,
  risk_allowance,
  other_allowances,
  other_deductions
)
VALUES
(
  ?,?,?,?,?,?,?,?
)
ON DUPLICATE KEY UPDATE
  basic_salary=VALUES(basic_salary),
  transport_allowance=VALUES(transport_allowance),
  housing_allowance=VALUES(housing_allowance),
  utility_allowance=VALUES(utility_allowance),
  risk_allowance=VALUES(risk_allowance),
  other_allowances=VALUES(other_allowances),
  other_deductions=VALUES(other_deductions)
`,
[
  id,
  basic_salary || 0,
  transport_allowance || 0,
  housing_allowance || 0,
  utility_allowance || 0,
  risk_allowance || 0,
  other_allowances || 0,
  other_deductions || 0,
]
);

    await conn.commit();

    return res.json({
      success: true,
      message: "Employee updated successfully.",
    });

  } catch (error) {

    await conn.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update employee.",
    });

  } finally {
    conn.release();
  }
};

/*
|--------------------------------------------------------------------------
| IMPORT EMPLOYEE
|--------------------------------------------------------------------------
*/

const importEmployees = async (req, res) => {
  const conn = await pool.getConnection();

  try {
    await conn.beginTransaction();

    const workbook = XLSX.readFile(req.file.path);

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    const rows =
      XLSX.utils.sheet_to_json(sheet);

    let created = 0;
    let updated = 0;

    for (const row of rows) {

      const employeeId =
        String(row.employee_id).trim();

      const [existing] =
        await conn.query(
          `
          SELECT id
          FROM employees
          WHERE id = ?
          `,
          [employeeId]
        );

      if (existing.length > 0) {

        await conn.query(
          `
          UPDATE employees
          SET
            first_name=?,
            last_name=?,
            other_names=?,
            gender=?,
            date_of_birth=?,
            phone_number=?,
            email=?,
            address=?,
            date_employed=?,
            department_id=?,
            position=?,
            employment_type=?,
            bank_name=?,
            bank_account=?,
            ssnit_number=?,
            ghana_card_number=?,
            status=?
          WHERE id=?
          `,
          [
            row.first_name,
            row.last_name,
            row.other_names,
            row.gender,
            row.date_of_birth,
            row.phone_number,
            row.email,
            row.address,
            row.date_employed,
            row.department_id,
            row.position,
            row.employment_type,
            row.bank_name,
            row.bank_account,
            row.ssnit_number,
            row.ghana_card_number,
            row.status,
            employeeId
          ]
        );

        await conn.query(
          `
          UPDATE salary_setups
          SET
            basic_salary=?,
            transport_allowance=?,
            housing_allowance=?,
            utility_allowance=?,
            risk_allowance=?,
            other_allowances=?,
            other_deductions=?
          WHERE employee_id=?
          `,
          [
            row.basic_salary || 0,
            row.transport_allowance || 0,
            row.housing_allowance || 0,
            row.utility_allowance || 0,
            row.risk_allowance || 0,
            row.other_allowances || 0,
            row.other_deductions || 0,
            employeeId
          ]
        );

        updated++;

      } else {

        await conn.query(
          `
          INSERT INTO employees
          (
            id,
            first_name,
            last_name,
            other_names,
            gender,
            date_of_birth,
            phone_number,
            email,
            address,
            date_employed,
            department_id,
            position,
            employment_type,
            bank_name,
            bank_account,
            ssnit_number,
            ghana_card_number,
            status
          )
          VALUES
          (
            ?,?,?,?,?,?,?,?,?,?,
            ?,?,?,?,?,?,?,?
          )
          `,
          [
            employeeId,
            row.first_name,
            row.last_name,
            row.other_names,
            row.gender,
            row.date_of_birth,
            row.phone_number,
            row.email,
            row.address,
            row.date_employed,
            row.department_id,
            row.position,
            row.employment_type,
            row.bank_name,
            row.bank_account,
            row.ssnit_number,
            row.ghana_card_number,
            row.status
          ]
        );

        await conn.query(
          `
          INSERT INTO salary_setups
          (
            employee_id,
            basic_salary,
            transport_allowance,
            housing_allowance,
            utility_allowance,
            risk_allowance,
            other_allowances,
            other_deductions
          )
          VALUES
          (
            ?,?,?,?,?,?,?,?
          )
          `,
          [
            employeeId,
            row.basic_salary || 0,
            row.transport_allowance || 0,
            row.housing_allowance || 0,
            row.utility_allowance || 0,
            row.risk_allowance || 0,
            row.other_allowances || 0,
            row.other_deductions || 0
          ]
        );

        created++;
      }
    }

    fs.unlinkSync(req.file.path);

    await conn.commit();

    return res.json({
      success: true,
      created,
      updated,
      total: rows.length
    });

  } catch (error) {

    await conn.rollback();

    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message
    });

  } finally {
    conn.release();
  }
};

module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
  importEmployees
};