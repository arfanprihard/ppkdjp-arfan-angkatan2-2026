import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 🛠️ TANTANGAN 7: Custom Hooks Library
 *
 * Custom Hooks yang diimplementasikan:
 * 1. useLocalStorage(key, initialValue) — sync state ke localStorage
 * 2. useFetch(url) — return { data, loading, error } dengan cleanup
 * 3. useDebounce(value, delay) — debounce sebuah nilai
 *
 * Demo page menunjukkan semua hooks bekerja secara interaktif.
 */

// ─── 1. useLocalStorage ───
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? JSON.parse(saved) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // localStorage might be unavailable
    }
  }, [key, value]);

  const remove = useCallback(() => {
    localStorage.removeItem(key);
    setValue(initialValue);
  }, [key, initialValue]);

  return [value, setValue, remove];
}

// ─── 2. useFetch ───
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (!cancelled) { setData(json); setLoading(false); }
      })
      .catch(err => {
        if (!cancelled) { setError(err.message); setLoading(false); }
      });

    return () => { cancelled = true; };
  }, [url]);

  return { data, loading, error };
}

// ─── 3. useDebounce ───
function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}

// ─── Demo: useLocalStorage ───
function LocalStorageDemo() {
  const [name, setName, removeName] = useLocalStorage('c7_name', '');
  const [color, setColor] = useLocalStorage('c7_color', '#6C5CE7');
  const [count, setCount] = useLocalStorage('c7_count', 0);

  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: '#1a1a3a', border: '1px solid #2a2a5a', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px' }}>💾</span>
        <h4 style={{ margin: 0, fontSize: '15px', color: '#f0f0f8' }}>useLocalStorage</h4>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#6C5CE7', background: '#6C5CE720', padding: '2px 8px', borderRadius: '8px', border: '1px solid #6C5CE730' }}>Hook #1</span>
      </div>
      <p style={{ color: '#a0a0c0', fontSize: '12px', margin: '0 0 12px' }}>
        Data disimpan ke localStorage — refresh halaman, nilai tetap ada! 💡
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Nama kamu…"
            style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: '#252550', border: '1px solid #2a2a5a', color: '#f0f0f8', fontSize: '13px', outline: 'none' }} />
          <button onClick={removeName} style={{ padding: '8px 12px', borderRadius: '8px', background: 'transparent', border: '1px solid #E17055', color: '#E17055', cursor: 'pointer', fontSize: '12px' }}>✕ Reset</button>
        </div>
        {name && <div style={{ fontSize: '13px', color: '#a0a0c0' }}>Halo, <strong style={{ color: color || '#f0f0f8' }}>{name}</strong>! 👋</div>}

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '12px', color: '#a0a0c0' }}>Warna favorit:</label>
          <input type="color" value={color} onChange={e => setColor(e.target.value)} style={{ width: '36px', height: '28px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: 'transparent' }} />
          <span style={{ width: '16px', height: '16px', borderRadius: '50%', background: color, display: 'inline-block', border: '2px solid #2a2a5a' }} />
          <span style={{ fontSize: '12px', color: color }}>{color}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '12px', color: '#a0a0c0' }}>Counter persisten:</label>
          <button onClick={() => setCount(c => c - 1)} style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#2a2a5a', border: 'none', color: '#f0f0f8', cursor: 'pointer', fontWeight: 800 }}>−</button>
          <span style={{ fontWeight: 800, fontSize: '16px', color: '#6C5CE7', minWidth: '30px', textAlign: 'center' }}>{count}</span>
          <button onClick={() => setCount(c => c + 1)} style={{ width: '26px', height: '26px', borderRadius: '6px', background: '#6C5CE7', border: 'none', color: '#fff', cursor: 'pointer', fontWeight: 800 }}>+</button>
        </div>
      </div>
    </div>
  );
}

