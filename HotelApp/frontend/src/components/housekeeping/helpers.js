export const TASK_TYPES = {
  room_cleaning: { label: "Pembersihan Kamar", color: "bg-zinc-800 text-zinc-300 border-zinc-700" },
  turndown: { label: "Turndown Service", color: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20" },
  deep_clean: { label: "Deep Clean", color: "bg-purple-500/10 text-purple-400 border-purple-500/20" },
  pool: { label: "Area Kolam", color: "bg-sky-500/10 text-sky-400 border-sky-500/20" },
  public_area: { label: "Area Publik", color: "bg-teal-500/10 text-teal-400 border-teal-500/20" },
};

export const PRIORITIES = {
  low: { label: "Rendah", color: "bg-zinc-800 text-zinc-400 border-zinc-700" },
  medium: { label: "Sedang", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  high: { label: "Tinggi", color: "bg-amber-500/15 text-amber-400 border-amber-500/30" },
  urgent: { label: "Darurat", color: "bg-rose-500/15 text-rose-400 border-rose-500/30 animate-pulse font-extrabold" },
};

export const STATUS_MAP = {
  pending: { label: "Menunggu", color: "bg-amber-400/10 text-amber-400 border-amber-400/20", dot: "bg-amber-400" },
  in_progress: { label: "Dikerjakan", color: "bg-blue-400/10 text-blue-400 border-blue-400/20", dot: "bg-blue-400" },
  completed: { label: "Selesai", color: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20", dot: "bg-emerald-400" },
  cancelled: { label: "Dibatalkan", color: "bg-zinc-700/20 text-zinc-500 border-zinc-600", dot: "bg-zinc-500" },
};

export const ROOM_STATUSES = {
  vc: { label: "VC", desc: "Vacant Clean", color: "bg-emerald-400/15 border-emerald-400/30 text-emerald-400", dot: "bg-emerald-400" },
  vd: { label: "VD", desc: "Vacant Dirty", color: "bg-amber-400/15 border-amber-400/30 text-amber-400", dot: "bg-amber-400" },
  oc: { label: "OC", desc: "Occupied Clean", color: "bg-sky-400/15 border-sky-400/30 text-sky-400", dot: "bg-sky-400" },
  od: { label: "OD", desc: "Occupied Dirty", color: "bg-orange-400/15 border-orange-400/30 text-orange-400", dot: "bg-orange-500" },
  ooo: { label: "OOO", desc: "Out of Order", color: "bg-zinc-700/40 border-zinc-600/40 text-zinc-400", dot: "bg-zinc-500" },
  oos: { label: "OOS", desc: "Out of Service", color: "bg-zinc-700/40 border-zinc-600/40 text-zinc-400", dot: "bg-zinc-600" },
};

export const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const date = new Date(timeStr);
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};
