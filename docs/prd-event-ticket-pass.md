# PRD — Event & Ticket Pass

**Legenda sumber informasi** (dipakai di seluruh dokumen):
- **[B]** = tertulis di Project Brief v1.0.
- **[K]** = keputusan tim pada putaran klarifikasi PRD (18 Okt 2026).
- **[P]** = *Proposed*: usulan penyusun PRD, belum menjadi keputusan final. Perlu persetujuan tim/mentor.
- **TBD** = belum diputuskan; daftar lengkap di Bagian 16.

---

## 1. Document Information

| Item | Isi |
|---|---|
| Nama produk | Event & Ticket Pass |
| Versi dokumen | 0.1 |
| Status | **Draft**: menunggu review tim dan mentor |
| Tanggal | 18 Oktober 2026 |
| Pemilik dokumen | Tim Event & Ticket Pass (penanggung jawab penulisan: TBD) |
| Stakeholder | Mentor (penilai); Akhdan dan Ammar (UI/UX); Galang (Web); Hilmy (Mobile); Yudha dan Akhwan (Backend dan Database) |
| Dokumen acuan | `project-brief-event-ticket-pass.md` v1.0 |

**Riwayat perubahan**

| Versi | Tanggal | Perubahan |
|---|---|---|
| 0.1 | 18 Okt 2026 | Draf awal berdasarkan Project Brief v1.0 dan 5 keputusan klarifikasi |

**Keputusan klarifikasi yang dipakai dalam PRD ini [K]**
1. Satu pesanan = satu acara dan satu zona tiket, jumlah 1-12.
2. Pembayaran simulasi: *Bayar Gagal* membiarkan pesanan tetap aktif (boleh coba lagi sampai batas waktu); *Batal* membatalkan pesanan dan melepas kuota; waktu habis mengedaluwarsakan pesanan; pembayaran sukses tidak dapat diubah.
3. Aturan perubahan acara/zona setelah ada penjualan (lihat BR-EVT dan BR-TKC).
4. Aturan check-in: Petugas memilih acara dahulu, QR acara lain ditolak, tanpa jendela waktu, dicatat waktu dan Petugas.
5. Definisi metrik dasbor; dasbor menampilkan total keseluruhan dan ringkasan per acara, tanpa filter tanggal.

**Penyesuaian terhadap Project Brief (mohon ditinjau)**
- Daftar dan detail acara dasar dinaikkan menjadi **P0**, karena alur pembelian P0 tidak dapat berjalan tanpanya. Pencarian, filter, dan pengurutan tetap **P1** seperti di Brief.
- Tampilan tiket dan QR minimum (FR-WAL-001) dikerjakan sebagai **P0**, karena check-in P0 membutuhkan QR yang dapat ditampilkan. Pengelompokan Ticket Wallet (FR-WAL-002) tetap **P1**.
- Validasi QR di server (FR-CHK-001) adalah **P0**; layar scanner di mobile (FR-CHK-002) tetap **P1** seperti di Brief.

---

## 2. Product Overview

**Latar belakang dan problem statement.** Pengelolaan acara dan penjualan tiket menimbulkan masalah teknis nyata: kuota terbatas yang diperebutkan banyak pembeli, pembayaran yang rawan diproses ganda, dan tiket digital yang harus sulit dipalsukan dan tidak boleh dipakai dua kali. Proyek ini mempelajari dan membangun solusi untuk masalah-masalah tersebut secara utuh dari perencanaan hingga deployment [B]. PRD ini tidak memuat data pasar atau statistik karena belum ada riset.

**Visi.** Platform ticketing yang sederhana, andal, dan aman: penyelenggara mudah mengelola acara, pembeli memperoleh tiket digital yang valid dalam beberapa langkah [B].

**Target pengguna.** Pembeli (mobile), Admin (web), Petugas check-in (mobile, mode Petugas) [B].

**Value proposition**

| Pengguna | Nilai yang diberikan |
|---|---|
| Pembeli | Menemukan acara, membeli tiket, dan menyimpan QR di satu aplikasi tanpa risiko tiket ganda atau tiket yang dijual melebihi kuota |
| Admin | Mengelola acara dan tiket di satu tempat serta melihat penjualan dan kehadiran dengan angka yang konsisten |
| Petugas | Memvalidasi tiket dengan cepat dan jelas (valid, sudah dipakai, tidak valid) |
| Tim dan mentor | Studi kasus produk lengkap dengan standar transaksi yang aman |

**Hasil yang ingin dicapai.** Versi demo online dengan alur end-to-end berjalan: buat acara → pesan tiket → bayar (simulasi) → tiket QR → check-in [B].

---

## 3. Goals and Success Metrics

Target mengikuti Project Brief Bagian 4 dan 15 tanpa perubahan angka [B].

| ID | Tujuan produk | Indikator dan target | Metode verifikasi |
|---|---|---|---|
| G-1 | Alur inti end-to-end | Berjalan penuh di demo tanpa bantuan manual di database | Demo terjadwal dan TS-16, TS-21 |
| G-2 | Tidak melebihi kuota | Permintaan bersamaan atas stok terbatas tidak pernah melebihi kuota | TS-12 |
| G-3 | Tidak ada pembayaran ganda | Klik/pengiriman ganda menghasilkan satu pembayaran dan satu set tiket | TS-13, TS-18 |
| G-4 | QR sah sekali | Scan kedua pada tiket yang sama ditolak | TS-22, TS-24 |
| G-5 | Kedaluwarsa reservasi | Pesanan tidak dibayar kedaluwarsa dan kuota kembali | TS-14 |
| G-6 | Deployment online | Backend, database, dan web dapat diakses online; mobile dapat didemokan | TS-32 |
| G-7 | Kelengkapan fitur | P0 selesai 100%; P1 selesai ≥ 80%, sisanya terdokumentasi sebagai tertunda | Checklist rilis (Bagian 15) |
| G-8 | Dokumentasi | Swagger mencakup seluruh endpoint; ERD dan dokumen desain tersedia | TS-31 |
| G-9 | Pelaporan dan kolaborasi | Laporan mingguan tersampaikan; setiap anggota memiliki kontribusi tercatat | Laporan mingguan dan riwayat GitHub |

---

## 4. Scope

### 4.1 In scope dan prioritas

| Prioritas | Fitur | Requirement |
|---|---|---|
| **P0** | Registrasi, login, peran, akun Admin awal | FR-AUTH-001 s.d. 004 |
| **P0** | Kelola acara dan zona tiket (buat, ubah, aktifkan/arsipkan) | FR-EVT-001 s.d. 003, FR-TKC-001, 002 |
| **P0** | Daftar dan detail acara dasar | FR-DSC-001 |
| **P0** | Pesanan, penguncian kuota, kedaluwarsa, pembatalan | FR-ORD-001 s.d. 003 |
| **P0** | Pembayaran simulasi dan perlindungan duplikasi | FR-PAY-001 s.d. 003 |
| **P0** | Penerbitan tiket QR dan tampilan QR | FR-TIX-001, FR-WAL-001 |
| **P0** | Validasi QR di server | FR-CHK-001 |
| **P1** | Hapus/nonaktifkan zona | FR-TKC-003 |
| **P1** | Pencarian, filter, pengurutan acara | FR-DSC-002, 003 |
| **P1** | Riwayat pesanan pembeli | FR-ORD-004 |
| **P1** | Ticket Wallet (daftar tiket) | FR-WAL-002 |
| **P1** | Scanner Petugas di mobile | FR-CHK-002 |
| **P1** | Akun Petugas | FR-STF-001 |
| **P1** | Riwayat penjualan, status pembayaran, dasbor | FR-RPT-001, 002 |
| **P2** | Pengurutan jarak, gambar denah statis, input kode manual, reset sandi Petugas, dasbor lebih kaya | Bagian 7.12 |

### 4.2 Out of scope [B]
Payment gateway sungguhan; refund dan pembatalan tiket oleh pembeli; pemilihan kursi; banyak penyelenggara; biaya layanan, komisi, voucher; notifikasi push/email; ekspor laporan dan grafik kompleks; transfer tiket dan input nama pemegang; publikasi ke toko aplikasi; aplikasi scanner terpisah; mode offline; uji beban skala besar.

### 4.3 Batasan MVP
Satu penyelenggara tanpa monetisasi; satu level Admin; satu zona per pesanan [K]; kapasitas tim ±288-384 jam; satu developer frontend per sisi; hosting gratis.

### 4.4 Asumsi dan dependensi
- Asumsi dari Brief tetap berlaku (Bagian 13 Brief), termasuk Petugas dapat memindai semua acara [B].
- Dependensi: layanan hosting gratis (TBD-01), paket Flutter untuk pindai dan tampil QR, ketersediaan mentor.
- Desain UI/UX, ERD, dan API Specification **belum selesai**; seluruhnya masih menjadi pekerjaan setelah PRD.

---

## 5. User Roles and Permissions

Hanya tiga peran yang ada di Brief [B]. Tidak ada mode tamu; seluruh fitur memerlukan login [P] (TBD-15).

| Peran | Platform | Akun | Tanggung jawab |
|---|---|---|---|
| Pembeli | Mobile | Daftar sendiri | Mencari acara, memesan, membayar (simulasi), menyimpan dan menunjukkan QR |
| Petugas | Mobile (mode Petugas) | Dibuat Admin | Memilih acara, memindai dan memvalidasi QR |
| Admin | Web | Seed database, satu level | Mengelola acara, zona, Petugas; memantau penjualan |

**Matriks permission** (✅ boleh, ❌ tidak)

| Fitur | Pembeli | Petugas | Admin |
|---|---|---|---|
| Registrasi akun | ✅ (publik) | ❌ | ❌ |
| Login | ✅ mobile | ✅ mobile | ✅ web |
| Lihat daftar/detail acara | ✅ | ❌ | ✅ (via kelola acara) |
| Buat pesanan, bayar, batalkan (milik sendiri) | ✅ | ❌ | ❌ |
| Lihat riwayat pesanan dan Ticket Wallet (milik sendiri) | ✅ | ❌ | ❌ |
| Pilih acara dan validasi QR | ❌ | ✅ | ❌ |
| Kelola acara dan zona | ❌ | ❌ | ✅ |
| Kelola akun Petugas | ❌ | ❌ | ✅ |
| Riwayat penjualan, data pembeli, dasbor | ❌ | ❌ | ✅ |

Pembatasan platform (Admin hanya web; Pembeli dan Petugas hanya mobile) diusulkan [P], sejalan dengan Brief.

---

## 6. User Journeys and Main Scenarios

**UJ-01 Registrasi dan login.** Pembeli mengisi nama, email, sandi → akun dibuat → login → masuk ke mode Pembeli. Petugas login di aplikasi yang sama → masuk ke mode Petugas. Admin login di web.

**UJ-02 Menemukan acara.** Pembeli membuka daftar acara → mencari kata kunci → memfilter kategori/tanggal/kota → mengurutkan (termurah, termahal, tanggal terdekat).

**UJ-03 Detail acara dan zona.** Pembeli membuka detail → melihat jadwal, lokasi, dan zona (nama, harga, sisa kuota, status penjualan).

**UJ-04 Pemesanan.** Pembeli memilih satu zona dan jumlah 1-12 → sistem mengunci kuota dan membuat pesanan berstatus menunggu pembayaran dengan hitung mundur 10 menit.

**UJ-05 Kedaluwarsa.** Pesanan tidak dibayar dalam 10 menit → sistem menandai kedaluwarsa dan melepas kuota. Pembeli yang ingin lanjut harus membuat pesanan baru.

