import os
from PIL import Image, ImageDraw
from qr_generator import generate_qr

def create_dummy_logo(path="dummy_logo.png"):
    img = Image.new("RGBA", (100, 100), (30, 144, 255, 255))
    draw = ImageDraw.Draw(img)
    draw.ellipse((20, 20, 80, 80), fill=(255, 215, 0, 255))
    img.save(path)
    return path

def test_qr_generation():
    print("Testing QR Code Generator...")
    os.makedirs("test_output", exist_ok=True)
    logo_path = create_dummy_logo()

    # Test 1: Plain Text with Custom Colors
    img1 = generate_qr(
        data="Halo Dunia! Ini adalah tes QR Code Teks.",
        input_type="text",
        fill_color="#1E3A8A", # Dark Blue
        back_color="#EFF6FF"  # Soft Light Blue
    )
    img1.save("test_output/qr_text.png")
    print("[OK] Test 1 Passed: Plain Text QR created (test_output/qr_text.png)")

    # Test 2: URL Link with Center Logo
    img2 = generate_qr(
        data="https://github.com",
        input_type="link",
        fill_color="#0F172A",
        back_color="#FFFFFF",
        logo_source=logo_path,
        logo_shape="circle",
        logo_ratio=0.22
    )
    img2.save("test_output/qr_link_logo.png")
    print("[OK] Test 2 Passed: URL Link QR with Logo created (test_output/qr_link_logo.png)")

    # Test 3: Image Input (Base64 URI encoded)
    img3 = generate_qr(
        data=logo_path,
        input_type="image",
        fill_color="#047857", # Green
        back_color="#F0FDF4"
    )
    img3.save("test_output/qr_image_input.png")
    print("[OK] Test 3 Passed: Image Input QR created (test_output/qr_image_input.png)")

    # Clean up dummy logo
    if os.path.exists(logo_path):
        os.remove(logo_path)

    print("All tests completed successfully!")

if __name__ == "__main__":
    test_qr_generation()
