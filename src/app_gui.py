import os
import io
import tkinter as tk
from tkinter import filedialog, messagebox, colorchooser
from PIL import Image, ImageTk

try:
    import customtkinter as ctk
    ctk.set_appearance_mode("Dark")
    ctk.set_default_color_theme("blue")
    BaseAppWindow = ctk.CTk
except ImportError:
    BaseAppWindow = tk.Tk

try:
    from src.qr_generator import generate_qr
except ImportError:
    from .qr_generator import generate_qr

class QRCodeGeneratorGUI:
    def __init__(self):
        self.root = BaseAppWindow()
        self.root.title("QR Code Generator - Custom Color & Logo")
        self.root.geometry("980x720")
        self.root.minsize(850, 650)

        # State Variables
        self.input_type_var = tk.StringVar(value="text")
        self.text_input_val = ""
        self.image_input_path = ""
        self.logo_path = ""
        
        self.fill_color = "#1E293B"  # Slate dark blue
        self.back_color = "#FFFFFF"  # White
        self.logo_shape_var = tk.StringVar(value="circle")
        self.logo_ratio_val = 0.22

        self.current_qr_img = None
        self.preview_tk_img = None

        self._build_ui()
        self.update_qr_preview()

    def _build_ui(self):
        # Header / Title Banner
        if hasattr(ctk, 'CTkLabel'):
            title_frame = ctk.CTkFrame(self.root, corner_radius=10)
            title_frame.pack(fill="x", padx=20, pady=(15, 10))
            
            title = ctk.CTkLabel(
                title_frame,
                text="⚡ QR Code Generator Pro",
                font=ctk.CTkFont(size=22, weight="bold")
            )
            title.pack(side="left", padx=20, pady=12)
            
            subtitle = ctk.CTkLabel(
                title_frame,
                text="Teks • Link • Gambar • Custom Warna & Logo Tengah",
                font=ctk.CTkFont(size=12),
                text_color="gray"
            )
            subtitle.pack(side="right", padx=20, pady=12)

            main_container = ctk.CTkFrame(self.root)
            main_container.pack(fill="both", expand=True, padx=20, pady=(0, 20))
        else:
            main_container = tk.Frame(self.root)
            main_container.pack(fill="both", expand=True, padx=15, pady=15)

        # Left Panel - Control Inputs
        if hasattr(ctk, 'CTkScrollableFrame'):
            left_panel = ctk.CTkScrollableFrame(main_container, width=460)
            left_panel.pack(side="left", fill="both", expand=True, padx=(10, 5), pady=10)
        else:
            left_panel = tk.Frame(main_container)
            left_panel.pack(side="left", fill="both", expand=True, padx=10, pady=10)

        # --- SECTION 1: Input Type & Data ---
        self._create_section_label(left_panel, "1. Sumber Input QR Code")

        if hasattr(ctk, 'CTkSegmentedButton'):
            type_selector = ctk.CTkSegmentedButton(
                left_panel,
                values=["Teks", "Link / URL", "File Gambar"],
                command=self._on_input_type_change
            )
            type_selector.set("Teks")
            type_selector.pack(fill="x", padx=10, pady=5)
        else:
            type_selector = tk.OptionMenu(left_panel, self.input_type_var, "text", "link", "image", command=self._on_input_type_change)
            type_selector.pack(fill="x", padx=10, pady=5)

        # Text / Link Input Box
        self.input_entry = ctk.CTkTextbox(left_panel, height=80) if hasattr(ctk, 'CTkTextbox') else tk.Text(left_panel, height=4)
        self.input_entry.pack(fill="x", padx=10, pady=8)
        if hasattr(ctk, 'CTkTextbox'):
            self.input_entry.insert("1.0", "Halo! Masukkan teks atau link di sini...")
        
        # Image File Picker Frame (Hidden by default until 'File Gambar' is selected)
        self.img_file_frame = ctk.CTkFrame(left_panel) if hasattr(ctk, 'CTkFrame') else tk.Frame(left_panel)
        self.btn_select_img = ctk.CTkButton(
            self.img_file_frame, text="📁 Pilih File Gambar Input", command=self._browse_input_image
        ) if hasattr(ctk, 'CTkButton') else tk.Button(self.img_file_frame, text="Pilih Gambar", command=self._browse_input_image)
        self.btn_select_img.pack(side="left", padx=5, pady=5)
        
        self.lbl_img_path = ctk.CTkLabel(self.img_file_frame, text="Belum ada gambar dipilih", text_color="gray") if hasattr(ctk, 'CTkLabel') else tk.Label(self.img_file_frame, text="Belum ada gambar")
        self.lbl_img_path.pack(side="left", padx=5)

        # --- SECTION 2: Color Customization ---
        self._create_section_label(left_panel, "2. Warna QR Code")

        color_frame = ctk.CTkFrame(left_panel) if hasattr(ctk, 'CTkFrame') else tk.Frame(left_panel)
        color_frame.pack(fill="x", padx=10, pady=5)

        # Foreground color
        btn_fg_color = ctk.CTkButton(
            color_frame, text="🎨 Warna QR (Foreground)", command=self._choose_fg_color, fg_color=self.fill_color
        ) if hasattr(ctk, 'CTkButton') else tk.Button(color_frame, text="Warna QR", command=self._choose_fg_color)
        btn_fg_color.grid(row=0, column=0, padx=5, pady=5, sticky="ew")
        self.btn_fg_color = btn_fg_color

        # Background color
        btn_bg_color = ctk.CTkButton(
            color_frame, text="🖌️ Warna Latar (Background)", command=self._choose_bg_color, fg_color="#64748B"
        ) if hasattr(ctk, 'CTkButton') else tk.Button(color_frame, text="Warna Background", command=self._choose_bg_color)
        btn_bg_color.grid(row=0, column=1, padx=5, pady=5, sticky="ew")
        self.btn_bg_color = btn_bg_color

        color_frame.grid_columnconfigure(0, weight=1)
        color_frame.grid_columnconfigure(1, weight=1)

        # Color Preset Buttons
        preset_frame = ctk.CTkFrame(left_panel) if hasattr(ctk, 'CTkFrame') else tk.Frame(left_panel)
        preset_frame.pack(fill="x", padx=10, pady=5)

        presets = [
            ("Klasik (Hitam/Putih)", "#000000", "#FFFFFF"),
            ("Navy Ocean", "#0F172A", "#E0F2FE"),
            ("Emerald Green", "#064E3B", "#ECFDF5"),
            ("Purple Royal", "#581C87", "#F3E8FF"),
            ("Sunset Red", "#7F1D1D", "#FEF2F2")
        ]

        for idx, (p_name, fg, bg) in enumerate(presets):
            btn_p = ctk.CTkButton(
                preset_frame,
                text=p_name,
                height=26,
                font=ctk.CTkFont(size=11),
                command=lambda f=fg, b=bg: self._apply_color_preset(f, b)
            ) if hasattr(ctk, 'CTkButton') else tk.Button(preset_frame, text=p_name, command=lambda f=fg, b=bg: self._apply_color_preset(f, b))
            btn_p.pack(fill="x", pady=2)

        # --- SECTION 3: Logo Di Tengah ---
        self._create_section_label(left_panel, "3. Logo / Gambar di Tengah QR")

        logo_frame = ctk.CTkFrame(left_panel) if hasattr(ctk, 'CTkFrame') else tk.Frame(left_panel)
        logo_frame.pack(fill="x", padx=10, pady=5)

        btn_logo = ctk.CTkButton(
            logo_frame, text="🖼️ Pilih Logo Tengah", command=self._browse_logo
        ) if hasattr(ctk, 'CTkButton') else tk.Button(logo_frame, text="Pilih Logo", command=self._browse_logo)
        btn_logo.pack(side="left", padx=5, pady=5)

        btn_clear_logo = ctk.CTkButton(
            logo_frame, text="❌ Hapus Logo", fg_color="#94A3B8", command=self._clear_logo
        ) if hasattr(ctk, 'CTkButton') else tk.Button(logo_frame, text="Hapus Logo", command=self._clear_logo)
        btn_clear_logo.pack(side="left", padx=5, pady=5)

        self.lbl_logo_info = ctk.CTkLabel(left_panel, text="Tidak ada logo terpasang", text_color="gray") if hasattr(ctk, 'CTkLabel') else tk.Label(left_panel, text="No logo")
        self.lbl_logo_info.pack(anchor="w", padx=15, pady=(2, 5))

        # Shape selector for logo
        shape_frame = ctk.CTkFrame(left_panel) if hasattr(ctk, 'CTkFrame') else tk.Frame(left_panel)
        shape_frame.pack(fill="x", padx=10, pady=5)
        
        lbl_shape = ctk.CTkLabel(shape_frame, text="Bentuk Mask Logo:") if hasattr(ctk, 'CTkLabel') else tk.Label(shape_frame, text="Shape:")
        lbl_shape.pack(side="left", padx=5)

        for s_val, s_name in [("circle", "Lingkaran"), ("rounded", "Lengkung"), ("square", "Kotak")]:
            rb = ctk.CTkRadioButton(
                shape_frame, text=s_name, value=s_val, variable=self.logo_shape_var, command=self.update_qr_preview
            ) if hasattr(ctk, 'CTkRadioButton') else tk.Radiobutton(shape_frame, text=s_name, value=s_val, variable=self.logo_shape_var, command=self.update_qr_preview)
            rb.pack(side="left", padx=5)

        # Generate / Refresh Button
        btn_generate = ctk.CTkButton(
            left_panel,
            text="✨ Generate QR Code",
            font=ctk.CTkFont(size=14, weight="bold"),
            height=40,
            command=self.update_qr_preview
        ) if hasattr(ctk, 'CTkButton') else tk.Button(left_panel, text="Generate QR Code", command=self.update_qr_preview)
        btn_generate.pack(fill="x", padx=10, pady=15)

        # Right Panel - Live Preview & Export
        right_panel = ctk.CTkFrame(main_container, width=420) if hasattr(ctk, 'CTkFrame') else tk.Frame(main_container)
        right_panel.pack(side="right", fill="both", expand=True, padx=(5, 10), pady=10)

        preview_title = ctk.CTkLabel(
            right_panel, text="Pratinjau Hasil (Preview)", font=ctk.CTkFont(size=16, weight="bold")
        ) if hasattr(ctk, 'CTkLabel') else tk.Label(right_panel, text="Preview")
        preview_title.pack(pady=10)

        # Canvas / Image container for preview
        self.preview_label = ctk.CTkLabel(right_panel, text="") if hasattr(ctk, 'CTkLabel') else tk.Label(right_panel)
        self.preview_label.pack(expand=True, padx=20, pady=10)

        # Save Button
        btn_save = ctk.CTkButton(
            right_panel,
            text="💾 Simpan Gambar QR (.png)",
            font=ctk.CTkFont(size=14, weight="bold"),
            fg_color="#10B981", # Emerald green
            hover_color="#059669",
            height=42,
            command=self._save_qr_image
        ) if hasattr(ctk, 'CTkButton') else tk.Button(right_panel, text="Simpan QR", command=self._save_qr_image)
        btn_save.pack(fill="x", padx=30, pady=(10, 20))

    def _create_section_label(self, parent, text):
        if hasattr(ctk, 'CTkLabel'):
            lbl = ctk.CTkLabel(parent, text=text, font=ctk.CTkFont(size=14, weight="bold"))
        else:
            lbl = tk.Label(parent, text=text, font=("Arial", 11, "bold"))
        lbl.pack(anchor="w", padx=10, pady=(12, 4))

    def _on_input_type_change(self, choice_text):
        if choice_text == "File Gambar" or choice_text == "image":
            self.input_type_var.set("image")
            self.input_entry.pack_forget()
            self.img_file_frame.pack(fill="x", padx=10, pady=8)
        else:
            self.img_file_frame.pack_forget()
            self.input_entry.pack(fill="x", padx=10, pady=8)
            if choice_text in ("Teks", "text"):
                self.input_type_var.set("text")
            else:
                self.input_type_var.set("link")
        self.update_qr_preview()

    def _browse_input_image(self):
        file_path = filedialog.askopenfilename(
            title="Pilih Gambar untuk Input QR",
            filetypes=[("Image Files", "*.png *.jpg *.jpeg *.webp *.bmp *.gif")]
        )
        if file_path:
            self.image_input_path = file_path
            filename = os.path.basename(file_path)
            self.lbl_img_path.configure(text=filename, text_color="white" if hasattr(ctk, 'CTk') else "black")
            self.update_qr_preview()

    def _browse_logo(self):
        file_path = filedialog.askopenfilename(
            title="Pilih Logo untuk Tengah QR",
            filetypes=[("Image Files", "*.png *.jpg *.jpeg *.webp *.bmp *.ico")]
        )
        if file_path:
            self.logo_path = file_path
            filename = os.path.basename(file_path)
            self.lbl_logo_info.configure(text=f"Logo: {filename}", text_color="#10B981")
            self.update_qr_preview()

    def _clear_logo(self):
        self.logo_path = ""
        self.lbl_logo_info.configure(text="Tidak ada logo terpasang", text_color="gray")
        self.update_qr_preview()

    def _choose_fg_color(self):
        color = colorchooser.askcolor(title="Pilih Warna QR (Foreground)", color=self.fill_color)
        if color and color[1]:
            self.fill_color = color[1]
            if hasattr(self.btn_fg_color, 'configure'):
                self.btn_fg_color.configure(fg_color=self.fill_color)
            self.update_qr_preview()

    def _choose_bg_color(self):
        color = colorchooser.askcolor(title="Pilih Warna Background", color=self.back_color)
        if color and color[1]:
            self.back_color = color[1]
            if hasattr(self.btn_bg_color, 'configure'):
                self.btn_bg_color.configure(fg_color=self.back_color)
            self.update_qr_preview()

    def _apply_color_preset(self, fg, bg):
        self.fill_color = fg
        self.back_color = bg
        if hasattr(self.btn_fg_color, 'configure'):
            self.btn_fg_color.configure(fg_color=self.fill_color)
        self.update_qr_preview()

    def update_qr_preview(self):
        input_type = self.input_type_var.get()
        
        if input_type == "image":
            data_val = self.image_input_path
            if not data_val:
                return
        else:
            if hasattr(self.input_entry, 'get'):
                data_val = self.input_entry.get("1.0", "end-1c").strip()
            else:
                data_val = ""

        if not data_val:
            data_val = "QR Code Preview"

        try:
            qr_img = generate_qr(
                data=data_val,
                input_type=input_type,
                fill_color=self.fill_color,
                back_color=self.back_color,
                logo_source=self.logo_path if self.logo_path else None,
                logo_shape=self.logo_shape_var.get(),
                logo_ratio=self.logo_ratio_val,
                box_size=10,
                border=4
            )
            self.current_qr_img = qr_img

            # Resize preview image for display
            display_img = qr_img.copy()
            display_img.thumbnail((320, 320), Image.Resampling.LANCZOS)
            
            if hasattr(ctk, 'CTkImage'):
                ctk_preview = ctk.CTkImage(light_image=display_img, dark_image=display_img, size=display_img.size)
                self.preview_label.configure(image=ctk_preview, text="")
                self.preview_tk_img = ctk_preview
            else:
                tk_preview = ImageTk.PhotoImage(display_img)
                self.preview_label.configure(image=tk_preview, text="")
                self.preview_tk_img = tk_preview

        except Exception as e:
            messagebox.showerror("Error Generating QR", f"Gagal membuat QR Code:\n{str(e)}")

    def _save_qr_image(self):
        if not self.current_qr_img:
            messagebox.showwarning("Warning", "Belum ada QR Code yang di-generate.")
            return

        file_path = filedialog.asksaveasfilename(
            title="Simpan Hasil QR Code",
            defaultextension=".png",
            filetypes=[("PNG Image", "*.png"), ("JPEG Image", "*.jpg"), ("All Files", "*.*")]
        )
        if file_path:
            try:
                self.current_qr_img.save(file_path)
                messagebox.showinfo("Berhasil", f"Gambar QR Code berhasil disimpan ke:\n{file_path}")
            except Exception as e:
                messagebox.showerror("Error", f"Gagal menyimpan file:\n{str(e)}")

    def run(self):
        self.root.mainloop()

if __name__ == "__main__":
    app = QRCodeGeneratorGUI()
    app.run()
