export const RESERVATION_STATUSES = [
  {
    key: "pending",
    label: "Pending",
    desc: "Menunggu pembayaran/konfirmasi",
    color: "bg-amber-400/15 border-amber-400/30 text-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    desc: "Terkonfirmasi & dijamin",
    color: "bg-sky-400/15 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  },
  {
    key: "checked_in",
    label: "Checked In",
    desc: "Tamu sudah berada di kamar",
    color: "bg-emerald-400/15 border-emerald-400/30 text-emerald-400",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
  {
    key: "checked_out",
    label: "Checked Out",
    desc: "Tamu sudah meninggalkan hotel",
    color: "bg-zinc-700/40 border-zinc-600/40 text-zinc-400",
    dot: "bg-zinc-500",
    badge: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    desc: "Reservasi dibatalkan",
    color: "bg-rose-400/15 border-rose-400/30 text-rose-400",
    dot: "bg-rose-500",
    badge: "bg-rose-400/10 text-rose-400 border-rose-400/20",
  },
  {
    key: "no_show",
    label: "No Show",
    desc: "Tamu tidak datang tanpa info",
    color: "bg-purple-400/15 border-purple-400/30 text-purple-400",
    dot: "bg-purple-500",
    badge: "bg-purple-400/10 text-purple-400 border-purple-400/20",
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
