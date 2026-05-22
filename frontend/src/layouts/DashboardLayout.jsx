import {
  Outlet,
  NavLink,
  useNavigate,
} from "react-router-dom";

import {
  LayoutDashboard,
  Users,
  UserRound,
  CalendarCheck,
  FileText,
  IndianRupee,
  Bell,
  GraduationCap,
  BarChart3,
  LogOut,
  Menu,
  X,
  ShieldCheck,
} from "lucide-react";

import { useState } from "react";

const navItems = [
  {
    name: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },

  {
    name: "Students",
    path: "/students",
    icon: Users,
  },

  {
    name: "Teachers",
    path: "/teachers",
    icon: UserRound,
  },

  {
    name: "Attendance",
    path: "/attendance",
    icon: CalendarCheck,
  },

  {
    name: "Attendance Reports",
    path: "/attendance-report",
    icon: FileText,
  },

  {
    name: "Results",
    path: "/results",
    icon: GraduationCap,
  },

  {
    name: "Fees",
    path: "/fees",
    icon: IndianRupee,
  },

  {
    name: "Notifications",
    path: "/notifications",
    icon: Bell,
  },

  {
    name: "Report Cards",
    path: "/report-cards",
    icon: FileText,
  },

  {
    name: "Teacher Analytics",
    path: "/teacher-analytics",
    icon: BarChart3,
  },

  {
  name: "Audit Logs",
  path: "/audit-logs",
  icon: ShieldCheck,
},

];

export default function DashboardLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-100">

      {/* MOBILE TOPBAR */}
      <div className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-200 bg-white px-4 py-4 shadow-sm md:hidden">

        <div>

          <h1 className="text-xl font-bold text-slate-900">
            EduConnect
          </h1>

          <p className="text-xs text-slate-500">
            Admin ERP
          </p>

        </div>

        <button
          onClick={() =>
            setSidebarOpen(true)
          }
          className="rounded-xl border border-slate-200 p-2"
        >

          <Menu size={22} />

        </button>

      </div>

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (

        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden"
          onClick={() =>
            setSidebarOpen(false)
          }
        />

      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col bg-slate-950 text-white transition-transform duration-300 ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >

        {/* HEADER */}
        <div className="flex items-center justify-between border-b border-white/10 p-6">

          <div>

            <h1 className="text-2xl font-bold tracking-tight">
              EduConnect
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Admin ERP Panel
            </p>

          </div>

          {/* MOBILE CLOSE */}
          <button
            onClick={() =>
              setSidebarOpen(false)
            }
            className="rounded-xl border border-white/10 p-2 md:hidden"
          >

            <X size={20} />

          </button>

        </div>

        {/* NAV */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">

          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                onClick={() =>
                  setSidebarOpen(false)
                }
                className={({
                  isActive,
                }) =>
                  `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
                    isActive
                      ? "bg-white text-slate-950 shadow-sm"
                      : "text-slate-300 hover:bg-white/10 hover:text-white"
                  }`
                }
              >

                <Icon size={18} />

                <span>
                  {item.name}
                </span>

              </NavLink>
            );
          })}

        </nav>

        {/* FOOTER */}
        <div className="border-t border-white/10 p-4">

          <button
            onClick={logout}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-500 px-4 py-3 font-semibold text-white hover:bg-red-600 transition"
          >

            <LogOut size={18} />

            Logout

          </button>

        </div>

      </aside>

      {/* MAIN */}
      <main className="min-h-screen p-4 md:ml-72 md:p-8">

        <Outlet />

      </main>

    </div>
  );
}