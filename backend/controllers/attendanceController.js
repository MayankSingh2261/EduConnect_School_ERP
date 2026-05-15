const Attendance = require("../models/Attendance");

const {sendWhatsAppMessage} = require("../services/whatsappService");

const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

const markAttendance = async (req, res) => {
  try {

    const { records, date } = req.body;

    if (!records || !date) {
      return res.status(400).json({
        message: "Records and date are required",
      });
    }

    const teacher = await Teacher.findOne({
  userAccount: req.user._id,
});

if (!teacher) {
  return res.status(404).json({
    success: false,
    message: "Teacher profile not found",
  });
}

    const savedRecords = [];

    for (const item of records) {

      const attendance =
        await Attendance.findOneAndUpdate(
          {
            student: item.student,
            date,
          },
          {
              student: item.student,
              subject: teacher.subject,
              teacher: teacher._id,
              date,
              status: item.status,
            },         
          {
            upsert: true,
            returnDocument: "after",
          }
        );

      savedRecords.push(attendance);

      // SEND ALERT IF ABSENT
      if (item.status === "Absent") {

        const student = await Student.findById(
          item.student
        );

        if (student) {

          await sendWhatsAppMessage(
            student.parentPhone,
            student.name,
            date
          );

        }
      }
    }

    res.json({
      success: true,
      message: "Attendance marked successfully",
      records: savedRecords,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to mark attendance",
      error: error.message,
    });

  }
};

const getAttendanceByDate = async (req, res) => {
  try {
    const { date } = req.params;

    const attendance = await Attendance.find({ date })
      .populate("student", "name rollNo className section parentPhone")
      .lean();

    res.json(attendance);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch attendance",
      error: error.message,
    });
  }
};

// GET FULL ATTENDANCE REPORT
const getAttendanceReport = async (req, res) => {
  try {

    const reports = await Attendance.find()
      .populate(
        "student",
        "name rollNo className section"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      reports,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch report",
      error: error.message,
    });

  }
};

module.exports = {
  markAttendance,
  getAttendanceByDate,
  getAttendanceReport,
};