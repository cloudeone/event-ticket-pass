# Event & Ticket Pass — Design System Documentation

> **Versi:** 1.0.0  
> **Status:** Final MVP  
> **Role:** Senior Product Designer & Technical Project Lead  
> **Target Platform:** Web Admin (Desktop & Responsive Tablet/Mobile) + Mobile App (Buyer & Staff)

---

## 1. Filosofi & Karakter UI

Desain **Event & Ticket Pass** mengusung estetika:
- **Modern & Clean:** Whitespace terukur, hierarki visual jelas, meminimalkan elemen dekoratif tanpa guna.
- **Premium & Profesional:** Sentuhan deep indigo & slate gray, tipografi Inter yang tajam, subtle elevation shadow, dan transisi halus (150-200ms).
- **Fokus Transaksional:** Komponen transaksi (beli, bayar simulasi, dan status check-in) memiliki kontras tinggi dan feedback instan untuk mencegah kesalahan pengguna.
- **Aksesibilitas (WCAG AA):** Kontras teks terhadap latar belakang minimal 4.5:1, target sentuh minimal 44x44px, dan status tidak hanya mengandalkan warna melainkan selalu disertai label teks dan ikon.

---

## 2. Color Palette

Desain menggunakan CSS custom properties di `shared/design-tokens.css` dan Dart theme di `shared/design-tokens.dart`.

### 2.1 Primary Brand (Deep Indigo)
Ramp indigo memberikan kesan terpercaya, aman, dan berkelas tinggi untuk aplikasi transaksi tiket.
| Token | Hex | Penggunaan |
|---|---|---|
| `--color-primary-50` | `#EEF2FF` | Background badge / highlight aktif |
| `--color-primary-100` | `#E0E7FF` | Border subtle / hover ring |
| `--color-primary-500` | `#6366F1` | Primary hover state |
| `--color-primary-600` | `#4F46E5` | **Primary Brand Base / CTA Utama** |
| `--color-primary-700` | `#4338CA` | Active / Pressed state |
| `--color-primary-900` | `#312E81` | Dark accents |

### 2.2 Neutral & Surface (Slate)
| Token | Hex | Penggunaan |
|---|---|---|
| `--color-secondary-50` | `#F8FAFC` | App Background (Canvas) |
| `--color-secondary-100` | `#F1F5F9` | Hover card / Table header |
| `--color-secondary-200` | `#E2E8F0` | Default Border & Divider |
| `--color-secondary-400` | `#94A3B8` | Placeholder / Disabled text |
| `--color-secondary-500` | `#64748B` | Secondary body text / Icons |
| `--color-secondary-700` | `#334155` | Strong text / Form labels |
| `--color-secondary-900` | `#0F172A` | Heading / Primary text (High contrast) |

### 2.3 Semantic & Status Colors
| Status / Kategori | Color | Hex | Background Hex | Penggunaan |
|---|---|---|---|---|
| **Success / Valid / Aktif** | Emerald | `#10B981` | `#ECFDF5` | Tiket Valid, Status AKTIF, Pembayaran Berhasil |
| **Warning / Pending** | Amber | `#F59E0B` | `#FFFBEB` | Menunggu Pembayaran, Acara Diarsipkan, Tiket Terpakai |
| **Error / Dibatalkan** | Rose / Red | `#EF4444` | `#FEF2F2` | Tiket Tidak Valid, Pesanan Dibatalkan, Form Error |
| **Info / Draft** | Blue / Slate | `#3B82F6` | `#EFF6FF` | Status Draf, Keterangan Info |

---

## 3. Typography

Menggunakan typeface **Inter** (dengan fallbacks `system-ui, -apple-system, sans-serif`).

| Level | Size | Weight | Line Height | Penggunaan |
|---|---|---|---|---|
| **Display / H1** | `32px` (2rem) | Bold (700) | 1.2 | Page title utama, Hero banner |
| **Heading / H2** | `24px` (1.5rem) | SemiBold (600) | 1.25 | Section title, Modal title |
| **Subhead / H3** | `18px` (1.125rem) | SemiBold (600) | 1.35 | Card header, Stat value |
| **Body Large** | `16px` (1rem) | Regular (400) / Medium (500) | 1.5 | Paragraf penting, Input text, Button regular |
| **Body Base** | `14px` (0.875rem) | Regular (400) | 1.5 | Default body text, Tabel data, Form input |
| **Caption / Small** | `12px` (0.75rem) | Medium (500) | 1.4 | Badges, Helper text, Timestamp |
| **Tiny** | `11px` (0.6875rem) | SemiBold (600) | 1.3 | Micro tags, Caps tracking |

---

## 4. Spacing & Elevation

### 4.1 Spacing Scale (4px Base Grid)
- `space-1`: 4px
- `space-2`: 8px
- `space-3`: 12px
- `space-4`: 16px (Default container & padding)
- `space-5`: 20px
- `space-6`: 24px (Card padding standard)
- `space-8`: 32px (Section gap)
- `space-10`: 40px
- `space-12`: 48px
- `space-16`: 64px

