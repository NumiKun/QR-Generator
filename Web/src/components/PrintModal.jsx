import React, { useState, useEffect } from 'react';
import { Printer, X } from 'lucide-react';
import { getCompositeDataUrl } from '../utils/qrEngine';

export default function PrintModal({ config, onClose }) {
  const { ctaText } = config;
  const [previewImgUrl, setPreviewImgUrl] = useState('');

  useEffect(() => {
    let isMounted = true;
    getCompositeDataUrl(config, 600).then((url) => {
      if (isMounted) setPreviewImgUrl(url);
    });
    return () => {
      isMounted = false;
    };
  }, [config]);

  const handleTriggerPrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div className="card-icon-box">
              <Printer size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.125rem', fontWeight: 700 }}>Cetak Lembar Siap Tempel (A4)</h3>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Cetak langsung untuk ditempel di meja kasir, etalase, atau dinding</p>
            </div>
          </div>
          <button onClick={onClose} style={{ color: 'var(--text-muted)' }}>
            <X size={20} />
          </button>
        </div>

        {/* Wadah Pratinjau Cetak */}
        <div
          id="print-sheet-preview"
          style={{
            background: '#ffffff',
            color: '#0f172a',
            padding: '36px 24px',
            borderRadius: 'var(--radius-lg)',
            border: '1.5px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '6px', color: '#0f172a' }}>
            {ctaText || 'SCAN ME'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '24px' }}>
            Arahkan kamera smartphone Anda ke QR code di bawah untuk membuka tautan
          </p>

          <div
            id="print-qr-target"
            style={{
              padding: '16px',
              border: '2px solid #e2e8f0',
              borderRadius: '16px',
              marginBottom: '20px',
              display: 'inline-block',
              background: '#ffffff',
            }}
          >
            {previewImgUrl ? (
              <img
                src={previewImgUrl}
                alt="QR Code"
                style={{
                  width: '240px',
                  height: 'auto',
                  maxHeight: '320px',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : (
              <div style={{ width: '220px', height: '220px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ fontSize: '0.8125rem', color: '#64748b' }}>
                  Menyiapkan Pratinjau Cetak...
                </span>
              </div>
            )}
          </div>

          <div style={{ fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid #e2e8f0', paddingTop: '12px', width: '100%' }}>
            Dibuat secara instan dengan AnyQR
          </div>
        </div>

        <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <button className="btn-secondary" onClick={onClose}>
            Batal
          </button>
          <button className="btn-primary" onClick={handleTriggerPrint}>
            <Printer size={16} /> Cetak Sekarang (A4)
          </button>
        </div>
      </div>
    </div>
  );
}
