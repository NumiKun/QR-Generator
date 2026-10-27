import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import InputStudio from './components/InputStudio';
import MatrixStudio from './components/MatrixStudio';
import ColorStudio from './components/ColorStudio';
import LogoStudio from './components/LogoStudio';
import CtaStudio from './components/CtaStudio';
import PreviewStage from './components/PreviewStage';
import ExportDeck from './components/ExportDeck';
import PrintModal from './components/PrintModal';

const STORAGE_KEY = 'anyqr_user_preferences_v1';
const THEME_STORAGE_KEY = 'anyqr_theme_preference';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('AnyQR ErrorBoundary caught:', error, errorInfo);
  }

  handleReset = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          textAlign: 'center',
          background: 'var(--bg-app, #f8fafc)',
          color: 'var(--text-primary, #0f172a)',
          fontFamily: 'system-ui, -apple-system, sans-serif',
        }}>
          <div style={{
            maxWidth: '460px',
            background: 'var(--bg-surface, #ffffff)',
            padding: '36px 28px',
            borderRadius: '16px',
            border: '1px solid var(--border-subtle, #e2e8f0)',
            boxShadow: 'var(--shadow-md, 0 10px 25px -5px rgba(15, 23, 42, 0.08))',
          }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '8px', color: '#dc2626' }}>
              Terjadi Kesalahan Memuat Data
            </h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #64748b)', marginBottom: '24px', lineHeight: 1.5 }}>
              Data payload atau gambar yang dipilih melebihi batas kapasitas QR Code.
            </p>
            <button
              onClick={this.handleReset}
              style={{
                background: 'var(--color-primary, #4f46e5)',
                color: '#ffffff',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '8px',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Reset ke Tampilan Normal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // State initialization with LocalStorage persistence
  const [payload, setPayload] = useState('https://anyqr.dev');
  const [inputMode, setInputMode] = useState('url');
  const [fgColor, setFgColor] = useState('#0F172A');
  const [bgColor, setBgColor] = useState('#FFFFFF');
  const [isTransparent, setIsTransparent] = useState(false);
  const [dotType, setDotType] = useState('rounded');
  const [cornerSquareType, setCornerSquareType] = useState('extra-rounded');
  const [cornerDotType, setCornerDotType] = useState('dot');
  const [logoUrl, setLogoUrl] = useState('');
  const [logoScale, setLogoScale] = useState(0.24);
  const [logoMargin, setLogoMargin] = useState(4);
  const [eccLevel, setEccLevel] = useState('M');
  const [ctaFrame, setCtaFrame] = useState('none');
  const [ctaText, setCtaText] = useState('SCAN ME');

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Theme state with localStorage and prefers-color-scheme support
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'dark' || saved === 'light') return saved;
      if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        return 'dark';
      }
    } catch {
      // Ignore
    }
    return 'light';
  });

  // Sync theme with document attributes & localStorage
  useEffect(() => {
    try {
      document.documentElement.setAttribute('data-theme', theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Ignore
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Restore user preferences from LocalStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.fgColor) setFgColor(parsed.fgColor);
        if (parsed.bgColor) setBgColor(parsed.bgColor);
        if (typeof parsed.isTransparent === 'boolean') setIsTransparent(parsed.isTransparent);
        if (parsed.dotType) setDotType(parsed.dotType);
        if (parsed.cornerSquareType) setCornerSquareType(parsed.cornerSquareType);
        if (parsed.cornerDotType) setCornerDotType(parsed.cornerDotType);
        if (parsed.ctaFrame) setCtaFrame(parsed.ctaFrame);
        if (parsed.ctaText) setCtaText(parsed.ctaText);
      }
    } catch {
      // Ignore storage error
    }
  }, []);

  // Save preferences to LocalStorage
  useEffect(() => {
    try {
      const stateToPersist = {
        fgColor,
        bgColor,
        isTransparent,
        dotType,
        cornerSquareType,
        cornerDotType,
        ctaFrame,
        ctaText,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(stateToPersist));
    } catch {
      // Ignore storage error
    }
  }, [fgColor, bgColor, isTransparent, dotType, cornerSquareType, cornerDotType, ctaFrame, ctaText]);

  const currentConfig = {
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
  };

  return (
    <ErrorBoundary>
      <div className="app-shell" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header theme={theme} toggleTheme={toggleTheme} />

        <main className="studio-layout">
          {/* Left Column: Customization Studio Workspace */}
          <div className="studio-workspace">
            <InputStudio
              payload={payload}
              setPayload={setPayload}
              inputMode={inputMode}
              setInputMode={setInputMode}
            />

            <ColorStudio
              fgColor={fgColor}
              setFgColor={setFgColor}
              bgColor={bgColor}
              setBgColor={setBgColor}
              isTransparent={isTransparent}
              setIsTransparent={setIsTransparent}
            />

            <MatrixStudio
              dotType={dotType}
              setDotType={setDotType}
              cornerSquareType={cornerSquareType}
              setCornerSquareType={setCornerSquareType}
              cornerDotType={cornerDotType}
              setCornerDotType={setCornerDotType}
            />

            <LogoStudio
              logoUrl={logoUrl}
              setLogoUrl={setLogoUrl}
              logoScale={logoScale}
              setLogoScale={setLogoScale}
              logoMargin={logoMargin}
              setLogoMargin={setLogoMargin}
              eccLevel={eccLevel}
              setEccLevel={setEccLevel}
            />

            <CtaStudio
              ctaFrame={ctaFrame}
              setCtaFrame={setCtaFrame}
              ctaText={ctaText}
              setCtaText={setCtaText}
            />
          </div>

          {/* Right Column: Sticky Live Vector Stage & Export Deck */}
          <aside className="preview-sidebar-sticky">
            <PreviewStage config={currentConfig} />
            <ExportDeck
              config={currentConfig}
              onOpenPrint={() => setIsPrintModalOpen(true)}
            />
          </aside>
        </main>

        {/* Printable Sheet Modal */}
        {isPrintModalOpen && (
          <PrintModal
            config={currentConfig}
            onClose={() => setIsPrintModalOpen(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
