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
} from "lucide-react";

// ─── Konstanta Status Kamar ───────────────────────────────────────────────────
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

const getStatus = (key) => STATUSES.find((s) => s.key === key) ?? STATUSES[0];

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

// ─── Komponen: Kartu Kamar ────────────────────────────────────────────────────
const RoomCard = ({ room, canEdit, onSelect }) => {
  const s = getStatus(room.status);

  return (
    <button
      onClick={() => onSelect(room)}
      className={`relative w-full text-left rounded-2xl border p-4 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl hover:shadow-black/30 active:scale-[0.98] cursor-pointer ${s.color} ${canEdit ? "hover:ring-2 " + s.ring : ""}`}
    >
      {/* Nomor Kamar */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <p className="text-xl font-extrabold leading-none">{room.room_number}</p>
          <p className="text-[10px] opacity-60 mt-0.5">Lantai {room.floor}</p>
        </div>
        <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-lg border ${s.badge}`}>
          {s.label}
        </span>
      </div>

      {/* Tipe */}
      <p className="text-[11px] font-semibold opacity-80 truncate">
        {room.room_type?.name ?? "—"}
      </p>
      <p className="text-[10px] opacity-50 mt-0.5">
        {formatRupiah(room.room_type?.base_price)}/malam
      </p>

      {/* Notes indicator */}
      {room.notes && (
        <div className="absolute bottom-3 right-3 opacity-40">
          <StickyNote className="h-3.5 w-3.5" />
        </div>
      )}
    </button>
  );
};

// ─── Komponen: Modal Detail & Ubah Status ────────────────────────────────────
const RoomModal = ({ room, canEdit, onClose, onUpdated }) => {
  const s = getStatus(room.status);
  const [newStatus, setNewStatus] = useState(room.status);
  const [notes, setNotes] = useState(room.notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const hasChanged = newStatus !== room.status || notes !== (room.notes ?? "");

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await api.put(`/api/rooms/${room.id}/status`, {
        status: newStatus,
        notes: notes || null,
      });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => {
          onUpdated();
          onClose();
        }, 800);
      } else {
        setError(res.data.message ?? "Gagal memperbarui status.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className={`relative p-5 border-b border-zinc-800 ${s.color.split(" ")[0]}`}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest opacity-60 mb-1">
                Detail Kamar
              </p>
              <h3 className="text-2xl font-extrabold">
                Kamar {room.room_number}
              </h3>
              <p className="text-sm opacity-70 mt-0.5">
                Lantai {room.floor} · {room.room_type?.name ?? "—"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-black/20 transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          {/* Info harga & kapasitas */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Harga/Malam
              </p>
              <p className="text-sm font-bold text-white mt-1">
                {formatRupiah(room.room_type?.base_price)}
              </p>
            </div>
            <div className="bg-zinc-800/50 rounded-xl p-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold">
                Kapasitas
              </p>
              <p className="text-sm font-bold text-white mt-1">
                {room.room_type?.default_capacity ?? "—"} orang
              </p>
            </div>
          </div>

          {/* Status saat ini */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
              Status Saat Ini
            </p>
            <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-semibold ${s.badge}`}>
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label} — {s.desc}
            </span>
          </div>

          {/* Ubah status (hanya jika bisa edit) */}
          {canEdit && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Ubah Status
              </p>
              <div className="grid grid-cols-3 gap-2">
                {STATUSES.map((st) => (
                  <button
                    key={st.key}
                    onClick={() => setNewStatus(st.key)}
                    className={`flex flex-col items-center gap-1 py-2.5 px-2 rounded-xl border text-center transition-all duration-150 cursor-pointer ${
                      newStatus === st.key
                        ? `${st.color} ring-2 ${st.ring}`
                        : "border-zinc-700/50 bg-zinc-800/30 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-300"
                    }`}
                  >
                    <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                    <span className="text-[11px] font-bold">{st.label}</span>
                    <span className="text-[9px] opacity-60 leading-tight">{st.desc.split(" ").slice(1).join(" ")}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Catatan */}
          {canEdit && (
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Catatan (opsional)
              </p>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Contoh: AC berisik, perlu pengecekan..."
                className="w-full rounded-xl border border-zinc-700/50 bg-zinc-800/50 px-3 py-2 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 resize-none transition-all"
              />
            </div>
          )}

          {/* Catatan read-only */}
          {!canEdit && room.notes && (
            <div className="bg-zinc-800/40 rounded-xl p-3">
              <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-semibold mb-1">
                Catatan
              </p>
              <p className="text-sm text-zinc-300">{room.notes}</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2.5 text-xs">
              <AlertTriangle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-2.5 text-xs">
              <CheckCircle className="h-4 w-4 shrink-0" />
              Status berhasil diperbarui!
            </div>
          )}
        </div>

        {/* Footer */}
        {canEdit && (
          <div className="px-5 pb-5 flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 text-sm font-medium hover:bg-zinc-800 transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              onClick={handleSave}
              disabled={!hasChanged || saving || success}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
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
        )}
      </div>
    </div>
  );
};

// ─── Komponen: Skeleton loader grid ──────────────────────────────────────────
const GridSkeleton = () => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3">
    {[...Array(18)].map((_, i) => (
      <div
        key={i}
        className="rounded-2xl border border-zinc-800/50 bg-zinc-900/40 p-4 animate-pulse h-28"
      />
    ))}
  </div>
);

// ─── Halaman Utama ────────────────────────────────────────────────────────────
const RoomsPage = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);

  // Filter & Search
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterFloor, setFilterFloor] = useState("all");
  const [filterType, setFilterType] = useState("all");

  // Apakah user boleh ubah status
  const canEdit = ["admin", "receptionist", "housekeeping"].includes(user?.role);

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

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  // Derived values
  const floors = [...new Set(rooms.map((r) => r.floor))].sort((a, b) => a - b);
  const types = [...new Map(rooms.map((r) => [r.room_type?.id, r.room_type])).values()].filter(Boolean);

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

  // Summary counts
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
              {loading ? "Memuat..." : `${rooms.length} kamar total · ${filtered.length} ditampilkan`}
            </p>
          </div>
        </div>
        <button
          onClick={fetchRooms}
          disabled={loading}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all duration-200 text-xs font-medium cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Perbarui
        </button>
      </div>

      {/* Status summary pills */}
      {!loading && rooms.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s.key}
              onClick={() => setFilterStatus(filterStatus === s.key ? "all" : s.key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all duration-200 cursor-pointer ${
                filterStatus === s.key
                  ? s.color + " ring-1 " + s.ring
                  : "border-zinc-800 bg-zinc-900/40 text-zinc-500 hover:text-zinc-300 hover:border-zinc-700"
              }`}
            >
              <span className={`h-2 w-2 rounded-full ${s.dot}`} />
              {s.label}
              <span className="font-bold ml-0.5">{counts[s.key] ?? 0}</span>
            </button>
          ))}
        </div>
      )}

      {/* Search & Filter bar */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Cari nomor / tipe kamar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-200 placeholder-zinc-600 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
        </div>

        {/* Filter Lantai */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
          <select
            value={filterFloor}
            onChange={(e) => setFilterFloor(e.target.value)}
            className="pl-8 pr-8 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 outline-none focus:border-amber-500/40 appearance-none cursor-pointer"
          >
            <option value="all">Semua Lantai</option>
            {floors.map((f) => (
              <option key={f} value={f}>
                Lantai {f}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
        </div>

        {/* Filter Tipe */}
        <div className="relative">
          <Bed className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="pl-8 pr-8 py-2 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-400 outline-none focus:border-amber-500/40 appearance-none cursor-pointer"
          >
            <option value="all">Semua Tipe</option>
            {types.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-600 pointer-events-none" />
        </div>

        {/* Reset filter */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch("");
              setFilterStatus("all");
              setFilterFloor("all");
              setFilterType("all");
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-zinc-700 bg-zinc-800/50 text-zinc-400 hover:text-rose-400 hover:border-rose-500/30 text-xs font-medium transition-all cursor-pointer"
          >
            <X className="h-3.5 w-3.5" />
            Reset
          </button>
        )}
      </div>

      {/* Error */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-rose-500/10 border border-rose-500/20 rounded-2xl px-5 py-4 text-sm text-rose-400">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
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
            <RoomCard
              key={room.id}
              room={room}
              canEdit={canEdit}
              onSelect={setSelected}
            />
          ))}
        </div>
      )}

      {/* Edit hint */}
      {!loading && canEdit && rooms.length > 0 && (
        <p className="text-center text-[11px] text-zinc-600">
          Klik kartu kamar untuk melihat detail dan mengubah status
        </p>
      )}

      {/* Modal Detail */}
      {selected && (
        <RoomModal
          room={selected}
          canEdit={canEdit}
          onClose={() => setSelected(null)}
          onUpdated={() => {
            setSelected(null);
            fetchRooms();
          }}
        />
      )}
    </div>
  );
};

export default RoomsPage;
