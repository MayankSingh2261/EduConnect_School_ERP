import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import PageHeader from "../components/PageHeader";
import DataTable from "../components/DataTable";
import { ShieldCheck, UserRound, Clock } from "lucide-react";

export default function AuditLogs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/audit-logs");
      setLogs(res.data.logs || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load audit logs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const filteredLogs = useMemo(() => {
    const keyword = search.toLowerCase();

    return logs.filter((log) => {
      return (
        log.adminName?.toLowerCase().includes(keyword) ||
        log.adminEmail?.toLowerCase().includes(keyword) ||
        log.action?.toLowerCase().includes(keyword) ||
        log.module?.toLowerCase().includes(keyword) ||
        log.ipAddress?.toLowerCase().includes(keyword)
      );
    });
  }, [logs, search]);

  const getActionStyle = (action) => {
    if (action.includes("DELETE")) return "bg-red-100 text-red-700";
    if (action.includes("RESET")) return "bg-orange-100 text-orange-700";
    if (action.includes("UPDATE")) return "bg-yellow-100 text-yellow-700";
    if (action.includes("CREATE")) return "bg-green-100 text-green-700";
    return "bg-blue-100 text-blue-700";
  };

  const columns = [
    {
      key: "admin",
      label: "Admin",
      render: (row) => (
        <div>
          <p className="font-semibold text-slate-900">{row.adminName}</p>
          <p className="text-xs text-slate-500">{row.adminEmail}</p>
        </div>
      ),
    },
    {
      key: "action",
      label: "Action",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-sm font-semibold ${getActionStyle(
            row.action
          )}`}
        >
          {row.action}
        </span>
      ),
    },
    {
      key: "module",
      label: "Module",
      render: (row) => (
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700">
          {row.module}
        </span>
      ),
    },
    {
      key: "recordId",
      label: "Record ID",
      render: (row) => (
        <span className="text-xs text-slate-500">{row.recordId || "—"}</span>
      ),
    },
    {
      key: "device",
      label: "Device / IP",
      render: (row) => (
        <div>
          <p className="text-sm text-slate-700">{row.ipAddress || "—"}</p>
          <p className="max-w-[260px] truncate text-xs text-slate-400">
            {row.userAgent || "Unknown device"}
          </p>
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Time",
      render: (row) => new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className="space-y-8">
      <PageHeader
        title="Admin Audit Logs"
        subtitle="Track critical admin actions, security events, IP addresses, and device information."
        gradient="from-slate-900 to-slate-700"
      />

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <ShieldCheck className="text-slate-700" size={28} />
          <p className="mt-4 text-slate-500">Total Logs</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            {logs.length}
          </h2>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <UserRound className="text-blue-600" size={28} />
          <p className="mt-4 text-slate-500">Admins Tracked</p>
          <h2 className="mt-2 text-4xl font-bold text-slate-900">
            {[...new Set(logs.map((log) => log.adminEmail))].length}
          </h2>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <Clock className="text-emerald-600" size={28} />
          <p className="mt-4 text-slate-500">Monitoring</p>
          <h2 className="mt-2 text-3xl font-bold text-emerald-600">Active</h2>
        </div>
      </div>

      <DataTable
        title="Security Activity"
        subtitle="Search and review sensitive admin actions."
        columns={columns}
        data={filteredLogs}
        search={search}
        setSearch={setSearch}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        loading={loading}
        emptyMessage="No audit logs found"
      />
    </div>
  );
}