**UJ-06 Simulasi pembayaran.** Pembeli membuka layar simulasi → memilih *Bayar Berhasil*, *Bayar Gagal*, atau *Batalkan Pesanan*. Gagal: boleh mencoba lagi selama waktu masih ada. Batal: kuota dilepas.

**UJ-07 Penerbitan QR.** Setelah *Bayar Berhasil*, sistem menerbitkan satu tiket QR per tiket yang dibeli.

**UJ-08 Ticket Wallet.** Pembeli membuka Wallet → melihat tiket per acara → membuka tiket untuk menampilkan QR.

**UJ-09 Check-in.** Petugas memilih acara → memindai QR → melihat hasil (valid, sudah dipakai, tidak valid).

**UJ-10 Kelola acara dan zona.** Admin membuat acara (draf) → menambah zona (harga, kuota, periode jual) → mengaktifkan acara → mengubah atau mengarsipkannya.

**UJ-11 Kelola Petugas.** Admin membuat akun Petugas → dapat menonaktifkan/mengaktifkan kembali.

**UJ-12 Riwayat penjualan.** Admin melihat daftar pesanan beserta status pembayaran, memfilter, dan membuka detail.

**UJ-13 Dasbor.** Admin melihat total pendapatan, tiket terjual, tiket dikunci, jumlah check-in, dan ringkasan per acara.

---

## 7. Functional Requirements

Kolom *Acceptance criteria* memakai AC1, AC2, dst. Aturan bisnis dirujuk lewat ID (Bagian 8).

### 7.1 Authentication and Authorization

| Field | Isi |
|---|---|
| Requirement ID | FR-AUTH-001 |
| Nama | Registrasi Pembeli |
| Priority | P0 |
| Actor | Calon Pembeli (mobile) |
| Description | Pengguna membuat akun dengan nama, email, dan sandi. Registrasi publik hanya menghasilkan peran Pembeli. |
| Preconditions | Belum memiliki akun; aplikasi terhubung ke API. |
| Main flow | 1) Pengguna mengisi nama, email, sandi. 2) Mengirim formulir. 3) Sistem memvalidasi. 4) Akun dibuat dengan peran Pembeli. 5) Pengguna diarahkan ke layar login. |
| Alternative flow | Pengiriman ganda (klik dua kali) menghasilkan satu akun saja. |
| Error handling | Email sudah terdaftar: pesan jelas pada kolom email. Sandi tidak memenuhi aturan: pesan per kolom. API tidak tersedia: pesan dan opsi coba lagi. |
| Business rules | BR-AUTH-001, 002, 003 |
| Acceptance criteria | AC1: akun baru dapat login. AC2: email duplikat (tanpa membedakan huruf besar/kecil) ditolak. AC3: peran selalu Pembeli walau klien mengirim peran lain. AC4: sandi tersimpan sebagai hash dan tidak pernah muncul di respons. |
| Dependencies | FR-AUTH-002 |

| Field | Isi |
|---|---|
| Requirement ID | FR-AUTH-002 |
| Nama | Login dan sesi |
| Priority | P0 |
| Actor | Pembeli, Petugas (mobile); Admin (web) |
| Description | Pengguna login dengan email dan sandi. Sistem menerbitkan token sesi bermasa berlaku. Aplikasi mobile mengarahkan sesuai peran (Pembeli ke mode Pembeli, Petugas ke mode Petugas); web hanya menerima Admin. |
| Preconditions | Akun ada dan aktif. |
| Main flow | 1) Mengisi email dan sandi. 2) Sistem memverifikasi. 3) Sistem menerbitkan token. 4) Aplikasi mengarahkan sesuai peran. |
| Alternative flow | Logout menghapus sesi di klien. Token kedaluwarsa: pengguna diminta login ulang. |
| Error handling | Kredensial salah: pesan generik yang tidak membedakan email atau sandi. Akun nonaktif: ditolak. Peran tidak sesuai platform: ditolak dengan pesan "akun tidak dapat digunakan di aplikasi ini". |
| Business rules | BR-AUTH-004, 005, 006 |
| Acceptance criteria | AC1: login berhasil untuk ketiga peran di platform yang benar. AC2: Admin ditolak di mobile; Pembeli dan Petugas ditolak di web. AC3: kredensial salah menghasilkan pesan yang sama untuk email tidak ada dan sandi salah. AC4: akun nonaktif tidak dapat login. AC5: token kedaluwarsa menolak request dan memicu login ulang. |
| Dependencies | FR-AUTH-001, FR-AUTH-004, FR-STF-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-AUTH-003 |
| Nama | Otorisasi berbasis peran |
| Priority | P0 |
| Actor | Seluruh pengguna |
| Description | Setiap endpoint hanya dapat diakses oleh peran yang diizinkan (matriks Bagian 5). Data milik Pembeli hanya dapat diakses pemiliknya. |
| Preconditions | Pengguna terautentikasi. |
| Main flow | 1) Klien mengirim request dengan token. 2) Sistem memeriksa peran dan kepemilikan data. 3) Request diproses. |
| Alternative flow | - |
| Error handling | Tanpa token atau token tidak valid: ditolak sebagai belum terautentikasi. Peran tidak berhak atau data milik pengguna lain: ditolak tanpa membuka isi data. |
| Business rules | BR-AUTH-007, 008 |
| Acceptance criteria | AC1: Pembeli yang memanggil endpoint Admin ditolak. AC2: Pembeli A tidak dapat membuka pesanan atau tiket Pembeli B. AC3: Petugas tidak dapat mengakses data riwayat penjualan. AC4: setiap penolakan tercatat di log. |
| Dependencies | FR-AUTH-002 |

| Field | Isi |
|---|---|
| Requirement ID | FR-AUTH-004 |
| Nama | Akun Admin awal (seed) |
| Priority | P0 |
| Actor | Tim developer |
| Description | Akun Admin pertama dibuat lewat proses seed. Tidak ada pendaftaran Admin melalui antarmuka. |
| Preconditions | Database terinisialisasi. |
| Main flow | 1) Seed berjalan saat inisialisasi. 2) Membuat Admin dengan kredensial dari konfigurasi lingkungan. |
| Alternative flow | Seed dijalankan ulang tidak membuat Admin ganda. |
| Error handling | Konfigurasi kredensial kosong: seed gagal dengan pesan jelas. |
| Business rules | BR-AUTH-009 |
| Acceptance criteria | AC1: Admin seed dapat login di web. AC2: kredensial tidak ada di repository. AC3: seed bersifat aman diulang. |
| Dependencies | - |

### 7.2 Event Management

| Field | Isi |
|---|---|
| Requirement ID | FR-EVT-001 |
| Nama | Buat dan ubah acara |
| Priority | P0 |
| Actor | Admin |
| Description | Admin membuat acara dengan judul, deskripsi, kategori acara, tanggal-waktu mulai dan selesai, nama tempat, alamat, dan kota. Acara baru berstatus DRAF. Admin dapat mengubah data acara. Gambar poster: TBD-06. |
| Preconditions | Admin login. |
| Main flow | 1) Admin mengisi formulir. 2) Sistem memvalidasi dan menyimpan sebagai DRAF. 3) Admin menambah zona lalu mengaktifkan acara (FR-EVT-002). |
| Alternative flow | Mengubah acara yang sudah punya pesanan diperbolehkan untuk judul, deskripsi, jadwal, dan lokasi; pembeli melihat informasi terbaru (tanpa notifikasi di MVP). |
| Error handling | Kolom wajib kosong atau tanggal selesai tidak setelah tanggal mulai: ditolak dengan pesan per kolom. |
| Business rules | BR-EVT-001, 002 |
| Acceptance criteria | AC1: acara baru berstatus DRAF dan tidak tampil di katalog. AC2: validasi tanggal berjalan. AC3: perubahan tersimpan dan tampil di detail acara. AC4: hanya Admin yang dapat membuat/mengubah. |
| Dependencies | FR-AUTH-003 |

| Field | Isi |
|---|---|
| Requirement ID | FR-EVT-002 |
| Nama | Aktifkan dan arsipkan acara |
| Priority | P0 |
| Actor | Admin |
| Description | Admin mengaktifkan acara (DRAF → AKTIF) agar tampil di katalog, serta mengarsipkan acara (AKTIF → DIARSIPKAN) atau mengaktifkan kembali (DIARSIPKAN → AKTIF). |
| Preconditions | Acara ada. Untuk diaktifkan, acara memiliki minimal satu zona berstatus aktif. |
| Main flow | 1) Admin memilih aksi. 2) Sistem memvalidasi dan mengubah status. |
| Alternative flow | Pengarsipan acara yang memiliki pesanan menunggu pembayaran tidak membatalkan pesanan tersebut; pesanan boleh diselesaikan sampai batas waktunya (TBD-10). |
| Error handling | Aktivasi tanpa zona aktif ditolak dengan pesan jelas. |
| Business rules | BR-EVT-003, 004, 005, 006 |
| Acceptance criteria | AC1: acara AKTIF tampil di katalog. AC2: acara DIARSIPKAN hilang dari katalog dan tidak dapat dipesan. AC3: tiket yang sudah dibeli pada acara DIARSIPKAN tetap valid untuk check-in. AC4: acara tanpa zona aktif tidak dapat diaktifkan. |
| Dependencies | FR-EVT-001, FR-TKC-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-EVT-003 |
| Nama | Daftar dan hapus acara (Admin) |
| Priority | P0 |
| Actor | Admin |
| Description | Admin melihat daftar seluruh acara beserta statusnya dan dapat menghapus acara yang belum memiliki pesanan. |
| Preconditions | Admin login. |
| Main flow | 1) Admin membuka daftar acara. 2) Memilih acara untuk dilihat, diubah, atau dihapus. |
| Alternative flow | Acara yang memiliki pesanan hanya dapat diarsipkan. |
| Error handling | Penghapusan acara yang memiliki pesanan ditolak dengan pesan yang menyarankan pengarsipan. |
| Business rules | BR-EVT-004 |
| Acceptance criteria | AC1: daftar menampilkan semua status (DRAF, AKTIF, DIARSIPKAN). AC2: acara tanpa pesanan dapat dihapus. AC3: acara dengan pesanan tidak dapat dihapus. |
| Dependencies | FR-EVT-001 |

### 7.3 Ticket Category (Zona) Management

