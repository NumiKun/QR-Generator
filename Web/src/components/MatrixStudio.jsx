import React from 'react';
import { Grid, Eye, Disc, Box, Circle, Sparkles, Layers } from 'lucide-react';

const DOT_TYPES = [
  { id: 'square', label: 'Classic Square', icon: Box },
  { id: 'dots', label: 'Rounded Dots', icon: Disc },
  { id: 'rounded', label: 'Smooth Pill', icon: Circle },
  { id: 'classy-rounded', label: 'Liquid Fluid', icon: Sparkles },
];

const CORNER_SQUARE_TYPES = [
  { id: 'square', label: 'Square' },
  { id: 'extra-rounded', label: 'Rounded Square' },
  { id: 'dot', label: 'Circular' },
];

const CORNER_DOT_TYPES = [
  { id: 'square', label: 'Square' },
  { id: 'dot', label: 'Circular Dot' },
];

export default function MatrixStudio({
  dotType,
  setDotType,
  cornerSquareType,
  setCornerSquareType,
  cornerDotType,
  setCornerDotType,
}) {
  return (
    <section className="studio-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-box">
            <Grid size={18} />
          </div>
          <div>
            <h2 className="card-title">Matrix Geometry Studio</h2>
            <p className="card-subtitle">Module patterns, outer eye frames & inner pupil styles</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Module Dot Shape */}
        <div>
          <label className="input-label" style={{ marginBottom: '10px' }}>
            <span>Module Geometry Pattern</span>
          </label>
          <div className="grid-4">
            {DOT_TYPES.map((item) => {
              const IconComp = item.icon;
              return (
                <button
                  key={item.id}
                  className={`selector-tile ${dotType === item.id ? 'active' : ''}`}
                  onClick={() => setDotType(item.id)}
                >
                  <div className="selector-tile-icon">
                    <IconComp size={20} />
                  </div>
                  <span className="selector-tile-label">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Eye Shapes (Corner Frames and Corner Pupils) */}
        <div className="grid-2">
          {/* Corner Eye Frame */}
          <div>
            <label className="input-label" style={{ marginBottom: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} /> Outer Eye Frame
              </span>
            </label>
            <div className="grid-3">
              {CORNER_SQUARE_TYPES.map((item) => (
                <button
                  key={item.id}
                  className={`selector-tile ${cornerSquareType === item.id ? 'active' : ''}`}
                  onClick={() => setCornerSquareType(item.id)}
                >
                  <span className="selector-tile-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Corner Eye Pupil */}
          <div>
            <label className="input-label" style={{ marginBottom: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> Inner Eye Pupil
              </span>
            </label>
            <div className="grid-2">
              {CORNER_DOT_TYPES.map((item) => (
                <button
                  key={item.id}
                  className={`selector-tile ${cornerDotType === item.id ? 'active' : ''}`}
                  onClick={() => setCornerDotType(item.id)}
                >
                  <span className="selector-tile-label">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
