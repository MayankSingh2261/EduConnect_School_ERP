const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Mark = require("../models/Mark");
const Attendance = require("../models/Attendance");

const getTeacherDashboard = async (req, res) => {
  try {
    const teacher = await Teacher.findOne({
      userAccount: req.user._id,
    }).lean();

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "No teacher profile linked to this account",
      });
    }

    const classFilters = teacher.assignedClasses.map((cls) => {
      const [className, section] = cls.split("-");

      return {
        className: className?.trim(),
        section: section?.trim(),
      };
    });

    const students = await Student.find({
      $or: classFilters,
    })
      .sort({ className: 1, section: 1, rollNo: 1 })
      .lean();

    const studentIds = students.map((student) => student._id);

    const marks = await Mark.find({
      student: { $in: studentIds },
    })
      .populate("student", "name rollNo className section")
      .sort({ createdAt: -1 })
      .lean();

    const attendance = await Attendance.find({
      student: { $in: studentIds },
    })
      .populate("student", "name rollNo className section")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.json({
      success: true,
      teacher,
      students,
      marks,
      attendance,
      stats: {
        assignedClasses: teacher.assignedClasses.length,
        totalStudents: students.length,
        totalMarksUploaded: marks.length,
        recentAttendanceRecords: attendance.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher dashboard",
      error: error.message,
    });
  }
};

module.exports = {
  getTeacherDashboard,
};