const pool = require("../config/db");

const getSettings = async (req, res) => {
  try {
    const [[company]] = await pool.query(`
      SELECT *
      FROM company_settings
      LIMIT 1
    `);

    const [taxBands] = await pool.query(`
      SELECT *
      FROM tax_bands
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      company,
      taxBands,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateCompanySettings = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      logo_url,
      payroll_year,
    } = req.body;

    await pool.query(
      `
      UPDATE company_settings
      SET
        name=?,
        email=?,
        phone=?,
        address=?,
        logo_url=?,
        payroll_year=?
      WHERE id=1
      `,
      [
        name,
        email,
        phone,
        address,
        logo_url,
        payroll_year,
      ]
    );

    res.json({
      success: true,
      message: "Company settings updated.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updatePayrollSettings = async (req, res) => {
  try {
    const {
      employee_ssnit_rate,
      employer_ssnit_rate,
      default_working_hours,
      late_target_time,
      late_grace_mins,
      late_deduction_rate,
    } = req.body;

    await pool.query(
      `
      UPDATE company_settings
      SET
        employee_ssnit_rate=?,
        employer_ssnit_rate=?,
        default_working_hours=?,
        late_target_time=?,
        late_grace_mins=?,
        late_deduction_rate=?
      WHERE id=1
      `,
      [
        employee_ssnit_rate,
        employer_ssnit_rate,
        default_working_hours,
        late_target_time,
        late_grace_mins,
        late_deduction_rate,
      ]
    );

    res.json({
      success: true,
      message: "Payroll settings updated.",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateTaxBands = async (req, res) => {
  try {
    const { taxBands } = req.body;

    for (const band of taxBands) {
      await pool.query(
        `
        UPDATE tax_bands
        SET
          limit_value=?,
          rate=?
        WHERE id=?
        `,
        [
          band.limit_value,
          band.rate,
          band.id,
        ]
      );
    }

    res.json({
      success: true,
      message: "Tax bands updated.",
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
  getSettings,
  updateCompanySettings,
  updatePayrollSettings,
  updateTaxBands,
};