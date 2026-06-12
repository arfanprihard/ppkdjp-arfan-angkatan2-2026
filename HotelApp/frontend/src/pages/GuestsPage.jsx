import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import {
  RefreshCw,
  AlertTriangle,
  Search,
  X,
  CheckCircle,
  User,
  Plus,
  Eye,
  Edit2,
  ChevronLeft,
  ChevronRight,
  Inbox,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CreditCard,
  History
} from "lucide-react";

// ─── KONSTANTA BADGE DAN STATUS ──────────────────────────────────────────────
const RESERVATION_STATUSES = [
  { key: "pending", label: "Pending", badge: "bg-amber-400/10 text-amber-400 border-amber-400/20" },
  { key: "confirmed", label: "Confirmed", badge: "bg-sky-400/10 text-sky-400 border-sky-400/20" },
  { key: "checked_in", label: "Checked In", badge: "bg-emerald-400/10 text-emerald-400 border-emerald-400/20" },
  { key: "checked_out", label: "Checked Out", badge: "bg-zinc-700/30 text-zinc-400 border-zinc-600/30" },
  { key: "cancelled", label: "Cancelled", badge: "bg-rose-400/10 text-rose-400 border-rose-400/20" },
  { key: "no_show", label: "No Show", badge: "bg-purple-400/10 text-purple-400 border-purple-400/20" },
];

const getResStatusBadge = (key) =>
  RESERVATION_STATUSES.find((s) => s.key === key)?.badge ?? "bg-zinc-750 text-zinc-400 border-zinc-700/30";

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
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays > 0 ? diffDays : 0;
};

