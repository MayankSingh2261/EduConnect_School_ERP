import { useEffect, useState } from "react";
import API from "../services/api";

export default function Students() {
  const initialForm = {
    name: "",
    rollNo: "",
    className: "",
    section: "",
    parentName: "",
    parentPhone: "",
    address: "",
  };

  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [search, setSearch] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(false);

  // FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        `/students?search=${search}`
      );

      setStudents(res.data.students);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchStudents();
  }, [search]);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // ADD / UPDATE STUDENT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {

      if (editingId) {

        await API.put(
          `/students/${editingId}`,
          formData
        );

        alert("Student Updated");

      } else {

        await API.post(
          "/students",
          formData
        );

        alert("Student Added");

      }

      setFormData(initialForm);

      setEditingId(null);

      fetchStudents();

    } catch (error) {

      alert("Operation failed");

    }
  };

  // EDIT STUDENT
  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      name: student.name,
      rollNo: student.rollNo,
      className: student.className,
      section: student.section,
      parentName: student.parentName,
      parentPhone: student.parentPhone,
      address: student.address,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE STUDENT
  const handleDelete = async (id) => {

    const confirmDelete = window.confirm(
      "Delete this student?"
    );

    if (!confirmDelete) return;

    try {

      await API.delete(`/students/${id}`);

      fetchStudents();

    } catch (error) {

      alert("Delete failed");

    }
  };

  return (
    <div>

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">

        <h1 className="text-3xl font-bold">
          Student Management
        </h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search students..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="border bg-white p-3 rounded-xl w-full md:w-80"
        />

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-2xl shadow-sm border mb-8"
      >

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <input
            type="text"
            name="name"
            placeholder="Student Name"
            value={formData.name}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="rollNo"
            placeholder="Roll Number"
            value={formData.rollNo}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="className"
            placeholder="Class"
            value={formData.className}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="section"
            placeholder="Section"
            value={formData.section}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="parentName"
            placeholder="Parent Name"
            value={formData.parentName}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

          <input
            type="text"
            name="parentPhone"
            placeholder="Parent Phone"
            value={formData.parentPhone}
            onChange={handleChange}
            className="border p-3 rounded-xl"
            required
          />

        </div>

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="border p-3 rounded-xl w-full mt-4"
        />

        <div className="flex gap-3 mt-4">

          <button
            type="submit"
            className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl"
          >
            {editingId
              ? "Update Student"
              : "Add Student"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setFormData(initialForm);
              }}
              className="bg-gray-300 hover:bg-gray-400 px-6 py-3 rounded-xl"
            >
              Cancel
            </button>
          )}

        </div>

      </form>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">

        <table className="w-full">

          <thead className="bg-blue-900 text-white">

            <tr>
              <th className="p-4 text-left">
                Name
              </th>

              <th className="p-4 text-left">
                Roll No
              </th>

              <th className="p-4 text-left">
                Class
              </th>

              <th className="p-4 text-left">
                Parent
              </th>

              <th className="p-4 text-left">
                Phone
              </th>

              <th className="p-4 text-left">
                Actions
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : students.length === 0 ? (

              <tr>
                <td
                  colSpan="6"
                  className="p-6 text-center"
                >
                  No students found
                </td>
              </tr>

            ) : (

              students.map((student) => (

                <tr
                  key={student._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {student.name}
                  </td>

                  <td className="p-4">
                    {student.rollNo}
                  </td>

                  <td className="p-4">
                    {student.className}-{student.section}
                  </td>

                  <td className="p-4">
                    {student.parentName}
                  </td>

                  <td className="p-4">
                    {student.parentPhone}
                  </td>

                  <td className="p-4 flex gap-2">

                    <button
                      onClick={() =>
                        handleEdit(student)
                      }
                      className="bg-yellow-400 hover:bg-yellow-500 px-4 py-2 rounded-lg"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(student._id)
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                    >
                      Delete
                    </button>

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