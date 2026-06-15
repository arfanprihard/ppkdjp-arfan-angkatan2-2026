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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bed className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-white">Tambah Kamar Baru</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nomor Kamar *</label>
              <input type="text" required value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} placeholder="Contoh: 101"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Lantai *</label>
              <input type="number" min={1} required value={floor} onChange={(e) => setFloor(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none" />
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe Kamar *</label>
            <select required value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500/40 outline-none cursor-pointer">
              <option value="">-- Pilih Tipe Kamar --</option>
              {roomTypes.map((t) => (
                <option key={t.id} value={t.id}>{t.name} ({formatRupiah(t.base_price)}/malam)</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status Awal</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500/40 outline-none cursor-pointer">
              {STATUSES.map((st) => (
                <option key={st.key} value={st.key}>{st.label} - {st.desc}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catatan (Opsional)</label>
            <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan tambahan..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none resize-none" />
          </div>
          <div className="pt-3 border-t border-zinc-800 flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-900 cursor-pointer">
              Batal
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5">
              {saving ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>) : "Simpan Kamar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRoomModal;
