import { Outlet, Link, useNavigate } from "react-router-dom";

export default function TeacherLayout() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <aside className="w-64 bg-violet-900 text-white p-6 hidden md:flex flex-col">
        <h1 className="text-2xl font-bold mb-10">Teacher Portal</h1>

        <nav className="space-y-3 flex-1">
          <Link to="/teacher" className="block px-4 py-3 rounded-xl hover:bg-violet-800">
            Dashboard
          </Link>
          <Link to="/teacher/students" className="block px-4 py-3 rounded-xl hover:bg-violet-800">
            Assigned Students
          </Link>
          <Link to="/teacher/attendance" className="block px-4 py-3 rounded-xl hover:bg-violet-800">
            Mark Attendance
          </Link>
          <Link to="/teacher/marks" className="block px-4 py-3 rounded-xl hover:bg-violet-800">
            Upload Marks
          </Link>
          <Link to="/teacher/marks-history" className="block px-4 py-3 rounded-xl hover:bg-violet-800">
            Marks History
          </Link>
          <Link to="/teacher/notices" className="block px-4 py-3 rounded-xl hover:bg-violet-800">
            Send Notices
          </Link>
          <Link to="/teacher/attendance-history" className="block px-4 py-3 rounded-xl hover:bg-violet-800">
            Attendance History
          </Link>
        </nav>

        <button onClick={logout} className="bg-red-500 hover:bg-red-600 py-3 rounded-xl">
          Logout
        </button>
      </aside>

      <main className="flex-1 p-6">
        <Outlet />
      </main>
    </div>
  );
}