import { useEffect, useMemo, useState } from "react";
import API from "../services/api";

export default function StudentNotices() {
  const [notifications, setNotifications] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [selectedType, setSelectedType] =
    useState("");

  const fetchNotifications =
    async () => {
      try {
        setLoading(true);

        const res = await API.get(
          "/student/dashboard"
        );

        setNotifications(
          res.data.notifications || []
        );
      } catch (error) {
        alert(
          error.response?.data?.message ||
            "Failed to load notices"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const typeOptions = useMemo(() => {
    return [
      ...new Set(
        notifications.map(
          (n) => n.type
        )
      ),
    ];
  }, [notifications]);

  const filteredNotifications =
    useMemo(() => {
      return notifications.filter(
        (item) =>
          selectedType
            ? item.type ===
              selectedType
            : true
      );
    }, [
      notifications,
      selectedType,
    ]);

  return (
    <div className="space-y-8">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 text-white rounded-3xl p-8 shadow-sm">

        <h1 className="text-3xl font-bold">
          Notices & Announcements
        </h1>

        <p className="text-emerald-100 mt-2">
          Stay updated with academic and school notifications.
        </p>

      </div>

      {/* FILTER */}
      <div className="bg-white rounded-3xl border shadow-sm p-6">

        <h2 className="text-xl font-semibold mb-4">
          Filter Notices
        </h2>

        <select
          value={selectedType}
          onChange={(e) =>
            setSelectedType(
              e.target.value
            )
          }
          className="w-full md:w-80 rounded-xl border border-gray-300 bg-gray-50 px-4 py-3"
        >

          <option value="">
            All Notice Types
          </option>

          {typeOptions.map((type) => (
            <option
              key={type}
              value={type}
            >
              {type}
            </option>
          ))}

        </select>

      </div>

      {/* NOTICES */}
      <div className="space-y-6">

        {loading ? (

          <div className="bg-white rounded-3xl border shadow-sm p-10 text-center">
            Loading notices...
          </div>

        ) : filteredNotifications.length ===
          0 ? (

          <div className="bg-white rounded-3xl border shadow-sm p-10 text-center text-gray-500">
            No notices found
          </div>

        ) : (

          filteredNotifications.map(
            (item) => (

              <div
                key={item._id}
                className="bg-white rounded-3xl border shadow-sm overflow-hidden"
              >

                {/* TOP */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6">

                  <div className="flex flex-wrap items-center justify-between gap-4">

                    <div>

                      <h2 className="text-2xl font-bold">
                        {item.title}
                      </h2>

                      <p className="text-blue-100 mt-2 capitalize">
                        {item.type}
                      </p>

                    </div>

                    <span className="bg-white/20 px-4 py-2 rounded-full text-sm font-semibold capitalize">
                      {
                        item.senderRole
                      }
                    </span>

                  </div>

                </div>

                {/* BODY */}
                <div className="p-6">

                  <p className="text-gray-700 leading-relaxed">
                    {item.message}
                  </p>

                  <div className="flex flex-wrap gap-4 mt-6 text-sm text-gray-500">

                    <span>

                      Sent By:
                      {" "}

                      <strong className="text-gray-700">
                        {item.sentBy ||
                          "System"}
                      </strong>

                    </span>

                    <span>
                      {new Date(
                        item.createdAt
                      ).toLocaleString()}
                    </span>

                  </div>

                </div>

              </div>
            )
          )

        )}

      </div>

    </div>
  );
}