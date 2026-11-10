// ============================================================================
// Event & Ticket Pass — Design Tokens (Flutter / Dart)
// ============================================================================
// Mirror of shared/design-tokens.css for the Flutter mobile application.
// Uses Material 3 (useMaterial3: true) and provides a complete ThemeData
// including ColorScheme, TextTheme, and component themes.
//
// Usage:
//   import 'package:event_ticket_pass/shared/design_tokens.dart';
//   MaterialApp(theme: AppDesignTokens.lightTheme, ...);
// ============================================================================

import 'package:flutter/material.dart';

/// Single source of truth for every visual constant in the mobile app.
///
/// All colour hex values, spacing, typography, and radii match the CSS
/// design tokens exactly so that the Web Admin and Flutter apps look
/// consistent.
class AppDesignTokens {
  AppDesignTokens._(); // prevent instantiation

  // ──────────────────────────────────────────────────────────────────────────
  // PRIMARY — Blue-Indigo
  // ──────────────────────────────────────────────────────────────────────────
  static const Color primary50  = Color(0xFFEEF2FF);
  static const Color primary100 = Color(0xFFE0E7FF);
  static const Color primary200 = Color(0xFFC7D2FE);
  static const Color primary300 = Color(0xFFA5B4FC);
  static const Color primary400 = Color(0xFF818CF8);
  static const Color primary500 = Color(0xFF6366F1);
  static const Color primary600 = Color(0xFF4F46E5);
  static const Color primary700 = Color(0xFF4338CA);
  static const Color primary800 = Color(0xFF3730A3);
  static const Color primary900 = Color(0xFF312E81);
  static const Color primary950 = Color(0xFF1E1B4B);

  static const MaterialColor primarySwatch = MaterialColor(0xFF6366F1, {
    50:  primary50,
    100: primary100,
    200: primary200,
    300: primary300,
    400: primary400,
    500: primary500,
    600: primary600,
    700: primary700,
    800: primary800,
    900: primary900,
  });

  // ──────────────────────────────────────────────────────────────────────────
  // SECONDARY — Slate
  // ──────────────────────────────────────────────────────────────────────────
  static const Color secondary50  = Color(0xFFF8FAFC);
  static const Color secondary100 = Color(0xFFF1F5F9);
  static const Color secondary200 = Color(0xFFE2E8F0);
  static const Color secondary300 = Color(0xFFCBD5E1);
  static const Color secondary400 = Color(0xFF94A3B8);
  static const Color secondary500 = Color(0xFF64748B);
  static const Color secondary600 = Color(0xFF475569);
  static const Color secondary700 = Color(0xFF334155);
  static const Color secondary800 = Color(0xFF1E293B);
  static const Color secondary900 = Color(0xFF0F172A);
  static const Color secondary950 = Color(0xFF020617);

  // ──────────────────────────────────────────────────────────────────────────
  // ACCENT — Violet
  // ──────────────────────────────────────────────────────────────────────────
  static const Color accent50  = Color(0xFFF5F3FF);
  static const Color accent100 = Color(0xFFEDE9FE);
  static const Color accent200 = Color(0xFFDDD6FE);
  static const Color accent300 = Color(0xFFC4B5FD);
  static const Color accent400 = Color(0xFFA78BFA);
  static const Color accent500 = Color(0xFF8B5CF6);
  static const Color accent600 = Color(0xFF7C3AED);
  static const Color accent700 = Color(0xFF6D28D9);
  static const Color accent800 = Color(0xFF5B21B6);
  static const Color accent900 = Color(0xFF4C1D95);
  static const Color accent950 = Color(0xFF2E1065);

  // ──────────────────────────────────────────────────────────────────────────
  // NEUTRAL — Gray
  // ──────────────────────────────────────────────────────────────────────────
  static const Color neutral50  = Color(0xFFF9FAFB);
  static const Color neutral100 = Color(0xFFF3F4F6);
  static const Color neutral200 = Color(0xFFE5E7EB);
  static const Color neutral300 = Color(0xFFD1D5DB);
  static const Color neutral400 = Color(0xFF9CA3AF);
  static const Color neutral500 = Color(0xFF6B7280);
  static const Color neutral600 = Color(0xFF4B5563);
  static const Color neutral700 = Color(0xFF374151);
  static const Color neutral800 = Color(0xFF1F2937);
  static const Color neutral900 = Color(0xFF111827);
  static const Color neutral950 = Color(0xFF030712);

