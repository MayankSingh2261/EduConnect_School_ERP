const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const Student = require("../models/Student");
const Teacher = require("../models/Teacher");

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

    res.json({
      message: "Login successful",
      token,

      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
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

module.exports = {
  registerAdmin,
  loginUser,
  registerParent,
  registerTeacher,
  registerStudent,
};