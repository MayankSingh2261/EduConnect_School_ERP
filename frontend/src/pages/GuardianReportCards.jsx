import { useEffect, useState } from "react";
import API from "../services/api";
import PageHeader from "../components/PageHeader";

const BACKEND_URL = "http://localhost:8000";

export default function GuardianReportCards() {
  const [reportCards, setReportCards] = useState([]);

  useEffect(() => {
    const fetchReportCards = async () => {
      const res = await API.get("/parent/dashboard");
      setReportCards(res.data.reportCards || []);
    };

    fetchReportCards();
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Report Cards"
        subtitle="Download academic report cards uploaded by school administration."
        gradient="from-violet-700 to-indigo-600"
      />

      <div className="bg-white rounded-[28px] border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-slate-900">
            Available Report Cards
          </h2>
        </div>

        <div className="divide-y">
          {reportCards.length === 0 ? (
            <div className="p-10 text-center text-slate-500">
              No report cards available
            </div>
          ) : (
            reportCards.map((item) => (
              <div
                key={item._id}
                className="p-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
              >
                <div>
                  <h3 className="font-bold text-xl text-slate-900">
                    {item.examType}
                  </h3>

                  <p className="text-slate-500 mt-1">
                    Percentage: {item.percentage}% • Grade: {item.grade}
                  </p>
                </div>

                <a
                  href={`${BACKEND_URL}${item.pdfPath}`}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-violet-700 px-5 py-3 text-center font-semibold text-white hover:bg-violet-800"
                >
                  Download PDF
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}