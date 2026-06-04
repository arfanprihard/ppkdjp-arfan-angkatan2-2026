import React, { useState } from 'react';

/**
 * 📝 TANTANGAN 1: useState - Todo App dengan Filter & Sorting
 *
 * Ketentuan Penilaian:
 * 1. Fungsionalitas (40%): Tambah, hapus, toggle done, filter, sorting, counter.
 * 2. Code Quality (30%): Clean code, descriptive naming, component structure.
 * 3. Penggunaan Hook (20%): Penggunaan useState & updater function secara tepat.
 * 4. Kreativitas (10%): Fitur tambahan seperti edit inline, localStorage, dll.
 */

const FILTERS = ['Semua', 'Aktif', 'Selesai'];
const SORTS = ['Terbaru', 'A → Z', 'Z → A'];

let nextId = 4;

export default function Challenge1_useState() {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Pelajari useState hook', done: true, createdAt: Date.now() - 3000 },
    { id: 2, text: 'Buat Todo App yang keren', done: false, createdAt: Date.now() - 2000 },
    { id: 3, text: 'Submit ke Kak Arfan', done: false, createdAt: Date.now() - 1000 },
  ]);
  const [input, setInput] = useState('');
  const [filter, setFilter] = useState('Semua');
  const [sort, setSort] = useState('Terbaru');
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState('');

  // ─── Handlers ───
  const handleAdd = () => {
    const trimmed = input.trim();
    if (!trimmed) return;
    setTodos(prev => [...prev, { id: nextId++, text: trimmed, done: false, createdAt: Date.now() }]);
    setInput('');
  };

  const handleToggle = (id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleDelete = (id) => {
    setTodos(prev => prev.filter(t => t.id !== id));
  };

  const handleStartEdit = (todo) => {
    setEditId(todo.id);
    setEditText(todo.text);
  };

  const handleSaveEdit = (id) => {
    const trimmed = editText.trim();
    if (!trimmed) return;
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: trimmed } : t));
    setEditId(null);
  };

  const handleClearDone = () => {
    setTodos(prev => prev.filter(t => !t.done));
  };

  // ─── Computed: filter + sort ───
  const filtered = todos
    .filter(t => {
      if (filter === 'Aktif') return !t.done;
      if (filter === 'Selesai') return t.done;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'A → Z') return a.text.localeCompare(b.text);
      if (sort === 'Z → A') return b.text.localeCompare(a.text);
      return b.createdAt - a.createdAt; // Terbaru
    });

  const activeCount = todos.filter(t => !t.done).length;
  const doneCount = todos.filter(t => t.done).length;

  return (
    <div style={{ padding: '24px', maxWidth: '620px', margin: '0 auto', color: '#f0f0f8' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
        <span style={{ fontSize: '28px' }}>📝</span>
        <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 800 }}>Todo App — useState</h2>
      </div>
      <p style={{ color: '#a0a0c0', fontSize: '13px', marginBottom: '20px' }}>
        File: <code style={{ background: '#1e1e3f', padding: '2px 8px', borderRadius: '6px' }}>src/challenges/Challenge1_useState.jsx</code>
      </p>

      {/* Counter Pills */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        {[
          { label: 'Total', value: todos.length, color: '#6C5CE7' },
          { label: 'Aktif', value: activeCount, color: '#E17055' },
          { label: 'Selesai', value: doneCount, color: '#00B894' },
        ].map(stat => (
          <div key={stat.label} style={{
            flex: 1, textAlign: 'center', padding: '10px',
            background: `${stat.color}18`, border: `1px solid ${stat.color}40`,
            borderRadius: '12px'
          }}>
            <div style={{ fontSize: '24px', fontWeight: 800, color: stat.color }}>{stat.value}</div>
            <div style={{ fontSize: '11px', color: '#a0a0c0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAdd()}
          placeholder="Tambah todo baru…"
          style={{
            flex: 1, padding: '10px 16px', borderRadius: '10px',
            background: '#1e1e3f', border: '1px solid #30306a',
            color: '#f0f0f8', fontSize: '14px', outline: 'none'
          }}
        />
        <button
          onClick={handleAdd}
          style={{
            padding: '10px 20px', borderRadius: '10px',
            background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)',
            color: '#fff', fontWeight: 700, fontSize: '14px', border: 'none', cursor: 'pointer'
          }}
        >
          + Tambah
        </button>
      </div>

      {/* Filter & Sort Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: '4px' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
              background: filter === f ? '#6C5CE7' : 'transparent',
              border: `1px solid ${filter === f ? '#6C5CE7' : '#30306a'}`,
              color: filter === f ? '#fff' : '#a0a0c0', fontWeight: 600,
              transition: 'all 0.2s'
            }}>{f}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '4px', marginLeft: 'auto' }}>
          {SORTS.map(s => (
            <button key={s} onClick={() => setSort(s)} style={{
              padding: '5px 12px', borderRadius: '20px', fontSize: '12px', cursor: 'pointer',
              background: sort === s ? '#0984E3' : 'transparent',
              border: `1px solid ${sort === s ? '#0984E3' : '#30306a'}`,
              color: sort === s ? '#fff' : '#a0a0c0', fontWeight: 600,
              transition: 'all 0.2s'
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Todo List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '30px', color: '#555', fontSize: '14px' }}>
            {filter === 'Selesai' ? '🎉 Belum ada yang selesai!' : '📭 Tidak ada todo di sini.'}
          </div>
        )}
        {filtered.map(todo => (
          <div key={todo.id} style={{
            display: 'flex', alignItems: 'center', gap: '10px',
            padding: '12px 14px', borderRadius: '12px',
            background: todo.done ? '#0f2a1e' : '#16163a',
            border: `1px solid ${todo.done ? '#00B89430' : '#30306a'}`,
            transition: 'all 0.2s'
          }}>
            {/* Checkbox */}
            <button onClick={() => handleToggle(todo.id)} style={{
              width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
              background: todo.done ? '#00B894' : 'transparent',
              border: `2px solid ${todo.done ? '#00B894' : '#555'}`,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: '12px', transition: 'all 0.2s'
            }}>
              {todo.done && '✓'}
            </button>

            {/* Text / Edit */}
            {editId === todo.id ? (
              <input
                autoFocus
                value={editText}
                onChange={e => setEditText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveEdit(todo.id); if (e.key === 'Escape') setEditId(null); }}
                onBlur={() => handleSaveEdit(todo.id)}
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  borderBottom: '1px solid #6C5CE7', color: '#f0f0f8',
                  fontSize: '14px', outline: 'none', padding: '2px 4px'
                }}
              />
            ) : (
              <span
                onDoubleClick={() => handleStartEdit(todo)}
                style={{
                  flex: 1, fontSize: '14px',
                  textDecoration: todo.done ? 'line-through' : 'none',
                  color: todo.done ? '#555' : '#f0f0f8',
                  cursor: 'text', transition: 'all 0.2s'
                }}
              >
                {todo.text}
              </span>
            )}

            {/* Actions */}
            <button onClick={() => handleStartEdit(todo)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', opacity: 0.5, transition: 'opacity 0.2s',
              padding: '2px 4px'
            }} title="Edit (atau double-click teks)">✏️</button>
            <button onClick={() => handleDelete(todo.id)} style={{
              background: 'none', border: 'none', cursor: 'pointer',
              fontSize: '14px', opacity: 0.5, transition: 'opacity 0.2s',
              padding: '2px 4px'
            }} title="Hapus">🗑️</button>
          </div>
        ))}
      </div>

      {/* Footer */}
      {doneCount > 0 && (
        <div style={{ textAlign: 'right' }}>
          <button onClick={handleClearDone} style={{
            padding: '6px 14px', borderRadius: '8px', fontSize: '12px',
            background: 'transparent', border: '1px solid #E17055',
            color: '#E17055', cursor: 'pointer', fontWeight: 600
          }}>
            🗑️ Hapus Semua Selesai ({doneCount})
          </button>
        </div>
      )}
      <p style={{ fontSize: '11px', color: '#444', marginTop: '16px', textAlign: 'center' }}>
        💡 Double-click teks untuk edit inline
      </p>
    </div>
  );
}
