import { useState, useEffect } from "react";
import api from "../../api/axios";
import {
  X,
  AlertCircle,
  CheckCircle,
  User,
  Building,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Trash2,
  Edit2,
  RefreshCw
} from "lucide-react";
import {
  RESERVATION_STATUSES,
  getStatus,
  getChannelLabel,
  formatRupiah,
  getNights
} from "./helpers";

const ReservationDetailModal = ({
  reservation,
  rooms,
  onClose,
  onUpdated,
  onCheckInClick,
  onCheckOutClick
}) => {
  const [editing, setEditing] = useState(false);
  const [roomId, setRoomId] = useState(reservation.room_id || "");
  const [roomTypeId, setRoomTypeId] = useState(reservation.room_type_id || "");
  const [checkInDate, setCheckInDate] = useState(reservation.check_in_date || "");
  const [checkOutDate, setCheckOutDate] = useState(reservation.check_out_date || "");
  const [numAdults, setNumAdults] = useState(reservation.num_adults || 1);
  const [numChildren, setNumChildren] = useState(reservation.num_children || 0);
  const [status, setStatus] = useState(reservation.status || "pending");
  const [specialRequest, setSpecialRequest] = useState(reservation.special_request || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const [allReservations, setAllReservations] = useState([]);

  useEffect(() => {
    const fetchAllReservations = async () => {
      try {
        const res = await api.get("/api/reservations?all=1");
        if (res.data.success) {
          setAllReservations(res.data.data || []);
        }
      } catch (err) {
        console.error("Gagal mengambil data reservasi untuk filter kamar", err);
      }
    };
    fetchAllReservations();
  }, []);

  const s = getStatus(reservation.status);

  // Auto-dedupe room types from rooms
  const roomTypes = [...new Map(rooms.map((r) => [r.room_type?.id || r.roomType?.id, r.room_type || r.roomType])).values()].filter(Boolean);

  // Calculate available room types on selected dates (ignoring current reservation)
  const availableRoomTypes = roomTypes.filter((t) => {
    if (!checkInDate || !checkOutDate) {
      return false;
    }
    const start1 = new Date(checkInDate);
    const end1 = new Date(checkOutDate);

    // Total rooms of this type
    const roomsOfType = rooms.filter((r) => String(r.room_type?.id || r.roomType?.id) === String(t.id));
    const totalRoomsCount = roomsOfType.length;

    // Overlapping reservations for this room type (ignoring this reservation)
    const activeOverlapping = allReservations.filter((res) => {
      if (Number(res.id) === Number(reservation.id)) {
        return false;
      }
      if (['cancelled', 'no_show', 'checked_out'].includes(res.status)) {
        return false;
      }
      if (String(res.room_type_id) !== String(t.id)) {
        return false;
      }
      const start2 = new Date(res.check_in_date);
      const end2 = new Date(res.check_out_date);
      return start1 < end2 && end1 > start2;
    });

    const availableCount = totalRoomsCount - activeOverlapping.length;
    return availableCount > 0;
  });

  const isFinalState = ["checked_out", "cancelled"].includes(reservation.status);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!checkInDate || !checkOutDate) {
      setError("Isi tanggal Check-in dan Check-out.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        room_type_id: Number(roomTypeId),
        room_id: reservation.status === "checked_in" ? (roomId ? Number(roomId) : null) : null,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_adults: Number(numAdults),
        num_children: Number(numChildren),
        status,
        special_request: specialRequest || null,
      };

      const res = await api.put(`/api/reservations/${reservation.id}`, payload);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdated();
        }, 800);
      } else {
        setError(res.data.message ?? "Gagal menyimpan perubahan.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm("Apakah Anda yakin ingin membatalkan reservasi ini?")) {
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await api.patch(`/api/reservations/${reservation.id}/cancel`);
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdated();
        }, 800);
      } else {
        setError(res.data.message ?? "Gagal membatalkan reservasi.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal membatalkan reservasi.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-255">
        {/* Header */}
        <div className={`p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-950`}>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${s.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1.5">{reservation.reservation_code}</h3>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer border-0 bg-transparent">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs mb-4">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2 text-xs mb-4 animate-in fade-in">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Perubahan berhasil disimpan!
            </div>
          )}

          {!editing ? (
            // VIEW MODE
            <div className="space-y-5">
              {/* Guest & Room Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                    <User className="h-3 w-3" /> Data Tamu
                  </p>
                  <div>
                    <p className="text-sm font-extrabold text-white">{reservation.guest?.name ?? "—"}</p>
                    <p className="text-xs text-zinc-400 mt-1">{reservation.guest?.id_type?.toUpperCase()}: {reservation.guest?.id_number}</p>
                    <p className="text-xs text-zinc-400 mt-1">Telp: {reservation.guest?.phone || "—"}</p>
                    <p className="text-xs text-zinc-400 mt-1">Email: {reservation.guest?.email || "—"}</p>
                  </div>
                </div>

                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60 space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1">
                    <Building className="h-3 w-3" /> Info Alokasi Kamar
                  </p>
                  <div>
                    <p className="text-sm font-extrabold text-white">
                      {reservation.room_type?.name || reservation.roomType?.name || "—"}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">
                      Kamar: {reservation.room ? `Nomor ${reservation.room.room_number} (Lantai ${reservation.room.floor})` : "Unassigned (Belum ditentukan)"}
                    </p>
                    <p className="text-xs text-zinc-400 mt-1">Biaya: {formatRupiah(reservation.total_amount)}</p>
                    <p className="text-xs text-zinc-400 mt-1">Booking via: <span className="font-bold text-amber-500">{getChannelLabel(reservation.channel)} {reservation.ota_name ? `(${reservation.ota_name})` : ""}</span></p>
                  </div>
                </div>
              </div>

              {/* Checkin / Checkout Stay Dates */}
              <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60 flex justify-between items-center text-center">
                <div className="flex-1 text-left sm:text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Check In</p>
                  <p className="text-sm font-bold text-white">{reservation.check_in_date}</p>
                </div>
                <div className="flex flex-col items-center px-4">
                  <ArrowRight className="h-4 w-4 text-zinc-500" />
                  <span className="text-[10px] text-zinc-400 font-bold bg-zinc-800 px-2 py-0.5 rounded-full mt-1">
                    {getNights(reservation.check_in_date, reservation.check_out_date)} Malam
                  </span>
                </div>
                <div className="flex-1 text-right sm:text-center">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 mb-1">Check Out</p>
                  <p className="text-sm font-bold text-white">{reservation.check_out_date}</p>
                </div>
              </div>

              {/* Guest Counts & Special Requests */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 mb-2">
                    <Users className="h-3 w-3" /> Jumlah Tamu
                  </p>
                  <p className="text-sm font-bold text-zinc-200">
                    {reservation.num_adults} Dewasa {reservation.num_children > 0 && `, ${reservation.num_children} Anak`}
                  </p>
                </div>
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 mb-2">
                    <Briefcase className="h-3 w-3" /> Petugas Pembuat
                  </p>
                  <p className="text-sm font-bold text-zinc-200">
                    {reservation.creator?.name || "Sistem"}
                  </p>
                </div>
              </div>

              {reservation.special_request && (
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-800/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400/80 mb-2">Permintaan Khusus</p>
                  <p className="text-sm text-zinc-300 italic">{reservation.special_request}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex flex-wrap gap-2 justify-end">
                {/* Check-In Button */}
                {["confirmed", "pending"].includes(reservation.status) && (
                  <button
                    type="button"
                    onClick={() => onCheckInClick(reservation)}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold transition-all duration-200 cursor-pointer border-0 flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="h-4 w-4" /> Check-In Tamu
                  </button>
                )}

                {/* Check-Out Button */}
                {reservation.status === "checked_in" && (
                  <button
                    type="button"
                    onClick={() => onCheckOutClick(reservation)}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white text-xs font-bold transition-all duration-200 cursor-pointer border-0 flex items-center gap-1.5"
                  >
                    <X className="h-4 w-4" /> Check-Out & Settle
                  </button>
                )}

                {/* Cancel Reservation */}
                {!["checked_in", "checked_out", "cancelled"].includes(reservation.status) && (
                  <button
                    type="button"
                    onClick={handleCancel}
                    disabled={saving}
                    className="py-2.5 px-4 rounded-xl border border-rose-500/35 hover:bg-rose-550/10 text-rose-400 text-xs font-bold transition-all duration-200 cursor-pointer bg-transparent flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" /> Batalkan Reservasi
                  </button>
                )}

                {/* Edit Form Toggle */}
                {!isFinalState && (
                  <button
                    type="button"
                    onClick={() => setEditing(true)}
                    className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold transition-all duration-200 cursor-pointer border-0 flex items-center gap-1.5"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Detail
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold cursor-pointer border-0"
                >
                  Tutup
                </button>
              </div>
            </div>
          ) : (
            // EDIT MODE
            <form onSubmit={handleUpdate} className="space-y-4">
              {/* Checkin / Checkout */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Check In</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Check Out</label>
                  <input
                    type="date"
                    required
                    min={checkInDate}
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                  />
                </div>
              </div>

              {/* Room Type */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Tipe Kamar</label>
                <select
                  disabled={!checkInDate || !checkOutDate}
                  value={roomTypeId}
                  onChange={(e) => setRoomTypeId(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {!checkInDate || !checkOutDate ? (
                    <option value="">-- Pilih Tanggal Terlebih Dahulu --</option>
                  ) : (
                    <>
                      <option value="">-- Pilih Tipe Kamar --</option>
                      {availableRoomTypes.map((t) => (
                        <option key={t.id} value={t.id}>{t.name} ({formatRupiah(t.base_price)})</option>
                      ))}
                    </>
                  )}
                </select>
              </div>

              {/* Guests and Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Dewasa</label>
                  <input
                    type="number"
                    min={1}
                    value={numAdults}
                    onChange={(e) => setNumAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Anak</label>
                  <input
                    type="number"
                    min={0}
                    value={numChildren}
                    onChange={(e) => setNumChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
                  >
                    {RESERVATION_STATUSES.map((st) => (
                      <option key={st.key} value={st.key}>{st.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Requests */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">Permintaan Khusus</label>
                <textarea
                  rows={2}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Contoh: AC dingin, extra bed..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40 resize-none"
                />
              </div>

              {/* Edit Buttons */}
              <div className="pt-4 border-t border-zinc-800 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 cursor-pointer bg-transparent"
                >
                  Kembali ke Detail
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0"
                >
                  {saving ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    "Simpan Perubahan"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReservationDetailModal;
