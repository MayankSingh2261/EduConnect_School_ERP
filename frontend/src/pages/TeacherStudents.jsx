import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function TeacherStudents() {
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await API.get("/teacher/dashboard");

      setTeacher(res.data.teacher);
      setStudents(res.data.students || []);
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
    const classes = students.map((student) => student.className);
    return [...new Set(classes)];
  }, [students]);

  const sectionOptions = useMemo(() => {
    const sections = students
      .filter((student) => student.className === selectedClass)
      .map((student) => student.section);

    return [...new Set(sections)];
  }, [students, selectedClass]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const matchClass = selectedClass
        ? student.className === selectedClass
        : true;

      const matchSection = selectedSection
        ? student.section === selectedSection
        : true;

      return matchClass && matchSection;
    });
  }, [students, selectedClass, selectedSection]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-violet-700 to-violet-500 text-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Assigned Students</h1>
        <p className="text-violet-100 mt-2">
          Select class and section to view assigned students.
        </p>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold">Teacher Info</h2>

        <p className="text-gray-500 mt-2">
          {teacher?.name} • {teacher?.subject}
        </p>

        <div className="flex flex-wrap gap-2 mt-4">
          {teacher?.assignedClasses?.map((cls) => (
            <span
              key={cls}
              className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-semibold"
            >
              {cls}
            </span>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Filter Students</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Student List</h2>
          <p className="text-gray-500 text-sm mt-1">
            {selectedClass && selectedSection
              ? `Showing Class ${selectedClass}-${selectedSection}`
              : "Please select class and section for better filtering."}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 text-left">Student</th>
                <th className="px-6 py-4 text-left">Roll No</th>
                <th className="px-6 py-4 text-left">Class</th>
                <th className="px-6 py-4 text-left">Parent</th>
                <th className="px-6 py-4 text-left">Phone</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center">
                    Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                    No students found for selected class-section.
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
                    <td className="px-6 py-4">{student.parentName}</td>
                    <td className="px-6 py-4">{student.parentPhone}</td>
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