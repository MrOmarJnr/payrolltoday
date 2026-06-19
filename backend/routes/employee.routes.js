const express = require("express");
const multer = require("multer");

const {
  getEmployees,
  getEmployee,
  createEmployee,
  deleteEmployee,
  updateEmployee,
  importEmployees,
} = require("../controllers/employee.controller");

const router = express.Router();

const upload = multer({
  dest: "uploads/",
});

router.get("/", getEmployees);

router.get("/:id", getEmployee);

router.post("/", createEmployee);

router.post(
  "/import",
  upload.single("file"),
  importEmployees
);

router.put("/:id", updateEmployee);

router.delete("/:id", deleteEmployee);

module.exports = router;