/*
|--------------------------------------------------------------------------
| LEF ERP — one-shot setup runner
|--------------------------------------------------------------------------
| Usage (from the backend/ folder):
|     node migrations/erp_setup.js            # schema + roles + sample data
|     node migrations/erp_setup.js --no-seed  # schema + roles only
|
| Safe to run repeatedly: schema uses IF NOT EXISTS, seeds use INSERT IGNORE,
| and the roles step checks for existing rows first. It NEVER touches the
| existing HR tables' structure.
*/
require("dotenv").config();
const fs = require("fs");
const path = require("path");
const mysql = require("mysql2/promise");

const WANT_SEED = !process.argv.includes("--no-seed");

// The roles the ERP relies on. Existing ones are left untouched.
const REQUIRED_ROLES = [
  "Administrator",
  "HR Officer",
  "Payroll Officer",
  "Finance Officer",
  "Procurement Officer",
  "Read Only",
];

async function runSqlFile(conn, file) {
  const full = path.join(__dirname, file);
  if (!fs.existsSync(full)) {
    console.log(`  · skipped (not found): ${file}`);
    return;
  }
  const sql = fs.readFileSync(full, "utf8");
  await conn.query(sql); // multipleStatements enabled below
  console.log(`  ✓ executed ${file}`);
}

async function ensureRoles(conn) {
  const [cols] = await conn.query("SHOW COLUMNS FROM roles");
  const idCol = cols.find((c) => c.Field === "id");
  const autoInc = idCol && /auto_increment/i.test(idCol.Extra || "");
  const hasDescription = cols.some((c) => c.Field === "description");

  for (const name of REQUIRED_ROLES) {
    const [rows] = await conn.query("SELECT id FROM roles WHERE name = ? LIMIT 1", [name]);
    if (rows.length) continue;

    try {
      if (autoInc) {
        if (hasDescription) {
          await conn.query("INSERT INTO roles (name, description) VALUES (?, ?)", [name, `${name} role`]);
        } else {
          await conn.query("INSERT INTO roles (name) VALUES (?)", [name]);
        }
      } else {
        // Non auto-increment id: derive next numeric id, fall back to a slug.
        const [[mx]] = await conn.query("SELECT MAX(CAST(id AS UNSIGNED)) AS m FROM roles");
        const nextId = (Number(mx.m) || 0) + 1;
        if (hasDescription) {
          await conn.query("INSERT INTO roles (id, name, description) VALUES (?, ?, ?)", [nextId, name, `${name} role`]);
        } else {
          await conn.query("INSERT INTO roles (id, name) VALUES (?, ?)", [nextId, name]);
        }
      }
      console.log(`  ✓ role ensured: ${name}`);
    } catch (e) {
      console.warn(`  ! could not add role "${name}": ${e.message}`);
    }
  }
}

(async () => {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    multipleStatements: true,
  });

  try {
    console.log("LEF ERP setup starting…");
    console.log("→ Schema");
    await runSqlFile(conn, "erp_schema.sql");

    console.log("→ Roles");
    await ensureRoles(conn);

    if (WANT_SEED) {
      console.log("→ Sample data");
      await runSqlFile(conn, "erp_seed_sample.sql");
    }

    console.log("\n✅ LEF ERP setup complete.");
  } catch (e) {
    console.error("\n❌ Setup failed:", e.message);
    process.exitCode = 1;
  } finally {
    await conn.end();
  }
})();
