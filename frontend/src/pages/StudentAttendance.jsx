import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function StudentAttendance() {
  const [attendance, setAttendance] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/student/dashboard"
      );

      setAttendance(
        res.data.attendance || []
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const subjectOptions = useMemo(() => {
    return [
      ...new Set(
        attendance.map(
          (a) => a.subject
        )
      ),
    ];
  }, [attendance]);

  const filteredAttendance =
    useMemo(() => {
      return attendance.filter(
        (item) =>
          selectedSubject
            ? item.subject ===
              selectedSubject
            : true
      );
    }, [
      attendance,
      selectedSubject,
    ]);

  const stats = useMemo(() => {
    const total =
      filteredAttendance.length;

    const present =
      filteredAttendance.filter(
        (a) =>
          a.status === "Present"
      ).length;

    const absent =
      filteredAttendance.filter(
        (a) =>
          a.status === "Absent"
      ).length;

    const percentage =
      total > 0
        ? (
            (present / total) *
            100
          ).toFixed(1)
        : 0;

    return {
      total,
      present,
      absent,
      percentage,
    };
  }, [filteredAttendance]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Subject Attendance
        </h1>

        <p className="text-emerald-100 mt-2">
          Track attendance subject-wise.
        </p>

      </div>

      {/* FILTER */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          Filter by Subject
        </h2>

        <select
          value={selectedSubject}
          onChange={(e) =>
            setSelectedSubject(
              e.target.value
            )
          }
          className="w-full md:w-96 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
        >

          <option value="">
            All Subjects
          </option>

          {subjectOptions.map(
            (subject) => (
              <option
                key={subject}
                value={subject}
              >
                {subject}
              </option>
            )
          )}

        </select>

      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Total Classes
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {stats.total}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Present
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {stats.present}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Absent
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            {stats.absent}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Attendance %
          </p>

          <h2 className="text-4xl font-bold text-emerald-600 mt-3">
            {stats.percentage}%
          </h2>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">
            Attendance History
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-gray-50 text-gray-600 text-sm">

              <tr>

                <th className="px-6 py-4 text-left">
                  Date
                </th>

                <th className="px-6 py-4 text-left">
                  Subject
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

              </tr>

            </thead>

            <tbody className="divide-y">

              {loading ? (

                <tr>

                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center"
                  >
                    Loading attendance...
                  </td>

                </tr>

              ) : filteredAttendance.length ===
                0 ? (

                <tr>

                  <td
                    colSpan="3"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No attendance found
                  </td>

                </tr>

              ) : (

                filteredAttendance.map(
                  (item) => (

                    <tr
                      key={item._id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">
                        {new Date(
                          item.date
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4 font-semibold text-blue-700">
                        {
                          item.subject
                        }
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status ===
                            "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {
                            item.status
                          }
                        </span>

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}