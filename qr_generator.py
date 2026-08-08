import io
import base64
import qrcode
from qrcode.constants import ERROR_CORRECT_H, ERROR_CORRECT_M
from PIL import Image, ImageDraw, ImageOps

def image_to_data_uri(image_source, max_dimension=120, quality=70):
    """
    Converts an image file or bytes into a compact Base64 Data URI string.
    Downsamples the image to ensure it fits within QR Code data limits (~2.9 KB).
    """
    if isinstance(image_source, str):
        img = Image.open(image_source)
    elif isinstance(image_source, bytes):
        img = Image.open(io.BytesIO(image_source))
    elif isinstance(image_source, Image.Image):
        img = image_source
    else:
        raise ValueError("Unsupported image source type.")
    
    # Convert RGBA to RGB if needed
    if img.mode in ("RGBA", "P"):
        background = Image.new("RGB", img.size, (255, 255, 255))
        if img.mode == "RGBA":
            background.paste(img, mask=img.split()[3])
        else:
            background.paste(img)
        img = background
    elif img.mode != "RGB":
        img = img.convert("RGB")

    # Resize preserving aspect ratio
    img.thumbnail((max_dimension, max_dimension), Image.Resampling.LANCZOS)

    buffer = io.BytesIO()
    img.save(buffer, format="JPEG", quality=quality, optimize=True)
    b64_str = base64.b64encode(buffer.getvalue()).decode('utf-8')
    return f"data:image/jpeg;base64,{b64_str}"

def add_center_logo(qr_img, logo_source, logo_ratio=0.22, padding=4, shape="circle"):
    """
    Overlays a logo/image in the center of the QR code image.
    Supports circle, rounded rectangle, or square shapes with white background padding.
    """
    if isinstance(logo_source, str):
        logo = Image.open(logo_source)
    elif isinstance(logo_source, bytes):
        logo = Image.open(io.BytesIO(logo_source))
    elif isinstance(logo_source, Image.Image):
        logo = logo_source.copy()
    else:
        raise ValueError("Invalid logo source.")

    qr_w, qr_h = qr_img.size
    target_logo_size = int(qr_w * logo_ratio)
    
    if target_logo_size < 10:
        return qr_img

    # Ensure logo is RGBA
    logo = logo.convert("RGBA")
    logo = logo.resize((target_logo_size, target_logo_size), Image.Resampling.LANCZOS)

    # Create background mask with padding for better contrast against QR modules
    bg_size = target_logo_size + (padding * 2)
    logo_bg = Image.new("RGBA", (bg_size, bg_size), (255, 255, 255, 0))
    draw = ImageDraw.Draw(logo_bg)

    if shape == "circle":
        draw.ellipse((0, 0, bg_size - 1, bg_size - 1), fill=(255, 255, 255, 255))
        
        # Clip logo into circle
        mask = Image.new("L", (target_logo_size, target_logo_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, target_logo_size - 1, target_logo_size - 1), fill=255)
        logo_bg.paste(logo, (padding, padding), mask)

    elif shape == "rounded":
        radius = int(bg_size * 0.2)
        draw.rounded_rectangle((0, 0, bg_size - 1, bg_size - 1), radius=radius, fill=(255, 255, 255, 255))
        
        logo_radius = int(target_logo_size * 0.2)
        mask = Image.new("L", (target_logo_size, target_logo_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle((0, 0, target_logo_size - 1, target_logo_size - 1), radius=logo_radius, fill=255)
        logo_bg.paste(logo, (padding, padding), mask)

    else:  # square
        draw.rectangle((0, 0, bg_size - 1, bg_size - 1), fill=(255, 255, 255, 255))
        logo_bg.paste(logo, (padding, padding), logo)

    # Calculate center coordinates
    pos = ((qr_w - bg_size) // 2, (qr_h - bg_size) // 2)

    # Convert QR image to RGBA if needed
    result_img = qr_img.convert("RGBA")
    result_img.paste(logo_bg, pos, logo_bg)
    return result_img

def generate_qr(
    data,
    input_type="text",
    fill_color="#000000",
    back_color="#FFFFFF",
    logo_source=None,
    logo_ratio=0.22,
    logo_padding=4,
    logo_shape="circle",
    box_size=10,
    border=4
):
    """
    Generates a customized QR code image.

    Args:
        data (str or bytes): Text, URL, or image source.
        input_type (str): 'text', 'link', or 'image'.
        fill_color (str): QR modules color (Hex or name).
        back_color (str): QR background color (Hex or name).
        logo_source (str, bytes, or Image): Optional logo for the center.
        logo_ratio (float): Size of center logo relative to QR size (default 0.22).
        logo_padding (int): Padding around center logo in pixels.
        logo_shape (str): 'circle', 'rounded', or 'square'.
        box_size (int): Size of each QR module in pixels.
        border (int): Border width in boxes.

    Returns:
        PIL.Image.Image: The generated QR code image.
    """
    payload = ""

    if input_type == "link" or input_type == "url":
        payload = str(data).strip()
        if not payload.startswith(('http://', 'https://', 'mailto:', 'tel:')):
            payload = 'https://' + payload
    elif input_type == "image":
        if isinstance(data, (str, bytes, Image.Image)):
            payload = image_to_data_uri(data)
        else:
            payload = str(data)
    else:  # text
        payload = str(data)

    if not payload:
        raise ValueError("Data payload cannot be empty.")

    # High error correction is necessary if a center logo is added
    error_correction = ERROR_CORRECT_H if logo_source else ERROR_CORRECT_M

    qr = qrcode.QRCode(
        version=None,  # Auto-fit version
        error_correction=error_correction,
        box_size=box_size,
        border=border,
    )
    qr.add_data(payload)
    qr.make(fit=True)

    qr_img = qr.make_image(fill_color=fill_color, back_color=back_color).convert("RGB")

    if logo_source:
        qr_img = add_center_logo(
            qr_img,
            logo_source=logo_source,
            logo_ratio=logo_ratio,
            padding=logo_padding,
            shape=logo_shape
        )

    return qr_img
