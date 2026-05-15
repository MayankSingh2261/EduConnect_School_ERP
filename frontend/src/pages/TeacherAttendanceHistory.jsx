import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function TeacherAttendanceHistory() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const fetchAttendance = async () => {
    try {
      setLoading(true);

      const res = await API.get("/teacher/dashboard");

      setAttendance(res.data.attendance || []);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load attendance"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const classOptions = useMemo(() => {
    return [
      ...new Set(
        attendance.map(
          (item) =>
            item.student?.className
        )
      ),
    ];
  }, [attendance]);

  const sectionOptions = useMemo(() => {
    return [
      ...new Set(
        attendance
          .filter(
            (item) =>
              item.student?.className ===
              selectedClass
          )
          .map(
            (item) =>
              item.student?.section
          )
      ),
    ];
  }, [attendance, selectedClass]);

  const filteredAttendance =
    useMemo(() => {
      return attendance.filter((item) => {
        const classMatch =
          selectedClass
            ? item.student?.className ===
              selectedClass
            : true;

        const sectionMatch =
          selectedSection
            ? item.student?.section ===
              selectedSection
            : true;

        return (
          classMatch &&
          sectionMatch
        );
      });
    }, [
      attendance,
      selectedClass,
      selectedSection,
    ]);

  const handleStatusChange = async (
    attendanceId,
    newStatus
  ) => {
    try {
      await API.put(
        `/attendance/${attendanceId}`,
        {
          status: newStatus,
        }
      );

      setAttendance((prev) =>
        prev.map((item) =>
          item._id === attendanceId
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

      alert(
        "Attendance updated successfully"
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to update attendance"
      );
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-700 to-violet-500 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Attendance History
        </h1>

        <p className="text-violet-100 mt-2">
          View and edit attendance records.
        </p>

      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          Filter Attendance
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(
                e.target.value
              );

              setSelectedSection("");
            }}
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
            value={selectedSection}
            onChange={(e) =>
              setSelectedSection(
                e.target.value
              )
            }
            disabled={!selectedClass}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 disabled:bg-gray-200"
          >

            <option value="">
              Select Section
            </option>

            {sectionOptions.map(
              (section) => (
                <option
                  key={section}
                  value={section}
                >
                  Section {section}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">
            Attendance Records
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1000px]">

            <thead className="bg-gray-50 text-gray-600 text-sm">

              <tr>

                <th className="px-6 py-4 text-left">
                  Student
                </th>

                <th className="px-6 py-4 text-left">
                  Roll No
                </th>

                <th className="px-6 py-4 text-left">
                  Class
                </th>

                <th className="px-6 py-4 text-left">
                  Date
                </th>

                <th className="px-6 py-4 text-left">
                  Status
                </th>

                <th className="px-6 py-4 text-left">
                  Edit
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
                    Loading attendance...
                  </td>

                </tr>

              ) : filteredAttendance.length ===
                0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No attendance found
                  </td>

                </tr>

              ) : (

                filteredAttendance.map(
                  (item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-semibold">
                        {
                          item.student
                            ?.name
                        }
                      </td>

                      <td className="px-6 py-4">
                        {
                          item.student
                            ?.rollNo
                        }
                      </td>

                      <td className="px-6 py-4">
                        {
                          item.student
                            ?.className
                        }
                        -
                        {
                          item.student
                            ?.section
                        }
                      </td>

                      <td className="px-6 py-4">
                        {new Date(
                          item.date
                        ).toLocaleDateString()}
                      </td>

                      <td className="px-6 py-4">

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            item.status ===
                            "Present"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {
                            item.status
                          }
                        </span>

                      </td>

                      <td className="px-6 py-4">

                        <select
                          value={
                            item.status
                          }
                          onChange={(
                            e
                          ) =>
                            handleStatusChange(
                              item._id,
                              e.target
                                .value
                            )
                          }
                          className="rounded-xl border border-gray-300 px-4 py-2"
                        >

                          <option value="Present">
                            Present
                          </option>

                          <option value="Absent">
                            Absent
                          </option>

                        </select>

                      </td>

                    </tr>
                  )
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}