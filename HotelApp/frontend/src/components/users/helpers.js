export const ROLES = {
  admin: {
    label: "Administrator",
    color: "bg-rose-50 text-rose-700 border-rose-250",
    badge: "bg-rose-50 text-rose-700 border-rose-250"
  },
  receptionist: {
    label: "Front Office",
    color: "bg-sky-50 text-sky-700 border-sky-250",
    badge: "bg-sky-50 text-sky-700 border-sky-250"
  },
  housekeeping: {
    label: "Housekeeping",
    color: "bg-emerald-50 text-emerald-700 border-emerald-250",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-250"
  },
  fnb: {
    label: "Food & Beverage",
    color: "bg-amber-50 text-amber-700 border-amber-250",
    badge: "bg-amber-50 text-amber-700 border-amber-250"
  }
};

export const getRoleInfo = (roleKey) => ROLES[roleKey] || {
  label: roleKey,
  color: "bg-zinc-100 text-zinc-650 border-zinc-200",
  badge: "bg-zinc-100 text-zinc-650 border-zinc-200"
};
