import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Search, Utensils, Coffee, IceCream, Cookie, Plus } from "lucide-react";

const CATEGORIES = {
  semua: "Semua",
  food: "Makanan",
  beverage: "Minuman",
  dessert: "Dessert",
  snack: "Snack"
};

const CATEGORY_ICONS = {
  food: <Utensils className="h-4 w-4 text-emerald-600" />,
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

const MenuGrid = ({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onAddToCart,
}) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenu = async () => {
      setLoading(true);
      try {
        const res = await api.get("/api/fnb/items");
        if (res.data.success) {
          setMenuItems(res.data.data.filter(item => item.is_available) || []);
        }
      } catch (err) {
        console.error("Gagal mengambil menu F&B", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  const filteredMenuItems = menuItems.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (item.description || "").toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari makanan, minuman, dessert, snack..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
          />
        </div>
        <div className="flex bg-slate-100 border border-zinc-200 p-0.5 rounded-xl overflow-x-auto shrink-0 scrollbar-none">
          {Object.entries(CATEGORIES).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setSelectedCategory(key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer whitespace-nowrap border border-transparent ${
                selectedCategory === key
                  ? "bg-white text-blue-600 shadow-xs border-zinc-200/50"
                  : "text-zinc-550 hover:text-zinc-800"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white border border-zinc-200 rounded-2xl p-4 animate-pulse">
              <div className="h-3 bg-zinc-100 rounded w-20 mb-3" />
              <div className="h-4 bg-zinc-100 rounded w-3/4 mb-2" />
              <div className="h-3 bg-zinc-100 rounded w-full mb-4" />
              <div className="h-3 bg-zinc-100 rounded w-24" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMenuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => onAddToCart(item)}
              className="group relative bg-white hover:bg-slate-50/50 border border-zinc-200 hover:border-zinc-300/80 rounded-2xl p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
                    {CATEGORY_ICONS[item.category] || <Utensils className="h-4 w-4" />}
                    {CATEGORIES[item.category] || item.category}
                  </span>
                  <span className="h-6 w-6 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-zinc-500 transition-all duration-200">
                    <Plus className="h-3.5 w-3.5" />
                  </span>
                </div>
                <h4 className="text-sm font-bold text-zinc-800 group-hover:text-zinc-950 transition-colors">
                  {item.name}
                </h4>
                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                  {item.description || ""}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-zinc-100 flex items-center justify-between">
                <span className="text-xs font-black text-blue-600 group-hover:text-blue-700">
                  {formatRupiah(item.price)}
                </span>
              </div>
            </div>
          ))}

          {filteredMenuItems.length === 0 && (
            <div className="md:col-span-2 py-12 text-center border border-dashed border-zinc-200 rounded-2xl bg-white shadow-xs">
              <p className="text-zinc-500 text-xs">Tidak ada menu yang cocok dengan pencarian Anda.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MenuGrid;
