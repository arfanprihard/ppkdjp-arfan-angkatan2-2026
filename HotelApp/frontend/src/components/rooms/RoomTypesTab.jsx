import React, { useState } from "react";
import { Plus, Edit, Trash2, Users, Receipt, Info, HelpCircle } from "lucide-react";
import { formatRupiah } from "./helpers";
import RoomTypeFormModal from "./RoomTypeFormModal";
import api from "../../api/axios";
import { useToast } from "../../contexts/ToastContext";

const RoomTypesTab = ({ roomTypes, onRefresh }) => {
  const toast = useToast();
  const [editingType, setEditingType] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = async (type) => {
    const confirmMessage = `Apakah Anda yakin ingin menghapus tipe kamar "${type.name}" (${type.code})?`;
    if (!window.confirm(confirmMessage)) return;

    try {
      const res = await api.delete(`/api/room-types/${type.id}`);
      if (res.data.success) {
        toast.success(`Tipe kamar "${type.name}" berhasil dihapus.`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
      toast.error(
        err.response?.data?.message || "Gagal menghapus tipe kamar."
      );
    }
  };

  return (
    <div className="space-y-4">
      {/* Header Aksi */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-zinc-700">Daftar Tipe Kamar</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all duration-200 cursor-pointer shadow-sm border-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Tambah Tipe Kamar
        </button>
      </div>

      {/* Grid Tipe Kamar */}
      {roomTypes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center text-zinc-400 bg-white border border-zinc-100 rounded-2xl shadow-xs">
          <HelpCircle className="h-10 w-10 mb-3 text-zinc-300" />
          <p className="font-semibold text-zinc-600">Belum ada tipe kamar</p>
          <p className="text-xs mt-1">Klik tombol di atas untuk menambahkan tipe kamar baru.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {roomTypes.map((type) => (
            <div
              key={type.id}
              className="bg-white border border-zinc-200 rounded-2xl p-5 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Kode & Nama */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-blue-50 text-blue-600 border border-blue-100 mb-1">
                      {type.code}
                    </span>
                    <h4 className="font-bold text-zinc-800 text-sm md:text-base leading-tight">
                      {type.name}
                    </h4>
                  </div>
                </div>

                {/* Deskripsi */}
                <p className="text-xs text-zinc-500 line-clamp-3 min-h-[48px]">
                  {type.description || "Tidak ada deskripsi."}
                </p>

                {/* Info Harga & Kapasitas */}
                <div className="pt-3 border-t border-zinc-100 grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                      <Receipt className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Harga</p>
                      <p className="text-xs font-bold text-zinc-700">{formatRupiah(type.base_price)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
                      <Users className="h-3.5 w-3.5" />
                    </div>
                    <div>
                      <p className="text-[9px] uppercase tracking-widest text-zinc-400 font-bold">Kapasitas</p>
                      <p className="text-xs font-bold text-zinc-700">{type.default_capacity} Tamu</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Aksi */}
              <div className="mt-5 pt-3 border-t border-zinc-150 flex items-center justify-end gap-2">
                <button
                  onClick={() => setEditingType(type)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-650 hover:bg-slate-50 hover:text-zinc-800 text-xs font-semibold transition-all cursor-pointer bg-transparent"
                >
                  <Edit className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(type)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-rose-100 text-rose-600 hover:bg-rose-50 hover:text-rose-700 text-xs font-semibold transition-all cursor-pointer bg-transparent"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add */}
      {showAddModal && (
        <RoomTypeFormModal
          type={null}
          onClose={() => setShowAddModal(false)}
          onSaved={() => {
            setShowAddModal(false);
            onRefresh();
          }}
        />
      )}

      {/* Modal Edit */}
      {editingType && (
        <RoomTypeFormModal
          type={editingType}
          onClose={() => setEditingType(null)}
          onSaved={() => {
            setEditingType(null);
            onRefresh();
          }}
        />
      )}
    </div>
  );
};

export default RoomTypesTab;
