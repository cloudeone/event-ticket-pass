# Event & Ticket Pass — Sistem Manajemen & Tiket Digital

Sistem aplikasi tiket digital modern, aman, dan berkapasitas tinggi untuk konser, seminar, dan festival. Terdiri dari **Web Admin**, **Mobile App (Buyer & Staff)**, **Backend API**, dan **Supabase PostgreSQL**.

---

## 📌 Ringkasan Proyek & Teknologi

| Komponen | Teknologi | Keterangan |
|---|---|---|
| **Web Admin** | React 18, Vite, React Router, Lucide Icons, Pure CSS Tokens | Dashboard Admin untuk manajemen acara, kuota tiket, dan laporan |
| **Mobile App** | Flutter 3.x, Material 3, Google Fonts, Mobile Scanner, QR Flutter | Aplikasi pembeli (katalog & tiket) & mode petugas scanner QR |
| **Backend API** | Node.js (v20+ / v25), Express, JWT, Bcrypt, Helmet, Morgan | REST API dengan validasi idempotensi & atomic quota lock |
| **Database** | Supabase PostgreSQL 13+ | Schema terstandarisasi, PL/pgSQL atomic lock procedure, Idempotent Seeds |
| **Design System**| CSS Tokens (`shared/design-tokens.css`) & Dart Theme (`shared/design-tokens.dart`) | Unified tokens, WCAG AA, Modern Clean & Professional |

---

## 📂 Struktur Monorepo

```
event-ticket-pass/
├── docs/                      # Dokumentasi teknis & PRD
│   ├── design-system.md       # Dokumentasi Design System lengkap
│   └── prd-event-ticket-pass.md # Product Requirement Document (PRD v0.1)
├── shared/                    # Shared resources antar platform
│   ├── design-tokens.css      # CSS Custom Properties untuk Web Admin
│   ├── design-tokens.dart     # Dart Theme & Constants untuk Flutter
│   └── api-contract.ts        # TypeScript Type definitions & API Contract
├── web-admin/                 # Frontend Web Administrator (React + Vite)
│   ├── src/
│   │   ├── components/ui/     # Reusable UI: Button, Card, Input, Modal, Table, dll.
│   │   ├── components/layout/ # Sidebar & Topbar Responsive Layout
│   │   ├── pages/             # Login, Dashboard, Events, Orders, Staff
│   │   └── lib/               # Mock data & Supabase helper
├── backend/                   # Backend REST API (Express.js)
│   ├── src/
│   │   ├── config/            # Supabase service client
│   │   ├── controllers/       # Auth, Event, Zone, Order, Payment, Ticket, Check-in
│   │   ├── middleware/        # JWT Auth, Role RBAC, Idempotency, Validation
│   │   ├── routes/            # REST API Endpoint Routers
│   │   ├── jobs/              # Background Job Expiration (10-min reservation cleanup)
│   │   ├── utils/             # Formatting, Order & Ticket Code Generator
│   │   └── database/          # Migrations (001_initial_schema.sql) & Seeds
├── mobile/                    # Mobile Application (Flutter)
│   ├── lib/
│   │   ├── config/theme.dart  # App Theme sinkron dengan design tokens
│   │   ├── models/            # Entity models & status extensions
│   │   ├── screens/           # Auth, Buyer (Catalog, Payment), Staff (Check-in)
│   │   └── utils/             # Rupiah & Date Formatters
└── README.md                  # Panduan utama menjalankan proyek
```

---

## 🚀 Panduan Menjalankan Proyek

### 1. Prasyarat Sistem
- **Node.js**: v20.x atau lebih baru (Node v25 sudah teruji)
- **npm**: v10.x atau lebih baru
- **Flutter SDK**: v3.19+ (opsional jika menguji mobile secara native)

---

### 2. Menjalankan Backend API

