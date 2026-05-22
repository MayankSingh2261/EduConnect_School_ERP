const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["admin", "teacher", "parent", "student"],
      default: "admin",
    },

    resetOtp: {
  type: String,
  default: "",
},

resetOtpExpire: {
  type: Date,
  default: null,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);