import { BrowserRouter, Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Login from "./pages/Login";
import ProtectedRoute from "./routes/ProtectedRoute";
import Attendance from "./pages/Attendance";
import AttendanceReport from "./pages/AttendanceReport";
import Results from "./pages/Results";
import Fees from "./pages/Fees";
import Teachers from "./pages/Teachers";
import Notifications from "./pages/Notifications";
import ReportCards from "./pages/ReportCards";
import ParentLayout from "./layouts/ParentLayout";
import ParentDashboard from "./pages/ParentDashboard";
import ParentRoute from "./routes/ParentRoute";
import TeacherLayout from "./layouts/TeacherLayout";
import TeacherDashboard from "./pages/TeacherDashboard";
import TeacherRoute from "./routes/TeacherRoute"; 
import TeacherStudents from "./pages/TeacherStudents";
import TeacherAttendance from "./pages/TeacherAttendance";
import TeacherMarks from "./pages/TeacherMarks";
import TeacherMarksHistory from "./pages/TeacherMarksHistory";
import TeacherNotices from "./pages/TeacherNotices";
import TeacherAttendanceHistory from "./pages/TeacherAttendanceHistory";
import AdminTeachersAnalytics from "./pages/AdminTeachersAnalytics";
import StudentLayout from "./layouts/StudentLayout";
import StudentDashboard from "./pages/StudentDashboard";
import StudentRoute from "./routes/StudentRoute";
import StudentAttendance from "./pages/StudentAttendance";
import StudentMarks from "./pages/StudentMarks";
import StudentNotices from "./pages/StudentNotices";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Login */}
        <Route path="/login" element={<Login />} />

        {/* Protected Dashboard Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="students" element={<Students />} />
          <Route path="attendance" element={<Attendance />} />
          <Route path="attendance-report" element={<AttendanceReport />} />
          <Route path="results" element={<Results />} />
          <Route path="fees" element={<Fees />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="notifications" element={<Notifications />}/>
          <Route path="report-cards" element={<ReportCards />} />
          <Route path="teacher-analytics" element={<AdminTeachersAnalytics />}/>
        </Route>

        {/* Parent Routes */}
        <Route
          path="/parent"
          element={
            <ParentRoute>
              <ParentLayout />
            </ParentRoute>
          }
        >
          <Route index element={<ParentDashboard />} />
        </Route>

          {/* Student Routes */}
          <Route
  path="/student"
  element={
    <StudentRoute>
      <StudentLayout />
    </StudentRoute>
  }
>
  <Route
  path="attendance"
  element={<StudentAttendance />}
/>
<Route
  path="marks"
  element={<StudentMarks />}
/>
<Route
  path="notices"
  element={<StudentNotices />}
/>
  <Route
    index
    element={<StudentDashboard />}
  />
  
</Route>

        {/* Teacher Routes */}
        <Route
            path="/teacher"
            element={
                <TeacherRoute>
                <TeacherLayout />
                </TeacherRoute>
                    }
                  >
            <Route index element={<TeacherDashboard />} />
            <Route path="students" element={<TeacherStudents />} />
            <Route path="attendance" element={<TeacherAttendance />} />
            <Route path="marks" element={<TeacherMarks />}/>
            <Route path="marks-history" element={<TeacherMarksHistory />}/>
            <Route path="notices" element={<TeacherNotices />}/>
            <Route path="attendance-history" element={<TeacherAttendanceHistory />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}