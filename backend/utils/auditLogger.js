const AuditLog = require("../models/AuditLog");

const createAuditLog = async ({
  req,
  action,
  module,
  recordId = "",
  details = {},
}) => {
  try {
    if (!req.user) return;

    await AuditLog.create({
      admin: req.user._id,
      adminName: req.user.name,
      adminEmail: req.user.email,
      action,
      module,
      recordId,
      details,
      ipAddress:
        req.headers["x-forwarded-for"] ||
        req.socket.remoteAddress ||
        req.ip ||
        "",
      userAgent: req.headers["user-agent"] || "",
    });
  } catch (error) {
    console.log("Audit log failed:", error.message);
  }
};

module.exports = createAuditLog;