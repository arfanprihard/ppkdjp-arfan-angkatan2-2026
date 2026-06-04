import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * 🎨 TANTANGAN 3: useContext - Theme & Language Switcher
 *
 * Fitur:
 * - ThemeContext: dark / light / sepia mode
 * - LanguageContext: Bahasa Indonesia / English
 * - Custom hooks: useTheme() & useLanguage()
 * - Minimal 3 komponen yang consume context
 * - Persist ke localStorage
 * - CSS variable approach untuk theme
 */

// ─── Contexts ───
const ThemeContext = createContext(null);
const LanguageContext = createContext(null);

// ─── Custom Hooks ───
function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme harus di dalam ThemeProvider');
  return ctx;
}
function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage harus di dalam LanguageProvider');
  return ctx;
}

// ─── Translations ───
const TRANSLATIONS = {
  ID: {
    greeting: 'Halo, Selamat Datang! 👋',
    subgreeting: 'Ini adalah contoh app dengan Context Provider.',
    weather: 'Cuaca Hari Ini',
    weatherDesc: 'Cerah berawan, 28°C di Jakarta',
    news: 'Berita Terkini',
    newsDesc: 'React 19 resmi rilis dengan fitur baru yang mengagumkan.',
    quote: '"Belajar itu tidak pernah ada habisnya." — Aristotle',
    theme: 'Tema',
    lang: 'Bahasa',
    dark: 'Gelap', light: 'Terang', sepia: 'Sepia',
    id: 'Indonesia', en: 'English',
    btnLabel: 'Klik Saya!',
    counter: 'Klik',
    card1: 'Profil Pengguna',
    card1Desc: 'Ini komponen yang menggunakan useTheme & useLanguage.',
    card2: 'Widget Cuaca',
    card2Desc: 'Komponen ke-2 yang mengakses context.',
    card3: 'Widget Berita',
    card3Desc: 'Komponen ke-3 yang mengakses context.',
  },
  EN: {
    greeting: 'Hello, Welcome! 👋',
    subgreeting: 'This is a sample app using Context Providers.',
    weather: "Today's Weather",
    weatherDesc: 'Partly cloudy, 28°C in Jakarta',
    news: 'Latest News',
    newsDesc: 'React 19 officially released with amazing new features.',
    quote: '"Learning never exhausts the mind." — Leonardo da Vinci',
    theme: 'Theme',
    lang: 'Language',
    dark: 'Dark', light: 'Light', sepia: 'Sepia',
    id: 'Indonesian', en: 'English',
    btnLabel: 'Click Me!',
    counter: 'Clicks',
    card1: 'User Profile',
    card1Desc: 'This component uses both useTheme & useLanguage.',
    card2: 'Weather Widget',
    card2Desc: 'Second component consuming context.',
    card3: 'News Widget',
    card3Desc: 'Third component consuming context.',
  }
};

// ─── Theme Palettes ───
const THEMES = {
  dark: { bg: '#0a0a1a', bg2: '#16163a', card: '#1e1e40', border: '#2a2a5a', text: '#f0f0f8', textSub: '#a0a0c0', accent: '#6C5CE7' },
  light: { bg: '#f0f4ff', bg2: '#fff', card: '#ffffff', border: '#d0d8f0', text: '#1a1a3a', textSub: '#5a5a8a', accent: '#6C5CE7' },
  sepia: { bg: '#2c1f0e', bg2: '#3a2a14', card: '#4a3820', border: '#5a4830', text: '#f5e6c8', textSub: '#c8a87a', accent: '#FDCB6E' },
};

// ─── Providers ───
function ThemeProvider({ children }) {
  const saved = localStorage.getItem('c3_theme') || 'dark';
  const [theme, setThemeRaw] = useState(saved);
  const setTheme = useCallback((t) => {
    setThemeRaw(t);
    localStorage.setItem('c3_theme', t);
  }, []);
  return <ThemeContext.Provider value={{ theme, setTheme, palette: THEMES[theme] }}>{children}</ThemeContext.Provider>;
}

function LanguageProvider({ children }) {
  const saved = localStorage.getItem('c3_lang') || 'ID';
  const [lang, setLangRaw] = useState(saved);
  const setLang = useCallback((l) => {
    setLangRaw(l);
    localStorage.setItem('c3_lang', l);
  }, []);
  const t = (key) => TRANSLATIONS[lang][key] || key;
  return <LanguageContext.Provider value={{ lang, setLang, t }}>{children}</LanguageContext.Provider>;
}

// ─── Child Components (each consuming context) ───

