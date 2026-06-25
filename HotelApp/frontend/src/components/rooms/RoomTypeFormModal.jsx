import React, { useState, useEffect } from "react";
import { Bed, X, AlertTriangle, RefreshCw } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../contexts/ToastContext";

const RoomTypeFormModal = ({ type, onClose, onSaved }) => {
  const toast = useToast();
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [defaultCapacity, setDefaultCapacity] = useState(2);
  const [basePrice, setBasePrice] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const isEdit = !!type;

  useEffect(() => {
    if (type) {
      setCode(type.code || "");
      setName(type.name || "");
      setDefaultCapacity(type.default_capacity || 2);
      setBasePrice(type.base_price || "");
      setDescription(type.description || "");
    }
  }, [type]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code || !name || !basePrice) {
      setError("Kode, Nama Tipe, dan Harga Dasar wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        code: code.toUpperCase(),
        name,
        default_capacity: Number(defaultCapacity),
        base_price: Number(basePrice),
        description: description || null,
      };

      let res;
      if (isEdit) {
        res = await api.put(`/api/room-types/${type.id}`, payload);
      } else {
        res = await api.post("/api/room-types", payload);
      }

      if (res.data.success) {
        toast.success(
          isEdit
            ? `Tipe kamar "${name}" berhasil diperbarui.`
            : `Tipe kamar "${name}" berhasil ditambahkan.`
        );
        onSaved();
      } else {
        setError(res.data.message || "Terjadi kesalahan.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Gagal menyimpan data tipe kamar."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-zinc-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-blue-600" />
            <h3 className="text-base font-bold text-zinc-800">
              {isEdit ? "Edit Tipe Kamar" : "Tambah Tipe Kamar Baru"}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-slate-100 cursor-pointer border-0 bg-transparent"
          >
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

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Kode Tipe *
              </label>
              <input
                type="text"
                required
                maxLength={10}
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Contoh: STD"
                disabled={isEdit}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none disabled:bg-zinc-550/10 disabled:text-zinc-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
                Kapasitas Default *
              </label>
              <input
                type="number"
                min={1}
                required
                value={defaultCapacity}
                onChange={(e) =>
                  setDefaultCapacity(
                    Math.max(1, parseInt(e.target.value) || 1)
                  )
                }
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Nama Tipe Kamar *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Standard Room"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Harga Dasar per Malam (Rp) *
            </label>
            <input
              type="number"
              min={0}
              required
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              placeholder="Contoh: 500000"
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">
              Deskripsi Tipe Kamar
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deskripsikan fasilitas tipe kamar..."
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 outline-none resize-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-slate-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-0"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />{" "}
                  Menyimpan...
                </>
              ) : (
                "Simpan Tipe"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomTypeFormModal;
