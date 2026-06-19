import React, { useState } from "react";
import { User, X, AlertTriangle, RefreshCw, Eye, EyeOff, Key } from "lucide-react";
import api from "../../api/axios";
import { ROLES } from "./helpers";

const UserFormModal = ({ user, onClose, onSaved }) => {
  const [name, setName] = useState(user ? user.name : "");
  const [email, setEmail] = useState(user ? user.email : "");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(user ? user.role : "receptionist");
  const [isActive, setIsActive] = useState(user ? user.is_active : true);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email) {
      setError("Nama Lengkap dan Email wajib diisi.");
      return;
    }

    if (!user && !password) {
      setError("Password wajib diisi untuk pendaftaran baru.");
      return;
    }

    if (password && password.length < 6) {
      setError("Password minimal berukuran 6 karakter.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        email,
        role,
        is_active: isActive,
      };

      if (password) {
        payload.password = password;
      }

      let res;
      if (user) {
        res = await api.put(`/api/users/${user.id}`, payload);
      } else {
        res = await api.post("/api/users", payload);
      }

      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message || "Gagal menyimpan akun.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan sistem.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-zinc-900">
              {user ? `Ubah Profil: ${user.name}` : "Daftarkan Staf Baru"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-500 hover:text-zinc-950 rounded-lg hover:bg-zinc-100 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Alex Pratama"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
            />
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email *</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="alex@hotelops.com"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
            />
          </div>

          {/* Password */}
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Password {user ? "(Kosongkan jika tidak diubah)" : "*"}
              </label>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required={!user}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={user ? "••••••••" : "Minimal 6 karakter"}
                className="w-full rounded-xl border border-zinc-300 bg-white pl-3 pr-10 py-2 text-sm text-zinc-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer animate-none bg-transparent border-none"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          {/* Role selection */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Jabatan / Peran *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none cursor-pointer"
            >
              {Object.entries(ROLES).map(([key, val]) => (
                <option key={key} value={key}>
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {/* Status Keaktifan (hanya jika edit mode) */}
          {user && (
            <div className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-zinc-200">
              <div>
                <p className="text-xs font-bold text-zinc-800">Status Akun</p>
                <p className="text-[10px] text-zinc-500 mt-0.5">Aktifkan atau nonaktifkan login staf</p>
              </div>
              <button
                type="button"
                onClick={() => setIsActive(!isActive)}
                className={`w-12 h-6.5 rounded-full p-1 transition-all duration-200 cursor-pointer flex items-center border-0 ${
                  isActive ? "bg-emerald-500 justify-end" : "bg-zinc-300 justify-start"
                }`}
              >
                <span className="w-4.5 h-4.5 rounded-full bg-white shadow-md" />
              </button>
            </div>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-600 text-sm font-semibold hover:bg-zinc-50 transition-colors cursor-pointer bg-white"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Akun"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserFormModal;
