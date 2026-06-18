const express = require("express");
const router = express.Router();

const {
  getReportsData,
} = require("../controllers/reports.controller");

router.get("/", getReportsData);

module.exports = router;