const express = require("express");

const {
  getPayslips,
  getPayslipData,
} = require("../controllers/payslip.controller");

const router = express.Router();

router.get("/", getPayslips);

router.get(
  "/:employeeId/:periodMonth",
  getPayslipData
);

module.exports = router;