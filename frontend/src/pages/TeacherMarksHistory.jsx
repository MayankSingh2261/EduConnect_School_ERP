import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function TeacherMarksHistory() {
  const [marks, setMarks] = useState([]);
  const [teacher, setTeacher] = useState(null);

  const [loading, setLoading] = useState(false);

  const [selectedClass, setSelectedClass] = useState("");
  const [selectedSection, setSelectedSection] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);

      const res = await API.get("/teacher/dashboard");

      setTeacher(res.data.teacher);
      setMarks(res.data.marks || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load marks");
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
        marks.map(
          (mark) => mark.student?.className
        )
      ),
    ];
  }, [marks]);

  const sectionOptions = useMemo(() => {
    return [
      ...new Set(
        marks
          .filter(
            (mark) =>
              mark.student?.className === selectedClass
          )
          .map(
            (mark) =>
              mark.student?.section
          )
      ),
    ];
  }, [marks, selectedClass]);

  const filteredMarks = useMemo(() => {
    return marks.filter((mark) => {
      const classMatch = selectedClass
        ? mark.student?.className === selectedClass
        : true;

      const sectionMatch = selectedSection
        ? mark.student?.section === selectedSection
        : true;

      return classMatch && sectionMatch;
    });
  }, [
    marks,
    selectedClass,
    selectedSection,
  ]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-violet-700 to-violet-500 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Marks History
        </h1>

        <p className="text-violet-100 mt-2">
          View previously uploaded marks records.
        </p>

      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          Filter Records
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value);
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
              setSelectedSection(e.target.value)
            }
            disabled={!selectedClass}
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3 disabled:bg-gray-200"
          >

            <option value="">
              Select Section
            </option>

            {sectionOptions.map((section) => (
              <option
                key={section}
                value={section}
              >
                Section {section}
              </option>
            ))}

          </select>

        </div>

      </div>

      {/* MARKS TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">
            Uploaded Marks
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Subject:
            {" "}
            {teacher?.subject}
          </p>

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
                  Exam
                </th>

                <th className="px-6 py-4 text-left">
                  Marks
                </th>

                <th className="px-6 py-4 text-left">
                  Percentage
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
                    colSpan="7"
                    className="px-6 py-10 text-center"
                  >
                    Loading marks...
                  </td>

                </tr>

              ) : filteredMarks.length === 0 ? (

                <tr>

                  <td
                    colSpan="7"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No marks found
                  </td>

                </tr>

              ) : (

                filteredMarks.map((mark) => {

                  const percentage = (
                    (mark.marksObtained /
                      mark.totalMarks) *
                    100
                  ).toFixed(1);

                  const passed =
                    percentage >= 40;

                  return (
                    <tr
                      key={mark._id}
                      className="hover:bg-gray-50"
                    >

                      <td className="px-6 py-4 font-semibold">
                        {mark.student?.name}
                      </td>

                      <td className="px-6 py-4">
                        {mark.student?.rollNo}
                      </td>

                      <td className="px-6 py-4">
                        {mark.student?.className}
                        -
                        {mark.student?.section}
                      </td>

                      <td className="px-6 py-4">
                        {mark.examType}
                      </td>

                      <td className="px-6 py-4 font-medium">
                        {mark.marksObtained}
                        /
                        {mark.totalMarks}
                      </td>

                      <td className="px-6 py-4 font-bold text-violet-700">
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
                          {passed
                            ? "Passed"
                            : "Needs Support"}
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
  );
}