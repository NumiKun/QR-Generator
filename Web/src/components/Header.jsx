import React, { useState } from 'react';
import { ShieldCheck, Info, X, Zap } from 'lucide-react';

export default function Header() {
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  return (
    <>
      <header className="app-header">
        <div className="brand-wrapper">
          <img src="/logo.svg" alt="AnyQR Logo" className="brand-logo-img" />
          <div className="brand-title">
            <span>AnyQR</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            className="header-status-badge"
            onClick={() => setShowPrivacyModal(true)}
            title="Click to view privacy & telemetry architecture"
          >
            <span className="status-dot"></span>
            <span>Zero-Telemetry</span>
            <Info size={14} style={{ opacity: 0.8 }} />
          </button>
        </div>
      </header>

      {/* Privacy Guarantee Modal */}
      {showPrivacyModal && (
        <div className="modal-overlay" onClick={() => setShowPrivacyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div className="card-icon-box" style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10b981' }}>
                  <ShieldCheck size={20} />
                </div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Strict Zero-Telemetry Architecture</h3>
              </div>
              <button onClick={() => setShowPrivacyModal(false)} style={{ color: 'var(--text-muted)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p>
                <strong>AnyQR is 100% client-side.</strong> Neither your input text, target links, uploaded brand logos, nor generated QR code vectors ever leave your device.
              </p>
              <div style={{ background: 'var(--bg-input)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', padding: '14px' }}>
                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span><strong>No Network Calls:</strong> 0 analytics trackers, 0 backend API dispatches.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span><strong>Local Ingestion:</strong> Logo images are processed directly in browser canvas memory.</span>
                  </li>
                  <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Zap size={15} style={{ color: '#10b981', flexShrink: 0 }} />
                    <span><strong>Local Persistence:</strong> Configuration state is stored exclusively in your browser's LocalStorage.</span>
                  </li>
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn-primary" onClick={() => setShowPrivacyModal(false)}>
                Understood
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
