export default function StatsCard({
  title,
  value,
  icon: Icon,
  gradient = "from-blue-600 to-indigo-600",
}) {
  return (
    <div className="group relative overflow-hidden rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">

      <div
        className={`absolute right-0 top-0 h-32 w-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 blur-2xl`}
      />

      <div className="relative z-10 flex items-start justify-between">

        <div>

          <p className="text-sm font-medium text-slate-500">
            {title}
          </p>

          <h2 className="mt-4 text-4xl font-bold text-slate-900">
            {value}
          </h2>

        </div>

        <div
          className={`rounded-2xl bg-gradient-to-br ${gradient} p-4 text-white shadow-lg`}
        >

          {Icon && <Icon size={24} />}

        </div>

      </div>

    </div>
  );
}