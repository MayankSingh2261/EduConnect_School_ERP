import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const initialForm = {
  student: "",
  subject: "",
  examType: "Unit Test",
  totalMarks: 100,
  marksObtained: "",
};

export default function TeacherMarks() {
  const [students, setStudents] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const [formData, setFormData] = useState(initialForm);

  const fetchStudents = async () => {
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
    fetchStudents();
  }, []);

  const classOptions = useMemo(() => {
    return [...new Set(students.map((s) => s.className))];
  }, [students]);

  const sectionOptions = useMemo(() => {
    return [
      ...new Set(
        students
          .filter((s) => s.className === selectedClass)
          .map((s) => s.section)
      ),
    ];
  }, [students, selectedClass]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      return (
        student.className === selectedClass &&
        student.section === selectedSection
      );
    });
  }, [students, selectedClass, selectedSection]);

  const handleClassChange = (e) => {
    setSelectedClass(e.target.value);
    setSelectedSection("");
    setFormData(initialForm);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedClass || !selectedSection) {
      alert("Please select class and section");
      return;
    }

    try {
      setSaving(true);

      await API.post("/marks", {...formData, subject: teacher?.subject,});

      alert("Marks uploaded successfully");

      setFormData({
        ...initialForm,
      });
    } catch (error) {
      alert(error.response?.data?.message || "Failed to upload marks");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-violet-700 to-violet-500 text-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Upload Marks</h1>

        <p className="text-violet-100 mt-2">
          Upload academic marks for assigned students.
        </p>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-6">
          Select Class & Section
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={selectedClass}
            onChange={handleClassChange}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          >
            <option value="">Select Class</option>

            {classOptions.map((cls) => (
              <option key={cls} value={cls}>
                Class {cls}
              </option>
            ))}
          </select>

          <select
            value={selectedSection}
            onChange={(e) =>
              setSelectedSection(e.target.value)
            }
            disabled={!selectedClass}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 disabled:bg-gray-200"
          >
            <option value="">Select Section</option>

            {sectionOptions.map((section) => (
              <option
                key={section}
                value={section}
              >
                Section {section}
              </option>
            ))}
          </select>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border shadow-sm p-6"
      >
        <h2 className="text-xl font-semibold mb-6">
          Marks Entry
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            required
            value={formData.student}
            onChange={(e) =>
              setFormData({
                ...formData,
                student: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          >
            <option value="">
              Select Student
            </option>

            {filteredStudents.map((student) => (
              <option
                key={student._id}
                value={student._id}
              >
                {student.name} (
                {student.rollNo})
              </option>
            ))}
          </select>

          <div className="w-full rounded-xl border border-gray-300 bg-gray-100 px-4 py-3">
                <p className="text-sm text-gray-500">
                    Subject
                </p>

                <h3 className="font-semibold mt-1">
                    {teacher?.subject || "Not Assigned"}
                </h3>
          </div>

          <select
            value={formData.examType}
            onChange={(e) =>
              setFormData({
                ...formData,
                examType: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          >
            <option>
              Unit Test
            </option>

            <option>
              Mid Term
            </option>

            <option>
              Final Exam
            </option>
          </select>

          <input
            type="number"
            placeholder="Total Marks"
            required
            value={formData.totalMarks}
            onChange={(e) =>
              setFormData({
                ...formData,
                totalMarks: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          />

          <input
            type="number"
            placeholder="Marks Obtained"
            required
            value={formData.marksObtained}
            onChange={(e) =>
              setFormData({
                ...formData,
                marksObtained: e.target.value,
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {saving
            ? "Uploading..."
            : "Upload Marks"}
        </button>
      </form>

      <div className="bg-white rounded-3xl border shadow-sm p-6">
        <h2 className="text-xl font-semibold">
          Assigned Students
        </h2>

        <p className="text-gray-500 mt-2">
          {loading
            ? "Loading..."
            : `${filteredStudents.length} students found`}
        </p>
      </div>
    </div>
  );
}