| Field | Isi |
|---|---|
| Requirement ID | FR-TKC-001 |
| Nama | Buat zona tiket |
| Priority | P0 |
| Actor | Admin |
| Description | Admin menambah zona pada sebuah acara (misalnya Reguler, VIP, VVIP) dengan nama, deskripsi opsional, harga, kuota, dan periode jual (mulai dan selesai). |
| Preconditions | Acara ada. |
| Main flow | 1) Admin mengisi data zona. 2) Sistem memvalidasi dan menyimpan zona berstatus aktif. |
| Alternative flow | - |
| Error handling | Nama duplikat dalam acara, harga bukan bilangan bulat positif, kuota kurang dari 1, atau periode tidak valid: ditolak dengan pesan per kolom. |
| Business rules | BR-TKC-001, 002, 007, 008 |
| Acceptance criteria | AC1: zona tersimpan dengan harga, kuota, dan periode jual. AC2: nama zona unik dalam satu acara. AC3: periode jual berakhir tidak melewati tanggal selesai acara. AC4: harga dalam Rupiah bilangan bulat. |
| Dependencies | FR-EVT-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-TKC-002 |
| Nama | Ubah zona tiket |
| Priority | P0 |
| Actor | Admin |
| Description | Admin mengubah nama, deskripsi, harga, kuota, dan periode jual zona. Perubahan kuota dibatasi oleh penjualan yang sudah ada. |
| Preconditions | Zona ada. |
| Main flow | 1) Admin mengubah data. 2) Sistem memvalidasi terhadap kuota terjual dan dikunci. 3) Menyimpan. |
| Alternative flow | Perubahan harga hanya berlaku untuk pesanan baru. |
| Error handling | Kuota baru lebih kecil dari (terjual + dikunci): ditolak dengan pesan menyebut batas minimum saat itu. |
| Business rules | BR-TKC-003, 004, 006 |
| Acceptance criteria | AC1: kuota tidak dapat diturunkan di bawah terjual + dikunci. AC2: pesanan yang sudah dibuat tetap memakai harga lamanya. AC3: harga baru terlihat pada pesanan baru. |
| Dependencies | FR-TKC-001, FR-ORD-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-TKC-003 |
| Nama | Nonaktifkan atau hapus zona |
| Priority | P1 |
| Actor | Admin |
| Description | Admin menonaktifkan zona (berhenti dijual) atau menghapusnya jika belum pernah memiliki pesanan. |
| Preconditions | Zona ada. |
| Main flow | 1) Admin memilih nonaktifkan atau hapus. 2) Sistem menerapkan sesuai aturan. |
| Alternative flow | Zona nonaktif dapat diaktifkan kembali. |
| Error handling | Hapus zona yang punya pesanan ditolak; tawarkan nonaktifkan. |
| Business rules | BR-TKC-005, 006; BR-TIX-005 |
| Acceptance criteria | AC1: zona nonaktif tidak dapat dipesan. AC2: tiket terbit dari zona nonaktif tetap valid saat check-in. AC3: zona yang punya pesanan tidak dapat dihapus. |
| Dependencies | FR-TKC-001 |

### 7.4 Event Discovery

| Field | Isi |
|---|---|
| Requirement ID | FR-DSC-001 |
| Nama | Daftar dan detail acara |
| Priority | P0 |
| Actor | Pembeli |
| Description | Pembeli melihat daftar acara berstatus AKTIF yang belum melewati tanggal selesai, serta detail acara berisi judul, deskripsi, kategori, jadwal, lokasi, dan daftar zona (nama, deskripsi, harga, sisa kuota, status penjualan). Status penjualan zona: Belum dibuka, Dijual, Habis, Penjualan berakhir. |
| Preconditions | Pembeli login. |
| Main flow | 1) Pembeli membuka daftar. 2) Memilih acara. 3) Melihat detail dan memilih zona untuk dibeli. |
| Alternative flow | Daftar kosong: tampil keadaan kosong yang jelas. |
| Error handling | Acara dibuka setelah diarsipkan: pesan "acara tidak tersedia". |
| Business rules | BR-EVT-005, 006; BR-ORD-004 |
| Acceptance criteria | AC1: hanya acara AKTIF dan belum berakhir yang tampil. AC2: sisa kuota = kuota − terjual − dikunci aktif. AC3: tombol beli hanya aktif untuk zona berstatus Dijual. AC4: daftar menggunakan pagination. |
| Dependencies | FR-EVT-002, FR-TKC-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-DSC-002 |
| Nama | Pencarian dan filter |
| Priority | P1 |
| Actor | Pembeli |
| Description | Pencarian kata kunci pada judul acara (sebagian kata, tidak membedakan huruf besar/kecil). Filter: kategori acara (satu pilihan), tanggal (rentang; acara yang tanggal mulainya berada dalam rentang), kota (dipilih dari kota yang ada pada acara aktif). Seluruh kriteria digabung dengan logika "dan". |
| Preconditions | FR-DSC-001 tersedia. |
| Main flow | 1) Pembeli mengisi kata kunci dan/atau filter. 2) Sistem menampilkan hasil. |
| Alternative flow | Tombol reset menghapus semua kriteria. |
| Error handling | Tidak ada hasil: pesan "acara tidak ditemukan" beserta tombol reset. Rentang tanggal terbalik: ditolak dengan pesan. |
| Business rules | BR-EVT-005, 006 |
| Acceptance criteria | AC1: pencarian "konser" menemukan judul yang memuat kata itu. AC2: kombinasi filter menghasilkan irisan. AC3: hasil tidak pernah memuat acara DRAF, DIARSIPKAN, atau yang sudah berakhir. AC4: reset mengembalikan daftar awal. |
| Dependencies | FR-DSC-001; daftar kategori acara (TBD-02) |

| Field | Isi |
|---|---|
| Requirement ID | FR-DSC-003 |
| Nama | Pengurutan acara |
| Priority | P1 |
| Actor | Pembeli |
| Description | Pembeli mengurutkan daftar berdasarkan: tanggal terdekat (bawaan), termurah, atau termahal. Pengurutan harga memakai *harga acuan* = harga terendah di antara zona acara yang berstatus Dijual. Acara tanpa zona Dijual diletakkan di akhir. |
| Preconditions | FR-DSC-001 tersedia. |
| Main flow | 1) Pembeli memilih urutan. 2) Daftar diurutkan ulang, filter tetap berlaku. |
| Alternative flow | Harga acuan sama: urutan ditentukan tanggal terdekat. |
| Error handling | - |
| Business rules | BR-EVT-006 |
| Acceptance criteria | AC1: termurah menaik berdasarkan harga acuan. AC2: termahal menurun berdasarkan harga acuan. AC3: tanggal terdekat menaik berdasarkan tanggal mulai. AC4: urutan konsisten antarhalaman. |
| Dependencies | FR-DSC-001, FR-DSC-002 |

### 7.5 Order and Reservation

| Field | Isi |
|---|---|
| Requirement ID | FR-ORD-001 |
| Nama | Buat pesanan dan kunci kuota |
| Priority | P0 |
| Actor | Pembeli |
| Description | Pembeli memilih satu zona dan jumlah 1-12. Sistem memvalidasi lalu, secara atomik, mengunci kuota sejumlah itu dan membuat pesanan berstatus MENUNGGU_PEMBAYARAN dengan batas waktu 10 menit. Harga dan total di-*snapshot* pada pesanan. |
| Preconditions | Pembeli login; zona berstatus aktif dan dalam periode jual; acara AKTIF. |
| Main flow | 1) Pembeli memilih zona dan jumlah. 2) Aplikasi mengirim permintaan dengan kunci idempotensi. 3) Sistem memeriksa dan mengunci kuota. 4) Pesanan dibuat. 5) Aplikasi menampilkan layar pembayaran dengan hitung mundur. |
| Alternative flow | Permintaan diulang dengan kunci dan isi yang sama (klik ganda, kirim ulang): mengembalikan pesanan yang sama tanpa membuat pesanan baru dan tanpa mengunci kuota dua kali. |
| Error handling | Jumlah di luar 1-12: ditolak. Jumlah melebihi sisa kuota: ditolak dengan sisa kuota terkini. Zona tidak dijual atau acara tidak aktif: ditolak. Kunci yang sama dengan isi berbeda: ditolak sebagai konflik. |
| Business rules | BR-ORD-001, 002, 003, 004, 005, 006, 009; BR-TKC-006 |
| Acceptance criteria | AC1: pesanan sukses mengunci tepat jumlah yang dipesan. AC2: N permintaan bersamaan atas sisa kuota K tidak pernah menghasilkan total terkunci melebihi K. AC3: klik ganda menghasilkan satu pesanan. AC4: batas waktu pesanan = waktu pembuatan + 10 menit. AC5: jumlah 13 ditolak. |
| Dependencies | FR-DSC-001, FR-TKC-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-ORD-002 |
| Nama | Kedaluwarsa dan pelepasan kuota |
| Priority | P0 |
| Actor | Sistem |
| Description | Pesanan MENUNGGU_PEMBAYARAN yang melewati batas waktu berubah menjadi KEDALUWARSA dan kuotanya dilepas. Sisa kuota yang ditampilkan dan divalidasi tidak boleh menghitung pesanan yang sudah lewat batas waktu, meskipun statusnya belum diperbarui oleh proses pembersihan. |
| Preconditions | Pesanan berstatus MENUNGGU_PEMBAYARAN. |
| Main flow | 1) Batas waktu terlewati. 2) Status menjadi KEDALUWARSA. 3) Kuota dikunci dilepas. |
| Alternative flow | Pembeli mencoba membayar setelah batas waktu: ditolak. |
| Error handling | Proses pembersihan tertunda (misalnya server hosting gratis sedang "tidur"): perhitungan sisa kuota tetap benar. |
| Business rules | BR-ORD-004, 007, 010; BR-PAY-008 |
| Acceptance criteria | AC1: pesanan tidak dibayar 10 menit menjadi KEDALUWARSA. AC2: kuota kembali dan dapat dipesan pembeli lain. AC3: pembayaran setelah batas waktu ditolak. AC4: sisa kuota benar walau proses pembersihan belum berjalan. |
| Dependencies | FR-ORD-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-ORD-003 |
| Nama | Batalkan pesanan |
| Priority | P0 |
| Actor | Pembeli |
| Description | Pembeli membatalkan pesanan MENUNGGU_PEMBAYARAN. Pesanan menjadi DIBATALKAN dan kuota langsung dilepas. |
| Preconditions | Pesanan milik pembeli, berstatus MENUNGGU_PEMBAYARAN, belum lewat batas waktu. |
| Main flow | 1) Pembeli memilih *Batalkan Pesanan*. 2) Sistem mengubah status dan melepas kuota. |
| Alternative flow | Pembatalan diulang: hasil sama, tanpa efek ganda. |
| Error handling | Pesanan sudah DIBAYAR, KEDALUWARSA, atau DIBATALKAN: ditolak dengan pesan status saat ini. |
| Business rules | BR-ORD-008, 010; BR-PAY-004 |
| Acceptance criteria | AC1: status menjadi DIBATALKAN dan kuota dilepas seketika. AC2: pesanan DIBAYAR tidak dapat dibatalkan. AC3: pembatalan ganda tidak melepas kuota dua kali. |
| Dependencies | FR-ORD-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-ORD-004 |
| Nama | Riwayat dan detail pesanan Pembeli |
| Priority | P1 |
| Actor | Pembeli |
| Description | Pembeli melihat daftar pesanan miliknya (nomor, acara, zona, jumlah, total, status, waktu) dan detailnya. Pesanan MENUNGGU_PEMBAYARAN yang belum lewat batas waktu menampilkan hitung mundur dan tombol lanjut bayar. Pesanan DIBAYAR menautkan ke tiketnya. |
| Preconditions | Pembeli login. |
| Main flow | 1) Pembeli membuka riwayat. 2) Memilih pesanan. 3) Melihat detail atau melanjutkan pembayaran. |
| Alternative flow | Pembeli kehilangan koneksi saat membayar: dapat membuka riwayat untuk memeriksa status terkini. |
| Error handling | Pesanan milik orang lain: ditolak. |
| Business rules | BR-AUTH-008 |
| Acceptance criteria | AC1: hanya pesanan milik pembeli yang tampil. AC2: status yang tampil sesuai status terkini di server. AC3: pesanan kedaluwarsa tidak menampilkan tombol bayar. AC4: daftar menggunakan pagination. |
| Dependencies | FR-ORD-001, FR-PAY-001 |

### 7.6 Simulated Payment

