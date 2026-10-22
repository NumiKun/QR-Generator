import React from 'react';
import { Palette, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { checkContrast } from '../utils/contrast';

const PRESET_FOREGROUNDS = [
  { label: 'Hitam Pekat', color: '#0F172A' },
  { label: 'Biru AnyQR', color: '#4F46E5' },
  { label: 'Hijau Emerald', color: '#059669' },
  { label: 'Ungu Elegan', color: '#7C3AED' },
  { label: 'Merah Crimson', color: '#E11D48' },
  { label: 'Hitam Klasik', color: '#000000' },
];

const PRESET_BACKGROUNDS = [
  { label: 'Putih Bersih', color: '#FFFFFF' },
  { label: 'Abu Lembut', color: '#F8FAFC' },
  { label: 'Kuning Krem', color: '#FEF9C3' },
  { label: 'Biru Es', color: '#EFF6FF' },
  { label: 'Gelap Pekat', color: '#0F172A' },
];

export default function ColorStudio({
  fgColor,
  setFgColor,
  bgColor,
  setBgColor,
  isTransparent,
  setIsTransparent,
}) {
  const contrastInfo = checkContrast(fgColor, bgColor, isTransparent);

  return (
    <section className="studio-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-box">
            <Palette size={18} />
          </div>
          <div>
            <h2 className="card-title">Warna QR Code</h2>
            <p className="card-subtitle">Atur warna titik dan latar belakang agar mudah dipindai</p>
          </div>
        </div>

        {/* Indikator Keterbacaan Warna */}
        <div className={`contrast-badge ${contrastInfo.status}`}>
          {contrastInfo.isPassing ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />}
          <span>{contrastInfo.label}</span>
        </div>
      </div>

      <div className="grid-2">
        {/* Warna Titik QR */}
        <div className="input-group">
          <label className="input-label">Warna Titik QR</label>
          <div className="color-picker-control">
            <input
              type="color"
              className="color-swatch-input"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
            />
            <input
              type="text"
              className="hex-text-input"
              value={fgColor}
              onChange={(e) => setFgColor(e.target.value)}
              maxLength={7}
            />
          </div>

          <div className="palette-chips">
            {PRESET_FOREGROUNDS.map((chip) => (
              <button
                key={chip.color}
                className={`palette-chip-btn ${fgColor.toLowerCase() === chip.color.toLowerCase() ? 'active' : ''}`}
                style={{ backgroundColor: chip.color }}
                onClick={() => setFgColor(chip.color)}
                title={chip.label}
              />
            ))}
          </div>
        </div>

        {/* Warna Latar Belakang */}
        <div className="input-group">
          <div className="input-label">
            <span>Warna Latar Belakang</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
              <input
                type="checkbox"
                checked={isTransparent}
                onChange={(e) => setIsTransparent(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Latar Transparan</span>
            </label>
          </div>

          <div
            className="color-picker-control"
            style={{ opacity: isTransparent ? 0.4 : 1, pointerEvents: isTransparent ? 'none' : 'auto' }}
          >
            <input
              type="color"
              className="color-swatch-input"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              disabled={isTransparent}
            />
            <input
              type="text"
              className="hex-text-input"
              value={isTransparent ? 'TRANSPARAN' : bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              disabled={isTransparent}
              maxLength={7}
            />
          </div>

          <div className="palette-chips" style={{ opacity: isTransparent ? 0.4 : 1, pointerEvents: isTransparent ? 'none' : 'auto' }}>
            {PRESET_BACKGROUNDS.map((chip) => (
              <button
                key={chip.color}
                className={`palette-chip-btn ${!isTransparent && bgColor.toLowerCase() === chip.color.toLowerCase() ? 'active' : ''}`}
                style={{ backgroundColor: chip.color, border: '1px solid rgba(0,0,0,0.1)' }}
                onClick={() => {
                  setBgColor(chip.color);
                  setIsTransparent(false);
                }}
                title={chip.label}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Peringatan jika warna kurang kontras */}
      {!contrastInfo.isPassing && (
        <div style={{
          marginTop: '16px',
          padding: '10px 14px',
          borderRadius: 'var(--radius-md)',
          background: '#fef2f2',
          border: '1px solid #fecaca',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          fontSize: '0.8125rem',
          color: '#b91c1c',
        }}>
          <ShieldAlert size={18} style={{ flexShrink: 0 }} />
          <span>
            <strong>Perhatian:</strong> Warna kode QR dan latar belakang terlalu mirip. Kamera HP mungkin akan sulit membaca QR Code ini. Cobalah pilih warna yang lebih gelap untuk titik QR atau lebih terang untuk latar.
          </span>
        </div>
      )}
    </section>
  );
}