  // ──────────────────────────────────────────────────────────────────────────
  // SEMANTIC — Success / Warning / Error / Info
  // ──────────────────────────────────────────────────────────────────────────
  static const Color success50  = Color(0xFFF0FDF4);
  static const Color success100 = Color(0xFFDCFCE7);
  static const Color success200 = Color(0xFFBBF7D0);
  static const Color success300 = Color(0xFF86EFAC);
  static const Color success400 = Color(0xFF4ADE80);
  static const Color success500 = Color(0xFF22C55E);
  static const Color success600 = Color(0xFF16A34A);
  static const Color success700 = Color(0xFF15803D);
  static const Color success800 = Color(0xFF166534);
  static const Color success900 = Color(0xFF14532D);

  static const Color warning50  = Color(0xFFFFFBEB);
  static const Color warning100 = Color(0xFFFEF3C7);
  static const Color warning200 = Color(0xFFFDE68A);
  static const Color warning300 = Color(0xFFFCD34D);
  static const Color warning400 = Color(0xFFFBBF24);
  static const Color warning500 = Color(0xFFF59E0B);
  static const Color warning600 = Color(0xFFD97706);
  static const Color warning700 = Color(0xFFB45309);
  static const Color warning800 = Color(0xFF92400E);
  static const Color warning900 = Color(0xFF78350F);

  static const Color error50  = Color(0xFFFEF2F2);
  static const Color error100 = Color(0xFFFEE2E2);
  static const Color error200 = Color(0xFFFECACA);
  static const Color error300 = Color(0xFFFCA5A5);
  static const Color error400 = Color(0xFFF87171);
  static const Color error500 = Color(0xFFEF4444);
  static const Color error600 = Color(0xFFDC2626);
  static const Color error700 = Color(0xFFB91C1C);
  static const Color error800 = Color(0xFF991B1B);
  static const Color error900 = Color(0xFF7F1D1D);

  static const Color info50  = Color(0xFFEFF6FF);
  static const Color info100 = Color(0xFFDBEAFE);
  static const Color info200 = Color(0xFFBFDBFE);
  static const Color info300 = Color(0xFF93C5FD);
  static const Color info400 = Color(0xFF60A5FA);
  static const Color info500 = Color(0xFF3B82F6);
  static const Color info600 = Color(0xFF2563EB);
  static const Color info700 = Color(0xFF1D4ED8);
  static const Color info800 = Color(0xFF1E40AF);
  static const Color info900 = Color(0xFF1E3A8A);

  // ──────────────────────────────────────────────────────────────────────────
  // SURFACE & TEXT
  // ──────────────────────────────────────────────────────────────────────────
  static const Color bgPage     = Color(0xFFF9FAFB);
  static const Color bgSurface  = Color(0xFFFFFFFF);
  static const Color bgMuted    = Color(0xFFF3F4F6);

  static const Color textPrimary   = Color(0xFF111827);
  static const Color textSecondary = Color(0xFF4B5563);
  static const Color textTertiary  = Color(0xFF9CA3AF);
  static const Color textInverse   = Color(0xFFFFFFFF);

  // ──────────────────────────────────────────────────────────────────────────
  // SPACING (logical pixels — matches 4px base × token number)
  // ──────────────────────────────────────────────────────────────────────────
  static const double space0  = 0;
  static const double space1  = 4;
  static const double space2  = 8;
  static const double space3  = 12;
  static const double space4  = 16;
  static const double space5  = 20;
  static const double space6  = 24;
  static const double space8  = 32;
  static const double space10 = 40;
  static const double space12 = 48;
  static const double space16 = 64;
  static const double space20 = 80;
  static const double space24 = 96;

  // ──────────────────────────────────────────────────────────────────────────
  // BORDER RADIUS
  // ──────────────────────────────────────────────────────────────────────────
  static const double radiusSm   = 4;
  static const double radiusMd   = 6;
  static const double radiusLg   = 8;
  static const double radiusXl   = 12;
  static const double radius2Xl  = 16;
  static const double radius3Xl  = 24;

  static BorderRadius borderRadiusSm  = BorderRadius.circular(radiusSm);
  static BorderRadius borderRadiusMd  = BorderRadius.circular(radiusMd);
  static BorderRadius borderRadiusLg  = BorderRadius.circular(radiusLg);
  static BorderRadius borderRadiusXl  = BorderRadius.circular(radiusXl);
  static BorderRadius borderRadius2Xl = BorderRadius.circular(radius2Xl);
  static BorderRadius borderRadius3Xl = BorderRadius.circular(radius3Xl);
  static BorderRadius borderRadiusFull = BorderRadius.circular(9999);