| Field | Isi |
|---|---|
| Requirement ID | FR-PAY-001 |
| Nama | Layar simulasi dan Bayar Berhasil |
| Priority | P0 |
| Actor | Pembeli |
| Description | Layar pembayaran simulasi menampilkan ringkasan pesanan (acara, zona, jumlah, total, sisa waktu) dengan penanda jelas bahwa ini **simulasi**, bukan pembayaran nyata. Tombol: *Bayar Berhasil*, *Bayar Gagal*, *Batalkan Pesanan*. *Bayar Berhasil* mencatat pembayaran BERHASIL, mengubah pesanan menjadi DIBAYAR, mengubah kuota dikunci menjadi terjual, dan menerbitkan tiket dalam satu proses yang tidak dapat setengah selesai. |
| Preconditions | Pesanan MENUNGGU_PEMBAYARAN dan belum lewat batas waktu. |
| Main flow | 1) Pembeli menekan *Bayar Berhasil*. 2) Aplikasi mengirim permintaan dengan kunci idempotensi dan menonaktifkan tombol. 3) Sistem memproses. 4) Aplikasi menampilkan hasil dan tautan ke tiket. |
| Alternative flow | Pembeli menekan *Bayar Gagal* atau *Batalkan Pesanan*: lihat FR-PAY-002 dan FR-ORD-003. |
| Error handling | Pesanan sudah tidak MENUNGGU atau sudah lewat batas waktu: ditolak dengan pesan status. Gangguan jaringan: tombol aktif kembali dan pembeli diarahkan memeriksa status di riwayat. |
| Business rules | BR-PAY-001, 002, 005, 006, 008; BR-TIX-001 |
| Acceptance criteria | AC1: *Bayar Berhasil* mengubah pesanan menjadi DIBAYAR dan menerbitkan tiket sejumlah pesanan. AC2: layar menampilkan penanda simulasi. AC3: tombol nonaktif selama permintaan berjalan. AC4: tidak pernah ada pesanan DIBAYAR tanpa tiket atau tiket tanpa pesanan DIBAYAR. |
| Dependencies | FR-ORD-001, FR-TIX-001, FR-PAY-003 |

| Field | Isi |
|---|---|
| Requirement ID | FR-PAY-002 |
| Nama | Bayar Gagal dan percobaan ulang |
| Priority | P0 |
| Actor | Pembeli |
| Description | *Bayar Gagal* mencatat satu percobaan pembayaran berstatus GAGAL. Pesanan tetap MENUNGGU_PEMBAYARAN dan kuota tetap dikunci. Pembeli boleh mencoba lagi selama batas waktu belum habis. |
| Preconditions | Pesanan MENUNGGU_PEMBAYARAN dan belum lewat batas waktu. |
| Main flow | 1) Pembeli menekan *Bayar Gagal*. 2) Sistem mencatat percobaan GAGAL. 3) Aplikasi menampilkan pesan gagal dan opsi coba lagi atau batalkan. |
| Alternative flow | Pembeli mencoba lagi dan menekan *Bayar Berhasil*: lihat FR-PAY-001. |
| Error handling | Percobaan setelah batas waktu atau status final: ditolak. |
| Business rules | BR-PAY-003, 005, 007 |
| Acceptance criteria | AC1: status pesanan tetap MENUNGGU setelah percobaan gagal. AC2: setiap percobaan tercatat dan terlihat Admin. AC3: setelah gagal, *Bayar Berhasil* masih dapat dilakukan dalam batas waktu. AC4: tidak ada batas jumlah percobaan selain batas waktu pesanan. |
| Dependencies | FR-PAY-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-PAY-003 |
| Nama | Idempotensi dan perlindungan duplikasi pembayaran |
| Priority | P0 |
| Actor | Sistem |
| Description | Permintaan pembayaran membawa kunci idempotensi. Pengulangan permintaan yang sama menghasilkan respons yang sama tanpa efek tambahan. Satu pesanan hanya boleh memiliki satu pembayaran BERHASIL dan satu set tiket, sekalipun terjadi klik ganda, pengiriman ulang, atau permintaan bersamaan. |
| Preconditions | Permintaan pembayaran diterima. |
| Main flow | 1) Sistem memeriksa kunci. 2) Jika baru, diproses; jika pernah diproses, mengembalikan hasil sebelumnya. |
| Alternative flow | Dua permintaan berkunci berbeda tiba bersamaan: hanya satu yang berhasil; yang lain menerima respons "pesanan sudah dibayar". |
| Error handling | Kunci sama dengan isi berbeda: ditolak sebagai konflik. Pembayaran bertabrakan dengan pembatalan atau kedaluwarsa: transisi pertama yang sah menang, yang lain ditolak. |
| Business rules | BR-PAY-006, 007, 009; BR-ORD-010 |
| Acceptance criteria | AC1: 10 permintaan *Bayar Berhasil* beruntun/bersamaan menghasilkan satu pembayaran BERHASIL dan satu set tiket. AC2: pengulangan dengan kunci yang sama mengembalikan hasil yang sama. AC3: balapan bayar versus batal menghasilkan tepat satu status akhir yang konsisten. AC4: perlindungan berlaku di sisi server, bukan hanya di UI. |
| Dependencies | FR-PAY-001, FR-ORD-002, FR-ORD-003 |

### 7.7 Ticket Issuance and QR Code

| Field | Isi |
|---|---|
| Requirement ID | FR-TIX-001 |
| Nama | Penerbitan tiket dan QR |
| Priority | P0 |
| Actor | Sistem |
| Description | Saat pesanan menjadi DIBAYAR, sistem menerbitkan tiket sejumlah tiket yang dibeli. Setiap tiket memiliki token QR unik dan kode tiket unik, berstatus AKTIF, tanpa nama pemegang. Penerbitan terjadi tepat sekali per pesanan. |
| Preconditions | Pembayaran BERHASIL tercatat. |
| Main flow | 1) Pembayaran sukses. 2) Sistem membuat tiket dan token. 3) Tiket terhubung ke pesanan, acara, zona, dan pembeli. |
| Alternative flow | Pemrosesan ulang pembayaran yang sama tidak menambah tiket. |
| Error handling | Kegagalan saat penerbitan membatalkan seluruh proses pembayaran sehingga tidak ada keadaan setengah jadi. |
| Business rules | BR-TIX-001, 002, 003, 004, 005 |
| Acceptance criteria | AC1: jumlah tiket = jumlah pada pesanan. AC2: token unik, tidak berurutan, tidak dapat ditebak, dan tidak memuat data pribadi. AC3: pembayaran berulang tidak menambah tiket. AC4: tiket terbit bersama perubahan status DIBAYAR. |
| Dependencies | FR-PAY-001 |

### 7.8 Ticket Wallet

| Field | Isi |
|---|---|
| Requirement ID | FR-WAL-001 |
| Nama | Tampilan tiket dan QR |
| Priority | P0 |
| Actor | Pembeli |
| Description | Pembeli membuka satu tiket dan melihat QR, kode tiket, nama acara, jadwal, lokasi, zona, dan status (Aktif atau Sudah dipakai). |
| Preconditions | Tiket terbit dan milik pembeli. |
| Main flow | 1) Pembeli membuka tiket dari pesanan atau Wallet. 2) Aplikasi memuat data dari server dan menampilkan QR. |
| Alternative flow | Tiket yang sudah dipakai tetap dapat dilihat dengan penanda "Sudah dipakai" dan waktu check-in. |
| Error handling | Gagal memuat: pesan dan tombol coba lagi. Tiket milik orang lain: ditolak. |
| Business rules | BR-TIX-002, 003; BR-AUTH-008 |
| Acceptance criteria | AC1: QR dapat dipindai oleh mode Petugas. AC2: hanya tiket milik pembeli yang dapat dibuka. AC3: status tiket sesuai status di server. AC4: tampilan tidak memuat data pembeli lain. |
| Dependencies | FR-TIX-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-WAL-002 |
| Nama | Daftar tiket di Ticket Wallet |
| Priority | P1 |
| Actor | Pembeli |
| Description | Wallet menampilkan seluruh tiket pembeli, dikelompokkan per acara dan per pesanan, dengan penanda status. |
| Preconditions | Pembeli login. |
| Main flow | 1) Pembeli membuka Wallet. 2) Melihat daftar. 3) Memilih tiket (FR-WAL-001). |
| Alternative flow | Wallet kosong: keadaan kosong dengan ajakan mencari acara. |
| Error handling | Gagal memuat: pesan dan coba lagi. |
| Business rules | BR-AUTH-008; BR-TIX-005 |
| Acceptance criteria | AC1: semua tiket milik pembeli tampil dan tidak ada milik orang lain. AC2: tiket acara yang diarsipkan tetap tampil. AC3: pengelompokan per acara benar. |
| Dependencies | FR-WAL-001 |

### 7.9 Check-in and QR Validation

| Field | Isi |
|---|---|
| Requirement ID | FR-CHK-001 |
| Nama | Validasi QR dan pencatatan check-in (server) |
| Priority | P0 |
| Actor | Petugas |
| Description | Server menerima token QR beserta acara yang dipilih Petugas, lalu mengembalikan salah satu dari tiga hasil: **VALID** (tiket AKTIF dan milik acara terpilih; status menjadi DIPAKAI, dicatat waktu dan akun Petugas), **SUDAH_DIPAKAI** (disertai waktu check-in sebelumnya), atau **TIDAK_VALID** (token tidak dikenal, tiket acara lain, atau acara belum aktif/berstatus DRAF). |
| Preconditions | Petugas login dan aktif; acara dipilih. |
| Main flow | 1) Token dikirim. 2) Sistem mencari tiket. 3) Memeriksa acara dan status. 4) Mengubah status menjadi DIPAKAI secara atomik. 5) Mengembalikan hasil. |
| Alternative flow | Dua Petugas memindai QR yang sama bersamaan: tepat satu menerima VALID, yang lain SUDAH_DIPAKAI. |
| Error handling | Pemanggil bukan Petugas atau akun nonaktif: ditolak. Token kosong atau rusak: TIDAK_VALID. |
| Business rules | BR-CHK-001 s.d. 008; BR-TIX-005 |
| Acceptance criteria | AC1: scan pertama VALID; scan kedua SUDAH_DIPAKAI. AC2: tiket acara lain TIDAK_VALID dengan alasan "bukan untuk acara ini". AC3: tiket pada acara DRAF TIDAK_VALID. AC4: tiket acara DIARSIPKAN yang valid tetap dapat check-in. AC5: pemindaian serentak atas satu tiket menghasilkan tepat satu VALID. AC6: waktu dan akun Petugas tercatat. AC7: tidak ada pembatasan jam check-in. |
| Dependencies | FR-TIX-001, FR-AUTH-003 |

| Field | Isi |
|---|---|
| Requirement ID | FR-CHK-002 |
| Nama | Mode Petugas: pilih acara dan pindai |
| Priority | P1 |
| Actor | Petugas |
| Description | Setelah login, Petugas melihat daftar acara yang dapat di-check-in (berstatus AKTIF atau DIARSIPKAN yang memiliki tiket terbit; TBD-09), memilih satu acara, lalu memindai QR dengan kamera. Hasil ditampilkan dengan warna dan teks (bukan warna saja): valid, sudah dipakai (beserta waktu), tidak valid (beserta alasan). |
| Preconditions | Petugas login; izin kamera diberikan. |
| Main flow | 1) Petugas memilih acara. 2) Layar pemindaian terbuka. 3) QR dipindai dan dikirim ke FR-CHK-001. 4) Hasil tampil. 5) Petugas lanjut ke tiket berikutnya. |
| Alternative flow | Petugas dapat mengganti acara dari layar pemindaian. |
| Error handling | Izin kamera ditolak: pesan petunjuk mengaktifkan izin. API tidak tersedia: pesan dan opsi ulang. QR bukan format tiket: TIDAK_VALID. |
| Business rules | BR-CHK-003, 004, 008 |
| Acceptance criteria | AC1: Petugas harus memilih acara sebelum memindai. AC2: tiga hasil tampil dengan teks dan warna berbeda. AC3: layar siap memindai berikutnya tanpa langkah berlebih. AC4: Pembeli tidak dapat melihat mode ini. |
| Dependencies | FR-CHK-001 |

