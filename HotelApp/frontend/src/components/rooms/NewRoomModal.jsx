import React, { useState } from "react";
import { Bed, X, AlertTriangle, RefreshCw } from "lucide-react";
import api from "../../api/axios";
import { STATUSES, formatRupiah } from "./helpers";

const NewRoomModal = ({ roomTypes, onClose, onSaved }) => {
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState(1);
  const [roomTypeId, setRoomTypeId] = useState("");
  const [status, setStatus] = useState("vc");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomNumber || !roomTypeId) {
      setError("Nomor Kamar dan Tipe Kamar wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/rooms", {
        room_number: roomNumber,
        floor: Number(floor),
        room_type_id: Number(roomTypeId),
        status,
        notes: notes || null,
      });
      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message || "Gagal menambahkan kamar.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menambahkan kamar.");
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
            <h3 className="text-base font-bold text-zinc-800">Tambah Kamar Baru</h3>
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
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nomor Kamar *</label>
              <input type="text" required value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Contoh: 101"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Lantai *</label>
              <input type="number" min={1} required value={floor} onChange={(e) => setFloor(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 outline-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe Kamar *</label>
            <select required value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 outline-none cursor-pointer">
              <option value="">-- Pilih Tipe Kamar --</option>
              {roomTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({formatRupiah(t.base_price)}/malam)</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status Awal</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 outline-none cursor-pointer">
              {STATUSES.map((st) => (
                <option key={st.key} value={st.key}>{st.label} - {st.desc}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catatan (Opsional)</label>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan tambahan..."
              className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 focus:border-blue-600 outline-none resize-none" />
          </div>
          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-slate-50 cursor-pointer">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 shadow-sm border-0">
              {saving ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>) : "Simpan Kamar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRoomModal;
