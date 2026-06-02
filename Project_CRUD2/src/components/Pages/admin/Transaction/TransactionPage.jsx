import { useState, useEffect, useMemo } from "react";
import categoryService from "../../../../services/categoryService";
import productService from "../../../../services/productService";

const TransactionPage = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");

  const TAX_RATE = 0.1; // 10%
  const DISCOUNT = 0;

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          categoryService.getAllCategories(),
          productService.getAllProducts(),
        ]);
        const catData = catRes.data || catRes;
        const prodData = prodRes.data || prodRes;
        setCategories(catData);
        setProducts(prodData.filter((p) => p.is_active));
      } catch (err) {
        console.error("Failed to load data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = selectedCategory
        ? p.category_id === selectedCategory
        : true;
      const matchSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, search]);

  // Cart helpers
  const addToCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.qty) return prev;
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id !== productId) return item;
          const product = products.find((p) => p.id === productId);
          const maxQty = product ? product.qty : item.quantity;
          const newQty = Math.min(item.quantity + delta, maxQty);
          return { ...item, quantity: newQty };
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item.id !== productId));
  };

  // Price calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );
  const tax = Math.round(subtotal * TAX_RATE);
  const total = subtotal + tax - DISCOUNT;

  const formatRp = (num) => `Rp ${Number(num).toLocaleString("id-ID")}`;

  const handlePayment = () => {
    if (cart.length === 0) return;
    setShowPaymentModal(true);
  };

  const handleConfirmPayment = () => {
    if (!customerName.trim()) {
      alert("Silakan isi nama customer terlebih dahulu!");
      return;
    }
    alert(
      `Pembayaran berhasil!\n\nCustomer: ${customerName}\nMetode: ${paymentMethod === "cash" ? "Cash (COD)" : "Midtrans"}\nTotal: ${formatRp(total)}`
    );
    setCart([]);
    setCustomerName("");
    setPaymentMethod("cash");
    setShowPaymentModal(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 min-h-[calc(100vh-120px)]">
      {/* ===== LEFT PANEL: Products ===== */}
      <div className="flex-1 min-w-0">
        {/* Category Tabs */}
        <div className="flex gap-1 mb-5 flex-wrap">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
              selectedCategory === null
                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            Semua Produk
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition cursor-pointer ${
                selectedCategory === cat.id
                  ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 mb-5">
          <span className="text-sm font-semibold text-blue-600 whitespace-nowrap">
            {filteredProducts.length} Products
          </span>
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              <i className="bx bx-search text-lg"></i>
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search"
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-400 transition"
            />
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredProducts.map((product) => {
            const inCart = cart.find((c) => c.id === product.id);
            return (
              <div
                key={product.id}
                className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Product Image */}
                <div className="h-32 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center text-gray-300">
                      <i className="bx bx-image text-4xl"></i>
                      <span className="text-xs mt-1">No Image</span>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-3 flex flex-col flex-1">
                  <h3 className="font-semibold text-sm text-gray-800 truncate">
                    {product.name}
                  </h3>
                  <p className="text-xs text-gray-400 truncate">
                    {product.category_name || product.name}
                  </p>

                  <p className="text-blue-600 font-bold text-sm mt-2">
                    {formatRp(product.price)}
                  </p>
                  <p className="text-xs text-gray-400 mb-3">
                    Ready Stock {product.qty} {product.unit}
                  </p>

                  <button
                    onClick={() => addToCart(product)}
                    disabled={product.qty <= 0}
                    className={`mt-auto w-full py-2 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1 ${
                      inCart
                        ? "bg-green-500 text-white hover:bg-green-600"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    } disabled:opacity-40 disabled:cursor-not-allowed`}
                  >
                    <i className={`bx ${inCart ? "bx-check" : "bx-cart-add"} text-base`}></i>
                    {inCart ? `In Cart (${inCart.quantity})` : "Add To Cart"}
                  </button>
                </div>
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-16 text-gray-400">
              <i className="bx bx-package text-5xl"></i>
              <p className="mt-2 text-sm">Tidak ada produk ditemukan</p>
            </div>
          )}
        </div>
      </div>

      {/* ===== RIGHT PANEL: Order Details ===== */}
      <div className="w-80 shrink-0">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm sticky top-4">
          {/* Header */}
          <div className="px-5 py-3 border-b border-gray-100">
            <h2 className="font-semibold text-sm text-gray-700 flex items-center gap-2">
              <i className="bx bx-receipt text-lg"></i>
              Order Details
            </h2>
          </div>

          {/* Cart Items */}
          <div className="p-4 max-h-[340px] overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-gray-300">
                <i className="bx bx-cart text-4xl"></i>
                <p className="text-xs mt-2">Keranjang masih kosong</p>
              </div>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0"
                  >
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden shrink-0">
                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <i className="bx bx-package text-xl text-gray-300"></i>
                      )}
                    </div>

                    {/* Item Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0">
                          <p className="font-semibold text-xs text-gray-800 truncate">
                            {item.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            {formatRp(item.price)}
                          </p>
                        </div>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-400 hover:text-red-600 transition cursor-pointer shrink-0 ml-1"
                          title="Hapus"
                        >
                          <i className="bx bx-x text-lg"></i>
                        </button>
                      </div>

                      {/* Qty Controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => updateQty(item.id, -1)}
                            className="w-7 h-7 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition cursor-pointer text-sm"
                          >
                            -
                          </button>
                          <span className="w-8 text-center text-sm font-medium">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, 1)}
                            className="w-7 h-7 rounded border border-blue-400 bg-blue-50 flex items-center justify-center text-blue-600 hover:bg-blue-100 transition cursor-pointer text-sm"
                          >
                            +
                          </button>
                        </div>
                        <p className="font-semibold text-sm text-gray-800">
                          {formatRp(Number(item.price) * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="px-5 py-3 border-t border-gray-100 space-y-1.5">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Subtotal</span>
              <span>{formatRp(subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Tax (10%)</span>
              <span>{formatRp(tax)}</span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Discount</span>
              <span>- {formatRp(DISCOUNT)}</span>
            </div>
            <div className="flex justify-between font-bold text-sm text-gray-800 pt-2 border-t border-gray-100">
              <span>Total</span>
              <span>{formatRp(total)}</span>
            </div>
          </div>

          {/* Payment Button */}
          <div className="px-5 pb-4">
            <button
              onClick={handlePayment}
              disabled={cart.length === 0}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold text-sm hover:from-green-600 hover:to-green-700 transition-all shadow-md shadow-green-200 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none flex items-center justify-center gap-2"
            >
              <i className="bx bx-credit-card text-lg"></i>
              Payment
            </button>
          </div>
        </div>
      </div>

      {/* ===== PAYMENT MODAL ===== */}
      {showPaymentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setShowPaymentModal(false)}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 px-6 py-4 rounded-t-2xl flex justify-between items-center">
              <h2 className="text-white font-semibold text-lg flex items-center gap-2">
                <i className="bx bx-credit-card text-xl"></i>
                Payment Method
              </h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-white hover:bg-white/30 transition cursor-pointer"
              >
                <i className="bx bx-x text-xl"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5">
              {/* Customer Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Customer Name
                </label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Isi nama anda.."
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-400 transition"
                />
              </div>

              {/* Payment Method */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-4">
                  {/* Cash */}
                  <label
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      paymentMethod === "cash"
                        ? "border-green-500 bg-green-50 shadow-md shadow-green-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="absolute top-3 right-3 accent-green-500"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <i className="bx bx-money text-2xl text-green-600"></i>
                      <span className="font-bold text-green-600">Cash</span>
                    </div>
                    <p className="text-xs text-gray-400">Bayar di tempat.</p>
                  </label>

                  {/* Midtrans */}
                  <label
                    className={`relative cursor-pointer rounded-xl border-2 p-4 transition-all ${
                      paymentMethod === "midtrans"
                        ? "border-blue-500 bg-blue-50 shadow-md shadow-blue-100"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value="midtrans"
                      checked={paymentMethod === "midtrans"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="absolute top-3 right-3 accent-blue-500"
                    />
                    <div className="flex items-center gap-2 mb-2">
                      <i className="bx bx-globe text-2xl text-blue-600"></i>
                      <span className="font-bold text-blue-600">Midtrans</span>
                    </div>
                    <p className="text-xs text-gray-400">
                      Pembayaran online via payment gateway.
                    </p>
                  </label>
                </div>
              </div>

              {/* Summary & Notes Row */}
              <div className="grid grid-cols-2 gap-4">
                {/* Payment Summary */}
                <div className="border border-gray-200 rounded-xl p-4">
                  <h3 className="font-bold text-sm text-gray-800 mb-3">
                    Ringkasan Pembayaran
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-500">
                      <span>Subtotal</span>
                      <span>{formatRp(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Tax</span>
                      <span>{formatRp(tax)}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>Discount</span>
                      <span>- {formatRp(DISCOUNT)}</span>
                    </div>
                    <div className="flex justify-between font-bold text-gray-800 pt-2 border-t border-gray-200">
                      <span>Total</span>
                      <span className="text-green-600">{formatRp(total)}</span>
                    </div>
                  </div>
                </div>

                {/* Notes */}
                <div className="bg-cyan-50 border border-cyan-200 rounded-xl p-4">
                  <h3 className="font-bold text-sm text-red-500 mb-2">
                    Catatan:
                  </h3>
                  <ul className="text-xs text-gray-600 space-y-1.5">
                    <li>
                      - Jika memilih <strong>COD</strong>, pesanan akan langsung
                      diproses.
                    </li>
                    <li>
                      - Jika memilih <strong>Midtrans</strong>, nanti bisa
                      diarahkan ke payment gateway.
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 pb-6 flex justify-end gap-3">
              <button
                onClick={() => setShowPaymentModal(false)}
                className="px-6 py-2.5 rounded-lg bg-gray-500 text-white font-semibold text-sm hover:bg-gray-600 transition cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={handleConfirmPayment}
                className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-500 text-white font-semibold text-sm hover:from-cyan-500 hover:to-cyan-600 transition-all shadow-md shadow-cyan-200 cursor-pointer"
              >
                Bayar Sekarang
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionPage;
