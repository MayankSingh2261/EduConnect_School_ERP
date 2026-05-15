const Mark = require("../models/Mark");

// ADD MARK
const addMark = async (req, res) => {
  try {

    const mark = await Mark.create(req.body);

    res.status(201).json({
      success: true,
      message: "Marks added successfully",
      mark,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to add marks",
      error: error.message,
    });

  }
};

// GET ALL MARKS
const getMarks = async (req, res) => {
  try {

    const marks = await Mark.find()
      .populate(
        "student",
        "name rollNo className section"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      marks,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch marks",
      error: error.message,
    });

  }
};

// GET MARKS OF SINGLE STUDENT
const getStudentMarks = async (req, res) => {
  try {

    const { studentId } = req.params;

    const marks = await Mark.find({
      student: studentId,
    })
      .populate(
        "student",
        "name rollNo className section"
      )
      .lean();

    if (marks.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No marks found",
      });
    }

    // TOTALS
    const totalObtained = marks.reduce(
      (sum, item) =>
        sum + item.marksObtained,
      0
    );

    const totalMarks = marks.reduce(
      (sum, item) =>
        sum + item.totalMarks,
      0
    );

    // PERCENTAGE
    const percentage =
      totalMarks > 0
        ? (
            (totalObtained / totalMarks) *
            100
          ).toFixed(1)
        : 0;

    // GRADE
    let grade = "F";

    if (percentage >= 90) {
      grade = "A+";
    } else if (percentage >= 75) {
      grade = "A";
    } else if (percentage >= 60) {
      grade = "B";
    } else if (percentage >= 40) {
      grade = "C";
    }

    res.json({
      success: true,

      student: marks[0].student,

      marks,

      summary: {
        totalObtained,
        totalMarks,
        percentage,
        grade,
      },
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch student marks",
      error: error.message,
    });

  }
};

module.exports = {
  addMark,
  getMarks,
  getStudentMarks,
};