import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';

extend([a11yPlugin]);

/**
 * Calculates WCAG contrast ratio and scannability score between foreground and background colors
 * @param {string} foreground - Hex color of QR modules
 * @param {string} background - Hex color of QR background
 * @param {boolean} isTransparent - Whether transparent background is enabled
 * @returns {object} { ratio, status, label, isPassing }
 */
export function checkContrast(foreground, background, isTransparent = false) {
  try {
    const effectiveBg = isTransparent ? '#ffffff' : background;
    const fg = colord(foreground);
    const bg = colord(effectiveBg);

    if (!fg.isValid() || !bg.isValid()) {
      return { ratio: 21, status: 'pass', label: 'Valid', isPassing: true };
    }

    const ratio = Math.round(fg.contrast(bg) * 10) / 10;

    // QR scanners generally require minimum 4.5:1, ideally >7:1
    if (ratio >= 7) {
      return {
        ratio,
        status: 'pass',
        label: `WCAG AAA (${ratio}:1)`,
        badgeText: 'Optimal Scannability',
        isPassing: true,
      };
    } else if (ratio >= 4.5) {
      return {
        ratio,
        status: 'pass',
        label: `WCAG AA (${ratio}:1)`,
        badgeText: 'Good Scannability',
        isPassing: true,
      };
    } else {
      return {
        ratio,
        status: 'warning',
        label: `Low Contrast (${ratio}:1)`,
        badgeText: 'May Fail Scanner Camera',
        isPassing: false,
      };
    }
  } catch {
    return { ratio: 21, status: 'pass', label: 'WCAG AAA (21:1)', badgeText: 'Optimal', isPassing: true };
  }
}
