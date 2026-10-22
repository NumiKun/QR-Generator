import React, { useState, useEffect } from 'react';
import { Download, Copy, Printer, Check, Sparkles, FileCode2 } from 'lucide-react';
import { exportPng, exportSvg, copyToClipboard } from '../utils/qrEngine';

export default function ExportDeck({ config, onOpenPrint }) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(null);

  // Shortcut keyboard untuk Ctrl+C / Cmd+C
  useEffect(() => {
    const handleKeyDown = (e) => {
      const targetTag = e.target?.tagName?.toLowerCase();
      if (targetTag === 'input' || targetTag === 'textarea') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        e.preventDefault();
        handleCopyClipboard();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config]);

  const handleCopyClipboard = async () => {
    const success = await copyToClipboard(config);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } else {
      alert('Browser tidak mendukung salin langsung gambar ke clipboard.');
    }
  };

  const handleDownloadPng = async (resolution = 2048, label = '4K') => {
    try {
      setExporting(label);
      await exportPng(config, resolution, `anyqr-${label.toLowerCase()}`);
    } finally {
      setExporting(null);
    }
  };

  const handleDownloadSvg = async () => {
    try {
      setExporting('SVG');
      await exportSvg(config, 'anyqr-vector');
    } finally {
      setExporting(null);
    }
  };

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      {/* Tombol Aksi Ekspor */}
      <div className="action-grid">
        {/* Salin ke Clipboard */}
        <button
          className="btn-secondary btn-full"
          onClick={handleCopyClipboard}
          title="Shortcut: Ctrl+C / Cmd+C"
        >
          {copied ? (
            <>
              <Check size={16} style={{ color: '#059669' }} />
              <span style={{ color: '#059669' }}>Gambar Berhasil Disalin!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Salin Gambar (Ctrl+C)</span>
            </>
          )}
        </button>

        {/* PNG Resolusi Tinggi (4K) */}
        <button
          className="btn-primary"
          onClick={() => handleDownloadPng(2048, '4K')}
          disabled={exporting !== null}
        >
          <Sparkles size={16} />
          <span>{exporting === '4K' ? 'Menyiapkan...' : 'Unduh PNG (4K)'}</span>
        </button>

        {/* Vektor SVG */}
        <button
          className="btn-secondary"
          onClick={handleDownloadSvg}
          disabled={exporting !== null}
        >
          <FileCode2 size={16} />
          <span>{exporting === 'SVG' ? 'Menyiapkan...' : 'Unduh Vektor (SVG)'}</span>
        </button>

        {/* PNG Standar */}
        <button
          className="btn-secondary"
          onClick={() => handleDownloadPng(1024, '1024px')}
          disabled={exporting !== null}
        >
          <Download size={16} />
          <span>Unduh PNG (Standar)</span>
        </button>

        {/* Cetak A4 */}
        <button
          className="btn-secondary"
          onClick={onOpenPrint}
        >
          <Printer size={16} />
          <span>Cetak Lembar A4</span>
        </button>
      </div>
    </div>
  );
}
