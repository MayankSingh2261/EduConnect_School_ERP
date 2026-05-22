import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import DataTable from "../components/DataTable";
import PageHeader from "../components/PageHeader";

import {
  UserRound,
  BookOpen,
  GraduationCap,
  Plus,
  Pencil,
  Trash2,
} from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  password: "",
  subject: "",
  assignedClasses: [],
};

export default function Teachers() {
  const [teachers, setTeachers] =
    useState([]);

  const [students, setStudents] =
    useState([]);

  const [formData, setFormData] =
    useState(initialForm);

  const [search, setSearch] =
    useState("");

  const [currentPage, setCurrentPage] =
    useState(1);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [editingId, setEditingId] =
    useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        teachersRes,
        studentsRes,
      ] = await Promise.all([
        API.get("/teachers"),
        API.get("/students"),
      ]);

      setTeachers(
        teachersRes.data.teachers || []
      );

      setStudents(
        studentsRes.data.students || []
      );
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
          (student) =>
            `${student.className}-${student.section}`
        )
      ),
    ];
  }, [students]);

  const filteredTeachers =
    useMemo(() => {
      const keyword =
        search.toLowerCase();

      return teachers.filter(
        (teacher) =>
          teacher.name
            ?.toLowerCase()
            .includes(keyword) ||
          teacher.subject
            ?.toLowerCase()
            .includes(keyword) ||
          teacher.email
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [teachers, search]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleClassChange = (
    className
  ) => {
    const exists =
      formData.assignedClasses.includes(
        className
      );

    if (exists) {
      setFormData({
        ...formData,
        assignedClasses:
          formData.assignedClasses.filter(
            (cls) =>
              cls !== className
          ),
      });
    } else {
      setFormData({
        ...formData,
        assignedClasses: [
          ...formData.assignedClasses,
          className,
        ],
      });
    }
  };

  const resetForm = () => {
    setFormData(initialForm);

    setEditingId(null);
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      if (editingId) {
        await API.put(
          `/teachers/${editingId}`,
          formData
        );

        alert(
          "Teacher updated successfully"
        );
      } else {
        await API.post(
          "/teachers",
          formData
        );

        alert(
          "Teacher created successfully"
        );
      }

      resetForm();

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Operation failed"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (
    teacher
  ) => {
    setEditingId(teacher._id);

    setFormData({
      name: teacher.name || "",
      email: teacher.email || "",
      password: "",
      subject:
        teacher.subject || "",
      assignedClasses:
        teacher.assignedClasses ||
        [],
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (
    id
  ) => {
    const confirmDelete =
      window.confirm(
        "Delete this teacher?"
      );

    if (!confirmDelete) return;

    try {
      await API.delete(
        `/teachers/${id}`
      );

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Delete failed"
      );
    }
  };

  const columns = [
    {
      key: "teacher",
      label: "Teacher",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">
            {row.name}
          </p>

          <p className="text-xs text-slate-500">
            {row.email}
          </p>
        </div>
      ),
    },

    {
      key: "subject",
      label: "Subject",
      render: (row) => (
        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
          {row.subject}
        </span>
      ),
    },

    {
      key: "classes",
      label: "Assigned Classes",
      render: (row) => (
        <div className="flex flex-wrap gap-2">
          {row.assignedClasses?.map(
            (cls) => (
              <span
                key={cls}
                className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700"
              >
                {cls}
              </span>
            )
          )}
        </div>
      ),
    },

    {
      key: "actions",
      label: "Actions",
      render: (row) => (
        <div className="flex gap-2">

          <button
            onClick={() =>
              handleEdit(row)
            }
            className="rounded-xl bg-amber-100 p-2 text-amber-700 hover:bg-amber-200"
          >
            <Pencil size={16} />
          </button>

          <button
            onClick={() =>
              handleDelete(row._id)
            }
            className="rounded-xl bg-red-100 p-2 text-red-700 hover:bg-red-200"
          >
            <Trash2 size={16} />
          </button>

        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <PageHeader
          title="Teacher Management"
          subtitle="Manage faculty, subjects, and class assignments."
          gradient="from-violet-700 to-indigo-600"
      />        

      {/* KPI */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <UserRound
            className="text-violet-600"
            size={28}
          />

          <p className="mt-4 text-slate-500">
            Total Teachers
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            {teachers.length}
          </h2>

        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <BookOpen
            className="text-indigo-600"
            size={28}
          />

          <p className="mt-4 text-slate-500">
            Subjects Covered
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-900">

            {
              [
                ...new Set(
                  teachers.map(
                    (t) =>
                      t.subject
                  )
                ),
              ].length
            }

          </h2>

        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <GraduationCap
            className="text-blue-600"
            size={28}
          />

          <p className="mt-4 text-slate-500">
            Assigned Classes
          </p>

          <h2 className="mt-2 text-4xl font-bold text-slate-900">

            {
              [
                ...new Set(
                  teachers.flatMap(
                    (t) =>
                      t.assignedClasses ||
                      []
                  )
                ),
              ].length
            }

          </h2>

        </div>

      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div className="mb-6 flex items-center gap-3">

          <div className="rounded-2xl bg-violet-100 p-3 text-violet-700">

            <Plus size={20} />

          </div>

          <div>

            <h2 className="text-2xl font-bold text-slate-900">

              {editingId
                ? "Update Teacher"
                : "Add New Teacher"}

            </h2>

            <p className="text-slate-500">
              Manage teacher credentials and assignments.
            </p>

          </div>

        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">

          <input
            type="text"
            name="name"
            placeholder="Teacher Name"
            value={formData.name}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white"
          />

          {!editingId && (

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white"
            />

          )}

          <input
            type="text"
            name="subject"
            placeholder="Subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-violet-500 focus:bg-white"
          />

        </div>

        {/* CLASS ASSIGNMENTS */}
        <div className="mt-6">

          <h3 className="mb-4 text-lg font-semibold text-slate-900">
            Assign Classes
          </h3>

          <div className="flex flex-wrap gap-3">

            {classOptions.map(
              (cls) => (
                <button
                  key={cls}
                  type="button"
                  onClick={() =>
                    handleClassChange(
                      cls
                    )
                  }
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    formData.assignedClasses.includes(
                      cls
                    )
                      ? "bg-violet-600 text-white"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                  }`}
                >
                  {cls}
                </button>
              )
            )}

          </div>

        </div>

        <div className="mt-6 flex flex-wrap gap-3">

          <button
            disabled={saving}
            className="rounded-2xl bg-violet-700 px-6 py-3 font-semibold text-white hover:bg-violet-800 disabled:bg-slate-400"
          >

            {saving
              ? "Saving..."
              : editingId
              ? "Update Teacher"
              : "Add Teacher"}

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

      {/* TABLE */}
      <DataTable
        title="Faculty Records"
        subtitle="Search and manage all teacher accounts."
        columns={columns}
        data={filteredTeachers}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={
          setCurrentPage
        }
        loading={loading}
        emptyMessage="No teachers found"
      />

    </div>
  );
}