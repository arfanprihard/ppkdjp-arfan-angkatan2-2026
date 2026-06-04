import React, { useState, useMemo, useCallback, useRef, memo } from 'react';

/**
 * 📊 TANTANGAN 5: useMemo & useCallback - Performance-Optimized List
 *
 * Fitur:
 * - Generate 1000+ item dummy
 * - Search & filter yang responsif (useMemo)
 * - Sorting dengan useMemo
 * - Event handlers dengan useCallback
 * - Child components dengan React.memo
 * - Render counter dengan useRef sebagai bukti optimasi
 */

// ─── Generate 1000 dummy items ───
function generateItems(count = 1000) {
  const categories = ['Frontend', 'Backend', 'DevOps', 'Mobile', 'AI/ML', 'Security'];
  const levels = ['Junior', 'Mid', 'Senior', 'Lead'];
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Developer ${String(i + 1).padStart(4, '0')}`,
    category: categories[i % categories.length],
    level: levels[i % levels.length],
    score: Math.floor(Math.random() * 100) + 1,
    joined: 2020 + (i % 5),
  }));
}

const ALL_ITEMS = generateItems(1000);
const CATEGORIES = ['Semua', 'Frontend', 'Backend', 'DevOps', 'Mobile', 'AI/ML', 'Security'];
const SORTS = ['Default', 'Nama A-Z', 'Nama Z-A', 'Skor ↑', 'Skor ↓'];
const LEVELS = ['Semua', 'Junior', 'Mid', 'Senior', 'Lead'];

// ─── Memoized child component ───
const ItemRow = memo(function ItemRow({ item, onSelect, selected }) {
  const renderCount = useRef(0);
  renderCount.current++;

  const levelColors = { Junior: '#00B894', Mid: '#0984E3', Senior: '#FDCB6E', Lead: '#E84393' };
  const catColors = { Frontend: '#6C5CE7', Backend: '#E17055', DevOps: '#00CEC9', Mobile: '#A29BFE', 'AI/ML': '#FDCB6E', Security: '#E84393' };

  return (
    <div
      onClick={() => onSelect(item.id)}
      style={{
        display: 'flex', alignItems: 'center', gap: '10px',
        padding: '8px 12px', borderRadius: '8px',
        background: selected ? '#1a1a4a' : '#14142e',
        border: `1px solid ${selected ? '#6C5CE7' : '#1e1e3a'}`,
        cursor: 'pointer', transition: 'all 0.15s', fontSize: '12px'
      }}
    >
      <span style={{ width: '40px', color: '#555', fontFamily: 'monospace' }}>#{item.id}</span>
      <span style={{ flex: 1, color: '#f0f0f8', fontWeight: 500 }}>{item.name}</span>
      <span style={{ padding: '2px 8px', borderRadius: '12px', background: `${catColors[item.category]}20`, color: catColors[item.category], fontSize: '11px', fontWeight: 600, minWidth: '64px', textAlign: 'center' }}>{item.category}</span>
      <span style={{ padding: '2px 8px', borderRadius: '12px', background: `${levelColors[item.level]}20`, color: levelColors[item.level], fontSize: '11px', fontWeight: 600, minWidth: '48px', textAlign: 'center' }}>{item.level}</span>
      <span style={{ width: '38px', textAlign: 'right', fontWeight: 700, color: item.score >= 80 ? '#00B894' : item.score >= 50 ? '#FDCB6E' : '#E17055' }}>{item.score}</span>
      <span style={{ width: '32px', textAlign: 'right', fontSize: '10px', color: '#333' }}>r:{renderCount.current}</span>
    </div>
  );
});

export default function Challenge5_useMemo_useCallback() {
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('Default');
  const [category, setCategory] = useState('Semua');
  const [level, setLevel] = useState('Semua');
  const [selected, setSelected] = useState(null);
  const [page, setPage] = useState(1);
  const PER_PAGE = 20;
  const parentRenderCount = useRef(0);
  parentRenderCount.current++;

  // ─── useMemo: filtered + sorted list ───
  const processedItems = useMemo(() => {
    let result = ALL_ITEMS;
    if (search) result = result.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));
    if (category !== 'Semua') result = result.filter(i => i.category === category);
    if (level !== 'Semua') result = result.filter(i => i.level === level);
    switch (sort) {
      case 'Nama A-Z': result = [...result].sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'Nama Z-A': result = [...result].sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'Skor ↑': result = [...result].sort((a, b) => a.score - b.score); break;
      case 'Skor ↓': result = [...result].sort((a, b) => b.score - a.score); break;
      default: break;
    }
    return result;
  }, [search, category, level, sort]);

  // ─── useMemo: stats ───
  const stats = useMemo(() => ({
    total: processedItems.length,
    avgScore: processedItems.length ? Math.round(processedItems.reduce((s, i) => s + i.score, 0) / processedItems.length) : 0,
  }), [processedItems]);

  const totalPages = Math.ceil(processedItems.length / PER_PAGE);
  const paginated = useMemo(() => processedItems.slice((page - 1) * PER_PAGE, page * PER_PAGE), [processedItems, page]);

  // ─── useCallback: stable event handlers ───
  const handleSearch = useCallback((e) => { setSearch(e.target.value); setPage(1); }, []);
  const handleSelect = useCallback((id) => setSelected(prev => prev === id ? null : id), []);

  return (
    <div style={{ padding: '24px', maxWidth: '760px', margin: '0 auto', color: '#f0f0f8' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ fontSize: '24px' }}>📊</span>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Performance-Optimized List</h2>
      </div>
      <p style={{ color: '#a0a0c0', fontSize: '12px', marginBottom: '16px' }}>
        File: <code style={{ background: '#1e1e3f', padding: '2px 6px', borderRadius: '4px' }}>src/challenges/Challenge5_useMemo_useCallback.jsx</code>
      </p>

      {/* Render counter badge */}
      <div style={{
        display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px'
      }}>
        {[
          { label: '🔄 Parent Renders', value: parentRenderCount.current, color: '#E17055' },
          { label: '📋 Items Ditampilkan', value: `${stats.total} / 1000`, color: '#6C5CE7' },
          { label: '📈 Rata-rata Skor', value: stats.avgScore, color: '#00B894' },
        ].map(s => (
          <div key={s.label} style={{
            padding: '8px 14px', borderRadius: '10px',
            background: `${s.color}15`, border: `1px solid ${s.color}40`,
            fontSize: '12px'
          }}>
            {s.label}: <strong style={{ color: s.color }}>{s.value}</strong>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div style={{ padding: '8px 14px', borderRadius: '8px', background: '#0984E315', border: '1px solid #0984E330', fontSize: '11px', color: '#74B9FF', marginBottom: '14px' }}>
        💡 <strong>Cara baca:</strong> Angka kecil "r:N" di kanan setiap baris = berapa kali row itu render. Dengan <code>React.memo</code>, row yang tidak berubah prop-nya tidak akan re-render!
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <input value={search} onChange={handleSearch} placeholder="🔍 Cari developer…"
          style={{ flex: 1, minWidth: '160px', padding: '8px 12px', borderRadius: '8px', background: '#1e1e3a', border: '1px solid #2a2a5a', color: '#f0f0f8', fontSize: '12px', outline: 'none' }} />
        <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e1e3a', border: '1px solid #2a2a5a', color: '#f0f0f8', fontSize: '12px' }}>
          {CATEGORIES.map(c => <option key={c}>{c}</option>)}
        </select>
        <select value={level} onChange={e => { setLevel(e.target.value); setPage(1); }}
          style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e1e3a', border: '1px solid #2a2a5a', color: '#f0f0f8', fontSize: '12px' }}>
          {LEVELS.map(l => <option key={l}>{l}</option>)}
        </select>
        <select value={sort} onChange={e => setSort(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '8px', background: '#1e1e3a', border: '1px solid #2a2a5a', color: '#f0f0f8', fontSize: '12px' }}>
          {SORTS.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Table Header */}
      <div style={{ display: 'flex', gap: '10px', padding: '6px 12px', fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>
        <span style={{ width: '40px' }}>ID</span>
        <span style={{ flex: 1 }}>Nama</span>
        <span style={{ minWidth: '64px', textAlign: 'center' }}>Kategori</span>
        <span style={{ minWidth: '48px', textAlign: 'center' }}>Level</span>
        <span style={{ width: '38px', textAlign: 'right' }}>Skor</span>
        <span style={{ width: '32px', textAlign: 'right' }}>Rdr</span>
      </div>

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginBottom: '12px', maxHeight: '380px', overflowY: 'auto' }}>
        {paginated.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: '#555', fontSize: '13px' }}>🔍 Tidak ada item yang cocok</div>
        )}
        {paginated.map(item => (
          <ItemRow key={item.id} item={item} onSelect={handleSelect} selected={selected === item.id} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '6px' }}>
          <button onClick={() => setPage(1)} disabled={page === 1} style={{ padding: '5px 10px', borderRadius: '6px', background: page === 1 ? '#1a1a3a' : '#6C5CE7', border: 'none', color: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '12px' }}>«</button>
          <button onClick={() => setPage(p => Math.max(p - 1, 1))} disabled={page === 1} style={{ padding: '5px 10px', borderRadius: '6px', background: page === 1 ? '#1a1a3a' : '#6C5CE7', border: 'none', color: '#fff', cursor: page === 1 ? 'not-allowed' : 'pointer', fontSize: '12px' }}>‹</button>
          <span style={{ fontSize: '12px', color: '#a0a0c0', padding: '0 8px' }}>Halaman {page} / {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(p + 1, totalPages))} disabled={page === totalPages} style={{ padding: '5px 10px', borderRadius: '6px', background: page === totalPages ? '#1a1a3a' : '#6C5CE7', border: 'none', color: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '12px' }}>›</button>
          <button onClick={() => setPage(totalPages)} disabled={page === totalPages} style={{ padding: '5px 10px', borderRadius: '6px', background: page === totalPages ? '#1a1a3a' : '#6C5CE7', border: 'none', color: '#fff', cursor: page === totalPages ? 'not-allowed' : 'pointer', fontSize: '12px' }}>»</button>
        </div>
      )}
    </div>
  );
}
