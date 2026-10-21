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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

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
        <div>
          <PreviewStage config={currentConfig} />
          <ExportDeck
            config={currentConfig}
            onOpenPrint={() => setIsPrintModalOpen(true)}
          />
        </div>
      </main>

      {/* Printable Sheet Modal */}
      {isPrintModalOpen && (
        <PrintModal
          config={currentConfig}
          onClose={() => setIsPrintModalOpen(false)}
        />
      )}
    </div>
  );
}
