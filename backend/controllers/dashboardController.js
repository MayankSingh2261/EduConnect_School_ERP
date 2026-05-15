const Student = require("../models/Student");
const Attendance = require("../models/Attendance");
const Fee = require("../models/Fee");

const getDashboardStats = async (req, res) => {
  try {

    const totalStudents = await Student.countDocuments();

    const today = new Date().toISOString().split("T")[0];

    const presentToday = await Attendance.countDocuments({
      date: today,
      status: "Present",
    });

    const absentToday = await Attendance.countDocuments({
      date: today,
      status: "Absent",
    });

    const fees = await Fee.find().lean();

    const totalCollection = fees.reduce((sum, fee) => sum + fee.paidAmount, 0);

    const totalPending = fees.reduce(
      (sum, fee) => sum + (fee.totalAmount - fee.paidAmount),
      0
    );

    const paidFees = fees.filter((fee) => fee.status === "Paid").length;
    const partialFees = fees.filter((fee) => fee.status === "Partial").length;
    const pendingFees = fees.filter((fee) => fee.status === "Pending").length;

    res.json({
      totalStudents,
      presentToday,
      absentToday,
      totalCollection,
      totalPending,
      paidFees,
      partialFees,
      pendingFees,
    });

  } catch (error) {

    res.status(500).json({
      message: "Failed to fetch dashboard stats",
      error: error.message,
    });

  }
};

module.exports = {
  getDashboardStats,
};