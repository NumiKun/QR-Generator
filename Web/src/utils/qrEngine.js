import QRCodeStyling from 'qr-code-styling';

/**
 * Creates or updates a QRCodeStyling instance with specified options
 * @param {object} config
 * @returns {QRCodeStyling}
 */
export function createQrInstance(config) {
  const {
    data,
    payload,
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

  const resolvedData = data || payload || 'https://anyqr.dev';

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'canvas',
    data: resolvedData,
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
 * Helper to draw a rounded rectangle on a 2D canvas context with full fallback
 */
function drawRoundRect(ctx, x, y, width, height, radius) {
  const r = Math.max(0, Math.min(radius, width / 2, height / 2));
  if (typeof ctx.roundRect === 'function') {
    ctx.beginPath();
    ctx.roundRect(x, y, width, height, r);
  } else {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + width, y, x + width, y + height, r);
    ctx.arcTo(x + width, y + height, x, y + height, r);
    ctx.arcTo(x, y + height, x, y, r);
    ctx.arcTo(x, y + width, x, y, r);
    ctx.closePath();
  }
}

/**
 * Escapes unsafe characters for XML / SVG attributes and text nodes
 */
function escapeXml(unsafe) {
  return (unsafe || '').replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}

/**
 * Triggers browser download for a Blob
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.download = filename;
  a.href = url;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Generates an offscreen Canvas element containing the QR code and any chosen CTA frame
 * @param {object} config
 * @param {number} qrSize
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function generateCompositeCanvas(config, qrSize = 2048) {
  const {
    ctaFrame = 'none',
    ctaText = 'SCAN ME',
    fgColor = '#0F172A',
    bgColor = '#FFFFFF',
    isTransparent = false,
  } = config;

  const label = (ctaText || 'SCAN ME').toUpperCase();

  // 1. Generate the raw QR code as an image
  const qrEngine = createQrInstance({
    ...config,
    size: qrSize,
  });

  const qrBlob = await qrEngine.getRawData('png');
  const qrImg = new Image();
  const qrUrl = URL.createObjectURL(qrBlob);
  await new Promise((resolve, reject) => {
    qrImg.onload = resolve;
    qrImg.onerror = reject;
    qrImg.src = qrUrl;
  });
  URL.revokeObjectURL(qrUrl);

  // If no frame is selected, return the bare QR canvas directly
  if (ctaFrame === 'none') {
    const canvas = document.createElement('canvas');
    canvas.width = qrSize;
    canvas.height = qrSize;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);
    return canvas;
  }

  // 2. Composition for Top Header
  if (ctaFrame === 'top-header') {
    const outerPad = Math.round(qrSize * 0.08);
    const gap = Math.round(qrSize * 0.05);
    const pillH = Math.round(qrSize * 0.08);
    const fontSize = Math.round(pillH * 0.52);

    const totalW = qrSize + 2 * outerPad;
    const totalH = outerPad + pillH + gap + qrSize + outerPad;

    const canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    if (!isTransparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, totalW, totalH);
    }

    ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const textW = ctx.measureText(label).width;
    const pillPadding = pillH * 1.4;
    const pillW = Math.max(pillH * 2.5, Math.min(totalW - 2 * outerPad, textW + pillPadding));
    const pillX = (totalW - pillW) / 2;
    const pillY = outerPad;

    drawRoundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = fgColor;
    ctx.fill();

    ctx.fillStyle = (isTransparent || bgColor.toUpperCase() === '#FFFFFF') ? '#FFFFFF' : bgColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.06em';
    ctx.fillText(label, totalW / 2, pillY + pillH / 2);

    const qrX = outerPad;
    const qrY = outerPad + pillH + gap;
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    return canvas;
  }

  // 3. Composition for Bottom Ribbon
  if (ctaFrame === 'bottom-ribbon') {
    const outerPad = Math.round(qrSize * 0.08);
    const gap = Math.round(qrSize * 0.05);
    const pillH = Math.round(qrSize * 0.08);
    const fontSize = Math.round(pillH * 0.52);

    const totalW = qrSize + 2 * outerPad;
    const totalH = outerPad + qrSize + gap + pillH + outerPad;

    const canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    if (!isTransparent) {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, totalW, totalH);
    }

    const qrX = outerPad;
    const qrY = outerPad;
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);

    ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const textW = ctx.measureText(label).width;
    const pillPadding = pillH * 1.4;
    const pillW = Math.max(pillH * 2.5, Math.min(totalW - 2 * outerPad, textW + pillPadding));
    const pillX = (totalW - pillW) / 2;
    const pillY = outerPad + qrSize + gap;

    drawRoundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = fgColor;
    ctx.fill();

    ctx.fillStyle = (isTransparent || bgColor.toUpperCase() === '#FFFFFF') ? '#FFFFFF' : bgColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.08em';
    ctx.fillText(label, totalW / 2, pillY + pillH / 2);

    return canvas;
  }

  // 4. Composition for Phone Mockup Frame
  if (ctaFrame === 'phone-mockup') {
    const scale = qrSize / 240;
    const borderW = Math.round(10 * scale);
    const borderRadius = Math.round(40 * scale);
    const padX = Math.round(16 * scale);
    const padTop = Math.round(22 * scale);
    const notchW = Math.round(50 * scale);
    const notchH = Math.round(4.5 * scale);
    const notchMarginBottom = Math.round(16 * scale);
    const qrRadius = Math.round(18 * scale);
    const ctaMarginTop = Math.round(14 * scale);
    const fontSize = Math.round(12 * scale);
    const padBottom = Math.round(18 * scale);
    const outerMargin = Math.round(16 * scale);

    const innerPhoneW = qrSize + 2 * padX;
    const outerPhoneW = innerPhoneW + 2 * borderW;
    const innerPhoneH = padTop + notchH + notchMarginBottom + qrSize + ctaMarginTop + fontSize + padBottom;
    const outerPhoneH = innerPhoneH + 2 * borderW;

    const totalW = outerPhoneW + 2 * outerMargin;
    const totalH = outerPhoneH + 2 * outerMargin;

    const canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    const phoneX = outerMargin;
    const phoneY = outerMargin;

    // Interior phone background
    if (!isTransparent) {
      drawRoundRect(ctx, phoneX + borderW, phoneY + borderW, outerPhoneW - 2 * borderW, outerPhoneH - 2 * borderW, borderRadius - borderW);
      ctx.fillStyle = bgColor;
      ctx.fill();
    }

    // Outer phone bezel
    drawRoundRect(ctx, phoneX + borderW / 2, phoneY + borderW / 2, outerPhoneW - borderW, outerPhoneH - borderW, borderRadius - borderW / 2);
    ctx.lineWidth = borderW;
    ctx.strokeStyle = fgColor;
    ctx.stroke();

    // Speaker notch
    const notchX = phoneX + (outerPhoneW - notchW) / 2;
    const notchY = phoneY + borderW + padTop;
    drawRoundRect(ctx, notchX, notchY, notchW, notchH, notchH / 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fill();

    // QR code with rounded corners
    const qrX = phoneX + borderW + padX;
    const qrY = phoneY + borderW + padTop + notchH + notchMarginBottom;
    ctx.save();
    drawRoundRect(ctx, qrX, qrY, qrSize, qrSize, qrRadius);
    ctx.clip();
    ctx.drawImage(qrImg, qrX, qrY, qrSize, qrSize);
    ctx.restore();

    // Bottom CTA label
    const textY = qrY + qrSize + ctaMarginTop + fontSize / 2;
    ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = fgColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.06em';
    ctx.fillText(label, phoneX + outerPhoneW / 2, textY);

    return canvas;
  }

  // Fallback bare canvas
  const canvas = document.createElement('canvas');
  canvas.width = qrSize;
  canvas.height = qrSize;
  const ctx = canvas.getContext('2d');
  ctx.drawImage(qrImg, 0, 0, qrSize, qrSize);
  return canvas;
}

/**
 * Generates composite vector SVG markup for high-precision vector export
 * @param {object} config
 * @param {number} qrSize
 * @returns {Promise<Blob>}
 */
export async function generateCompositeSvgBlob(config, qrSize = 1024) {
  const {
    ctaFrame = 'none',
    ctaText = 'SCAN ME',
    fgColor = '#0F172A',
    bgColor = '#FFFFFF',
    isTransparent = false,
  } = config;

  const label = (ctaText || 'SCAN ME').toUpperCase();

  const qrSvgEngine = new QRCodeStyling({
    ...createQrInstance({ ...config, size: qrSize })._options,
    type: 'svg',
  });

  const rawSvgBlob = await qrSvgEngine.getRawData('svg');
  if (ctaFrame === 'none') {
    return rawSvgBlob;
  }

  const rawSvgText = await rawSvgBlob.text();
  const match = rawSvgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent = match ? match[1] : rawSvgText;

  // Measure text width using an offscreen canvas
  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');

  if (ctaFrame === 'top-header') {
    const outerPad = Math.round(qrSize * 0.08);
    const gap = Math.round(qrSize * 0.05);
    const pillH = Math.round(qrSize * 0.08);
    const fontSize = Math.round(pillH * 0.52);

    const totalW = qrSize + 2 * outerPad;
    const totalH = outerPad + pillH + gap + qrSize + outerPad;

    measureCtx.font = `800 ${fontSize}px sans-serif`;
    const textW = measureCtx.measureText(label).width;
    const pillPadding = pillH * 1.4;
    const pillW = Math.max(pillH * 2.5, Math.min(totalW - 2 * outerPad, textW + pillPadding));
    const pillX = (totalW - pillW) / 2;
    const pillY = outerPad;
    const qrX = outerPad;
    const qrY = outerPad + pillH + gap;
    const textColor = isTransparent || bgColor.toUpperCase() === '#FFFFFF' ? '#ffffff' : bgColor;

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  ${!isTransparent ? `<rect width="100%" height="100%" fill="${bgColor}" />` : ''}
  <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${fgColor}" />
  <text x="${totalW / 2}" y="${pillY + pillH / 2}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="${fontSize}" fill="${textColor}" text-anchor="middle" dominant-baseline="central" letter-spacing="0.06em">${escapeXml(label)}</text>
  <svg x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">
    ${innerContent}
  </svg>
</svg>`;
    return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  }

  if (ctaFrame === 'bottom-ribbon') {
    const outerPad = Math.round(qrSize * 0.08);
    const gap = Math.round(qrSize * 0.05);
    const pillH = Math.round(qrSize * 0.08);
    const fontSize = Math.round(pillH * 0.52);

    const totalW = qrSize + 2 * outerPad;
    const totalH = outerPad + qrSize + gap + pillH + outerPad;

    measureCtx.font = `800 ${fontSize}px sans-serif`;
    const textW = measureCtx.measureText(label).width;
    const pillPadding = pillH * 1.4;
    const pillW = Math.max(pillH * 2.5, Math.min(totalW - 2 * outerPad, textW + pillPadding));
    const pillX = (totalW - pillW) / 2;
    const pillY = outerPad + qrSize + gap;
    const qrX = outerPad;
    const qrY = outerPad;
    const textColor = isTransparent || bgColor.toUpperCase() === '#FFFFFF' ? '#ffffff' : bgColor;

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  ${!isTransparent ? `<rect width="100%" height="100%" fill="${bgColor}" />` : ''}
  <svg x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">
    ${innerContent}
  </svg>
  <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${fgColor}" />
  <text x="${totalW / 2}" y="${pillY + pillH / 2}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="${fontSize}" fill="${textColor}" text-anchor="middle" dominant-baseline="central" letter-spacing="0.08em">${escapeXml(label)}</text>
</svg>`;
    return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  }

  if (ctaFrame === 'phone-mockup') {
    const scale = qrSize / 240;
    const borderW = Math.round(10 * scale);
    const borderRadius = Math.round(40 * scale);
    const padX = Math.round(16 * scale);
    const padTop = Math.round(22 * scale);
    const notchW = Math.round(50 * scale);
    const notchH = Math.round(4.5 * scale);
    const notchMarginBottom = Math.round(16 * scale);
    const qrRadius = Math.round(18 * scale);
    const ctaMarginTop = Math.round(14 * scale);
    const fontSize = Math.round(12 * scale);
    const padBottom = Math.round(18 * scale);
    const outerMargin = Math.round(16 * scale);

    const innerPhoneW = qrSize + 2 * padX;
    const outerPhoneW = innerPhoneW + 2 * borderW;
    const innerPhoneH = padTop + notchH + notchMarginBottom + qrSize + ctaMarginTop + fontSize + padBottom;
    const outerPhoneH = innerPhoneH + 2 * borderW;

    const totalW = outerPhoneW + 2 * outerMargin;
    const totalH = outerPhoneH + 2 * outerMargin;

    const phoneX = outerMargin;
    const phoneY = outerMargin;
    const notchX = phoneX + (outerPhoneW - notchW) / 2;
    const notchY = phoneY + borderW + padTop;
    const qrX = phoneX + borderW + padX;
    const qrY = phoneY + borderW + padTop + notchH + notchMarginBottom;
    const textY = qrY + qrSize + ctaMarginTop + fontSize / 2;

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <clipPath id="phone-qr-clip">
      <rect x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" rx="${qrRadius}" />
    </clipPath>
  </defs>
  ${!isTransparent ? `<rect x="${phoneX + borderW}" y="${phoneY + borderW}" width="${outerPhoneW - 2 * borderW}" height="${outerPhoneH - 2 * borderW}" rx="${borderRadius - borderW}" fill="${bgColor}" />` : ''}
  <rect x="${phoneX + borderW / 2}" y="${phoneY + borderW / 2}" width="${outerPhoneW - borderW}" height="${outerPhoneH - borderW}" rx="${borderRadius - borderW / 2}" fill="none" stroke="${fgColor}" stroke-width="${borderW}" />
  <rect x="${notchX}" y="${notchY}" width="${notchW}" height="${notchH}" rx="${notchH / 2}" fill="rgba(0, 0, 0, 0.18)" />
  <g clip-path="url(#phone-qr-clip)">
    <svg x="${qrX}" y="${qrY}" width="${qrSize}" height="${qrSize}" viewBox="0 0 ${qrSize} ${qrSize}">
      ${innerContent}
    </svg>
  </g>
  <text x="${phoneX + outerPhoneW / 2}" y="${textY}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="${fontSize}" fill="${fgColor}" text-anchor="middle" dominant-baseline="central" letter-spacing="0.06em">${escapeXml(label)}</text>
</svg>`;
    return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  }

  return rawSvgBlob;
}

/**
 * Exports QR code as raster PNG with custom resolution (e.g. 1024 or 2048 for 4K)
 * including any selected CTA frame
 * @param {object} config
 * @param {number} resolution
 * @param {string} filename
 */
export async function exportPng(config, resolution = 2048, filename = 'anyqr-code') {
  const canvas = await generateCompositeCanvas(config, resolution);
  await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        triggerDownload(blob, `${filename}.png`);
      }
      resolve();
    }, 'image/png');
  });
}

/**
 * Exports clean vector SVG with frame preset included
 * @param {object} config
 * @param {string} filename
 */
export async function exportSvg(config, filename = 'anyqr-code') {
  const svgBlob = await generateCompositeSvgBlob(config, 1024);
  triggerDownload(svgBlob, `${filename}.svg`);
}

/**
 * Copies the complete QR code (with frame if selected) image blob directly to system clipboard
 * @param {object} config
 * @returns {Promise<boolean>}
 */
export async function copyToClipboard(config) {
  try {
    const canvas = await generateCompositeCanvas(config, 1024);
    return new Promise((resolve) => {
      canvas.toBlob(async (blob) => {
        if (!blob) return resolve(false);
        try {
          const item = new ClipboardItem({ 'image/png': blob });
          await navigator.clipboard.write([item]);
          resolve(true);
        } catch (err) {
          console.error('Clipboard copy failed:', err);
          resolve(false);
        }
      }, 'image/png');
    });
  } catch (err) {
    console.error('Clipboard copy failed:', err);
    return false;
  }
}

/**
 * Generates an image Data URL for previewing or printing
 * @param {object} config
 * @param {number} size
 * @returns {Promise<string>}
 */
export async function getCompositeDataUrl(config, size = 600) {
  const canvas = await generateCompositeCanvas(config, size);
  return canvas.toDataURL('image/png');
}
