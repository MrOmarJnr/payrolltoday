const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.index = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        u.id,
        u.employee_id,
        u.full_name,
        u.username,
        u.email,
        u.is_active,
        u.last_login,
        u.role_id,
        r.name AS role_name
      FROM users u
      LEFT JOIN roles r ON r.id = u.role_id
      ORDER BY u.full_name
    `);

    res.json({
      success: true,
      data: rows,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.store = async (req, res) => {
  try {
    const {
      full_name,
      username,
      email,
      password,
      role_id,
      employee_id,
    } = req.body;

const password_hash = await bcrypt.hash(password, 10);
    await db.query(
      `
      INSERT INTO users
      (
        employee_id,
        role_id,
        full_name,
        username,
        email,
        password_hash
      )
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        employee_id || null,
        role_id,
        full_name,
        username,
        email,
        password_hash,
      ]
    );

    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      full_name,
      username,
      email,
      role_id,
      employee_id,
    } = req.body;

    await db.query(
      `
      UPDATE users
      SET
        full_name = ?,
        username = ?,
        email = ?,
        role_id = ?,
        employee_id = ?
      WHERE id = ?
      `,
      [
        full_name,
        username,
        email,
        role_id,
        employee_id || null,
        id,
      ]
    );

    res.json({
      success: true,
      message: "User updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    const password_hash = await bcrypt.hash(password, 10);

    await db.query(
      `
      UPDATE users
      SET password_hash = ?
      WHERE id = ?
      `,
      [password_hash, id]
    );

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.toggleStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await db.query(
      `SELECT is_active FROM users WHERE id = ?`,
      [id]
    );

    const current = rows[0]?.is_active ?? 0;

    await db.query(
      `
      UPDATE users
      SET is_active = ?
      WHERE id = ?
      `,
      [current ? 0 : 1, id]
    );

    res.json({
      success: true,
      message: "User status updated",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};