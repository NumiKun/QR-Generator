# Product Requirements Document (PRD) — AnyQR Precision Utility

**Product Name:** AnyQR  
**Document Version:** 1.0  
**Status:** Ready for Engineering Review  
**Target Platform:** Modern Web (Desktop & Mobile Responsive)  
**Primary Aesthetic & Design System:** AnyQR Precision Utility (Indigo `#4F46E5`, Neutral Slates, High Contrast)

---

## 1. Executive Summary & Vision

### 1.1 Problem Statement

Most web-based QR code generators suffer from cluttered interfaces, intrusive paywalls, subscription gating for high-resolution vector exports, and security concerns where target URLs, proprietary files, and branding assets are transmitted to remote servers.

### 1.2 Product Vision

**AnyQR** is a high-precision, zero-telemetry client-side QR code generator studio. It delivers a fast, privacy-first web utility for designers, developers, marketers, and privacy-conscious users to customize, preview in real time, and export production-ready vector (`SVG`) and raster (`PNG` up to 4K) QR codes without server latency or tracking.

---

## 2. Target Personas & Core User Stories

| Persona | Role & Context | Core Need |
| :--- | :--- | :--- |
| **Product Designer** | Building physical packaging, event badges, and marketing collateral. | Pixel-perfect SVG export, custom eye styles, logo integration with safe module padding, and WCAG contrast check. |
| **Developer & DevOps** | Generating Wi-Fi credentials, internal staging links, or API endpoints. | Fast keyboard workflows (`⌘C`, `⌘S`), instant payload validation, zero external data leaks. |
| **Marketer & Event Organizer** | Creating scannable campaign links and table stands. | Scannable CTA frames ("Scan Me"), custom brand color matching, high-res 4K PNG prints. |

---

## 3. Core Feature Specifications

### 3.1 Input Channel & Payload Management

- **Segmented Input Modes:**
  - `URL / Link`: Auto-protocol prefixing (`https://`), trailing slash normalization, inline clear action, real-time URL validation.
  - `Plain Text`: Multi-line text support with live character and byte counter.
  - `Image / File Upload`: Local binary ingestion (client-side base64 or ephemeral blob URL generation with size limit indicators).
- **Client-Side Runtime:** Strict Zero-Telemetry guarantee. No payload data, image files, or configuration state leaves the browser thread.

### 3.2 Matrix Customization Studio

- **Color & Contrast Controls:**
  - Foreground matrix color picker (HEX input + preset palette chips).
  - Background color picker + "Transparent Background" toggle with alpha channel preservation in export.
  - Automated contrast ratio validator (WCAG AA/AAA compliance threshold check against scannability benchmarks).
- **Matrix Module Patterns:**
  - Geometry presets: Classic Square, Rounded Dots, Smooth Pill, Liquid Fluid.
  - Corner Eye Frames: Square, Rounded Square, Circle, Asymmetric Leaf.
  - Inner Eye Pupils: Square, Circle, Diamond, Rounded Square.
- **Logo & Insignia Embedding:**
  - Asset upload slot (SVG / PNG / WebP).
  - Scale Proportion Slider: Configurable from 15% up to safe limit (35%).
  - Safe Module Clearing: Automated deletion of data modules beneath logo with configurable clear margin to guarantee error-correction redundancy.
- **CTA Frames & Badges:**
  - Presets: Frameless, Bottom Ribbon ("SCAN ME"), Top Header, Phone Mockup enclosure.
  - Editable CTA label text and badge color inheritance.

### 3.3 Live Vector Engine & Sticky Stage

- **Real-Time Render Pipeline:** Low-latency DOM/Canvas vector re-calculation upon any state change.
- **Technical Metadata Readout:**
  - Error Correction Level (ECC: L 7%, M 15%, Q 25%, H 30% — auto-switches to H when logo is active).
  - QR Version & Grid Dimensions (e.g., Version 4: 33×33).
  - Encoding schema indicator (Numeric, Alphanumeric, Byte, UTF-8).
- **Quick Clipboard Action:**
  - One-click copy directly to system clipboard as raster/vector blob with hotkey binding (`⌘C` / `Ctrl+C`).

### 3.4 Export Deck

- **Raster Export:** PNG generation with configurable resolution presets (`1024 × 1024`, `2048 × 2048 (4K)`, custom DPI).
- **Vector Export:** Production-clean SVG with grouped paths, zero CSS dependencies, and optional inline embed snippet copy.
- **Print Utility:** Ready-to-print A4 / Letter formatted sheet generator for immediate physical deployment.

---

## 4. Non-Functional Requirements & Architecture

- **Privacy & Security:** 100% client-side computation. LocalStorage persistence for user preferences without external sync.
- **Performance:** Sub-16ms re-render on desktop devices during slider manipulations. Initial load under 1.2s.
- **Accessibility:** Keyboard navigable inputs with accessible ARIA labels, high-contrast default mode, focus indicators conforming to design tokens.
- **Supported Platforms:** Chromium, Safari, Firefox modern desktop browsers; responsive fallback for mobile screens.

---

## 5. Success Metrics (KPIs)

1. **Time-to-Export:** Median user completion time from link input to file export under 15 seconds.
2. **Scan Reliability:** >99.8% first-attempt scan success rate across standard iOS Camera and Android Lens scanners.
3. **Client-Side Integrity:** 0 network payload requests dispatched during code generation and export.
