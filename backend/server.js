require("dotenv").config();

// Hikvision polling cron. Disabled by default in the cloud (the device is on a
// private LAN the cloud can't reach). Set ENABLE_HIKVISION_CRON=true only when
// the backend runs somewhere that CAN reach the device (e.g. on-prem).
// When off, the on-prem hikvision-agent pushes events via /api/attendance-sync.
if (process.env.ENABLE_HIKVISION_CRON === "true") {
  require("./cron/attendance.cron");
} else {
  console.log("Hikvision cron disabled (ENABLE_HIKVISION_CRON!=true). Using push agent.");
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const authRoutes = require("./routes/auth.routes");
const departmentRoutes = require("./routes/department.routes");
const employeeRoutes = require("./routes/employee.routes");
const attendanceRoutes = require("./routes/attendance.routes");
const leaveRoutes = require("./routes/leave.routes");
const payrollRoutes = require("./routes/payroll.routes");
const payslipRoutes = require("./routes/payslip.routes");
const reportsRoutes = require("./routes/reports.routes");
const settingsRoutes = require("./routes/settings.routes");
const userRoutes = require("./routes/users.routes");
const hikvisionRoutes = require("./routes/hikvision.routes");

// ---- ERP: Finance ----
const expenseCategoryRoutes = require("./routes/expenseCategories.routes");
const expenseRoutes = require("./routes/expenses.routes");
const fuelRoutes = require("./routes/fuel.routes");
const vehicleRoutes = require("./routes/vehicles.routes");
const pettyCashRoutes = require("./routes/pettyCash.routes");
const uploadRoutes = require("./routes/uploads.routes");

// ---- ERP: Inventory ----
const invCategoryRoutes = require("./routes/invCategories.routes");
const warehouseRoutes = require("./routes/warehouses.routes");
const invItemRoutes = require("./routes/invItems.routes");
const stockRoutes = require("./routes/stock.routes");
const assetRoutes = require("./routes/assets.routes");

// ---- Suppliers (shared by Finance & Inventory; Procurement module retired) ----
const supplierRoutes = require("./routes/suppliers.routes");

// ---- ERP: Administration & Dashboards ----
const auditLogRoutes = require("./routes/auditLogs.routes");
const roleRoutes = require("./routes/roles.routes");
const dashboardRoutes = require("./routes/dashboards.routes");

// ---- Mobile (Aura) attendance sync ----
const attendanceSyncRoutes = require("./routes/attendanceSync.routes");




const pool = require("./config/db");

const app = express();

app.use(helmet());

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);

// 10kb is fine for normal API calls, but the Hikvision agent posts batches of
// device events, so allow a larger JSON body.
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(cookieParser());

// Serve uploaded attachments (receipts, etc.)
const path = require("path");
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get("/api/health", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT NOW() AS server_time");

    res.json({
      success: true,
      message: "LEF Payroll API is running securely.",
      database: "Connected",
      serverTime: rows[0].server_time,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Database connection failed.",
      error: error.message,
    });
  }
});



app.use("/api/auth", authRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/leave", leaveRoutes);
app.use("/api/payroll", payrollRoutes);
app.use("/api/payslips", payslipRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/users", userRoutes);
app.use("/api/hikvision", hikvisionRoutes);

// ---- ERP: Finance ----
app.use("/api/expense-categories", expenseCategoryRoutes);
app.use("/api/expenses", expenseRoutes);
app.use("/api/fuel", fuelRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/petty-cash", pettyCashRoutes);
app.use("/api/uploads", uploadRoutes);

// ---- ERP: Inventory ----
app.use("/api/inv-categories", invCategoryRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/inv-items", invItemRoutes);
app.use("/api/stock-movements", stockRoutes);
app.use("/api/assets", assetRoutes);

// ---- Suppliers ----
app.use("/api/suppliers", supplierRoutes);

// ---- ERP: Administration & Dashboards ----
app.use("/api/audit-logs", auditLogRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/dashboards", dashboardRoutes);
app.use("/api/attendance-sync", attendanceSyncRoutes);


const PORT = process.env.PORT || 5000;

require("./utils/ensureSchema")().catch((err) =>
  console.error("Schema check failed:", err.message)
);

app.listen(PORT,"0.0.0.0", () => {
  console.log(`LEF Payroll API running on port ${PORT}`);
});