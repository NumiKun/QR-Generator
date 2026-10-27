import React from 'react';
import { Image as ImageIcon, Upload, X, ShieldCheck } from 'lucide-react';

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
            <h2 className="card-title">Sisipkan Logo di Tengah</h2>
            <p className="card-subtitle">Tambahkan logo agar QR Code lebih menarik dan mudah dikenali</p>
          </div>
        </div>

        {logoUrl && (
          <div className="contrast-badge pass" style={{ fontSize: '0.6875rem' }}>
            <ShieldCheck size={13} />
            <span>Koreksi Eror Tinggi (Aman Di-scan)</span>
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
            background: 'var(--bg-surface-elevated)',
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
          <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Pilih File Logo atau Gambar</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Mendukung file PNG, SVG, JPG, atau WebP (disarankan logo berlatar transparan)
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
          {/* Pratinjau Logo & Tombol Hapus */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'var(--bg-surface)',
            padding: '12px 16px',
            borderRadius: 'var(--radius-md)',
            border: '1.5px solid var(--border-subtle)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--bg-surface-elevated)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4px',
                border: '1px solid var(--border-subtle)',
              }}>
                <img src={logoUrl} alt="Pratinjau Logo" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              </div>
              <div>
                <span style={{ fontSize: '0.8125rem', fontWeight: 600, display: 'block' }}>Logo Terpasang</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Otomatis berada di tengah QR Code</span>
              </div>
            </div>

            <button
              onClick={handleRemoveLogo}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--color-danger)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid rgba(220, 38, 38, 0.25)',
                background: 'rgba(220, 38, 38, 0.08)',
              }}
            >
              <X size={14} /> Hapus Logo
            </button>
          </div>

          {/* Slider Ukuran Logo */}
          <div className="slider-control">
            <div className="slider-header">
              <span>Ukuran Logo</span>
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

          {/* Slider Jarak Ruang Sekitar Logo */}
          <div className="slider-control">
            <div className="slider-header">
              <span>Jarak Ruang Sekitar Logo</span>
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
