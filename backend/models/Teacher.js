const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    teacherId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    phone: {
      type: String,
      required: true,
    },

    subject: {
      type: String,
      required: true,
    },

    qualification: {
      type: String,
      default: "",
    },

    assignedClasses: [
      {
        type: String,
      },
    ],

    userAccount: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    temporaryPassword: {
      type: String,
      default: "",
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model(
  "Teacher",
  teacherSchema
);