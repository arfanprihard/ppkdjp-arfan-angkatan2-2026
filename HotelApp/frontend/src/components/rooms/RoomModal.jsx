import React, { useState } from "react";
import { X, Edit2, Trash2, AlertTriangle, CheckCircle, RefreshCw } from "lucide-react";
import api from "../../api/axios";
import { STATUSES, getStatus, formatRupiah } from "./helpers";

const RoomModal = ({ room, roomTypes, isAdmin, canEdit, onClose, onUpdated }) => {
  const s = getStatus(room.status);
  const [isEditing, setIsEditing] = useState(false);

  const [newStatus, setNewStatus] = useState(room.status);
  const [notes, setNotes] = useState(room.notes || "");
  const [roomNumber, setRoomNumber] = useState(room.room_number);
  const [floor, setFloor] = useState(room.floor);
  const [roomTypeId, setRoomTypeId] = useState(room.room_type_id || room.room_type?.id || "");

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const hasStatusChanged = newStatus !== room.status || notes !== (room.notes || "");
  const hasDetailChanged =
    roomNumber !== room.room_number ||
    Number(floor) !== room.floor ||
    Number(roomTypeId) !== (room.room_type_id || room.room_type?.id) ||
    newStatus !== room.status ||
    notes !== (room.notes || "");

  const handleUpdateStatus = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await api.put(`/api/rooms/${room.id}/status`, { status: newStatus, notes: notes || null });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => { onUpdated(); onClose(); }, 800);
      } else {
        setError(res.data.message || "Gagal memperbarui status.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateFull = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await api.put(`/api/rooms/${room.id}`, {
        room_number: roomNumber,
        floor: Number(floor),
        room_type_id: Number(roomTypeId),
        status: newStatus,
        notes: notes || null,
      });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => { onUpdated(); onClose(); }, 800);
      } else {
        setError(res.data.message || "Gagal memperbarui kamar.");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setDeleteError(null);
    try {
      const res = await api.delete(`/api/rooms/${room.id}`);
      if (res.data.success) {
        onUpdated();
        onClose();
      } else {
        setDeleteError(res.data.message || "Gagal menghapus kamar.");
      }
    } catch (err) {
      setDeleteError(err.response?.data?.message || "Gagal menghapus kamar.");
    } finally {
      setDeleting(false);
    }
  };

  // Konfirmasi Hapus
  if (isDeleting) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs">
        <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-rose-600">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <h3 className="text-base font-bold text-zinc-800">Konfirmasi Hapus Kamar</h3>
          </div>
          <p className="text-sm text-zinc-600">
            Apakah Anda yakin ingin menghapus kamar <span className="font-bold text-zinc-800">#{room.room_number}</span>?
            Kamar tidak dapat dihapus jika memiliki riwayat check-in atau reservasi aktif.
          </p>
          {deleteError && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {deleteError}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsDeleting(false)} disabled={deleting}
              className="flex-1 py-2 rounded-xl border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-slate-50 cursor-pointer">
              Batal
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40 border-0">
              {deleting ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Menghapus...</>) : "Ya, Hapus Kamar"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mode Edit Detail (Admin)
  if (isEditing) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-5 border-b border-zinc-200 bg-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-blue-600" />
              <h3 className="text-base font-bold text-zinc-800">Edit Kamar {room.room_number}</h3>
            </div>
            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-700 rounded-lg hover:bg-slate-100 cursor-pointer border-0 bg-transparent">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleUpdateFull} className="p-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 text-xs">
                <CheckCircle className="h-4 w-4 shrink-0" /> Detail kamar berhasil diperbarui!
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nomor Kamar *</label>
                <input type="text" required value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Lantai *</label>
                <input type="number" min={1} required value={floor} onChange={(e) => setFloor(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe Kamar *</label>
              <select required value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 outline-none cursor-pointer">
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({formatRupiah(t.base_price)}/malam)</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status Kamar</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 focus:border-blue-600 outline-none cursor-pointer">
                {STATUSES.map((st) => (
                  <option key={st.key} value={st.key}>{st.label} - {st.desc}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catatan (Opsional)</label>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan..."
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 outline-none focus:border-blue-600 resize-none" />
            </div>
            <div className="pt-3 border-t border-zinc-200 flex gap-3">
              <button type="button" onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-xl border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-slate-50 cursor-pointer">
                Kembali
              </button>
              <button type="submit" disabled={!hasDetailChanged || saving || success}
                className="flex-1 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0">
                {saving ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>) : "Simpan"}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Mode Default: Detail & Ubah Status
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className={`relative p-5 border-b border-zinc-200 ${s.color}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Detail Kamar</p>
              <h3 className="text-2xl font-extrabold text-zinc-900">Kamar {room.room_number}</h3>
              <p className="text-sm opacity-70 mt-0.5">Lantai {room.floor} - {room.room_type?.name || "-"}</p>
            </div>
            <div className="flex items-center gap-1">
              {isAdmin && (
                <>
                  <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-lg hover:bg-black/5 text-zinc-700 transition-colors cursor-pointer border-0 bg-transparent" title="Edit Detail">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsDeleting(true)} className="p-1.5 rounded-lg hover:bg-black/5 text-rose-600 hover:text-rose-700 transition-colors cursor-pointer border-0 bg-transparent" title="Hapus Kamar">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/5 text-zinc-500 hover:text-zinc-700 transition-colors cursor-pointer border-0 bg-transparent">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 border border-zinc-200/60 rounded-xl p-3">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Harga/Malam</p>
              <p className="text-sm font-bold text-zinc-800 mt-1">{formatRupiah(room.room_type?.base_price)}</p>
            </div>
            <div className="bg-slate-50 border border-zinc-200/60 rounded-xl p-3">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold">Kapasitas</p>
              <p className="text-sm font-bold text-zinc-800 mt-1">{room.room_type?.default_capacity || "-"} orang</p>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Status Saat Ini</p>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold ${s.badge}`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label} - {s.desc}
            </span>
          </div>

          {canEdit && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Ubah Status</p>
              <div className="grid grid-cols-3 gap-2">
                {STATUSES.map((st) => (
                  <button key={st.key} onClick={() => setNewStatus(st.key)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-center transition-all duration-150 cursor-pointer ${
                      newStatus === st.key
                        ? `${st.color} ring-2 ${st.ring}`
                        : "border-zinc-200 bg-white text-zinc-400 hover:bg-slate-50 hover:text-zinc-700"
                    }`}>
                    <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                    <span className="text-[11px] font-bold">{st.label}</span>
                    <span className="text-[9px] opacity-60 leading-tight">{st.desc.split(" ").slice(1).join(" ")}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {canEdit && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Catatan (opsional)</p>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Contoh: AC berisik, perlu pengecekan..."
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 resize-none transition-all" />
            </div>
          )}

          {!canEdit && room.notes && (
            <div className="bg-slate-50 border border-zinc-200 rounded-xl p-3">
              <p className="text-[10px] text-zinc-400 uppercase tracking-widest font-semibold mb-1">Catatan</p>
              <p className="text-sm text-zinc-600">{room.notes}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2.5 text-xs">
              <CheckCircle className="h-4 w-4 shrink-0" /> Status berhasil diperbarui!
            </div>
          )}
        </div>

        {canEdit && (
          <div className="px-5 pb-5 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-700 text-sm font-medium hover:bg-slate-50 transition-colors cursor-pointer">
              Batal
            </button>
            <button onClick={handleUpdateStatus} disabled={!hasStatusChanged || saving || success}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 border-0">
              {saving ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>) : "Simpan Perubahan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomModal;
