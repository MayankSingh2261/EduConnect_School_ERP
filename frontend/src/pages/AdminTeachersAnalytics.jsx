import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function AdminTeachersAnalytics() {
  const [teachers, setTeachers] = useState([]);

  const [loading, setLoading] = useState(false);

  const [selectedTeacherId, setSelectedTeacherId] =
    useState("");

  const fetchAnalytics = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/admin-teachers/analytics"
      );

      setTeachers(res.data.teachers || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load analytics"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const selectedTeacher = useMemo(() => {
    return teachers.find(
      (teacher) =>
        teacher._id === selectedTeacherId
    );
  }, [teachers, selectedTeacherId]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Teacher Analytics
        </h1>

        <p className="text-blue-100 mt-2">
          Monitor teacher activity and academic operations.
        </p>

      </div>

      {/* TOP STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Total Teachers
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {teachers.length}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Subjects Covered
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {
              [
                ...new Set(
                  teachers.map(
                    (t) => t.subject
                  )
                ),
              ].length
            }
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Total Marks Uploaded
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-3">
            {teachers.reduce(
              (sum, t) =>
                sum + t.marksUploaded,
              0
            )}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Total Notices Sent
          </p>

          <h2 className="text-3xl font-bold text-violet-600 mt-3">
            {teachers.reduce(
              (sum, t) =>
                sum + t.noticesSent,
              0
            )}
          </h2>

        </div>

      </div>

      {/* SELECT TEACHER */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          Select Teacher
        </h2>

        <select
          value={selectedTeacherId}
          onChange={(e) =>
            setSelectedTeacherId(
              e.target.value
            )
          }
          className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
        >

          <option value="">
            Choose Teacher
          </option>

          {teachers.map((teacher) => (
            <option
              key={teacher._id}
              value={teacher._id}
            >
              {teacher.name} •{" "}
              {teacher.subject}
            </option>
          ))}

        </select>

      </div>

      {/* TEACHER DETAILS */}
      {!selectedTeacher ? (

        <div className="bg-white rounded-3xl border shadow-sm p-10 text-center text-gray-500">

          Select a teacher to view analytics.

        </div>

      ) : (

        <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

          {/* TOP */}
          <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white p-8">

            <h2 className="text-3xl font-bold">
              {selectedTeacher.name}
            </h2>

            <p className="text-blue-100 mt-2 text-lg">
              {selectedTeacher.subject}
            </p>

          </div>

          {/* BODY */}
          <div className="p-8 space-y-8">

            {/* ASSIGNED CLASSES */}
            <div>

              <h3 className="text-xl font-semibold mb-4">
                Assigned Classes
              </h3>

              <div className="flex flex-wrap gap-3">

                {selectedTeacher.assignedClasses.map(
                  (cls) => (
                    <span
                      key={cls}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-semibold"
                    >
                      {cls}
                    </span>
                  )
                )}

              </div>

            </div>

            {/* ANALYTICS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div className="bg-gray-50 rounded-3xl p-6 text-center">

                <p className="text-gray-500">
                  Marks Uploaded
                </p>

                <h2 className="text-4xl font-bold text-green-600 mt-3">
                  {
                    selectedTeacher.marksUploaded
                  }
                </h2>

              </div>

              <div className="bg-gray-50 rounded-3xl p-6 text-center">

                <p className="text-gray-500">
                  Attendance Records
                </p>

                <h2 className="text-4xl font-bold text-blue-600 mt-3">
                  {
                    selectedTeacher.attendanceRecords
                  }
                </h2>

              </div>

              <div className="bg-gray-50 rounded-3xl p-6 text-center">

                <p className="text-gray-500">
                  Notices Sent
                </p>

                <h2 className="text-4xl font-bold text-violet-600 mt-3">
                  {
                    selectedTeacher.noticesSent
                  }
                </h2>

              </div>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}