### 7.10 Staff Management

| Field | Isi |
|---|---|
| Requirement ID | FR-STF-001 |
| Nama | Kelola akun Petugas |
| Priority | P1 |
| Actor | Admin |
| Description | Admin membuat akun Petugas (nama, email, sandi awal), melihat daftarnya, serta menonaktifkan atau mengaktifkan kembali. Akun Petugas yang sudah memiliki riwayat check-in tidak dihapus, hanya dinonaktifkan. |
| Preconditions | Admin login. |
| Main flow | 1) Admin mengisi formulir. 2) Sistem membuat akun berperan Petugas. 3) Admin membagikan kredensial secara langsung kepada Petugas. |
| Alternative flow | Akun yang dinonaktifkan ditolak pada login berikutnya dan pada request berikutnya dari sesi yang masih berjalan. |
| Error handling | Email sudah terdaftar: ditolak. Sandi tidak memenuhi aturan: ditolak. |
| Business rules | BR-AUTH-001, 003, 006 |
| Acceptance criteria | AC1: akun Petugas yang dibuat dapat login di mobile dan masuk mode Petugas. AC2: Petugas nonaktif tidak dapat login dan request dari sesi lamanya ditolak. AC3: riwayat check-in Petugas nonaktif tetap tersimpan. AC4: hanya Admin yang dapat mengelola Petugas. |
| Dependencies | FR-AUTH-002, FR-AUTH-003 |

### 7.11 Sales History and Dashboard

| Field | Isi |
|---|---|
| Requirement ID | FR-RPT-001 |
| Nama | Riwayat penjualan dan status pembayaran |
| Priority | P1 |
| Actor | Admin |
| Description | Admin melihat daftar seluruh pesanan (semua status): nomor pesanan, waktu, pembeli (nama, email), acara, zona, jumlah, total, status pesanan, dan ringkasan status pembayaran. Filter: acara, status pesanan, rentang tanggal. Detail pesanan menampilkan seluruh percobaan pembayaran dan tiket yang terbit beserta statusnya. |
| Preconditions | Admin login. |
| Main flow | 1) Admin membuka riwayat. 2) Memfilter. 3) Membuka detail. |
| Alternative flow | Tidak ada data: keadaan kosong. |
| Error handling | Rentang tanggal tidak valid: ditolak dengan pesan. |
| Business rules | BR-RPT-005, 007, 008 |
| Acceptance criteria | AC1: semua status pesanan tampil dan dapat difilter. AC2: ringkasan status pembayaran mengikuti definisi di Bagian 9.3. AC3: detail memuat semua percobaan pembayaran. AC4: data pembeli hanya terlihat oleh Admin. AC5: daftar menggunakan pagination. |
| Dependencies | FR-ORD-001, FR-PAY-001 |

| Field | Isi |
|---|---|
| Requirement ID | FR-RPT-002 |
| Nama | Dasbor Admin |
| Priority | P1 |
| Actor | Admin |
| Description | Dasbor menampilkan total keseluruhan: pendapatan, tiket terjual, tiket dikunci, dan check-in. Di bawahnya tabel ringkasan per acara (nama acara, total kuota, terjual, dikunci, pendapatan, check-in). Tanpa filter tanggal pada MVP. Definisi metrik di Bagian 14. |
| Preconditions | Admin login. |
| Main flow | 1) Admin membuka dasbor. 2) Sistem menghitung dan menampilkan. |
| Alternative flow | Belum ada transaksi: semua angka 0 dan tabel menampilkan acara tanpa penjualan. |
| Error handling | Gagal memuat: pesan dan coba lagi. |
| Business rules | BR-RPT-001 s.d. 006 |
| Acceptance criteria | AC1: setiap angka sama dengan penghitungan manual dari riwayat penjualan dan data tiket. AC2: pesanan GAGAL/DIBATALKAN/KEDALUWARSA tidak dihitung sebagai pendapatan atau terjual. AC3: tiket dikunci hanya mencakup pesanan menunggu yang belum lewat batas waktu. AC4: jumlah check-in = tiket berstatus DIPAKAI. |
| Dependencies | FR-RPT-001, FR-CHK-001 |

### 7.12 Requirement P2 (ringkas)

Dirinci penuh hanya jika P0 dan P1 sudah stabil [B].

| ID | Requirement | Acceptance criteria singkat |
|---|---|---|
| FR-DSC-004 | Pengurutan berdasarkan jarak (terdekat/terjauh) memakai koordinat acara dan izin lokasi pengguna (TBD-03) | Jika izin ditolak, opsi jarak dinonaktifkan dengan pesan; urutan sesuai jarak ke lokasi pengguna |
| FR-TKC-004 | Gambar denah statis pada detail acara (penyimpanan: TBD-06) | Gambar tampil di detail; tidak ada pemilihan kursi |
| FR-CHK-003 | Input kode tiket manual sebagai cadangan scanner [B: mitigasi R9] | Kode valid diproses lewat FR-CHK-001 dengan hasil sama |
| FR-STF-002 | Admin menyetel ulang sandi Petugas | Sandi baru berlaku; sandi lama ditolak |
| FR-RPT-003 | Dasbor lebih kaya (tampilan visual tambahan) | Tidak mengubah definisi metrik di Bagian 14 |

---

## 8. Business Rules

Sumber: [B] Brief, [K] keputusan klarifikasi, [P] proposed.

### Autentikasi
| ID | Aturan | Sumber |
|---|---|---|
| BR-AUTH-001 | Email unik dan tidak membedakan huruf besar/kecil | P |
| BR-AUTH-002 | Registrasi publik hanya menghasilkan peran Pembeli | B |
| BR-AUTH-003 | Sandi minimal 8 karakter dan disimpan sebagai hash | P (hash: B) |
| BR-AUTH-004 | Admin login hanya di web; Pembeli dan Petugas hanya di mobile | B + P |
| BR-AUTH-005 | Pesan gagal login tidak membedakan email atau sandi | P |
| BR-AUTH-006 | Akun nonaktif tidak dapat login dan sesinya ditolak | P |
| BR-AUTH-007 | Akses fitur mengikuti matriks Bagian 5 | B |
| BR-AUTH-008 | Pembeli hanya mengakses data (pesanan, tiket) miliknya | P |
| BR-AUTH-009 | Admin hanya dibuat lewat seed; satu level Admin | B |

### Acara
| ID | Aturan | Sumber |
|---|---|---|
| BR-EVT-001 | Acara baru berstatus DRAF; hanya acara AKTIF yang tampil di katalog | P |
| BR-EVT-002 | Tanggal selesai harus setelah tanggal mulai | P |
| BR-EVT-003 | Acara hanya dapat diaktifkan jika memiliki minimal satu zona aktif | P |
| BR-EVT-004 | Acara yang sudah memiliki pesanan tidak dihapus, hanya diarsipkan | K |
| BR-EVT-005 | Acara DIARSIPKAN hilang dari katalog; tiket yang sudah dibeli tetap valid | K |
| BR-EVT-006 | Acara yang melewati tanggal selesai tidak tampil di katalog (turunan dari tanggal, bukan status) | P |

### Zona tiket
| ID | Aturan | Sumber |
|---|---|---|
| BR-TKC-001 | Setiap zona memiliki harga, kuota, dan periode jual | B |
| BR-TKC-002 | Harga bilangan bulat Rupiah lebih dari 0; tiket gratis tidak didukung (TBD-08) | P |
| BR-TKC-003 | Kuota tidak boleh kurang dari (terjual + dikunci) | K |
| BR-TKC-004 | Perubahan harga hanya memengaruhi pesanan baru | K |
| BR-TKC-005 | Zona yang punya pesanan tidak dihapus, hanya dinonaktifkan | K |
| BR-TKC-006 | Penjualan hanya pada zona aktif dan dalam periode jual | K |
| BR-TKC-007 | Nama zona unik dalam satu acara | P |
| BR-TKC-008 | Periode jual berakhir tidak melewati tanggal selesai acara | P |

### Pesanan
| ID | Aturan | Sumber |
|---|---|---|
| BR-ORD-001 | Satu pesanan = satu acara dan satu zona | K |
| BR-ORD-002 | Jumlah tiket per pesanan 1-12 | B (12), P (min. 1) |
| BR-ORD-003 | Pesanan mengunci kuota selama 10 menit | B |
| BR-ORD-004 | Sisa kuota = kuota − terjual − dikunci aktif; pesanan yang lewat batas waktu tidak dihitung dikunci | B + P |
| BR-ORD-005 | Pemeriksaan dan pengurangan kuota bersifat atomik; kuota tidak pernah terjual melebihi kapasitas | B |
| BR-ORD-006 | Harga dan total di-*snapshot* pada pesanan | P |
| BR-ORD-007 | Kedaluwarsa melepas kuota yang dikunci | B |
| BR-ORD-008 | Pembeli dapat membatalkan pesanan MENUNGGU; pesanan DIBAYAR tidak dapat dibatalkan (tanpa refund) | B + K |
| BR-ORD-009 | Tidak ada batas pembelian per akun per acara selain batas per pesanan (lihat TBD-07) | P |
| BR-ORD-010 | Status DIBAYAR, DIBATALKAN, KEDALUWARSA bersifat final; membeli lagi berarti pesanan baru | P |

### Pembayaran simulasi
| ID | Aturan | Sumber |
|---|---|---|
| BR-PAY-001 | Pembayaran bersifat simulasi tanpa uang nyata; UI wajib menandainya | B |
| BR-PAY-002 | *Bayar Berhasil* menjadikan pesanan DIBAYAR | K |
| BR-PAY-003 | *Bayar Gagal* tidak mengubah status pesanan; boleh ulang selama batas waktu | K |
| BR-PAY-004 | *Batalkan* menjadikan pesanan DIBATALKAN dan melepas kuota | K |
| BR-PAY-005 | Pembayaran BERHASIL tidak dapat diubah menjadi gagal atau batal | K |
| BR-PAY-006 | Satu pesanan hanya boleh memiliki satu pembayaran BERHASIL | B |
| BR-PAY-007 | Permintaan pembayaran memakai kunci idempotensi; pengulangan tidak menimbulkan efek ganda | B + P |
| BR-PAY-008 | Pembayaran hanya diterima untuk pesanan MENUNGGU yang belum lewat batas waktu | P |
| BR-PAY-009 | Jika dua transisi bertabrakan (bayar, batal, kedaluwarsa), yang pertama sah menang, yang lain ditolak | P |

### Tiket
| ID | Aturan | Sumber |
|---|---|---|
| BR-TIX-001 | Tiket terbit hanya setelah pesanan DIBAYAR, sejumlah tiket yang dibeli | B |
| BR-TIX-002 | Satu tiket = satu QR unik | B |
| BR-TIX-003 | Token QR tidak dapat ditebak, tidak memuat data pribadi, dan divalidasi di server | B (aman) + P |
| BR-TIX-004 | Tidak ada input nama pemegang tiket | B |
| BR-TIX-005 | Tiket yang sudah terbit tetap valid walau acara diarsipkan atau zona dinonaktifkan | K |

