import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

import PageHeader from "../components/PageHeader";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";

import {
  ClipboardList,
  GraduationCap,
  BookOpen,
  Trophy,
} from "lucide-react";

const initialForm = {
  student: "",
  subject: "",
  examType: "",
  marksObtained: "",
  totalMarks: "",
};

export default function Results() {
  const [students, setStudents] =
    useState([]);

  const [results, setResults] =
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

  const fetchData = async () => {
    try {
      setLoading(true);

      const [
        studentsRes,
        resultsRes,
      ] = await Promise.all([
        API.get("/students"),
        API.get("/marks"),
      ]);

      setStudents(
        studentsRes.data.students || []
      );

      setResults(
        resultsRes.data.marks || []
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.post(
        "/results",
        formData
      );

      alert(
        "Result uploaded successfully"
      );

      setFormData(initialForm);

      fetchData();
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to upload result"
      );
    } finally {
      setSaving(false);
    }
  };

  const filteredResults =
    useMemo(() => {
      const keyword =
        search.toLowerCase();

      return results.filter(
        (item) =>
          item.student?.name
            ?.toLowerCase()
            .includes(keyword) ||
          item.subject
            ?.toLowerCase()
            .includes(keyword) ||
          item.examType
            ?.toLowerCase()
            .includes(keyword)
      );
    }, [results, search]);

  const averageMarks =
    useMemo(() => {
      if (!results.length) return 0;

      const avg =
        results.reduce(
          (acc, item) =>
            acc +
            (item.marksObtained /
              item.totalMarks) *
              100,
          0
        ) / results.length;

      return avg.toFixed(1);
    }, [results]);

  const columns = [
    {
      key: "student",
      label: "Student",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">
            {
              row.student?.name
            }
          </p>

          <p className="text-xs text-slate-500">
            Roll:
            {" "}
            {
              row.student
                ?.rollNo
            }
          </p>
        </div>
      ),
    },

    {
      key: "subject",
      label: "Subject",
      render: (row) => (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {row.subject}
        </span>
      ),
    },

    {
      key: "examType",
      label: "Exam",
      render: (row) => (
        <span className="rounded-full bg-violet-100 px-3 py-1 text-sm font-semibold text-violet-700">
          {row.examType}
        </span>
      ),
    },

    {
      key: "marks",
      label: "Marks",
      render: (row) => (
        <div>
          <p className="font-bold text-slate-900">
            {row.marksObtained}
            /
            {row.totalMarks}
          </p>

          <p className="text-xs text-slate-500">
            {(
              (row.marksObtained /
                row.totalMarks) *
              100
            ).toFixed(1)}
            %
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-8">

      <PageHeader
          title="Academic Results Monitoring"
          subtitle="Review student performance records uploaded by teachers."
          gradient="from-indigo-700 to-blue-600"
      />        

      {/* STATS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        <StatsCard
          title="Total Results"
          value={results.length}
          icon={ClipboardList}
          gradient="from-blue-600 to-indigo-600"
        />

        <StatsCard
          title="Students"
          value={students.length}
          icon={GraduationCap}
          gradient="from-violet-600 to-purple-600"
        />

        <StatsCard
          title="Subjects"
          value={
            [
              ...new Set(
                results.map(
                  (r) =>
                    r.subject
                )
              ),
            ].length
          }
          icon={BookOpen}
          gradient="from-emerald-600 to-green-600"
        />

        <StatsCard
          title="Average Score"
          value={`${averageMarks}%`}
          icon={Trophy}
          gradient="from-orange-500 to-red-500"
        />

      </div>

      

      {/* TABLE */}
      <DataTable
        title="Academic Results"
        subtitle="Search and review uploaded examination records."
        columns={columns}
        data={filteredResults}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={
          setCurrentPage
        }
        loading={loading}
        emptyMessage="No results found"
      />

    </div>
  );
}