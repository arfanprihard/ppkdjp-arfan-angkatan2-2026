import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import {
  RefreshCw,
  AlertTriangle,
  Search,
  X,
  Plus,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Inbox,
} from "lucide-react";

import GuestFormModal from "../components/guests/GuestFormModal";
import GuestDetailModal from "../components/guests/GuestDetailModal";
import TableSkeleton from "../components/guests/TableSkeleton";

// ─── HALAMAN UTAMA DAFTAR TAMU ────────────────────────────────────────────────
const GuestsPage = () => {
  const [guests, setGuests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search state
  const [search, setSearch] = useState("");

  // Modals state
  const [showForm, setShowForm] = useState(false);
  const [editingGuest, setEditingGuest] = useState(null);
  const [detailGuestId, setDetailGuestId] = useState(null);

  // Pagination state
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);

  // Fetch Guest Listings from Laravel API
  const fetchGuests = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      let url = `/api/guests?page=${page}`;
      if (search.trim()) {
        url += `&search=${encodeURIComponent(search)}`;
      }

      const res = await api.get(url);
      if (res.data.success) {
        const payload = res.data.data;
        setGuests(payload.data || []);
        setLastPage(payload.last_page || 1);
        setTotal(payload.total || 0);
      } else {
        setError("Gagal mengambil daftar tamu.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal tersambung ke server backend.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    // Reset to page 1 on search key change
    setPage(1);
  }, [search]);

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

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
            <h2 className="text-base font-bold text-white">
              Daftar Tamu Hotel
            </h2>
            <p className="text-[11px] text-zinc-500">
              {loading
                ? "Memuat..."
                : `${total} total tamu terdaftar · Halaman ${page} dari ${lastPage}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchGuests}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
            />
            Segarkan
          </button>

          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold transition-all cursor-pointer shadow-lg shadow-amber-500/10"
          >
            <Plus className="h-4 w-4" /> Tambah Tamu
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari tamu berdasarkan nama, nomor telepon, email, atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-200 placeholder-zinc-500 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
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
      ) : guests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-500 bg-zinc-900/10 border border-zinc-800/40 rounded-2xl">
          <Inbox className="h-10 w-10 mb-3 text-zinc-500" />
          <p className="font-semibold text-zinc-400">Tidak ada data tamu</p>
          <p className="text-xs mt-1 text-zinc-600">
            Coba sesuaikan kata kunci pencarian Anda.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-zinc-800/60 bg-zinc-900/20 backdrop-blur-sm shadow-xl">
          <table className="w-full border-collapse text-left text-sm text-zinc-300">
            <thead className="bg-zinc-950 text-[10px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800">
              <tr>
                <th className="p-4">Nama Tamu</th>
                <th className="p-4">Tipe / No. Identitas</th>
                <th className="p-4">Telepon / Email</th>
                <th className="p-4">Kewarganegaraan</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {guests.map((g) => (
                <tr
                  key={g.id}
                  className="hover:bg-zinc-800/20 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-white text-xs">{g.name}</div>
                    <div className="text-[10px] text-zinc-400 mt-1">
                      ID Tamu: #{g.id}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 font-bold uppercase tracking-wider">
                      {g.id_type?.toUpperCase()}
                    </span>
                    <span className="text-zinc-200 text-xs font-semibold ml-2">
                      {g.id_number}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="text-zinc-200 text-xs">
                      {g.phone || "—"}
                    </div>
                    <div className="text-[10px] text-zinc-500 mt-1">
                      {g.email || "—"}
                    </div>
                  </td>
                  <td className="p-4 text-zinc-300 text-xs">
                    {g.nationality || "Indonesia"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Detail View */}
                      <button
                        onClick={() => setDetailGuestId(g.id)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Detail & Riwayat"
                      >
                        <Eye className="h-4 w-4" />
                      </button>

                      {/* Edit Profile */}
                      <button
                        onClick={() => setEditingGuest(g)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Edit Profil"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          {lastPage > 1 && (
            <div className="p-4 border-t border-zinc-800 flex justify-between items-center flex-wrap gap-2 bg-zinc-950/40">
              <span className="text-xs text-zinc-500">
                Menampilkan halaman{" "}
                <strong className="text-zinc-300">{page}</strong> dari{" "}
                <strong className="text-zinc-300">{lastPage}</strong>
              </span>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={page <= 1}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Sebelumnya
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={page >= lastPage}
                  className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 disabled:opacity-40 disabled:hover:bg-zinc-800 rounded-lg text-xs font-semibold cursor-pointer flex items-center gap-1 disabled:cursor-not-allowed"
                >
                  Berikutnya <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Guest Form Modal (Create or Edit) */}
      {(showForm || editingGuest) && (
        <GuestFormModal
          guest={editingGuest}
          onClose={() => {
            setShowForm(false);
            setEditingGuest(null);
          }}
          onSaved={() => {
            setShowForm(false);
            setEditingGuest(null);
            fetchGuests();
          }}
        />
      )}

      {/* Detail Modal */}
      {detailGuestId && (
        <GuestDetailModal
          guestId={detailGuestId}
          onClose={() => setDetailGuestId(null)}
        />
      )}
    </div>
  );
};

export default GuestsPage;