### Check-in
| ID | Aturan | Sumber |
|---|---|---|
| BR-CHK-001 | QR hanya sah satu kali | B |
| BR-CHK-002 | Hasil validasi hanya: VALID, SUDAH_DIPAKAI, TIDAK_VALID | B |
| BR-CHK-003 | Petugas memilih acara terlebih dahulu; tiket acara lain TIDAK_VALID | K |
| BR-CHK-004 | Acara DRAF tidak dapat di-check-in; AKTIF dan DIARSIPKAN dapat (TBD-09) | K + P |
| BR-CHK-005 | Tidak ada jendela waktu check-in pada MVP | K |
| BR-CHK-006 | Setiap check-in mencatat waktu dan akun Petugas | K |
| BR-CHK-007 | Perubahan status ke DIPAKAI bersifat atomik; pemindaian serentak menghasilkan satu VALID | B + P |
| BR-CHK-008 | Petugas dapat memindai semua acara | B (asumsi) |

### Laporan
| ID | Aturan | Sumber |
|---|---|---|
| BR-RPT-001 | Pendapatan = total nilai pesanan berstatus DIBAYAR | K |
| BR-RPT-002 | Tiket terjual = tiket terbit dari pesanan DIBAYAR | K |
| BR-RPT-003 | Tiket dikunci = tiket pada pesanan MENUNGGU yang belum lewat batas waktu (bukan bagian dari terjual) | K |
| BR-RPT-004 | Check-in = jumlah tiket berstatus DIPAKAI | K |
| BR-RPT-005 | Pesanan gagal, dibatalkan, dan kedaluwarsa tidak dihitung sebagai pendapatan atau terjual | K |
| BR-RPT-006 | Dasbor menampilkan total keseluruhan dan ringkasan per acara, tanpa filter tanggal | K |
| BR-RPT-007 | Status pembayaran tingkat pesanan diturunkan dari percobaan pembayaran (Bagian 9.3) | P |
| BR-RPT-008 | Hanya Admin yang dapat melihat data pembeli | P |

---

## 9. Order and Ticket Lifecycle

Seluruh status dan transisi di bawah ini berlabel **[P]** kecuali disebut lain; transisi yang berasal dari keputusan tim ditandai [K]. Tidak ada status final sampai disetujui.

### 9.1 Status acara
| Status | Arti | Transisi | Efek |
|---|---|---|---|
| DRAF | Belum tampil | → AKTIF (minimal satu zona aktif); dapat dihapus | Tidak dapat dipesan atau di-check-in |
| AKTIF | Tampil di katalog | → DIARSIPKAN | Dapat dipesan sesuai zona; dapat di-check-in |
| DIARSIPKAN [K] | Hilang dari katalog | → AKTIF | Tidak dapat dipesan; tiket terbit tetap valid dan dapat di-check-in |

### 9.2 Status pesanan
| Dari → ke | Pemicu | Efek kuota | Efek pembayaran | Efek tiket |
|---|---|---|---|---|
| (baru) → MENUNGGU_PEMBAYARAN | Pesanan valid dibuat [B] | Dikunci sejumlah pesanan | Belum ada | Belum ada |
| MENUNGGU → DIBAYAR | Pembayaran BERHASIL [K] | Dikunci menjadi terjual | Satu pembayaran BERHASIL | Tiket diterbitkan |
| MENUNGGU → DIBATALKAN | Pembeli membatalkan [K] | Dilepas seketika | Pembayaran selanjutnya ditolak | Tidak ada |
| MENUNGGU → KEDALUWARSA | Lewat 10 menit [B] | Dilepas | Pembayaran selanjutnya ditolak | Tidak ada |

- DIBAYAR, DIBATALKAN, dan KEDALUWARSA bersifat final. Tidak ada transisi keluar dan tidak ada refund [B].
- *Bayar Gagal* **bukan** transisi: pesanan tetap MENUNGGU [K].
- Pengulangan proses: permintaan berulang dengan kunci idempotensi sama tidak menambah transisi. Bila dua transisi bertabrakan, yang pertama sah menang.
- Pembeli yang ingin mencoba lagi setelah status final membuat pesanan baru.

### 9.3 Status pembayaran
Status per **percobaan**: BERHASIL atau GAGAL [K]. Pada tingkat pesanan, ringkasan status pembayaran untuk Admin:

| Ringkasan | Kondisi |
|---|---|
| Berhasil | Ada satu percobaan BERHASIL |
| Gagal | Tidak ada BERHASIL dan percobaan terakhir GAGAL |
| Belum ada | Belum ada percobaan |

Percobaan BERHASIL tidak dapat diubah [K]. Maksimal satu BERHASIL per pesanan [B].

### 9.4 Status tiket
| Dari → ke | Pemicu | Efek |
|---|---|---|
| (baru) → AKTIF | Pesanan menjadi DIBAYAR | QR dapat ditampilkan dan dipindai |
| AKTIF → DIPAKAI | Validasi VALID oleh Petugas [B] | Dicatat waktu dan Petugas; QR tidak sah lagi |

DIPAKAI bersifat final. Tidak ada status lain pada MVP.

### 9.5 Status zona
AKTIF ↔ NONAKTIF. Zona NONAKTIF tidak dapat dipesan; tiket yang sudah terbit tetap valid [K].

---

## 10. Non-Functional Requirements

**Status:** *Ditetapkan* = bersumber dari Brief/keputusan tim; *Proposed* = usulan nilai awal.

| ID | Kebutuhan | Status | Verifikasi |
|---|---|---|---|
| NFR-SEC-001 | Sandi disimpan sebagai hash; tidak pernah dikirim balik di respons | Ditetapkan [B] | Inspeksi data dan respons |
| NFR-SEC-002 | Otorisasi berbasis peran dan kepemilikan data di server | Ditetapkan [B] | TS-03 |
| NFR-SEC-003 | Rahasia dan kredensial tidak disimpan di repository | Ditetapkan [B] | Tinjauan repository |
| NFR-SEC-004 | Validasi seluruh input di server | Ditetapkan [B] | Uji input tidak valid |
| NFR-SEC-005 | Komunikasi lewat HTTPS pada deployment online | Proposed | Uji akses online |
| NFR-SEC-006 | Pembatasan percobaan login gagal (nilai awal: 5 kali per 15 menit per akun) | Proposed (P2) | Uji login berulang |
| NFR-DAT-001 | Pengurangan kuota atomik pada penyimpanan data | Ditetapkan [B] | TS-12 |
| NFR-DAT-002 | Batasan unik di database mencegah pembayaran BERHASIL ganda dan tiket ganda | Ditetapkan [B] | TS-18 |
| NFR-DAT-003 | Transisi status memakai pemeriksaan kondisi asal (hanya dari status yang diizinkan) | Proposed | TS-19 |
| NFR-DAT-004 | Pesanan DIBAYAR dan penerbitan tiket terjadi dalam satu transaksi | Proposed | TS-16 |
| NFR-DAT-005 | Nilai uang disimpan sebagai bilangan bulat Rupiah; waktu disimpan dalam UTC | Proposed | Tinjauan desain |
| NFR-REL-001 | Kegagalan di tengah proses tidak meninggalkan data setengah jadi | Ditetapkan [B: konsistensi] | Uji kegagalan terkontrol |
| NFR-REL-002 | Sisa kuota benar walau proses pembersihan kedaluwarsa tertunda (server hosting "tidur") | Proposed | TS-14 |
| NFR-REL-003 | Pesan error dapat dipahami pengguna pada semua kegagalan API | Proposed | TS-30 |
| NFR-PRF-001 | 95% request normal selesai ≤ 2 detik pada beban demo ≤ 20 pengguna bersamaan, di luar cold start hosting | Proposed | Uji manual dan alat sederhana |
| NFR-PRF-002 | Uji konkurensi: 50 permintaan pesanan bersamaan pada sisa kuota 10 menghasilkan tepat 10 yang sukses | Proposed | TS-12 |
| NFR-PRF-003 | Validasi QR selesai ≤ 2 detik pada kondisi normal | Proposed | TS-21 |
| NFR-USA-001 | Antarmuka berbahasa Indonesia; harga dalam Rupiah; waktu ditampilkan WIB | Proposed | Tinjauan UI |
| NFR-USA-002 | Target sentuh minimal 44 px; kontras teks memadai (acuan WCAG AA dasar) | Proposed | Tinjauan desain |
| NFR-USA-003 | Indikator loading, tombol dinonaktifkan saat proses, dan pesan error jelas | Ditetapkan [B: klik ganda] + Proposed | TS-13 |
| NFR-USA-004 | Hasil validasi QR tidak bergantung pada warna saja (disertai teks) | Proposed | Tinjauan UI |
| NFR-MNT-001 | Konvensi branch dan pull request dengan review di GitHub | Ditetapkan [B] | Riwayat GitHub |
| NFR-MNT-002 | Migrasi database berurutan dan satu pemilik skema | Ditetapkan [B: R6] | Tinjauan PR |
| NFR-MNT-003 | README berisi langkah menjalankan setiap aplikasi | Proposed | Uji setup oleh anggota lain |
| NFR-DOC-001 | Swagger mencakup seluruh endpoint dengan contoh request dan respons | Ditetapkan [B] | TS-31 |
| NFR-DOC-002 | ERD dan dokumen desain tersedia | Ditetapkan [B] | Tinjauan dokumen |
| NFR-LOG-001 | Log untuk login gagal, penolakan akses, transisi status pesanan/pembayaran, dan check-in | Proposed | Inspeksi log |
| NFR-LOG-002 | Log tidak memuat sandi atau token QR lengkap | Proposed | Inspeksi log |
| NFR-LOG-003 | Format error API konsisten (kode, pesan, detail per kolom) | Proposed | Tinjauan Swagger |
| NFR-DEP-001 | Backend, database, dan web online; mobile sebagai APK/perangkat demo | Ditetapkan [B] | TS-32 |
| NFR-DEP-002 | Ekspor (backup) database sebelum demo | Proposed | Checklist rilis |
| NFR-DEP-003 | Konfigurasi lewat variabel lingkungan | Proposed | Tinjauan konfigurasi |
| NFR-DEP-004 | Data contoh (acara dan zona) tersedia untuk demo | Proposed | Checklist rilis |

---

## 11. Data and Validation Requirements

Bagian ini adalah kebutuhan data tingkat produk, **bukan** ERD final.

### 11.1 Data utama per modul
| Entitas | Data utama | Relasi (kebutuhan produk) |
|---|---|---|
| Pengguna | nama, email, hash sandi, peran, status aktif | Memiliki pesanan (Pembeli), mencatat check-in (Petugas) |
| Kategori acara | nama (TBD-02) | Dimiliki acara |
| Acara | judul, deskripsi, kategori, mulai, selesai, tempat, alamat, kota, status; poster dan koordinat (TBD-06, P2) | Memiliki banyak zona |
| Zona tiket | nama, deskripsi, harga, kuota, periode jual, status aktif | Milik satu acara; memiliki banyak pesanan |
| Pesanan | nomor, pembeli, acara, zona, jumlah, harga satuan (snapshot), total, status, batas waktu, kunci idempotensi, waktu dibuat | Memiliki banyak percobaan pembayaran dan tiket |
| Percobaan pembayaran | pesanan, status (BERHASIL/GAGAL), kunci idempotensi, waktu | Milik satu pesanan |
| Tiket | pesanan, acara, zona, pemilik, kode tiket, token QR, status, waktu dan Petugas check-in | Milik satu pesanan |

