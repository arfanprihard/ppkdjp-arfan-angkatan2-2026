import React, { createContext, useContext, useReducer, useState, useEffect, useMemo, useCallback, useRef } from 'react';

/**
 * 🏆 TANTANGAN 8: Final Boss - Mini E-Commerce
 *
 * Menggunakan SEMUA hooks:
 * - useState: UI state (search, filters, selectedProduct)
 * - useEffect: data fetching (custom useFetch hook)
 * - useContext: theme context (ThemeContext)
 * - useReducer: shopping cart state (cartReducer)
 * - useMemo: filtered & sorted products
 * - useCallback: stable event handlers
 * - useRef: render count, search input focus
 * - Custom Hooks: useCart, useProducts, useLocalStorage
 */

// ─── Custom Hook: useLocalStorage ───
function useLocalStorage(key, initial) {
  const [val, setVal] = useState(() => {
    try { const s = localStorage.getItem(key); return s ? JSON.parse(s) : initial; } catch { return initial; }
  });
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  }, [key, val]);
  return [val, setVal];
}

// ─── Custom Hook: useProducts (fetch) ───
function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch('https://fakestoreapi.com/products?limit=12')
      .then(r => r.json())
      .then(data => {
        if (!cancelled) { setProducts(data); setLoading(false); }
      })
      .catch(() => {
        if (!cancelled) {
          // Use fallback data if API fails
          setProducts(FALLBACK_PRODUCTS);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, []);
  return { products, loading, error };
}

// ─── Fallback products data ───
const FALLBACK_PRODUCTS = [
  { id: 1, title: 'React Hooks Mastery', price: 29.99, category: 'courses', rating: { rate: 4.8, count: 120 }, image: null, description: 'Master all React hooks with practical examples' },
  { id: 2, title: 'TypeScript Deep Dive', price: 19.99, category: 'courses', rating: { rate: 4.6, count: 89 }, image: null, description: 'Complete TypeScript guide for modern web dev' },
  { id: 3, title: 'Next.js Fullstack', price: 39.99, category: 'courses', rating: { rate: 4.9, count: 203 }, image: null, description: 'Build production-ready apps with Next.js' },
  { id: 4, title: 'Dev Mug ☕', price: 14.99, category: 'merch', rating: { rate: 4.5, count: 45 }, image: null, description: 'Perfect mug for late-night coding sessions' },
  { id: 5, title: 'Hoodie "useEffect"', price: 49.99, category: 'merch', rating: { rate: 4.7, count: 67 }, image: null, description: 'Stay warm while you code' },
  { id: 6, title: 'Sticker Pack', price: 9.99, category: 'merch', rating: { rate: 4.3, count: 156 }, image: null, description: '50+ dev-themed stickers for your laptop' },
  { id: 7, title: 'Node.js Masterclass', price: 34.99, category: 'courses', rating: { rate: 4.7, count: 178 }, image: null, description: 'Server-side JS with Node and Express' },
  { id: 8, title: 'Dev Socks 🧦', price: 12.99, category: 'merch', rating: { rate: 4.2, count: 33 }, image: null, description: 'Comfortable socks for the modern dev' },
];

// ─── Custom Hook: useCart ───
const CartContext = createContext(null);
const cartInitial = { items: [], total: 0 };

function cartReducer(state, action) {
  let items;
  switch (action.type) {
    case 'ADD':
      const exists = state.items.find(i => i.id === action.product.id);
      items = exists
        ? state.items.map(i => i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...state.items, { ...action.product, qty: 1 }];
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    case 'REMOVE':
      items = state.items.filter(i => i.id !== action.id);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    case 'INCREMENT':
      items = state.items.map(i => i.id === action.id ? { ...i, qty: i.qty + 1 } : i);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    case 'DECREMENT':
      items = state.items.map(i => i.id === action.id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i);
      return { items, total: items.reduce((s, i) => s + i.price * i.qty, 0) };
    case 'CLEAR':
      return cartInitial;
    default:
      return state;
  }
}

function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, cartInitial);
  return <CartContext.Provider value={{ state, dispatch }}>{children}</CartContext.Provider>;
}
function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be inside CartProvider');
  return ctx;
}

