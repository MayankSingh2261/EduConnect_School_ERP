const express = require("express");

const {
  registerAdmin,
  loginUser,
  registerParent,
  registerTeacher,
  registerStudent,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", loginUser);
router.post("/register-parent", registerParent);
router.post("/register-teacher", registerTeacher);
router.post( "/register-student", registerStudent);

module.exports = router;