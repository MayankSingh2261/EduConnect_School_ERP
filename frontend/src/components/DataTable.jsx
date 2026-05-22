import {
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function DataTable({
  title,
  subtitle,
  columns,
  data,
  search,
  setSearch,
  currentPage,
  setCurrentPage,
  rowsPerPage = 10,
  loading = false,
  emptyMessage = "No data found",
}) {
  const totalPages = Math.ceil(
    data.length / rowsPerPage
  );

  const paginatedData = data.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  return (
    <div className="overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-sm">

      {/* HEADER */}
      <div className="flex flex-col gap-5 border-b border-slate-100 p-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h2 className="text-2xl font-bold text-slate-900">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-slate-500">
              {subtitle}
            </p>
          )}

        </div>

        {/* SEARCH */}
        <div className="relative w-full lg:w-80">

          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            size={18}
          />

          <input
            type="text"
            placeholder="Search..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 outline-none transition focus:border-blue-500 focus:bg-white"
          />

        </div>

      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">

        <table className="w-full min-w-[900px]">

          <thead className="bg-slate-50">

            <tr>

              {columns.map((column) => (

                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold text-slate-600"
                >
                  {column.label}
                </th>

              ))}

            </tr>

          </thead>

          <tbody className="divide-y divide-slate-100">

            {loading ? (

              <tr>

                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center text-slate-500"
                >
                  Loading...
                </td>

              </tr>

            ) : paginatedData.length ===
              0 ? (

              <tr>

                <td
                  colSpan={columns.length}
                  className="px-6 py-16 text-center text-slate-500"
                >
                  {emptyMessage}
                </td>

              </tr>

            ) : (

              paginatedData.map(
                (row, index) => (

                  <tr
                    key={index}
                    className="transition hover:bg-slate-50"
                  >

                    {columns.map(
                      (column) => (

                        <td
                          key={column.key}
                          className="px-6 py-4 text-sm text-slate-700"
                        >

                          {column.render
                            ? column.render(
                                row
                              )
                            : row[
                                column.key
                              ]}

                        </td>

                      )
                    )}

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

      {/* FOOTER */}
      <div className="flex flex-col gap-4 border-t border-slate-100 p-6 sm:flex-row sm:items-center sm:justify-between">

        <p className="text-sm text-slate-500">
          Total Records:
          {" "}
          {data.length}
        </p>

        <div className="flex items-center gap-3">

          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-50"
          >

            <ChevronLeft size={16} />

            Prev

          </button>

          <span className="text-sm font-semibold text-slate-700">

            {currentPage}
            {" "}
            /
            {" "}
            {totalPages || 1}

          </span>

          <button
            disabled={
              currentPage === totalPages ||
              totalPages === 0
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
            className="flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium transition hover:bg-slate-100 disabled:opacity-50"
          >

            Next

            <ChevronRight size={16} />

          </button>

        </div>

      </div>

    </div>
  );
}