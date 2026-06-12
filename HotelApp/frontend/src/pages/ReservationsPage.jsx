import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../contexts/AuthContext";
import api from "../api/axios";
import {
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  X,
  CheckCircle,
  Calendar,
  User,
  Plus,
  Eye,
  Trash2,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  ArrowRight,
  Inbox,
  AlertCircle,
  Building,
  Users,
  Briefcase
} from "lucide-react";

// ─── KONSTANTA STATUS RESERVASI ───────────────────────────────────────────────
const RESERVATION_STATUSES = [
  {
    key: "pending",
    label: "Pending",
    desc: "Menunggu pembayaran/konfirmasi",
    color: "bg-amber-400/15 border-amber-400/30 text-amber-400",
    dot: "bg-amber-400",
    badge: "bg-amber-400/10 text-amber-400 border-amber-400/20",
  },
  {
    key: "confirmed",
    label: "Confirmed",
    desc: "Terkonfirmasi & dijamin",
    color: "bg-sky-400/15 border-sky-400/30 text-sky-400",
    dot: "bg-sky-400",
    badge: "bg-sky-400/10 text-sky-400 border-sky-400/20",
  },
  {
    key: "checked_in",
    label: "Checked In",
    desc: "Tamu sudah berada di kamar",
    color: "bg-emerald-400/15 border-emerald-400/30 text-emerald-400",
    dot: "bg-emerald-400",
    badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20",
  },
  {
    key: "checked_out",
    label: "Checked Out",
    desc: "Tamu sudah meninggalkan hotel",
    color: "bg-zinc-700/40 border-zinc-600/40 text-zinc-400",
    dot: "bg-zinc-500",
    badge: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30",
  },
  {
    key: "cancelled",
    label: "Cancelled",
    desc: "Reservasi dibatalkan",
    color: "bg-rose-400/15 border-rose-400/30 text-rose-400",
    dot: "bg-rose-500",
    badge: "bg-rose-400/10 text-rose-400 border-rose-400/20",
  },
  {
    key: "no_show",
    label: "No Show",
    desc: "Tamu tidak datang tanpa info",
    color: "bg-purple-400/15 border-purple-400/30 text-purple-400",
    dot: "bg-purple-500",
    badge: "bg-purple-400/10 text-purple-400 border-purple-400/20",
  },
];

const getStatus = (key) => RESERVATION_STATUSES.find((s) => s.key === key) ?? RESERVATION_STATUSES[0];

const CHANNELS = [
  { key: "walk_in", label: "Walk-in" },
  { key: "phone", label: "Telepon" },
  { key: "ota", label: "OTA (Online Travel Agent)" },
  { key: "website", label: "Website" },
  { key: "email", label: "Email" },
];

const getChannelLabel = (key) => CHANNELS.find((c) => c.key === key)?.label ?? key;

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

const getNights = (checkIn, checkOut) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  const diffTime = end - start;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 65 * 24));
  return diffDays > 0 ? diffDays : 0;
};

const INDONESIAN_MONTHS = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];

