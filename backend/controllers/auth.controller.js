const bcrypt = require("bcryptjs");
const pool = require("../config/db");
const { signToken } = require("../utils/token");

const login = async (req, res) => {
  try {
    console.log("HEADERS:", req.headers);
    console.log("BODY:", req.body);

    const { username, password } = req.body || {};
    if (!req.body) {
  return res.status(400).json({
    success: false,
    message: "Request body is empty.",
  });
}
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required.",
      });
    }

    const [rows] = await pool.query(
      `SELECT 
          users.id,
          users.username,
          users.email,
          users.full_name,
          users.password_hash,
          users.is_active,
          roles.name AS role
       FROM users
       INNER JOIN roles ON users.role_id = roles.id
       WHERE users.username = ? OR users.email = ?
       LIMIT 1`,
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    const user = rows[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password.",
      });
    }

    await pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = ?",
      [user.id]
    );

    const token = signToken(user);

    return res.json({
      success: true,
      message: "Login successful.",
      token,
      user: {
        id: user.id,
        username: user.username,
        fullName: user.full_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

module.exports = {
  login,
};