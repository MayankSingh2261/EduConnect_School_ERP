const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");
const { sendPasswordResetOtpEmail,} = require("../services/emailService");

// REGISTER
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // CHECK USER
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists",
      });
    }

    // HASH PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);

    // CREATE USER
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "admin",
    });

    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// LOGIN
const loginUser = async (req, res) => {
  try {

    const { email, password } = req.body;

    // FIND USER
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // CHECK PASSWORD
    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    // GENERATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const student = await Student.findOne({
    parentUser: user._id,
    });
    const teacher = await Teacher.findOne({
    userAccount: user._id,
    });

    res.json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        mustChangePassword:
          student?.mustChangePassword ||
          teacher?.mustChangePassword ||
          false,
      },
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error: error.message,
    });

  }
};

// Register Parent
const registerParent = async (req, res) => {
  try {
    const { name, email, password, studentId } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Parent already exists",
      });
    }

    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const parent = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "parent",
      phone: student.parentPhone,
    });

    student.parentUser = parent._id;
    await student.save();

    res.status(201).json({
      success: true,
      message: "Parent account created successfully",
      parent: {
        id: parent._id,
        name: parent.name,
        email: parent.email,
        role: parent.role,
      },
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create parent account",
      error: error.message,
    });
  }
};

// Register Teacher
const registerTeacher = async (req, res) => {
  try {
    const { name, email, password, teacherId } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Teacher account already exists",
      });
    }

    const teacher = await Teacher.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        message: "Teacher profile not found",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "teacher",
      phone: teacher.phone,
    });

    teacher.userAccount = user._id;
    teacher.temporaryPassword = password;
    teacher.mustChangePassword = true;

    await teacher.save();

    res.status(201).json({
      success: true,
      message: "Teacher account created successfully",
      teacher,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to create teacher account",
      error: error.message,
    });
  }
};

//Student Registration (For Admin)
const registerStudent = async (
  req,
  res
) => {
  try {
    const {
      name,
      email,
      password,
      studentId,
    } = req.body;

    const existingUser =
      await User.findOne({
        email,
      });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message:
          "Student account already exists",
      });
    }

    const student =
      await Student.findById(
        studentId
      );

    if (!student) {
      return res.status(404).json({
        success: false,
        message:
          "Student profile not found",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
        role: "student",
        phone:
          student.parentPhone,
      });

    student.studentUser =
      user._id;

    await student.save();

    res.status(201).json({
      success: true,
      message:
        "Student account created successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to create student account",
      error:
        error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } =
      req.body;

    const user = await User.findById(
      req.user._id
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        currentPassword,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message:
          "Current password is incorrect",
      });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be same as temporary password",
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        newPassword,
        10
      );

    user.password = hashedPassword;

    await user.save();

    // UPDATE STUDENT FLAG
    await Student.findOneAndUpdate(
      {
        parentUser: user._id,
      },
      {
        mustChangePassword: false,
        temporaryPassword: "",
      }
    );

    await Teacher.findOneAndUpdate(
  {
    userAccount: user._id,
  },
  {
    mustChangePassword: false,
    temporaryPassword: "",
  }
);

    res.json({
      success: true,
      message:
        "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message:
        "Failed to change password",
      error: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    console.log("Forgot password API hit");

    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Account not found",
      });
    }

    if (!["parent", "teacher"].includes(user.role)) {
      return res.status(403).json({
        success: false,
        message: "Password reset allowed only for guardians and teachers",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    user.resetOtp = otp;
    user.resetOtpExpire =
      new Date(Date.now() + 10 * 60 * 1000);

    await user.save();

    const emailResult =
      await sendPasswordResetOtpEmail({
        to: user.email,
        name: user.name,
        otp,
      });

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        message:
          "OTP generated but email sending failed",
        error: emailResult.error,
      });
    }

    res.json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to send OTP",
      error: error.message,
    });
  }
};

const resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({
      email,
      resetOtp: otp,
      resetOtpExpire: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetOtp = "";
    user.resetOtpExpire = null;
    user.isActivated = true;

    await user.save();

    await Student.findOneAndUpdate(
      { parentUser: user._id },
      {
        mustChangePassword: false,
        temporaryPassword: "",
      }
    );

    await Teacher.findOneAndUpdate(
      { userAccount: user._id },
      {
        mustChangePassword: false,
        temporaryPassword: "",
      }
    );

    res.json({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
};

module.exports = {
  registerAdmin,
  loginUser,
  registerParent,
  registerTeacher,
  registerStudent,
  changePassword,
  forgotPassword,
  resetPasswordWithOtp,
};