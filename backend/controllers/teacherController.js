const Teacher = require("../models/Teacher");

// ADD TEACHER
const addTeacher = async (req, res) => {
  try {

    const teacher =
      await Teacher.create(req.body);

    res.status(201).json({
      success: true,
      message: "Teacher added successfully",
      teacher,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to add teacher",
      error: error.message,
    });

  }
};

// GET TEACHERS
const getTeachers = async (req, res) => {
  try {

    const teachers =
      await Teacher.find()
        .sort({ createdAt: -1 })
        .lean();

    res.json({
      success: true,
      teachers,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers",
      error: error.message,
    });

  }
};

module.exports = {
  addTeacher,
  getTeachers,
};