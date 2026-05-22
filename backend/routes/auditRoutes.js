const express = require("express");

const {
  getAuditLogs,
} = require("../controllers/auditController");

const {
  protect,
  allowRoles,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  allowRoles("admin"),
  getAuditLogs
);

module.exports = router;