### 4.2 Border Radius
- `radius-sm`: 6px (Badges, small buttons)
- `radius-md`: 8px (Default inputs, standard buttons, dropdown menus)
- `radius-lg`: 12px (Cards, modal dialogs)
- `radius-xl`: 16px (Featured banners, floating wallet cards)
- `radius-full`: 9999px (Pill badges, avatar)

### 4.3 Elevation Shadows
- `shadow-sm`: `0 1px 2px 0 rgba(0, 0, 0, 0.05)` (Default card flat border)
- `shadow-md`: `0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -2px rgba(0, 0, 0, 0.05)` (Card hover, popover)
- `shadow-lg`: `0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.05)` (Modal dialog, dropdown)

---

## 5. Komponen Utama (Spesifikasi Teknis)

### 5.1 Button
- **Varian:**
  - `primary`: Background `#4F46E5`, teks putih, hover `#4338CA`.
  - `secondary`: Background `#F1F5F9`, border `#E2E8F0`, teks `#0F172A`.
  - `outline`: Background transparan, border `#4F46E5`, teks `#4F46E5`.
  - `ghost`: Background transparan, tanpa border, hover `#F1F5F9`.
  - `danger`: Background `#EF4444`, teks putih, hover `#DC2626`.
- **States:** Default, Hover, Active, Focus Ring (`ring-2 ring-primary-500`), Loading (spinner animasi), Disabled (`opacity: 0.5, pointer-events: none`).
- **Ukuran:**
  - `sm`: Height 32px, text 12px, padding 0 12px
  - `md`: Height 40px, text 14px, padding 0 16px
  - `lg`: Height 48px, text 16px, padding 0 24px

### 5.2 Card
- Background: `#FFFFFF`
- Border: `1px solid var(--color-secondary-200)`
- Border Radius: `var(--radius-lg)` (12px)
- Padding: `var(--space-6)` (24px)
- Hover (opsional jika clickable): translate Y -2px, box-shadow `shadow-md`.

### 5.3 Input / Form Controls
- Text input, textarea, dan select element.
- Border normal: `1px solid #E2E8F0`.
- Focus state: Border `#4F46E5`, Box Shadow `0 0 0 3px rgba(79, 70, 229, 0.15)`.
- Error state: Border `#EF4444`, Box Shadow `0 0 0 3px rgba(239, 68, 68, 0.15)`, pesan error di bawah input warna merah 12px.
- Height: 40px (standard). Padding: 10px 14px.

### 5.4 Modal Dialog
- Overlay: `rgba(15, 23, 42, 0.5)` with `backdrop-filter: blur(4px)`.
- Dialog Container: Max width 520px (md), 680px (lg).
- Animasi masuk: Fade-in + slight scale-up (0.98 to 1.0) 180ms ease-out.
- Header dengan Title dan tombol Close (X).
- Body dapat di-scroll jika melebihi `80vh`.
- Footer rata kanan dengan aksi Batal dan Aksi Utama.

### 5.5 Status Badge
Bentuk pill dengan background pudar dan teks warna solid:
- `DRAF`: Background `#F1F5F9`, Text `#475569`
- `AKTIF`: Background `#ECFDF5`, Text `#047857`
- `DIARSIPKAN`: Background `#FFFBEB`, Text `#B45309`
- `MENUNGGU_PEMBAYARAN`: Background `#EFF6FF`, Text `#1D4ED8`
- `DIBAYAR`: Background `#ECFDF5`, Text `#047857`
- `DIBATALKAN`: Background `#FEF2F2`, Text `#B91C1C`
- `KEDALUWARSA`: Background `#F1F5F9`, Text `#64748B`
- `VALID`: Background `#ECFDF5`, Text `#047857` (Check-in)
- `SUDAH_DIPAKAI`: Background `#FFFBEB`, Text `#B45309`
- `TIDAK_VALID`: Background `#FEF2F2`, Text `#B91C1C`

---

## 6. Layout & Responsivitas

- **Desktop (>= 1024px):**
  - Web Admin memiliki Sidebar tetap di sisi kiri (width 260px).
  - Main content padding 32px.
  - Multi-column grid untuk metrik statistik dan formulir edit.
- **Tablet / Mobile (< 1024px):**
  - Sidebar berganti menjadi collapsible slide-over menu dengan hamburger trigger.
  - Tabel memiliki horizontal scrolling (`overflow-x: auto`) dengan sticky header.
  - Form input beralih menjadi full-width 1 kolom.
  - Tombol aksi utama sticky di bottom sheet jika diperlukan pada mobile flow.

---

## 7. Standar Format Konten
1. **Mata Uang:** Selalu gunakan format Rupiah Indonesia, e.g. `Rp 150.000` (menggunakan titik pemisah ribuan, tanpa desimal).
2. **Tanggal & Waktu:** Selalu cantumkan zona waktu WIB, e.g. `24 Nov 2026, 19:00 WIB`.
3. **Bahasa:** Semua antarmuka pengguna memakai **Bahasa Indonesia** yang baku, ringkas, dan jelas.
