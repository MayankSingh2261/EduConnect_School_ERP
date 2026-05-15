const mongoose = require("mongoose");

const feeSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    feeType: {
      type: String,
      required: true,
      trim: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    paidAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    dueDate: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Paid", "Pending", "Partial"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Fee", feeSchema);