```bash
# 1. Masuk ke direktori backend
cd backend

# 2. Salin environment variables (opsional, server memiliki mode fallback demo otomatis)
copy .env.example .env

# 3. Install dependencies
npm install

# 4. Jalankan server backend (port 3001)
npm run dev
# Atau: node src/server.js
```
*Health Check endpoint:* `http://localhost:3001/api/health`

---

### 3. Menjalankan Web Admin

```bash
# 1. Buka terminal baru dan masuk ke direktori web-admin
cd web-admin

# 2. Install dependencies
npm install

# 3. Jalankan development server
npm run dev
```
Buka browser di: **`http://localhost:3000`**

---

### 4. Menjalankan Mobile App (Flutter)

```bash
# 1. Masuk ke direktori mobile
cd mobile

# 2. Ambil dependencies Flutter
flutter pub get

# 3. Jalankan di emulator / perangkat fisik
flutter run
```

---

## 🔑 Kredensial Akun Pengujian (Demo)

Sesuai seed database (`001_seed_data.sql`) dan PRD:

| Peran | Platform | Email | Kata Sandi |
|---|---|---|---|
| **Administrator** | **Web Admin** | `admin@eventpass.com` | `Admin123!` |
| **Pembeli (Buyer)** | **Mobile App** | `buyer@test.com` | `Test1234!` |
| **Petugas (Staff)** | **Mobile App** | `staff@test.com` | `Test1234!` |

> **Catatan Aturan Bisnis (BR-AUTH-004):**  
> Akun Admin **hanya dapat login di Web Admin** (ditolak di mobile). Akun Pembeli & Petugas **hanya dapat login di aplikasi Mobile** (ditolak di Web Admin).

---

## 🔄 Alur Demo End-to-End (Sesuai PRD)

1. **Login Admin:** Masuk ke Web Admin dengan `admin@eventpass.com` / `Admin123!`.
2. **Kelola Acara & Zona:**
   - Buka menu **Manajemen Acara** → Buat Acara Baru (status awal `DRAF`).
   - Masuk ke detail acara → Tambahkan Zona Tiket (VIP, Regular) dengan harga dan kuota.
   - Klik **Aktifkan Acara** (hanya bisa jika minimal ada 1 zona tiket).
3. **Pemesanan Pembeli (Mobile):**
   - Pembeli memilih zona tiket dan kuota (1-12 tiket).
   - Sistem secara atomik mengunci kuota selama **10 menit** (`waiting_payment`).
4. **Simulasi Pembayaran:**
   - Tombol *Bayar Gagal*: Pesanan tetap menunggu pembayaran, kuota tetap terkunci, pembeli dapat mencoba lagi sebelum waktu habis.
   - Tombol *Bayar Berhasil*: Status berubah menjadi `DIBAYAR`, kuota terkunci dikonversi menjadi terjual, tiket digital QR unik langsung diterbitkan.
5. **Check-in Petugas Lapangan:**
   - Petugas login di Mobile, memilih acara.
   - Scan tiket QR:
     - Scan pertama → **VALID** (berubah menjadi `DIPAKAI`, mencatat waktu & ID petugas).
     - Scan kedua pada tiket yang sama → **SUDAH DIPAKAI** (ditolak dengan waktu check-in sebelumnya).
     - QR acara lain / rusak → **TIDAK VALID**.
6. **Pantau Dasbor:** Admin melihat total pendapatan, tiket terjual, tiket dikunci, dan kehadiran ter-update secara real-time.

---

## 🛡️ Aturan Kerjasama & Sinkronisasi Tim

1. **Database:** Skema dan migrasi dipimpin oleh Database Engineer di `backend/src/database/migrations/`. Jangan melakukan modifikasi skema ad-hoc tanpa koordinasi.
2. **API Contract:** Setiap perubahan endpoint harus mengacu pada `shared/api-contract.ts` agar integrasi frontend tidak patah.
3. **Design System:** Gunakan token warna, ukuran font, dan status badge dari `shared/design-tokens.css` dan `shared/design-tokens.dart`.
