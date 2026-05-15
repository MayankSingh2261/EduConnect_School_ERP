const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Notification = require("../models/Notification");

// CREATE TEACHER NOTICE
const createTeacherNotice = async (req, res) => {
  try {
    const {
      className,
      section,
      title,
      message,
    } = req.body;

    // FIND TEACHER
    const teacher = await Teacher.findOne({
      userAccount: req.user._id,
    });

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }

    // CHECK CLASS ACCESS
    const classKey = `${className}-${section}`;

    if (
      !teacher.assignedClasses.includes(classKey)
    ) {
      return res.status(403).json({
        success: false,
        message:
          "You are not allowed to send notices to this class",
      });
    }

    // FIND STUDENTS
    const students = await Student.find({
      className,
      section,
    });

    // CREATE NOTIFICATIONS
    const notifications = students.map(
  (student) => ({
    student: student._id,

    title,

    message,

    type: "notice",

    sentBy: teacher.name,

    senderRole: "teacher",
  })
);

    await Notification.insertMany(
      notifications
    );

    res.status(201).json({
      success: true,
      message:
        "Notice sent successfully",
      totalStudents:
        students.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to send notice",
      error: error.message,
    });
  }
};

module.exports = {
  createTeacherNotice,
};