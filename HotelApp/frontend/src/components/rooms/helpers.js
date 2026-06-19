export const STATUSES = [
  {
    key: "vc",
    label: "VC",
    desc: "Vacant Clean",
    color: "bg-emerald-50 border-emerald-200 text-emerald-700",
    dot: "bg-emerald-500",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    ring: "ring-emerald-200",
  },
  {
    key: "vd",
    label: "VD",
    desc: "Vacant Dirty",
    color: "bg-amber-50 border-amber-200 text-amber-700",
    dot: "bg-amber-500",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    ring: "ring-amber-200",
  },
  {
    key: "oc",
    label: "OC",
    desc: "Occupied Clean",
    color: "bg-blue-50 border-blue-200 text-blue-700",
    dot: "bg-blue-500",
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    ring: "ring-blue-200",
  },
  {
    key: "od",
    label: "OD",
    desc: "Occupied Dirty",
    color: "bg-orange-50 border-orange-200 text-orange-700",
    dot: "bg-orange-500",
    badge: "bg-orange-50 text-orange-700 border-orange-200",
    ring: "ring-orange-200",
  },
  {
    key: "ooo",
    label: "OOO",
    desc: "Out of Order",
    color: "bg-zinc-100 border-zinc-300 text-zinc-700",
    dot: "bg-zinc-500",
    badge: "bg-zinc-100 text-zinc-700 border-zinc-200",
    ring: "ring-zinc-300",
  },
  {
    key: "oos",
    label: "OOS",
    desc: "Out of Service",
    color: "bg-slate-100 border-slate-300 text-slate-700",
    dot: "bg-slate-500",
    badge: "bg-slate-100 text-slate-700 border-slate-200",
    ring: "ring-slate-300",
  },
];

export const getStatus = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];

export const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount || 0);
