import QRCodeStyling from 'qr-code-styling';

/**
 * Creates or updates a QRCodeStyling instance with specified options
 * @param {object} config
 * @returns {QRCodeStyling}
 */
export function createQrInstance(config) {
  const {
    data,
    fgColor = '#0F172A',
    bgColor = '#FFFFFF',
    isTransparent = false,
    dotType = 'rounded',
    cornerSquareType = 'extra-rounded',
    cornerDotType = 'dot',
    logoUrl = '',
    logoScale = 0.25,
    logoMargin = 4,
    eccLevel = 'M',
    size = 280,
  } = config;

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'canvas',
    data: data || 'https://anyqr.dev',
    image: logoUrl || undefined,
    margin: 10,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: logoUrl ? 'H' : eccLevel,
    },
    imageOptions: {
      hideBehindDots: true,
      imageSize: logoScale,
      margin: logoMargin,
      crossOrigin: 'anonymous',
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

/**
 * Exports QR code as raster PNG with custom resolution (e.g. 1024 or 2048 for 4K)
 * @param {object} config
 * @param {number} resolution
 * @param {string} filename
 */
export async function exportPng(config, resolution = 2048, filename = 'anyqr-code') {
  const exportEngine = createQrInstance({
    ...config,
    size: resolution,
  });

  await exportEngine.download({
    name: filename,
    extension: 'png',
  });
}

/**
 * Exports clean vector SVG
 * @param {object} config
 * @param {string} filename
 */
export async function exportSvg(config, filename = 'anyqr-code') {
  const exportEngine = new QRCodeStyling({
    ...createQrInstance({ ...config, size: 1024 })._options,
    type: 'svg',
  });

  await exportEngine.download({
    name: filename,
    extension: 'svg',
  });
}

/**
 * Copies the QR code image blob directly to system clipboard
 * @param {object} config
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(config) {
  try {
    const copyEngine = createQrInstance({
      ...config,
      size: 1024,
    });

    const rawBlob = await copyEngine.getRawData('png');
    if (!rawBlob) return false;

    const item = new ClipboardItem({ 'image/png': rawBlob });
    await navigator.clipboard.write([item]);
    return true;
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}
