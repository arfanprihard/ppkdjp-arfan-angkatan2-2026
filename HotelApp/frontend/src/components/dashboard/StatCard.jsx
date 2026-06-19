const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  iconBg = "bg-blue-50",
  iconColor = "text-blue-600",
  valueColor = "text-zinc-800",
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white border border-zinc-200 rounded-2xl p-5 animate-pulse shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-slate-100" />
          <div className="h-3 w-16 bg-slate-100 rounded" />
        </div>
        <div className="h-7 w-24 bg-slate-100 rounded mb-2" />
        <div className="h-3 w-32 bg-slate-100 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-5 hover:border-blue-300 transition-all duration-300 group shadow-sm">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`h-10 w-10 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
        >
          {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
        </div>
      </div>
      <p className={`text-2xl font-bold tracking-tight ${valueColor} leading-none mb-1.5`}>
        {value ?? "—"}
      </p>
      <p className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">
        {label}
      </p>
      {sub && (
        <p className="text-[11px] text-zinc-400 mt-1">{sub}</p>
      )}
    </div>
  );
};

export default StatCard;
