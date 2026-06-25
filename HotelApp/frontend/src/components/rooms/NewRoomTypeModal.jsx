import React, { useState } from "react";
import { Bed, X, AlertTriangle, RefreshCw } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../contexts/ToastContext";

const NewRoomTypeModal = ({ onClose, onSaved }) => {
  const toast = useToast();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [defaultCapacity, setDefaultCapacity] = useState(2);
  const [basePrice, setBasePrice] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !name || !defaultCapacity || basePrice < 0) {
      setError("Semua kolom bertanda * wajib diisi dengan benar.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/room-types", {
        code: code.toUpperCase().trim(),
        name: name.trim(),
        description: description.trim() || null,
        default_capacity: Number(defaultCapacity),
        base_price: Number(basePrice),
      });
      if (res.data.success) {
        toast.success(`Tipe Kamar "${name}" berhasil ditambahkan.`);
        onSaved();
      } else {
        setError(res.data.message || "Gagal menambahkan tipe kamar.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambahkan tipe kamar.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-zinc-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-emerald-600" />
            <h3 className="text-base font-bold text-zinc-800">Tambah Tipe Kamar Baru</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-slate-100 cursor-pointer border-0 bg-transparent">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1 col-span-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Kode Tipe *</label>
              <input type="text" required value={code} onChange={(e) => setCode(e.target.value)} placeholder="STD" maxLength={10}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 outline-none uppercase" />
            </div>
            <div className="space-y-1 col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nama Tipe *</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Standard Room"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Kapasitas Tamu *</label>
              <input type="number" min={1} required value={defaultCapacity} onChange={(e) => setDefaultCapacity(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Harga Dasar *</label>
              <input type="number" min={0} required value={basePrice} onChange={(e) => setBasePrice(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/10 outline-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Deskripsi (Opsional)</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Deskripsi mengenai tipe kamar ini..."
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-emerald-600 outline-none resize-none" />
          </div>
          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-slate-50 cursor-pointer">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-0">
              {saving ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>) : "Simpan Tipe Kamar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRoomTypeModal;
