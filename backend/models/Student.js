const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    rollNo: {
      type: String,
      required: true,
      trim: true,
    },

    className: {
      type: String,
      required: true,
    },

    section: {
      type: String,
      required: true,
    },

    parentName: {
      type: String,
      required: true,
    },

    parentPhone: {
      type: String,
      required: true,
    },

    parentEmail: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "",
    },

    guardianLoginId: {
      type: String,
      default: "",
    },

    temporaryPassword: {
      type: String,
      default: "",
    },

    mustChangePassword: {
      type: Boolean,
      default: true,
    },    

    // LINKED PARENT ACCOUNT
    parentUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    studentUser: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  default: null,
},
  },
  { timestamps: true }
);

// UNIQUE INDEX
studentSchema.index(
  {
    rollNo: 1,
    className: 1,
    section: 1,
  },
  { unique: true }
);

module.exports = mongoose.model(
  "Student",
  studentSchema
);