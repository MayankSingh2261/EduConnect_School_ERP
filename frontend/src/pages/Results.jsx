import { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
  student: "",
  subject: "",
  examType: "Mid Term",
  marksObtained: "",
  totalMarks: "",
};

export default function Results() {
  const [students, setStudents] = useState([]);
  const [marks, setMarks] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data.students || []);
  };

  const fetchMarks = async () => {
    try {
      setLoading(true);
      const res = await API.get("/marks");
      setMarks(res.data.marks || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchMarks();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const percentagePreview =
    formData.marksObtained && formData.totalMarks
      ? ((Number(formData.marksObtained) / Number(formData.totalMarks)) * 100).toFixed(1)
      : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      await API.post("/marks", {
        ...formData,
        marksObtained: Number(formData.marksObtained),
        totalMarks: Number(formData.totalMarks),
      });

      setFormData(initialForm);
      fetchMarks();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to add marks");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 text-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Results Management</h1>
        <p className="text-blue-100 mt-2">
          Add marks, track performance, and manage academic records.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          onSubmit={handleSubmit}
          className="xl:col-span-1 bg-white rounded-3xl border shadow-sm p-6"
        >
          <h2 className="text-xl font-semibold mb-1">Add Marks</h2>
          <p className="text-gray-500 mb-6 text-sm">Enter subject-wise student marks.</p>

          <div className="space-y-4">
            <select
              name="student"
              value={formData.student}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              required
            >
              <option value="">Select Student</option>
              {students.map((student) => (
                <option key={student._id} value={student._id}>
                  {student.name} • Roll {student.rollNo}
                </option>
              ))}
            </select>

            <input
              type="text"
              name="subject"
              placeholder="Subject name"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
              required
            />

            <select
              name="examType"
              value={formData.examType}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
            >
              <option>Unit Test</option>
              <option>Mid Term</option>
              <option>Final Exam</option>
            </select>

            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                name="marksObtained"
                placeholder="Obtained"
                value={formData.marksObtained}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                required
              />

              <input
                type="number"
                name="totalMarks"
                placeholder="Total"
                value={formData.totalMarks}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-100"
                required
              />
            </div>

            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm text-gray-500">Percentage Preview</p>
              <h3 className="text-2xl font-bold text-blue-900">{percentagePreview}%</h3>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full rounded-xl bg-blue-900 px-5 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-gray-400"
            >
              {saving ? "Saving..." : "Save Marks"}
            </button>
          </div>
        </form>

        <div className="xl:col-span-2 bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b">
            <h2 className="text-xl font-semibold">Academic Records</h2>
            <p className="text-gray-500 text-sm mt-1">Latest subject-wise result entries.</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead className="bg-gray-50 text-gray-600 text-sm">
                <tr>
                  <th className="px-6 py-4 text-left">Student</th>
                  <th className="px-6 py-4 text-left">Subject</th>
                  <th className="px-6 py-4 text-left">Exam</th>
                  <th className="px-6 py-4 text-left">Marks</th>
                  <th className="px-6 py-4 text-left">Percentage</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {loading ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      Loading records...
                    </td>
                  </tr>
                ) : marks.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
                      No result records found.
                    </td>
                  </tr>
                ) : (
                  marks.map((item) => {
                    const percentage = (
                      (item.marksObtained / item.totalMarks) *
                      100
                    ).toFixed(1);

                    const passed = percentage >= 40;

                    return (
                      <tr key={item._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900">
                            {item.student?.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            Roll {item.student?.rollNo} • Class {item.student?.className}
                            -{item.student?.section}
                          </div>
                        </td>

                        <td className="px-6 py-4 text-gray-700">{item.subject}</td>
                        <td className="px-6 py-4 text-gray-700">{item.examType}</td>

                        <td className="px-6 py-4 font-medium">
                          {item.marksObtained}/{item.totalMarks}
                        </td>

                        <td className="px-6 py-4">
                          <span className="font-bold text-blue-900">{percentage}%</span>
                        </td>

                        <td className="px-6 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-sm font-semibold ${
                              passed
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {passed ? "Passed" : "Needs Support"}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}