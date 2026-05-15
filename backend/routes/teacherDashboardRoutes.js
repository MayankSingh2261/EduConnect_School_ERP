const express = require("express");

const {
  getTeacherDashboard,
} = require("../controllers/teacherDashboardController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  allowRoles("teacher"),
  getTeacherDashboard
);

module.exports = router;