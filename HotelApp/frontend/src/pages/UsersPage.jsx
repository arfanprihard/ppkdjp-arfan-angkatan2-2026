import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import {
  RefreshCw,
  AlertTriangle,
  Search,
  X,
  Plus,
  Users,
  Shield,
  Filter,
  ChevronDown,
} from "lucide-react";

import { ROLES } from "../components/users/helpers";
import UserCard from "../components/users/UserCard";
import UserFormModal from "../components/users/UserFormModal";
import UserSkeleton from "../components/users/UserSkeleton";
import { useToast } from "../contexts/ToastContext";

const UsersPage = () => {
  const toast = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // 'all' | 'active' | 'inactive'

  // Modals state
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/users");
      if (res.data.success) {
        setUsers(res.data.data || []);
      } else {
        setError("Gagal memuat data staf.");
      }
    } catch (err) {
      console.error(err);
      setError("Tidak dapat terhubung ke server backend.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Soft Delete / Toggle Active status
  const handleToggleActive = async (user) => {
    const actionText = user.is_active ? "menonaktifkan" : "mengaktifkan";
    const confirmMessage = `Apakah Anda yakin ingin ${actionText} akun staf ${user.name}?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      // Gunakan PUT untuk toggle status is_active (bukan DELETE)
      const res = await api.put(`/api/users/${user.id}`, {
        is_active: !user.is_active,
      });
      if (res.data.success) {
        toast.success(`Akun staf "${user.name}" berhasil ${user.is_active ? 'dinonaktifkan' : 'diaktifkan'}.`);
        fetchUsers();
      }
    } catch (err) {
      console.error("Gagal mengubah status keaktifan:", err);
      toast.error(err.response?.data?.message || "Gagal mengubah status staf.");
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Apakah Anda yakin ingin MENGHAPUS PERMANEN akun staf "${user.name}"? Tindakan ini tidak dapat dibatalkan.`)) return;
    try {
      const res = await api.delete(`/api/users/${user.id}`);
      if (res.data.success) {
        toast.success(`Akun staf "${user.name}" berhasil dihapus.`);
        fetchUsers();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal menghapus akun staf.');
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((u) => {
    const matchSearch =
      search === "" ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchRole = filterRole === "all" || u.role === filterRole;

    const matchStatus =
      filterStatus === "all" ||
      (filterStatus === "active" && u.is_active) ||
      (filterStatus === "inactive" && !u.is_active);

    return matchSearch && matchRole && matchStatus;
  });

  const hasActiveFilters =
    search !== "" || filterRole !== "all" || filterStatus !== "all";

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-blue-600" />
          <div>
            <h2 className="text-base font-bold text-zinc-900">Kelola Akun Staf</h2>
            <p className="text-[11px] text-zinc-500">
              {loading ? "Memuat..." : `${users.length} total akun staf · ${filteredUsers.length} ditampilkan`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchUsers}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-zinc-300 text-zinc-650 hover:text-zinc-900 hover:bg-zinc-50 transition-all text-xs font-medium cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
            Segarkan
          </button>
          
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Plus className="h-4 w-4" /> Tambah Staf
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-wrap gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari staf berdasarkan nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-800 placeholder-zinc-400 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Role Filter */}
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          <select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
            className="pl-8 pr-8 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 appearance-none cursor-pointer"
          >
            <option value="all">Semua Jabatan</option>
            {Object.entries(ROLES).map(([key, val]) => (
              <option key={key} value={key}>
                {val.label}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="pl-8 pr-8 py-2.5 rounded-xl border border-zinc-300 bg-white text-sm text-zinc-700 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 appearance-none cursor-pointer"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400 pointer-events-none" />
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <button
            onClick={() => {
              setSearch("");
              setFilterRole("all");
              setFilterStatus("all");
            }}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-zinc-300 bg-white text-zinc-600 hover:text-rose-600 hover:border-rose-200 hover:bg-rose-50/30 text-xs font-semibold transition-all cursor-pointer"
          >
            <X className="h-3.5 w-3.5" /> Reset Filter
          </button>
        )}
      </div>

      {/* Main Grid List */}
      {error && !loading && (
        <div className="flex items-center gap-3 bg-rose-50 border border-rose-200 rounded-2xl px-5 py-4 text-sm text-rose-600">
          <AlertTriangle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      {loading ? (
        <UserSkeleton />
      ) : filteredUsers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center text-zinc-550 bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <Users className="h-10 w-10 mb-3 text-zinc-400" />
          <p className="font-bold text-zinc-850">Tidak ada data staf ditemukan</p>
          <p className="text-xs mt-1 text-zinc-500 font-medium">Sesuaikan filter atau tambah akun staf baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={setEditingUser}
              onToggleActive={handleToggleActive}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}

      {/* Staff Form Modal (Register or Edit) */}
      {(showAddForm || editingUser) && (
        <UserFormModal
          user={editingUser}
          onClose={() => {
            setShowAddForm(false);
            setEditingUser(null);
          }}
          onSaved={() => {
            const isEdit = !!editingUser;
            toast.success(isEdit ? "Profil staf berhasil diperbarui." : "Staf baru berhasil didaftarkan.");
            setShowAddForm(false);
            setEditingUser(null);
            fetchUsers();
          }}
        />
      )}
    </div>
  );
};

export default UsersPage;
