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
  // Maintain exact 10px per 240px quiet-zone proportion at any resolution
  const resolvedMargin = Math.max(4, Math.round(size * 0.0417));

  return new QRCodeStyling({
    width: size,
    height: size,
    type: 'canvas',
    data: resolvedData,
    image: logoUrl || undefined,
    margin: resolvedMargin,
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
 * with exact 1:1 proportion to the live website preview
 * @param {object} config
 * @param {number} resolution
 * @returns {Promise<HTMLCanvasElement>}
 */
export async function generateCompositeCanvas(config, resolution = 2048) {
  const {
    ctaFrame = 'none',
    ctaText = 'SCAN ME',
    fgColor = '#0F172A',
    bgColor = '#FFFFFF',
    isTransparent = false,
  } = config;

  const label = (ctaText || 'SCAN ME').toUpperCase();

  // 1. Bare QR code export
  if (ctaFrame === 'none') {
    const qrEngine = createQrInstance({
      ...config,
      size: resolution,
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

    const canvas = document.createElement('canvas');
    canvas.width = resolution;
    canvas.height = resolution;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(qrImg, 0, 0, resolution, resolution);
    return canvas;
  }

  // 2. Phone Mockup Frame - 100% 1:1 matching website preview (292px × 352px CSS base)
  if (ctaFrame === 'phone-mockup') {
    const baseW = 292;
    const baseH = 352;
    const padMargin = 28; // Breathing room for realistic drop shadow
    const totalBaseW = baseW + 2 * padMargin;

    const scale = resolution / totalBaseW;

    const phoneW = Math.round(baseW * scale);
    const phoneH = Math.round(baseH * scale);
    const outerMargin = Math.round(padMargin * scale);

    const totalW = phoneW + 2 * outerMargin;
    const totalH = phoneH + 2 * outerMargin;

    const borderW = Math.max(2, Math.round(10 * scale));
    const borderRadius = Math.round(40 * scale);
    const padTop = Math.round(22 * scale);
    const notchW = Math.round(50 * scale);
    const notchH = Math.round(4.5 * scale);
    const notchMarginBottom = Math.round(16 * scale);
    const innerQrSize = Math.round(240 * scale);
    const ctaMarginTop = Math.round(14 * scale);
    const fontSize = Math.round(12 * scale);

    const phoneX = outerMargin;
    const phoneY = outerMargin;

    // Generate QR code at innerQrSize
    const qrEngine = createQrInstance({
      ...config,
      size: innerQrSize,
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

    const canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    // Soft realistic drop shadow for the phone frame
    ctx.save();
    ctx.shadowColor = 'rgba(15, 23, 42, 0.16)';
    ctx.shadowBlur = Math.round(36 * (scale / 2.5));
    ctx.shadowOffsetY = Math.round(16 * (scale / 2.5));
    ctx.shadowOffsetX = 0;

    drawRoundRect(ctx, phoneX, phoneY, phoneW, phoneH, borderRadius);
    ctx.fillStyle = isTransparent ? 'transparent' : bgColor;
    ctx.fill();
    ctx.restore();

    // Outer dark phone bezel border
    drawRoundRect(ctx, phoneX + borderW / 2, phoneY + borderW / 2, phoneW - borderW, phoneH - borderW, borderRadius - borderW / 2);
    ctx.lineWidth = borderW;
    ctx.strokeStyle = fgColor;
    ctx.stroke();

    // Subtle speaker notch
    const notchX = phoneX + (phoneW - notchW) / 2;
    const notchY = phoneY + borderW + padTop;
    drawRoundRect(ctx, notchX, notchY, notchW, notchH, notchH / 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
    ctx.fill();

    // QR Code centered with ample breathing room (no clipping of corner squares!)
    const qrX = phoneX + (phoneW - innerQrSize) / 2;
    const qrY = notchY + notchH + notchMarginBottom;
    ctx.drawImage(qrImg, qrX, qrY, innerQrSize, innerQrSize);

    // Bottom CTA label ("SCAN ME")
    const textY = qrY + innerQrSize + ctaMarginTop + fontSize / 2;
    ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    ctx.fillStyle = fgColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.06em';
    ctx.fillText(label, phoneX + phoneW / 2, textY);

    return canvas;
  }

  // 3. Top Header composition
  if (ctaFrame === 'top-header') {
    const baseCardSize = 280;
    const baseQrSize = 240;
    const padMargin = 28;
    const pillHBase = 32;
    const pillGapBase = 12;
    const totalBaseW = baseCardSize + 2 * padMargin;

    const scale = resolution / totalBaseW;
    const cardSize = Math.round(baseCardSize * scale);
    const innerQrSize = Math.round(baseQrSize * scale);
    const outerMargin = Math.round(padMargin * scale);
    const pillH = Math.round(pillHBase * scale);
    const pillGap = Math.round(pillGapBase * scale);
    const fontSize = Math.round(13 * scale);

    const totalW = cardSize + 2 * outerMargin;
    const totalH = outerMargin + pillH + pillGap + cardSize + outerMargin;

    const qrEngine = createQrInstance({
      ...config,
      size: innerQrSize,
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

    const canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    // Measure pill badge
    ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const textW = ctx.measureText(label).width;
    const pillPadding = pillH * 1.3;
    const pillW = Math.max(pillH * 2.6, Math.min(cardSize, textW + pillPadding));
    const pillX = (totalW - pillW) / 2;
    const pillY = outerMargin;

    // Draw pill badge
    drawRoundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = fgColor;
    ctx.fill();

    // Text inside pill
    ctx.fillStyle = (isTransparent || bgColor.toUpperCase() === '#FFFFFF') ? '#FFFFFF' : bgColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.06em';
    ctx.fillText(label, totalW / 2, pillY + pillH / 2);

    // QR Card with shadow
    const cardX = outerMargin;
    const cardY = pillY + pillH + pillGap;
    const cardRadius = Math.round(20 * scale);

    if (!isTransparent) {
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = Math.round(20 * (scale / 2.5));
      ctx.shadowOffsetY = Math.round(6 * (scale / 2.5));
      drawRoundRect(ctx, cardX, cardY, cardSize, cardSize, cardRadius);
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.restore();

      drawRoundRect(ctx, cardX, cardY, cardSize, cardSize, cardRadius);
      ctx.lineWidth = Math.max(1, Math.round(1 * scale));
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();
    }

    const qrX = cardX + (cardSize - innerQrSize) / 2;
    const qrY = cardY + (cardSize - innerQrSize) / 2;
    ctx.drawImage(qrImg, qrX, qrY, innerQrSize, innerQrSize);

    return canvas;
  }

  // 4. Bottom Ribbon composition
  if (ctaFrame === 'bottom-ribbon') {
    const baseCardSize = 280;
    const baseQrSize = 240;
    const padMargin = 28;
    const pillHBase = 32;
    const pillGapBase = 12;
    const totalBaseW = baseCardSize + 2 * padMargin;

    const scale = resolution / totalBaseW;
    const cardSize = Math.round(baseCardSize * scale);
    const innerQrSize = Math.round(baseQrSize * scale);
    const outerMargin = Math.round(padMargin * scale);
    const pillH = Math.round(pillHBase * scale);
    const pillGap = Math.round(pillGapBase * scale);
    const fontSize = Math.round(13 * scale);

    const totalW = cardSize + 2 * outerMargin;
    const totalH = outerMargin + cardSize + pillGap + pillH + outerMargin;

    const qrEngine = createQrInstance({
      ...config,
      size: innerQrSize,
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

    const canvas = document.createElement('canvas');
    canvas.width = totalW;
    canvas.height = totalH;
    const ctx = canvas.getContext('2d');

    // QR Card with shadow
    const cardX = outerMargin;
    const cardY = outerMargin;
    const cardRadius = Math.round(20 * scale);

    if (!isTransparent) {
      ctx.save();
      ctx.shadowColor = 'rgba(15, 23, 42, 0.08)';
      ctx.shadowBlur = Math.round(20 * (scale / 2.5));
      ctx.shadowOffsetY = Math.round(6 * (scale / 2.5));
      drawRoundRect(ctx, cardX, cardY, cardSize, cardSize, cardRadius);
      ctx.fillStyle = bgColor;
      ctx.fill();
      ctx.restore();

      drawRoundRect(ctx, cardX, cardY, cardSize, cardSize, cardRadius);
      ctx.lineWidth = Math.max(1, Math.round(1 * scale));
      ctx.strokeStyle = '#e2e8f0';
      ctx.stroke();
    }

    const qrX = cardX + (cardSize - innerQrSize) / 2;
    const qrY = cardY + (cardSize - innerQrSize) / 2;
    ctx.drawImage(qrImg, qrX, qrY, innerQrSize, innerQrSize);

    // Measure pill badge
    ctx.font = `800 ${fontSize}px system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    const textW = ctx.measureText(label).width;
    const pillPadding = pillH * 1.3;
    const pillW = Math.max(pillH * 2.6, Math.min(cardSize, textW + pillPadding));
    const pillX = (totalW - pillW) / 2;
    const pillY = cardY + cardSize + pillGap;

    // Draw pill badge
    drawRoundRect(ctx, pillX, pillY, pillW, pillH, pillH / 2);
    ctx.fillStyle = fgColor;
    ctx.fill();

    // Text inside pill
    ctx.fillStyle = (isTransparent || bgColor.toUpperCase() === '#FFFFFF') ? '#FFFFFF' : bgColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    if ('letterSpacing' in ctx) ctx.letterSpacing = '0.08em';
    ctx.fillText(label, totalW / 2, pillY + pillH / 2);

    return canvas;
  }

  // Fallback
  const canvas = document.createElement('canvas');
  canvas.width = resolution;
  canvas.height = resolution;
  return canvas;
}

/**
 * Generates composite vector SVG markup matching exact preview layout
 * @param {object} config
 * @param {number} resolution
 * @returns {Promise<Blob>}
 */
export async function generateCompositeSvgBlob(config, resolution = 1024) {
  const {
    ctaFrame = 'none',
    ctaText = 'SCAN ME',
    fgColor = '#0F172A',
    bgColor = '#FFFFFF',
    isTransparent = false,
  } = config;

  const label = (ctaText || 'SCAN ME').toUpperCase();

  const qrSvgEngine = new QRCodeStyling({
    ...createQrInstance({ ...config, size: resolution })._options,
    type: 'svg',
  });

  const rawSvgBlob = await qrSvgEngine.getRawData('svg');
  if (ctaFrame === 'none') {
    return rawSvgBlob;
  }

  const rawSvgText = await rawSvgBlob.text();
  const match = rawSvgText.match(/<svg[^>]*>([\s\S]*?)<\/svg>/i);
  const innerContent = match ? match[1] : rawSvgText;

  const measureCanvas = document.createElement('canvas');
  const measureCtx = measureCanvas.getContext('2d');

  if (ctaFrame === 'phone-mockup') {
    const baseW = 292;
    const baseH = 352;
    const padMargin = 28;
    const totalBaseW = baseW + 2 * padMargin;

    const scale = resolution / totalBaseW;

    const phoneW = Math.round(baseW * scale);
    const phoneH = Math.round(baseH * scale);
    const outerMargin = Math.round(padMargin * scale);

    const totalW = phoneW + 2 * outerMargin;
    const totalH = phoneH + 2 * outerMargin;

    const borderW = Math.max(2, Math.round(10 * scale));
    const borderRadius = Math.round(40 * scale);
    const padTop = Math.round(22 * scale);
    const notchW = Math.round(50 * scale);
    const notchH = Math.round(4.5 * scale);
    const notchMarginBottom = Math.round(16 * scale);
    const innerQrSize = Math.round(240 * scale);
    const ctaMarginTop = Math.round(14 * scale);
    const fontSize = Math.round(12 * scale);

    const phoneX = outerMargin;
    const phoneY = outerMargin;
    const notchX = phoneX + (phoneW - notchW) / 2;
    const notchY = phoneY + borderW + padTop;
    const qrX = phoneX + (phoneW - innerQrSize) / 2;
    const qrY = notchY + notchH + notchMarginBottom;
    const textY = qrY + innerQrSize + ctaMarginTop + fontSize / 2;

    const shadowBlur = Math.round(36 * (scale / 2.5));
    const shadowDy = Math.round(16 * (scale / 2.5));

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <filter id="phone-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${shadowDy}" stdDeviation="${Math.round(shadowBlur / 2)}" flood-color="#0f172a" flood-opacity="0.16" />
    </filter>
  </defs>
  ${!isTransparent ? `<rect x="${phoneX}" y="${phoneY}" width="${phoneW}" height="${phoneH}" rx="${borderRadius}" fill="${bgColor}" filter="url(#phone-shadow)" />` : ''}
  <rect x="${phoneX + borderW / 2}" y="${phoneY + borderW / 2}" width="${phoneW - borderW}" height="${phoneH - borderW}" rx="${borderRadius - borderW / 2}" fill="none" stroke="${fgColor}" stroke-width="${borderW}" />
  <rect x="${notchX}" y="${notchY}" width="${notchW}" height="${notchH}" rx="${notchH / 2}" fill="rgba(0, 0, 0, 0.18)" />
  <svg x="${qrX}" y="${qrY}" width="${innerQrSize}" height="${innerQrSize}" viewBox="0 0 ${resolution} ${resolution}">
    ${innerContent}
  </svg>
  <text x="${phoneX + phoneW / 2}" y="${textY}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="${fontSize}" fill="${fgColor}" text-anchor="middle" dominant-baseline="central" letter-spacing="0.06em">${escapeXml(label)}</text>
</svg>`;
    return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  }

  if (ctaFrame === 'top-header') {
    const baseCardSize = 280;
    const baseQrSize = 240;
    const padMargin = 28;
    const pillHBase = 32;
    const pillGapBase = 12;
    const totalBaseW = baseCardSize + 2 * padMargin;

    const scale = resolution / totalBaseW;
    const cardSize = Math.round(baseCardSize * scale);
    const innerQrSize = Math.round(baseQrSize * scale);
    const outerMargin = Math.round(padMargin * scale);
    const pillH = Math.round(pillHBase * scale);
    const pillGap = Math.round(pillGapBase * scale);
    const fontSize = Math.round(13 * scale);

    const totalW = cardSize + 2 * outerMargin;
    const totalH = outerMargin + pillH + pillGap + cardSize + outerMargin;

    measureCtx.font = `800 ${fontSize}px sans-serif`;
    const textW = measureCtx.measureText(label).width;
    const pillPadding = pillH * 1.3;
    const pillW = Math.max(pillH * 2.6, Math.min(cardSize, textW + pillPadding));
    const pillX = (totalW - pillW) / 2;
    const pillY = outerMargin;

    const cardX = outerMargin;
    const cardY = pillY + pillH + pillGap;
    const cardRadius = Math.round(20 * scale);

    const qrX = cardX + (cardSize - innerQrSize) / 2;
    const qrY = cardY + (cardSize - innerQrSize) / 2;
    const textColor = isTransparent || bgColor.toUpperCase() === '#FFFFFF' ? '#ffffff' : bgColor;

    const shadowBlur = Math.round(20 * (scale / 2.5));
    const shadowDy = Math.round(6 * (scale / 2.5));

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${shadowDy}" stdDeviation="${Math.round(shadowBlur / 2)}" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>
  </defs>
  <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${fgColor}" />
  <text x="${totalW / 2}" y="${pillY + pillH / 2}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="${fontSize}" fill="${textColor}" text-anchor="middle" dominant-baseline="central" letter-spacing="0.06em">${escapeXml(label)}</text>
  ${!isTransparent ? `<rect x="${cardX}" y="${cardY}" width="${cardSize}" height="${cardSize}" rx="${cardRadius}" fill="${bgColor}" stroke="#e2e8f0" stroke-width="1" filter="url(#card-shadow)" />` : ''}
  <svg x="${qrX}" y="${qrY}" width="${innerQrSize}" height="${innerQrSize}" viewBox="0 0 ${resolution} ${resolution}">
    ${innerContent}
  </svg>
</svg>`;
    return new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  }

  if (ctaFrame === 'bottom-ribbon') {
    const baseCardSize = 280;
    const baseQrSize = 240;
    const padMargin = 28;
    const pillHBase = 32;
    const pillGapBase = 12;
    const totalBaseW = baseCardSize + 2 * padMargin;

    const scale = resolution / totalBaseW;
    const cardSize = Math.round(baseCardSize * scale);
    const innerQrSize = Math.round(baseQrSize * scale);
    const outerMargin = Math.round(padMargin * scale);
    const pillH = Math.round(pillHBase * scale);
    const pillGap = Math.round(pillGapBase * scale);
    const fontSize = Math.round(13 * scale);

    const totalW = cardSize + 2 * outerMargin;
    const totalH = outerMargin + cardSize + pillGap + pillH + outerMargin;

    const cardX = outerMargin;
    const cardY = outerMargin;
    const cardRadius = Math.round(20 * scale);

    const qrX = cardX + (cardSize - innerQrSize) / 2;
    const qrY = cardY + (cardSize - innerQrSize) / 2;

    measureCtx.font = `800 ${fontSize}px sans-serif`;
    const textW = measureCtx.measureText(label).width;
    const pillPadding = pillH * 1.3;
    const pillW = Math.max(pillH * 2.6, Math.min(cardSize, textW + pillPadding));
    const pillX = (totalW - pillW) / 2;
    const pillY = cardY + cardSize + pillGap;
    const textColor = isTransparent || bgColor.toUpperCase() === '#FFFFFF' ? '#ffffff' : bgColor;

    const shadowBlur = Math.round(20 * (scale / 2.5));
    const shadowDy = Math.round(6 * (scale / 2.5));

    const svgString = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${totalW}" height="${totalH}" viewBox="0 0 ${totalW} ${totalH}">
  <defs>
    <filter id="card-shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="${shadowDy}" stdDeviation="${Math.round(shadowBlur / 2)}" flood-color="#0f172a" flood-opacity="0.08" />
    </filter>
  </defs>
  ${!isTransparent ? `<rect x="${cardX}" y="${cardY}" width="${cardSize}" height="${cardSize}" rx="${cardRadius}" fill="${bgColor}" stroke="#e2e8f0" stroke-width="1" filter="url(#card-shadow)" />` : ''}
  <svg x="${qrX}" y="${qrY}" width="${innerQrSize}" height="${innerQrSize}" viewBox="0 0 ${resolution} ${resolution}">
    ${innerContent}
  </svg>
  <rect x="${pillX}" y="${pillY}" width="${pillW}" height="${pillH}" rx="${pillH / 2}" fill="${fgColor}" />
  <text x="${totalW / 2}" y="${pillY + pillH / 2}" font-family="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="${fontSize}" fill="${textColor}" text-anchor="middle" dominant-baseline="central" letter-spacing="0.08em">${escapeXml(label)}</text>
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
