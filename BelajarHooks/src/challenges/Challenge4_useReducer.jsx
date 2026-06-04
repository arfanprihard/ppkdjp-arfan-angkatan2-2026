import React, { useReducer, useState } from 'react';

/**
 * 🛒 TANTANGAN 4: useReducer - Shopping Cart
 *
 * Fitur:
 * - Daftar produk dengan tombol Add to Cart
 * - Cart: tambah, kurangi quantity, hapus item
 * - Hitung total harga & total item
 * - Action types: ADD, REMOVE, INCREMENT, DECREMENT, CLEAR
 * - Tampilkan cart summary + checkout toast
 * - Kode promo sederhana (HOOKS20 = diskon 20%)
 */

const PRODUCTS = [
  { id: 1, name: 'React Hooks Mastery Course', price: 299000, emoji: '⚛️', category: 'Course' },
  { id: 2, name: 'TypeScript Deep Dive', price: 199000, emoji: '🔷', category: 'Course' },
  { id: 3, name: 'Next.js Fullstack Bootcamp', price: 399000, emoji: '🚀', category: 'Course' },
  { id: 4, name: 'Sticker Pack "Dev Life"', price: 45000, emoji: '🎨', category: 'Merch' },
  { id: 5, name: 'Mug "console.log(☕)"', price: 89000, emoji: '☕', category: 'Merch' },
  { id: 6, name: 'Hoodie "useEffect Dev"', price: 250000, emoji: '👕', category: 'Merch' },
];

const PROMO_CODES = { HOOKS20: 0.20, REACT10: 0.10 };

// ─── Reducer ───
const initialState = { items: [] };

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD': {
      const exists = state.items.find(i => i.id === action.product.id);
      if (exists) {
        return { ...state, items: state.items.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i) };
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case 'INCREMENT':
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i) };
    case 'DECREMENT':
      return { ...state, items: state.items.map(i => i.id === action.id ? { ...i, qty: Math.max(i.qty - 1, 1) } : i) };
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) };
    case 'CLEAR':
      return initialState;
    default:
      throw new Error('Unknown action: ' + action.type);
  }
}

function formatRupiah(n) {
  return 'Rp ' + n.toLocaleString('id-ID');
}

