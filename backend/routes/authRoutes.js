const express = require("express");

const {
  registerAdmin,
  loginUser,
  registerParent,
  registerTeacher,
  registerStudent,
  changePassword,
  forgotPassword,
  resetPasswordWithOtp,
} = require("../controllers/authController");

const { protect,} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginUser);
router.post("/register-parent", registerParent);
router.post("/register-teacher", registerTeacher);
router.post( "/register-student", registerStudent);
router.put( "/change-password",protect, changePassword);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPasswordWithOtp);

module.exports = router;