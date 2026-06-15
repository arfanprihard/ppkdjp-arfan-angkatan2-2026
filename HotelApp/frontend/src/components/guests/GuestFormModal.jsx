import React, { useState } from "react";
import { RefreshCw, AlertCircle, User, X } from "lucide-react";
import api from "../../api/axios";

const GuestFormModal = ({ guest, onClose, onSaved }) => {
  const [name, setName] = useState(guest ? guest.name : "");
  const [idType, setIdType] = useState(guest ? guest.id_type : "ktp");
  const [idNumber, setIdNumber] = useState(guest ? guest.id_number : "");
  const [phone, setPhone] = useState(guest ? guest.phone ?? "" : "");
  const [email, setEmail] = useState(guest ? guest.email ?? "" : "");
  const [address, setAddress] = useState(guest ? guest.address ?? "" : "");
  const [nationality, setNationality] = useState(guest ? guest.nationality ?? "Indonesia" : "Indonesia");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !idNumber) {
      setError("Nama Lengkap dan Nomor Identitas wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        id_type: idType,
        id_number: idNumber,
        phone: phone || null,
        email: email || null,
        address: address || null,
        nationality: nationality || null,
      };

      let res;
      if (guest) {
        // Edit Mode
        res = await api.put(`/api/guests/${guest.id}`, payload);
      } else {
        // Create Mode
        res = await api.post("/api/guests", payload);
      }

      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message ?? "Gagal menyimpan data.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-white">
              {guest ? "Ubah Data Tamu" : "Daftarkan Tamu Baru"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
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
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
            />
          </div>

          {/* ID Type & ID Number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe Identitas *</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500/40 outline-none cursor-pointer"
              >
                <option value="ktp">KTP</option>
                <option value="passport">Paspor</option>
                <option value="sim">SIM</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No. Identitas *</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Contoh: 31710XXXXXXXXXXX"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No. Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812XXXXXXXX"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@example.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
              />
            </div>
          </div>

          {/* Nationality */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Kewarganegaraan</label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Contoh: Indonesia, Malaysia, Australia..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Alamat Lengkap</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Merdeka No. 12, Jakarta Pusat"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none resize-none"
            />
          </div>

          {/* Buttons */}
          <div className="pt-3 border-t border-zinc-800 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Data"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestFormModal;
