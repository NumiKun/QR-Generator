import React from 'react';
import { Image as ImageIcon, Upload, X, ShieldCheck, Sliders } from 'lucide-react';

export default function LogoStudio({
  logoUrl,
  setLogoUrl,
  logoScale,
  setLogoScale,
  logoMargin,
  setLogoMargin,
  eccLevel,
  setEccLevel,
}) {
  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setLogoUrl(ev.target.result);
        // PRD Section 3.3: Auto-switch to H (30%) when logo is active
        setEccLevel('H');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
  };

  return (
    <section className="studio-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-box">
            <ImageIcon size={18} />
          </div>
          <div>
            <h2 className="card-title">Logo & Insignia Embedding</h2>
            <p className="card-subtitle">Safe module clearing margin & automatic H-ECC fail-safe</p>
          </div>
        </div>

        {logoUrl && (
          <div className="contrast-badge pass" style={{ fontSize: '0.6875rem' }}>
            <ShieldCheck size={13} />
            <span>Auto-ECC High (30%) Active</span>
          </div>
        )}
      </div>

      {!logoUrl ? (
        <div
          style={{
            border: '2px dashed var(--border-default)',
            borderRadius: 'var(--radius-md)',
            padding: '24px 16px',
            textAlign: 'center',
            background: '#f8fafc',
            cursor: 'pointer',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            transition: 'background 150ms ease, border-color 150ms ease',
          }}
          onClick={() => document.getElementById('logo-upload-input')?.click()}
        >
          <Upload size={24} style={{ color: 'var(--color-primary)' }} />
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Upload Brand Logo or Icon</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Supports SVG, PNG, WebP with transparency. Processed 100% locally.
          </span>
          <input
            id="logo-upload-input"
            type="file"
            accept="image/svg+xml,image/png,image/webp,image/jpeg"
            style={{ display: 'none' }}
            onChange={handleLogoUpload}
          />
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Logo preview thumbnail & remove */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-input)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: 'var(--radius-sm)',
                background: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                boxShadow: 'var(--shadow-sm)',
              }}>
                <img src={logoUrl} alt="Logo Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block' }}>Active Brand Insignia</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Centered with safe clearance</span>
              </div>
            </div>

            <button
              onClick={handleRemoveLogo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                color: '#ef4444',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(239, 68, 68, 0.25)',
                background: 'rgba(239, 68, 68, 0.08)',
              }}
            >
              <X size={14} /> Remove
            </button>
          </div>

          {/* Scale Slider */}
          <div className="slider-control">
            <div className="slider-header">
              <span>Logo Scale Proportion (Safe bounds: 15% - 35%)</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{Math.round(logoScale * 100)}%</span>
            </div>
            <input
              type="range"
              className="slider-input"
              min="0.15"
              max="0.35"
              step="0.01"
              value={logoScale}
              onChange={(e) => setLogoScale(parseFloat(e.target.value))}
            />
          </div>

          {/* Safe Module Margin Slider */}
          <div className="slider-control">
            <div className="slider-header">
              <span>Safe Module Clearing Margin</span>
              <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{logoMargin}px</span>
            </div>
            <input
              type="range"
              className="slider-input"
              min="0"
              max="15"
              step="1"
              value={logoMargin}
              onChange={(e) => setLogoMargin(parseInt(e.target.value, 10))}
            />
          </div>
        </div>
      )}
    </section>
  );
}
