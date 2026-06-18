const cron = require("node-cron");
const hikvisionService = require("../services/hikvision.service");
console.log("Attendance Cron Loaded");

cron.schedule("*/1 * * * *", async () => {
  try {

    console.log("Running Hikvision Sync...");

    const result =
      await hikvisionService.syncEvents();

    console.log(
      `Imported ${result.inserted} new events`
    );

    await hikvisionService.processAttendance();

    console.log("Attendance Updated");

  } catch (err) {
    console.error(err);
  }
});