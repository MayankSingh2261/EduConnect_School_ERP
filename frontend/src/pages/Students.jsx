import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import DataTable from "../components/DataTable";
import { Plus, Users, GraduationCap, Phone, Pencil, Trash2, KeyRound } from "lucide-react";
import PageHeader from "../components/PageHeader";

const initialForm = {
  name: "",
  className: "",
  section: "",
  parentName: "",
  parentPhone: "",
  parentEmail: "",
  address: "",
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [formData, setFormData] = useState(initialForm);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [generatedCredentials, setGeneratedCredentials] = useState(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);

      const res = await API.get("/students");
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

  const filteredStudents = useMemo(() => {
    const keyword = search.toLowerCase();

    return students.filter((student) => {
      return (
        student.name?.toLowerCase().includes(keyword) ||
        student.rollNo?.toLowerCase().includes(keyword) ||
        student.className?.toLowerCase().includes(keyword) ||
        student.section?.toLowerCase().includes(keyword) ||
        student.parentName?.toLowerCase().includes(keyword) ||
        student.parentPhone?.toLowerCase().includes(keyword)
      );
    });
  }, [students, search]);

  const totalClasses = useMemo(() => {
    return new Set(students.map((s) => `${s.className}-${s.section}`)).size;
  }, [students]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await API.put(`/students/${editingId}`, formData);
        alert("Student updated successfully");
      } else {
        const res = await API.post("/students", formData);

        setGeneratedCredentials(res.data.credentials);

        alert("Student added and login created successfully");
      }

      resetForm();
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || "Operation failed");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);

    setFormData({
      name: student.name || "",
      rollNo: student.rollNo || "",
      className: student.className || "",
      section: student.section || "",
      parentName: student.parentName || "",
      parentPhone: student.parentPhone || "",
      address: student.address || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this student?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/students/${id}`);
      fetchStudents();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const handleResetPassword = async (student) => {
  const confirmReset = window.confirm(
    `Reset guardian password for ${student.name}?`
  );

  if (!confirmReset) return;

  try {
    await API.put(
      `/students/${student._id}/reset-guardian-password`
    );

    alert("Guardian password reset and sent successfully");
    fetchStudents();
  } catch (error) {
    alert(
      error.response?.data?.message ||
        "Failed to reset guardian password"
    );
  }
};

  const columns = [
    {
      key: "student",
      label: "Student",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.name}</p>
          <p className="text-xs text-slate-500">Roll No: {row.rollNo}</p>
        </div>
      ),
    },
    {
      key: "class",
      label: "Class",
      render: (row) => (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {row.className}-{row.section}
        </span>
      ),
    },
    {
      key: "parent",
      label: "Parent",
      render: (row) => (
        <div>
          <p className="font-medium text-slate-800">{row.parentName}</p>
          <p className="text-xs text-slate-500">{row.parentPhone}</p>
        </div>
      ),
    },
    {
      key: "address",
      label: "Address",
      render: (row) => row.address || "—",
    },
    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleEdit(row)}
            className="rounded-xl bg-amber-100 p-2 text-amber-700 hover:bg-amber-200"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() => handleDelete(row._id)}
            className="rounded-xl bg-red-100 p-2 text-red-700 hover:bg-red-200"
          >
            <Trash2 size={16} />
          </button>

          <button
            onClick={() => handleResetPassword(row)}
            className="rounded-xl bg-blue-100 p-2 text-blue-700 hover:bg-blue-200"
            title="Reset Guardian Password"
          >
            <KeyRound size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
          title="Student Management"
          subtitle="Add, update, search, and manage student records professionally."
          gradient="from-blue-700 to-indigo-600"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Users className="text-blue-600" size={28} />
          <p className="mt-4 text-slate-500">Total Students</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">{students.length}</h2>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <GraduationCap className="text-indigo-600" size={28} />
          <p className="mt-4 text-slate-500">Class Sections</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">{totalClasses}</h2>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Phone className="text-emerald-600" size={28} />
          <p className="mt-4 text-slate-500">Parent Contacts</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">{students.length}</h2>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
            <Plus size={20} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {editingId ? "Update Student" : "Add New Student"}
            </h2>
            <p className="text-slate-500">Maintain accurate student records.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["name", "Student Name"],
            ["parentName", "Parent Name"],
            ["parentPhone", "Parent Phone"],
          ].map(([name, label]) => (
            <input
              key={name}
              name={name}
              placeholder={label}
              value={formData[name]}
              onChange={handleChange}
              required
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
            />
            

          ))}
        </div>

        <div>
  <label className="mb-2 block text-sm font-medium text-slate-700">
  </label>

  <input
    type="email"
    name="parentEmail"
    value={formData.parentEmail}
    onChange={handleChange}
    placeholder="Enter parent email"
    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-violet-500"
    required
  />
</div>

        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <select
              name="className"
              value={formData.className}
              onChange={handleChange}
              required
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
            >
              <option value="">Select Class</option>

              {Array.from({ length: 12 }, (_, i) => String(i + 1)).map((cls) => (
                <option key={cls} value={cls}>
                  Class {cls}
                </option>
              ))}
            </select>

        <select
          name="section"
          value={formData.section}
          onChange={handleChange}
          required
          className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
        >
          <option value="">Select Section</option>

          {["A", "B", "C"].map((section) => (
            <option key={section} value={section}>
              Section {section}
            </option>
          ))}
        </select>
    </div>

        <textarea
          name="address"
          placeholder="Address"
          value={formData.address}
          onChange={handleChange}
          className="mt-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500 focus:bg-white"
        />

        <div className="mt-6 flex flex-wrap gap-3">
          <button
            disabled={saving}
            className="rounded-2xl bg-blue-700 px-6 py-3 font-semibold text-white hover:bg-blue-800 disabled:bg-slate-400"
          >
            {saving ? "Saving..." : editingId ? "Update Student" : "Add Student"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded-2xl bg-slate-200 px-6 py-3 font-semibold text-slate-700 hover:bg-slate-300"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <DataTable
        title="Student Records"
        subtitle="Search, manage, and review all student records."
        columns={columns}
        data={filteredStudents}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        loading={loading}
        emptyMessage="No students found"
      />
    </div>
  );
}