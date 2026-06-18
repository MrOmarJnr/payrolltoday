const pool = require("../config/db");

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
      ORDER BY attendance_date DESC
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

const createAttendance = async (req, res) => {
  try {
    const {
      id,
      employee_id,
      attendance_date,
      clock_in,
      clock_out,
      status,
      hours_worked,
      source,
    } = req.body;

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
      VALUES (?,?,?,?,?,?,?,?)
      `,
      [
        id,
        employee_id,
        attendance_date,
        clock_in,
        clock_out,
        status,
        hours_worked,
        source,
      ]
    );

    res.json({
      success: true,
      message: "Attendance created successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      employee_id,
      attendance_date,
      clock_in,
      clock_out,
      status,
      hours_worked,
      source,
    } = req.body;

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
      source=?
      WHERE id=?
      `,
      [
        employee_id,
        attendance_date,
        clock_in,
        clock_out,
        status,
        hours_worked,
        source,
        id,
      ]
    );

    res.json({
      success: true,
      message: "Attendance updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteAttendance = async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM attendance_logs WHERE id=?",
      [req.params.id]
    );

    res.json({
      success: true,
      message: "Attendance deleted successfully",
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
  getAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
};