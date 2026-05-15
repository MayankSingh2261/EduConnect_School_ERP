import { useEffect, useState } from "react";
import API from "../services/api";

export default function StudentDashboard() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/student/dashboard"
      );

      setData(res.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10">
        No dashboard data found
      </div>
    );
  }

  const presentCount =
    data.attendance.filter(
      (a) => a.status === "Present"
    ).length;

  const attendanceRate =
    data.attendance.length > 0
      ? (
          (presentCount /
            data.attendance.length) *
          100
        ).toFixed(1)
      : 0;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Student Dashboard
        </h1>

        <p className="text-emerald-100 mt-2">
          Welcome back,
          {" "}
          {data.student.name}
        </p>

      </div>

      {/* PROFILE */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Student Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div>

            <p className="text-gray-500">
              Name
            </p>

            <h3 className="font-bold text-lg mt-2">
              {data.student.name}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Roll No
            </p>

            <h3 className="font-bold text-lg mt-2">
              {data.student.rollNo}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Class
            </p>

            <h3 className="font-bold text-lg mt-2">
              {data.student.className}
              -
              {data.student.section}
            </h3>

          </div>

          <div>

            <p className="text-gray-500">
              Parent
            </p>

            <h3 className="font-bold text-lg mt-2">
              {data.student.parentName}
            </h3>

          </div>

        </div>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Attendance Rate
          </p>

          <h2 className="text-4xl font-bold text-emerald-600 mt-3">
            {attendanceRate}%
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Total Notices
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {data.notifications.length}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Report Cards
          </p>

          <h2 className="text-4xl font-bold text-violet-600 mt-3">
            {data.reportCards.length}
          </h2>

        </div>

      </div>

    </div>
  );
}