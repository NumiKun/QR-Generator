import sys
import argparse
import subprocess
from src.qr_generator import generate_qr

def run_cli(args):
    print(f"Generating QR Code for: {args.data}")
    qr_img = generate_qr(
        data=args.data,
        input_type=args.type,
        fill_color=args.fill,
        back_color=args.bg,
        logo_source=args.logo,
        logo_shape=args.logo_shape
    )
    qr_img.save(args.output)
    print(f"[OK] Saved QR Code to {args.output}")

def main():
    parser = argparse.ArgumentParser(description="Python QR Code Generator Pro")
    parser.add_argument("--web", action="store_true", help="Jalankan antarmuka Web Streamlit")
    parser.add_argument("--cli", action="store_true", help="Gunakan mode Command Line Interface (CLI)")
    parser.add_argument("--data", type=str, help="Teks, Link URL, atau file gambar untuk QR")
    parser.add_argument("--type", type=str, default="text", choices=["text", "link", "image"], help="Tipe input data")
    parser.add_argument("--fill", type=str, default="#000000", help="Warna foreground QR (hex/name)")
    parser.add_argument("--bg", type=str, default="#FFFFFF", help="Warna background QR (hex/name)")
    parser.add_argument("--logo", type=str, default=None, help="Path ke gambar logo tengah")
    parser.add_argument("--logo-shape", type=str, default="circle", choices=["circle", "rounded", "square"], help="Bentuk mask logo")
    parser.add_argument("--output", "-o", type=str, default="qrcode.png", help="File output (contoh: qrcode.png)")

    args = parser.parse_args()

    if args.web:
        print("Menjalankan Web UI Streamlit...")
        subprocess.run(["streamlit", "run", "src/app_streamlit.py"])
    elif args.cli:
        if not args.data:
            print("Error: Argumen --data diperlukan dalam mode CLI!")
            sys.exit(1)
        run_cli(args)
    else:
        # Launch Desktop GUI by default
        from src.app_gui import QRCodeGeneratorGUI
        app = QRCodeGeneratorGUI()
        app.run()

if __name__ == "__main__":
    main()
