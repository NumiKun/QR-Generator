import React, { useEffect, useRef, useState } from 'react';
import { Cpu, Database, Binary, CheckCircle2, ShieldAlert, HelpCircle, AlertTriangle } from 'lucide-react';
import { createQrInstance } from '../utils/qrEngine';
import { analyzeQRMetadata } from '../utils/metadata';
import { checkContrast } from '../utils/contrast';

export default function PreviewStage({ config }) {
  const containerRef = useRef(null);
  const qrInstanceRef = useRef(null);
  const [renderError, setRenderError] = useState('');

  const {
    payload,
    fgColor,
    bgColor,
    isTransparent,
    dotType,
    cornerSquareType,
    cornerDotType,
    logoUrl,
    logoScale,
    logoMargin,
    eccLevel,
    ctaFrame,
    ctaText,
  } = config;

  const effectiveEcc = logoUrl ? 'H' : eccLevel;
  const metadata = analyzeQRMetadata(payload, effectiveEcc);
  const contrastInfo = checkContrast(fgColor, bgColor, isTransparent);

  // Inisialisasi atau pembaruan mesin QR dengan proteksi anti-crash
  useEffect(() => {
    if (!containerRef.current) return;

    try {
      if (!qrInstanceRef.current) {
        qrInstanceRef.current = createQrInstance({
          ...config,
          eccLevel: effectiveEcc,
          size: 240,
        });
        containerRef.current.innerHTML = '';
        qrInstanceRef.current.append(containerRef.current);
      } else {
        qrInstanceRef.current.update({
          data: payload || 'https://anyqr.dev',
          image: logoUrl || undefined,
          qrOptions: {
            errorCorrectionLevel: effectiveEcc,
          },
          imageOptions: {
            hideBehindDots: true,
            imageSize: logoScale,
            margin: logoMargin,
          },
          dotsOptions: {
            color: fgColor,
            type: dotType,
          },
          backgroundOptions: {
            color: isTransparent ? 'rgba(0,0,0,0)' : bgColor,
          },
          cornersSquareOptions: {
            color: fgColor,
            type: cornerSquareType,
          },
          cornersDotOptions: {
            color: fgColor,
            type: cornerDotType,
          },
        });
      }
      setRenderError('');
    } catch (err) {
      console.warn('QR Render caught safe exception:', err);
      setRenderError('Ukuran file atau panjang teks melebihi kapasitas standar QR Code (Maks ~2 KB).');
    }
  }, [
    payload,
    fgColor,
    bgColor,
    isTransparent,
    dotType,
    cornerSquareType,
    cornerDotType,
    logoUrl,
    logoScale,
    logoMargin,
    effectiveEcc,
  ]);

  return (
    <div className="preview-sticky-stage">
      <div className="stage-card">
        {/* Label Pratinjau */}
        <div className="stage-badge-live">
          <span className="pulse-dot"></span>
          <span>Pratinjau Langsung</span>
        </div>

        {/* Kotak Pratinjau QR Code dengan Bingkai CTA */}
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {ctaFrame === 'top-header' && (
            <div style={{
              background: fgColor,
              color: isTransparent || bgColor === '#FFFFFF' ? '#ffffff' : bgColor,
              padding: '6px 20px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '0.06em',
              marginBottom: '12px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {ctaText}
            </div>
          )}

          {ctaFrame === 'phone-mockup' ? (
            <div style={{
              border: `10px solid ${fgColor}`,
              borderRadius: '32px',
              padding: '24px 16px 20px',
              background: isTransparent ? 'transparent' : bgColor,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              boxShadow: 'var(--shadow-lg)',
              position: 'relative',
            }}>
              <div style={{
                width: '40px',
                height: '4px',
                background: 'rgba(0,0,0,0.15)',
                borderRadius: '4px',
                marginBottom: '14px',
              }} />
              
              <div
                className={`qr-preview-box ${isTransparent ? 'transparent-bg' : ''}`}
                style={{ width: '240px', height: '240px', margin: 0, padding: 0, background: 'transparent' }}
              >
                {renderError ? (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                    padding: '16px',
                    background: '#fef2f2',
                    borderRadius: 'var(--radius-md)',
                    border: '1.5px dashed #f87171',
                    color: '#991b1b',
                    gap: '6px',
                  }}>
                    <AlertTriangle size={28} style={{ color: '#dc2626' }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Data Melebihi Kapasitas</span>
                    <span style={{ fontSize: '0.6875rem', color: '#b91c1c', lineHeight: 1.4 }}>
                      Kapasitas maksimal QR Code adalah ~2 KB. Silakan kurangi teks atau gunakan file yang lebih kecil.
                    </span>
                  </div>
                ) : (
                  <div ref={containerRef} style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
                )}
              </div>

              <div style={{
                marginTop: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                color: fgColor,
                letterSpacing: '0.04em',
              }}>
                {ctaText}
              </div>
            </div>
          ) : (
            <div
              className={`qr-preview-box ${isTransparent ? 'transparent-bg' : ''}`}
              style={{ background: isTransparent ? undefined : bgColor }}
            >
              {renderError ? (
                <div style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  padding: '16px',
                  background: '#fef2f2',
                  borderRadius: 'var(--radius-md)',
                  border: '1.5px dashed #f87171',
                  color: '#991b1b',
                  gap: '6px',
                }}>
                  <AlertTriangle size={28} style={{ color: '#dc2626' }} />
                  <span style={{ fontSize: '0.8125rem', fontWeight: 700 }}>Data Melebihi Kapasitas</span>
                  <span style={{ fontSize: '0.6875rem', color: '#b91c1c', lineHeight: 1.4 }}>
                    Kapasitas maksimal QR Code adalah ~2 KB. Silakan kurangi teks atau gunakan file yang lebih kecil.
                  </span>
                </div>
              ) : (
                <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
              )}
            </div>
          )}

          {ctaFrame === 'bottom-ribbon' && (
            <div style={{
              background: fgColor,
              color: isTransparent || bgColor === '#FFFFFF' ? '#ffffff' : bgColor,
              padding: '6px 24px',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8125rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              marginTop: '10px',
              boxShadow: 'var(--shadow-sm)',
            }}>
              {ctaText}
            </div>
          )}
        </div>

        {/* Indikator Kemudahan Scan */}
        <div className={`contrast-badge ${contrastInfo.status}`} style={{ marginTop: '16px' }}>
          {contrastInfo.isPassing ? <CheckCircle2 size={13} /> : <ShieldAlert size={13} />}
          <span>{contrastInfo.badgeText}</span>
        </div>

        {/* Ringkasan Teknis dengan Penjelasan Tooltip saat Kursor Diarahkan */}
        <div className="metadata-deck">
          {/* Koreksi Eror */}
          <div className="metadata-item">
            <span className="metadata-label">
              <span>
                <Cpu size={11} style={{ display: 'inline', marginRight: '4px' }} />
                Koreksi Eror
              </span>
              <HelpCircle size={11} className="metadata-info-icon" />
            </span>
            <span className="metadata-value">
              Level {effectiveEcc} ({metadata.eccPercent})
            </span>
            <div className="metadata-tooltip">
              <span className="metadata-tooltip-title">Daya Tahan Kerusakan</span>
              <span className="metadata-tooltip-desc">
                Tingkat ketahanan data jika QR tergores, kotor, atau tertutup logo di tengah. Level M aman hingga 15%, dan Level H aman hingga 30%.
              </span>
            </div>
          </div>

          {/* Ukuran Grid */}
          <div className="metadata-item">
            <span className="metadata-label">
              <span>
                <Database size={11} style={{ display: 'inline', marginRight: '4px' }} />
                Ukuran Grid
              </span>
              <HelpCircle size={11} className="metadata-info-icon" />
            </span>
            <span className="metadata-value">
              {metadata.dimensions}
            </span>
            <div className="metadata-tooltip">
              <span className="metadata-tooltip-title">Kerapatan Titik QR</span>
              <span className="metadata-tooltip-desc">
                Jumlah baris dan kolom titik. Semakin sedikit titiknya (seperti 21×21), semakin cepat dan mudah dibaca kamera HP dari jarak jauh.
              </span>
            </div>
          </div>

          {/* Tipe Data */}
          <div className="metadata-item">
            <span className="metadata-label">
              <span>
                <Binary size={11} style={{ display: 'inline', marginRight: '4px' }} />
                Tipe Data
              </span>
              <HelpCircle size={11} className="metadata-info-icon" />
            </span>
            <span className="metadata-value">
              {metadata.mode}
            </span>
            <div className="metadata-tooltip">
              <span className="metadata-tooltip-title">Format Karakter</span>
              <span className="metadata-tooltip-desc">
                Format karakter data. Byte (UTF-8) mendukung semua huruf besar/kecil, angka, simbol link, hingga emoji secara universal.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
