import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";

import {
  FileText,
  IndianRupee,
  AlertCircle,
} from "lucide-react";

const initialForm = {
  student: "",
  feeType: "",
  totalAmount: "",
  paidAmount: "",
  dueDate: "",
};

export default function Fees() {
  const [students, setStudents] = useState([]);
  const [fees, setFees] = useState([]);

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState(initialForm);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // FETCH STUDENTS
  const fetchStudents = async () => {
    const res = await API.get("/students");
    setStudents(res.data.students || []);
  };

  // FETCH FEES
  const fetchFees = async () => {
    try {
      setLoading(true);

      const res = await API.get("/fees");

      setFees(res.data.fees || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
    fetchFees();
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

      await API.post("/fees", {
        ...formData,
        totalAmount: Number(formData.totalAmount),
        paidAmount: Number(formData.paidAmount),
      });

      setFormData(initialForm);

      fetchFees();

    } catch (error) {
      alert(error.response?.data?.message || "Failed to add fee");
    } finally {
      setSaving(false);
    }
  };

  // TOTAL COLLECTION
  const totalCollection = fees.reduce(
    (acc, item) => acc + item.paidAmount,
    0
  );

  const totalPending = fees.reduce(
    (acc, item) =>
      acc + (item.totalAmount - item.paidAmount),
    0
  );

  const filteredFees = useMemo(() => {
  const keyword = search.toLowerCase();

  return fees.filter((item) => {
    return (
      item.student?.name?.toLowerCase().includes(keyword) ||
      item.student?.rollNo?.toLowerCase().includes(keyword) ||
      item.feeType?.toLowerCase().includes(keyword) ||
      item.status?.toLowerCase().includes(keyword)
    );
  });
}, [fees, search]);

const columns = [
  {
    key: "student",
    label: "Student",
    render: (row) => (
      <div>
        <p className="font-semibold text-slate-900">
          {row.student?.name}
        </p>
        <p className="text-xs text-slate-500">
          Roll {row.student?.rollNo}
        </p>
      </div>
    ),
  },
  {
    key: "feeType",
    label: "Fee Type",
  },
  {
    key: "totalAmount",
    label: "Total",
    render: (row) => `₹${row.totalAmount}`,
  },
  {
    key: "paidAmount",
    label: "Paid",
    render: (row) => (
      <span className="font-semibold text-emerald-600">
        ₹{row.paidAmount}
      </span>
    ),
  },
  {
    key: "balance",
    label: "Balance",
    render: (row) => (
      <span className="font-semibold text-red-600">
        ₹{row.totalAmount - row.paidAmount}
      </span>
    ),
  },
  {
    key: "status",
    label: "Status",
    render: (row) => (
      <span
        className={`rounded-full px-3 py-1 text-sm font-semibold ${
          row.status === "Paid"
            ? "bg-green-100 text-green-700"
            : row.status === "Partial"
            ? "bg-yellow-100 text-yellow-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {row.status}
      </span>
    ),
  },
];

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <PageHeader
          title="Fee Management"
          subtitle="Manage fee collection, pending dues, and payment records."
          gradient="from-emerald-700 to-green-600"
      />

      {/* STATS */}
<div className="grid grid-cols-1 gap-6 md:grid-cols-3">
  <StatsCard
    title="Total Records"
    value={fees.length}
    icon={FileText}
    gradient="from-blue-600 to-indigo-600"
  />

  <StatsCard
    title="Total Collection"
    value={`₹${totalCollection.toLocaleString()}`}
    icon={IndianRupee}
    gradient="from-emerald-600 to-green-600"
  />

  <StatsCard
    title="Pending Amount"
    value={`₹${totalPending.toLocaleString()}`}
    icon={AlertCircle}
    gradient="from-red-500 to-orange-500"
  />
</div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border shadow-sm p-6"
        >

          <h2 className="text-xl font-semibold mb-6">
            Add Fee Record
          </h2>

          <div className="space-y-4">

            {/* STUDENT */}
            <select
              name="student"
              value={formData.student}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            >

              <option value="">
                Select Student
              </option>

              {students.map((student) => (

                <option
                  key={student._id}
                  value={student._id}
                >
                  {student.name} ({student.rollNo})
                </option>

              ))}

            </select>

            {/* FEE TYPE */}
            <input
              type="text"
              name="feeType"
              placeholder="Fee Type"
              value={formData.feeType}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            {/* TOTAL */}
            <input
              type="number"
              name="totalAmount"
              placeholder="Total Amount"
              value={formData.totalAmount}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            {/* PAID */}
            <input
              type="number"
              name="paidAmount"
              placeholder="Paid Amount"
              value={formData.paidAmount}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            {/* DUE DATE */}
            <input
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold"
            >
              {saving ? "Saving..." : "Add Fee"}
            </button>

          </div>

        </form>

        {/* TABLE */}
        <div className="xl:col-span-2">
        <DataTable
            title="Fee Records"
            subtitle="Search, review, and track all student fee records."
            columns={columns}
            data={filteredFees}
            search={search}
            setSearch={setSearch}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            loading={loading}
            emptyMessage="No fee records found"
          />
        </div>

      </div>

    </div>
  );
}