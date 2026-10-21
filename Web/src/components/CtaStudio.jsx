import React from 'react';
import { Tag, LayoutTemplate, Smartphone, MessageSquare } from 'lucide-react';

const FRAME_PRESETS = [
  { id: 'none', label: 'Frameless', icon: LayoutTemplate },
  { id: 'bottom-ribbon', label: 'Bottom Ribbon', icon: Tag },
  { id: 'top-header', label: 'Top Header', icon: MessageSquare },
  { id: 'phone-mockup', label: 'Phone Frame', icon: Smartphone },
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
            <h2 className="card-title">CTA Frames & Badges</h2>
            <p className="card-subtitle">Scannable call-to-action wrappers & signage presets</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Frame Presets */}
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

        {/* Editable CTA Text (when frame is active) */}
        {ctaFrame !== 'none' && (
          <div className="input-group">
            <label className="input-label">Call-to-Action (CTA) Label</label>
            <input
              type="text"
              className="text-input"
              value={ctaText}
              onChange={(e) => setCtaText(e.target.value)}
              placeholder="SCAN ME"
              maxLength={24}
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Inherits matrix accent color in vector & raster export.
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
