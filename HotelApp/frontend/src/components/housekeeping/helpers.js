export const TASK_TYPES = {
  room_cleaning: { label: "Pembersihan Kamar", color: "bg-zinc-100 text-zinc-700 border-zinc-200" },
  turndown: { label: "Turndown Service", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  deep_clean: { label: "Deep Clean", color: "bg-purple-50 text-purple-700 border-purple-200" },
  pool: { label: "Area Kolam", color: "bg-sky-50 text-sky-700 border-sky-200" },
  public_area: { label: "Area Publik", color: "bg-teal-50 text-teal-700 border-teal-200" },
  room_inspection: { label: "Inspeksi Kamar (Checkout)", color: "bg-rose-50 text-rose-700 border-rose-200" },
  extra_bed: { label: "Penyusunan Extra Bed", color: "bg-amber-50 text-amber-700 border-amber-200" },
  laundry: { label: "Layanan Laundry Tamu", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
};

export const PRIORITIES = {
  low: { label: "Rendah", color: "bg-zinc-100 text-zinc-650 border-zinc-200" },
  medium: { label: "Sedang", color: "bg-blue-50 text-blue-700 border-blue-200" },
  high: { label: "Tinggi", color: "bg-amber-50 text-amber-700 border-amber-200" },
  urgent: { label: "Darurat", color: "bg-rose-50 text-rose-700 border-rose-200 animate-pulse font-extrabold" },
};

export const STATUS_MAP = {
  pending: { label: "Menunggu", color: "bg-amber-50 text-amber-700 border-amber-200", dot: "bg-amber-500" },
  in_progress: { label: "Dikerjakan", color: "bg-blue-50 text-blue-700 border-blue-200", dot: "bg-blue-500" },
  completed: { label: "Selesai", color: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-500" },
  cancelled: { label: "Dibatalkan", color: "bg-zinc-100 text-zinc-550 border-zinc-200", dot: "bg-zinc-400" },
};

export const ROOM_STATUSES = {
  vc: { label: "VC", desc: "Vacant Clean", color: "bg-emerald-50 border-emerald-200 text-emerald-700", dot: "bg-emerald-500" },
  vd: { label: "VD", desc: "Vacant Dirty", color: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500" },
  oc: { label: "OC", desc: "Occupied Clean", color: "bg-sky-50 border-sky-200 text-sky-700", dot: "bg-sky-500" },
  od: { label: "OD", desc: "Occupied Dirty", color: "bg-orange-50 border-orange-200 text-orange-700", dot: "bg-orange-500" },
  ooo: { label: "OOO", desc: "Out of Order", color: "bg-zinc-100 border-zinc-200 text-zinc-650", dot: "bg-zinc-450" },
  oos: { label: "OOS", desc: "Out of Service", color: "bg-zinc-100 border-zinc-200 text-zinc-650", dot: "bg-zinc-450" },
};

export const formatTime = (timeStr) => {
  if (!timeStr) return "—";
  const date = new Date(timeStr);
  return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
};
