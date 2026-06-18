const router = require("express").Router();
const controller = require("../controllers/hikvision.controller");

router.get("/test", controller.testConnection);
router.get("/events", controller.getAccessEvents);
router.get("/sync", controller.syncEvents);
router.get("/process-attendance", controller.processAttendance);

module.exports = router;