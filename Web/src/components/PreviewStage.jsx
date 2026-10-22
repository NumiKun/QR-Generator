import React, { useEffect, useRef } from 'react';
import { Cpu, Database, Binary, CheckCircle2, ShieldAlert, HelpCircle } from 'lucide-react';
import { createQrInstance } from '../utils/qrEngine';
import { analyzeQRMetadata } from '../utils/metadata';
import { checkContrast } from '../utils/contrast';

export default function PreviewStage({ config }) {
  const containerRef = useRef(null);
  const qrInstanceRef = useRef(null);

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

  // Inisialisasi atau pembaruan mesin QR
  useEffect(() => {
    if (!containerRef.current) return;

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
                ref={containerRef}
                className={`qr-preview-box ${isTransparent ? 'transparent-bg' : ''}`}
                style={{ width: '240px', height: '240px', margin: 0, padding: 0, background: 'transparent' }}
              />
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
              <div ref={containerRef} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
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