// ─── Theme Context ───
const ThemeContext = createContext(null);
function ThemeProvider({ children }) {
  const [dark, setDark] = useLocalStorage('c8_dark', true);
  return <ThemeContext.Provider value={{ dark, toggle: () => setDark(d => !d) }}>{children}</ThemeContext.Provider>;
}
function useTheme() { return useContext(ThemeContext); }

// ─── Sub-components ───

const ProductEmojis = { courses: '📚', merch: '🎁', default: '🛍️' };

function ProductCard({ product, onAdd, inCart }) {
  const { dark } = useTheme();
  const { dispatch } = useCart();
  const bg = dark ? '#1a1a3a' : '#ffffff';
  const border = dark ? '#2a2a5a' : '#e0e0f0';
  const text = dark ? '#f0f0f8' : '#1a1a3a';
  const subText = dark ? '#a0a0c0' : '#6a6a9a';
  const emoji = ProductEmojis[product.category] || ProductEmojis.default;
  const stars = Math.round(product.rating?.rate || 4.5);

  return (
    <div style={{ padding: '14px', borderRadius: '12px', background: bg, border: `1px solid ${inCart ? '#00B894' : border}`, transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ textAlign: 'center', fontSize: '32px', padding: '10px', background: dark ? '#0a0a2a' : '#f0f4ff', borderRadius: '8px' }}>{emoji}</div>
      <div style={{ fontWeight: 700, fontSize: '13px', color: text, lineHeight: 1.3 }}>{product.title}</div>
      <div style={{ fontSize: '11px', color: subText, flex: 1, lineHeight: 1.4 }}>{product.description?.slice(0, 60)}…</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '11px', color: '#FDCB6E' }}>{'★'.repeat(stars)}{'☆'.repeat(5 - stars)}</span>
        <span style={{ fontSize: '10px', color: subText }}>({product.rating?.count || 0})</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontWeight: 800, fontSize: '16px', color: '#00B894' }}>${product.price?.toFixed(2)}</span>
        <button
          onClick={() => dispatch({ type: 'ADD', product })}
          style={{
            padding: '5px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: 'none',
            background: inCart ? '#00B89430' : 'linear-gradient(135deg, #6C5CE7, #0984E3)',
            color: inCart ? '#00B894' : '#fff', transition: 'all 0.2s'
          }}
        >
          {inCart ? '✓ Added' : '+ Cart'}
        </button>
      </div>
    </div>
  );
}

