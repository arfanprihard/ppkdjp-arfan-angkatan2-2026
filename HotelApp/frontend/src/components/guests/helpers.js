export const RESERVATION_STATUSES = [
  { key: "pending", label: "Pending", badge: "bg-amber-50 text-amber-700 border-amber-200" },
  { key: "confirmed", label: "Confirmed", badge: "bg-sky-50 text-sky-700 border-sky-200" },
  { key: "checked_in", label: "Checked In", badge: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  { key: "checked_out", label: "Checked Out", badge: "bg-zinc-100 text-zinc-600 border-zinc-200" },
  { key: "cancelled", label: "Cancelled", badge: "bg-rose-50 text-rose-700 border-rose-200" },
  { key: "no_show", label: "No Show", badge: "bg-purple-50 text-purple-700 border-purple-200" },
];

export const getResStatusBadge = (key) =>
  RESERVATION_STATUSES.find((s) => s.key === key)?.badge ?? "bg-zinc-100 text-zinc-600 border-zinc-200";

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
