import { useEffect, useState } from "react";
import API from "../services/api";

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

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold">
          Fee Management
        </h1>

        <p className="text-emerald-100 mt-2">
          Manage fee collection and payment tracking.
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-gray-500">
            Total Records
          </p>

          <h2 className="text-3xl font-bold mt-3">
            {fees.length}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-gray-500">
            Total Collection
          </p>

          <h2 className="text-3xl font-bold text-green-600 mt-3">
            ₹{totalCollection.toLocaleString()}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <p className="text-gray-500">
            Pending Amount
          </p>

          <h2 className="text-3xl font-bold text-red-600 mt-3">
            ₹{totalPending.toLocaleString()}
          </h2>
        </div>

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
        <div className="xl:col-span-2 bg-white rounded-3xl border shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-xl font-semibold">
              Fee Records
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Complete student fee tracking system
            </p>

          </div>

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50 text-gray-600 text-sm">

                <tr>

                  <th className="px-6 py-4 text-left">
                    Student
                  </th>

                  <th className="px-6 py-4 text-left">
                    Fee Type
                  </th>

                  <th className="px-6 py-4 text-left">
                    Total
                  </th>

                  <th className="px-6 py-4 text-left">
                    Paid
                  </th>

                  <th className="px-6 py-4 text-left">
                    Balance
                  </th>

                  <th className="px-6 py-4 text-left">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y">

                {loading ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center"
                    >
                      Loading...
                    </td>
                  </tr>

                ) : fees.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-10 text-center"
                    >
                      No Fee Records
                    </td>
                  </tr>

                ) : (

                  fees.map((item) => {

                    const balance =
                      item.totalAmount -
                      item.paidAmount;

                    return (
                      <tr
                        key={item._id}
                        className="hover:bg-gray-50"
                      >

                        <td className="px-6 py-4">

                          <div className="font-semibold">
                            {item.student?.name}
                          </div>

                          <div className="text-sm text-gray-500">
                            Roll {item.student?.rollNo}
                          </div>

                        </td>

                        <td className="px-6 py-4">
                          {item.feeType}
                        </td>

                        <td className="px-6 py-4 font-medium">
                          ₹{item.totalAmount}
                        </td>

                        <td className="px-6 py-4 text-green-600 font-medium">
                          ₹{item.paidAmount}
                        </td>

                        <td className="px-6 py-4 text-red-600 font-medium">
                          ₹{balance}
                        </td>

                        <td className="px-6 py-4">

                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              item.status === "Paid"
                                ? "bg-green-100 text-green-700"
                                : item.status === "Partial"
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {item.status}
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