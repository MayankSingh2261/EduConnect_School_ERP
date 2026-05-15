const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Mark = require("../models/Mark");
const Fee = require("../models/Fee");
const ReportCard = require("../models/ReportCard");
const Notification = require("../models/Notification");

const getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findOne({
      studentUser: req.user._id,
    }).lean();

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "No student profile linked to this account",
      });
    }

    const attendance = await Attendance.find({
      student: student._id,
    })
      .sort({ date: -1 })
      .lean();

    const marks = await Mark.find({
      student: student._id,
    }).lean();

    const fees = await Fee.find({
      student: student._id,
    }).lean();

    const reportCards = await ReportCard.find({
      student: student._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    const notifications = await Notification.find({
      student: student._id,
    })
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      student,
      attendance,
      marks,
      fees,
      reportCards,
      notifications,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch student dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getStudentDashboard,
};