import { useEffect, useState } from "react";
import API from "../services/api";

const BACKEND_URL = "http://localhost:8000";

export default function ReportCards() {
  const [reportCards, setReportCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchReportCards = async () => {
    try {
      setLoading(true);
      const res = await API.get("/report-cards");
      setReportCards(res.data.reportCards || []);
    } catch (error) {
      alert("Failed to load report cards");
    } finally {
      setLoading(false);
    }
  };

  const generateAllReportCards = async () => {
    try {
      setGenerating(true);
      const res = await API.post("/report-cards/generate-all");

      alert(
        `${res.data.generatedCount || 0} report cards generated successfully`
      );

      fetchReportCards();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to generate report cards");
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    fetchReportCards();
  }, []);

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white rounded-3xl p-8 shadow-sm">
        <h1 className="text-3xl font-bold">Report Card Management</h1>
        <p className="text-indigo-100 mt-2">
          Generate, manage, and download student report cards.
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={generateAllReportCards}
          disabled={generating}
          className="bg-blue-900 hover:bg-blue-800 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {generating ? "Generating..." : "Generate All Report Cards"}
        </button>
      </div>

      <div className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Generated Report Cards</h2>
          <p className="text-gray-500 text-sm mt-1">
            Download previously generated academic report cards.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px]">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-4 text-left">Student</th>
                <th className="px-6 py-4 text-left">Exam</th>
                <th className="px-6 py-4 text-left">Marks</th>
                <th className="px-6 py-4 text-left">Percentage</th>
                <th className="px-6 py-4 text-left">Grade</th>
                <th className="px-6 py-4 text-left">Generated</th>
                <th className="px-6 py-4 text-left">PDF</th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center">
                    Loading report cards...
                  </td>
                </tr>
              ) : reportCards.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center">
                    No report cards generated yet.
                  </td>
                </tr>
              ) : (
                reportCards.map((item) => (
                  <tr key={item._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-semibold">
                        {item.student?.name || "Unknown Student"}
                      </div>
                      <div className="text-sm text-gray-500">
                        Roll {item.student?.rollNo} • Class{" "}
                        {item.student?.className}-{item.student?.section}
                      </div>
                    </td>

                    <td className="px-6 py-4">{item.examType}</td>

                    <td className="px-6 py-4 font-medium">
                      {item.totalObtained}/{item.totalMarks}
                    </td>

                    <td className="px-6 py-4 font-bold text-blue-900">
                      {item.percentage}%
                    </td>

                    <td className="px-6 py-4">
                      <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {item.grade}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <a
                        href={`${BACKEND_URL}${item.pdfPath}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg inline-block"
                      >
                        Download
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}