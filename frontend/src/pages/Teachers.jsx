import { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
  teacherId: "",
  name: "",
  email: "",
  phone: "",
  subject: "",
  qualification: "",
  assignedClasses: "",
};

export default function Teachers() {
  const [teachers, setTeachers] = useState([]);

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  // FETCH TEACHERS
  const fetchTeachers = async () => {
    try {
      setLoading(true);

      const res = await API.get("/teachers");

      setTeachers(res.data.teachers || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.post("/teachers", {
        ...formData,
        assignedClasses: formData.assignedClasses
          .split(",")
          .map((item) => item.trim()),
      });

      setFormData(initialForm);

      fetchTeachers();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to add teacher"
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
          Teacher Management
        </h1>

        <p className="text-violet-100 mt-2">
          Manage faculty records and class assignments.
        </p>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border shadow-sm p-6"
        >

          <h2 className="text-xl font-semibold mb-6">
            Add Teacher
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              name="teacherId"
              placeholder="Teacher ID"
              value={formData.teacherId}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            <input
              type="text"
              name="name"
              placeholder="Teacher Name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            <input
              type="text"
              name="qualification"
              placeholder="Qualification"
              value={formData.qualification}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
            />

            <input
              type="text"
              name="assignedClasses"
              placeholder="Assigned Classes (10-A, 9-B)"
              value={formData.assignedClasses}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl font-semibold"
            >
              {saving
                ? "Saving..."
                : "Add Teacher"}
            </button>

          </div>

        </form>

        {/* TABLE */}
        <div className="xl:col-span-2 bg-white rounded-3xl border shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-xl font-semibold">
              Faculty Records
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Complete teacher management system
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50 text-gray-600 text-sm">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Teacher
                  </th>

                  <th className="px-6 py-4 text-left">
                    Subject
                  </th>

                  <th className="px-6 py-4 text-left">
                    Qualification
                  </th>

                  <th className="px-6 py-4 text-left">
                    Classes
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {loading ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center"
                    >
                      Loading...
                    </td>
                  </tr>

                ) : teachers.length === 0 ? (

                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-10 text-center"
                    >
                      No Teachers Found
                    </td>
                  </tr>

                ) : (

                  teachers.map((teacher) => (

                    <tr
                      key={teacher._id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4">

                        <div className="font-semibold">
                          {teacher.name}
                        </div>

                        <div className="text-sm text-gray-500">
                          {teacher.email}
                        </div>

                      </td>

                      <td className="px-6 py-4">
                        {teacher.subject}
                      </td>

                      <td className="px-6 py-4">
                        {teacher.qualification}
                      </td>

                      <td className="px-6 py-4">

                        <div className="flex flex-wrap gap-2">

                          {teacher.assignedClasses?.map(
                            (cls, index) => (

                              <span
                                key={index}
                                className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium"
                              >
                                {cls}
                              </span>

                            )
                          )}

                        </div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>
  );
}