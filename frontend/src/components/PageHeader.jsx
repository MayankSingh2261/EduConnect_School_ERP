export default function PageHeader({
  title,
  subtitle,
  gradient = "from-blue-700 to-indigo-600",
  action,
}) {
  return (
    <div
      className={`rounded-[32px] bg-gradient-to-r ${gradient} p-8 text-white shadow-sm`}
    >
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <h1 className="text-3xl font-bold tracking-tight">
            {title}
          </h1>

          {subtitle && (
            <p className="mt-2 text-white/80 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}

        </div>

        {action && (
          <div>
            {action}
          </div>
        )}

      </div>
    </div>
  );
}