import React, { useState, useEffect } from 'react';
import { Download, Copy, Printer, Check, Sparkles, FileCode2 } from 'lucide-react';
import { exportPng, exportSvg, copyToClipboard } from '../utils/qrEngine';

export default function ExportDeck({ config, onOpenPrint }) {
  const [copied, setCopied] = useState(false);
  const [exporting, setExporting] = useState(null);

  // Keyboard shortcut listener for Ctrl+C / Cmd+C
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept if user is typing inside an input or textarea
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
      alert('Clipboard copy is not supported or permission denied in this browser.');
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
      {/* Primary Export Actions */}
      <div className="action-grid">
        {/* Copy to Clipboard */}
        <button
          className="btn-secondary btn-full"
          onClick={handleCopyClipboard}
          title="Shortcut: Ctrl+C / Cmd+C"
        >
          {copied ? (
            <>
              <Check size={16} style={{ color: '#10b981' }} />
              <span style={{ color: '#10b981' }}>Copied to Clipboard!</span>
            </>
          ) : (
            <>
              <Copy size={16} />
              <span>Copy to Clipboard (⌘C / Ctrl+C)</span>
            </>
          )}
        </button>

        {/* 4K Raster PNG */}
        <button
          className="btn-primary"
          onClick={() => handleDownloadPng(2048, '4K')}
          disabled={exporting !== null}
        >
          <Sparkles size={16} />
          <span>{exporting === '4K' ? 'Generating...' : 'Export 4K PNG'}</span>
        </button>

        {/* Clean Vector SVG */}
        <button
          className="btn-secondary"
          onClick={handleDownloadSvg}
          disabled={exporting !== null}
        >
          <FileCode2 size={16} />
          <span>{exporting === 'SVG' ? 'Exporting...' : 'Export SVG Vector'}</span>
        </button>

        {/* Standard PNG (1024) */}
        <button
          className="btn-secondary"
          onClick={() => handleDownloadPng(1024, '1024px')}
          disabled={exporting !== null}
        >
          <Download size={16} />
          <span>PNG (1024px)</span>
        </button>

        {/* Print Sheet Utility */}
        <button
          className="btn-secondary"
          onClick={onOpenPrint}
        >
          <Printer size={16} />
          <span>Print Utility (A4)</span>
        </button>
      </div>
    </div>
  );
}
