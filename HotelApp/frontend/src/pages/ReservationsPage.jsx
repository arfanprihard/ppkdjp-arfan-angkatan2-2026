import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import {
  RefreshCw,
  AlertTriangle,
  Search,
  Filter,
  ChevronDown,
  X,
  Calendar,
  User,
  Plus,
  Eye,
  ChevronLeft,
  ChevronRight,
  Inbox,
  Calendar as CalendarIcon
} from "lucide-react";

// Import helpers & constants
import {
  RESERVATION_STATUSES,
  getStatus,
  CHANNELS,
  getChannelLabel,
  formatRupiah,
  getNights
} from "../components/reservations/helpers";

// Import modular modals
import CreateReservationModal from "../components/reservations/CreateReservationModal";
import ReservationDetailModal from "../components/reservations/ReservationDetailModal";
import CheckInModal from "../components/reservations/CheckInModal";
import CheckOutModal from "../components/reservations/CheckOutModal";

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
  // State
  const [reservations, setReservations] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [showCheckIn, setShowCheckIn] = useState(null);
  const [showCheckOut, setShowCheckOut] = useState(null);
  
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

  // Daily Availability Widget States
  const [allReservations, setAllReservations] = useState([]);
  const [availabilityDate, setAvailabilityDate] = useState(new Date().toISOString().split("T")[0]);

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

  // Fetch all reservations (for availability calculations)
  const fetchAllReservations = useCallback(async () => {
    try {
      const res = await api.get("/api/reservations?all=1");
      if (res.data.success) {
        setAllReservations(res.data.data || []);
      }
    } catch (err) {
      console.error("Gagal memuat ketersediaan kamar", err);
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
        setReservations(payload.data || []);
        setLastPage(payload.last_page || 1);
        setTotal(payload.total || 0);
      } else {
        setError("Gagal memuat reservasi.");
      }

      // Refresh ketersediaan kamar
      fetchAllReservations();
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server backend.");
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterChannel, filterDate, fetchAllReservations]);

  useEffect(() => {
    fetchReservations();
  }, [page, filterStatus, filterChannel, filterDate, fetchReservations]);

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

  const roomTypes = [...new Map(rooms.map((r) => [r.room_type?.id || r.roomType?.id, r.room_type || r.roomType])).values()].filter(Boolean);

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
          <button
            onClick={() => {
              setPage(1);
              fetchReservations();
            }}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Segarkan
          </button>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/10 border-0"
          >
            <Plus className="h-4 w-4" /> Buat Reservasi
          </button>
        </div>
      </div>

      {/* Widget Ketersediaan Kamar Harian */}
      <div className="bg-zinc-900/40 border border-zinc-800/80 p-4 rounded-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-amber-500" />
            <h3 className="text-xs font-extrabold text-white uppercase tracking-wider">Ketersediaan Tipe Kamar Harian</h3>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-zinc-400">Pilih Tanggal:</span>
            <input
              type="date"
              value={availabilityDate}
              onChange={(e) => setAvailabilityDate(e.target.value)}
              className="px-2.5 py-1.5 text-xs rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-200 outline-none focus:border-amber-500/40 cursor-pointer"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {roomTypes.map((t) => {
            const roomsOfType = rooms.filter((r) => String(r.room_type?.id || r.roomType?.id) === String(t.id));
            const totalCount = roomsOfType.length;

            const occupiedCount = allReservations.filter((res) => {
              if (["cancelled", "no_show", "checked_out"].includes(res.status)) {
                return false;
              }
              if (String(res.room_type_id) !== String(t.id)) {
                return false;
              }
              const targetStr = availabilityDate;
              return targetStr >= res.check_in_date && targetStr < res.check_out_date;
            }).length;

            const availableCount = Math.max(0, totalCount - occupiedCount);
            const percentage = totalCount > 0 ? (availableCount / totalCount) * 100 : 0;

            let barColor = "bg-emerald-500";
            if (percentage === 0) barColor = "bg-zinc-800";
            else if (percentage <= 30) barColor = "bg-rose-500";
            else if (percentage <= 60) barColor = "bg-amber-500";

            return (
              <div key={t.id} className="bg-zinc-900/40 border border-zinc-800 p-3 rounded-xl flex flex-col justify-between space-y-2">
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-zinc-300 truncate" title={t.name}>{t.name}</span>
                  <span className="text-[10px] text-zinc-400 mt-0.5">Kapasitas: {t.default_capacity} Tamu</span>
                </div>
                
                <div className="flex items-end justify-between pt-1">
                  <span className={`text-base font-extrabold ${availableCount > 0 ? "text-emerald-400" : "text-rose-400"}`}>
                    {availableCount} <span className="text-[10px] text-zinc-400 font-normal">/ {totalCount} Kamar</span>
                  </span>
                  <span className="text-[9px] text-zinc-400 font-bold">{Math.round(percentage)}% Tersedia</span>
                </div>

                <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className={`h-full ${barColor} transition-all duration-300`} style={{ width: `${percentage}%` }} />
                </div>
              </div>
            );
          })}
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
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-400 hover:text-zinc-300 hover:border-zinc-700"
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
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
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
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none" />
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
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-medium transition-all cursor-pointer"
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

      {loading ? (
        <TableSkeleton />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 bg-zinc-900/10 border border-zinc-800/40 rounded-2xl">
          <Inbox className="h-10 w-10 mb-3 text-zinc-500" />
          <p className="font-semibold text-zinc-400">Tidak ada reservasi ditemukan</p>
          <p className="text-xs mt-1 text-zinc-500">Cobalah ubah filter pencarian Anda.</p>
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
                      <div className="text-[11px] text-zinc-400 mt-1 flex items-center gap-1">
                        <User className="h-3 w-3 shrink-0 text-zinc-400" />
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
                      <div className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1">
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
                        className="p-1.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer border-0"
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
              <span className="text-xs text-zinc-400">
                Menampilkan halaman <strong className="text-zinc-300">{page}</strong> dari <strong className="text-zinc-300">{lastPage}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed border-0"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= lastPage}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed border-0"
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
          onClose={() => {
            setShowCreate(false);
          }}
          onSaved={() => {
            setShowCreate(false);
            setPage(1);
            fetchReservations();
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
