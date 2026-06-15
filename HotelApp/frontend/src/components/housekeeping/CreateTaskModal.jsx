import React, { useState } from "react";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId) {
      setError("Silakan pilih Kamar terlebih dahulu.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/housekeeping/tasks", {
        room_id: Number(roomId),
        task_type: taskType,
        priority,
        notes: notes || null,
      });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h3 className="text-base font-bold text-white">Buat Tugas Housekeeping</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
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
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
            >
              <option value="">-- Pilih Kamar --</option>
              {rooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Kamar {r.room_number} (Lantai {r.floor} · {r.room_type?.name})
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
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
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
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
              >
                {Object.entries(PRIORITIES).map(([key, val]) => (
                  <option key={key} value={key}>{val.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catatan / Deskripsi Tugas</label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Instruksi tambahan, detail request tamu..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-white outline-none focus:border-amber-500/40 resize-none"
            />
          </div>

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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-1.5"
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
