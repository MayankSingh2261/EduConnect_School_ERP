const express = require("express");

const {
  markAttendance,
  getAttendanceByDate,
  getAttendanceReport,
} = require("../controllers/attendanceController");

const router = express.Router();

router.post("/mark", markAttendance);
router.get("/:date", getAttendanceByDate);
router.get("/report/all", getAttendanceReport);
module.exports = router;