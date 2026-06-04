import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * ⏱️ TANTANGAN 6: useRef - Stopwatch & Form Manager
 *
 * Fitur:
 * - Stopwatch presisi milidetik: start, pause, reset, lap
 * - Interval ID disimpan di useRef (tidak trigger re-render)
 * - Render counter dengan useRef (tidak trigger re-render)
 * - Form: auto-focus ke input pertama saat mount
 * - Validasi: auto-focus ke field pertama yang error saat submit
 */

function pad(n, len = 2) { return String(Math.floor(n)).padStart(len, '0'); }

function formatTime(ms) {
  const totalSec = ms / 1000;
  const minutes = Math.floor(totalSec / 60);
  const seconds = totalSec % 60;
  const secs = Math.floor(seconds);
  const centis = Math.floor((seconds - secs) * 100);
  return `${pad(minutes)}:${pad(secs)}.${pad(centis)}`;
}

// ─── Stopwatch Section ───
function StopwatchSection() {
  const [elapsed, setElapsed] = useState(0);
  const [running, setRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const intervalRef = useRef(null);
  const startTimeRef = useRef(null);
  const renderCount = useRef(0);
  renderCount.current++;

  const handleStart = () => {
    if (running) return;
    startTimeRef.current = Date.now() - elapsed;
    intervalRef.current = setInterval(() => {
      setElapsed(Date.now() - startTimeRef.current);
    }, 10);
    setRunning(true);
  };

  const handlePause = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
  };

  const handleReset = () => {
    clearInterval(intervalRef.current);
    setRunning(false);
    setElapsed(0);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps(prev => [{ id: prev.length + 1, time: elapsed }, ...prev]);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current); // cleanup saat unmount
  }, []);

  const lapTimes = laps.map((lap, i) => {
    const prev = laps[i + 1];
    const lapTime = prev ? lap.time - prev.time : lap.time;
    return { ...lap, lapTime };
  });

  const bestLap = lapTimes.length > 1 ? Math.min(...lapTimes.map(l => l.lapTime)) : null;
  const worstLap = lapTimes.length > 1 ? Math.max(...lapTimes.map(l => l.lapTime)) : null;

  return (
    <div style={{ padding: '20px', borderRadius: '16px', background: '#16163a', border: '1px solid #2a2a5a', marginBottom: '16px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
        <h3 style={{ margin: 0, fontSize: '16px', color: '#f0f0f8' }}>⏱️ Stopwatch</h3>
        <span style={{ fontSize: '11px', color: '#555', background: '#E1705520', padding: '3px 8px', borderRadius: '8px', border: '1px solid #E1705530' }}>
          🔄 Renders: {renderCount.current}
        </span>
      </div>

      {/* Display */}
      <div style={{
        textAlign: 'center', padding: '20px',
        background: '#0a0a1a', borderRadius: '12px', marginBottom: '16px',
        fontFamily: 'monospace', fontSize: '40px', fontWeight: 800,
        background: 'linear-gradient(135deg, #6C5CE7, #00CEC9)',
        WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        backgroundClip: 'text', letterSpacing: '0.05em'
      }}>
        {formatTime(elapsed)}
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '14px', flexWrap: 'wrap' }}>
        {!running ? (
          <button onClick={handleStart} style={{ padding: '9px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #00B894, #00CEC9)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>▶ Start</button>
        ) : (
          <button onClick={handlePause} style={{ padding: '9px 22px', borderRadius: '10px', background: 'linear-gradient(135deg, #FDCB6E, #E17055)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>⏸ Pause</button>
        )}
        <button onClick={handleLap} disabled={!running} style={{ padding: '9px 22px', borderRadius: '10px', background: running ? 'linear-gradient(135deg, #0984E3, #6C5CE7)' : '#1a1a3a', color: '#fff', fontWeight: 700, border: 'none', cursor: running ? 'pointer' : 'not-allowed', fontSize: '14px' }}>🏁 Lap</button>
        <button onClick={handleReset} style={{ padding: '9px 22px', borderRadius: '10px', background: 'transparent', border: '1px solid #E17055', color: '#E17055', fontWeight: 700, cursor: 'pointer', fontSize: '14px' }}>↺ Reset</button>
      </div>

      {/* Laps */}
      {lapTimes.length > 0 && (
        <div style={{ maxHeight: '160px', overflowY: 'auto' }}>
          <div style={{ fontSize: '11px', color: '#555', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>Lap Times</div>
          {lapTimes.map(lap => (
            <div key={lap.id} style={{
              display: 'flex', justifyContent: 'space-between', padding: '6px 10px',
              borderRadius: '6px', marginBottom: '3px', fontSize: '13px',
              background: lap.lapTime === bestLap ? '#00B89420' : lap.lapTime === worstLap ? '#E1705520' : '#1a1a3a',
              border: `1px solid ${lap.lapTime === bestLap ? '#00B894' : lap.lapTime === worstLap ? '#E17055' : '#2a2a5a'}`
            }}>
              <span style={{ color: '#a0a0c0' }}>Lap {lap.id}</span>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: lap.lapTime === bestLap ? '#00B894' : lap.lapTime === worstLap ? '#E17055' : '#f0f0f8' }}>
                {formatTime(lap.lapTime)}
                {lap.lapTime === bestLap && ' 🏆'}
                {lap.lapTime === worstLap && ' 😅'}
              </span>
              <span style={{ fontFamily: 'monospace', color: '#555' }}>{formatTime(lap.time)}</span>
            </div>
          ))}
        </div>
      )}

      <p style={{ fontSize: '11px', color: '#333', textAlign: 'center', margin: '10px 0 0' }}>
        💡 Interval ID disimpan di <code style={{ color: '#6C5CE7' }}>useRef</code> — tidak trigger re-render!
      </p>
    </div>
  );
}

// ─── Form Section ───
function FormSection() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const messageRef = useRef(null);
  const refs = { name: nameRef, email: emailRef, message: messageRef };

  // Auto-focus ke input pertama saat mount
  useEffect(() => {
    nameRef.current?.focus();
  }, []);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Nama harus diisi';
    if (!form.email.includes('@')) errs.email = 'Email tidak valid';
    if (form.message.length < 10) errs.message = 'Pesan minimal 10 karakter';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    // Focus ke field pertama yang error
    const errorKeys = Object.keys(errs);
    if (errorKeys.length > 0) {
      refs[errorKeys[0]].current?.focus();
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div style={{ padding: '20px', borderRadius: '16px', background: '#16163a', border: '1px solid #2a2a5a', textAlign: 'center' }}>
        <div style={{ fontSize: '40px', marginBottom: '12px' }}>🎉</div>
        <h3 style={{ color: '#00B894', margin: '0 0 8px' }}>Form berhasil dikirim!</h3>
        <p style={{ color: '#a0a0c0', fontSize: '13px', margin: '0 0 14px' }}>Nama: {form.name} | Email: {form.email}</p>
        <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', message: '' }); setErrors({}); }} style={{ padding: '8px 18px', borderRadius: '8px', background: '#6C5CE7', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>↺ Isi Lagi</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', borderRadius: '16px', background: '#16163a', border: '1px solid #2a2a5a' }}>
      <h3 style={{ margin: '0 0 6px', fontSize: '16px', color: '#f0f0f8' }}>📋 Form Manager</h3>
      <p style={{ color: '#a0a0c0', fontSize: '12px', margin: '0 0 16px' }}>Auto-focus ke input pertama saat mount. Validasi akan focus ke field yang error.</p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {[
          { key: 'name', label: 'Nama Lengkap', ref: nameRef, placeholder: 'Cth: Arfan Prihard', type: 'text' },
          { key: 'email', label: 'Email', ref: emailRef, placeholder: 'Cth: arfan@email.com', type: 'email' },
        ].map(({ key, label, ref, placeholder, type }) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: '12px', color: '#a0a0c0', marginBottom: '5px', fontWeight: 600 }}>{label}</label>
            <input
              ref={ref}
              type={type}
              value={form[key]}
              onChange={e => setForm(prev => ({ ...prev, [key]: e.target.value }))}
              placeholder={placeholder}
              style={{
                width: '100%', padding: '9px 12px', borderRadius: '8px',
                background: '#1a1a3a', fontSize: '13px', boxSizing: 'border-box',
                border: `1px solid ${errors[key] ? '#E17055' : '#2a2a5a'}`,
                color: '#f0f0f8', outline: errors[key] ? '2px solid #E1705540' : 'none',
                transition: 'border-color 0.2s'
              }}
            />
            {errors[key] && <div style={{ color: '#E17055', fontSize: '11px', marginTop: '4px' }}>⚠️ {errors[key]}</div>}
          </div>
        ))}
        <div>
          <label style={{ display: 'block', fontSize: '12px', color: '#a0a0c0', marginBottom: '5px', fontWeight: 600 }}>Pesan</label>
          <textarea
            ref={messageRef}
            value={form.message}
            onChange={e => setForm(prev => ({ ...prev, message: e.target.value }))}
            placeholder="Tulis pesanmu di sini (min. 10 karakter)..."
            rows={3}
            style={{
              width: '100%', padding: '9px 12px', borderRadius: '8px',
              background: '#1a1a3a', fontSize: '13px', boxSizing: 'border-box',
              border: `1px solid ${errors.message ? '#E17055' : '#2a2a5a'}`,
              color: '#f0f0f8', resize: 'vertical', outline: errors.message ? '2px solid #E1705540' : 'none',
              transition: 'border-color 0.2s', fontFamily: 'inherit'
            }}
          />
          {errors.message && <div style={{ color: '#E17055', fontSize: '11px', marginTop: '4px' }}>⚠️ {errors.message}</div>}
        </div>
        <button type="submit" style={{ padding: '10px', borderRadius: '10px', background: 'linear-gradient(135deg, #E84393, #6C5CE7)', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
          📤 Kirim Form
        </button>
      </form>
    </div>
  );
}

export default function Challenge6_useRef() {
  return (
    <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', color: '#f0f0f8' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
        <span style={{ fontSize: '24px' }}>⏱️</span>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800 }}>Stopwatch & Form Manager</h2>
      </div>
      <p style={{ color: '#a0a0c0', fontSize: '12px', marginBottom: '20px' }}>
        File: <code style={{ background: '#1e1e3f', padding: '2px 6px', borderRadius: '4px' }}>src/challenges/Challenge6_useRef.jsx</code>
      </p>
      <StopwatchSection />
      <FormSection />
    </div>
  );
}
