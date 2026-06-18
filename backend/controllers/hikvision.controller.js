const service = require("../services/hikvision.service");

const testConnection = async (req, res) => {
  try {
    const result = await service.getDeviceInfo();

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getAccessEvents = async (req, res) => {
  try {
    const result = await service.getAccessEvents();

    res.json({
      success: true,
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const syncEvents = async (req, res) => {
  try {
    const result = await service.syncEvents();

    res.json({
      success: true,
      inserted: result.inserted,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const processAttendance = async (req, res) => {
  try {

    const result =
      await service.processAttendance();

    res.json({
      success: true,
      processed: result.processed
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message
    });

  }
};



module.exports = {
  testConnection,
  getAccessEvents,
  syncEvents,
  processAttendance
};

 