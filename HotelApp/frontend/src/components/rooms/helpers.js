export const STATUSES = [
  {
    key: "vc",
    label: "VC",
    desc: "Vacant Clean",
    color: "bg-emerald-400/15 border-emerald-400/30 text-emerald-400",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    ring: "ring-emerald-400/40",
  },
  {
    key: "vd",
    label: "VD",
    desc: "Vacant Dirty",
    color: "bg-amber-400/15 border-amber-400/30 text-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    ring: "ring-amber-400/40",
  },
  {
    key: "oc",
    label: "OC",
    desc: "Occupied Clean",
    color: "bg-sky-400/15 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    ring: "ring-sky-400/40",
  },
  {
    key: "od",
    label: "OD",
    desc: "Occupied Dirty",
    color: "bg-orange-400/15 border-orange-400/30 text-orange-400",
    dot: "bg-orange-500",
    badge: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    ring: "ring-orange-400/40",
  },
  {
    key: "ooo",
    label: "OOO",
    desc: "Out of Order",
    color: "bg-zinc-700/40 border-zinc-600/40 text-zinc-400",
    dot: "bg-zinc-500",
    badge: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30",
    ring: "ring-zinc-500/40",
  },
  {
    key: "oos",
    label: "OOS",
    desc: "Out of Service",
    color: "bg-zinc-700/40 border-zinc-600/40 text-zinc-500",
    dot: "bg-zinc-600",
    badge: "bg-zinc-700/20 text-zinc-500 border-zinc-600/20",
    ring: "ring-zinc-600/40",
  },
];

export const getStatus = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];

export const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount || 0);