function CartPanel({ onClose }) {
  const { state, dispatch } = useCart();
  const { dark } = useTheme();
  const [checked, setChecked] = useState(false);
  const bg = dark ? '#1a1a3a' : '#f5f5ff';
  const text = dark ? '#f0f0f8' : '#1a1a3a';
  const border = dark ? '#2a2a5a' : '#d0d0f0';

  return (
    <div style={{ position: 'fixed', top: 0, right: 0, width: '300px', height: '100%', background: bg, borderLeft: `1px solid ${border}`, zIndex: 1000, padding: '20px', overflowY: 'auto', boxShadow: '-8px 0 32px rgba(0,0,0,0.3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, color: text, fontSize: '16px' }}>🛒 Cart ({state.items.length})</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: text, cursor: 'pointer', fontSize: '18px' }}>✕</button>
      </div>
      {state.items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#555' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛍️</div>
          <p style={{ margin: 0, fontSize: '13px' }}>Cart masih kosong</p>
        </div>
      ) : (
        <>
          {state.items.map(item => (
            <div key={item.id} style={{ padding: '10px', borderRadius: '10px', background: dark ? '#252550' : '#fff', border: `1px solid ${border}`, marginBottom: '8px' }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: text, marginBottom: '8px' }}>{item.title}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <button onClick={() => dispatch({ type: 'DECREMENT', id: item.id })} style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#2a2a5a', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800 }}>−</button>
                <span style={{ fontSize: '13px', fontWeight: 700, color: text, flex: 1, textAlign: 'center' }}>{item.qty}</span>
                <button onClick={() => dispatch({ type: 'INCREMENT', id: item.id })} style={{ width: '22px', height: '22px', borderRadius: '5px', background: '#0984E3', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800 }}>+</button>
                <span style={{ fontSize: '12px', fontWeight: 700, color: '#00B894', minWidth: '56px', textAlign: 'right' }}>${(item.price * item.qty).toFixed(2)}</span>
                <button onClick={() => dispatch({ type: 'REMOVE', id: item.id })} style={{ background: 'none', border: 'none', color: '#E17055', cursor: 'pointer', fontSize: '12px' }}>✕</button>
              </div>
            </div>
          ))}
          <div style={{ borderTop: `1px solid ${border}`, paddingTop: '12px', marginTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '16px', color: text, marginBottom: '14px' }}>
              <span>Total</span>
              <span style={{ color: '#00B894' }}>${state.total.toFixed(2)}</span>
            </div>
            {!checked ? (
              <button onClick={() => setChecked(true)} style={{ width: '100%', padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, #00B894, #00CEC9)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                ✅ Checkout
              </button>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px', background: '#00B89420', borderRadius: '10px', border: '1px solid #00B894' }}>
                <div style={{ fontSize: '28px', marginBottom: '6px' }}>🎉</div>
                <div style={{ fontWeight: 700, color: '#00B894', marginBottom: '8px' }}>Order Successful!</div>
                <button onClick={() => { dispatch({ type: 'CLEAR' }); setChecked(false); onClose(); }} style={{ padding: '7px 16px', borderRadius: '8px', background: '#6C5CE7', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px' }}>↩ Belanja Lagi</button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function StoreContent() {
  const { dark, toggle } = useTheme();
  const { state } = useCart();
  const { products, loading } = useProducts();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('semua');
  const [sort, setSort] = useState('default');
  const [cartOpen, setCartOpen] = useState(false);
  const [wishlist, setWishlist] = useLocalStorage('c8_wishlist', []);
  const searchRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current++;

  const bg = dark ? '#0a0a1a' : '#f0f4ff';
  const bg2 = dark ? '#16163a' : '#ffffff';
  const text = dark ? '#f0f0f8' : '#1a1a3a';
  const subText = dark ? '#a0a0c0' : '#6a6a9a';
  const border = dark ? '#2a2a5a' : '#d0d0f0';

  // Auto-focus search
  useEffect(() => { searchRef.current?.focus(); }, []);

  // useMemo: filtered + sorted
  const filtered = useMemo(() => {
    let res = products;
    if (search) res = res.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'semua') res = res.filter(p => p.category?.toLowerCase().includes(category));
    switch (sort) {
      case 'price-asc': return [...res].sort((a, b) => a.price - b.price);
      case 'price-desc': return [...res].sort((a, b) => b.price - a.price);
      case 'rating': return [...res].sort((a, b) => (b.rating?.rate || 0) - (a.rating?.rate || 0));
      default: return res;
    }
  }, [products, search, category, sort]);

  // useCallback: stable handlers
  const handleSearch = useCallback(e => setSearch(e.target.value), []);
  const toggleWishlist = useCallback(id => setWishlist(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]), [setWishlist]);

  const totalItems = state.items.reduce((s, i) => s + i.qty, 0);
  const isInCart = useCallback(id => state.items.some(i => i.id === id), [state.items]);

  const categories = ['semua', 'courses', 'merch', 'electronics', 'jewelery'];

  return (
    <div style={{ minHeight: '100%', background: bg, borderRadius: '16px', padding: '20px', transition: 'all 0.3s', position: 'relative' }}>
      {cartOpen && <CartPanel onClose={() => setCartOpen(false)} />}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h2 style={{ margin: 0, color: text, fontSize: '20px', fontWeight: 800 }}>🏆 Mini E-Commerce</h2>
          <p style={{ color: subText, fontSize: '11px', margin: '2px 0 0' }}>Final Boss — All Hooks Combined | 🔄 Renders: {renderCount.current}</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={toggle} style={{ padding: '7px 14px', borderRadius: '8px', background: dark ? '#FDCB6E20' : '#1a1a3a20', border: `1px solid ${border}`, color: text, cursor: 'pointer', fontSize: '13px', fontWeight: 600 }}>
            {dark ? '☀️ Light' : '🌙 Dark'}
          </button>
          <button onClick={() => setCartOpen(o => !o)} style={{ position: 'relative', padding: '7px 14px', borderRadius: '8px', background: 'linear-gradient(135deg, #6C5CE7, #0984E3)', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: 700 }}>
            🛒 ${state.total.toFixed(2)}
            {totalItems > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-6px', background: '#E84393', borderRadius: '50%', width: '18px', height: '18px', fontSize: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>{totalItems}</span>
            )}
          </button>
        </div>
      </div>

      {/* Hooks Used */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {['useState', 'useEffect', 'useContext', 'useReducer', 'useMemo', 'useCallback', 'useRef', 'Custom Hooks'].map(h => (
          <span key={h} style={{ padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 600, background: '#6C5CE720', border: '1px solid #6C5CE730', color: '#A29BFE' }}>{h}</span>
        ))}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
        <input ref={searchRef} value={search} onChange={handleSearch} placeholder="🔍 Cari produk…"
          style={{ flex: 1, minWidth: '140px', padding: '8px 12px', borderRadius: '8px', background: bg2, border: `1px solid ${border}`, color: text, fontSize: '13px', outline: 'none' }} />
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '8px 10px', borderRadius: '8px', background: bg2, border: `1px solid ${border}`, color: text, fontSize: '12px' }}>
          <option value="default">Sort: Default</option>
          <option value="price-asc">Harga ↑</option>
          <option value="price-desc">Harga ↓</option>
          <option value="rating">Rating ↓</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '14px' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{
            padding: '4px 12px', borderRadius: '16px', fontSize: '11px', fontWeight: 600, cursor: 'pointer', textTransform: 'capitalize',
            background: category === cat ? '#6C5CE7' : 'transparent', border: `1px solid ${category === cat ? '#6C5CE7' : border}`,
            color: category === cat ? '#fff' : subText, transition: 'all 0.2s'
          }}>{cat}</button>
        ))}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px' }}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} style={{ height: '220px', borderRadius: '12px', background: bg2, border: `1px solid ${border}`, animation: 'pulse 1.5s ease-in-out infinite' }}>
              <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>🔍</div>
          <p style={{ margin: 0, fontSize: '13px' }}>Tidak ada produk yang cocok</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))', gap: '12px' }}>
          {filtered.map(product => (
            <ProductCard key={product.id} product={product} inCart={isInCart(product.id)} />
          ))}
        </div>
      )}

      {/* Wishlist */}
      {wishlist.length > 0 && (
        <div style={{ marginTop: '16px', padding: '12px', borderRadius: '10px', background: '#E8439320', border: '1px solid #E8439340' }}>
          <span style={{ fontSize: '12px', color: '#E84393', fontWeight: 700 }}>❤️ Wishlist: {wishlist.length} items (tersimpan di localStorage)</span>
        </div>
      )}

      <p style={{ fontSize: '11px', color: subText, textAlign: 'center', marginTop: '16px' }}>
        File: <code style={{ background: dark ? '#1e1e3f' : '#e8e8ff', padding: '2px 6px', borderRadius: '4px', color: '#6C5CE7' }}>src/challenges/Challenge8_finalBoss.jsx</code>
      </p>
    </div>
  );
}

export default function Challenge8_finalBoss() {
  return (
    <ThemeProvider>
      <CartProvider>
        <StoreContent />
      </CartProvider>
    </ThemeProvider>
  );
}
