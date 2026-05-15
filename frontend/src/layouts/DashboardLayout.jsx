import { Outlet, useNavigate, Link } from "react-router-dom";

export default function DashboardLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-blue-900 text-white p-5 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-10">EduConnect</h1>

        <nav className="space-y-4 flex-1">
          <Link to="/" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Dashboard
          </Link>

          <Link to="/students" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Students
          </Link>

          <Link to="/attendance" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Attendance
          </Link>

          <Link to="/attendance-report" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Attendance Reports
          </Link>

          <Link to="/results" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Results
          </Link>

          <Link to="/fees" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Fees
          </Link>

          <Link to="/teachers" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Teachers
          </Link>

          <Link to="/notifications" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Notifications
          </Link>

          <Link to="/report-cards" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Report Cards
          </Link>
          <Link to="/teacher-analytics" className="block px-4 py-3 rounded-lg hover:bg-blue-800">
            Teacher Analytics
          </Link>
        </nav>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 py-2 rounded-lg"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-5">
        <Outlet />
      </main>
    </div>
  );
}