import 'package:intl/intl.dart';

/// Format angka ke Rupiah (e.g., Rp 150.000)
String formatRupiah(int amount) {
  final formatter = NumberFormat('#,###', 'id_ID');
  return 'Rp ${formatter.format(amount)}';
}

/// Format tanggal ke format Indonesia (e.g., 15 Okt 2026, 19:00 WIB)
String formatDateId(DateTime date) {
  final formatter = DateFormat('dd MMM yyyy, HH:mm', 'id_ID');
  return '${formatter.format(date.toLocal())} WIB';
}

/// Format tanggal singkat (e.g., 15 Okt 2026)
String formatDateShort(DateTime date) {
  final formatter = DateFormat('dd MMM yyyy', 'id_ID');
  return formatter.format(date.toLocal());
}

/// Format durasi countdown (e.g., 09:45)
String formatCountdown(Duration duration) {
  if (duration.isNegative) return '00:00';
  final minutes = duration.inMinutes.remainder(60).toString().padLeft(2, '0');
  final seconds = duration.inSeconds.remainder(60).toString().padLeft(2, '0');
  return '$minutes:$seconds';
}

