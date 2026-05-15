const Notification = require("../models/Notification");

// CREATE NOTIFICATION
const createNotification = async (
  req,
  res
) => {
  try {

    const notification =
      await Notification.create(req.body);

    res.status(201).json({
      success: true,
      notification,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to create notification",
      error: error.message,
    });

  }
};

// GET ALL NOTIFICATIONS
const getNotifications = async (
  req,
  res
) => {
  try {

    const notifications =
      await Notification.find()
        .sort({ createdAt: -1 })
        .lean();

    res.json({
      success: true,
      notifications,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
      error: error.message,
    });

  }
};

module.exports = {
  createNotification,
  getNotifications,
};