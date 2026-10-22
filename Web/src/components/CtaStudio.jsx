import React from 'react';
import { Tag, LayoutTemplate, Smartphone, MessageSquare } from 'lucide-react';

const FRAME_PRESETS = [
  { id: 'none', label: 'Tanpa Bingkai', icon: LayoutTemplate },
  { id: 'bottom-ribbon', label: 'Pita Bawah', icon: Tag },
  { id: 'top-header', label: 'Header Atas', icon: MessageSquare },
  { id: 'phone-mockup', label: 'Bentuk HP', icon: Smartphone },
];

export default function CtaStudio({
  ctaFrame,
  setCtaFrame,
  ctaText,
  setCtaText,
}) {
  return (
    <section className="studio-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-box">
            <Tag size={18} />
          </div>
          <div>
            <h2 className="card-title">Bingkai & Tulisan Tambahan</h2>
            <p className="card-subtitle">Beri bingkai seperti tulisan 'SCAN ME' agar orang tertarik memindai</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Pilihan Bingkai */}
        <div className="grid-4">
          {FRAME_PRESETS.map((preset) => {
            const IconComp = preset.icon;
            return (
              <button
                key={preset.id}
                className={`selector-tile ${ctaFrame === preset.id ? 'active' : ''}`}
                onClick={() => setCtaFrame(preset.id)}
              >
                <div className="selector-tile-icon">
                  <IconComp size={18} />
                </div>
                <span className="selector-tile-label">{preset.label}</span>
              </button>
            );
          })}
        </div>

        {/* Teks Bingkai */}
        {ctaFrame !== 'none' && (
          <div className="input-group">
            <label className="input-label">Teks Tulisan Bingkai</label>
            <input
              type="text"
              className="text-input"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="SCAN ME"
              maxLength={24}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Warna bingkai otomatis menyesuaikan dengan warna titik QR code.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
