import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import {
  RefreshCw,
  AlertTriangle,
  Bed,
  Filter,
  Search,
  ChevronDown,
  X,
  CheckCircle,
  StickyNote,
  Edit2,
  Trash2,
  Plus,
} from "lucide-react";

// --- Konstanta Status Kamar ---
const STATUSES = [
  {
    key: "vc",
    label: "VC",
    desc: "Vacant Clean",
    color: "bg-emerald-400/15 border-emerald-400/30 text-emerald-400",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
    ring: "ring-emerald-400/40",
  },
  {
    key: "vd",
    label: "VD",
    desc: "Vacant Dirty",
    color: "bg-amber-400/15 border-amber-400/30 text-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
    ring: "ring-amber-400/40",
  },
  {
    key: "oc",
    label: "OC",
    desc: "Occupied Clean",
    color: "bg-sky-400/15 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-400 border-sky-400/20",
    ring: "ring-sky-400/40",
  },
  {
    key: "od",
    label: "OD",
    desc: "Occupied Dirty",
    color: "bg-orange-400/15 border-orange-400/30 text-orange-400",
    dot: "bg-orange-500",
    badge: "bg-orange-400/10 text-orange-400 border-orange-400/20",
    ring: "ring-orange-400/40",
  },
  {
    key: "ooo",
    label: "OOO",
    desc: "Out of Order",
    color: "bg-zinc-700/40 border-zinc-600/40 text-zinc-400",
    dot: "bg-zinc-500",
    badge: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30",
    ring: "ring-zinc-500/40",
  },
  {
    key: "oos",
    label: "OOS",
    desc: "Out of Service",
    color: "bg-zinc-700/40 border-zinc-600/40 text-zinc-500",
    dot: "bg-zinc-600",
    badge: "bg-zinc-700/20 text-zinc-500 border-zinc-600/20",
    ring: "ring-zinc-600/40",
  },
];

const getStatus = (key) => STATUSES.find((s) => s.key === key) || STATUSES[0];

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount || 0);

// --- Komponen: Kartu Kamar ---
const RoomCard = ({ room, canEdit, onSelect }) => {
  const s = getStatus(room.status);
  return (
    <button
      onClick={() => onSelect(room)}
      className={`relative w-full text-left rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 active:scale-[0.98] cursor-pointer ${s.color} ${canEdit ? "hover:ring-2 " + s.ring : ""}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xl font-extrabold leading-none">{room.room_number}</p>
          <p className="text-[10px] opacity-60 mt-0.5">Lantai {room.floor}</p>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${s.badge}`}>
          {s.label}
        </span>
      </div>
      <p className="text-[11px] font-semibold opacity-80 truncate">
        {room.room_type?.name || "-"}
      </p>
      <p className="text-[10px] opacity-50 mt-0.5">
        {formatRupiah(room.room_type?.base_price)}/malam
      </p>
      {room.notes && (
        <div className="absolute bottom-3 right-3 opacity-40">
          <StickyNote className="h-3.5 w-3.5" />
        </div>
      )}
    </button>
  );
};

// --- Modal: Tambah Kamar Baru (Admin) ---
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

