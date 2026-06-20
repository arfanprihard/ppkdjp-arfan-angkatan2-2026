import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Plus, Search, Edit2, Trash2, Utensils, Coffee, IceCream, Cookie, RefreshCw, AlertCircle } from "lucide-react";
import FnbItemFormModal from "./FnbItemFormModal";

const CATEGORIES = {
  semua: "Semua",
  food: "Makanan",
  beverage: "Minuman",
  dessert: "Dessert",
  snack: "Snack"
};

const CATEGORY_ICONS = {
  food: <Utensils className="h-4 w-4 text-emerald-600 animate-in spin-in-12 duration-300" />,
  beverage: <Coffee className="h-4 w-4 text-blue-600" />,
  dessert: <IceCream className="h-4 w-4 text-purple-600" />,
  snack: <Cookie className="h-4 w-4 text-orange-600" />,
};

const formatRupiah = (amount) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount ?? 0);

const MenuManagement = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Search & Filter
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/fnb/items");
      if (res.data.success) {
        setItems(res.data.data || []);
      } else {
        setError("Gagal mengambil menu F&B.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server untuk memuat menu.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedItem(null);
    setShowModal(true);
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus menu "${item.name}" secara permanen?`)) {
      return;
    }
    
    try {
      const res = await api.delete(`/api/fnb/items/${item.id}`);
      if (res.data.success) {
        alert("Menu berhasil dihapus.");
        fetchItems();
      } else {
        alert(res.data.message || "Gagal menghapus menu.");
      }
    } catch (err) {
      console.error(err);
      alert("Gagal menghapus menu. Pastikan Anda memiliki akses.");
    }
  };

  const handleSaved = () => {
    setShowModal(false);
    setSelectedItem(null);
    fetchItems();
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      {/* Header Search & Actions */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-stretch sm:items-center">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari menu berdasarkan nama atau deskripsi..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-xs rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
          />
        </div>

        {/* Category buttons and Add button */}
        <div className="flex gap-2 items-center flex-wrap sm:flex-nowrap">
          <div className="flex bg-slate-100 border border-zinc-200 p-0.5 rounded-xl overflow-x-auto scrollbar-none">
            {Object.entries(CATEGORIES).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer whitespace-nowrap border border-transparent ${
                  selectedCategory === key
                    ? "bg-white text-blue-600 shadow-xs border-zinc-200/50"
                    : "text-zinc-555 hover:text-zinc-800"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            onClick={handleAdd}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer border-0 shrink-0"
          >
            <Plus className="h-4 w-4" />
            Tambah Menu
          </button>
        </div>
      </div>

      {/* Error Info */}
      {error && (
        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Grid of Manageable Menu Cards */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-4 animate-pulse">
              <div className="h-3 bg-zinc-100 rounded w-20 mb-3" />
              <div className="h-4 bg-zinc-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-100 rounded w-full mb-4" />
              <div className="h-10 bg-zinc-100 rounded w-full" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-white border border-zinc-200 rounded-2xl p-4 hover:border-zinc-300 transition-all flex flex-col justify-between shadow-xs hover:shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                    {CATEGORY_ICONS[item.category] || <Utensils className="h-3.5 w-3.5" />}
                    {CATEGORIES[item.category] || item.category}
                  </span>
                  
                  {/* Stock Status Badge */}
                  <span className={`inline-flex px-2 py-0.5 rounded-lg border text-[9px] font-extrabold uppercase tracking-wide ${
                    item.is_available 
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200" 
                      : "bg-rose-50 text-rose-700 border-rose-200"
                  }`}>
                    {item.is_available ? "Tersedia" : "Kosong"}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-zinc-800 truncate" title={item.name}>
                  {item.name}
                </h4>
                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed min-h-[32px]">
                  {item.description || "Tidak ada deskripsi."}
                </p>
                
                <div className="text-xs font-black text-blue-600 pt-1">
                  {formatRupiah(item.price)}
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleEdit(item)}
                  className="p-1.5 bg-slate-50 hover:bg-slate-100 text-zinc-650 hover:text-zinc-900 border border-zinc-200 rounded-lg transition-all cursor-pointer text-xs font-semibold flex items-center gap-1"
                >
                  <Edit2 className="h-3.5 w-3.5 text-zinc-500" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(item)}
                  className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg transition-all cursor-pointer text-xs font-semibold flex items-center gap-1"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Hapus
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="col-span-full py-12 text-center border border-dashed border-zinc-200 rounded-2xl bg-white shadow-xs">
              <p className="text-zinc-500 text-xs">Tidak ada menu yang cocok dengan pencarian atau filter.</p>
            </div>
          )}
        </div>
      )}

      {/* Form Modal */}
      {showModal && (
        <FnbItemFormModal
          item={selectedItem}
          onClose={() => {
            setShowModal(false);
            setSelectedItem(null);
          }}
          onSaved={handleSaved}
        />
      )}
    </div>
  );
};

export default MenuManagement;
