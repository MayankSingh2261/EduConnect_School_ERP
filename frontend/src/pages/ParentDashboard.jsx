import { useEffect, useState } from "react";
import API from "../services/api";

const BACKEND_URL = "http://localhost:8000";

export default function ParentDashboard() {

  const [data, setData] = useState(null);

  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {

      setLoading(true);

      const res = await API.get(
        "/parent/dashboard"
      );

      setData(res.data);

    } catch (error) {

      console.log(error);

      alert("Failed to load dashboard");

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-10">
        Loading...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10">
        No data found
      </div>
    );
  }

  // ATTENDANCE
  const presentCount =
    data.attendance.filter(
      (a) => a.status === "Present"
    ).length;

  const attendanceRate =
    data.attendance.length > 0
      ? (
          (presentCount /
            data.attendance.length) *
          100
        ).toFixed(1)
      : 0;

  // FEES
  const totalFees =
    data.fees.reduce(
      (sum, fee) =>
        sum + fee.totalAmount,
      0
    );

  const totalPaid =
    data.fees.reduce(
      (sum, fee) =>
        sum + fee.paidAmount,
      0
    );

  const pendingFees =
    totalFees - totalPaid;

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Parent Dashboard
        </h1>

        <p className="mt-2 text-blue-100">
          Welcome back
        </p>

      </div>

      {/* STUDENT INFO */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-2xl font-semibold mb-6">
          Student Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

          <div>
            <p className="text-gray-500">
              Student Name
            </p>

            <h3 className="font-bold text-lg mt-2">
              {data.student.name}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Roll Number
            </p>

            <h3 className="font-bold text-lg mt-2">
              {data.student.rollNo}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Class
            </p>

            <h3 className="font-bold text-lg mt-2">
              {data.student.className}-
              {data.student.section}
            </h3>
          </div>

          <div>
            <p className="text-gray-500">
              Parent Name
            </p>

            <h3 className="font-bold text-lg mt-2">
              {data.student.parentName}
            </h3>
          </div>

        </div>

      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Attendance Rate
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {attendanceRate}%
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Total Fees
          </p>

          <h2 className="text-4xl font-bold mt-3">
            ₹{totalFees}
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Pending Fees
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            ₹{pendingFees}
          </h2>

        </div>

      </div>

      {/* ATTENDANCE HISTORY */}
<div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

  <div className="p-6 border-b">

    <h2 className="text-2xl font-semibold">
      Attendance History
    </h2>

  </div>

  <div className="overflow-x-auto">

    <table className="w-full min-w-[700px]">

      <thead className="bg-gray-50">

        <tr>

          <th className="px-6 py-4 text-left text-sm text-gray-600">
            Date
          </th>

          <th className="px-6 py-4 text-left text-sm text-gray-600">
            Status
          </th>

        </tr>

      </thead>

      <tbody className="divide-y">

        {data.attendance.length === 0 ? (

          <tr>

            <td
              colSpan="2"
              className="px-6 py-10 text-center text-gray-500"
            >
              No attendance records found
            </td>

          </tr>

        ) : (

          data.attendance.map((item) => (

            <tr
              key={item._id}
              className="hover:bg-gray-50"
            >

              <td className="px-6 py-4">

                {new Date(
                  item.date
                ).toLocaleDateString()}

              </td>

              <td className="px-6 py-4">

                <span
                  className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    item.status === "Present"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {item.status}
                </span>

              </td>

            </tr>

          ))

        )}

      </tbody>

    </table>

  </div>

</div>

{/* ACADEMIC PERFORMANCE */}
<div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
  <div className="p-6 border-b">
    <h2 className="text-2xl font-semibold">
      Academic Performance
    </h2>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[800px]">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-sm text-gray-600">
            Subject
          </th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">
            Exam
          </th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">
            Marks
          </th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">
            Percentage
          </th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">
            Status
          </th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {data.marks.length === 0 ? (
          <tr>
            <td
              colSpan="5"
              className="px-6 py-10 text-center text-gray-500"
            >
              No marks records found
            </td>
          </tr>
        ) : (
          data.marks.map((item) => {
            const percentage = (
              (item.marksObtained / item.totalMarks) *
              100
            ).toFixed(1);

            const passed = percentage >= 40;

            return (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">
                  {item.subject}
                </td>

                <td className="px-6 py-4">
                  {item.examType}
                </td>

                <td className="px-6 py-4 font-medium">
                  {item.marksObtained}/{item.totalMarks}
                </td>

                <td className="px-6 py-4 font-bold text-blue-900">
                  {percentage}%
                </td>

                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
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

{/* FEE PAYMENT HISTORY */}
<div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
  <div className="p-6 border-b">
    <h2 className="text-2xl font-semibold">
      Fee Payment History
    </h2>
  </div>

  <div className="overflow-x-auto">
    <table className="w-full min-w-[900px]">
      <thead className="bg-gray-50">
        <tr>
          <th className="px-6 py-4 text-left text-sm text-gray-600">Fee Type</th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">Total</th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">Paid</th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">Pending</th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">Due Date</th>
          <th className="px-6 py-4 text-left text-sm text-gray-600">Status</th>
        </tr>
      </thead>

      <tbody className="divide-y">
        {data.fees.length === 0 ? (
          <tr>
            <td colSpan="6" className="px-6 py-10 text-center text-gray-500">
              No fee records found
            </td>
          </tr>
        ) : (
          data.fees.map((fee) => {
            const pending = fee.totalAmount - fee.paidAmount;

            return (
              <tr key={fee._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-semibold">{fee.feeType}</td>
                <td className="px-6 py-4">₹{fee.totalAmount}</td>
                <td className="px-6 py-4 text-green-600 font-semibold">
                  ₹{fee.paidAmount}
                </td>
                <td className="px-6 py-4 text-red-600 font-semibold">
                  ₹{pending}
                </td>
                <td className="px-6 py-4">
                  {new Date(fee.dueDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      fee.status === "Paid"
                        ? "bg-green-100 text-green-700"
                        : fee.status === "Partial"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {fee.status}
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

      {/* REPORT CARDS */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-2xl font-semibold">
            Report Cards
          </h2>

        </div>

        <div className="divide-y">

          {data.reportCards.length === 0 ? (

            <div className="p-10 text-center">
              No report cards available
            </div>

          ) : (

            data.reportCards.map((item) => (

              <div
                key={item._id}
                className="p-6 flex items-center justify-between"
              >

                <div>

                  <h3 className="font-semibold text-lg">
                    {item.examType}
                  </h3>

                  <p className="text-gray-500 mt-1">
                    Percentage:
                    {" "}
                    {item.percentage}%
                    {" "}•{" "}
                    Grade:
                    {" "}
                    {item.grade}
                  </p>

                </div>

                <a
                  href={`${BACKEND_URL}${item.pdfPath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl"
                >
                  Download PDF
                </a>

              </div>

            ))

          )}

        </div>

        {/* NOTIFICATIONS */}
<div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
  <div className="p-6 border-b">
    <h2 className="text-2xl font-semibold">
      Notifications
    </h2>
  </div>

  <div className="divide-y">
    {data.notifications.length === 0 ? (
      <div className="p-10 text-center text-gray-500">
        No notifications available
      </div>
    ) : (
      data.notifications.map((item) => (
        <div key={item._id} className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">
                {item.title}
              </h3>

              <p className="text-gray-600 mt-2">
                {item.message}
              </p>

              <p className="text-sm text-gray-400 mt-3">
                {new Date(item.createdAt).toLocaleString()}
              </p>
            </div>

            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
              {item.type}
            </span>
          </div>
        </div>
      ))
    )}
  </div>
</div>

      </div>

    </div>
  );
}