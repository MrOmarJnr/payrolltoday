const pool = require("../config/db");

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

          const [lastEmployee] = await conn.query(`
          SELECT id
          FROM employees
          WHERE id LIKE 'LSEMP%'
          ORDER BY CAST(SUBSTRING(id, 6) AS UNSIGNED) DESC
          LIMIT 1
        `);

        let employeeId = "LSEMP001";

        if (lastEmployee.length > 0) {
          const lastNumber = parseInt(
            lastEmployee[0].id.replace("LSEMP", ""),
            10
          );

          employeeId = `LSEMP${String(lastNumber + 1).padStart(3, "0")}`;
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



module.exports = {
  getEmployees,
  getEmployee,
  createEmployee,
  updateEmployee,
  deleteEmployee,
};