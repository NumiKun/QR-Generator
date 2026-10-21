# ⚡ AnyQR — Precision Vector QR Code Studio

**AnyQR** adalah aplikasi web studio generator QR Code berpresisi tinggi dengan jaminan **100% Zero-Telemetry** (semua pemrosesan payload, rendering matriks, dan penanaman logo berjalan langsung di memori browser pengguna tanpa pengiriman data ke server).

Dibangun berdasarkan spesifikasi [PRD.md](./PRD.md).

---

## 🌟 Fitur Utama

- 🔒 **Zero-Telemetry Guarantee**: Tidak ada pelacak analitik, tidak ada panggilan API backend. Data privasi tetap 100% di browser.
- 📝 **Multi-Payload Channel**:
  - **URL Link**: Validasi link *real-time*, normalisasi awalan `https://`, pembersihan instan.
  - **Plain Text**: Teks multi-baris dengan penghitung karakter dan ukuran byte UTF-8.
  - **Wi-Fi**: Format otomatis konfigurasi jaringan (WPA/WEP/Open, SSID tersembunyi).
  - **File / Gambar**: *Client-side Base64 Data URI ingestion*.
- 🎨 **Color & Contrast Studio**:
  - Pilihan warna matriks (Foreground) dan latar belakang (Background) dengan kode Hex dan chip preset studio.
  - Toggle latar belakang transparan (alpha channel dipertahankan pada SVG dan PNG).
  - **WCAG Scannability Validator**: Menghitung rasio kontras secara otomatis untuk menjamin QR dapat dibaca oleh kamera smartphone.
- 📐 **Matrix Geometry Studio**:
  - Bentuk modul: *Classic Square*, *Rounded Dots*, *Smooth Pill*, *Liquid Fluid*.
  - Sudut bingkai mata luar (*Outer Eye Frame*): *Square*, *Rounded Square*, *Circular*.
  - Pupil mata dalam (*Inner Eye Pupil*): *Square*, *Circular Dot*.
- 🖼️ **Logo & Insignia Embedding**:
  - Unggah logo (SVG, PNG, WebP) langsung di browser.
  - Penggeser proporsi skala aman (15% – 35%).
  - *Safe module clearing margin* untuk menjaga keterbacaan data.
  - Otomatis menaikkan *Error Correction Level* ke **High (H ~30%)** saat logo aktif.
- 🏷️ **CTA Frames & Badges**:
  - Preset bingkai: *Frameless*, *Bottom Ribbon* ("SCAN ME"), *Top Header*, dan *Phone Mockup*.
  - Teks label CTA yang dapat diedit langsung.
- 📊 **Technical Metadata Readout**:
  - Menampilkan Error Correction Level (ECC), Versi QR & Dimensi Grid (misal: $33 \times 33$), dan mode encoding.
- 💾 **Export Deck & Print Utility**:
  - Ekspor raster PNG resolusi tinggi (**1024px** dan **4K 2048px**).
  - Ekspor vektor SVG murni (*clean grouped paths* tanpa dependensi CSS).
  - Salin langsung ke clipboard sistem dengan 1 tombol atau shortcut keyboard (`⌘C` / `Ctrl+C`).
  - Lembar cetak format A4 / Letter siap tempel (*print utility*).

---

## 🛠️ Instalasi & Menjalankan Lokal

Pastikan Anda berada di direktori `Web/`:

```bash
# 1. Pindah ke direktori Web
cd Web

# 2. Pasang dependensi
npm install

# 3. Jalankan development server
npm run dev
```

Aplikasi dapat dibuka di browser pada alamat: **http://localhost:5173/**

---

## 📦 Build untuk Produksi

```bash
npm run build
```

Hasil build statis akan tersimpan di dalam folder `Web/dist/` dan siap di-*deploy* ke platform statis mana pun (Cloudflare Pages, Vercel, GitHub Pages, Netlify) tanpa memerlukan server backend.
