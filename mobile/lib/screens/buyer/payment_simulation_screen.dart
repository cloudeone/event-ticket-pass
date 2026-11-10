import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../utils/formatters.dart';

class PaymentSimulationScreen extends StatefulWidget {
  final String orderNumber;
  final String eventTitle;
  final String zoneName;
  final int quantity;
  final int totalPrice;

  const PaymentSimulationScreen({
    super.key,
    required this.orderNumber,
    required this.eventTitle,
    required this.zoneName,
    required this.quantity,
    required this.totalPrice,
  });

  @override
  State<PaymentSimulationScreen> createState() => _PaymentSimulationScreenState();
}

class _PaymentSimulationScreenState extends State<PaymentSimulationScreen> {
  bool _isProcessing = false;

  void _handleAction(String action) {
    setState(() => _isProcessing = true);

    Future.delayed(const Duration(milliseconds: 600), () {
      if (!mounted) return;
      setState(() => _isProcessing = false);

      if (action == 'success') {
        showDialog(
          context: context,
          barrierDismissible: false,
          builder: (ctx) => AlertDialog(
            title: const Row(
              children: [
                Icon(Icons.check_circle, color: AppTheme.success),
                SizedBox(width: 8),
                Text('Pembayaran Berhasil!'),
              ],
            ),
            content: const Text(
              'Tiket QR digital Anda telah diterbitkan dan tersimpan di Ticket Wallet.',
            ),
            actions: [
              ElevatedButton(
                onPressed: () {
                  Navigator.of(ctx).pop();
                  Navigator.of(context).pop();
                },
                child: const Text('Buka Tiket Saya'),
              ),
            ],
          ),
        );
      } else if (action == 'failed') {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: AppTheme.warning,
            content: Text('Simulasi Bayar Gagal. Anda dapat mencoba bayar kembali sebelum waktu habis.'),
          ),
        );
      } else if (action == 'cancel') {
        Navigator.of(context).pop();
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            backgroundColor: AppTheme.error,
            content: Text('Pesanan berhasil dibatalkan dan kuota telah dilepaskan.'),
          ),
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Simulasi Pembayaran'),
      ),
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(AppTheme.space5),
          child: Column(
            crossAxisAlignment: CrossAlignment.stretch,
            children: [
              // BR-PAY-001: Explicit simulation banner
              Container(
                padding: const EdgeInsets.all(AppTheme.space4),
                decoration: BoxDecoration(
                  color: AppTheme.warningLight,
                  borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                  border: Border.all(color: AppTheme.warning),
                ),
                child: const Row(
                  children: [
                    Icon(Icons.info_outline, color: AppTheme.warning),
                    SizedBox(width: AppTheme.space3),
                    Expanded(
                      child: Text(
                        'PERHATIAN: Ini adalah mode SIMULASI transaksi untuk keperluan demo produk, tanpa perpindahan uang nyata.',
                        style: TextStyle(
                          fontSize: 12,
                          color: Color(0xFF92400E),
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: AppTheme.space6),

              // Order Summary Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(AppTheme.space5),
                  child: Column(
                    crossAxisAlignment: CrossAlignment.start,
                    children: [
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          const Text(
                            'No. Pesanan',
                            style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                          ),
                          Text(
                            widget.orderNumber,
                            style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 13),
                          ),
                        ],
                      ),
                      const Divider(height: 24),
                      Text(
                        widget.eventTitle,
                        style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        'Kategori: ${widget.zoneName}',
                        style: const TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text('${widget.quantity}x Tiket'),
                          Text(
                            formatRupiah(widget.totalPrice),
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.primary600,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: AppTheme.space8),

              // Simulation Action Buttons
              const Text(
                'Pilih Hasil Simulasi:',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14),
              ),
              const SizedBox(height: AppTheme.space3),

              ElevatedButton.icon(
                onPressed: _isProcessing ? null : () => _handleAction('success'),
                icon: const Icon(Icons.check_circle_outline),
                label: const Text('Bayar Berhasil (Terbitkan Tiket)'),
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.success,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
              const SizedBox(height: AppTheme.space3),

              OutlinedButton.icon(
                onPressed: _isProcessing ? null : () => _handleAction('failed'),
                icon: const Icon(Icons.error_outline),
                label: const Text('Bayar Gagal (Coba Lagi)'),
                style: OutlinedButton.styleFrom(
                  foregroundColor: AppTheme.warning,
                  side: const BorderSide(color: AppTheme.warning),
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
              const SizedBox(height: AppTheme.space3),

              TextButton.icon(
                onPressed: _isProcessing ? null : () => _handleAction('cancel'),
                icon: const Icon(Icons.cancel_outlined),
                label: const Text('Batalkan Pesanan (Lepas Kuota)'),
                style: TextButton.styleFrom(
                  foregroundColor: AppTheme.error,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
