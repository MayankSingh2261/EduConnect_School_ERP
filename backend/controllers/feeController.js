const Fee = require("../models/Fee");
const createAuditLog = require("../utils/auditLogger");

// ADD FEE
const addFee = async (req, res) => {
  try {

    const {
      totalAmount,
      paidAmount,
    } = req.body;

    let status = "Pending";

    if (paidAmount >= totalAmount) {
      status = "Paid";
    } else if (paidAmount > 0) {
      status = "Partial";
    }

    const fee = await Fee.create({
      ...req.body,
      status,
    });
    await createAuditLog({
    req,
    action: "CREATE_FEE_RECORD",
    module: "Fees",
    recordId: fee._id.toString(),
    details: {
    student: fee.student,
    feeType: fee.feeType,
    totalAmount: fee.totalAmount,
    paidAmount: fee.paidAmount,
    status: fee.status,
    },
  });

    res.status(201).json({
      success: true,
      message: "Fee added successfully",
      fee,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to add fee",
      error: error.message,
    });

  }
};

// GET FEES
const getFees = async (req, res) => {
  try {

    const fees = await Fee.find()
      .populate(
        "student",
        "name rollNo className section"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.json({
      success: true,
      fees,
    });

  } catch (error) {

    res.status(500).json({
      success: false,
      message: "Failed to fetch fees",
      error: error.message,
    });

  }
};

module.exports = {
  addFee,
  getFees,
};