// ─── Demo: useFetch ───
function FetchDemo() {
  const [userId, setUserId] = useState(1);
  const url = `https://jsonplaceholder.typicode.com/users/${userId}`;
  const { data, loading, error } = useFetch(url);

  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: '#1a1a3a', border: '1px solid #2a2a5a', marginBottom: '14px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px' }}>🌐</span>
        <h4 style={{ margin: 0, fontSize: '15px', color: '#f0f0f8' }}>useFetch</h4>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#00B894', background: '#00B89420', padding: '2px 8px', borderRadius: '8px', border: '1px solid #00B89430' }}>Hook #2</span>
      </div>
      <p style={{ color: '#a0a0c0', fontSize: '12px', margin: '0 0 12px' }}>
        Fetch data dari JSONPlaceholder API dengan <code style={{ color: '#6C5CE7' }}>cancelled flag</code> untuk mencegah race condition.
      </p>

      <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '12px', color: '#a0a0c0', lineHeight: '26px' }}>User ID:</span>
        {[1, 2, 3, 4, 5].map(id => (
          <button key={id} onClick={() => setUserId(id)} style={{
            width: '28px', height: '28px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '12px',
            background: userId === id ? '#00B894' : '#252550', color: '#fff', transition: 'all 0.2s'
          }}>{id}</button>
        ))}
        <button onClick={() => setUserId(Math.floor(Math.random() * 10) + 1)} style={{ padding: '4px 10px', borderRadius: '8px', background: '#0984E3', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>🎲 Random</button>
      </div>

      <div style={{ minHeight: '80px', padding: '12px', borderRadius: '10px', background: '#0a0a2a', border: '1px solid #1a1a4a' }}>
        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00B894', fontSize: '13px' }}>
            <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⏳</span>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            Fetching user #{userId}…
          </div>
        )}
        {error && <div style={{ color: '#E17055', fontSize: '12px' }}>❌ Error: {error}</div>}
        {data && !loading && (
          <div style={{ fontSize: '12px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
            {[
              ['👤 Nama', data.name],
              ['🏷️ Username', `@${data.username}`],
              ['✉️ Email', data.email],
              ['🌐 Website', data.website],
              ['🏢 Perusahaan', data.company?.name],
              ['📍 Kota', data.address?.city],
            ].map(([label, val]) => (
              <div key={label}>
                <span style={{ color: '#555' }}>{label}: </span>
                <span style={{ color: '#f0f0f8' }}>{val}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Demo: useDebounce ───
function DebounceDemo() {
  const [raw, setRaw] = useState('');
  const debounced = useDebounce(raw, 500);
  const [log, setLog] = useState([]);
  const logRef = useRef([]);

  useEffect(() => {
    if (!debounced) return;
    const entry = { text: debounced, time: new Date().toLocaleTimeString() };
    logRef.current = [entry, ...logRef.current].slice(0, 5);
    setLog([...logRef.current]);
  }, [debounced]);

  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: '#1a1a3a', border: '1px solid #2a2a5a' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <span style={{ fontSize: '20px' }}>⏰</span>
        <h4 style={{ margin: 0, fontSize: '15px', color: '#f0f0f8' }}>useDebounce</h4>
        <span style={{ marginLeft: 'auto', fontSize: '11px', color: '#FDCB6E', background: '#FDCB6E20', padding: '2px 8px', borderRadius: '8px', border: '1px solid #FDCB6E30' }}>Hook #3</span>
      </div>
      <p style={{ color: '#a0a0c0', fontSize: '12px', margin: '0 0 12px' }}>
        Ketik cepat, tapi "debounced value" hanya update setelah kamu berhenti 500ms.
      </p>

      <input value={raw} onChange={e => setRaw(e.target.value)} placeholder="Ketik sesuatu dengan cepat…"
        style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', background: '#252550', border: '1px solid #2a2a5a', color: '#f0f0f8', fontSize: '13px', outline: 'none', boxSizing: 'border-box', marginBottom: '10px' }} />

      <div style={{ display: 'flex', gap: '12px', marginBottom: '10px' }}>
        <div style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: '#252550', border: '1px solid #2a2a5a' }}>
          <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Nilai Asli</div>
          <div style={{ fontSize: '13px', color: '#E17055', fontWeight: 600, minHeight: '16px' }}>{raw || '—'}</div>
        </div>
        <div style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', background: '#252550', border: '1px solid #FDCB6E40' }}>
          <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '4px' }}>Debounced (500ms)</div>
          <div style={{ fontSize: '13px', color: '#FDCB6E', fontWeight: 600, minHeight: '16px' }}>{debounced || '—'}</div>
        </div>
      </div>

      {log.length > 0 && (
        <div>
          <div style={{ fontSize: '10px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Log Pencarian (5 terakhir)</div>
          {log.map((entry, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 8px', borderRadius: '6px', background: i === 0 ? '#FDCB6E15' : 'transparent', border: i === 0 ? '1px solid #FDCB6E30' : '1px solid transparent', marginBottom: '2px', fontSize: '12px' }}>
              <span style={{ color: '#f0f0f8' }}>{entry.text}</span>
              <span style={{ color: '#555' }}>{entry.time}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Challenge7_customHooks() {
  return (
    <div style={{ padding: '24px', maxWidth: '620px', margin: '0 auto', color: '#f0f0f8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ fontSize: '24px' }}>🛠️</span>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Custom Hooks Library</h2>
      </div>
      <p style={{ color: '#a0a0c0', fontSize: '12px', marginBottom: '20px' }}>
        File: <code style={{ background: '#1e1e3f', padding: '2px 6px', borderRadius: '4px' }}>src/challenges/Challenge7_customHooks.jsx</code>
      </p>
      <LocalStorageDemo />
      <FetchDemo />
      <DebounceDemo />
    </div>
  );
}
