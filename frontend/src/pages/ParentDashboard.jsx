import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import StatsCard from "../components/StatsCard";

import {
  GraduationCap,
  CalendarCheck,
  Bell,
  ClipboardList,
  TrendingUp,
  UserRound,
} from "lucide-react";

export default function ParentDashboard() {
  const [data, setData] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const res = await API.get(
        "/parent/dashboard"
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
        attendancePercentage: 0,
        marksAverage: 0,
        notices: 0,
        totalMarks: 0,
      };
    }

    const attendance =
      data.attendance || [];

    const present =
      attendance.filter(
        (a) =>
          a.status === "Present"
      ).length;

    const attendancePercentage =
      attendance.length > 0
        ? (
            (present /
              attendance.length) *
            100
          ).toFixed(1)
        : 0;

    const marks =
      data.marks || [];

    const average =
      marks.length > 0
        ? (
            marks.reduce(
              (acc, mark) =>
                acc +
                (mark.marksObtained /
                  mark.totalMarks) *
                  100,
              0
            ) / marks.length
          ).toFixed(1)
        : 0;

    return {
      attendancePercentage,

      marksAverage: average,

      notices:
        data.notifications
          ?.length || 0,

      totalMarks: marks.length,
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

  const student = data.student;

  const cards = [
    {
      title: "Attendance",
      value: `${analytics.attendancePercentage}%`,
      icon: CalendarCheck,
      gradient:
        "from-blue-600 to-indigo-600",
    },

    {
      title: "Average Marks",
      value: `${analytics.marksAverage}%`,
      icon: ClipboardList,
      gradient:
        "from-emerald-600 to-green-600",
    },

    {
      title: "Exams",
      value:
        analytics.totalMarks,
      icon: GraduationCap,
      gradient:
        "from-violet-600 to-purple-600",
    },

    {
      title: "Notices",
      value: analytics.notices,
      icon: Bell,
      gradient:
        "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-sky-900 via-blue-900 to-indigo-900 p-8 text-white shadow-xl">

        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-sky-400/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-indigo-400/20 blur-3xl" />

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">

          <div>

            <p className="text-sky-300 text-sm uppercase tracking-[0.2em]">
              Guardian Portal
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight">
              Welcome,
              {" "}
              {student?.parentName}
            </h1>

            <p className="mt-4 max-w-2xl text-sky-100 leading-relaxed">
              Track attendance, marks, notices, fees, and report cards from one guardian dashboard.
            </p>

          </div>

          <div className="rounded-3xl border border-white/10 bg-white/10 p-6 backdrop-blur">

            <div className="flex items-center gap-4">

              <div className="rounded-2xl bg-white/10 p-4">

                <UserRound
                  size={28}
                  className="text-sky-200"
                />

              </div>

              <div>

                <p className="text-sky-200 text-sm">
                  Student
                </p>

                <h2 className="text-2xl font-bold">
                  {student?.name}
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

        {/* PROFILE */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <h2 className="text-2xl font-bold text-slate-900">
            Student Information
          </h2>

          <p className="mt-1 text-slate-500">
            Academic and personal details
          </p>

          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Roll Number
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {student?.rollNo}
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Class
              </p>

              <h3 className="mt-2 text-2xl font-bold text-slate-900">
                {student?.className}
                -
                {student?.section}
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Parent Contact
              </p>

              <h3 className="mt-2 text-xl font-bold text-slate-900">
                {student?.parentPhone}
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
                    Student Status
                  </p>

                  <h3 className="mt-1 text-xl font-bold text-emerald-600">
                    Active
                  </h3>

                </div>

              </div>

            </div>

          </div>

        </div>

        {/* QUICK INSIGHTS */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            Quick Insights
          </h2>

          <p className="mt-1 text-slate-500">
            Academic summary
          </p>

          <div className="mt-8 space-y-5">

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Attendance Records
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {data.attendance?.length}
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Marks Uploaded
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {data.marks?.length}
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Notifications
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                {
                  data.notifications
                    ?.length
                }
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}