const StatCard = ({
  icon: Icon,
  label,
  value,
  sub,
  iconBg = "from-amber-400 to-orange-500",
  iconColor = "text-white",
  valueColor = "text-white",
  loading = false,
}) => {
  if (loading) {
    return (
      <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 animate-pulse">
        <div className="flex items-start justify-between mb-4">
          <div className="h-10 w-10 rounded-xl bg-zinc-800" />
          <div className="h-3 w-16 bg-zinc-800 rounded" />
        </div>
        <div className="h-7 w-24 bg-zinc-800 rounded mb-2" />
        <div className="h-3 w-32 bg-zinc-700 rounded" />
      </div>
    );
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/50 rounded-2xl p-5 hover:border-zinc-700/60 transition-all duration-300 group hover:bg-zinc-900/80">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`h-10 w-10 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-lg shrink-0`}
        >
          {Icon && <Icon className={`h-5 w-5 ${iconColor}`} />}
        </div>
      </div>
      <p className={`text-2xl font-bold tracking-tight ${valueColor} leading-none mb-1.5`}>
        {value ?? "—"}
      </p>
      <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-widest">
        {label}
      </p>
      {sub && (
        <p className="text-[11px] text-zinc-600 mt-1">{sub}</p>
      )}
    </div>
  );
};

export default StatCard;
