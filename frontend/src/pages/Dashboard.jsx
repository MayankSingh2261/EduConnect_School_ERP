import { useEffect, useState } from "react";
import API from "../services/api";
import StatsCard from "../components/StatsCard";
import {
  Users,
  UserRound,
  CalendarCheck,
  Bell,
  TrendingUp,
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    students: 0,
    teachers: 0,
    attendance: 0,
    notices: 0,
  });

  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);

      const [
        studentsRes,
        teachersRes,
        attendanceRes,
        noticesRes,
      ] = await Promise.all([
        API.get("/students"),
        API.get("/teachers"),
        API.get("/attendance/report/all"),
        API.get("/notifications"),
      ]);

      setStats({
        students: studentsRes.data.students?.length || 0,
        teachers: teachersRes.data.teachers?.length || 0,
        attendance: attendanceRes.data.reports?.length || 0,
        notices: noticesRes.data.notifications?.length || 0,
      });     
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const cards = [
    {
      title: "Total Students",
      value: stats.students,
      icon: Users,
      gradient:
        "from-blue-600 to-indigo-600",
    },

    {
      title: "Teachers",
      value: stats.teachers,
      icon: UserRound,
      gradient:
        "from-violet-600 to-purple-600",
    },

    {
      title: "Attendance Records",
      value: stats.attendance,
      icon: CalendarCheck,
      gradient:
        "from-emerald-600 to-green-600",
    },

    {
      title: "Notifications",
      value: stats.notices,
      icon: Bell,
      gradient:
        "from-orange-500 to-red-500",
    },
  ];

  return (
    <div className="space-y-8">

      {/* HERO */}
      <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-800 p-8 text-white shadow-xl">

        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-blue-500/20 blur-3xl" />

        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-violet-500/20 blur-3xl" />

        <div className="relative z-10">

          <div className="flex flex-wrap items-center justify-between gap-6">

            <div>

              <p className="text-slate-400 text-sm uppercase tracking-[0.2em]">
                EduConnect ERP
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight">
                Admin Dashboard
              </h1>

              <p className="mt-4 max-w-2xl text-slate-300 leading-relaxed">
                Manage students, teachers,
                attendance, academic records,
                and institutional communication
                from one centralized platform.
              </p>

            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">

              <div className="flex items-center gap-3">

                <div className="rounded-2xl bg-emerald-500/20 p-3">
                  <TrendingUp
                    className="text-emerald-400"
                    size={28}
                  />
                </div>

                <div>

                  <p className="text-slate-400 text-sm">
                    System Status
                  </p>

                  <h3 className="text-xl font-bold text-emerald-400">
                    Operational
                  </h3>

                </div>

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
          value={
            loading
              ? "..."
              : card.value
          }
          icon={card.icon}
          gradient={card.gradient}
        />

      ))}

      </div>

      {/* QUICK PANELS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* RECENT ACTIVITY */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">

          <div className="flex items-center justify-between">

            <div>

              <h2 className="text-2xl font-bold text-slate-900">
                Recent Activity
              </h2>

              <p className="mt-1 text-slate-500">
                Latest academic operations
              </p>

            </div>

          </div>

          <div className="mt-8 space-y-4">

            {[
              "Teacher uploaded marks for Class 10-A",
              "Attendance submitted successfully",
              "New student registered",
              "Notice sent to Class 9-B",
            ].map((item, index) => (

              <div
                key={index}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 p-4 transition hover:bg-slate-50"
              >

                <div className="h-3 w-3 rounded-full bg-emerald-500" />

                <p className="font-medium text-slate-700">
                  {item}
                </p>

              </div>

            ))}

          </div>

        </div>

        {/* SYSTEM INFO */}
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">

          <h2 className="text-2xl font-bold text-slate-900">
            System Insights
          </h2>

          <p className="mt-1 text-slate-500">
            Academic platform overview
          </p>

          <div className="mt-8 space-y-5">

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                Active Modules
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                12+
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                User Roles
              </p>

              <h3 className="mt-2 text-3xl font-bold text-slate-900">
                4
              </h3>

            </div>

            <div className="rounded-2xl bg-slate-50 p-5">

              <p className="text-sm text-slate-500">
                ERP Status
              </p>

              <h3 className="mt-2 text-2xl font-bold text-emerald-600">
                Stable
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}