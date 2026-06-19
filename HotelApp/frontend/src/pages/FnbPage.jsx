import { useState, useEffect, useCallback } from "react";
import api from "../api/axios";
import { useAuth } from "../contexts/AuthContext";
import {
  ShoppingBag,
  RefreshCw,
  ClipboardList,
  History,
  CheckCircle,
  AlertTriangle
} from "lucide-react";

// Subkomponen modular
import MenuGrid from "../components/fnb/MenuGrid";
import CartPanel from "../components/fnb/CartPanel";
import KitchenBoard from "../components/fnb/KitchenBoard";
import OrderHistory from "../components/fnb/OrderHistory";

const FnbPage = () => {
  const { user } = useAuth();
  const isReceptionist = user?.role === "receptionist";
  
  // Tab default: staf F&B diarahkan ke Dapur, resepsionis ke POS
  const [activeTab, setActiveTab] = useState(isReceptionist ? "pos" : "kitchen");
  
  // POS States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("semua");
  const [cart, setCart] = useState([]);
  const [outlet, setOutlet] = useState("resto");
  const [selectedReservationId, setSelectedReservationId] = useState("");
  const [guestName, setGuestName] = useState("");
  const [chargeTo, setChargeTo] = useState("cash");
  const [notes, setNotes] = useState("");
  const [activeCheckins, setActiveCheckins] = useState([]);
  
  // Kitchen/History States
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submittingOrder, setSubmittingOrder] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch active check-ins for Room Service dropdown
  const fetchActiveCheckins = useCallback(async () => {
    try {
      const res = await api.get("/api/reservations?status=checked_in&all=1");
      if (res.data.success) {
        setActiveCheckins(res.data.data || []);
      }
    } catch (err) {
      console.error("Gagal mengambil daftar kamar menginap", err);
    }
  }, []);

  // Fetch orders list (for Kitchen Board / History)
  const fetchOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/api/fnb/orders");
      if (res.data.success) {
        setOrders(res.data.data || []);
      } else {
        setError("Gagal mengambil daftar pesanan.");
      }
    } catch (err) {
      console.error(err);
      setError("Gagal menghubungi server.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveCheckins();
  }, [fetchActiveCheckins]);

  useEffect(() => {
    if (activeTab === "kitchen" || activeTab === "history") {
      fetchOrders();
    }
  }, [activeTab, fetchOrders]);

  // POS logic: Add/Update/Remove items in Cart
  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateCartQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((i) => {
          if (i.id === id) {
            const nextQty = i.quantity + delta;
            return nextQty > 0 ? { ...i, quantity: nextQty } : null;
          }
          return i;
        })
        .filter(Boolean)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const clearCart = () => {
    setCart([]);
    setSelectedReservationId("");
    setGuestName("");
    setNotes("");
    setChargeTo("cash");
  };

  // Auto set values when outlet changes
  useEffect(() => {
    if (outlet !== "room_service") {
      setSelectedReservationId("");
      if (chargeTo === "room") {
        setChargeTo("cash");
      }
    } else {
      setChargeTo("room");
    }
  }, [outlet]);

  // Handle room selection in room service POS
  const handleRoomSelection = (reservationId) => {
    setSelectedReservationId(reservationId);
    if (!reservationId) {
      setGuestName("");
      return;
    }
    const resv = activeCheckins.find((r) => r.id === Number(reservationId));
    if (resv) {
      setGuestName(resv.guest?.name || "");
    }
  };

  // Submit new order
  const handleCreateOrder = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Keranjang pesanan masih kosong.");
      return;
    }
    if (outlet === "room_service" && !selectedReservationId) {
      alert("Silakan pilih Kamar untuk Room Service.");
      return;
    }

    setSubmittingOrder(true);
    setError(null);
    try {
      const selectedResv = activeCheckins.find((r) => r.id === Number(selectedReservationId));
      
      const payload = {
        outlet,
        charge_to: chargeTo,
        notes: notes || null,
        guest_id: selectedResv ? selectedResv.guest_id : null,
        room_id: selectedResv ? selectedResv.room_id : null,
        items: cart.map((i) => ({
          item_name: i.name,
          quantity: i.quantity,
          unit_price: i.price,
        })),
      };

      const res = await api.post("/api/fnb/orders", payload);
      if (res.data.success) {
        setSuccessMessage("Pesanan F&B berhasil dibuat.");
        clearCart();
        setTimeout(() => setSuccessMessage(""), 4000);
        
        // Refresh active check-in data
        fetchActiveCheckins();
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Gagal membuat pesanan F&B.");
    } finally {
      setSubmittingOrder(false);
    }
  };

  // Kitchen logic: Update status (proses -> selesai)
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/api/fnb/orders/${orderId}/status`, {
        status: newStatus,
      });
      if (res.data.success) {
        fetchOrders();
      }
    } catch (err) {
      console.error("Gagal memperbarui status order", err);
      alert("Gagal memperbarui status pesanan.");
    }
  };

  const kitchenOrdersCount = orders.filter((o) => o.status === "proses").length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="h-8 w-1 rounded-full bg-blue-600" />
          <div>
            <h2 className="text-base font-bold text-zinc-900">Layanan Food & Beverage (F&B)</h2>
            <p className="text-[11px] text-zinc-500">
              Input Point of Sale (POS) pesanan dan pantau papan antrean dapur hotel.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 border border-zinc-200 p-0.5 rounded-xl">
          <button
            onClick={() => setActiveTab("pos")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-transparent ${
              activeTab === "pos" ? "bg-white text-blue-600 shadow-xs border-zinc-200/50" : "text-zinc-550 hover:text-zinc-800"
            }`}
          >
            <span className="flex items-center gap-1.5">
              <ShoppingBag className="h-3.5 w-3.5" />
              Buat Pesanan
            </span>
          </button>
          
          {!isReceptionist && (
            <>
              <button
                onClick={() => setActiveTab("kitchen")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-transparent relative ${
                  activeTab === "kitchen" ? "bg-white text-blue-600 shadow-xs border-zinc-200/50" : "text-zinc-550 hover:text-zinc-800"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <ClipboardList className="h-3.5 w-3.5" />
                  Antrean Dapur
                  {kitchenOrdersCount > 0 && (
                    <span className="absolute -top-1.5 -right-1 px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-blue-600 text-white animate-pulse">
                      {kitchenOrdersCount}
                    </span>
                  )}
                </span>
              </button>

              <button
                onClick={() => setActiveTab("history")}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border border-transparent ${
                  activeTab === "history" ? "bg-white text-blue-600 shadow-xs border-zinc-200/50" : "text-zinc-550 hover:text-zinc-800"
                }`}
              >
                <span className="flex items-center gap-1.5">
                  <History className="h-3.5 w-3.5" />
                  Riwayat
                </span>
              </button>
            </>
          )}
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-xs animate-in fade-in slide-in-from-top-4 duration-300">
          <CheckCircle className="h-4 w-4 shrink-0" />
          {successMessage}
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-rose-600 bg-rose-50 border border-rose-200 rounded-xl px-4 py-3 text-xs">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {/* --- TAB CONTENT: POINT OF SALE (POS) --- */}
      {activeTab === "pos" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start animate-in fade-in">
          {/* Left + Center: Menu Selection */}
          <div className="lg:col-span-2">
            <MenuGrid
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              onAddToCart={addToCart}
            />
          </div>

          {/* Right: Cart Panel */}
          <div>
            <CartPanel
              cart={cart}
              updateCartQty={updateCartQty}
              removeFromCart={removeFromCart}
              clearCart={clearCart}
              outlet={outlet}
              setOutlet={setOutlet}
              selectedReservationId={selectedReservationId}
              onRoomSelection={handleRoomSelection}
              guestName={guestName}
              chargeTo={chargeTo}
              setChargeTo={setChargeTo}
              notes={notes}
              setNotes={setNotes}
              activeCheckins={activeCheckins}
              submittingOrder={submittingOrder}
              onSubmitOrder={handleCreateOrder}
            />
          </div>
        </div>
      )}

      {/* --- TAB CONTENT: KITCHEN BOARD (ANTREAN DAPUR) --- */}
      {activeTab === "kitchen" && !isReceptionist && (
        <div className="animate-in fade-in">
          <KitchenBoard
            orders={orders}
            loading={loading}
            onRefresh={fetchOrders}
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      )}

      {/* --- TAB CONTENT: RIWAYAT PESANAN (SELESAI) --- */}
      {activeTab === "history" && !isReceptionist && (
        <div className="animate-in fade-in">
          <OrderHistory
            orders={orders}
            loading={loading}
            onRefresh={fetchOrders}
          />
        </div>
      )}
    </div>
  );
};

export default FnbPage;
