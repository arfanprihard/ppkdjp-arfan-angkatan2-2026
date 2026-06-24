import { useState } from "react";
import { X, AlertCircle, RefreshCw } from "lucide-react";
import api from "../../api/axios";
import { useToast } from "../../contexts/ToastContext";

const CATEGORIES = [
  { key: "food", label: "Makanan" },
  { key: "beverage", label: "Minuman" },
  { key: "dessert", label: "Dessert" },
  { key: "snack", label: "Snack" }
];

const FnbItemFormModal = ({ item, onClose, onSaved }) => {
  const toast = useToast();
  const [name, setName] = useState(item?.name || "");
  const [category, setCategory] = useState(item?.category || "food");
  const [price, setPrice] = useState(item?.price || "");
  const [description, setDescription] = useState(item?.description || "");
  const [isAvailable, setIsAvailable] = useState(item ? Boolean(item.is_available) : true);
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama menu wajib diisi.");
      return;
    }
    if (!price || Number(price) < 0) {
      setError("Harga menu wajib diisi dan tidak boleh negatif.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = {
        name,
        category,
        price: Number(price),
        description: description || null,
        is_available: isAvailable,
      };

      let res;
      if (item) {
        // Edit mode
        res = await api.put(`/api/fnb/items/${item.id}`, payload);
      } else {
        // Add mode
        res = await api.post("/api/fnb/items", payload);
      }

      if (res.data.success) {
        toast.success(item ? "Menu berhasil diperbarui!" : "Menu baru berhasil ditambahkan!");
        onSaved();
      } else {
        setError(res.data.message || "Gagal menyimpan menu.");
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Terjadi kesalahan saat menyimpan menu.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/40 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <h3 className="text-sm font-black text-zinc-900 uppercase tracking-wide">
            {item ? "Edit Menu F&B" : "Tambah Menu Baru"}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-655 rounded-lg hover:bg-zinc-100 cursor-pointer border-0 bg-transparent"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-3 py-2 text-xs">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* Nama Menu */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-550 block">
              Nama Menu
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Nasi Goreng Kambing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
            />
          </div>

          {/* Kategori & Harga */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-550 block">
                Kategori
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 cursor-pointer"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.key} value={cat.key}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-550 block">
                Harga (Rupiah)
              </label>
              <input
                type="number"
                required
                min={0}
                placeholder="Contoh: 45000"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
              />
            </div>
          </div>

          {/* Deskripsi */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-550 block">
              Deskripsi Menu
            </label>
            <textarea
              rows={3}
              placeholder="Jelaskan bahan-bahan atau detail menu..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10 resize-none"
            />
          </div>

          {/* Status Ketersediaan */}
          <div className="flex items-center justify-between bg-slate-50 border border-zinc-200 rounded-xl p-3">
            <div>
              <span className="text-xs font-bold text-zinc-800 block">Tersedia untuk Dipesan</span>
              <span className="text-[10px] text-zinc-450 block mt-0.5">
                Stok menu aktif dan dapat dilihat di POS.
              </span>
            </div>
            <input
              type="checkbox"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="h-4.5 w-4.5 rounded-lg border-zinc-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
            />
          </div>

          {/* Footer Buttons */}
          <div className="pt-4 border-t border-zinc-200 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl border border-zinc-300 text-zinc-650 text-xs font-bold hover:bg-zinc-50 cursor-pointer bg-transparent"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-1.5 border-0 shadow-sm"
            >
              {saving ? (
                <>
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                "Simpan Menu"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FnbItemFormModal;
