# Mobile App - Event & Ticket Pass

Aplikasi mobile Flutter untuk pembeli tiket dan petugas check-in.

## Fitur
- **Mode Pembeli**: Jelajah acara, beli tiket, simulasi pembayaran, tampilkan QR
- **Mode Petugas**: Pilih acara, scan QR untuk validasi check-in

## Setup

### Prasyarat
- Flutter SDK >= 3.19.0
- Dart SDK >= 3.3.0
- Android Studio / VS Code dengan Flutter extension
- Perangkat Android/iOS atau emulator

### Instalasi
```bash
cd mobile
flutter pub get
```

### Menjalankan
```bash
# Debug mode
flutter run

# Dengan environment variables
flutter run --dart-define=SUPABASE_URL=your_url --dart-define=SUPABASE_ANON_KEY=your_key
```

### Build APK
```bash
flutter build apk --release
```

## Struktur Folder
```
mobile/
├── lib/
│   ├── main.dart              # Entry point
│   ├── config/                # App configuration, theme, routes
│   ├── models/                # Data models
│   ├── services/              # API services, Supabase client
│   ├── providers/             # State management
│   ├── screens/               # Screen widgets
│   │   ├── auth/              # Login, Register
│   │   ├── buyer/             # Event list, detail, order, payment, wallet
│   │   └── staff/             # Event select, QR scanner, check-in result
│   ├── widgets/               # Reusable components
│   └── utils/                 # Helpers, formatters, constants
├── assets/                    # Images, fonts
├── test/                      # Unit & widget tests
└── pubspec.yaml
```

## Catatan untuk Tim Mobile (Hilmy)
- Gunakan design tokens dari `../shared/design-tokens.dart`
- Ikuti API contract dari `../shared/api-contract.ts`
- Gunakan mock data untuk development sebelum backend siap
- QR Code: gunakan package `qr_flutter` untuk generate dan `mobile_scanner` untuk scan

