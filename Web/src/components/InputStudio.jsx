import React, { useState } from 'react';
import { Link2, AlignLeft, Upload, Wifi, X, AlertCircle, CheckCircle2 } from 'lucide-react';
import { getByteLength } from '../utils/metadata';

export default function InputStudio({ payload, setPayload, inputMode, setInputMode }) {
  const [wifiData, setWifiData] = useState({
    ssid: '',
    password: '',
    encryption: 'WPA',
    hidden: false,
  });

  // Handle URL normalization
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

  // Live URL validation check
  const isUrlValid = (url) => {
    if (!url) return false;
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return Boolean(parsed.hostname && parsed.hostname.includes('.'));
    } catch {
      return false;
    }
  };

  // Image/File binary upload
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2500) {
      alert(`Peringatan: Ukuran file (${Math.round(file.size / 1024)} KB) melebihi kapasitas standar QR code (~2.5 KB). Kamera scanner mungkin kesulitan membacanya.`);
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPayload(ev.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle WiFi payload formatting: WIFI:S:MySSID;T:WPA;P:MyPassword;H:false;;
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
  const byteCount = getByteLength(payload);

  return (
    <section className="studio-card">
      <div className="card-header">
        <div className="card-title-group">
          <div className="card-icon-box">
            <Link2 size={18} />
          </div>
          <div>
            <h2 className="card-title">Input Channel & Payload</h2>
            <p className="card-subtitle">Zero-telemetry client-side payload management</p>
          </div>
        </div>
      </div>

      {/* Segmented Mode Selector */}
      <div className="segmented-tabs">
        <button
          className={`tab-btn ${inputMode === 'url' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('url');
            if (!payload || payload.startsWith('WIFI:') || payload.startsWith('data:')) {
              setPayload('https://');
            }
          }}
        >
          <Link2 size={15} />
          <span>URL Link</span>
        </button>

        <button
          className={`tab-btn ${inputMode === 'text' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('text');
            if (payload === 'https://') setPayload('');
          }}
        >
          <AlignLeft size={15} />
          <span>Plain Text</span>
        </button>

        <button
          className={`tab-btn ${inputMode === 'wifi' ? 'active' : ''}`}
          onClick={() => {
            setInputMode('wifi');
            updateWifiPayload(wifiData);
          }}
        >
          <Wifi size={15} />
          <span>Wi-Fi</span>
        </button>

        <button
          className={`tab-btn ${inputMode === 'file' ? 'active' : ''}`}
          onClick={() => setInputMode('file')}
        >
          <Upload size={15} />
          <span>File / Image</span>
        </button>
      </div>

      {/* URL Mode */}
      {inputMode === 'url' && (
        <div className="input-group">
          <div className="input-label">
            <span>Destination Website / Endpoint</span>
            {payload && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                {isUrlValid(payload) ? (
                  <span style={{ color: '#10b981', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CheckCircle2 size={13} /> Valid URL
                  </span>
                ) : (
                  <span style={{ color: '#f59e0b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <AlertCircle size={13} /> Incomplete URL
                  </span>
                )}
              </span>
            )}
          </div>
          <div className="input-wrapper">
            <input
              type="text"
              className="text-input"
              placeholder="https://yourbrand.com/campaign"
              value={payload}
              onChange={(e) => handleUrlChange(e.target.value)}
              onBlur={handleNormalizeUrl}
            />
            {payload && (
              <button
                className="input-clear-btn"
                onClick={() => setPayload('')}
                title="Clear input"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="byte-counter-bar">
            <span>Auto-normalized on blur</span>
            <span>{charCount} chars • {byteCount} bytes</span>
          </div>
        </div>
      )}

      {/* Plain Text Mode */}
      {inputMode === 'text' && (
        <div className="input-group">
          <div className="input-label">
            <span>Text Content / Notes / Message</span>
            <span>{charCount} chars • {byteCount} bytes</span>
          </div>
          <div className="input-wrapper">
            <textarea
              className="textarea-input"
              placeholder="Enter multi-line text, instructions, or raw payloads..."
              value={payload}
              onChange={(e) => setPayload(e.target.value)}
            />
            {payload && (
              <button
                className="input-clear-btn"
                style={{ top: '12px' }}
                onClick={() => setPayload('')}
                title="Clear input"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <div className="byte-counter-bar">
            <span>Supports UTF-8 multi-byte encoding</span>
            <span style={{ color: byteCount > 1500 ? '#ef4444' : 'var(--text-muted)' }}>
              {byteCount > 1500 ? 'High density (scan speed may reduce)' : 'Optimal density'}
            </span>
          </div>
        </div>
      )}

      {/* Wi-Fi Mode */}
      {inputMode === 'wifi' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div className="grid-2">
            <div className="input-group">
              <label className="input-label">Network Name (SSID)</label>
              <input
                type="text"
                className="text-input"
                placeholder="MyOffice_WiFi"
                value={wifiData.ssid}
                onChange={(e) => updateWifiPayload({ ...wifiData, ssid: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label className="input-label">Security</label>
              <select
                className="text-input"
                value={wifiData.encryption}
                onChange={(e) => updateWifiPayload({ ...wifiData, encryption: e.target.value })}
              >
                <option value="WPA">WPA / WPA2 / WPA3 (Default)</option>
                <option value="WEP">WEP</option>
                <option value="nopass">No Password (Open)</option>
              </select>
            </div>
          </div>

          {wifiData.encryption !== 'nopass' && (
            <div className="input-group">
              <label className="input-label">Wi-Fi Password</label>
              <input
                type="text"
                className="text-input"
                placeholder="SuperSecretPassword123"
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
            <label htmlFor="hidden-wifi" style={{ cursor: 'pointer' }}>Hidden Network (SSID broadcast disabled)</label>
          </div>
        </div>
      )}

      {/* File / Image Upload Mode */}
      {inputMode === 'file' && (
        <div className="input-group">
          <label className="input-label">Local File / Image Ingestion</label>
          <div
            style={{
              border: '2px dashed var(--border-default)',
              borderRadius: 'var(--radius-md)',
              padding: '24px 16px',
              textAlign: 'center',
              background: '#f8fafc',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 150ms ease, border-color 150ms ease',
            }}
            onClick={() => document.getElementById('payload-file-input')?.click()}
          >
            <Upload size={28} style={{ color: 'var(--color-primary)' }} />
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>Click to browse or drop small image/file</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Encodes to client-side Base64 Data URI (recommended &lt; 2KB for optimal mobile scanning)
            </span>
            <input
              id="payload-file-input"
              type="file"
              style={{ display: 'none' }}
              onChange={handleFileUpload}
            />
          </div>

          {payload && payload.startsWith('data:') && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', fontSize: '0.75rem' }}>
              <span style={{ color: '#10b981' }}>File loaded into local memory</span>
              <button
                onClick={() => setPayload('')}
                style={{ color: '#ef4444', textDecoration: 'underline' }}
              >
                Remove payload
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
