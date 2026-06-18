const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| GET ALL DEPARTMENTS
|--------------------------------------------------------------------------
*/
const getDepartments = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT *
      FROM departments
      ORDER BY name ASC
    `);

    return res.json({
      success: true,
      data: rows,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to load departments.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| CREATE DEPARTMENT
|--------------------------------------------------------------------------
*/
const createDepartment = async (req, res) => {
  try {
    const { name, code, description } = req.body;

    if (!name || !code) {
      return res.status(400).json({
        success: false,
        message: "Name and code are required.",
      });
    }

    const id = `DEPT${Date.now()}`;

    await pool.query(
      `
      INSERT INTO departments
      (
        id,
        name,
        code,
        description
      )
      VALUES
      (
        ?,
        ?,
        ?,
        ?
      )
    `,
      [
        id,
        name.trim(),
        code.trim().toUpperCase(),
        description || "",
      ]
    );

    return res.json({
      success: true,
      message: "Department created successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create department.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| UPDATE DEPARTMENT
|--------------------------------------------------------------------------
*/
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    const { name, code, description } = req.body;

    await pool.query(
      `
      UPDATE departments
      SET
        name = ?,
        code = ?,
        description = ?
      WHERE id = ?
    `,
      [
        name.trim(),
        code.trim().toUpperCase(),
        description || "",
        id,
      ]
    );

    return res.json({
      success: true,
      message: "Department updated successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update department.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| DELETE DEPARTMENT
|--------------------------------------------------------------------------
*/
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      `
      DELETE FROM departments
      WHERE id = ?
    `,
      [id]
    );

    return res.json({
      success: true,
      message: "Department deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete department.",
    });
  }
};

module.exports = {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};