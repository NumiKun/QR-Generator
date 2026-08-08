# ⚡ Python QR Code Generator Pro

Aplikasi Generator QR Code dalam bahasa Python yang mendukung berbagai jenis input (**Teks, Link/URL, dan Gambar**), kustomisasi warna (Foreground & Background), serta penambahan gambar/logo di tengah QR Code dengan tampilan menarik.

🌐 **Live Web Demo**: [https://qr-gene.streamlit.app/](https://qr-gene.streamlit.app/)

---

## 🌟 Fitur Utama

- 📝 **Pilihan Input Data**:
  - **Teks**: Menyimpan teks bebas, catatan, atau string pesan.
  - **Link / URL**: Tautan website, alamat email, atau media sosial.
  - **File Gambar**: Mengompres dan meng-encode file gambar menjadi *Base64 Data URI* sehingga dapat dibaca langsung saat discan.
- 🎨 **Kustomisasi Warna Bebas**:
  - Mengubah warna modul QR (Foreground) dan latar belakang (Background) menggunakan *Color Picker* atau kode hex color (misal `#1E293B`, `#10B981`).
  - Dilengkapi preset warna siap pakai (Klasik, Dark Navy, Emerald Green, Royal Purple, Sunset Red).
- 🖼️ **Logo / Gambar di Tengah**:
  - Menyisipkan logo/foto tepat di bagian tengah QR Code.
  - Menggunakan tingkat koreksi kesalahan tinggi (*High Error Correction ~30%*) sehingga QR tetap **100% scannable** dan valid saat dibaca oleh kamera smartphone.
  - Pilihan bentuk penutup logo: **Lingkaran (Circle)**, **Lengkung (Rounded)**, atau **Kotak (Square)**.
- 🖥️ **3 Mode Penggunaan**:
  1. **Live Web Demo** (Dapat diakses langsung di [qr-gene.streamlit.app](https://qr-gene.streamlit.app/)).
  2. **Desktop GUI App** (Interface aplikasi desktop berbasis CustomTkinter).
  3. **Local Web App & CLI** (Streamlit lokal & Command Line Interface).

---

## 🛠️ Instalasi

Pastikan Anda telah memasang **Python 3.8+**. Jalankan perintah berikut untuk meng-install pustaka yang dibutuhkan:

```bash
pip install -r requirements.txt
```

---

## 🚀 Cara Menjalankan

### 1. Akses Web Application Online (Live Demo)
Aplikasi dapat diakses langsung tanpa instalasi melalui browser:
👉 **[https://qr-gene.streamlit.app/](https://qr-gene.streamlit.app/)**

### 2. Mode Desktop Application (GUI - Default)
Jalankan perintah berikut untuk membuka antarmuka aplikasi desktop:

```bash
python main.py
```
*(Atau jalankan `python app_gui.py`)*

### 3. Mode Local Web Application (Streamlit)
Untuk menjalankan antarmuka web secara lokal di komputer Anda:

```bash
python main.py --web
```
*(Atau `streamlit run app_streamlit.py`)*

### 4. Mode Command Line Interface (CLI)
Contoh membuat QR Code dari terminal/command prompt:

```bash
# Membuat QR Teks dengan warna custom & logo
python main.py --cli --data "Halo dari Terminal!" --fill "#0F172A" --bg "#E0F2FE" --logo "path/to/logo.png" -o "my_qr.png"
```

---

## 💻 Penggunaan dalam Kode Python (`qr_generator.py`)

Anda juga bisa mengimpor modul `qr_generator.py` langsung ke dalam proyek Python Anda:

```python
from qr_generator import generate_qr

# 1. QR Code Teks dengan Warna Custom
qr_img = generate_qr(
    data="Halo Dunia!",
    input_type="text",
    fill_color="#1E3A8A",  # Biru Tua
    back_color="#EFF6FF"   # Biru Muda Soft
)
qr_img.save("qr_teks.png")

# 2. QR Code URL dengan Logo di Tengah
qr_img_logo = generate_qr(
    data="https://github.com",
    input_type="link",
    fill_color="#0F172A",
    back_color="#FFFFFF",
    logo_source="logo.png",
    logo_shape="circle",    # 'circle', 'rounded', atau 'square'
    logo_ratio=0.22         # Rasio ukuran logo (default 22%)
)
qr_img_logo.save("qr_link_logo.png")

# 3. QR Code dari File Gambar
qr_img_file = generate_qr(
    data="foto_saya.jpg",
    input_type="image",
    fill_color="#047857",
    back_color="#F0FDF4"
)
qr_img_file.save("qr_gambar.png")
```

---

## 📁 Struktur Proyek

```
QR Generator/
│
├── qr_generator.py       # Engine utama pembentuk QR Code, warna, & logo overlay
├── app_gui.py            # Interface aplikasi Desktop (CustomTkinter)
├── app_streamlit.py      # Interface aplikasi Web (Streamlit)
├── main.py               # Main launcher script (GUI, Web, & CLI)
├── test_qr_generator.py  # Unit test script untuk verifikasi modul
├── requirements.txt      # Daftar dependensi pustaka Python
├── .gitignore            # Filter file Git (cache, venv, temporary output)
└── README.md             # Dokumentasi petunjuk penggunaan
```
