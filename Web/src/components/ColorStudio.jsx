import React from 'react';
import { Palette, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { checkContrast } from '../utils/contrast';

const PRESET_FOREGROUNDS = [
  { label: 'Obsidian', color: '#0F172A' },
  { label: 'AnyQR Indigo', color: '#4F46E5' },
  { label: 'Emerald', color: '#059669' },
  { label: 'Royal Violet', color: '#7C3AED' },
  { label: 'Sunset Crimson', color: '#E11D48' },
  { label: 'Classic Black', color: '#000000' },
];

const PRESET_BACKGROUNDS = [
  { label: 'Pure White', color: '#FFFFFF' },
  { label: 'Slate Soft', color: '#F8FAFC' },
  { label: 'Cream Ivory', color: '#FEF9C3' },
  { label: 'Ice Blue', color: '#EFF6FF' },
  { label: 'Dark Studio', color: '#0F172A' },
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
            <h2 className="card-title">Color Palette & Contrast</h2>
            <p className="card-subtitle">WCAG compliance threshold & alpha preservation</p>
          </div>
        </div>

        {/* Contrast Badge */}
        <div className={`contrast-badge ${contrastInfo.status}`}>
          {contrastInfo.isPassing ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />}
          <span>{contrastInfo.label}</span>
        </div>
      </div>

      <div className="grid-2">
        {/* Foreground Matrix Color */}
        <div className="input-group">
          <label className="input-label">Matrix Foreground Color</label>
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

        {/* Background Color */}
        <div className="input-group">
          <div className="input-label">
            <span>Background Color</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.75rem' }}>
              <input
                type="checkbox"
                checked={isTransparent}
                onChange={(e) => setIsTransparent(e.target.checked)}
                style={{ cursor: 'pointer' }}
              />
              <span>Transparent</span>
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
              value={isTransparent ? 'TRANSPARENT' : bgColor}
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
                style={{ backgroundColor: chip.color, border: '1px solid rgba(255,255,255,0.2)' }}
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

      {/* Warning Alert if contrast is bad */}
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
            <strong>Peringatan Kontras Rendah:</strong> Rasio kontras ({contrastInfo.ratio}:1) berada di bawah ambang scannability WCAG 4.5:1. Kamera smartphone mungkin gagal membaca QR Code ini.
          </span>
        </div>
      )}
    </section>
  );
}
