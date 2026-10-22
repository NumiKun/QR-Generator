import React from 'react';
import { Grid, Eye, Disc, Box, Circle, Sparkles, Layers } from 'lucide-react';

const DOT_TYPES = [
  { id: 'square', label: 'Kotak Klasik', icon: Box },
  { id: 'dots', label: 'Titik Bulat', icon: Disc },
  { id: 'rounded', label: 'Lonjong Halus', icon: Circle },
  { id: 'classy-rounded', label: 'Cairan Halus', icon: Sparkles },
];

const CORNER_SQUARE_TYPES = [
  { id: 'square', label: 'Kotak' },
  { id: 'extra-rounded', label: 'Lengkung' },
  { id: 'dot', label: 'Bulat' },
];

const CORNER_DOT_TYPES = [
  { id: 'square', label: 'Kotak' },
  { id: 'dot', label: 'Bulat' },
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
            <h2 className="card-title">Bentuk & Pola QR</h2>
            <p className="card-subtitle">Pilih model titik dan bentuk sudut kode QR</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Bentuk Titik QR */}
        <div>
          <label className="input-label" style={{ marginBottom: '10px' }}>
            <span>Model Titik Kode QR</span>
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

        {/* Bentuk Sudut Mata QR */}
        <div className="grid-2">
          {/* Bingkai Sudut Luar */}
          <div>
            <label className="input-label" style={{ marginBottom: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Eye size={14} /> Bingkai Sudut Luar
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

          {/* Titik Sudut Dalam */}
          <div>
            <label className="input-label" style={{ marginBottom: '10px' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Layers size={14} /> Titik Sudut Dalam
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
