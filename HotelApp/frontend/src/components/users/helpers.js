export const ROLES = {
  admin: {
    label: "Administrator",
    color: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20"
  },
  receptionist: {
    label: "Front Office",
    color: "bg-sky-500/10 text-sky-400 border-sky-500/20",
    badge: "bg-sky-500/10 text-sky-400 border-sky-500/20"
  },
  housekeeping: {
    label: "Housekeeping",
    color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
  },
  fnb: {
    label: "Food & Beverage",
    color: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    badge: "bg-orange-500/10 text-orange-400 border-orange-500/20"
  }
};

export const getRoleInfo = (roleKey) => ROLES[roleKey] || {
  label: roleKey,
  color: "bg-zinc-800 text-zinc-300 border-zinc-700",
  badge: "bg-zinc-800 text-zinc-300 border-zinc-700"
};
