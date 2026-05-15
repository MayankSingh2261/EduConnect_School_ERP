const mongoose = require("mongoose");

const reportCardSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    examType: {
      type: String,
      required: true,
    },

    totalObtained: {
      type: Number,
      required: true,
    },

    totalMarks: {
      type: Number,
      required: true,
    },

    percentage: {
      type: Number,
      required: true,
    },

    grade: {
      type: String,
      required: true,
    },

    pdfPath: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReportCard", reportCardSchema);