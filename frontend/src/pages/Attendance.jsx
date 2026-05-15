import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function Attendance() {
  const today = new Date().toISOString().split("T")[0];

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(today);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await API.get("/students");
      const studentList = res.data.students || res.data;

      setStudents(studentList);

      const defaultAttendance = {};
      studentList.forEach((student) => {
        defaultAttendance[student._id] = "Present";
      });

      setAttendance(defaultAttendance);
    } catch (error) {
      alert("Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const summary = useMemo(() => {
    const present = Object.values(attendance).filter(
      (status) => status === "Present"
    ).length;

    const absent = Object.values(attendance).filter(
      (status) => status === "Absent"
    ).length;

    return { present, absent };
  }, [attendance]);

  const submitAttendance = async () => {
    try {
      setSaving(true);

      const records = students.map((student) => ({
        student: student._id,
        status: attendance[student._id] || "Present",
      }));

      await API.post("/attendance/mark", {
        date,
        records,
      });

      alert("Attendance saved successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Attendance Management</h1>
          <p className="text-gray-500 mt-1">
            Mark and manage daily student attendance
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="bg-white border px-4 py-3 rounded-xl"
          />

          <button
            onClick={submitAttendance}
            disabled={saving || students.length === 0}
            className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Total Students</p>
          <h2 className="text-3xl font-bold mt-2">{students.length}</h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Present</p>
          <h2 className="text-3xl font-bold text-green-600 mt-2">
            {summary.present}
          </h2>
        </div>

        <div className="bg-white p-5 rounded-2xl shadow-sm border">
          <p className="text-gray-500">Absent</p>
          <h2 className="text-3xl font-bold text-red-600 mt-2">
            {summary.absent}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">
        <table className="w-full">
          <thead className="bg-blue-900 text-white">
            <tr>
              <th className="p-4 text-left">Student</th>
              <th className="p-4 text-left">Roll No</th>
              <th className="p-4 text-left">Class</th>
              <th className="p-4 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  Loading students...
                </td>
              </tr>
            ) : students.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-6 text-center">
                  No students found
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{student.name}</td>
                  <td className="p-4">{student.rollNo}</td>
                  <td className="p-4">
                    {student.className}-{student.section}
                  </td>
                  <td className="p-4">
                    <select
                      value={attendance[student._id] || "Present"}
                      onChange={(e) =>
                        handleStatusChange(student._id, e.target.value)
                      }
                      className={`border px-4 py-2 rounded-xl ${
                        attendance[student._id] === "Absent"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    >
                      <option value="Present">Present</option>
                      <option value="Absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}