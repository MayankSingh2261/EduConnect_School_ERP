const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "attendance",
        "fee",
        "result",
        "general",
         "notice"
      ],
      default: "general",
    },

    sentBy: {
        type: String,
        default: "System",
        },

    senderRole: {
  type: String,
  enum: [
    "admin",
    "teacher",
    "system",
  ],
  default: "system",
      },

    isRead: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);