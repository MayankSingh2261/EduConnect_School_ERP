import { useEffect, useState } from "react";
import API from "../services/api";

export default function TeacherDashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      const res = await API.get("/teacher/dashboard");
      setData(res.data);
    };

    fetchDashboard();
  }, []);

  if (!data) {
    return <div className="p-10">Loading teacher dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-violet-700 to-violet-500 text-white rounded-3xl p-8">
        <h1 className="text-3xl font-bold">Teacher Dashboard</h1>
        <p className="text-violet-100 mt-2">
          Welcome, {data.teacher.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-gray-500">Assigned Classes</p>
          <h2 className="text-3xl font-bold mt-3">{data.stats.assignedClasses}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-gray-500">Students</p>
          <h2 className="text-3xl font-bold mt-3">{data.stats.totalStudents}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-gray-500">Marks Uploaded</p>
          <h2 className="text-3xl font-bold mt-3">{data.stats.totalMarksUploaded}</h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-gray-500">Attendance Records</p>
          <h2 className="text-3xl font-bold mt-3">{data.stats.recentAttendanceRecords}</h2>
        </div>
      </div>
    </div>
  );
}