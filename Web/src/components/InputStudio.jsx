import React, { useState } from 'react';
import { Link2, AlignLeft, Upload, Wifi, X, AlertCircle, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { compressImageToDataUri } from '../utils/imageCompressor';

export default function InputStudio({ payload, setPayload, inputMode, setInputMode }) {
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });

  const [isCompressing, setIsCompressing] = useState(false);
  const [fileError, setFileError] = useState('');

  const handleUrlChange = (val) => {
    setPayload(val);
  };

  const handleNormalizeUrl = () => {
    let clean = payload.trim();
    if (!clean) return;
    if (!/^https?:\/\//i.test(clean)) {
      clean = `https://${clean}`;
    }
    setPayload(clean);
  };

  // Validasi URL
  const isUrlValid = (url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return Boolean(parsed.hostname && parsed.hostname.includes('.'));
    } catch {
      return false;
    }
  };

  // Unggah File / Gambar dengan Auto-Compress agar tidak melebihi kapasitas QR
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileError('');
    setIsCompressing(true);

    try {
      const result = await compressImageToDataUri(file);
      if (result.success && result.dataUri) {
        setPayload(result.dataUri);
      } else {
        setFileError(result.error || 'Ukuran file terlalu besar untuk dimuat ke dalam QR Code.');
      }
    } catch {
      setFileError('Gagal memproses file. Silakan coba file lain yang lebih kecil.');
    } finally {
      setIsCompressing(false);
      // Reset input agar file yang sama bisa dipilih ulang jika diinginkan
      e.target.value = '';
    }
  };

  // Format Wi-Fi: WIFI:S:MySSID;T:WPA;P:MyPassword;H:false;;
  const updateWifiPayload = (updated) => {
    setWifiData(updated);
    const { ssid, password, encryption, hidden } = updated;
    if (!ssid) {
      setPayload('');
      return;
    }
    const wifiString = `WIFI:S:${ssid};T:${encryption};P:${password};H:${hidden ? 'true' : 'false'};;`;
    setPayload(wifiString);
  };

  const charCount = payload ? payload.length : 0;

  return (
    <section className="studio-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-box">
            <Link2 size={18} />
          </div>
          <div>
            <h2 className="card-title">Isi Konten QR Code</h2>
            <p className="card-subtitle">Pilih jenis tautan atau data yang ingin dimasukkan</p>
          </div>
        </div>
      </div>

      {/* Tab Pilihan Mode */}
      <div className="segmented-tabs">
        <button
          className={`tab-btn ${inputMode === 'url' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('url');
            setFileError('');
            if (!payload || payload.startsWith('WIFI:') || payload.startsWith('data:')) {
              setPayload('https://');
            }
          }}
        >
          <Link2 size={15} />
          <span>Tautan / Link</span>
        </button>

        <button
          className={`tab-btn ${inputMode === 'text' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('text');
            setFileError('');
            if (payload === 'https://') setPayload('');
          }}
        >
          <AlignLeft size={15} />
          <span>Teks Biasa</span>
        </button>

        <button
          className={`tab-btn ${inputMode === 'wifi' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('wifi');
            setFileError('');
            updateWifiPayload(wifiData);
          }}
        >
          <Wifi size={15} />
          <span>Wi-Fi</span>
        </button>

        <button
          className={`tab-btn ${inputMode === 'file' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('file');
            setFileError('');
          }}
        >
          <Upload size={15} />
          <span>File / Gambar</span>
        </button>
      </div>

      {/* Mode URL / Link */}
      {inputMode === 'url' && (
        <div className="input-group">
          <div className="input-label">
            <span>Alamat Website atau Link Tujuan</span>
            {payload && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                {isUrlValid(payload) ? (
                  <span style={{ color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> Link Valid
                  </span>
                ) : (
                  <span style={{ color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={13} /> Link Belum Lengkap
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              className="text-input"
              placeholder="https://website-kamu.com"
              value={payload}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleNormalizeUrl}
            />
            {payload && (
              <button
                className="input-clear-btn"
                onClick={() => setPayload('')}
                title="Hapus teks"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="byte-counter-bar">
            <span></span>
            <span>{charCount} karakter</span>
          </div>
        </div>
      )}

      {/* Mode Teks Biasa */}
      {inputMode === 'text' && (
        <div className="input-group">
          <div className="input-label">
            <span>Pesan atau Catatan Teks</span>
            <span>{charCount} karakter</span>
          </div>
          <div className="input-wrapper">
            <textarea
              className="textarea-input"
              placeholder="Ketik teks pesan, pengumuman, atau catatan di sini..."
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />
            {payload && (
              <button
                className="input-clear-btn"
                style={{ top: '12px' }}
                onClick={() => setPayload('')}
                title="Hapus teks"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="byte-counter-bar">
            <span></span>
            <span style={{ color: charCount > 1500 ? '#dc2626' : 'var(--text-muted)' }}>
              {charCount > 1500 ? 'Teks sangat panjang (QR akan sangat rapat)' : `${charCount} karakter`}
            </span>
          </div>
        </div>
      )}

      {/* Mode Wi-Fi */}
      {inputMode === 'wifi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Nama Wi-Fi (SSID)</label>
              <input
                type="text"
                className="text-input"
                placeholder="Contoh: WiFi_Rumah"
                value={wifiData.ssid}
                onChange={(e) => updateWifiPayload({ ...wifiData, ssid: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Tipe Keamanan</label>
              <select
                className="text-input"
                value={wifiData.encryption}
                onChange={(e) => updateWifiPayload({ ...wifiData, encryption: e.target.value })}
              >
                <option value="WPA">WPA / WPA2 (Umum digunakan)</option>
                <option value="WEP">WEP</option>
                <option value="nopass">Tanpa Password (Terbuka)</option>
              </select>
            </div>
          </div>

          {wifiData.encryption !== 'nopass' && (
            <div className="input-group">
              <label className="input-label">Kata Sandi Wi-Fi</label>
              <input
                type="text"
                className="text-input"
                placeholder="Masukkan sandi Wi-Fi..."
                value={wifiData.password}
                onChange={(e) => updateWifiPayload({ ...wifiData, password: e.target.value })}
              />
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
            <input
              type="checkbox"
              id="hidden-wifi"
              checked={wifiData.hidden}
              onChange={(e) => updateWifiPayload({ ...wifiData, hidden: e.target.checked })}
              style={{ cursor: 'pointer' }}
            />
            <label htmlFor="hidden-wifi" style={{ cursor: 'pointer' }}>Jaringan tersembunyi (Hidden SSID)</label>
          </div>
        </div>
      )}

      {/* Mode File / Gambar */}
      {inputMode === 'file' && (
        <div className="input-group">
          <label className="input-label">Unggah Gambar atau File</label>
          
          <div
            style={{
              border: '2px dashed var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 16px',
              textAlign: 'center',
              background: 'var(--bg-surface-elevated)',
              cursor: isCompressing ? 'wait' : 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 150ms ease, border-color 150ms ease',
            }}
            onClick={() => {
              if (!isCompressing) {
                document.getElementById('payload-file-input')?.click();
              }
            }}
          >
            {isCompressing ? (
              <Loader2 size={28} className="animate-spin" style={{ color: 'var(--color-primary)' }} />
            ) : (
              <Upload size={28} style={{ color: 'var(--color-primary)' }} />
            )}

            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              {isCompressing ? 'Sedang memproses dan mengompresi gambar...' : 'Klik untuk memilih gambar atau file'}
            </span>

            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Sistem akan otomatis mengecilkan gambar agar muat dalam batas kapasitas QR Code (~2 KB)
            </span>

            <input
              id="payload-file-input"
              type="file"
              accept="image/*,.txt,.pdf"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          {/* Pesan Kesalahan File Terlalu Besar */}
          {fileError && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(220, 38, 38, 0.1)',
              border: '1px solid rgba(220, 38, 38, 0.25)',
              color: 'var(--color-danger)',
              fontSize: '0.8125rem',
              marginTop: '6px',
            }}>
              <AlertTriangle size={16} style={{ flexShrink: 0 }} />
              <span>{fileError}</span>
            </div>
          )}

          {/* Indikator File yang Berhasil Dimuat */}
          {payload && payload.startsWith('data:') && !fileError && (
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginTop: '8px',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(5, 150, 105, 0.12)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {payload.startsWith('data:image/') && (
                  <img
                    src={payload}
                    alt="Thumbnail"
                    style={{ width: '32px', height: '32px', objectFit: 'contain', borderRadius: '4px', border: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}
                  />
                )}
                <div>
                  <span style={{ color: 'var(--color-success)', fontWeight: 700, fontSize: '0.8125rem', display: 'block' }}>
                    Gambar Siap Dibuat QR
                  </span>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.71875rem' }}>
                    Ukuran data: {Math.round(payload.length / 1024 * 10) / 10} KB (Aman)
                  </span>
                </div>
              </div>

              <button
                onClick={() => setPayload('')}
                style={{
                  color: 'var(--color-danger)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                Hapus
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
