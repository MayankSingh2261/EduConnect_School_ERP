import { useEffect, useState } from "react";

import API from "../services/api";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {

  const [stats, setStats] = useState({
    totalStudents: 0,
    presentToday: 0,
    absentToday: 0,
    totalCollection: 0,
    totalPending: 0,
    paidFees: 0,
    partialFees: 0,
    pendingFees: 0, 
  });

  const fetchStats = async () => {
    try {

      const res = await API.get(
        "/dashboard/stats"
      );

      setStats(res.data);

    } catch (error) {

      console.log(error);

    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const chartData = [
    {
      name: "Present",
      value: stats.presentToday,
    },
    {
      name: "Absent",
      value: stats.absentToday,
    },
  ];

  const COLORS = [
    "#16a34a",
    "#dc2626",
  ];

  return (
    <div>

      {/* HEADER */}
      <div className="mb-8">

        <h1 className="text-3xl font-bold">
          Admin Dashboard
        </h1>

        <p className="text-gray-500 mt-1">
          School analytics overview
        </p>

      </div>

      {/* CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-2">

        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <p className="text-gray-500">
            Total Students
          </p>

          <h2 className="text-4xl font-bold mt-3">
            {stats.totalStudents}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <p className="text-gray-500">
            Present Today
          </p>

          <h2 className="text-4xl font-bold text-green-600 mt-3">
            {stats.presentToday}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <p className="text-gray-500">
            Absent Today
          </p>

          <h2 className="text-4xl font-bold text-red-600 mt-3">
            {stats.absentToday}
          </h2>

        </div>

      </div>

      {/* FEES ANALYTICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
  <div className="bg-white p-6 rounded-2xl border shadow-sm">
    <p className="text-gray-500">Fee Collection</p>
    <h2 className="text-3xl font-bold text-green-600 mt-3">
      ₹{stats.totalCollection.toLocaleString()}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl border shadow-sm">
    <p className="text-gray-500">Pending Fees</p>
    <h2 className="text-3xl font-bold text-red-600 mt-3">
      ₹{stats.totalPending.toLocaleString()}
    </h2>
  </div>

  <div className="bg-white p-6 rounded-2xl border shadow-sm">
    <p className="text-gray-500">Fee Records</p>
    <h2 className="text-1xl font-bold mt-3">
      {stats.paidFees} Paid / {stats.partialFees} Partial / {stats.pendingFees} Pending
    </h2>
  </div>
</div>

      {/* ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* PIE CHART */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <h2 className="text-xl font-semibold mb-6">
            Attendance Analytics
          </h2>

          <div className="w-full h-[350px] min-h-[350px]">

                <ResponsiveContainer width="100%" height={350}>

              <PieChart>

                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label
                >

                  {chartData.map((entry, index) => (
                    <Cell
                      key={index}
                      fill={COLORS[index]}
                    />
                  ))}

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        {/* QUICK INSIGHTS */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border">

          <h2 className="text-xl font-semibold mb-6">
            Quick Insights
          </h2>

          <div className="space-y-4">

            <div className="bg-gray-50 p-4 rounded-xl">

              <p className="text-gray-500">
                Attendance Rate
              </p>

              <h3 className="text-2xl font-bold mt-2">

                {stats.totalStudents > 0
                  ? (
                      (stats.presentToday /
                        stats.totalStudents) *
                      100
                    ).toFixed(1)
                  : 0}
                %

              </h3>

            </div>

            <div className="bg-gray-50 p-4 rounded-xl">

              <p className="text-gray-500">
                Absent Students
              </p>

              <h3 className="text-2xl font-bold mt-2 text-red-600">
                {stats.absentToday}
              </h3>

            </div>

            <div className="bg-gray-50 p-4 rounded-xl">

              <p className="text-gray-500">
                Active Students
              </p>

              <h3 className="text-2xl font-bold mt-2 text-green-600">
                {stats.presentToday}
              </h3>

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}