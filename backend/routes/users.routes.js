const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users.controller");

router.get("/", usersController.index);
router.post("/", usersController.store);
router.put("/:id", usersController.update);
router.put("/:id/reset-password", usersController.resetPassword);
router.put("/:id/toggle-status", usersController.toggleStatus);

module.exports = router;