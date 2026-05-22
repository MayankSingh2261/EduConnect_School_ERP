const Student = require("../models/Student");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const createAuditLog = require("../utils/auditLogger");
const { sendGuardianWelcomeEmail,} = require("../services/emailService");

// ADD STUDENT
const addStudent = async (req, res) => {
  try {
    const {
      name,
      className,
      section,
      parentName,
      parentPhone,
      parentEmail,
      address,
    } = req.body;

    const lastStudent = await Student.findOne({
      className,
      section,
    })
      .sort({ rollNo: -1 })
      .lean();

    const nextRollNo = lastStudent
      ? String(Number(lastStudent.rollNo) + 1)
      : "1";

    const guardianEmail = parentEmail;

    const existingUser = await User.findOne({
      email: guardianEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Guardian account already exists for this phone number",
      });
    }

    const guardianUser = await User.create({
      name: parentName,
      email: guardianEmail,
      password: await bcrypt.hash(
      `inactive-${Date.now()}`,
      10
    ),

isActivated: false,
      role: "parent",
      phone: parentPhone,
    });

    const student = await Student.create({
      name,
      rollNo: nextRollNo,
      className,
      section,
      parentName,
      parentPhone,
      parentEmail,
      address,
      parentUser: guardianUser._id,
      guardianLoginId: guardianEmail,
      temporaryPassword: "",
      mustChangePassword: false,
    });

const activationOtp = Math.floor(
100000 + Math.random() * 900000
).toString();

guardianUser.activationOtp = activationOtp;
guardianUser.activationOtpExpire =
  new Date(Date.now() + 10 * 60 * 1000);

await guardianUser.save();

let emailResult = {
  success: false,
};

try {
  emailResult = await sendGuardianWelcomeEmail({
    to: guardianEmail,
    parentName,
    studentName: name,
    loginId: guardianEmail,
    otp: activationOtp,
  });

  console.log("Activation email result:", emailResult);
} catch (emailError) {
  console.log(
    "Activation email failed:",
    emailError.message
  );
}

    await createAuditLog({
  req,
  action: "CREATE_STUDENT",
  module: "Students",
  recordId: student._id.toString(),
  details: {
    studentName: student.name,
    className: student.className,
    section: student.section,
    rollNo: student.rollNo,
  },
});

    res.status(201).json({
      success: true,
      message: emailResult.success
        ? "Student added and guardian credentials sent successfully"
        : "Student added successfully, but email failed",
      student,
      email: emailResult,
    });
    } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to add student",
      error: error.message,
    });
  }
};

// Reset password and send credentials to guardian
const resetGuardianPassword = async (req, res) => {
  try {
    const { studentId } = req.params;

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    if (!student.parentUser) {
      return res.status(400).json({
        success: false,
        message: "No guardian account linked with this student",
      });
    }

    const newTempPassword = `Edu@${student.className}${student.section}${student.rollNo}`;

    const hashedPassword = await bcrypt.hash(newTempPassword, 10);

    await User.findByIdAndUpdate(student.parentUser, {
      password: hashedPassword,
    });

    student.temporaryPassword = newTempPassword;
    student.mustChangePassword = true;
    await student.save();
    await createAuditLog({
  req,
  action: "RESET_GUARDIAN_PASSWORD",
  module: "Students",
  recordId: student._id.toString(),
  details: {
    studentName: student.name,
    guardianLoginId: student.guardianLoginId,
  },
});

    res.json({
      success: true,
      message: "Guardian password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset guardian password",
      error: error.message,
    });
  }
};

// GET STUDENTS WITH SEARCH
const getStudents = async (req, res) => {
  try {
    const { search = "" } = req.query;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { rollNo: { $regex: search, $options: "i" } },
            { className: { $regex: search, $options: "i" } },
            { parentPhone: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const students = await Student.find(query)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

// UPDATE STUDENT
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    await createAuditLog({
  req,
  action: "UPDATE_STUDENT",
  module: "Students",
  recordId: student._id.toString(),
  details: {
    studentName: student.name,
    updatedFields: req.body,
  },
});

    res.json({
      success: true,
      message: "Student updated successfully",
      student,
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

// DELETE STUDENT
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }
    await createAuditLog({
  req,
  action: "DELETE_STUDENT",
  module: "Students",
  recordId: student._id.toString(),
  details: {
    message: "Student deleted by admin",
  },
});

    res.json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
    }
};

module.exports = {
  addStudent,
  getStudents,
  updateStudent,
  deleteStudent,
  resetGuardianPassword,
};