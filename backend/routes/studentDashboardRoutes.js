const express = require("express");

const {
  getStudentDashboard,
} = require("../controllers/studentDashboardController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/dashboard",
  protect,
  allowRoles("student"),
  getStudentDashboard
);

module.exports = router;