// --- Modal: Detail, Ubah Status, Edit & Hapus ---
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden p-6 space-y-4 animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center gap-3 text-rose-500">
            <AlertTriangle className="h-6 w-6 shrink-0" />
            <h3 className="text-base font-bold text-white">Konfirmasi Hapus Kamar</h3>
          </div>
          <p className="text-sm text-zinc-300">
            Apakah Anda yakin ingin menghapus kamar <span className="font-bold text-white">#{room.room_number}</span>?
            Kamar tidak dapat dihapus jika memiliki riwayat check-in atau reservasi aktif.
          </p>
          {deleteError && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {deleteError}
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <button onClick={() => setIsDeleting(false)} disabled={deleting}
              className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 cursor-pointer">
              Batal
            </button>
            <button onClick={handleDelete} disabled={deleting}
              className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40">
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Edit2 className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold text-white">Edit Kamar {room.room_number}</h3>
            </div>
            <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>
          <form onSubmit={handleUpdateFull} className="p-5 space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5 text-xs">
                <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5 text-xs">
                <CheckCircle className="h-4 w-4 shrink-0" /> Detail kamar berhasil diperbarui!
              </div>
            )}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nomor Kamar *</label>
                <input type="text" required value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Lantai *</label>
                <input type="number" min={1} required value={floor} onChange={(e) => setFloor(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe Kamar *</label>
              <select required value={roomTypeId} onChange={(e) => setRoomTypeId(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500/40 outline-none cursor-pointer">
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>{t.name} ({formatRupiah(t.base_price)}/malam)</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status Kamar</label>
              <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}
                className="w-full rounded-xl border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500/40 outline-none cursor-pointer">
                {STATUSES.map((st) => (
                  <option key={st.key} value={st.key}>{st.label} - {st.desc}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catatan (Opsional)</label>
              <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Catatan..."
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 outline-none focus:border-amber-500/40 resize-none" />
            </div>
            <div className="pt-3 border-t border-zinc-800 flex gap-3">
              <button type="button" onClick={() => setIsEditing(false)}
                className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 cursor-pointer">
                Kembali
              </button>
              <button type="submit" disabled={!hasDetailChanged || saving || success}
                className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5">
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className={`relative p-5 border-b border-zinc-800 ${s.color.split(" ")[0]}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">Detail Kamar</p>
              <h3 className="text-2xl font-extrabold">Kamar {room.room_number}</h3>
              <p className="text-sm opacity-70 mt-0.5">Lantai {room.floor} - {room.room_type?.name || "-"}</p>
            </div>
            <div className="flex items-center gap-1">
              {isAdmin && (
                <>
                  <button onClick={() => setIsEditing(true)} className="p-1.5 rounded-lg hover:bg-black/20 text-white transition-colors cursor-pointer" title="Edit Detail">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button onClick={() => setIsDeleting(true)} className="p-1.5 rounded-lg hover:bg-black/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer" title="Hapus Kamar">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </>
              )}
              <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-black/20 transition-colors cursor-pointer">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Harga/Malam</p>
              <p className="text-sm font-bold text-white mt-1">{formatRupiah(room.room_type?.base_price)}</p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">Kapasitas</p>
              <p className="text-sm font-bold text-white mt-1">{room.room_type?.default_capacity || "-"} orang</p>
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
                        : "border-zinc-700/50 bg-zinc-800/30 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
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
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 resize-none transition-all" />
            </div>
          )}

          {!canEdit && room.notes && (
            <div className="bg-zinc-800/40 rounded-xl p-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">Catatan</p>
              <p className="text-sm text-zinc-300">{room.notes}</p>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5 text-xs">
              <CheckCircle className="h-4 w-4 shrink-0" /> Status berhasil diperbarui!
            </div>
          )}
        </div>

        {canEdit && (
          <div className="px-5 pb-5 flex gap-3">
            <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer">
              Batal
            </button>
            <button onClick={handleUpdateStatus} disabled={!hasStatusChanged || saving || success}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2">
              {saving ? (<><RefreshCw className="h-3.5 w-3.5 animate-spin" /> Menyimpan...</>) : "Simpan Perubahan"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Komponen: Skeleton loader grid ---
const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
    {[...Array(18)].map((_, i) => (
      <div key={i} className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 animate-pulse h-28" />
    ))}
  </div>
);

// --- Halaman Utama ---
const RoomsPage = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterType, setFilterType] = useState("all");

  const canEdit = ["admin", "receptionist", "housekeeping"].includes(user?.role);
  const isAdmin = user?.role === "admin";

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/rooms");
      if (res.data.success) {
        setRooms(res.data.data);
      } else {
        setError("Gagal mengambil data kamar.");
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke server.");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRoomTypes = useCallback(async () => {
    try {
      const res = await api.get("/api/room-types");
      if (res.data.success) {
        setRoomTypes(res.data.data);
      }
    } catch (err) {
      console.error("Gagal mengambil tipe kamar:", err);
    }
  }, []);

  useEffect(() => {
    fetchRooms();
    fetchRoomTypes();
  }, [fetchRooms, fetchRoomTypes]);

  const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);

  const filtered = rooms.filter((r) => {
    const matchSearch =
      search === "" ||
      r.room_number.toLowerCase().includes(search.toLowerCase()) ||
      r.room_type?.name?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || r.status === filterStatus;
    const matchFloor = filterFloor === "all" || String(r.floor) === filterFloor;
    const matchType = filterType === "all" || String(r.room_type?.id) === filterType;
    return matchSearch && matchStatus && matchFloor && matchType;
  });

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.key] = rooms.filter((r) => r.status === s.key).length;
    return acc;
  }, {});

  const hasActiveFilters =
    filterStatus !== "all" || filterFloor !== "all" || filterType !== "all" || search !== "";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
          <div>
            <h2 className="text-base font-bold text-white">Room Board</h2>
            <p className="text-[11px] text-zinc-500">
              {loading ? "Memuat..." : `${rooms.length} kamar total - ${filtered.length} ditampilkan`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-lg shadow-amber-500/10">
              <Plus className="h-3.5 w-3.5" />
              Tambah Kamar
            </button>
          )}
          <button onClick={fetchRooms} disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 text-xs font-medium cursor-pointer disabled:opacity-50">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Perbarui
          </button>
        </div>
      </div>

      {/* Status summary pills */}
      {!loading && rooms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button key={s.key} onClick={() => setFilterStatus(filterStatus === s.key ? "all" : s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                filterStatus === s.key
                  ? s.color + " ring-1 " + s.ring
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              }`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label}
              <span className="font-bold ml-0.5">{counts[s.key] || 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search & Filter bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input type="text" placeholder="Cari nomor / tipe kamar..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
          <select value={filterFloor} onChange={(e) => setFilterFloor(e.target.value)}
            className="pl-8 pr-8 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 outline-none focus:border-amber-500/40 appearance-none cursor-pointer">
            <option value="all">Semua Lantai</option>
            {floors.map((f) => (<option key={f} value={f}>Lantai {f}</option>))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
        </div>
        <div className="relative">
          <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}
            className="pl-8 pr-8 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 outline-none focus:border-amber-500/40 appearance-none cursor-pointer">
            <option value="all">Semua Tipe</option>
            {roomTypes.map((t) => (<option key={t.id} value={t.id}>{t.name}</option>))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
        </div>
        {hasActiveFilters && (
          <button onClick={() => { setSearch(""); setFilterStatus("all"); setFilterFloor("all"); setFilterType("all"); }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-medium transition-all cursor-pointer">
            <X className="h-3.5 w-3.5" /> Reset
          </button>
        )}
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-4 text-sm text-rose-400">
          <AlertTriangle className="h-5 w-5 shrink-0" /> {error}
        </div>
      )}

      {/* Grid Kamar */}
      {loading ? (
        <GridSkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500">
          <Bed className="h-10 w-10 mb-3 text-zinc-700" />
          <p className="font-semibold text-zinc-400">Tidak ada kamar ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter atau kata kunci pencarian.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
          {filtered.map((room) => (
            <RoomCard key={room.id} room={room} canEdit={canEdit} onSelect={setSelected} />
          ))}
        </div>
      )}

      {/* Edit hint */}
      {!loading && canEdit && rooms.length > 0 && (
        <p className="text-center text-[11px] text-zinc-600">
          {isAdmin ? "Klik kartu kamar untuk detail, edit, atau hapus" : "Klik kartu kamar untuk melihat detail dan mengubah status"}
        </p>
      )}

      {/* Modal Detail */}
      {selected && (
        <RoomModal room={selected} roomTypes={roomTypes} isAdmin={isAdmin} canEdit={canEdit}
          onClose={() => setSelected(null)} onUpdated={() => { setSelected(null); fetchRooms(); }} />
      )}

      {/* Modal Tambah Kamar */}
      {showAddModal && (
        <NewRoomModal roomTypes={roomTypes} onClose={() => setShowAddModal(false)}
          onSaved={() => { setShowAddModal(false); fetchRooms(); }} />
      )}
    </div>
  );
};

export default RoomsPage;
