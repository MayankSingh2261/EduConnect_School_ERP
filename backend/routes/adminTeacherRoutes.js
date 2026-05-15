const express = require("express");

const {
  getTeacherAnalytics,
} = require(
  "../controllers/adminTeacherController"
);

const {
  protect,
  allowRoles,
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.get(
  "/analytics",
  protect,
  allowRoles("admin"),
  getTeacherAnalytics
);

module.exports = router;