export const RESERVATION_STATUSES = [
  {
    key: "pending",
    label: "Pending",
    desc: "Menunggu pembayaran/konfirmasi",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    desc: "Terkonfirmasi & dijamin",
    color: "bg-sky-50 border-sky-200 text-sky-700",
    dot: "bg-sky-500",
    badge: "bg-sky-50 text-sky-700 border-sky-200",
  },
  {
    key: "checked_in",
    label: "Checked In",
    desc: "Tamu sudah berada di kamar",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    key: "checked_out",
    label: "Checked Out",
    desc: "Tamu sudah meninggalkan hotel",
    color: "bg-zinc-100 border-zinc-200 text-zinc-600",
    dot: "bg-zinc-400",
    badge: "bg-zinc-100 text-zinc-600 border-zinc-200",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    desc: "Reservasi dibatalkan",
    color: "bg-rose-50 border-rose-200 text-rose-700",
    dot: "bg-rose-500",
    badge: "bg-rose-50 text-rose-700 border-rose-200",
  },
  {
    key: "no_show",
    label: "No Show",
    desc: "Tamu tidak datang tanpa info",
    color: "bg-purple-50 border-purple-200 text-purple-700",
    dot: "bg-purple-500",
    badge: "bg-purple-50 text-purple-700 border-purple-200",
  },
];

export const getStatus = (key) => RESERVATION_STATUSES.find((s) => s.key === key) ?? RESERVATION_STATUSES[0];

export const CHANNELS = [
  { key: "walk_in", label: "Walk-in" },
  { key: "phone", label: "Telepon" },
  { key: "ota", label: "OTA (Online Travel Agent)" },
  { key: "website", label: "Website" },
  { key: "email", label: "Email" },
];

export const getChannelLabel = (key) => CHANNELS.find((c) => c.key === key)?.label ?? key;

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
