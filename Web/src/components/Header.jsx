import React from 'react';
import { Heart, ExternalLink, Sun, Moon } from 'lucide-react';

export default function Header({ theme = 'light', toggleTheme }) {
  const isDark = theme === 'dark';

  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <img src="/logo.svg" alt="AnyQR Logo" className="brand-logo-img" />
        <div className="brand-title">
          <span>AnyQR</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          type="button"
          onClick={toggleTheme}
          className="theme-toggle-btn"
          aria-label={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
          title={isDark ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
        >
          {isDark ? (
            <Sun size={18} className="theme-toggle-icon" />
          ) : (
            <Moon size={18} className="theme-toggle-icon" />
          )}
        </button>

        <a
          href="https://saweria.co/suree"
          target="_blank"
          rel="noopener noreferrer"
          className="header-support-btn"
          title="Support Creator on Saweria"
        >
          <Heart size={15} fill="#e11d48" color="#e11d48" />
          <span>Support Creator</span>
          <ExternalLink size={13} style={{ opacity: 0.7 }} />
        </a>
      </div>
    </header>
  );
}
