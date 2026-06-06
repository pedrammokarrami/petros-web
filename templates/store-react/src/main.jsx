import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';

/* ── اعمال رنگ‌بندی از window.STORE_DATA ── */
if (typeof window !== 'undefined' && window.STORE_DATA?.meta?.primaryColor) {
  document.documentElement.style.setProperty('--store-primary', window.STORE_DATA.meta.primaryColor);
}

/* ── اعمال تنظیمات ذخیره‌شده (رنگ + تم) ── */
(function applyStoredSettings() {
  try {
    const raw = localStorage.getItem('petros_settings');
    if (!raw) return;
    const { appearance } = JSON.parse(raw);
    if (!appearance) return;

    if (appearance.accent) {
      const hex = appearance.accent;
      const r = parseInt(hex.slice(1,3),16), g = parseInt(hex.slice(3,5),16), b = parseInt(hex.slice(5,7),16);
      const lr = Math.min(255,Math.round(r+(255-r)*.4)).toString(16).padStart(2,'0');
      const lg = Math.min(255,Math.round(g+(255-g)*.4)).toString(16).padStart(2,'0');
      const lb = Math.min(255,Math.round(b+(255-b)*.4)).toString(16).padStart(2,'0');
      document.documentElement.style.setProperty('--accent', hex);
      document.documentElement.style.setProperty('--accent-light', `#${lr}${lg}${lb}`);
      document.documentElement.style.setProperty('--accent-gradient', `linear-gradient(135deg, ${hex} 0%, #${lr}${lg}${lb} 100%)`);
      document.documentElement.style.setProperty('--accent-glow', `rgba(${r},${g},${b},0.28)`);
    }
    if (appearance.theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  } catch {}
})();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
);
