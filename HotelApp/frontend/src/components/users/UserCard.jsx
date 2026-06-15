import React from "react";
import { User, Mail, Calendar, Edit2, UserMinus, UserCheck, Shield } from "lucide-react";
import { getRoleInfo } from "./helpers";

const UserCard = ({ user, onEdit, onToggleActive }) => {
  const roleInfo = getRoleInfo(user.role);
  const formattedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className="bg-zinc-900 border border-zinc-800/80 rounded-2xl p-5 hover:border-zinc-700 transition-all duration-300 relative overflow-hidden group flex flex-col justify-between h-[190px]">
      {/* Decorative role-based background glow */}
      <div className={`absolute -right-8 -top-8 w-24 h-24 rounded-full blur-2xl opacity-10 transition-all duration-500 group-hover:scale-125 ${user.role === 'admin' ? 'bg-rose-500' : user.role === 'receptionist' ? 'bg-sky-500' : user.role === 'housekeeping' ? 'bg-emerald-500' : 'bg-orange-500'}`} />

      <div className="space-y-3">
        {/* Name and Active Status */}
        <div className="flex items-start justify-between">
          <div className="space-y-1 max-w-[70%]">
            <h4 className="text-sm font-bold text-white group-hover:text-amber-500 transition-colors truncate" title={user.name}>
              {user.name}
            </h4>
            <span className={`inline-flex px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase tracking-wider ${roleInfo.badge}`}>
              {roleInfo.label}
            </span>
          </div>
          <div className="flex items-center gap-1.5 bg-zinc-950/40 px-2 py-1 rounded-lg border border-zinc-800/60">
            <span className={`h-1.5 w-1.5 rounded-full ${user.is_active ? "bg-emerald-400 animate-pulse" : "bg-rose-500"}`} />
            <span className={`text-[9px] font-extrabold uppercase ${user.is_active ? "text-emerald-400" : "text-rose-400"}`}>
              {user.is_active ? "Aktif" : "Nonaktif"}
            </span>
          </div>
        </div>

        {/* Email and Joined Date */}
        <div className="space-y-1.5 text-[11px] text-zinc-400 font-medium">
          <div className="flex items-center gap-2">
            <Mail className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span className="truncate" title={user.email}>{user.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-zinc-500 shrink-0" />
            <span>Terdaftar: {formattedDate}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-zinc-800/60 flex items-center justify-end gap-2">
        <button
          onClick={() => onEdit(user)}
          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-all cursor-pointer text-xs font-semibold flex items-center gap-1"
          title="Ubah Profil Staf"
        >
          <Edit2 className="h-3.5 w-3.5" />
          Edit
        </button>

        <button
          onClick={() => onToggleActive(user)}
          className={`p-1.5 rounded-lg transition-all cursor-pointer text-xs font-semibold flex items-center gap-1 ${
            user.is_active
              ? "bg-rose-950/20 hover:bg-rose-900/30 text-rose-400 hover:text-rose-300 border border-rose-900/20"
              : "bg-emerald-950/20 hover:bg-emerald-900/30 text-emerald-400 hover:text-emerald-300 border border-emerald-900/20"
          }`}
          title={user.is_active ? "Nonaktifkan Akun" : "Aktifkan Akun"}
        >
          {user.is_active ? (
            <>
              <UserMinus className="h-3.5 w-3.5" />
              Nonaktifkan
            </>
          ) : (
            <>
              <UserCheck className="h-3.5 w-3.5" />
              Aktifkan
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default UserCard;
