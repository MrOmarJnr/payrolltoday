const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

function calculateHours(clockIn, clockOut) {
  if (!clockIn || !clockOut) return 0;

  const start = new Date(`1970-01-01 ${clockIn}`);
  const end = new Date(`1970-01-01 ${clockOut}`);

  const hours = (end - start) / (1000 * 60 * 60);

  return hours > 0 ? Number(hours.toFixed(2)) : 0;
}

/*
|--------------------------------------------------------------------------
| Get Attendance
|--------------------------------------------------------------------------
*/

const getAttendance = async (req, res) => {
  try {

    const [rows] = await pool.query(`
      SELECT
        attendance_logs.*,
        employees.first_name,
        employees.last_name,
        employees.position,
        employees.photo_url
      FROM attendance_logs
      LEFT JOIN employees
      ON attendance_logs.employee_id = employees.id
      ORDER BY attendance_date DESC, clock_in ASC
    `);

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }
};

/*
|--------------------------------------------------------------------------
| Create Manual Attendance
|--------------------------------------------------------------------------
*/

const createAttendance = async (req, res) => {

  try {

    const {
      employee_id,
      attendance_date,
      clock_in,
      clock_out,
      status
    } = req.body;

    const hoursWorked = calculateHours(
      clock_in,
      clock_out
    );

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
        ?, ?, ?, ?, ?, ?, 'Manual', 1
      )
      ON DUPLICATE KEY UPDATE
        clock_in = VALUES(clock_in),
        clock_out = VALUES(clock_out),
        status = VALUES(status),
        hours_worked = VALUES(hours_worked),
        source = 'Manual',
        is_manual = 1
      `,
      [
        employee_id,
        attendance_date,
        clock_in,
        clock_out,
        status,
        hoursWorked
      ]
    );

    res.json({
      success: true,
      message: "Attendance saved successfully."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/*
|--------------------------------------------------------------------------
| Update Attendance
|--------------------------------------------------------------------------
*/

const updateAttendance = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      employee_id,
      attendance_date,
      clock_in,
      clock_out,
      status
    } = req.body;

    const hoursWorked = calculateHours(
      clock_in,
      clock_out
    );

    await pool.query(
      `
      UPDATE attendance_logs
      SET
        employee_id=?,
        attendance_date=?,
        clock_in=?,
        clock_out=?,
        status=?,
        hours_worked=?,
        source='Manual',
        is_manual=1
      WHERE id=?
      `,
      [
        employee_id,
        attendance_date,
        clock_in,
        clock_out,
        status,
        hoursWorked,
        id
      ]
    );

    res.json({
      success: true,
      message: "Attendance updated successfully."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

/*
|--------------------------------------------------------------------------
| Delete Attendance
|--------------------------------------------------------------------------
*/

const deleteAttendance = async (req, res) => {

  try {

    await pool.query(
      "DELETE FROM attendance_logs WHERE id=?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Attendance deleted successfully."
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });

  }

};

module.exports = {
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance
};