### 11.2 Validasi input
| Data | Aturan |
|---|---|
| Nama | Wajib; panjang wajar (usulan 2-100 karakter) [P] |
| Email | Wajib; format valid; unik tanpa membedakan huruf besar/kecil |
| Sandi | Minimal 8 karakter [P] |
| Judul acara | Wajib (usulan maks. 150 karakter) [P] |
| Tanggal acara | Mulai dan selesai wajib; selesai setelah mulai |
| Kota, tempat, alamat | Wajib |
| Harga zona | Bilangan bulat > 0 |
| Kuota zona | Bilangan bulat ≥ 1 dan ≥ (terjual + dikunci) saat diubah |
| Periode jual | Selesai setelah mulai; tidak melewati tanggal selesai acara |
| Jumlah tiket pesanan | Bilangan bulat 1-12 dan ≤ sisa kuota |
| Kunci idempotensi | Wajib pada pembuatan pesanan dan pembayaran |

### 11.3 Data sensitif
| Data | Akses |
|---|---|
| Hash sandi | Tidak pernah keluar dari server |
| Token QR | Hanya pemilik tiket dan proses validasi; tidak dicatat penuh di log |
| Nama dan email pembeli | Pemilik akun dan Admin |
| Riwayat pesanan dan tiket | Pemilik akun; Admin untuk riwayat penjualan |

---

## 12. API and Integration Requirements

Detail endpoint dikembangkan pada dokumen API Specification terpisah.

**Ketentuan umum**
- Autentikasi berbasis token; otorisasi per peran dan kepemilikan [B].
- Kunci idempotensi wajib pada pembuatan pesanan dan pembayaran (BR-PAY-007).
- Daftar memakai pagination; waktu dalam format standar UTC; format error konsisten (NFR-LOG-003).
- Seluruh endpoint terdokumentasi di Swagger [B].

| Kelompok | Tujuan | Aktor | Input → output (konseptual) | Error penting |
|---|---|---|---|---|
| Autentikasi | Registrasi, login, sesi | Semua | Data akun → token dan peran | Email duplikat, kredensial salah, akun nonaktif, platform tidak sesuai |
| Acara (Admin) | Kelola acara dan statusnya | Admin | Data acara → acara | Validasi tanggal, hapus acara beralur pesanan, aktivasi tanpa zona |
| Zona tiket (Admin) | Kelola zona | Admin | Data zona → zona | Kuota di bawah terjual+dikunci, nama duplikat |
| Petugas (Admin) | Kelola akun Petugas | Admin | Data akun → akun | Email duplikat |
| Katalog | Daftar, detail, pencarian, filter, urutan | Pembeli | Kriteria → daftar atau detail dengan sisa kuota | Acara tidak tersedia, rentang tanggal tidak valid |
| Pesanan | Buat, lihat, batalkan | Pembeli | Zona + jumlah + kunci → pesanan | Jumlah di luar batas, kuota habis, konflik kunci, status tidak mengizinkan |
| Pembayaran | Simulasi sukses/gagal | Pembeli | Pesanan + hasil + kunci → status pembayaran dan pesanan | Pesanan bukan MENUNGGU, kedaluwarsa, sudah dibayar |
| Tiket | Daftar tiket dan detail QR | Pembeli | Permintaan → tiket | Bukan pemilik |
| Check-in | Validasi QR dan daftar acara untuk Petugas | Petugas | Token + acara → hasil validasi | Petugas nonaktif, token tidak dikenal, acara tidak sesuai |
| Laporan | Riwayat penjualan dan dasbor | Admin | Filter → daftar atau angka | Rentang tidak valid |

**Ketergantungan lintas modul dan tim**
- Web dan mobile bergantung pada kontrak Swagger; frontend memakai data tiruan sampai endpoint siap.
- Pesanan → pembayaran → tiket → check-in merupakan rantai berurutan; perubahan status pesanan memengaruhi dasbor.
- Skema database dimiliki satu orang; perubahan lewat pull request (NFR-MNT-002).

---

## 13. Error and Edge Cases

| ID | Skenario | Perilaku yang diharapkan | Verifikasi |
|---|---|---|---|
| EC-01 | Kuota habis saat banyak pembeli memesan bersamaan | Tepat sejumlah sisa kuota yang berhasil; sisanya ditolak dengan sisa kuota terkini | TS-12 |
| EC-02 | Reservasi kedaluwarsa saat pembeli di layar bayar | Pembayaran ditolak; pesan "pesanan kedaluwarsa"; kuota sudah lepas | TS-14 |
| EC-03 | Pembayaran dikirim lebih dari sekali | Satu pembayaran dan satu set tiket; sisanya mengembalikan hasil yang sama | TS-18 |
| EC-04 | Pembeli mengulang request karena koneksi bermasalah | Request dengan kunci sama tidak menggandakan pesanan; pembeli dapat memeriksa status di riwayat | TS-13, TS-28 |
| EC-05 | Bayar dan batal/kedaluwarsa terjadi bersamaan | Tepat satu status akhir yang konsisten | TS-19 |
| EC-06 | QR tidak valid atau rusak | Hasil TIDAK_VALID | TS-23 |
| EC-07 | Tiket sudah check-in | Hasil SUDAH_DIPAKAI beserta waktu check-in sebelumnya | TS-22 |
| EC-08 | Tiket tidak ditemukan, milik acara lain, atau acara masih DRAF | Hasil TIDAK_VALID dengan alasan | TS-23 |
| EC-09 | Petugas nonaktif atau tidak berizin memanggil validasi | Request ditolak; tidak ada perubahan tiket | TS-25 |
| EC-10 | API atau database tidak tersedia (termasuk cold start hosting) | Aplikasi menampilkan pesan jelas dan opsi coba lagi; tombol tidak macet | TS-30 |
| EC-11 | Admin menurunkan kuota di bawah terjual+dikunci | Ditolak dengan batas minimum saat itu | TS-06 |
| EC-12 | Admin mengarsipkan acara saat ada pesanan menunggu | Pesanan menunggu boleh diselesaikan sampai batas waktu (TBD-10); tiket tetap valid | TS-05 |
| EC-13 | Periode jual zona berakhir saat pesanan menunggu | Pesanan yang sudah dibuat boleh diselesaikan sampai batas waktu (TBD-10) | TS-11 |
| EC-14 | Dua Petugas memindai QR yang sama bersamaan | Satu VALID, satu SUDAH_DIPAKAI | TS-24 |
| EC-15 | Sesi login habis di tengah proses bayar | Pengguna diminta login ulang; pesanan menunggu dapat dilanjutkan dari riwayat jika belum kedaluwarsa | TS-28 |

---

## 14. Analytics and Dashboard Requirements

### 14.1 Istilah jumlah tiket (agar tidak ambigu)
| Istilah | Arti |
|---|---|
| Dipesan | Tiket pada semua pesanan yang pernah dibuat, termasuk yang gagal atau kedaluwarsa (tidak ditampilkan di dasbor) |
| Dikunci | Tiket pada pesanan MENUNGGU yang belum lewat batas waktu |
| Dibayar/Terjual | Tiket pada pesanan DIBAYAR |
| Diterbitkan | Sama dengan terjual pada MVP, karena penerbitan terjadi seketika saat DIBAYAR |
| Check-in | Tiket berstatus DIPAKAI |

### 14.2 Definisi metrik dasbor [K]
| Metrik | Perhitungan | Sumber data | Ditampilkan |
|---|---|---|---|
| Total pendapatan | Jumlah total nilai pesanan berstatus DIBAYAR | Pesanan | Total dan per acara |
| Tiket terjual | Jumlah tiket yang terbit dari pesanan DIBAYAR | Tiket/pesanan | Total dan per acara |
| Tiket dikunci | Jumlah tiket pada pesanan MENUNGGU yang belum lewat batas waktu | Pesanan | Total dan per acara |
| Check-in | Jumlah tiket berstatus DIPAKAI | Tiket | Total dan per acara |
| Total kuota (per acara) | Jumlah kuota seluruh zona acara | Zona | Per acara |

Pesanan GAGAL (tanpa percobaan berhasil), DIBATALKAN, dan KEDALUWARSA tidak dihitung sebagai pendapatan atau terjual. Tidak ada filter tanggal pada MVP [K].

---

## 15. Acceptance and Release Criteria

### 15.1 Acceptance per fitur
Acceptance criteria terperinci ada pada setiap tabel requirement di Bagian 7.

### 15.2 Kriteria penyelesaian per prioritas
| Prioritas | Kriteria selesai |
|---|---|
| P0 | 100% requirement P0 lulus semua AC dan test scenario terkait; tidak ada bug terbuka berdampak pada kuota, pembayaran, atau QR |
| P1 | ≥ 80% requirement P1 lulus; sisanya terdokumentasi sebagai tertunda dengan alasan |
| P2 | Opsional; hanya dikerjakan setelah P0 dan P1 stabil; tidak boleh mengganggu stabilitas |

### 15.3 Kriteria integrasi
- Web Admin dan Mobile memakai API yang sama dan data yang sama.
- Alur end-to-end berjalan tanpa penyuntikan data manual di database.
- Seluruh endpoint tercantum di Swagger dan sesuai perilaku nyata.

### 15.4 Kriteria demo dan deployment
- Backend, database, dan web dapat diakses online; mobile berjalan pada APK/perangkat demo [B].
- Data contoh tersedia; database diekspor sebelum demo.
- Skenario demo: buat acara → aktifkan → beli → bayar gagal lalu berhasil → lihat QR → check-in valid → scan ulang ditolak → lihat dasbor.
- Rencana cadangan: menjalankan secara lokal jika hosting bermasalah [B: R10].

### 15.5 Hubungan dengan success metrics
Setiap metrik G-1 s.d. G-9 (Bagian 3) dipetakan ke test scenario pada Bagian 17.

---

## 16. Risks, Dependencies, and Open Questions

### 16.1 Risiko utama
Risiko R1-R12 pada Project Brief tetap berlaku. Tambahan tingkat PRD:

| # | Risiko | Mitigasi |
|---|---|---|
| R13 | Satu akun membuat banyak pesanan menunggu sehingga mengunci banyak kuota | Keputusan TBD-07; pantau lewat log; batas pesanan menunggu per akun dapat ditambah |
| R14 | Server hosting "tidur" membuat pembersihan kedaluwarsa tidak berjalan | NFR-REL-002: kuota dihitung berdasarkan batas waktu, bukan bergantung pada proses pembersihan |
| R15 | Transisi status bertabrakan (bayar vs batal vs kedaluwarsa) | BR-PAY-009 dan NFR-DAT-003; uji TS-19 |
| R16 | Interpretasi aturan acara DIARSIPKAN versus check-in berbeda antaranggota | TBD-09 dikonfirmasi sebelum desain |

### 16.2 Dependensi lintas anggota
| Dependensi | Pihak |
|---|---|
| Desain layar selesai 1-2 minggu sebelum implementasi | Akhdan, Ammar → Galang, Hilmy |
| Kontrak Swagger awal | Yudha, Akhwan → Galang, Hilmy |
| Skema database dan migrasi | Satu pemilik (usulan Yudha) dan Akhwan melalui PR |
| Validasi QR dan kuota | Akhwan (sisi mobile) dengan Yudha (laporan dan dasbor) |
| Hosting dan deployment | Yudha dan Akhwan |

