import { useState, useEffect } from "react";
import api from "../../api/axios";
import NewGuestModal from "./NewGuestModal";
import {
  X,
  AlertCircle,
  RefreshCw,
  Plus,
  Search,
  Calendar,
} from "lucide-react";
import { CHANNELS, formatRupiah, getNights } from "./helpers";

// Helper to get local today's date in YYYY-MM-DD format
const getLocalTodayString = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper to get next day's date in YYYY-MM-DD format
const getNextDateString = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const r = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${r}`;
};

const CreateReservationModal = ({
  rooms,
  onClose,
  onSaved,
  prefilledCheckIn,
}) => {
  const [guestSearch, setGuestSearch] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [searchingGuests, setSearchingGuests] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);

  const [roomTypeId, setRoomTypeId] = useState("");
  const [checkInDate, setCheckInDate] = useState(prefilledCheckIn || "");
  const [checkOutDate, setCheckOutDate] = useState("");
  const [numAdults, setNumAdults] = useState(1);
  const [numChildren, setNumChildren] = useState(0);
  const [channel, setChannel] = useState("walk_in");
  const [otaName, setOtaName] = useState("");
  const [specialRequest, setSpecialRequest] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [showAddGuest, setShowAddGuest] = useState(false);

  const [allReservations, setAllReservations] = useState([]);
  const [defaultGuests, setDefaultGuests] = useState([]);

  useEffect(() => {
    const fetchAllReservations = async () => {
      try {
        const res = await api.get("/api/reservations?all=1");
        if (res.data.success) {
          setAllReservations(res.data.data || []);
        }
      } catch (err) {
        console.error(
          "Gagal mengambil data reservasi untuk ketersediaan kamar",
          err,
        );
      }
    };
    fetchAllReservations();
  }, []);

  useEffect(() => {
    const fetchDefaultGuests = async () => {
      try {
        const res = await api.get("/api/guests");
        if (res.data.success) {
          const list = res.data.data.data || res.data.data || [];
          setDefaultGuests(list.slice(0, 6));
        }
      } catch (err) {
        console.error("Gagal mengambil data tamu terbaru", err);
      }
    };
    fetchDefaultGuests();
  }, []);

  // Adjust checkout date when checkin date changes
  useEffect(() => {
    if (checkInDate) {
      const nextDate = getNextDateString(checkInDate);
      if (!checkOutDate || checkOutDate <= checkInDate) {
        setCheckOutDate(nextDate);
      }
    }
  }, [checkInDate]);

  // Auto-dedupe room types from all rooms
  const roomTypes = [
    ...new Map(
      rooms.map((r) => [
        r.room_type?.id || r.roomType?.id,
        r.room_type || r.roomType,
      ]),
    ).values(),
  ].filter(Boolean);

  // Calculate available room types on selected dates
  const availableRoomTypes = roomTypes.filter((t) => {
    if (!checkInDate || !checkOutDate) {
      return false;
    }
    const start1 = new Date(checkInDate);
    const end1 = new Date(checkOutDate);

    // Total rooms of this type
    const roomsOfType = rooms.filter(
      (r) => String(r.room_type?.id || r.roomType?.id) === String(t.id),
    );
    const totalRoomsCount = roomsOfType.length;

    // Overlapping reservations for this room type
    const activeOverlapping = allReservations.filter((res) => {
      if (["cancelled", "no_show", "checked_out"].includes(res.status)) {
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

  // Search guests
  useEffect(() => {
    if (guestSearch.trim().length < 2) {
      setGuestList([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearchingGuests(true);
      try {
        const res = await api.get(
          `/api/guests?search=${encodeURIComponent(guestSearch)}`,
        );
        if (res.data.success) {
          const results = res.data.data?.data || res.data.data || [];
          setGuestList(Array.isArray(results) ? results : []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setSearchingGuests(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [guestSearch]);

  // Calculate price dynamically
  const nights = getNights(checkInDate, checkOutDate);
  const selectedType = roomTypes.find(
    (t) => String(t.id) === String(roomTypeId),
  );
  const basePrice = selectedType?.base_price ?? 0;
  const estimatedTotal = basePrice * nights;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedGuest) {
      setError("Silakan pilih atau daftarkan tamu terlebih dahulu.");
      return;
    }
    if (!roomTypeId) {
      setError("Silakan pilih Tipe Kamar.");
      return;
    }
    if (!checkInDate || !checkOutDate) {
      setError("Isi tanggal Check-in dan Check-out.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        guest_id: selectedGuest.id,
        room_type_id: Number(roomTypeId),
        room_id: null,
        check_in_date: checkInDate,
        check_out_date: checkOutDate,
        num_adults: Number(numAdults),
        num_children: Number(numChildren),
        channel,
        ota_name: channel === "ota" ? otaName : null,
        special_request: specialRequest || null,
      };

      const res = await api.post("/api/reservations", payload);
      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message ?? "Gagal menyimpan reservasi.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ?? "Terjadi kesalahan saat menyimpan.",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 bg-zinc-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-blue-600" />
            <h3 className="text-base font-bold text-zinc-900">
              Buat Reservasi Baru
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-zinc-600 rounded-lg hover:bg-zinc-100 cursor-pointer border-0 bg-transparent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2.5 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Cari Tamu */}
          <div className="bg-slate-50 border border-zinc-200 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Tamu Reservasi
              </label>
              <button
                type="button"
                onClick={() => setShowAddGuest(true)}
                className="text-[10px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer border-0 bg-transparent"
              >
                <Plus className="h-3 w-3" /> Tambah Tamu Baru
              </button>
            </div>

            {selectedGuest ? (
              <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-zinc-200 shadow-xs">
                <div>
                  <p className="text-sm font-bold text-zinc-900">
                    {selectedGuest.name}
                  </p>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    {selectedGuest.email || "Tidak ada email"} ·{" "}
                    {selectedGuest.phone || "Tidak ada telp"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGuest(null)}
                  className="p-1 hover:bg-zinc-100 text-zinc-400 hover:text-rose-600 rounded-lg cursor-pointer border-0 bg-transparent"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-450" />
                  <input
                    type="text"
                    placeholder="Cari tamu berdasarkan nama/email/identitas..."
                    value={guestSearch}
                    onChange={(e) => setGuestSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
                  />

                  {/* Guest Results dropdown */}
                  {guestSearch.trim().length >= 2 && (
                    <div className="absolute left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl max-h-48 overflow-y-auto z-10 shadow-lg">
                      {searchingGuests ? (
                        <div className="p-3 text-xs text-zinc-500 flex items-center gap-2">
                          <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          Mencari tamu...
                        </div>
                      ) : guestList.length === 0 ? (
                        <div className="p-3 text-xs text-zinc-500">
                          Tamu tidak ditemukan.
                        </div>
                      ) : (
                        guestList.map((g) => (
                          <button
                            key={g.id}
                            type="button"
                            onClick={() => {
                              setSelectedGuest(g);
                              setGuestSearch("");
                              setGuestList([]);
                            }}
                            className="w-full text-left p-3 hover:bg-slate-50 border-b border-zinc-100 flex flex-col justify-start cursor-pointer text-xs border-0"
                          >
                            <span className="font-bold text-zinc-900">
                              {g.name}
                            </span>
                            <span className="text-zinc-500 mt-0.5">
                              ID: {g.id_number} · Telp: {g.phone || "—"}
                            </span>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Default Guests list */}
                {guestSearch.trim().length < 2 && defaultGuests.length > 0 && (
                  <div className="pt-1">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">
                      Tamu Terbaru (Pilih Cepat):
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {defaultGuests.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => setSelectedGuest(g)}
                          className="w-full text-left p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-slate-50 transition-colors flex flex-col justify-start cursor-pointer text-xs border-0 shadow-xs"
                        >
                          <span className="font-bold text-zinc-700 hover:text-zinc-900">
                            {g.name}
                          </span>
                          <span className="text-[10px] text-zinc-500 mt-0.5">
                            ID: {g.id_number} · Telp: {g.phone || "—"}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menginap Detail */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Check In *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-455" />
                <input
                  type="date"
                  required
                  min={getLocalTodayString()}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Check Out *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-455" />
                <input
                  type="date"
                  required
                  min={
                    getNextDateString(checkInDate) ||
                    getNextDateString(getLocalTodayString())
                  }
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
                />
              </div>
            </div>
          </div>

          {/* Tipe Kamar */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
              Tipe Kamar *
            </label>
            <select
              required
              disabled={!checkInDate || !checkOutDate}
              value={roomTypeId}
              onChange={(e) => setRoomTypeId(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {!checkInDate || !checkOutDate ? (
                <option value="">-- Pilih Tanggal Terlebih Dahulu --</option>
              ) : (
                <>
                  <option value="">-- Pilih Tipe Kamar --</option>
                  {availableRoomTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({formatRupiah(t.base_price)})
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          {/* Jumlah Tamu & Channel */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Jumlah Dewasa *
              </label>
              <input
                type="number"
                min={1}
                required
                value={numAdults}
                onChange={(e) =>
                  setNumAdults(Math.max(1, parseInt(e.target.value) || 1))
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Jumlah Anak
              </label>
              <input
                type="number"
                min={0}
                value={numChildren}
                onChange={(e) =>
                  setNumChildren(Math.max(0, parseInt(e.target.value) || 0))
                }
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Channel Booking *
              </label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
              >
                {CHANNELS.map((ch) => (
                  <option key={ch.key} value={ch.key}>
                    {ch.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* OTA Name */}
          {channel === "ota" && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
                Nama OTA *
              </label>
              <input
                type="text"
                required
                placeholder="Contoh: Booking.com, Traveloka, Agoda..."
                value={otaName}
                onChange={(e) => setOtaName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
              />
            </div>
          )}

          {/* Special Requests */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 block">
              Permintaan Khusus (Opsional)
            </label>
            <textarea
              rows={2}
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Contoh: Kamar bebas  sex, extra bed, check-in larut..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 resize-none"
            />
          </div>

          {/* Estimasi Biaya */}
          {nights > 0 && roomTypeId && (
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex justify-between items-center animate-in fade-in duration-200">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-blue-650">
                  Rincian Estimasi Biaya
                </p>
                <p className="text-xs text-zinc-550 mt-1">
                  {nights} malam x {formatRupiah(basePrice)}
                </p>
              </div>
              <p className="text-lg font-extrabold text-blue-650">
                {formatRupiah(estimatedTotal)}
              </p>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-3 border-t border-zinc-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-650 text-sm font-medium hover:bg-zinc-50 cursor-pointer bg-transparent"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || !selectedGuest || !roomTypeId || nights <= 0}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Membuat Reservasi...
                </>
              ) : (
                "Konfirmasi Reservasi"
              )}
            </button>
          </div>
        </form>

        {/* Inline Add Guest Modal */}
        {showAddGuest && (
          <NewGuestModal
            onClose={() => setShowAddGuest(false)}
            onSaved={(newGuest) => {
              setSelectedGuest(newGuest);
              setShowAddGuest(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default CreateReservationModal;
