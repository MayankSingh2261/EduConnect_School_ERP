const express = require("express");

const {
  getParentDashboard,
} = require("../controllers/parentController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

// PARENT DASHBOARD
router.get(
  "/dashboard",
  protect,
  allowRoles("parent"),
  getParentDashboard
);

module.exports = router;