  // ──────────────────────────────────────────────────────────────────────────
  // SHADOWS
  // ──────────────────────────────────────────────────────────────────────────
  static const List<BoxShadow> shadowSm = [
    BoxShadow(
      color: Color(0x1A000000), // rgba(0,0,0,0.10)
      blurRadius: 3,
      offset: Offset(0, 1),
    ),
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 2,
      offset: Offset(0, 1),
      spreadRadius: -1,
    ),
  ];

  static const List<BoxShadow> shadowMd = [
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 6,
      offset: Offset(0, 4),
      spreadRadius: -1,
    ),
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 4,
      offset: Offset(0, 2),
      spreadRadius: -2,
    ),
  ];

  static const List<BoxShadow> shadowLg = [
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 15,
      offset: Offset(0, 10),
      spreadRadius: -3,
    ),
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 6,
      offset: Offset(0, 4),
      spreadRadius: -4,
    ),
  ];

  static const List<BoxShadow> shadowXl = [
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 25,
      offset: Offset(0, 20),
      spreadRadius: -5,
    ),
    BoxShadow(
      color: Color(0x1A000000),
      blurRadius: 10,
      offset: Offset(0, 8),
      spreadRadius: -6,
    ),
  ];

  // ──────────────────────────────────────────────────────────────────────────
  // ANIMATION DURATIONS
  // ──────────────────────────────────────────────────────────────────────────
  static const Duration durationFast   = Duration(milliseconds: 150);
  static const Duration durationBase   = Duration(milliseconds: 200);
  static const Duration durationSlow   = Duration(milliseconds: 300);
  static const Duration durationSlower = Duration(milliseconds: 500);

  static const Curve curveDefault = Curves.easeInOut;
  static const Curve curveBounce  = Curves.elasticOut;

  // ──────────────────────────────────────────────────────────────────────────
  // STATUS BADGE STYLES
  // Maps enum values (Bahasa Indonesia) to bg / text / dot colour triples.
  // ──────────────────────────────────────────────────────────────────────────
  static const Map<String, StatusBadgeStyle> statusStyles = {
    // Event Status
    'AKTIF':       StatusBadgeStyle(bg: success100, text: success700, dot: success500),
    'DRAF':        StatusBadgeStyle(bg: neutral100, text: neutral700, dot: neutral400),
    'DIARSIPKAN':  StatusBadgeStyle(bg: warning100, text: Color(0xFF92400E), dot: warning500),

    // Order Status
    'MENUNGGU_PEMBAYARAN': StatusBadgeStyle(bg: info100, text: Color(0xFF1E40AF), dot: info500),
    'DIBAYAR':     StatusBadgeStyle(bg: success100, text: success700, dot: success500),
    'DIBATALKAN':  StatusBadgeStyle(bg: error100,   text: Color(0xFF991B1B), dot: error500),
    'KEDALUWARSA': StatusBadgeStyle(bg: neutral100, text: neutral700, dot: neutral400),

    // Ticket Status
    'VALID':          StatusBadgeStyle(bg: success100, text: success700, dot: success500),
    'SUDAH_DIPAKAI':  StatusBadgeStyle(bg: warning100, text: Color(0xFF92400E), dot: warning500),
    'TIDAK_VALID':    StatusBadgeStyle(bg: error100,   text: Color(0xFF991B1B), dot: error500),
  };

  // ──────────────────────────────────────────────────────────────────────────
  // TEXT THEME — Material 3 scale using Inter
  // ──────────────────────────────────────────────────────────────────────────
  static const String _fontFamily = 'Inter';

  static const TextTheme textTheme = TextTheme(
    // Display
    displayLarge:  TextStyle(fontFamily: _fontFamily, fontSize: 57, fontWeight: FontWeight.w400, letterSpacing: -0.25, height: 1.12),
    displayMedium: TextStyle(fontFamily: _fontFamily, fontSize: 45, fontWeight: FontWeight.w400, letterSpacing: 0,     height: 1.16),
    displaySmall:  TextStyle(fontFamily: _fontFamily, fontSize: 36, fontWeight: FontWeight.w400, letterSpacing: 0,     height: 1.22),

    // Headline
    headlineLarge:  TextStyle(fontFamily: _fontFamily, fontSize: 32, fontWeight: FontWeight.w600, letterSpacing: 0,     height: 1.25),
    headlineMedium: TextStyle(fontFamily: _fontFamily, fontSize: 28, fontWeight: FontWeight.w600, letterSpacing: 0,     height: 1.29),
    headlineSmall:  TextStyle(fontFamily: _fontFamily, fontSize: 24, fontWeight: FontWeight.w600, letterSpacing: 0,     height: 1.33),

    // Title
    titleLarge:  TextStyle(fontFamily: _fontFamily, fontSize: 22, fontWeight: FontWeight.w600, letterSpacing: 0,    height: 1.27),
    titleMedium: TextStyle(fontFamily: _fontFamily, fontSize: 16, fontWeight: FontWeight.w600, letterSpacing: 0.15, height: 1.50),
    titleSmall:  TextStyle(fontFamily: _fontFamily, fontSize: 14, fontWeight: FontWeight.w600, letterSpacing: 0.1,  height: 1.43),

    // Body
    bodyLarge:  TextStyle(fontFamily: _fontFamily, fontSize: 16, fontWeight: FontWeight.w400, letterSpacing: 0.5,  height: 1.50),
    bodyMedium: TextStyle(fontFamily: _fontFamily, fontSize: 14, fontWeight: FontWeight.w400, letterSpacing: 0.25, height: 1.43),
    bodySmall:  TextStyle(fontFamily: _fontFamily, fontSize: 12, fontWeight: FontWeight.w400, letterSpacing: 0.4,  height: 1.33),

    // Label
    labelLarge:  TextStyle(fontFamily: _fontFamily, fontSize: 14, fontWeight: FontWeight.w500, letterSpacing: 0.1,  height: 1.43),
    labelMedium: TextStyle(fontFamily: _fontFamily, fontSize: 12, fontWeight: FontWeight.w500, letterSpacing: 0.5,  height: 1.33),
    labelSmall:  TextStyle(fontFamily: _fontFamily, fontSize: 11, fontWeight: FontWeight.w500, letterSpacing: 0.5,  height: 1.45),
  );

  // ──────────────────────────────────────────────────────────────────────────
  // COLOR SCHEME — Material 3
  // ──────────────────────────────────────────────────────────────────────────
  static const ColorScheme lightColorScheme = ColorScheme(
    brightness:          Brightness.light,
    primary:             primary600,
    onPrimary:           textInverse,
    primaryContainer:    primary100,
    onPrimaryContainer:  primary900,
    secondary:           secondary600,
    onSecondary:         textInverse,
    secondaryContainer:  secondary100,
    onSecondaryContainer:secondary900,
    tertiary:            accent600,
    onTertiary:          textInverse,
    tertiaryContainer:   accent100,
    onTertiaryContainer: accent900,
    error:               error500,
    onError:             textInverse,
    errorContainer:      error100,
    onErrorContainer:    error900,
    surface:             bgSurface,
    onSurface:           textPrimary,
    surfaceContainerHighest: neutral100,
    onSurfaceVariant:    textSecondary,
    outline:             neutral300,
    outlineVariant:      neutral200,
    shadow:              Color(0xFF000000),
    scrim:               Color(0xFF000000),
    inverseSurface:      neutral900,
    onInverseSurface:    neutral50,
    inversePrimary:      primary300,
  );

  // ──────────────────────────────────────────────────────────────────────────
  // COMPLETE THEME DATA
  // ──────────────────────────────────────────────────────────────────────────
  static ThemeData get lightTheme => ThemeData(
    useMaterial3: true,
    colorScheme: lightColorScheme,
    textTheme: textTheme,
    fontFamily: _fontFamily,
    scaffoldBackgroundColor: bgPage,
    dividerColor: neutral200,
    splashFactory: InkSparkle.splashFactory,

    // AppBar
    appBarTheme: const AppBarTheme(
      elevation: 0,
      scrolledUnderElevation: 1,
      backgroundColor: bgSurface,
      foregroundColor: textPrimary,
      surfaceTintColor: Colors.transparent,
      titleTextStyle: TextStyle(
        fontFamily: _fontFamily,
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
    ),

    // Card
    cardTheme: CardTheme(
      elevation: 0,
      color: bgSurface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusXl),
        side: const BorderSide(color: neutral200, width: 1),
      ),
      margin: EdgeInsets.zero,
    ),

    // Elevated Button (Primary)
    elevatedButtonTheme: ElevatedButtonThemeData(
      style: ElevatedButton.styleFrom(
        backgroundColor: primary600,
        foregroundColor: textInverse,
        elevation: 0,
        padding: const EdgeInsets.symmetric(horizontal: space5, vertical: space3),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLg),
        ),
        textStyle: const TextStyle(
          fontFamily: _fontFamily,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),

    // Outlined Button (Secondary)
    outlinedButtonTheme: OutlinedButtonThemeData(
      style: OutlinedButton.styleFrom(
        foregroundColor: textPrimary,
        side: const BorderSide(color: neutral300, width: 1),
        padding: const EdgeInsets.symmetric(horizontal: space5, vertical: space3),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLg),
        ),
        textStyle: const TextStyle(
          fontFamily: _fontFamily,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),

    // Text Button (Ghost)
    textButtonTheme: TextButtonThemeData(
      style: TextButton.styleFrom(
        foregroundColor: primary600,
        padding: const EdgeInsets.symmetric(horizontal: space4, vertical: space3),
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(radiusLg),
        ),
        textStyle: const TextStyle(
          fontFamily: _fontFamily,
          fontSize: 14,
          fontWeight: FontWeight.w600,
        ),
      ),
    ),

    // Input Decoration
    inputDecorationTheme: InputDecorationTheme(
      filled: true,
      fillColor: bgSurface,
      contentPadding: const EdgeInsets.symmetric(horizontal: space4, vertical: space3),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusLg),
        borderSide: const BorderSide(color: neutral300, width: 1),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusLg),
        borderSide: const BorderSide(color: neutral300, width: 1),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusLg),
        borderSide: const BorderSide(color: primary500, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusLg),
        borderSide: const BorderSide(color: error500, width: 1),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(radiusLg),
        borderSide: const BorderSide(color: error500, width: 2),
      ),
      hintStyle: const TextStyle(
        fontFamily: _fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textTertiary,
      ),
      labelStyle: const TextStyle(
        fontFamily: _fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w500,
        color: textSecondary,
      ),
    ),

    // Bottom Navigation
    bottomNavigationBarTheme: const BottomNavigationBarThemeData(
      backgroundColor: bgSurface,
      selectedItemColor: primary600,
      unselectedItemColor: neutral400,
      type: BottomNavigationBarType.fixed,
      elevation: 8,
      selectedLabelStyle: TextStyle(fontFamily: _fontFamily, fontSize: 12, fontWeight: FontWeight.w600),
      unselectedLabelStyle: TextStyle(fontFamily: _fontFamily, fontSize: 12, fontWeight: FontWeight.w400),
    ),

    // Chip
    chipTheme: ChipThemeData(
      backgroundColor: neutral100,
      labelStyle: const TextStyle(
        fontFamily: _fontFamily,
        fontSize: 12,
        fontWeight: FontWeight.w500,
        color: textSecondary,
      ),
      side: BorderSide.none,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusFull),
      ),
      padding: const EdgeInsets.symmetric(horizontal: space3, vertical: space1),
    ),

    // Divider
    dividerTheme: const DividerThemeData(
      color: neutral200,
      thickness: 1,
      space: 0,
    ),

    // Dialog / Modal
    dialogTheme: DialogTheme(
      elevation: 0,
      backgroundColor: bgSurface,
      surfaceTintColor: Colors.transparent,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radius2Xl),
      ),
      titleTextStyle: const TextStyle(
        fontFamily: _fontFamily,
        fontSize: 18,
        fontWeight: FontWeight.w600,
        color: textPrimary,
      ),
      contentTextStyle: const TextStyle(
        fontFamily: _fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textSecondary,
      ),
    ),

    // Bottom Sheet
    bottomSheetTheme: BottomSheetThemeData(
      backgroundColor: bgSurface,
      surfaceTintColor: Colors.transparent,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.only(
          topLeft: Radius.circular(radius2Xl),
          topRight: Radius.circular(radius2Xl),
        ),
      ),
      dragHandleColor: neutral300,
      dragHandleSize: const Size(40, 4),
    ),

    // Snackbar
    snackBarTheme: SnackBarThemeData(
      backgroundColor: neutral900,
      contentTextStyle: const TextStyle(
        fontFamily: _fontFamily,
        fontSize: 14,
        fontWeight: FontWeight.w400,
        color: textInverse,
      ),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(radiusLg),
      ),
      behavior: SnackBarBehavior.floating,
    ),
  );
}

/// Defines background, text, and dot colours for a status badge.
class StatusBadgeStyle {
  final Color bg;
  final Color text;
  final Color dot;

  const StatusBadgeStyle({
    required this.bg,
    required this.text,
    required this.dot,
  });
}

/// Rupiah currency formatter helper.
///
/// Usage:
///   RupiahFormatter.format(150000) => 'Rp150.000'
class RupiahFormatter {
  RupiahFormatter._();

  static String format(num amount) {
    final isNegative = amount < 0;
    final absAmount = amount.abs().truncate();
    final formatted = absAmount.toString().replaceAllMapped(
      RegExp(r'(\d)(?=(\d{3})+(?!\d))'),
      (match) => '${match[1]}.',
    );
    return '${isNegative ? '-' : ''}Rp$formatted';
  }
}
