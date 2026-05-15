const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Mark = require("../models/Mark");
const Fee = require("../models/Fee");
const ReportCard = require("../models/ReportCard");
const Notification = require("../models/Notification");

// GET PARENT DASHBOARD
const getParentDashboard =
  async (req, res) => {
    try {

      // FIND STUDENT LINKED TO PARENT
      const student =
        await Student.findOne({
          parentUser: req.user._id,
        }).lean();

      if (!student) {
        return res.status(404).json({
          success: false,
          message:
            "No student linked to this parent",
        });
      }

      // ATTENDANCE
      const attendance =
        await Attendance.find({
          student: student._id,
        })
          .sort({ date: -1 })
          .lean();

      // MARKS
      const marks = await Mark.find({
        student: student._id,
      }).lean();

      // FEES
      const fees = await Fee.find({
        student: student._id,
      }).lean();

      // REPORT CARDS
      const reportCards =
        await ReportCard.find({
          student: student._id,
        })
          .sort({ createdAt: -1 })
          .lean();

      // NOTIFICATIONS
      const notifications =
        await Notification.find({
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
        message:
          "Failed to fetch parent dashboard",
        error: error.message,
      });

    }
  };

module.exports = {
  getParentDashboard,
};