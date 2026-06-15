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
  Plus,
} from "lucide-react";

import { STATUSES } from "../components/rooms/helpers";
import RoomCard from "../components/rooms/RoomCard";
import NewRoomModal from "../components/rooms/NewRoomModal";
import RoomModal from "../components/rooms/RoomModal";
import GridSkeleton from "../components/rooms/GridSkeleton";

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
