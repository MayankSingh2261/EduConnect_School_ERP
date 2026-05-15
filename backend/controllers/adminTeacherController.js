const Teacher = require("../models/Teacher");
const Mark = require("../models/Mark");
const Attendance = require("../models/Attendance");
const Notification = require("../models/Notification");

const getTeacherAnalytics = async (
  req,
  res
) => {
  try {
    const teachers =
      await Teacher.find().lean();

    const teacherAnalytics =
      await Promise.all(
        teachers.map(async (teacher) => {
          const assignedClasses =
            teacher.assignedClasses || [];

          const classFilters =
            assignedClasses.map(
              (cls) => {
                const [
                  className,
                  section,
                ] = cls.split("-");

                return {
                  "student.className":
                    className?.trim(),

                  "student.section":
                    section?.trim(),
                };
              }
            );

          // MARKS COUNT
          const marksCount =
            await Mark.countDocuments({
              subject:
                teacher.subject,
            });

          // ATTENDANCE COUNT
          const attendanceCount =
            await Attendance.countDocuments();

          // NOTICE COUNT
          const noticesCount =
            await Notification.countDocuments({
              type: "notice",
            });

          return {
            _id: teacher._id,

            name: teacher.name,

            subject:
              teacher.subject,

            assignedClasses,

            marksUploaded:
              marksCount,

            attendanceRecords:
              attendanceCount,

            noticesSent:
              noticesCount,
          };
        })
      );

    res.json({
      success: true,
      teachers:
        teacherAnalytics,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to fetch teacher analytics",
      error: error.message,
    });
  }
};

module.exports = {
  getTeacherAnalytics,
};