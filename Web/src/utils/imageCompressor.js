/**
 * Mengompres dan mengecilkan dimensi gambar agar muat dalam kapasitas maksimal QR Code (~2 KB)
 * @param {File} file
 * @returns {Promise<{ success: boolean, dataUri?: string, error?: string, sizeBytes?: number }>}
 */
export async function compressImageToDataUri(file) {
  return new Promise((resolve) => {
    // Jika bukan file gambar (misal teks/dokumen)
    if (!file.type.startsWith('image/')) {
      if (file.size > 2000) {
        return resolve({
          success: false,
          error: `Ukuran file (${(file.size / 1024).toFixed(1)} KB) melebihi batas kapasitas maksimal QR Code (~2 KB).`,
        });
      }
      const reader = new FileReader();
      reader.onload = (e) => resolve({ success: true, dataUri: e.target?.result, sizeBytes: file.size });
      reader.onerror = () => resolve({ success: false, error: 'Gagal membaca file.' });
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        try {
          // Perkecil dimensi gambar agar muat dalam QR code
          const maxDim = 40;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = Math.max(width, 1);
          canvas.height = Math.max(height, 1);
          const ctx = canvas.getContext('2d');

          // Latar belakang putih untuk JPEG
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          // Kompresi ke format JPEG kualitas teroptimasi
          let dataUri = canvas.toDataURL('image/jpeg', 0.5);

          // Jika masih sedikit besar, coba kompresi lebih tinggi
          if (dataUri.length > 2100) {
            dataUri = canvas.toDataURL('image/jpeg', 0.35);
          }

          if (dataUri.length > 2300) {
            return resolve({
              success: false,
              error: 'Gambar terlalu kompleks untuk dimuat ke dalam QR Code. Batas maksimal penyimpanan data QR Code adalah ~2 KB.',
            });
          }

          resolve({
            success: true,
            dataUri,
            sizeBytes: dataUri.length,
          });
        } catch {
          resolve({ success: false, error: 'Gagal memproses gambar.' });
        }
      };
      img.onerror = () => resolve({ success: false, error: 'File gambar rusak atau tidak didukung.' });
      img.src = event.target?.result;
    };
    reader.onerror = () => resolve({ success: false, error: 'Gagal membaca file.' });
    reader.readAsDataURL(file);
  });
}