// ─── KOMPONEN: KALENDER BULANAN ──────────────────────────────────────────────
const MonthlyCalendar = ({ reservations, currentDate, onPrevMonth, onNextMonth, onSelectReservation, onAddReservation }) => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const startDayOfWeek = firstDayOfMonth.getDay();
  // Adjust to start Monday (Mon = 0, ..., Sun = 6)
  const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells = [];
  // Prev month padding
  for (let i = adjustedStartDay - 1; i >= 0; i--) {
    const d = new Date(year, month - 1, prevMonthDays - i);
    cells.push({ date: d, isPadding: true });
  }
  // Current month
  for (let i = 1; i <= daysInMonth; i++) {
    const d = new Date(year, month, i);
    cells.push({ date: d, isPadding: false });
  }
  // Next month padding
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i);
    cells.push({ date: d, isPadding: true });
  }

  const daysOfWeek = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  const getReservationsForDate = (date) => {
    return reservations.filter((r) => {
      if (r.status === "cancelled") return false;
      const d = new Date(date);
      d.setHours(0,0,0,0);
      const start = new Date(r.check_in_date);
      start.setHours(0,0,0,0);
      const end = new Date(r.check_out_date);
      end.setHours(0,0,0,0);
      return d >= start && d < end;
    });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isStartDate = (date, checkInStr) => {
    const d = new Date(date);
    d.setHours(0,0,0,0);
    const start = new Date(checkInStr);
    start.setHours(0,0,0,0);
    return d.getTime() === start.getTime();
  };

  const isEndDate = (date, checkOutStr) => {
    const tom = new Date(date);
    tom.setDate(tom.getDate() + 1);
    tom.setHours(0,0,0,0);
    const end = new Date(checkOutStr);
    end.setHours(0,0,0,0);
    return tom.getTime() === end.getTime();
  };

  // Assign track slots to overlapping reservations for perfect horizontal visual alignment (Pilihan 2)
  const startDateLimit = cells[0]?.date || new Date();
  const endDateLimit = cells[cells.length - 1]?.date || new Date();

  const activeReservations = reservations.filter((r) => {
    if (r.status === "cancelled") return false;
    const start = new Date(r.check_in_date);
    start.setHours(0,0,0,0);
    const end = new Date(r.check_out_date);
    end.setHours(0,0,0,0);
    return start <= endDateLimit && end > startDateLimit;
  });

  const sortedRes = [...activeReservations].sort((a, b) => {
    const startA = new Date(a.check_in_date).getTime();
    const startB = new Date(b.check_in_date).getTime();
    if (startA !== startB) return startA - startB;

    const nightsA = getNights(a.check_in_date, a.check_out_date);
    const nightsB = getNights(b.check_in_date, b.check_out_date);
    if (nightsA !== nightsB) return nightsB - nightsA;

    return a.id - b.id;
  });

  const tracks = [];
  const reservationTrackMap = new Map();

  sortedRes.forEach((res) => {
    const resStart = new Date(res.check_in_date);
    resStart.setHours(0,0,0,0);
    const resEnd = new Date(res.check_out_date);
    resEnd.setHours(0,0,0,0);

    let assignedTrack = 0;
    while (true) {
      const currentTrackEvents = tracks[assignedTrack] || [];
      const hasOverlap = currentTrackEvents.some((existingRes) => {
        const extStart = new Date(existingRes.check_in_date);
        extStart.setHours(0,0,0,0);
        const extEnd = new Date(existingRes.check_out_date);
        extEnd.setHours(0,0,0,0);
        return resStart < extEnd && resEnd > extStart;
      });

      if (!hasOverlap) {
        if (!tracks[assignedTrack]) {
          tracks[assignedTrack] = [];
        }
        tracks[assignedTrack].push(res);
        reservationTrackMap.set(res.id, assignedTrack);
        break;
      }
      assignedTrack++;
    }
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/20 backdrop-blur-sm overflow-hidden shadow-2xl animate-in fade-in duration-200">
      {/* Month Header controls */}
      <div className="p-4 bg-zinc-950 border-b border-zinc-800 flex justify-between items-center">
        <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
          <Calendar className="h-4 w-4 text-amber-500" />
          {INDONESIAN_MONTHS[month]} {year}
        </h3>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onPrevMonth(false)}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white border border-zinc-800/80 cursor-pointer"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => onPrevMonth(true)}
            className="px-2.5 py-1 text-xs hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white border border-zinc-800/80 cursor-pointer font-semibold"
          >
            Hari Ini
          </button>
          <button
            type="button"
            onClick={onNextMonth}
            className="p-1.5 hover:bg-zinc-900 rounded-lg text-zinc-400 hover:text-white border border-zinc-800/80 cursor-pointer"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 bg-zinc-950/50 border-b border-zinc-805 text-center py-2 text-[10px] font-bold uppercase tracking-widest text-zinc-500">
        {daysOfWeek.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      {/* Calendar days grid */}
      <div className="grid grid-cols-7 divide-x divide-y divide-zinc-800/40 border-l border-t border-zinc-800/45">
        {cells.map((cell, index) => {
          const dateRes = getReservationsForDate(cell.date);
          const cellToday = isToday(cell.date);
          
          return (
            <div
              key={index}
              className={`min-h-[120px] p-2 flex flex-col justify-between transition-colors relative group border-zinc-805/40 ${
                cell.isPadding ? "bg-zinc-900/10 text-zinc-700" : "bg-zinc-900/40 text-zinc-300"
              }`}
            >
              <div className="flex justify-between items-center mb-1">
                <span
                  className={`text-xs font-bold flex items-center justify-center h-5 w-5 rounded-full ${
                    cellToday
                      ? "bg-amber-500 text-black font-extrabold"
                      : cell.isPadding
                      ? "text-zinc-650"
                      : "text-zinc-400"
                  }`}
                >
                  {cell.date.getDate()}
                </span>
                
                <button
                  type="button"
                  onClick={() => {
                    const formatted = cell.date.toISOString().split("T")[0];
                    onAddReservation(formatted);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-zinc-800 rounded text-zinc-500 hover:text-white transition-opacity cursor-pointer absolute top-1.5 right-1.5"
                  title="Buat Reservasi di tanggal ini"
                >
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="flex-1 space-y-1 overflow-y-auto max-h-[85px] scrollbar-none mt-1">
                {(() => {
                  const maxSlots = 3;
                  const trackToRes = {};
                  let extraCount = 0;

                  dateRes.forEach((res) => {
                    const t = reservationTrackMap.get(res.id);
                    if (t !== undefined && t < maxSlots) {
                      trackToRes[t] = res;
                    } else {
                      extraCount++;
                    }
                  });

                  let maxActiveSlot = -1;
                  for (let t = 0; t < maxSlots; t++) {
                    if (trackToRes[t]) {
                      maxActiveSlot = t;
                    }
                  }

                  const slotsToRender = [];
                  for (let t = 0; t <= maxActiveSlot; t++) {
                    slotsToRender.push(trackToRes[t] || null);
                  }

                  return (
                    <>
                      {slotsToRender.map((res, sIdx) => {
                        if (!res) {
                          return <div key={`empty-${sIdx}`} className="h-5" />;
                        }

                        const st = getStatus(res.status);
                        const startDay = isStartDate(cell.date, res.check_in_date);
                        const endDay = isEndDate(cell.date, res.check_out_date);

                        let roundedClass = "rounded-lg";
                        let borderClass = "";

                        if (startDay && endDay) {
                          roundedClass = "rounded-lg";
                        } else if (startDay) {
                          roundedClass = "rounded-l-lg rounded-r-none";
                          borderClass = "border-r-0";
                        } else if (endDay) {
                          roundedClass = "rounded-r-lg rounded-l-none";
                          borderClass = "border-l-0";
                        } else {
                          roundedClass = "rounded-none";
                          borderClass = "border-l-0 border-r-0";
                        }

                        return (
                          <button
                            key={res.id}
                            type="button"
                            onClick={() => onSelectReservation(res)}
                            className={`w-full text-left truncate px-2 h-5 text-[10px] font-bold border transition-transform hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center gap-1.5 ${st.badge} ${roundedClass} ${borderClass}`}
                            title={`${res.reservation_code} - ${res.guest?.name || "Tamu"} (${res.check_in_date} s/d ${res.check_out_date})`}
                          >
                            {startDay && (
                              <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${st.dot}`} />
                            )}
                            <span className="truncate">
                              {res.guest?.name}
                            </span>
                          </button>
                        );
                      })}
                      {extraCount > 0 && (
                        <div className="text-[9px] text-zinc-655 font-bold text-center mt-1">
                          +{extraCount} lainnya
                        </div>
                      )}
                    </>
                  );
                })()}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── SUB-MODAL: TAMBAH TAMU BARU ─────────────────────────────────────────────
const NewGuestModal = ({ onClose, onSaved }) => {
  const [name, setName] = useState("");
  const [idType, setIdType] = useState("ktp");
  const [idNumber, setIdNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [nationality, setNationality] = useState("Indonesia");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name || !idNumber) {
      setError("Nama dan Nomor Identitas wajib diisi.");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/guests", {
        name,
        id_type: idType,
        id_number: idNumber,
        phone: phone || null,
        email: email || null,
        address: address || null,
        nationality: nationality || null,
      });
      if (res.data.success) {
        onSaved(res.data.data);
      } else {
        setError(res.data.message ?? "Gagal menambahkan tamu.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Gagal menyimpan tamu baru.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            <h4 className="text-base font-bold text-white">Daftarkan Tamu Baru</h4>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-900 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe ID *</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 outline-none"
              >
                <option value="ktp">KTP</option>
                <option value="passport">Passport</option>
                <option value="sim">SIM</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No. Identitas *</label>
              <input
                type="text"
                required
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                placeholder="Contoh: 317101XXXXXXXXXX"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No. Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812XXXXXXXX"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@example.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Kewarganegaraan</label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                placeholder="Indonesia"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Alamat</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Jl. Merdeka No. 10"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-zinc-850 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-900 cursor-pointer text-center"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Tamu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MODAL: BUAT RESERVASI ───────────────────────────────────────────────────
const CreateReservationModal = ({ rooms, onClose, onSaved, prefilledCheckIn }) => {
  const [guestSearch, setGuestSearch] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [searchingGuests, setSearchingGuests] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState(null);
  
  const [roomTypeId, setRoomTypeId] = useState("");
  const [roomId, setRoomId] = useState("");
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

  // Auto-dedupe room types from all rooms
  const roomTypes = [...new Map(rooms.map((r) => [r.room_type?.id || r.roomType?.id, r.room_type || r.roomType])).values()].filter(Boolean);

  // Filter rooms matching selected type
  const availableRooms = rooms.filter((r) => String(r.room_type?.id || r.roomType?.id) === String(roomTypeId));

  // Search guests (debounced or triggered by input change)
  useEffect(() => {
    if (guestSearch.trim().length < 2) {
      setGuestList([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setSearchingGuests(true);
      try {
        const res = await api.get(`/api/guests?search=${guestSearch}`);
        if (res.data.success) {
          // If pagination format
          setGuestList(res.data.data.data || res.data.data || []);
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
  const selectedType = roomTypes.find((t) => String(t.id) === String(roomTypeId));
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
        room_id: roomId ? Number(roomId) : null,
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
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-amber-500" />
            <h3 className="text-base font-bold text-white">Buat Reservasi Baru</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Cari Tamu */}
          <div className="bg-zinc-950/40 border border-zinc-850 p-4 rounded-xl space-y-3">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tamu Reservasi</label>
              <button
                type="button"
                onClick={() => setShowAddGuest(true)}
                className="text-[10px] font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
              >
                <Plus className="h-3 w-3" /> Tambah Tamu Baru
              </button>
            </div>

            {selectedGuest ? (
              <div className="flex items-center justify-between bg-zinc-800/40 p-3 rounded-xl border border-zinc-850">
                <div>
                  <p className="text-sm font-bold text-white">{selectedGuest.name}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    {selectedGuest.email || "Tidak ada email"} · {selectedGuest.phone || "Tidak ada telp"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedGuest(null)}
                  className="p-1 hover:bg-zinc-800 text-zinc-400 hover:text-rose-400 rounded-lg cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-650" />
                <input
                  type="text"
                  placeholder="Cari tamu berdasarkan nama/email/identitas..."
                  value={guestSearch}
                  onChange={(e) => setGuestSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-xl border border-zinc-805 bg-zinc-900/50 text-white focus:border-amber-500/40 outline-none"
                />
                
                {/* Guest Results dropdown */}
                {guestSearch.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 mt-1 bg-zinc-950 border border-zinc-800 rounded-xl max-h-48 overflow-y-auto z-10 shadow-2xl">
                    {searchingGuests ? (
                      <div className="p-3 text-xs text-zinc-500 flex items-center gap-2">
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Mencari tamu...
                      </div>
                    ) : guestList.length === 0 ? (
                      <div className="p-3 text-xs text-zinc-500">Tamu tidak ditemukan.</div>
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
                          className="w-full text-left p-3 hover:bg-zinc-900 border-b border-zinc-900/50 flex flex-col justify-start cursor-pointer text-xs"
                        >
                          <span className="font-bold text-white">{g.name}</span>
                          <span className="text-zinc-500 mt-0.5">
                            ID: {g.id_number} · Telp: {g.phone || "—"}
                          </span>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Menginap Detail */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Check In *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-550" />
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split("T")[0]}
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-white outline-none focus:border-amber-500/40"
                />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Check Out *</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-550" />
                <input
                  type="date"
                  required
                  min={checkInDate || new Date().toISOString().split("T")[0]}
                  value={checkOutDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-white outline-none focus:border-amber-500/40"
                />
              </div>
            </div>
          </div>

          {/* Pilihan Kamar & Kamar Tipe */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe Kamar *</label>
              <select
                required
                value={roomTypeId}
                onChange={(e) => {
                  setRoomTypeId(e.target.value);
                  setRoomId(""); // Reset room number
                }}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
              >
                <option value="">-- Pilih Tipe Kamar --</option>
                {roomTypes.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({formatRupiah(t.base_price)})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nomor Kamar (Opsional)</label>
              <select
                disabled={!roomTypeId}
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <option value="">-- Belum Ditentukan (Unassigned) --</option>
                {availableRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    Kamar {r.room_number} (Lantai {r.floor} · {r.status.toUpperCase()})
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Tamu Hitung & Channel */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Jumlah Dewasa *</label>
              <input
                type="number"
                min={1}
                required
                value={numAdults}
                onChange={(e) => setNumAdults(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Jumlah Anak</label>
              <input
                type="number"
                min={0}
                value={numChildren}
                onChange={(e) => setNumChildren(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Channel Booking *</label>
              <select
                value={channel}
                onChange={(e) => setChannel(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
              >
                {CHANNELS.map((ch) => (
                  <option key={ch.key} value={ch.key}>{ch.label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* OTA Name if OTA selected */}
          {channel === "ota" && (
            <div className="space-y-1 animate-in slide-in-from-top-2 duration-200">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nama OTA *</label>
              <input
                type="text"
                required
                placeholder="Contoh: Booking.com, Traveloka, Agoda..."
                value={otaName}
                onChange={(e) => setOtaName(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-white outline-none focus:border-amber-500/40"
              />
            </div>
          )}

          {/* Special Requests */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Permintaan Khusus (Opsional)</label>
            <textarea
              rows={2}
              value={specialRequest}
              onChange={(e) => setSpecialRequest(e.target.value)}
              placeholder="Contoh: Kamar bebas asap rokok, extra bed, check-in larut..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900/50 text-white outline-none focus:border-amber-500/40 resize-none"
            />
          </div>

          {/* Estimasi Biaya */}
          {nights > 0 && roomTypeId && (
            <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-550/20 rounded-2xl p-4 flex justify-between items-center animate-in fade-in duration-200">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-500">Rincian Estimasi Biaya</p>
                <p className="text-xs text-zinc-400 mt-1">
                  {nights} malam x {formatRupiah(basePrice)}
                </p>
              </div>
              <p className="text-lg font-extrabold text-amber-400">{formatRupiah(estimatedTotal)}</p>
            </div>
          )}

          {/* Footer buttons */}
          <div className="pt-3 border-t border-zinc-850 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || !selectedGuest || !roomTypeId || nights <= 0}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
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

// ─── MODAL: CHECK-IN TAMU ──────────────────────────────────────────────────
const CheckInModal = ({ reservation, rooms, onClose, onSaved }) => {
  const [roomId, setRoomId] = useState("");
  const [depositAmount, setDepositAmount] = useState(0);
  const [depositMethod, setDepositMethod] = useState("cash");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const availableRooms = rooms.filter(
    (r) =>
      String(r.room_type?.id || r.roomType?.id) === String(reservation.room_type_id) &&
      r.status === "vc"
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!roomId) {
      setError("Silakan pilih kamar ketersediaan yang bersih (VC).");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/checkins", {
        reservation_id: reservation.id,
        room_id: Number(roomId),
        deposit_amount: Number(depositAmount),
        deposit_method: depositMethod,
        notes: notes || null,
      });

      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message ?? "Gagal memproses check-in.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat check-in.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <h3 className="text-base font-bold text-white">Proses Check-In Tamu</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          <div className="bg-zinc-950/40 border border-zinc-850 p-3 rounded-xl text-xs space-y-1.5 text-zinc-300">
            <p><strong className="text-white">Kode Booking:</strong> {reservation.reservation_code}</p>
            <p><strong className="text-white">Nama Tamu:</strong> {reservation.guest?.name}</p>
            <p><strong className="text-white">Tipe Kamar:</strong> {reservation.room_type?.name || reservation.roomType?.name}</p>
            <p><strong className="text-white">Masa Stay:</strong> {reservation.check_in_date} s/d {reservation.check_out_date} ({getNights(reservation.check_in_date, reservation.check_out_date)} malam)</p>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Pilih Kamar Fisik (Harus Bersih - VC) *</label>
            <select
              required
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
            >
              <option value="">-- Pilih Kamar Bersih (VC) --</option>
              {availableRooms.map((r) => (
                <option key={r.id} value={r.id}>
                  Kamar {r.room_number} (Lantai {r.floor} · VC)
                </option>
              ))}
            </select>
            {availableRooms.length === 0 && (
              <p className="text-[11px] text-amber-500/80 mt-1 flex items-start gap-1">
                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                Peringatan: Tidak ada kamar bersih (VC) bertipe ini yang tersedia. Silakan bersihkan kamar terlebih dahulu.
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Uang Jaminan (Deposit) *</label>
              <input
                type="number"
                min={0}
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-white outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Metode Deposit *</label>
              <select
                value={depositMethod}
                onChange={(e) => setDepositMethod(e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-955 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
              >
                <option value="cash">Cash / Tunai</option>
                <option value="credit_card">Kartu Kredit</option>
                <option value="debit">Debit</option>
                <option value="transfer">Transfer Bank</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Catatan Tambahan (Opsional)</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Catatan penyerahan kunci, request extra..."
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-950 text-white outline-none focus:border-amber-500/40 resize-none"
            />
          </div>

          <div className="pt-3 border-t border-zinc-850 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || !roomId}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Memproses Check-In...
                </>
              ) : (
                "Konfirmasi Check-In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MODAL: CHECK-OUT TAMU ──────────────────────────────────────────────────
const CheckOutModal = ({ reservation, onClose, onSaved }) => {
  const [folio, setFolio] = useState(null);
  const [loadingFolio, setLoadingFolio] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackNotes, setFeedbackNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const checkInId = reservation.check_in?.id || reservation.checkIn?.id;

  const fetchFolio = useCallback(async () => {
    if (!checkInId) {
      setError("Data Check-In tidak ditemukan.");
      setLoadingFolio(false);
      return;
    }
    setLoadingFolio(true);
    try {
      const res = await api.get(`/api/folios/${checkInId}`);
      if (res.data.success) {
        setFolio(res.data.data);
      } else {
        setError("Gagal memuat billing folio.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal mengambil tagihan folio.");
    } finally {
      setLoadingFolio(false);
    }
  }, [checkInId]);

  useEffect(() => {
    fetchFolio();
  }, [fetchFolio]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkInId) return;

    setSaving(true);
    setError(null);
    try {
      const res = await api.post("/api/checkouts", {
        check_in_id: checkInId,
        payment_method: paymentMethod,
        feedback_rating: Number(feedbackRating),
        feedback_notes: feedbackNotes || null,
      });

      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message ?? "Gagal memproses checkout.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat checkout.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        <div className="p-5 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-rose-500 animate-pulse" />
            <h3 className="text-base font-bold text-white">Proses Check-Out & Settlement</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loadingFolio ? (
            <div className="space-y-3 py-6 animate-pulse">
              <div className="h-5 bg-zinc-800 rounded-lg w-1/3" />
              <div className="h-24 bg-zinc-800 rounded-lg" />
            </div>
          ) : (
            folio && (
              <>
                <div className="space-y-2.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-zinc-500 font-bold uppercase tracking-wider">No. Folio: {folio.folio_number}</span>
                    <span className="text-zinc-400">Tamu: <strong className="text-white">{folio.guest?.name}</strong></span>
                  </div>

                  <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/30 max-h-40 overflow-y-auto">
                    <table className="w-full text-left text-xs border-collapse text-zinc-300">
                      <thead className="bg-zinc-950 text-[9px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 sticky top-0">
                        <tr>
                          <th className="p-2.5">Deskripsi Transaksi</th>
                          <th className="p-2.5 text-right">Jumlah</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-850">
                        {folio.charges?.map((c) => (
                          <tr key={c.id}>
                            <td className="p-2.5 font-medium">{c.description}</td>
                            <td className="p-2.5 text-right text-zinc-200">{formatRupiah(c.amount)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="bg-zinc-950/60 p-3 rounded-xl border border-zinc-850 space-y-2 text-xs text-zinc-400">
                    <div className="flex justify-between">
                      <span>Total Biaya (Charges)</span>
                      <span className="font-semibold text-zinc-200">{formatRupiah(folio.total_charges)}</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-800 pb-2">
                      <span>Total Pembayaran / Deposit</span>
                      <span className="font-semibold text-emerald-450">{formatRupiah(folio.total_payments)}</span>
                    </div>
                    <div className="flex justify-between items-center pt-1">
                      <span className="font-bold text-white text-[11px] uppercase tracking-wider">Sisa Tagihan (Balance)</span>
                      <span className={`text-sm font-extrabold ${folio.balance > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                        {formatRupiah(folio.balance)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Metode Pelunasan *</label>
                    <select
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-955 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
                    >
                      <option value="cash">Cash / Tunai</option>
                      <option value="credit_card">Kartu Kredit</option>
                      <option value="debit">Debit</option>
                      <option value="transfer">Transfer Bank</option>
                      <option value="city_ledger">City Ledger (Perusahaan)</option>
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Rating Feedback (1-5)</label>
                    <select
                      value={feedbackRating}
                      onChange={(e) => setFeedbackRating(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-955 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
                    >
                      <option value={5}>⭐⭐⭐⭐⭐ (Sangat Puas)</option>
                      <option value={4}>⭐⭐⭐⭐ (Puas)</option>
                      <option value={3}>⭐⭐⭐ (Cukup)</option>
                      <option value={2}>⭐⭐ (Kurang)</option>
                      <option value={1}>⭐ (Sangat Kurang)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Komentar / Feedback Tamu</label>
                  <textarea
                    rows={2}
                    value={feedbackNotes}
                    onChange={(e) => setFeedbackNotes(e.target.value)}
                    placeholder="Feedback tamu..."
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-955 text-white outline-none focus:border-amber-500/40 resize-none"
                  />
                </div>

                <div className="pt-3 border-t border-zinc-850 flex gap-3">
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
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                        Memproses Check-Out...
                      </>
                    ) : (
                      "Settle & Check-Out"
                    )}
                  </button>
                </div>
              </>
            )
          )}
        </form>
      </div>
    </div>
  );
};

// ─── MODAL: DETAIL & EDIT RESERVASI ──────────────────────────────────────────
const ReservationDetailModal = ({ reservation, rooms, onClose, onUpdated, onCheckInClick, onCheckOutClick }) => {
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
  
  const s = getStatus(reservation.status);

  // Auto-dedupe room types from rooms
  const roomTypes = [...new Map(rooms.map((r) => [r.room_type?.id || r.roomType?.id, r.room_type || r.roomType])).values()].filter(Boolean);

  // Filter available rooms by selected type
  const availableRooms = rooms.filter((r) => String(r.room_type?.id || r.roomType?.id) === String(roomTypeId));

  // Check if check-in or checkout was already done (prevents edit of some statuses)
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
        room_id: roomId ? Number(roomId) : null,
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
        <div className={`p-5 border-b border-zinc-850 flex items-center justify-between bg-zinc-950`}>
          <div>
            <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[9px] font-bold uppercase tracking-widest ${s.badge}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
            <h3 className="text-xl font-extrabold text-white mt-1.5">{reservation.reservation_code}</h3>
          </div>
          <button onClick={onClose} className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 cursor-pointer">
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
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-850/60 space-y-3">
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

                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-850/60 space-y-3">
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
              <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-850/60 flex justify-between items-center text-center">
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
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-850/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 mb-2">
                    <Users className="h-3 w-3" /> Jumlah Tamu
                  </p>
                  <p className="text-sm font-bold text-zinc-200">
                    {reservation.num_adults} Dewasa {reservation.num_children > 0 && `, ${reservation.num_children} Anak`}
                  </p>
                </div>
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-850/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1 mb-2">
                    <Briefcase className="h-3 w-3" /> Petugas Pembuat
                  </p>
                  <p className="text-sm font-bold text-zinc-200">
                    {reservation.creator?.name || "Sistem"}
                  </p>
                </div>
              </div>

              {reservation.special_request && (
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-850/60">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-rose-400/80 mb-2">Permintaan Khusus</p>
                  <p className="text-sm text-zinc-300 italic">{reservation.special_request}</p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-4 border-t border-zinc-850 flex flex-wrap gap-2 justify-end">
                {/* Check-In Button */}
                {["confirmed", "pending"].includes(reservation.status) && (
                  <button
                    onClick={() => onCheckInClick(reservation)}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" /> Check-In Tamu
                  </button>
                )}

                {/* Check-Out Button */}
                {reservation.status === "checked_in" && (
                  <button
                    onClick={() => onCheckOutClick(reservation)}
                    className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-400 hover:to-orange-400 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <X className="h-4 w-4" /> Check-Out & Settle
                  </button>
                )}

                {/* Cancel Reservation */}
                {!["checked_in", "checked_out", "cancelled"].includes(reservation.status) && (
                  <button
                    onClick={handleCancel}
                    disabled={saving}
                    className="py-2.5 px-4 rounded-xl border border-rose-500/35 hover:bg-rose-550/10 text-rose-400 text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Trash2 className="h-4 w-4" /> Batalkan Reservasi
                  </button>
                )}

                {/* Edit Form Toggle */}
                {!isFinalState && (
                  <button
                    onClick={() => setEditing(true)}
                    className="py-2.5 px-4 rounded-xl bg-zinc-800 hover:bg-zinc-750 text-white text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5"
                  >
                    <Edit2 className="h-4 w-4" /> Edit Detail
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="py-2.5 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold cursor-pointer"
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Check In</label>
                  <input
                    type="date"
                    required
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Check Out</label>
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

              {/* Room Type & Room */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe Kamar</label>
                  <select
                    value={roomTypeId}
                    onChange={(e) => {
                      setRoomTypeId(e.target.value);
                      setRoomId(""); // reset room selection
                    }}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
                  >
                    {roomTypes.map((t) => (
                      <option key={t.id} value={t.id}>{t.name} ({formatRupiah(t.base_price)})</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nomor Kamar</label>
                  <select
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
                  >
                    <option value="">-- Belum Ditentukan (Unassigned) --</option>
                    {availableRooms.map((r) => (
                      <option key={r.id} value={r.id}>Kamar {r.room_number} (Lantai {r.floor} · {r.status.toUpperCase()})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Guests and Status */}
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Dewasa</label>
                  <input
                    type="number"
                    min={1}
                    value={numAdults}
                    onChange={(e) => setNumAdults(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Anak</label>
                  <input
                    type="number"
                    min={0}
                    value={numChildren}
                    onChange={(e) => setNumChildren(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Status</label>
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
                <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Permintaan Khusus</label>
                <textarea
                  rows={2}
                  value={specialRequest}
                  onChange={(e) => setSpecialRequest(e.target.value)}
                  placeholder="Contoh: AC dingin, extra bed..."
                  className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-800 bg-zinc-900 text-white outline-none focus:border-amber-500/40 resize-none"
                />
              </div>

              {/* Edit Buttons */}
              <div className="pt-4 border-t border-zinc-850 flex gap-3">
                <button
                  type="button"
                  onClick={() => setEditing(false)}
                  className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 cursor-pointer"
                >
                  Kembali ke Detail
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
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

// ─── SKELETON LOADER UNTUK TABEL ──────────────────────────────────────────────
const TableSkeleton = () => (
  <div className="space-y-3 animate-pulse">
    {[...Array(6)].map((_, i) => (
      <div key={i} className="h-16 rounded-xl border border-zinc-800/40 bg-zinc-900/10" />
    ))}
  </div>
);

// ─── HALAMAN UTAMA RESERVASI ──────────────────────────────────────────────────
const ReservationsPage = () => {
  const { user } = useAuth();
  
  // State
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(null);
  const [showCheckOut, setShowCheckOut] = useState(null);
  
  // Calendar View States
  const [viewMode, setViewMode] = useState("table");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [allReservations, setAllReservations] = useState([]);
  const [prefilledCheckIn, setPrefilledCheckIn] = useState("");

  // Modals
  const [showCreate, setShowCreate] = useState(false);

  // Filters & Search State
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterChannel, setFilterChannel] = useState("all");
  const [filterDate, setFilterDate] = useState("");
  
  // Pagination
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch Rooms (for type & number selection)
  const fetchRooms = useCallback(async () => {
    try {
      const res = await api.get("/api/rooms");
      if (res.data.success) {
        setRooms(res.data.data);
      }
    } catch (err) {
      console.error("Gagal memuat daftar kamar", err);
    }
  }, []);

  // Fetch Reservations from Laravel API
  const fetchReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Build query string
      let queryParams = [];
      queryParams.push(`page=${page}`);
      
      if (filterStatus !== "all") queryParams.push(`status=${filterStatus}`);
      if (filterChannel !== "all") queryParams.push(`channel=${filterChannel}`);
      if (filterDate) queryParams.push(`check_in_date=${filterDate}`);
      
      const queryString = queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
      const res = await api.get(`/api/reservations${queryString}`);
      
      if (res.data.success) {
        const payload = res.data.data;
        // Check structural pagination
        setReservations(payload.data || []);
        setLastPage(payload.last_page || 1);
        setTotal(payload.total || 0);
      } else {
        setError("Gagal memuat reservasi.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server backend.");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterChannel, filterDate]);

  const fetchAllReservations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/reservations?all=1");
      if (res.data.success) {
        setAllReservations(res.data.data || []);
      } else {
        setError("Gagal memuat semua reservasi untuk kalender.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungkan ke backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (viewMode === "calendar") {
      fetchAllReservations();
    } else {
      fetchReservations();
    }
  }, [viewMode, page, filterStatus, filterChannel, filterDate, fetchReservations, fetchAllReservations]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Derived filter logic for search (frontend side filter over paginated dataset)
  const filtered = reservations.filter((r) => {
    const codeMatch = r.reservation_code.toLowerCase().includes(search.toLowerCase());
    const guestMatch = r.guest?.name?.toLowerCase().includes(search.toLowerCase());
    return search === "" || codeMatch || guestMatch;
  });

  const hasActiveFilters =
    filterStatus !== "all" || filterChannel !== "all" || filterDate !== "" || search !== "";

  const resetFilters = () => {
    setSearch("");
    setFilterStatus("all");
    setFilterChannel("all");
    setFilterDate("");
    setPage(1);
  };

  const handleNextPage = () => {
    if (page < lastPage) setPage(page + 1);
  };

  const handlePrevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-gradient-to-b from-amber-400 to-orange-500" />
          <div>
            <h2 className="text-base font-bold text-white">Reservasi Tamu</h2>
            <p className="text-[11px] text-zinc-500">
              {loading ? "Memuat..." : `${total} total reservasi · Menampilkan Halaman ${page} dari ${lastPage}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Toggle */}
          <div className="flex bg-zinc-950 border border-zinc-850 p-0.5 rounded-xl mr-2">
            <button
              type="button"
              onClick={() => setViewMode("table")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "table" ? "bg-zinc-800 text-white" : "text-zinc-550 hover:text-zinc-400"
              }`}
            >
              Tabel
            </button>
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === "calendar" ? "bg-zinc-800 text-white" : "text-zinc-550 hover:text-zinc-400"
              }`}
            >
              Kalender
            </button>
          </div>

          <button
            onClick={() => {
              setPage(1);
              if (viewMode === "calendar") {
                fetchAllReservations();
              } else {
                fetchReservations();
              }
            }}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Segarkan
          </button>
          
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <Plus className="h-4 w-4" /> Buat Reservasi
          </button>
        </div>
      </div>

      {/* Filter Quick Cards */}
      {!loading && (
        <div className="flex flex-wrap gap-2">
          {RESERVATION_STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => {
                setFilterStatus(filterStatus === s.key ? "all" : s.key);
                setPage(1);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                filterStatus === s.key
                  ? s.color + " ring-1 " + s.ring
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Cari kode booking / nama tamu..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-200 placeholder-zinc-650 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Channel Selection */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
          <select
            value={filterChannel}
            onChange={(e) => {
              setFilterChannel(e.target.value);
              setPage(1);
            }}
            className="pl-8 pr-8 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 outline-none focus:border-amber-500/40 appearance-none cursor-pointer"
          >
            <option value="all">Semua Channel</option>
            {CHANNELS.map((ch) => (
              <option key={ch.key} value={ch.key}>{ch.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-650 pointer-events-none" />
        </div>

        {/* Date Filter */}
        <div className="relative">
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => {
              setFilterDate(e.target.value);
              setPage(1);
            }}
            className="pl-8 pr-3 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 outline-none focus:border-amber-500/40 cursor-pointer"
          />
        </div>

        {/* Reset Filter Button */}
        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:text-rose-450 hover:border-rose-500/30 text-xs font-medium transition-all cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Main Table / Listings */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-4 text-sm text-rose-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {viewMode === "calendar" ? (
        loading ? (
          <TableSkeleton />
        ) : (
          <MonthlyCalendar
            reservations={allReservations}
            currentDate={currentDate}
            onPrevMonth={(goToday = false) => {
              if (goToday) {
                setCurrentDate(new Date());
              } else {
                setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
              }
            }}
            onNextMonth={() => {
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
            }}
            onSelectReservation={(res) => setSelected(res)}
            onAddReservation={(date) => {
              setPrefilledCheckIn(date);
              setShowCreate(true);
            }}
          />
        )
      ) : loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 bg-zinc-900/10 border border-zinc-800/40 rounded-2xl">
          <Inbox className="h-10 w-10 mb-3 text-zinc-750" />
          <p className="font-semibold text-zinc-400">Tidak ada reservasi ditemukan</p>
          <p className="text-xs mt-1 text-zinc-600">Cobalah ubah filter pencarian Anda.</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-sm shadow-xl">
          <table className="w-full border-collapse text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="p-4">Kode / Tamu</th>
                <th className="p-4">Tipe Kamar / Nomor</th>
                <th className="p-4">Periode Menginap</th>
                <th className="p-4">Channel</th>
                <th className="p-4">Total Amount</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {filtered.map((res) => {
                const s = getStatus(res.status);
                return (
                  <tr key={res.id} className="hover:bg-zinc-800/20 transition-colors">
                    <td className="p-4">
                      <div className="font-bold text-white text-xs">{res.reservation_code}</div>
                      <div className="text-[11px] text-zinc-450 mt-1 flex items-center gap-1">
                        <User className="h-3 w-3 shrink-0 text-zinc-500" />
                        {res.guest?.name ?? "—"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-zinc-200 text-xs font-semibold">
                        {res.room_type?.name || res.roomType?.name || "—"}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1">
                        Kamar: {res.room?.room_number ? `No. ${res.room.room_number}` : "Belum ditentukan"}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="text-zinc-200 text-xs">
                        {res.check_in_date}
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-1">
                        s/d {res.check_out_date} · ({getNights(res.check_in_date, res.check_out_date)} malam)
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2.5 py-1 rounded-lg border border-zinc-700/50 font-bold uppercase tracking-wider">
                        {getChannelLabel(res.channel)}
                      </span>
                    </td>
                    <td className="p-4 text-zinc-100 text-xs font-extrabold">
                      {formatRupiah(res.total_amount)}
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-widest ${s.badge}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                        {s.label}
                      </span>
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => setSelected(res)}
                        className="p-1.5 bg-zinc-800/80 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Lihat Detail"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination Controls */}
          {lastPage > 1 && (
            <div className="p-4 border-t border-zinc-800 flex justify-between items-center flex-wrap gap-2 bg-zinc-950/40">
              <span className="text-xs text-zinc-500">
                Menampilkan halaman <strong className="text-zinc-350">{page}</strong> dari <strong className="text-zinc-350">{lastPage}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-3 py-1.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 disabled:opacity-40 disabled:hover:bg-zinc-850 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= lastPage}
                  className="px-3 py-1.5 bg-zinc-850 hover:bg-zinc-800 text-zinc-400 disabled:opacity-40 disabled:hover:bg-zinc-850 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed"
                >
                  Berikutnya <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      {showCreate && (
        <CreateReservationModal
          rooms={rooms}
          prefilledCheckIn={prefilledCheckIn}
          onClose={() => {
            setShowCreate(false);
            setPrefilledCheckIn("");
          }}
          onSaved={() => {
            setShowCreate(false);
            setPrefilledCheckIn("");
            setPage(1);
            if (viewMode === "calendar") {
              fetchAllReservations();
            } else {
              fetchReservations();
            }
          }}
        />
      )}

      {/* Detail Modal */}
      {selected && (
        <ReservationDetailModal
          reservation={selected}
          rooms={rooms}
          onClose={() => setSelected(null)}
          onCheckInClick={(res) => {
            setSelected(null);
            setShowCheckIn(res);
          }}
          onCheckOutClick={(res) => {
            setSelected(null);
            setShowCheckOut(res);
          }}
          onUpdated={() => {
            setSelected(null);
            fetchReservations();
          }}
        />
      )}

      {/* Check In Modal */}
      {showCheckIn && (
        <CheckInModal
          reservation={showCheckIn}
          rooms={rooms}
          onClose={() => setShowCheckIn(null)}
          onSaved={() => {
            setShowCheckIn(null);
            fetchReservations();
          }}
        />
      )}

      {/* Check Out Modal */}
      {showCheckOut && (
        <CheckOutModal
          reservation={showCheckOut}
          onClose={() => setShowCheckOut(null)}
          onSaved={() => {
            setShowCheckOut(null);
            fetchReservations();
          }}
        />
      )}
    </div>
  );
};

export default ReservationsPage;
