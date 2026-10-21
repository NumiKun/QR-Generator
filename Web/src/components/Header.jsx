import React from 'react';
import { Heart, ExternalLink } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="brand-wrapper">
        <img src="/logo.svg" alt="AnyQR Logo" className="brand-logo-img" />
        <div className="brand-title">
          <span>AnyQR</span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
