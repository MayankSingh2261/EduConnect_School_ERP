import { useEffect, useState } from "react";
import API from "../services/api";

export default function AttendanceReport() {

  const [reports, setReports] = useState([]);

  const [loading, setLoading] = useState(false);

  const fetchReports = async () => {
    try {

      setLoading(true);

      const res = await API.get(
        "/attendance/report/all"
      );

      setReports(res.data.reports);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div>

      <div className="mb-6">

        <h1 className="text-3xl font-bold">
          Attendance Reports
        </h1>

        <p className="text-gray-500 mt-1">
          Complete attendance history
        </p>

      </div>

      <div className="bg-white rounded-2xl shadow-sm border overflow-x-auto">

        <table className="w-full">

          <thead className="bg-blue-900 text-white">

            <tr>
              <th className="p-4 text-left">
                Date
              </th>

              <th className="p-4 text-left">
                Student
              </th>

              <th className="p-4 text-left">
                Roll No
              </th>

              <th className="p-4 text-left">
                Class
              </th>

              <th className="p-4 text-left">
                Status
              </th>
            </tr>

          </thead>

          <tbody>

            {loading ? (

              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center"
                >
                  Loading...
                </td>
              </tr>

            ) : reports.length === 0 ? (

              <tr>
                <td
                  colSpan="5"
                  className="p-6 text-center"
                >
                  No Reports Found
                </td>
              </tr>

            ) : (

              reports.map((item) => (

                <tr
                  key={item._id}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="p-4">
                    {item.date}
                  </td>

                  <td className="p-4">
                    {item.student?.name}
                  </td>

                  <td className="p-4">
                    {item.student?.rollNo}
                  </td>

                  <td className="p-4">
                    {item.student?.className}-
                    {item.student?.section}
                  </td>

                  <td
                    className={`p-4 font-semibold ${
                      item.status === "Present"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.status}
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