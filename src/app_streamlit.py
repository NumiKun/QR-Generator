import io
import sys
from pathlib import Path

# Ensure project root is in sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

import streamlit as st
from PIL import Image
try:
    from src.qr_generator import generate_qr
except ImportError:
    from qr_generator import generate_qr

st.set_page_config(
    page_title="QR Code Generator Pro",
    page_icon="⚡",
    layout="wide"
)

st.title("⚡ QR Code Generator Pro")
st.caption("Generator QR Code serbaguna dengan dukungan input Teks, Link, Gambar, Warna Custom, dan Logo di Tengah.")

col_controls, col_preview = st.columns([1, 1], gap="large")

with col_controls:
    st.subheader("1. Pilih Jenis Input")
    input_type_option = st.radio(
        "Tipe Input:",
        options=["Teks", "Link / URL", "File Gambar"],
        horizontal=True
    )

    data_payload = None
    input_type_key = "text"

    if input_type_option == "Teks":
        input_type_key = "text"
        data_payload = st.text_area("Masukkan Teks:", value="Halo dari Generator QR Code Python!")
    elif input_type_option == "Link / URL":
        input_type_key = "link"
        data_payload = st.text_input("Masukkan Tautan Web:", value="https://google.com")
    else:
        input_type_key = "image"
        uploaded_img = st.file_uploader("Unggah File Gambar untuk Di-encode ke QR:", type=["png", "jpg", "jpeg", "webp"])
        if uploaded_img:
            data_payload = uploaded_img.read()

    st.divider()
    st.subheader("2. Warna QR Code")

    preset = st.selectbox(
        "Preset Warna Cepat:",
        options=["Custom", "Klasik (Hitam/Putih)", "Dark Navy", "Emerald Green", "Purple Royal", "Sunset Red"]
    )

    default_fg, default_bg = "#0F172A", "#FFFFFF"
    if preset == "Klasik (Hitam/Putih)":
        default_fg, default_bg = "#000000", "#FFFFFF"
    elif preset == "Dark Navy":
        default_fg, default_bg = "#0F172A", "#E0F2FE"
    elif preset == "Emerald Green":
        default_fg, default_bg = "#064E3B", "#ECFDF5"
    elif preset == "Purple Royal":
        default_fg, default_bg = "#581C87", "#F3E8FF"
    elif preset == "Sunset Red":
        default_fg, default_bg = "#7F1D1D", "#FEF2F2"

    c_col1, c_col2 = st.columns(2)
    with c_col1:
        fill_color = st.color_picker("Warna QR (Foreground)", value=default_fg)
    with c_col2:
        back_color = st.color_picker("Warna Latar (Background)", value=default_bg)

    st.divider()
    st.subheader("3. Logo / Gambar di Tengah")
    
    logo_file = st.file_uploader("Unggah Logo untuk Tengah QR (Opsional):", type=["png", "jpg", "jpeg", "webp", "ico"])
    logo_shape = st.selectbox("Bentuk Mask Logo:", options=["circle", "rounded", "square"], format_func=lambda x: "Lingkaran" if x == "circle" else ("Lengkung" if x == "rounded" else "Kotak"))
    logo_ratio = st.slider("Ukuran Logo Relative (%)", min_value=15, max_value=30, value=22, step=1) / 100.0

with col_preview:
    st.subheader("Pratinjau Hasil (Preview)")
    
    if data_payload:
        try:
            logo_data = logo_file.read() if logo_file else None
            
            qr_image = generate_qr(
                data=data_payload,
                input_type=input_type_key,
                fill_color=fill_color,
                back_color=back_color,
                logo_source=logo_data,
                logo_shape=logo_shape,
                logo_ratio=logo_ratio,
                box_size=12,
                border=4
            )

            # Convert to byte buffer for display & download
            buf = io.BytesIO()
            qr_image.save(buf, format="PNG")
            byte_im = buf.getvalue()

            st.image(byte_im, use_container_width=True, caption="QR Code Siap Discan!")

            st.download_button(
                label="💾 Unduh QR Code (.png)",
                data=byte_im,
                file_name="qr_code_custom.png",
                mime="image/png",
                use_container_width=True
            )

        except Exception as e:
            st.error(f"Gagal memproses QR Code: {e}")
    else:
        st.info("Silakan isi input di sebelah kiri untuk menampilkan preview QR Code.")
