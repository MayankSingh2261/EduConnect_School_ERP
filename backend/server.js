const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const markRoutes = require("./routes/markRoutes");
const feeRoutes = require("./routes/feeRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const teacherRoutes = require("./routes/teacherRoutes");
const reportCardRoutes = require( "./routes/reportCardRoutes");
const parentRoutes = require( "./routes/parentRoutes");
const teacherDashboardRoutes = require("./routes/teacherDashboardRoutes");
const teacherNoticeRoutes = require( "./routes/teacherNoticeRoutes");
const adminTeacherRoutes = require( "./routes/adminTeacherRoutes");
const studentDashboardRoutes = require("./routes/studentDashboardRoutes");
const auditRoutes = require("./routes/auditRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static( path.join(__dirname, "uploads") ));

app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/marks", markRoutes);
app.use("/api/fees", feeRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/teachers", teacherRoutes);
app.use( "/api/report-cards", reportCardRoutes);
app.use("/api/parent", parentRoutes);
app.use("/api/teacher", teacherDashboardRoutes);
app.use( "/api/teacher-notices", teacherNoticeRoutes);
app.use( "/api/admin-teachers", adminTeacherRoutes);
app.use("/api/student", studentDashboardRoutes);
app.use("/api/audit-logs", auditRoutes);

app.get("/", (req, res) => {
  res.send("EduConnect Backend Running");
});

app.get("/test", (req, res) => {
  res.send("Test route working");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});