### 16.3 Keputusan belum selesai (TBD)
| ID | Pertanyaan | Default usulan | Pemilik keputusan |
|---|---|---|---|
| TBD-01 | Layanan hosting gratis | Riset minggu 1 | Tim |
| TBD-02 | Daftar kategori acara awal | Dikelola sebagai data acuan; isi awal ditentukan tim | Tim |
| TBD-03 | Pengurutan jarak (P2) | Setelah P0 dan P1 stabil | Tim |
| TBD-04 | Penugasan Petugas per acara | Semua acara (asumsi Brief) | Tim dan mentor |
| TBD-05 | Ekspektasi mentor: fitur wajib dan format laporan | Menunggu konfirmasi | Mentor |
| TBD-06 | Gambar poster acara dan lokasi penyimpanan | Opsional; mungkin URL gambar eksternal | Tim |
| TBD-07 | Batas jumlah pesanan menunggu aktif per akun | Rekomendasi: maksimal 3 bersamaan; saat ini belum diterapkan | Tim |
| TBD-08 | Tiket gratis (harga 0) | Tidak didukung pada MVP | Tim |
| TBD-09 | Aturan check-in untuk acara DIARSIPKAN | Dapat di-check-in jika ada tiket terbit (lihat catatan di bawah) | Tim |
| TBD-10 | Pesanan menunggu saat acara diarsipkan atau periode jual berakhir | Boleh diselesaikan sampai batas waktu | Tim |
| TBD-11 | Pintu masuk Pembeli dan Petugas dalam satu aplikasi | Satu login; pengalihan otomatis sesuai peran | Tim (Ammar, Hilmy) |
| TBD-12 | Masa berlaku dan perpanjangan sesi login | Ditentukan saat desain arsitektur | Tim (backend) |
| TBD-13 | Verifikasi email dan reset sandi Pembeli | Tidak ada pada MVP | Tim |
| TBD-14 | Pengaturan zona waktu | WIB untuk tampilan | Tim |
| TBD-15 | Mode tamu (lihat katalog tanpa login) | Tidak ada; seluruh fitur wajib login | Tim |

**Catatan TBD-09.** Keputusan 3 menyatakan tiket yang sudah dibeli tetap valid untuk check-in walau acara diarsipkan, sedangkan keputusan 4 menyatakan acara harus berstatus aktif. PRD ini menafsirkannya sebagai: check-in diizinkan untuk acara AKTIF dan DIARSIPKAN, tidak untuk DRAF. Mohon dikonfirmasi.

---

## 17. Traceability Matrix

### 17.1 Brief ke requirement

| Fitur di Project Brief | Requirement | Prioritas | Acceptance criteria | Test scenario |
|---|---|---|---|---|
| Registrasi, login, peran | FR-AUTH-001 s.d. 004 | P0 | AC pada masing-masing FR | TS-01, 02, 03 |
| Kelola acara | FR-EVT-001 s.d. 003 | P0 | AC pada masing-masing FR | TS-04, 05 |
| Kategori/zona tiket (harga, kuota, periode) | FR-TKC-001, 002 (P0); FR-TKC-003 (P1) | P0/P1 | AC pada masing-masing FR | TS-06, 07 |
| Daftar dan detail acara | FR-DSC-001 | P0 | AC1-AC4 | TS-08 |
| Pencarian, filter, pengurutan | FR-DSC-002, 003 | P1 | AC pada masing-masing FR | TS-09, 10 |
| Pemesanan dengan penguncian kuota | FR-ORD-001 | P0 | AC1-AC5 | TS-11, 12, 13 |
| Kedaluwarsa reservasi otomatis | FR-ORD-002 | P0 | AC1-AC4 | TS-14 |
| Pembatalan pesanan | FR-ORD-003 | P0 | AC1-AC3 | TS-15 |
| Riwayat pesanan mobile | FR-ORD-004 | P1 | AC1-AC4 | TS-28 |
| Pembayaran simulasi aman duplikasi | FR-PAY-001, 002, 003 | P0 | AC pada masing-masing FR | TS-16, 17, 18, 19 |
| Tiket dan QR unik | FR-TIX-001, FR-WAL-001 | P0 | AC pada masing-masing FR | TS-16, 20 |
| Ticket Wallet | FR-WAL-002 | P1 | AC1-AC3 | TS-20 |
| Check-in: validasi QR sekali pakai | FR-CHK-001 | P0 | AC1-AC7 | TS-21, 22, 23, 24 |
| Scanner Petugas di mobile | FR-CHK-002 | P1 | AC1-AC4 | TS-29 |
| Akun Petugas | FR-STF-001 | P1 | AC1-AC4 | TS-25 |
| Riwayat penjualan dan status pembayaran | FR-RPT-001 | P1 | AC1-AC5 | TS-26 |
| Dasbor pendapatan, tiket terjual, check-in | FR-RPT-002 | P1 | AC1-AC4 | TS-27 |
| Swagger dan dokumentasi dasar | NFR-DOC-001, 002 | P0 | Tabel NFR | TS-31 |
| Deployment online | NFR-DEP-001 s.d. 004 | P0 | Tabel NFR | TS-32 |
| Pengurutan jarak, denah statis, input manual, reset sandi, dasbor kaya | FR-DSC-004, FR-TKC-004, FR-CHK-003, FR-STF-002, FR-RPT-003 | P2 | Bagian 7.12 | Ditentukan bila dikerjakan |

### 17.2 Daftar test scenario

| ID | Skenario | Requirement terkait |
|---|---|---|
| TS-01 | Registrasi sukses; email duplikat ditolak; peran selalu Pembeli | FR-AUTH-001 |
| TS-02 | Login tiap peran di platform benar; peran di platform salah ditolak; akun nonaktif ditolak | FR-AUTH-002, 004 |
| TS-03 | Pembeli mengakses endpoint Admin atau data pembeli lain ditolak | FR-AUTH-003 |
| TS-04 | Buat/ubah/hapus acara dan validasi tanggal | FR-EVT-001, 003 |
| TS-05 | Arsip acara: hilang dari katalog, tiket tetap valid, pesanan menunggu dapat selesai | FR-EVT-002 |
| TS-06 | Validasi zona dan penurunan kuota di bawah terjual+dikunci ditolak | FR-TKC-001, 002 |
| TS-07 | Zona yang punya pesanan tidak dapat dihapus, dapat dinonaktifkan | FR-TKC-003 |
| TS-08 | Katalog hanya acara AKTIF dan belum berakhir; detail memuat zona dan sisa kuota | FR-DSC-001 |
| TS-09 | Pencarian dan filter, termasuk kombinasi dan hasil kosong | FR-DSC-002 |
| TS-10 | Pengurutan termurah, termahal, tanggal terdekat | FR-DSC-003 |
| TS-11 | Pesanan sukses mengunci kuota; jumlah 13 dan melebihi sisa ditolak | FR-ORD-001 |
| TS-12 | Konkurensi: 50 permintaan pada sisa kuota 10 menghasilkan tepat 10 sukses | FR-ORD-001 |
| TS-13 | Klik ganda/pengiriman ulang pembuatan pesanan menghasilkan satu pesanan | FR-ORD-001, FR-PAY-003 |
| TS-14 | Pesanan tidak dibayar 10 menit menjadi KEDALUWARSA; kuota kembali; benar walau pembersihan tertunda | FR-ORD-002 |
| TS-15 | Batalkan pesanan melepas kuota; pesanan DIBAYAR tidak dapat dibatalkan | FR-ORD-003 |
| TS-16 | Bayar Berhasil: DIBAYAR, tiket terbit sejumlah pesanan, tidak ada keadaan setengah jadi | FR-PAY-001, FR-TIX-001 |
| TS-17 | Bayar Gagal: pesanan tetap MENUNGGU; coba lagi berhasil | FR-PAY-002 |
| TS-18 | Bayar berulang/serentak: satu pembayaran BERHASIL dan satu set tiket | FR-PAY-003 |
| TS-19 | Balapan bayar vs batal vs kedaluwarsa: satu status akhir konsisten | FR-PAY-003, FR-ORD-002, 003 |
| TS-20 | Wallet hanya menampilkan tiket milik sendiri; QR tampil | FR-WAL-001, 002 |
| TS-21 | Scan pertama VALID; waktu dan Petugas tercatat | FR-CHK-001 |
| TS-22 | Scan kedua SUDAH_DIPAKAI | FR-CHK-001 |
| TS-23 | Token tidak dikenal, tiket acara lain, atau acara DRAF: TIDAK_VALID | FR-CHK-001 |
| TS-24 | Dua Petugas memindai tiket yang sama bersamaan: satu VALID | FR-CHK-001 |
| TS-25 | Buat, nonaktifkan Petugas; Petugas nonaktif ditolak | FR-STF-001 |
| TS-26 | Riwayat penjualan: filter, detail, ringkasan status pembayaran | FR-RPT-001 |
| TS-27 | Angka dasbor sama dengan hitungan manual sesuai definisi | FR-RPT-002 |
| TS-28 | Riwayat pesanan; melanjutkan pesanan menunggu; sesi habis lalu login ulang | FR-ORD-004 |
| TS-29 | Petugas memilih acara dahulu; tiga hasil tampil jelas; izin kamera ditolak | FR-CHK-002 |
| TS-30 | API tidak tersedia: pesan jelas dan opsi coba lagi di web dan mobile | NFR-REL-003 |
| TS-31 | Swagger mencakup seluruh endpoint | NFR-DOC-001 |
| TS-32 | Smoke test deployment online (backend, database, web, mobile) | NFR-DEP-001 |

---

## 18. Glossary

| Istilah | Arti |
|---|---|
| Event (acara) | Kegiatan yang tiketnya dijual, dengan jadwal dan lokasi |
| Kategori acara | Pengelompokan jenis acara, dipakai untuk filter |
| Ticket category / zona tiket | Kelompok tiket dalam satu acara (misalnya Reguler, VIP, VVIP) dengan harga, kuota, dan periode jual sendiri; berfungsi sebagai "denah" berbasis zona, bukan pemilihan kursi |
| Kuota | Jumlah maksimal tiket yang dapat dijual pada satu zona |
| Order (pesanan) | Permintaan pembelian satu zona pada satu acara dengan jumlah tertentu |
| Reservation (reservasi) | Penguncian kuota selama 10 menit sejak pesanan dibuat |
| Kuota dikunci | Kuota yang ditahan oleh pesanan menunggu yang belum lewat batas waktu |
| Payment simulation | Pembayaran tiruan tanpa uang nyata, dengan hasil dipilih pengguna (berhasil, gagal, batal) |
| Ticket (tiket) | Hak masuk digital tunggal, memiliki kode dan token QR unik |
| Ticket Wallet | Bagian aplikasi yang menyimpan tiket digital milik pembeli |
| QR Code / token QR | Kode yang dipindai Petugas; berisi token tak tertebak, bukan data pribadi |
| QR validation | Pemeriksaan token di server untuk menentukan VALID, SUDAH_DIPAKAI, atau TIDAK_VALID |
| Check-in | Pencatatan kehadiran saat tiket divalidasi VALID dan berubah menjadi DIPAKAI |
| Idempotency (idempotensi) | Sifat bahwa pengulangan permintaan yang sama menghasilkan hasil yang sama tanpa efek ganda |
| Idempotency key | Pengenal unik per permintaan yang dipakai server untuk mengenali pengulangan |
| Harga acuan | Harga terendah di antara zona acara yang sedang dijual; dasar pengurutan termurah dan termahal |
| Snapshot harga | Harga satuan dan total yang disalin ke pesanan saat dibuat sehingga tidak berubah bila Admin mengubah harga |
| Seed | Proses awal yang mengisi akun atau data dasar ke database |
