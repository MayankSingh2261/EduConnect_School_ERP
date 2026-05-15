import {
  Outlet,
  Link,
  useNavigate,
} from "react-router-dom";

export default function StudentLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();

    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* SIDEBAR */}
      <aside className="w-64 bg-emerald-900 text-white p-6 hidden md:flex flex-col">

        <h1 className="text-2xl font-bold mb-10">
          Student Portal
        </h1>

        <nav className="space-y-3 flex-1">

          <Link to="/student" className="block px-4 py-3 rounded-xl hover:bg-emerald-800">
            Dashboard
          </Link>
          <Link to="/student/attendance" className="block px-4 py-3 rounded-xl hover:bg-emerald-800">
            Attendance
          </Link>
          <Link to="/student/marks" className="block px-4 py-3 rounded-xl hover:bg-emerald-800">
            Marks
          </Link>
          <Link to="/student/notices" className="block px-4 py-3 rounded-xl hover:bg-emerald-800">
            Notices
          </Link>

        </nav>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 py-3 rounded-xl font-semibold"
        >
          Logout
        </button>

      </aside>

      {/* CONTENT */}
      <main className="flex-1 p-6">

        <Outlet />

      </main>

    </div>
  );
}