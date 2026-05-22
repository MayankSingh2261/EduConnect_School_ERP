import { useEffect, useMemo, useState } from "react";
import API from "../services/api";
import PageHeader from "../components/PageHeader";
import {
  Bell,
  Megaphone,
  Send,
  UserRound,
  Clock,
  ShieldCheck,
} from "lucide-react";

const initialForm = {
  title: "",
  message: "",
  type: "general",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [selectedType, setSelectedType] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await API.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.post("/notifications", {
        ...formData,
        sentBy: "Admin",
        senderRole: "admin",
      });

      setFormData(initialForm);
      fetchNotifications();
      alert("Notification published successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to publish notification");
    } finally {
      setSaving(false);
    }
  };

  const typeOptions = useMemo(() => {
    return [...new Set(notifications.map((item) => item.type))];
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((item) =>
      selectedType ? item.type === selectedType : true
    );
  }, [notifications, selectedType]);

  const getTypeStyle = (type) => {
    switch (type) {
      case "attendance":
        return "bg-yellow-100 text-yellow-700";
      case "fee":
        return "bg-red-100 text-red-700";
      case "result":
        return "bg-green-100 text-green-700";
      case "notice":
        return "bg-violet-100 text-violet-700";
      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
  <div className="space-y-8">
    <PageHeader
      title="Notifications Center"
      subtitle="Create announcements, monitor notices, and track communication history."
      gradient="from-cyan-700 to-blue-600"
    />

    <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
      {/* PUBLISH BOX - FIXED HEIGHT */}
      <form
        onSubmit={handleSubmit}
        className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2"
      >
        <div className="mb-6 flex items-center gap-3">
          <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
            <Send size={20} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Publish Notification
            </h2>
            <p className="text-slate-500">
              Send an official announcement.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            name="title"
            placeholder="Notification Title"
            value={formData.title}
            onChange={handleChange}
            required
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:bg-white"
          />

          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:bg-white"
          >
            <option value="general">General</option>
            <option value="attendance">Attendance</option>
            <option value="fee">Fee</option>
            <option value="result">Result</option>
            <option value="notice">Notice</option>
          </select>

          <textarea
            name="message"
            placeholder="Write notification message..."
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className="md:col-span-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:bg-white resize-none"
          />
        </div>

        <button
          disabled={saving}
          className="mt-5 rounded-2xl bg-cyan-700 px-6 py-3 font-semibold text-white hover:bg-cyan-800 disabled:bg-slate-400"
        >
          {saving ? "Publishing..." : "Publish Notification"}
        </button>
      </form>

      {/* RIGHT FILTER PANEL */}
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-blue-100 p-3 text-blue-700">
              <Bell size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Filter Notifications
              </h2>
              <p className="text-sm text-slate-500">
                View notices by category.
              </p>
            </div>
          </div>

          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="mt-5 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-cyan-500 focus:bg-white"
          >
            <option value="">All Types</option>

            {typeOptions.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-100 p-3 text-emerald-700">
              <ShieldCheck size={20} />
            </div>

            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Audit Tracking
              </h2>
              <p className="text-sm text-slate-500">
                Sender name and role are recorded.
              </p>
            </div>
          </div>

          <div className="mt-5 rounded-2xl bg-emerald-50 p-4">
            <p className="text-sm text-emerald-700 font-semibold">
              Status: Active
            </p>
          </div>
        </div>
      </div>
    </div>

    {/* NOTIFICATIONS LIST STARTS BELOW PUBLISH BOX */}
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">
          Published Notifications
        </h2>
        <p className="mt-1 text-slate-500">
          Latest notices and announcements.
        </p>
      </div>

      {loading ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading notifications...
        </div>
      ) : filteredNotifications.length === 0 ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-10 text-center text-slate-500">
          No notifications found
        </div>
      ) : (
        filteredNotifications.map((item) => (
          <div
            key={item._id}
            className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm"
          >
            <div className="p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-relaxed text-slate-600">
                    {item.message}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-sm font-semibold capitalize ${getTypeStyle(
                    item.type
                  )}`}
                >
                  {item.type}
                </span>
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                  <UserRound size={16} />
                  Sent by:
                  <strong className="text-slate-800">
                    {item.sentBy || "System"}
                  </strong>
                </span>

                <span className="flex items-center gap-2 capitalize">
                  <ShieldCheck size={16} />
                  {item.senderRole || "system"}
                </span>

                <span className="flex items-center gap-2">
                  <Clock size={16} />
                  {new Date(item.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
);
}