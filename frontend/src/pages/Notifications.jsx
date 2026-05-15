import { useEffect, useState } from "react";
import API from "../services/api";

const initialForm = {
  title: "",
  message: "",
  type: "general",
};

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  const [formData, setFormData] = useState(initialForm);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  // FETCH NOTIFICATIONS
  const fetchNotifications = async () => {
    try {
      setLoading(true);

      const res = await API.get("/notifications");

      setNotifications(res.data.notifications || []);

    } catch (error) {

      console.log(error);

    } finally {

      setLoading(false);

    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // HANDLE INPUT
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      await API.post("/notifications", formData);

      setFormData(initialForm);

      fetchNotifications();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to create notification"
      );

    } finally {

      setSaving(false);

    }
  };

  // TYPE COLOR
  const getTypeStyle = (type) => {
    switch (type) {
      case "attendance":
        return "bg-yellow-100 text-yellow-700";

      case "fee":
        return "bg-red-100 text-red-700";

      case "result":
        return "bg-green-100 text-green-700";

      default:
        return "bg-blue-100 text-blue-700";
    }
  };

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-cyan-700 to-cyan-500 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Notifications Center
        </h1>

        <p className="text-cyan-100 mt-2">
          Manage alerts, announcements, and updates.
        </p>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl border shadow-sm p-6"
        >

          <h2 className="text-xl font-semibold mb-6">
            Create Notification
          </h2>

          <div className="space-y-4">

            <input
              type="text"
              name="title"
              placeholder="Notification Title"
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            <textarea
              name="message"
              placeholder="Write notification message..."
              value={formData.message}
              onChange={handleChange}
              rows={5}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
              required
            />

            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
            >

              <option value="general">
                General
              </option>

              <option value="attendance">
                Attendance
              </option>

              <option value="fee">
                Fee
              </option>

              <option value="result">
                Result
              </option>

            </select>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-3 rounded-xl font-semibold"
            >
              {saving
                ? "Publishing..."
                : "Publish Notification"}
            </button>

          </div>

        </form>

        {/* LIST */}
        <div className="xl:col-span-2 bg-white rounded-3xl border shadow-sm overflow-hidden">

          <div className="p-6 border-b">

            <h2 className="text-xl font-semibold">
              Recent Notifications
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              Latest alerts and announcements
            </p>

          </div>

          <div className="divide-y">

            {loading ? (

              <div className="p-10 text-center">
                Loading...
              </div>

            ) : notifications.length === 0 ? (

              <div className="p-10 text-center">
                No notifications found
              </div>

            ) : (

              notifications.map((item) => (

                <div
                  key={item._id}
                  className="p-6 hover:bg-gray-50 transition"
                >

                  <div className="flex items-start justify-between gap-4">

                    <div>

                      <h3 className="font-semibold text-lg">
                        {item.title}
                      </h3>

                      <p className="text-gray-600 mt-2">
                         {item.message}
                      </p>

                      <div className="flex flex-wrap gap-3 mt-3 text-sm text-gray-500">
                        <span>
                              Sent by:{" "}
                                <strong className="text-gray-800">
                           {item.sentBy || "System"}
                                </strong>
                        </span>

                        <span>
                          Role:{" "}
                          <strong className="text-gray-800">
                            {item.senderRole || "system"}
                          </strong>
                        </span>

                          <span>
                            {new Date(item.createdAt).toLocaleString()}
                          </span>
                        </div>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${getTypeStyle(
                        item.type
                      )}`}
                    >
                      {item.type}
                    </span>

                  </div>

                </div>

              ))

            )}

          </div>

        </div>

      </div>

    </div>
  );
}