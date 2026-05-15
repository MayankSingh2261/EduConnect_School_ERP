import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function StudentMarks() {
  const [marks, setMarks] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedSubject, setSelectedSubject] =
    useState("");

  const [selectedExam, setSelectedExam] =
    useState("");

  const fetchMarks = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/student/dashboard"
      );

      setMarks(
        res.data.marks || []
      );
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load marks"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, []);

  const subjectOptions = useMemo(() => {
    return [
      ...new Set(
        marks.map(
          (m) => m.subject
        )
      ),
    ];
  }, [marks]);

  const examOptions = useMemo(() => {
    return [
      ...new Set(
        marks.map(
          (m) => m.examType
        )
      ),
    ];
  }, [marks]);

  const filteredMarks = useMemo(() => {
    return marks.filter((mark) => {
      const subjectMatch =
        selectedSubject
          ? mark.subject ===
            selectedSubject
          : true;

      const examMatch =
        selectedExam
          ? mark.examType ===
            selectedExam
          : true;

      return (
        subjectMatch &&
        examMatch
      );
    });
  }, [
    marks,
    selectedSubject,
    selectedExam,
  ]);

  const analytics = useMemo(() => {
    if (
      filteredMarks.length === 0
    ) {
      return {
        average: 0,
        highest: 0,
        lowest: 0,
        passed: 0,
      };
    }

    const percentages =
      filteredMarks.map((mark) =>
        (
          (mark.marksObtained /
            mark.totalMarks) *
          100
        ).toFixed(1)
      );

    const average =
      (
        percentages.reduce(
          (a, b) =>
            Number(a) +
            Number(b),
          0
        ) /
        percentages.length
      ).toFixed(1);

    const highest =
      Math.max(...percentages);

    const lowest =
      Math.min(...percentages);

    const passed =
      percentages.filter(
        (p) => p >= 40
      ).length;

    return {
      average,
      highest,
      lowest,
      passed,
    };
  }, [filteredMarks]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Academic Performance
        </h1>

        <p className="text-emerald-100 mt-2">
          Track marks, exams, and subject-wise performance.
        </p>

      </div>

      {/* FILTERS */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          Filters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          <select
            value={selectedSubject}
            onChange={(e) =>
              setSelectedSubject(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          >

            <option value="">
              All Subjects
            </option>

            {subjectOptions.map(
              (subject) => (
                <option
                  key={subject}
                  value={subject}
                >
                  {subject}
                </option>
              )
            )}

          </select>

          <select
            value={selectedExam}
            onChange={(e) =>
              setSelectedExam(
                e.target.value
              )
            }
            className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
          >

            <option value="">
              All Exams
            </option>

            {examOptions.map(
              (exam) => (
                <option
                  key={exam}
                  value={exam}
                >
                  {exam}
                </option>
              )
            )}

          </select>

        </div>

      </div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Average %
          </p>

          <h2 className="text-4xl font-bold text-blue-600 mt-3">
            {analytics.average}%
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Highest %
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {analytics.highest}%
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Lowest %
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            {analytics.lowest}%
          </h2>

        </div>

        <div className="bg-white rounded-3xl border shadow-sm p-6">

          <p className="text-gray-500">
            Passed Subjects
          </p>

          <h2 className="text-4xl font-bold text-emerald-600 mt-3">
            {analytics.passed}
          </h2>

        </div>

      </div>

      {/* TABLE */}
      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">

        <div className="p-6 border-b">

          <h2 className="text-xl font-semibold">
            Marks History
          </h2>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[1100px]">

            <thead className="bg-gray-50 text-gray-600 text-sm">

              <tr>

                <th className="px-6 py-4 text-left">
                  Subject
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
                    colSpan="5"
                    className="px-6 py-10 text-center"
                  >
                    Loading marks...
                  </td>

                </tr>

              ) : filteredMarks.length ===
                0 ? (

                <tr>

                  <td
                    colSpan="5"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No marks found
                  </td>

                </tr>

              ) : (

                filteredMarks.map(
                  (mark) => {

                    const percentage =
                      (
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

                        <td className="px-6 py-4 font-semibold text-blue-700">
                          {
                            mark.subject
                          }
                        </td>

                        <td className="px-6 py-4">
                          {
                            mark.examType
                          }
                        </td>

                        <td className="px-6 py-4 font-medium">
                          {
                            mark.marksObtained
                          }
                          /
                          {
                            mark.totalMarks
                          }
                        </td>

                        <td className="px-6 py-4 font-bold">
                          {
                            percentage
                          }
                          %
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
                  }
                )

              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}