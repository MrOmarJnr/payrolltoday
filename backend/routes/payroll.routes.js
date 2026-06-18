const express = require("express");

const {
  getPayrollRuns,
  processPayroll,
  getPayrollItems,
} = require("../controllers/payroll.controller");

const router = express.Router();

router.get("/", getPayrollRuns);

router.post("/process", processPayroll);

router.get("/items", getPayrollItems);

module.exports = router;