import 'package:flutter/material.dart';
import '../../config/theme.dart';

class StaffCheckInScreen extends StatefulWidget {
  const StaffCheckInScreen({super.key});

  @override
  State<StaffCheckInScreen> createState() => _StaffCheckInScreenState();
}

class _StaffCheckInScreenState extends State<StaffCheckInScreen> {
  String _selectedEvent = 'Konser Nusantara 2027';
  String? _scanResult; // 'VALID' | 'SUDAH_DIPAKAI' | 'TIDAK_VALID'
  String? _resultMessage;
  String? _previousCheckInTime;

  final List<String> _events = [
    'Konser Nusantara 2027',
    'Tech Innovation Summit 2027',
    'Pesta Seni & Budaya Nusantara',
  ];

  void _simulateScan(String outcome) {
    setState(() {
      _scanResult = outcome;
      if (outcome == 'VALID') {
        _resultMessage = 'Tiket Sah! Akses Masuk Disetujui.';
        _previousCheckInTime = null;
      } else if (outcome == 'SUDAH_DIPAKAI') {
        _resultMessage = 'Tiket Sudah Digunakan!';
        _previousCheckInTime = 'Check-in sebelumnya: Hari ini, 18:24 WIB';
      } else {
        _resultMessage = 'Tiket Tidak Valid / Bukan untuk acara ini!';
        _previousCheckInTime = null;
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mode Petugas Check-in'),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(AppTheme.space5),
          child: Column(
            crossAxisAlignment: CrossAlignment.stretch,
            children: [
              // Event Selector (BR-CHK-003: Staff selects event first)
              const Text(
                'Pilih Acara untuk Check-in:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
              ),
              const SizedBox(height: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14),
                decoration: BoxDecoration(
                  color: Colors.white,
                  border: Border.all(color: AppTheme.border),
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                ),
                child: DropdownButtonHideUnderline(
                  child: DropdownButton<String>(
                    value: _selectedEvent,
                    isExpanded: true,
                    items: _events
                        .map((e) => DropdownMenuItem(value: e, child: Text(e, style: const TextStyle(fontSize: 14))))
                        .toList(),
                    onChanged: (val) {
                      if (val != null) setState(() => _selectedEvent = val);
                    },
                  ),
                ),
              ),
              const SizedBox(height: AppTheme.space6),

              // Scanner Viewport
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(AppTheme.radiusLg),
                  ),
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      Container(
                        width: 240,
                        height: 240,
                        decoration: BoxDecoration(
                          border: Border.all(color: AppTheme.primary400, width: 3),
                          borderRadius: BorderRadius.circular(16),
                        ),
                      ),
                      const Positioned(
                        bottom: 30,
                        child: Text(
                          'Arahkan kamera ke QR Code pengunjung',
                          style: TextStyle(color: Colors.white70, fontSize: 12),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppTheme.space4),

              // Result Banner (NFR-USA-004: Not color only, text + icon)
              if (_scanResult != null) ...[
                Container(
                  padding: const EdgeInsets.all(AppTheme.space4),
                  decoration: BoxDecoration(
                    color: _scanResult == 'VALID'
                        ? AppTheme.successLight
                        : _scanResult == 'SUDAH_DIPAKAI'
                            ? AppTheme.warningLight
                            : AppTheme.errorLight,
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                    border: Border.all(
                      color: _scanResult == 'VALID'
                          ? AppTheme.success
                          : _scanResult == 'SUDAH_DIPAKAI'
                              ? AppTheme.warning
                              : AppTheme.error,
                    ),
                  ),
                  child: Column(
                    children: [
                      Row(
                        children: [
                          Icon(
                            _scanResult == 'VALID'
                                ? Icons.check_circle
                                : _scanResult == 'SUDAH_DIPAKAI'
                                    ? Icons.warning_amber
                                    : Icons.cancel,
                            color: _scanResult == 'VALID'
                                ? AppTheme.success
                                : _scanResult == 'SUDAH_DIPAKAI'
                                    ? AppTheme.warning
                                    : AppTheme.error,
                            size: 28,
                          ),
                          const SizedBox(width: AppTheme.space3),
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAlignment.start,
                              children: [
                                Text(
                                  _scanResult == 'VALID'
                                      ? 'VALID'
                                      : _scanResult == 'SUDAH_DIPAKAI'
                                          ? 'SUDAH DIPAKAI'
                                          : 'TIDAK VALID',
                                  style: TextStyle(
                                    fontWeight: FontWeight.bold,
                                    fontSize: 16,
                                    color: _scanResult == 'VALID'
                                        ? AppTheme.success
                                        : _scanResult == 'SUDAH_DIPAKAI'
                                            ? AppTheme.warning
                                            : AppTheme.error,
                                  ),
                                ),
                                Text(
                                  _resultMessage ?? '',
                                  style: const TextStyle(fontSize: 13),
                                ),
                                if (_previousCheckInTime != null)
                                  Text(
                                    _previousCheckInTime!,
                                    style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w600),
                                  ),
                              ],
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: AppTheme.space3),
              ],

              // Testing trigger buttons for demo
              const Text(
                'Simulasi Hasil Scan:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 11, color: AppTheme.textMuted),
              ),
              const SizedBox(height: 6),
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _simulateScan('VALID'),
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.success),
                      child: const Text('Valid', style: TextStyle(fontSize: 12)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _simulateScan('SUDAH_DIPAKAI'),
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.warning),
                      child: const Text('Used', style: TextStyle(fontSize: 12)),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () => _simulateScan('TIDAK_VALID'),
                      style: ElevatedButton.styleFrom(backgroundColor: AppTheme.error),
                      child: const Text('Invalid', style: TextStyle(fontSize: 12)),
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }
}
