import { Search, Utensils, Coffee, IceCream, Plus } from "lucide-react";

// --- Menu Makanan & Minuman Statis ---
const MENU_ITEMS = [
  // Makanan Utama
  { id: 1, name: "Nasi Goreng Kampung", category: "makanan", price: 65000, desc: "Nasi goreng tradisional dengan ayam goreng, sate, telur ceplok" },
  { id: 2, name: "Mie Goreng Jawa", category: "makanan", price: 55000, desc: "Mie goreng bumbu jawa dengan bakso, ayam, sayuran" },
  { id: 3, name: "Club Sandwich", category: "makanan", price: 75000, desc: "Roti panggang tiga tingkat dengan dada ayam, telur, smoked beef, kentang goreng" },
  { id: 4, name: "Sop Buntut", category: "makanan", price: 120000, desc: "Buntut sapi kuah bening dengan wortel, kentang, sambal ijo, dan emping" },
  { id: 5, name: "Chicken Caesar Salad", category: "makanan", price: 60000, desc: "Selada romaine dengan saus caesar, grilled chicken breast, dan crouton" },
  // Minuman
  { id: 6, name: "Ice Sweet Tea", category: "minuman", price: 15000, desc: "Teh manis es segar" },
  { id: 7, name: "Fresh Orange Juice", category: "minuman", price: 30000, desc: "Jus jeruk peras murni tanpa pemanis buatan" },
  { id: 8, name: "Cappuccino", category: "minuman", price: 35000, desc: "Espresso dengan susu hangat dan foam tebal" },
  { id: 9, name: "Mineral Water (600ml)", category: "minuman", price: 12000, desc: "Air mineral kemasan botol" },
  { id: 10, name: "Mocktail Virgin Mojito", category: "minuman", price: 40000, desc: "Minuman soda segar dengan daun mint, jeruk nipis, sirup mojito" },
  // Dessert
  { id: 11, name: "Banana Split", category: "dessert", price: 45000, desc: "Pisang dengan tiga scoop es krim (cokelat, vanila, stroberi)" },
  { id: 12, name: "Tiramisu Cake", category: "dessert", price: 50000, desc: "Kue tiramisu lembut khas Italia dengan aroma kopi" },
  { id: 13, name: "Fresh Fruit Platter", category: "dessert", price: 35000, desc: "Irisan buah segar musiman (semangka, melon, nanas, pepaya)" },
];

const CATEGORIES = {
  semua: "Semua",
  makanan: "Makanan",
  minuman: "Minuman",
  dessert: "Dessert"
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
  // Filter menu items on POS
  const filteredMenuItems = MENU_ITEMS.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.desc.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "semua" || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryIcon = (category) => {
    switch (category) {
      case "makanan":
        return <Utensils className="h-4 w-4 text-emerald-600" />;
      case "minuman":
        return <Coffee className="h-4 w-4 text-blue-600" />;
      case "dessert":
        return <IceCream className="h-4 w-4 text-purple-600" />;
      default:
        return <Utensils className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Cari makanan, minuman, dessert..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl border border-zinc-300 bg-white text-zinc-800 outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600/10"
          />
        </div>

        {/* Categories */}
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

      {/* Menu Grid */}
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
                  {getCategoryIcon(item.category)}
                  {item.category}
                </span>
                <span className="h-6 w-6 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white flex items-center justify-center text-zinc-500 transition-all duration-200">
                  <Plus className="h-3.5 w-3.5" />
                </span>
              </div>
              <h4 className="text-sm font-bold text-zinc-800 group-hover:text-zinc-950 transition-colors">
                {item.name}
              </h4>
              <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                {item.desc}
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
    </div>
  );
};

export default MenuGrid;
