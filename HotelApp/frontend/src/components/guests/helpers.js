export const RESERVATION_STATUSES = [
  { key: "pending", label: "Pending", badge: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  { key: "confirmed", label: "Confirmed", badge: "bg-sky-400/10 text-sky-400 border-sky-400/20" },
  { key: "checked_in", label: "Checked In", badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  { key: "checked_out", label: "Checked Out", badge: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30" },
  { key: "cancelled", label: "Cancelled", badge: "bg-rose-400/10 text-rose-400 border-rose-400/20" },
  { key: "no_show", label: "No Show", badge: "bg-purple-400/10 text-purple-400 border-purple-400/20" },
];

export const getResStatusBadge = (key) =>
  RESERVATION_STATUSES.find((s) => s.key === key)?.badge ?? "bg-zinc-800 text-zinc-400 border-zinc-700/30";

export const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

export const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};
