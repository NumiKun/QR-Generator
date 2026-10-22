import { colord, extend } from 'colord';
import a11yPlugin from 'colord/plugins/a11y';

extend([a11yPlugin]);

/**
 * Menghitung rasio kontras warna untuk memastikan QR code mudah dibaca kamera
 * @param {string} foreground - Warna kode QR
 * @param {string} background - Warna latar belakang
 * @param {boolean} isTransparent - Apakah latar transparan
 * @returns {object} { ratio, status, label, badgeText, isPassing }
 */
export function checkContrast(foreground, background, isTransparent = false) {
  try {
    const effectiveBg = isTransparent ? '#ffffff' : background;
    const fg = colord(foreground);
    const bg = colord(effectiveBg);

    if (!fg.isValid() || !bg.isValid()) {
      return { ratio: 21, status: 'pass', label: 'Warna Jelas', badgeText: 'Mudah Di-scan', isPassing: true };
    }

    const ratio = Math.round(fg.contrast(bg) * 10) / 10;

    // Ambang batas scannability kamera
    if (ratio >= 7) {
      return {
        ratio,
        status: 'pass',
        label: 'Kontras Bagus',
        badgeText: 'Sangat Mudah Di-scan',
        isPassing: true,
      };
    } else if (ratio >= 4.5) {
      return {
        ratio,
        status: 'pass',
        label: 'Kontras Cukup',
        badgeText: 'Bisa Di-scan',
        isPassing: true,
      };
    } else {
      return {
        ratio,
        status: 'warning',
        label: 'Kurang Kontras',
        badgeText: 'Kamera Mungkin Sulit Membaca',
        isPassing: false,
      };
    }
  } catch {
    return { ratio: 21, status: 'pass', label: 'Warna Jelas', badgeText: 'Mudah Di-scan', isPassing: true };
  }
}
