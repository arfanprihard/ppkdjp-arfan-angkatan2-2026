import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 🌐 TANTANGAN 2: useEffect - Data Fetching Dashboard
 *
 * Fitur:
 * - Fetch data dari JSONPlaceholder API
 * - Loading spinner & skeleton cards
 * - Error handling dengan pesan user-friendly
 * - Auto-refresh setiap 30 detik (countdown visible)
 * - Tombol manual refresh
 * - Cleanup saat unmount (cancelled flag)
 * - Search & filter berdasarkan nama user
 * - Pagination
 */

function SkeletonCard() {
  return (
    <div style={{
      padding: '16px', borderRadius: '12px',
      background: '#1a1a3a', border: '1px solid #2a2a5a',
      animation: 'pulse 1.5s ease-in-out infinite'
    }}>
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
      <div style={{ height: '14px', background: '#2a2a6a', borderRadius: '6px', width: '70%', marginBottom: '8px' }} />
      <div style={{ height: '11px', background: '#2a2a6a', borderRadius: '6px', width: '50%', marginBottom: '6px' }} />
      <div style={{ height: '11px', background: '#2a2a6a', borderRadius: '6px', width: '60%' }} />
    </div>
  );
}

function UserCard({ user }) {
  const colors = ['#6C5CE7', '#00B894', '#E17055', '#0984E3', '#FDCB6E', '#E84393', '#00CEC9', '#A29BFE', '#FF6B6B', '#74B9FF'];
  const color = colors[user.id % colors.length];
  const initials = user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div style={{
      padding: '16px', borderRadius: '12px',
      background: '#16163a', border: `1px solid ${color}30`,
      transition: 'transform 0.2s, border-color 0.2s',
      cursor: 'default'
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = `${color}80`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = `${color}30`; }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
          background: `linear-gradient(135deg, ${color}, ${color}88)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '14px', color: '#fff'
        }}>{initials}</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: '#f0f0f8' }}>{user.name}</div>
          <div style={{ fontSize: '11px', color: color }}>@{user.username}</div>
        </div>
      </div>
      <div style={{ fontSize: '12px', color: '#a0a0c0', display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <span>✉️ {user.email}</span>
        <span>🌐 {user.website}</span>
        <span>🏢 {user.company?.name}</span>
        <span>📍 {user.address?.city}</span>
      </div>
    </div>
  );
}

export default function Challenge2_useEffect() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [countdown, setCountdown] = useState(30);
  const [fetchCount, setFetchCount] = useState(0);
  const [page, setPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const fetchUsers = useCallback(() => {
    setLoading(true);
    setError(null);
    setCountdown(30);

    let cancelled = false;

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return res.json();
      })
      .then(data => {
        if (!cancelled) {
          setUsers(data);
          setFetchCount(c => c + 1);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message || 'Gagal mengambil data. Periksa koneksi internet kamu.');
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, []);

  // Initial fetch + auto-refresh
  useEffect(() => {
    const cleanup = fetchUsers();
    return cleanup;
  }, [fetchUsers]);

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          fetchUsers();
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchUsers]);

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  return (
    <div style={{ padding: '24px', maxWidth: '700px', margin: '0 auto', color: '#f0f0f8' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '6px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <span style={{ fontSize: '24px' }}>🌐</span>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Data Fetching Dashboard</h2>
          </div>
          <p style={{ color: '#a0a0c0', fontSize: '12px', margin: 0 }}>
            File: <code style={{ background: '#1e1e3f', padding: '2px 6px', borderRadius: '4px' }}>src/challenges/Challenge2_useEffect.jsx</code>
          </p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <button
            onClick={fetchUsers}
            disabled={loading}
            style={{
              padding: '8px 16px', borderRadius: '10px',
              background: loading ? '#333' : 'linear-gradient(135deg, #00B894, #00CEC9)',
              color: '#fff', fontWeight: 700, fontSize: '13px',
              border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? '⏳ Loading…' : '🔄 Refresh'}
          </button>
          <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
            Auto-refresh: <span style={{ color: countdown <= 5 ? '#E17055' : '#a0a0c0', fontWeight: 700 }}>{countdown}s</span>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px',
        padding: '10px 14px', borderRadius: '10px',
        background: '#1a1a3a', border: '1px solid #2a2a5a',
        fontSize: '12px', color: '#a0a0c0'
      }}>
        <span>📡 Fetch #{fetchCount}</span>
        <span>👥 {users.length} users</span>
        <span>🔍 {filtered.length} sesuai pencarian</span>
        {loading && <span style={{ color: '#00B894', animation: 'pulse 1s infinite' }}>⏳ Fetching…</span>}
        {!loading && !error && fetchCount > 0 && <span style={{ color: '#00B894' }}>✅ Data terbaru</span>}
        {error && <span style={{ color: '#E17055' }}>❌ Error</span>}
      </div>

      {/* Search */}
      <input
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1); }}
        placeholder="🔍 Cari nama, username, atau email…"
        style={{
          width: '100%', padding: '10px 14px', borderRadius: '10px',
          background: '#1e1e3a', border: '1px solid #2a2a5a',
          color: '#f0f0f8', fontSize: '13px', outline: 'none', marginBottom: '16px',
          boxSizing: 'border-box'
        }}
      />

      {/* Error */}
      {error && (
        <div style={{
          padding: '14px 18px', borderRadius: '12px',
          background: '#2a1a1a', border: '1px solid #E1705550',
          color: '#E17055', marginBottom: '16px', fontSize: '13px'
        }}>
          ❌ <strong>Gagal memuat data</strong><br />
          <span style={{ color: '#a0a0c0' }}>{error}</span>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
        {loading
          ? Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)
          : paginated.map(user => <UserCard key={user.id} user={user} />)
        }
      </div>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '16px' }}>
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1}
            style={{ padding: '6px 14px', borderRadius: '8px', background: page === 1 ? '#1a1a3a' : '#6C5CE7', border: 'none', color: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '13px' }}>←</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)}
              style={{ padding: '6px 12px', borderRadius: '8px', background: page === i + 1 ? '#6C5CE7' : 'transparent', border: `1px solid ${page === i + 1 ? '#6C5CE7' : '#2a2a5a'}`, color: '#f0f0f8', cursor: 'pointer', fontSize: '13px' }}>
              {i + 1}
            </button>
          ))}
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages}
            style={{ padding: '6px 14px', borderRadius: '8px', background: page === totalPages ? '#1a1a3a' : '#6C5CE7', border: 'none', color: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '13px' }}>→</button>
        </div>
      )}
    </div>
  );
}
