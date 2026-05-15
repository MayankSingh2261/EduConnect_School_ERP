const express = require("express");

const {
  createTeacherNotice,
} = require("../controllers/teacherNoticeController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  allowRoles("teacher"),
  createTeacherNotice
);

module.exports = router;