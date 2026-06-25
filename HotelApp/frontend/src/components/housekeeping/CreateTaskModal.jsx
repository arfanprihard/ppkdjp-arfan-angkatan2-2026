import React, { useState, useEffect } from "react";
import { Sparkles, X, AlertTriangle, RefreshCw } from "lucide-react";
import api from "../../api/axios";
import { TASK_TYPES, PRIORITIES } from "./helpers";

const CreateTaskModal = ({ rooms, initialRoomId, onClose, onSaved }) => {
  const [roomId, setRoomId] = useState(initialRoomId || "");
  const [taskType, setTaskType] = useState("room_cleaning");
  const [priority, setPriority] = useState("medium");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const [extraBedPrice, setExtraBedPrice] = useState(100000);
  const [laundryDesc, setLaundryDesc] = useState("");
  const [laundryCount, setLaundryCount] = useState(1);
  const [laundryPrice, setLaundryPrice] = useState(0);

  // Reset roomId if selected room is not checked-in and task type is extra_bed or laundry
  useEffect(() => {
    if (taskType === "extra_bed" || taskType === "laundry") {
      const selectedRoom = rooms.find((r) => String(r.id) === String(roomId));
      if (selectedRoom && selectedRoom.status !== "oc" && selectedRoom.status !== "od") {
        setRoomId("");
      }
    }
  }, [taskType, roomId, rooms]);

  const filteredRooms = rooms.filter((r) => {
    if (taskType === "extra_bed" || taskType === "laundry") {
      return r.status === "oc" || r.status === "od";
    }
    return true;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId) {
      setError("Silakan pilih Kamar terlebih dahulu.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const payload = {
        room_id: Number(roomId),
        task_type: taskType,
        priority,
        notes: notes || null,
      };

      if (taskType === "extra_bed") {
        payload.extra_bed_price = Number(extraBedPrice);
      } else if (taskType === "laundry") {
        payload.laundry_desc = laundryDesc;
        payload.laundry_count = Number(laundryCount);
        payload.laundry_price = Number(laundryPrice);
      }

      const res = await api.post("/api/housekeeping/tasks", payload);

      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message || "Gagal membuat tugas.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan sistem.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <h3 className="text-base font-bold text-zinc-900">Buat Tugas Housekeeping</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-650 rounded-lg hover:bg-zinc-100 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pilih Kamar *</label>
            <select
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-805 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
            >
              <option value="">-- Pilih Kamar --</option>
              {filteredRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Kamar {r.room_number} (Lantai {r.floor} · {r.room_type?.name} {r.status === "oc" || r.status === "od" ? "[Checked-In]" : ""})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Jenis Tugas *</label>
              <select
                value={taskType}
                onChange={(e) => setTaskType(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-805 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
              >
                {Object.entries(TASK_TYPES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Prioritas *</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-805 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
              >
                {Object.entries(PRIORITIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          {taskType === "extra_bed" && (
            <div className="space-y-1 bg-amber-50/50 p-3 rounded-xl border border-amber-100 animate-in fade-in slide-in-from-top-1 duration-150">
              <label className="text-[10px] font-bold uppercase tracking-widest text-amber-700 block">Harga Extra Bed (Rp)</label>
              <input
                type="number"
                min="0"
                required
                value={extraBedPrice}
                onChange={(e) => setExtraBedPrice(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-amber-600"
              />
              <p className="text-[9px] text-amber-600 mt-1">Biaya akan otomatis ditambahkan ke folio checkout tamu yang menginap.</p>
            </div>
          )}

          {taskType === "laundry" && (
            <div className="space-y-3 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100 animate-in fade-in slide-in-from-top-1 duration-150">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Deskripsi Pakaian</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2 Kaos, 1 Jeans"
                    value={laundryDesc}
                    onChange={(e) => setLaundryDesc(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-emerald-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Jumlah Pcs</label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={laundryCount}
                    onChange={(e) => setLaundryCount(Number(e.target.value))}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-emerald-600"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-emerald-800">Biaya Laundry (Rp)</label>
                <input
                  type="number"
                  min="0"
                  required
                  value={laundryPrice}
                  onChange={(e) => setLaundryPrice(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-emerald-600"
                />
              </div>
              <p className="text-[9px] text-emerald-600">Biaya laundry akan otomatis ditambahkan ke folio checkout tamu yang menginap.</p>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catatan / Deskripsi Tugas</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi tambahan, detail request tamu..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-600 text-sm font-medium hover:bg-zinc-50 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-750 text-white text-sm font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Tugas"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTaskModal;
