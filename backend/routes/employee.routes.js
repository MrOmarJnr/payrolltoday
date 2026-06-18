const express = require("express");

const {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee,
} = require("../controllers/employee.controller");

const router = express.Router();

router.get("/", getEmployees);

router.get("/:id", getEmployee);

router.post("/", createEmployee);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);

module.exports = router;