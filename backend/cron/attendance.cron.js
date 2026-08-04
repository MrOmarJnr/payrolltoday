const cron = require("node-cron");
const hikvisionService = require("../services/hikvision.service");

console.log("Attendance Cron Loaded");

cron.schedule("*/1 * * * *", async () => {

    try {

        console.log("======================================");
        console.log("Running Hikvision Synchronization...");
        console.log("======================================");

        // STEP 1
        // Pull latest events from Hikvision
        const syncResult =
            await hikvisionService.syncEvents();

        console.log(
            `Raw Imported: ${syncResult.inserted} | Skipped: ${syncResult.skipped}`
        );

        // STEP 2
        // Import raw logs into biometric_logs
        const rawResult =
            await hikvisionService.processRawLogs();

        console.log(
            `Biometric Imported: ${rawResult.imported} | Attendance Updated: ${rawResult.attendanceUpdated}`
        );

        // STEP 3
        // Recalculate attendance for safety
        const attendanceResult =
            await hikvisionService.processAttendance();

        console.log(
            `Attendance Processed: ${attendanceResult.processed}`
        );

        console.log("Attendance Synchronization Complete");

    }
    catch (err) {

        console.error("Attendance Cron Error");
        console.error(err);

    }

});