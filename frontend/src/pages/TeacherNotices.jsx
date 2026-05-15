import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

const initialForm = {
  className: "",
  section: "",
  title: "",
  message: "",
};

export default function TeacherNotices() {
  const [teacher, setTeacher] = useState(null);

  const [students, setStudents] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [formData, setFormData] =
    useState(initialForm);

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/teacher/dashboard"
      );

      setTeacher(res.data.teacher);

      setStudents(res.data.students || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load data"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const classOptions = useMemo(() => {
    return [
      ...new Set(
        students.map(
          (student) => student.className
        )
      ),
    ];
  }, [students]);

  const sectionOptions = useMemo(() => {
    return [
      ...new Set(
        students
          .filter(
            (student) =>
              student.className ===
              formData.className
          )
          .map(
            (student) => student.section
          )
      ),
    ];
  }, [students, formData.className]);

  const totalStudents = useMemo(() => {
    return students.filter(
      (student) =>
        student.className ===
          formData.className &&
        student.section ===
          formData.section
    ).length;
  }, [students, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.post(
        "/teacher-notices",
        formData
      );

      alert("Notice sent successfully");

      setFormData(initialForm);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to send notice"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-700 to-violet-500 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Send Notices
        </h1>

        <p className="text-violet-100 mt-2">
          Send announcements to assigned classes.
        </p>

      </div>

      {/* TEACHER INFO */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-xl font-semibold">
          Teacher Information
        </h2>

        <p className="text-gray-500 mt-2">
          {teacher?.name} • {teacher?.subject}
        </p>

      </div>

      {/* NOTICE FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl border shadow-sm p-6"
      >

        <h2 className="text-xl font-semibold mb-6">
          Create Notice
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            required
            value={formData.className}
            onChange={(e) =>
              setFormData({
                ...formData,
                className: e.target.value,
                section: "",
              })
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          >

            <option value="">
              Select Class
            </option>

            {classOptions.map((cls) => (
              <option
                key={cls}
                value={cls}
              >
                Class {cls}
              </option>
            ))}

          </select>

          <select
            required
            value={formData.section}
            onChange={(e) =>
              setFormData({
                ...formData,
                section: e.target.value,
              })
            }
            disabled={!formData.className}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 disabled:bg-gray-200"
          >

            <option value="">
              Select Section
            </option>

            {sectionOptions.map((section) => (
              <option
                key={section}
                value={section}
              >
                Section {section}
              </option>
            ))}

          </select>

          <input
            type="text"
            required
            placeholder="Notice Title"
            value={formData.title}
            onChange={(e) =>
              setFormData({
                ...formData,
                title: e.target.value,
              })
            }
            className="md:col-span-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          />

          <textarea
            required
            rows={6}
            placeholder="Write notice message..."
            value={formData.message}
            onChange={(e) =>
              setFormData({
                ...formData,
                message: e.target.value,
              })
            }
            className="md:col-span-2 w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          />

        </div>

        {/* TARGET INFO */}
        <div className="mt-6 bg-violet-50 rounded-2xl p-4 border border-violet-100">

          <p className="text-violet-700 font-semibold">
            Target Students:
            {" "}
            {totalStudents}
          </p>

        </div>

        <button
          type="submit"
          disabled={saving}
          className="mt-6 bg-violet-600 hover:bg-violet-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {saving
            ? "Sending..."
            : "Send Notice"}
        </button>

      </form>

    </div>
  );
}