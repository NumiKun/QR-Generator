import qrcode from 'qrcode-generator';

/**
 * Detects the encoding mode based on text content
 * @param {string} text
 * @returns {'Numeric' | 'Alphanumeric' | 'Byte (UTF-8)'}
 */
export function detectEncodingMode(text) {
  if (!text || text.length === 0) return 'Byte (UTF-8)';
  if (/^\d+$/.test(text)) return 'Numeric';
  if (/^[0-9A-Z $%*+\-./:]+$/.test(text)) return 'Alphanumeric';
  return 'Byte (UTF-8)';
}

/**
 * Calculates byte size in UTF-8
 * @param {string} str
 * @returns {number}
 */
export function getByteLength(str) {
  if (!str) return 0;
  return new Blob([str]).size;
}

/**
 * Calculates QR metadata (version, grid dimensions, module count) using qrcode-generator
 * @param {string} data
 * @param {'L' | 'M' | 'Q' | 'H'} errorCorrectionLevel
 * @returns {object} { version, dimensions, moduleCount, mode, byteCount }
 */
export function analyzeQRMetadata(data, errorCorrectionLevel = 'M') {
  const fallback = {
    version: 1,
    dimensions: '21 × 21',
    moduleCount: 21,
    mode: detectEncodingMode(data),
    byteCount: getByteLength(data),
    eccLevel: errorCorrectionLevel,
    eccPercent: getEccPercent(errorCorrectionLevel),
  };

  if (!data || data.trim() === '') {
    return fallback;
  }

  try {
    // 0 specifies auto version detection
    const qr = qrcode(0, errorCorrectionLevel);
    qr.addData(data);
    qr.make();

    const moduleCount = qr.getModuleCount();
    // Version formula: (moduleCount - 17) / 4
    const version = Math.max(1, Math.round((moduleCount - 17) / 4));

    return {
      version,
      dimensions: `${moduleCount} × ${moduleCount}`,
      moduleCount,
      mode: detectEncodingMode(data),
      byteCount: getByteLength(data),
      eccLevel: errorCorrectionLevel,
      eccPercent: getEccPercent(errorCorrectionLevel),
    };
  } catch {
    return fallback;
  }
}

export function getEccPercent(level) {
  switch (level) {
    case 'L': return '7%';
    case 'M': return '15%';
    case 'Q': return '25%';
    case 'H': return '30%';
    default: return '15%';
  }
}
