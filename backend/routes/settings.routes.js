const express = require("express");

const {
  getSettings,
  updateCompanySettings,
  updatePayrollSettings,
  updateTaxBands,
} = require("../controllers/settings.controller");

const router = express.Router();

router.get("/", getSettings);

router.put(
  "/company",
  updateCompanySettings
);

router.put(
  "/payroll",
  updatePayrollSettings
);

router.put(
  "/tax-bands",
  updateTaxBands
);

module.exports = router;