// ─── MODAL: TAMBAH & EDIT TAMU ───────────────────────────────────────────────
const GuestFormModal = ({ guest, onClose, onSaved }) => {
  const [name, setName] = useState(guest ? guest.name : "");
  const [idType, setIdType] = useState(guest ? guest.id_type : "ktp");
  const [idNumber, setIdNumber] = useState(guest ? guest.id_number : "");
  const [phone, setPhone] = useState(guest ? guest.phone ?? "" : "");
  const [email, setEmail] = useState(guest ? guest.email ?? "" : "");
  const [address, setAddress] = useState(guest ? guest.address ?? "" : "");
  const [nationality, setNationality] = useState(guest ? guest.nationality ?? "Indonesia" : "Indonesia");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !idNumber) {
      setError("Nama Lengkap dan Nomor Identitas wajib diisi.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        id_type: idType,
        id_number: idNumber,
        phone: phone || null,
        email: email || null,
        address: address || null,
        nationality: nationality || null,
      };

      let res;
      if (guest) {
        // Edit Mode
        res = await api.put(`/api/guests/${guest.id}`, payload);
      } else {
        // Create Mode
        res = await api.post("/api/guests", payload);
      }

      if (res.data.success) {
        onSaved();
      } else {
        setError(res.data.message ?? "Gagal menyimpan data.");
      }
    } catch (err) {
      setError(err.response?.data?.message ?? "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-white">
              {guest ? "Ubah Data Tamu" : "Daftarkan Tamu Baru"}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Name */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Nama Lengkap *</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Contoh: Budi Santoso"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
            />
          </div>

          {/* ID Type & ID Number */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Tipe Identitas *</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-zinc-300 focus:border-amber-500/40 outline-none cursor-pointer"
              >
                <option value="ktp">KTP</option>
                <option value="passport">Paspor</option>
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
                placeholder="Contoh: 31710XXXXXXXXXXX"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
              />
            </div>
          </div>

          {/* Phone & Email */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">No. Telepon</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="0812XXXXXXXX"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="budi@example.com"
                className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
              />
            </div>
          </div>

          {/* Nationality */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Kewarganegaraan</label>
            <input
              type="text"
              value={nationality}
              onChange={(e) => setNationality(e.target.value)}
              placeholder="Contoh: Indonesia, Malaysia, Australia..."
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none"
            />
          </div>

          {/* Address */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">Alamat Lengkap</label>
            <textarea
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Jl. Merdeka No. 12, Jakarta Pusat"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm text-white focus:border-amber-500/40 outline-none resize-none"
            />
          </div>

          {/* Buttons */}
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
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-sm font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Data"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ─── MODAL: DETAIL TAMU & RIWAYAT ────────────────────────────────────────────
const GuestDetailModal = ({ guestId, onClose }) => {
  const [guest, setGuest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDetail = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`/api/guests/${guestId}`);
      if (res.data.success) {
        setGuest(res.data.data);
      } else {
        setError("Gagal memuat detail tamu.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungkan ke backend.");
    } finally {
      setLoading(false);
    }
  }, [guestId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-zinc-850 bg-zinc-950 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-white">Profil Tamu Lengkap</h3>
          </div>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 cursor-pointer">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {error && (
            <div className="flex items-center gap-2 text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {loading ? (
            <div className="space-y-4 py-8 animate-pulse">
              <div className="h-8 bg-zinc-800 rounded-xl w-1/3" />
              <div className="h-24 bg-zinc-800 rounded-xl" />
              <div className="h-40 bg-zinc-800 rounded-xl" />
            </div>
          ) : (
            guest && (
              <>
                {/* Profile Detail Grid */}
                <div className="bg-zinc-950/40 p-4 rounded-2xl border border-zinc-850/60 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-lg font-extrabold text-white">{guest.name}</h4>
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 border border-zinc-700 px-2.5 py-1 rounded-lg font-bold uppercase tracking-wider">
                      {guest.id_type?.toUpperCase()}: {guest.id_number}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-sm text-zinc-350">
                    <div className="flex items-center gap-2.5">
                      <Phone className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>{guest.phone || "— (Belum diisi)"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Mail className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>{guest.email || "— (Belum diisi)"}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <MapPin className="h-4 w-4 text-zinc-500 shrink-0" />
                      <span>{guest.nationality || "Indonesia"}</span>
                    </div>
                    <div className="flex items-start gap-2.5 md:col-span-2">
                      <MapPin className="h-4 w-4 text-zinc-500 shrink-0 mt-0.5" />
                      <span className="leading-tight">{guest.address || "— (Alamat belum diisi)"}</span>
                    </div>
                  </div>
                </div>

                {/* History Reservasi */}
                <div className="space-y-3">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-500 flex items-center gap-1.5">
                    <History className="h-3.5 w-3.5 text-amber-500" /> Riwayat Reservasi Tamu
                  </p>

                  {!guest.reservations || guest.reservations.length === 0 ? (
                    <div className="text-center py-8 text-xs text-zinc-500 bg-zinc-950/20 border border-zinc-800 rounded-xl">
                      Belum ada riwayat reservasi untuk tamu ini.
                    </div>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-zinc-800 bg-zinc-950/20 max-h-56 overflow-y-auto">
                      <table className="w-full border-collapse text-left text-xs text-zinc-300">
                        <thead className="bg-zinc-950 text-[9px] font-bold uppercase tracking-widest text-zinc-500 border-b border-zinc-800 sticky top-0">
                          <tr>
                            <th className="p-3">Kode Booking</th>
                            <th className="p-3">Kamar</th>
                            <th className="p-3">Tanggal Stay</th>
                            <th className="p-3">Total Tagihan</th>
                            <th className="p-3">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-850">
                          {guest.reservations.map((res) => (
                            <tr key={res.id} className="hover:bg-zinc-900/30">
                              <td className="p-3 font-bold text-white">{res.reservation_code}</td>
                              <td className="p-3 text-zinc-350">
                                {res.room ? `No. ${res.room.room_number}` : "Belum ditentukan"}
                              </td>
                              <td className="p-3 text-zinc-400">
                                {res.check_in_date}
                                <span className="block text-[10px] text-zinc-500 mt-0.5">
                                  {getNights(res.check_in_date, res.check_out_date)} malam
                                </span>
                              </td>
                              <td className="p-3 font-semibold text-zinc-200">{formatRupiah(res.total_amount)}</td>
                              <td className="p-3">
                                <span className={`inline-flex px-2 py-0.5 rounded border text-[9px] font-bold uppercase tracking-widest ${getResStatusBadge(res.status)}`}>
                                  {res.status.replace("_", " ")}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="pt-2 border-t border-zinc-850 flex justify-end">
                  <button
                    onClick={onClose}
                    className="py-2 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </>
            )
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
            <h2 className="text-base font-bold text-white">Daftar Tamu Hotel</h2>
            <p className="text-[11px] text-zinc-500">
              {loading ? "Memuat..." : `${total} total tamu terdaftar · Halaman ${page} dari ${lastPage}`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchGuests}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800/60 border border-zinc-700/50 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-650" />
          <input
            type="text"
            placeholder="Cari tamu berdasarkan nama, nomor telepon, email, atau ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-800 bg-zinc-900/60 text-sm text-zinc-200 placeholder-zinc-650 outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20 transition-all"
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
          <Inbox className="h-10 w-10 mb-3 text-zinc-750" />
          <p className="font-semibold text-zinc-400">Tidak ada data tamu</p>
          <p className="text-xs mt-1 text-zinc-600">Coba sesuaikan kata kunci pencarian Anda.</p>
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
                <tr key={g.id} className="hover:bg-zinc-800/20 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-white text-xs">{g.name}</div>
                    <div className="text-[10px] text-zinc-550 mt-1">ID Tamu: #{g.id}</div>
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded border border-zinc-700 font-bold uppercase tracking-wider">
                      {g.id_type?.toUpperCase()}
                    </span>
                    <span className="text-zinc-200 text-xs font-semibold ml-2">{g.id_number}</span>
                  </td>
                  <td className="p-4">
                    <div className="text-zinc-200 text-xs">{g.phone || "—"}</div>
                    <div className="text-[10px] text-zinc-500 mt-1">{g.email || "—"}</div>
                  </td>
                  <td className="p-4 text-zinc-300 text-xs">
                    {g.nationality || "Indonesia"}
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Detail View */}
                      <button
                        onClick={() => setDetailGuestId(g.id)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
                        title="Detail & Riwayat"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      
                      {/* Edit Profile */}
                      <button
                        onClick={() => setEditingGuest(g)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-750 text-zinc-400 hover:text-white rounded-lg transition-colors cursor-pointer"
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
