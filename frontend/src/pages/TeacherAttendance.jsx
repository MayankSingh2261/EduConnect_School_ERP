import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function TeacherAttendance() {
  const today = new Date().toISOString().split("T")[0];

  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [date, setDate] = useState(today);
  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await API.get("/teacher/dashboard");
      const studentList = res.data.students || [];

      setStudents(studentList);

      const defaultAttendance = {};
      studentList.forEach((student) => {
        defaultAttendance[student._id] = "Present";
      });

      setAttendance(defaultAttendance);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const classOptions = useMemo(() => {
    return [...new Set(students.map((student) => student.className))];
  }, [students]);

  const sectionOptions = useMemo(() => {
    return [
      ...new Set(
        students
          .filter((student) => student.className === selectedClass)
          .map((student) => student.section)
      ),
    ];
  }, [students, selectedClass]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const classMatch = selectedClass ? student.className === selectedClass : false;
      const sectionMatch = selectedSection ? student.section === selectedSection : false;

      return classMatch && sectionMatch;
    });
  }, [students, selectedClass, selectedSection]);

  const summary = useMemo(() => {
    const present = filteredStudents.filter(
      (student) => attendance[student._id] === "Present"
    ).length;

    const absent = filteredStudents.filter(
      (student) => attendance[student._id] === "Absent"
    ).length;

    return { present, absent };
  }, [filteredStudents, attendance]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
  };

  const handleStatusChange = (studentId, status) => {
    setAttendance((prev) => ({
      ...prev,
      [studentId]: status,
    }));
  };

  const submitAttendance = async () => {
    if (!selectedClass || !selectedSection) {
      alert("Please select class and section first");
      return;
    }

    if (filteredStudents.length === 0) {
      alert("No students found");
      return;
    }

    try {
      setSaving(true);

      const records = filteredStudents.map((student) => ({
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
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-violet-700 to-violet-500 text-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Mark Attendance</h1>
        <p className="text-violet-100 mt-2">
          Select class and section, then mark daily attendance.
        </p>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Attendance Filters</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          />

          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          >
            <option value="">Select Class</option>
            {classOptions.map((className) => (
              <option key={className} value={className}>
                Class {className}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) => setSelectedSection(e.target.value)}
            disabled={!selectedClass}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 disabled:bg-gray-200"
          >
            <option value="">Select Section</option>
            {sectionOptions.map((section) => (
              <option key={section} value={section}>
                Section {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <p className="text-gray-500">Selected Students</p>
          <h2 className="text-3xl font-bold mt-3">{filteredStudents.length}</h2>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <p className="text-gray-500">Present</p>
          <h2 className="text-3xl font-bold text-green-600 mt-3">
            {summary.present}
          </h2>
        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">
          <p className="text-gray-500">Absent</p>
          <h2 className="text-3xl font-bold text-red-600 mt-3">
            {summary.absent}
          </h2>
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold">Student Attendance</h2>
            <p className="text-gray-500 text-sm mt-1">
              Only selected assigned class-section students are shown.
            </p>
          </div>

          <button
            onClick={submitAttendance}
            disabled={saving || filteredStudents.length === 0}
            className="bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
          >
            {saving ? "Saving..." : "Save Attendance"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 text-left">Student</th>
                <th className="px-6 py-4 text-left">Roll No</th>
                <th className="px-6 py-4 text-left">Class</th>
                <th className="px-6 py-4 text-left">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                    Select class and section to view students.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => (
                  <tr key={student._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 font-semibold">{student.name}</td>
                    <td className="px-6 py-4">{student.rollNo}</td>
                    <td className="px-6 py-4">
                      {student.className}-{student.section}
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={attendance[student._id] || "Present"}
                        onChange={(e) =>
                          handleStatusChange(student._id, e.target.value)
                        }
                        className={`rounded-xl border border-gray-300 px-4 py-2 font-semibold ${
                          attendance[student._id] === "Absent"
                            ? "text-red-600 bg-red-50"
                            : "text-green-600 bg-green-50"
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
    </div>
  );
}