function ProfileCard() {
  const { palette } = useTheme();
  const { t } = useLanguage();
  const [clicks, setClicks] = useState(0);
  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: palette.card, border: `1px solid ${palette.border}`, transition: 'all 0.3s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6C5CE7, #A29BFE)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#fff' }}>A</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: '14px', color: palette.text }}>Arfan Prihard</div>
          <div style={{ fontSize: '11px', color: palette.accent }}>@arfanprihard</div>
        </div>
      </div>
      <p style={{ fontSize: '12px', color: palette.textSub, marginBottom: '10px' }}>{t('card1Desc')}</p>
      <button onClick={() => setClicks(c => c + 1)} style={{
        padding: '6px 14px', borderRadius: '8px', background: palette.accent,
        color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600
      }}>
        {t('btnLabel')} ({clicks} {t('counter')})
      </button>
    </div>
  );
}

function WeatherWidget() {
  const { palette } = useTheme();
  const { t } = useLanguage();
  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: palette.card, border: `1px solid ${palette.border}`, transition: 'all 0.3s' }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>⛅</div>
      <div style={{ fontWeight: 700, fontSize: '14px', color: palette.text, marginBottom: '4px' }}>{t('weather')}</div>
      <p style={{ fontSize: '12px', color: palette.textSub, margin: 0 }}>{t('weatherDesc')}</p>
    </div>
  );
}

function NewsWidget() {
  const { palette } = useTheme();
  const { t } = useLanguage();
  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: palette.card, border: `1px solid ${palette.border}`, transition: 'all 0.3s' }}>
      <div style={{ fontSize: '24px', marginBottom: '8px' }}>📰</div>
      <div style={{ fontWeight: 700, fontSize: '14px', color: palette.text, marginBottom: '4px' }}>{t('news')}</div>
      <p style={{ fontSize: '12px', color: palette.textSub, margin: 0 }}>{t('newsDesc')}</p>
    </div>
  );
}

function ControlPanel() {
  const { theme, setTheme, palette } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const themes = ['dark', 'light', 'sepia'];
  const langs = ['ID', 'EN'];

  return (
    <div style={{ padding: '16px', borderRadius: '12px', background: palette.card, border: `1px solid ${palette.border}`, transition: 'all 0.3s', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
        <div>
          <div style={{ fontSize: '11px', color: palette.textSub, fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('theme')}</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {themes.map(th => (
              <button key={th} onClick={() => setTheme(th)} style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', border: `1px solid ${theme === th ? THEMES[th].accent : palette.border}`,
                background: theme === th ? THEMES[th].accent : 'transparent',
                color: theme === th ? '#fff' : palette.textSub, transition: 'all 0.2s'
              }}>{t(th)}</button>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontSize: '11px', color: palette.textSub, fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t('lang')}</div>
          <div style={{ display: 'flex', gap: '6px' }}>
            {langs.map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding: '5px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: 600,
                cursor: 'pointer', border: `1px solid ${lang === l ? palette.accent : palette.border}`,
                background: lang === l ? palette.accent : 'transparent',
                color: lang === l ? '#fff' : palette.textSub, transition: 'all 0.2s'
              }}>{t(l === 'ID' ? 'id' : 'en')}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function AppContent() {
  const { palette } = useTheme();
  const { t } = useLanguage();
  return (
    <div style={{ padding: '24px', maxWidth: '680px', margin: '0 auto', transition: 'all 0.3s', minHeight: '400px', background: palette.bg, borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
        <span style={{ fontSize: '24px' }}>🎨</span>
        <h2 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: palette.text }}>Theme & Language Switcher</h2>
      </div>
      <p style={{ color: palette.textSub, fontSize: '12px', marginBottom: '16px' }}>
        File: <code style={{ background: palette.bg2, padding: '2px 6px', borderRadius: '4px', color: palette.accent }}>src/challenges/Challenge3_useContext.jsx</code>
      </p>

      <ControlPanel />

      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h3 style={{ color: palette.text, margin: '0 0 6px' }}>{t('greeting')}</h3>
        <p style={{ color: palette.textSub, fontSize: '13px', margin: '0 0 8px' }}>{t('subgreeting')}</p>
        <p style={{ color: palette.accent, fontSize: '12px', fontStyle: 'italic', margin: 0 }}>{t('quote')}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
        <ProfileCard />
        <WeatherWidget />
        <NewsWidget />
      </div>
    </div>
  );
}

export default function Challenge3_useContext() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </ThemeProvider>
  );
}
