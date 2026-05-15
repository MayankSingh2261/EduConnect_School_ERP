const Mark = require("../models/Mark");
const ReportCard = require("../models/ReportCard");
const Student = require("../models/Student");

const {
  generateReportCardPDF,
} = require("../services/reportCardService");

// GENERATE SINGLE REPORT CARD
const generateSingleReportCard =
  async (req, res) => {
    try {

      const { studentId } = req.params;

      // FETCH MARKS
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
          message:
            "No marks found for student",
        });
      }

      // STUDENT
      const student = marks[0].student;

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
              (totalObtained /
                totalMarks) *
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

      const summary = {
        totalObtained,
        totalMarks,
        percentage,
        grade,
      };

      // EXAM TYPE
      const examType =
        marks[0].examType ||
        "Final Exam";

      // GENERATE PDF
      const pdfPath =
        await generateReportCardPDF({
          student,
          marks,
          summary,
          examType,
        });

      // SAVE DB
      const reportCard =
        await ReportCard.create({
          student: student._id,
          examType,
          totalObtained,
          totalMarks,
          percentage,
          grade,
          pdfPath,
        });

      res.json({
        success: true,
        message:
          "Report card generated successfully",
        reportCard,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to generate report card",
        error: error.message,
      });

    }
  };

  // GENERATE ALL REPORT CARDS
const generateAllReportCards =
  async (req, res) => {
    try {

      // FETCH ALL STUDENTS
      const students =
        await Student.find().lean();

      let generatedCount = 0;

      for (const student of students) {

        // FETCH MARKS
        const marks = await Mark.find({
          student: student._id,
        })
          .populate(
            "student",
            "name rollNo className section"
          )
          .lean();

        // SKIP IF NO MARKS
        if (marks.length === 0) {
          continue;
        }

        // TOTALS
        const totalObtained =
          marks.reduce(
            (sum, item) =>
              sum +
              item.marksObtained,
            0
          );

        const totalMarks =
          marks.reduce(
            (sum, item) =>
              sum +
              item.totalMarks,
            0
          );

        // PERCENTAGE
        const percentage =
          totalMarks > 0
            ? (
                (totalObtained /
                  totalMarks) *
                100
              ).toFixed(1)
            : 0;

        // GRADE
        let grade = "F";

        if (percentage >= 90) {
          grade = "A+";
        } else if (
          percentage >= 75
        ) {
          grade = "A";
        } else if (
          percentage >= 60
        ) {
          grade = "B";
        } else if (
          percentage >= 40
        ) {
          grade = "C";
        }

        const summary = {
          totalObtained,
          totalMarks,
          percentage,
          grade,
        };

        const examType =
          marks[0].examType ||
          "Final Exam";

        // GENERATE PDF
        const pdfPath =
          await generateReportCardPDF({
            student,
            marks,
            summary,
            examType,
          });

        // SAVE DB
        await ReportCard.create({
          student: student._id,
          examType,
          totalObtained,
          totalMarks,
          percentage,
          grade,
          pdfPath,
        });

        generatedCount++;
      }

      res.json({
        success: true,
        message:
          "Bulk report card generation completed",
        generatedCount,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          "Failed to generate report cards",
        error: error.message,
      });

    }
  };

  // GET ALL REPORT CARDS
const getReportCards = async (req, res) => {
  try {
    const reportCards = await ReportCard.find()
      .populate("student", "name rollNo className section")
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      reportCards,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch report cards",
      error: error.message,
    });
  }
};

module.exports = {
  generateSingleReportCard,
  generateAllReportCards,
  getReportCards,
};