import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import StatsCard from "../components/StatsCard";

import {
  BookOpen,
  GraduationCap,
  CalendarCheck,
  Bell,
  ClipboardList,
  TrendingUp,
} from "lucide-react";

export default function TeacherDashboard() {
  const [data, setData] = useState(null);

  const [loading, setLoading] =
    useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/teacher/dashboard"
      );

      setData(res.data);
    } catch (error) {
      alert(
        error.response?.data?.message ||
          "Failed to load dashboard"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const analytics = useMemo(() => {
    if (!data) {
      return {
        totalStudents: 0,
        attendanceRecords: 0,
        marksUploaded: 0,
        noticesSent: 0,
      };
    }

    return {
      totalStudents:
        data.students?.length || 0,

      attendanceRecords:
        data.attendance?.length || 0,

      marksUploaded:
        data.marks?.length || 0,

      noticesSent:
        data.notifications?.length || 0,
    };
  }, [data]);

  if (loading) {
    return (
      <div className="p-10">
        Loading dashboard...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-10">
        Failed to load dashboard
      </div>
    );
  }

  const teacher = data.teacher;

  const cards = [
    {
      title: "Assigned Students",
      value: analytics.totalStudents,
      icon: GraduationCap,
      gradient:
        "from-blue-600 to-indigo-600",
    },

    {
      title: "Attendance Records",
      value:
        analytics.attendanceRecords,
      icon: CalendarCheck,
      gradient:
        "from-emerald-600 to-green-600",
    },

    {
      title: "Marks Uploaded",
      value:
        analytics.marksUploaded,
      icon: ClipboardList,
      gradient:
        "from-violet-600 to-purple-600",
    },

    {
      title: "Notices Sent",
      value:
        analytics.noticesSent,
      icon: Bell,
      gradient:
        "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-violet-900 via-violet-800 to-indigo-900 p-8 text-white shadow-xl">

        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">

          <div>

            <p className="text-violet-300 text-sm uppercase tracking-[0.2em]">
              Teacher Portal
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Welcome,
              {" "}
              {teacher?.name}
            </h1>

            <p className="mt-4 max-w-2xl text-violet-100 leading-relaxed">
              Manage attendance,
              academic performance,
              notices, and classroom
              operations from your
              dashboard.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-white/10 p-4">

                <BookOpen
                  size={28}
                  className="text-violet-200"
                />

              </div>

              <div>

                <p className="text-violet-200 text-sm">
                  Subject
                </p>

                <h2 className="text-2xl font-bold">
                  {teacher?.subject}
                </h2>

              </div>

            </div>

          </div>

        </div>

      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">

        {cards.map((card) => (
          <StatsCard
            key={card.title}
            title={card.title}
            value={card.value}
            icon={card.icon}
            gradient={card.gradient}
          />
        ))}       

      </div>

      {/* LOWER GRID */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* ASSIGNED CLASSES */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Assigned Classes
              </h2>

              <p className="mt-1 text-slate-500">
                Classes currently assigned to you
              </p>

            </div>

          </div>

          <div className="mt-8 flex flex-wrap gap-4">

            {teacher?.assignedClasses?.map(
              (cls) => (

                <div
                  key={cls}
                  className="rounded-2xl bg-gradient-to-r from-violet-100 to-indigo-100 px-5 py-4 font-semibold text-violet-800"
                >
                  {cls}
                </div>

              )
            )}

          </div>

        </div>

        {/* PERFORMANCE */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Performance
          </h2>

          <p className="mt-1 text-slate-500">
            Teaching analytics
          </p>

          <div className="mt-8 space-y-5">

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Subject
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {teacher?.subject}
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Classes Assigned
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">

                {
                  teacher
                    ?.assignedClasses
                    ?.length
                }

              </h3>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <div className="flex items-center gap-3">

                <TrendingUp
                  className="text-emerald-600"
                  size={22}
                />

                <div>

                  <p className="text-sm text-slate-500">
                    Portal Status
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-emerald-600">
                    Active
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}