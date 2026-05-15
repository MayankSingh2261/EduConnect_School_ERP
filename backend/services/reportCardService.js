const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateReportCardPDF = async ({
  student,
  marks,
  summary,
  examType,
}) => {

  // CREATE FILE NAME
  const fileName =
    `${student.rollNo}-${Date.now()}.pdf`;

  // FILE PATH
  const filePath = path.join(
    __dirname,
    "../uploads/report-cards",
    fileName
  );

  // CREATE PDF
  const doc = new PDFDocument({
    margin: 50,
  });

  // STREAM
  doc.pipe(
    fs.createWriteStream(filePath)
  );

  // HEADER
  doc
    .fontSize(24)
    .fillColor("#1e3a8a")
    .text("EDUCONNECT SCHOOL", {
      align: "center",
    });

  doc
    .fontSize(14)
    .fillColor("black")
    .text("Academic Report Card", {
      align: "center",
    });

  doc.moveDown(2);

  // STUDENT INFO
  doc
    .fontSize(12)
    .text(`Student Name: ${student.name}`);

  doc.text(`Roll No: ${student.rollNo}`);

  doc.text(
    `Class: ${student.className}-${student.section}`
  );

  doc.text(`Exam Type: ${examType}`);

  doc.moveDown(2);

  // TABLE HEADER
  doc
    .fontSize(14)
    .fillColor("#1e3a8a")
    .text("Subject Performance");

  doc.moveDown(1);

  // SUBJECTS
  marks.forEach((mark, index) => {

    doc
      .fontSize(12)
      .fillColor("black")
      .text(
        `${index + 1}. ${mark.subject}`
      );

    doc.text(
      `Marks: ${mark.marksObtained}/${mark.totalMarks}`
    );

    doc.moveDown(0.5);

  });

  doc.moveDown(1);

  // SUMMARY
  doc
    .fontSize(14)
    .fillColor("#1e3a8a")
    .text("Overall Performance");

  doc.moveDown(1);

  doc
    .fontSize(12)
    .fillColor("black")
    .text(
      `Total Marks: ${summary.totalObtained}/${summary.totalMarks}`
    );

  doc.text(
    `Percentage: ${summary.percentage}%`
  );

  doc.text(`Grade: ${summary.grade}`);

  doc.text(
    `Result: ${
      summary.percentage >= 40
        ? "PASS"
        : "FAIL"
    }`
  );

  doc.moveDown(3);

  // SIGNATURES
  doc.text(
    "Class Teacher Signature: __________________"
  );

  doc.moveDown(2);

  doc.text(
    "Principal Signature: __________________"
  );

  // FOOTER
  doc.moveDown(4);

  doc
    .fontSize(10)
    .fillColor("gray")
    .text(
      "This is a system generated report card.",
      {
        align: "center",
      }
    );

  // END PDF
  doc.end();

  // RETURN PATH
  return `/uploads/report-cards/${fileName}`;
};

module.exports = {
  generateReportCardPDF,
};