export default function Challenge4_useReducer() {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [cartOpen, setCartOpen] = useState(false);
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [toast, setToast] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Semua');

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const subtotal = state.items.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = appliedPromo ? subtotal * PROMO_CODES[appliedPromo] : 0;
  const total = subtotal - discount;
  const categories = ['Semua', ...new Set(PRODUCTS.map(p => p.category))];
  const filteredProducts = categoryFilter === 'Semua' ? PRODUCTS : PRODUCTS.filter(p => p.category === categoryFilter);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleAdd = (product) => {
    dispatch({ type: 'ADD', product });
    showToast(`✅ ${product.name} ditambahkan ke keranjang!`);
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedPromo(code);
      setPromoError('');
      showToast(`🎉 Kode "${code}" berhasil! Diskon ${PROMO_CODES[code] * 100}%`);
    } else {
      setPromoError('Kode promo tidak valid. Coba: HOOKS20 atau REACT10');
    }
  };

  const handleCheckout = () => {
    dispatch({ type: 'CLEAR' });
    setAppliedPromo(null);
    setCartOpen(false);
    showToast('🎊 Checkout berhasil! Terima kasih atas pembelian kamu!');
  };

  const isInCart = (id) => state.items.some(i => i.id === id);

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto', color: '#f0f0f8', position: 'relative' }}>
      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 9999,
          padding: '12px 20px', borderRadius: '12px',
          background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
          color: '#fff', fontWeight: 600, fontSize: '13px',
          boxShadow: '0 8px 32px rgba(108,92,231,0.5)',
          animation: 'slideIn 0.3s ease-out',
          maxWidth: '320px'
        }}>
          <style>{`@keyframes slideIn { from { transform: translateX(100px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }`}</style>
          {toast}
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🛒</span>
          <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Shopping Cart</h2>
        </div>
        <button onClick={() => setCartOpen(o => !o)} style={{
          position: 'relative', padding: '8px 16px', borderRadius: '10px',
          background: 'linear-gradient(135deg, #E17055, #FDCB6E)',
          color: '#fff', fontWeight: 700, fontSize: '13px',
          border: 'none', cursor: 'pointer'
        }}>
          🛒 Keranjang
          {totalItems > 0 && (
            <span style={{
              position: 'absolute', top: '-8px', right: '-8px',
              background: '#E84393', borderRadius: '50%',
              width: '20px', height: '20px', fontSize: '11px',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800
            }}>{totalItems}</span>
          )}
        </button>
      </div>
      <p style={{ color: '#a0a0c0', fontSize: '12px', marginBottom: '16px' }}>
        File: <code style={{ background: '#1e1e3f', padding: '2px 6px', borderRadius: '4px' }}>src/challenges/Challenge4_useReducer.jsx</code>
      </p>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
            padding: '5px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
            background: categoryFilter === cat ? '#0984E3' : 'transparent',
            border: `1px solid ${categoryFilter === cat ? '#0984E3' : '#2a2a5a'}`,
            color: categoryFilter === cat ? '#fff' : '#a0a0c0', transition: 'all 0.2s'
          }}>{cat}</button>
        ))}
      </div>

      {/* Product Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px', marginBottom: '20px' }}>
        {filteredProducts.map(product => {
          const inCart = isInCart(product.id);
          const cartItem = state.items.find(i => i.id === product.id);
          return (
            <div key={product.id} style={{
              padding: '16px', borderRadius: '12px',
              background: inCart ? '#1a2a40' : '#16163a',
              border: `1px solid ${inCart ? '#0984E360' : '#2a2a5a'}`,
              transition: 'all 0.2s'
            }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{product.emoji}</div>
              <div style={{ fontWeight: 700, fontSize: '13px', color: '#f0f0f8', marginBottom: '4px', lineHeight: 1.3 }}>{product.name}</div>
              <div style={{ fontSize: '11px', color: '#a0a0c0', marginBottom: '10px' }}>{product.category}</div>
              <div style={{ fontWeight: 800, fontSize: '15px', color: '#FDCB6E', marginBottom: '10px' }}>{formatRupiah(product.price)}</div>
              {inCart ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <button onClick={() => dispatch({ type: 'DECREMENT', id: product.id })} style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#2a2a5a', border: 'none', color: '#f0f0f8', cursor: 'pointer', fontWeight: 800, fontSize: '14px' }}>−</button>
                  <span style={{ flex: 1, textAlign: 'center', fontWeight: 700, fontSize: '14px' }}>{cartItem.qty}</span>
                  <button onClick={() => dispatch({ type: 'INCREMENT', id: product.id })} style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#0984E3', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: '14px' }}>+</button>
                  <button onClick={() => dispatch({ type: 'REMOVE', id: product.id })} style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#E17055', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>🗑️</button>
                </div>
              ) : (
                <button onClick={() => handleAdd(product)} style={{
                  width: '100%', padding: '7px', borderRadius: '8px',
                  background: 'linear-gradient(135deg, #0984E3, #6C5CE7)',
                  color: '#fff', fontWeight: 700, fontSize: '12px',
                  border: 'none', cursor: 'pointer'
                }}>+ Tambah</button>
              )}
            </div>
          );
        })}
      </div>

      {/* Cart Summary */}
      {cartOpen && (
        <div style={{
          padding: '20px', borderRadius: '16px',
          background: '#1a1a3a', border: '1px solid #2a2a6a',
          marginBottom: '16px'
        }}>
          <h3 style={{ margin: '0 0 16px', fontSize: '16px', color: '#f0f0f8' }}>🛒 Keranjang Belanja</h3>
          {state.items.length === 0 ? (
            <p style={{ color: '#555', textAlign: 'center', padding: '20px 0', margin: 0 }}>Keranjang masih kosong…</p>
          ) : (
            <>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                {state.items.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', borderRadius: '10px', background: '#1e1e45', border: '1px solid #2a2a55' }}>
                    <span style={{ fontSize: '20px' }}>{item.emoji}</span>
                    <span style={{ flex: 1, fontSize: '13px', color: '#f0f0f8' }}>{item.name}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <button onClick={() => dispatch({ type: 'DECREMENT', id: item.id })} style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#2a2a5a', border: 'none', color: '#f0f0f8', cursor: 'pointer', fontWeight: 800 }}>−</button>
                      <span style={{ width: '20px', textAlign: 'center', fontSize: '13px', fontWeight: 700 }}>{item.qty}</span>
                      <button onClick={() => dispatch({ type: 'INCREMENT', id: item.id })} style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#0984E3', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800 }}>+</button>
                    </div>
                    <span style={{ minWidth: '90px', textAlign: 'right', fontSize: '13px', fontWeight: 700, color: '#FDCB6E' }}>{formatRupiah(item.price * item.qty)}</span>
                    <button onClick={() => dispatch({ type: 'REMOVE', id: item.id })} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#E17055' }}>✕</button>
                  </div>
                ))}
              </div>

              {/* Promo */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input value={promoInput} onChange={e => setPromoInput(e.target.value)} placeholder="Kode promo (coba: HOOKS20)" style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: '#252550', border: `1px solid ${promoError ? '#E17055' : '#2a2a5a'}`, color: '#f0f0f8', fontSize: '12px', outline: 'none' }} />
                  <button onClick={handleApplyPromo} style={{ padding: '8px 14px', borderRadius: '8px', background: '#6C5CE7', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 700 }}>Terapkan</button>
                </div>
                {promoError && <div style={{ color: '#E17055', fontSize: '11px', marginTop: '4px' }}>⚠️ {promoError}</div>}
                {appliedPromo && <div style={{ color: '#00B894', fontSize: '11px', marginTop: '4px' }}>✅ Kode "{appliedPromo}" aktif — Diskon {PROMO_CODES[appliedPromo] * 100}%</div>}
              </div>

              {/* Summary */}
              <div style={{ borderTop: '1px solid #2a2a5a', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#a0a0c0' }}>
                  <span>Subtotal ({totalItems} item)</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#00B894' }}>
                    <span>Diskon ({appliedPromo})</span>
                    <span>− {formatRupiah(discount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 800, color: '#FDCB6E', borderTop: '1px solid #2a2a5a', paddingTop: '8px', marginTop: '4px' }}>
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
                <button onClick={() => dispatch({ type: 'CLEAR' })} style={{ flex: 1, padding: '9px', borderRadius: '10px', background: 'transparent', border: '1px solid #E17055', color: '#E17055', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>🗑️ Kosongkan</button>
                <button onClick={handleCheckout} style={{ flex: 2, padding: '9px', borderRadius: '10px', background: 'linear-gradient(135deg, #00B894, #00CEC9)', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>✅ Checkout — {formatRupiah(total)}</button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
