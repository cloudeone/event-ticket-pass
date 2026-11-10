import 'package:flutter/material.dart';
import '../../config/theme.dart';
import '../../models/models.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _emailController = TextEditingController(text: 'buyer@test.com');
  final _passwordController = TextEditingController(text: 'Test1234!');
  String? _errorMessage;
  bool _isLoading = false;

  void _handleLogin() {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final email = _emailController.text.trim();
    final password = _passwordController.text.trim();

    Future.delayed(const Duration(milliseconds: 500), () {
      if (!mounted) return;
      setState(() => _isLoading = false);

      if (email == 'buyer@test.com' && password == 'Test1234!') {
        // Navigate to Buyer Mode
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login berhasil sebagai Pembeli')),
        );
      } else if (email == 'staff@test.com' && password == 'Test1234!') {
        // Navigate to Staff Mode
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Login berhasil sebagai Petugas')),
        );
      } else if (email.contains('admin')) {
        // BR-AUTH-004: Admin rejected on mobile
        setState(() {
          _errorMessage = 'Akun Admin hanya dapat digunakan di portal Web Admin.';
        });
      } else {
        // BR-AUTH-005: Generic error
        setState(() {
          _errorMessage = 'Email atau kata sandi tidak valid.';
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: const EdgeInsets.all(AppTheme.space6),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAlignment.stretch,
              children: [
                const Icon(
                  Icons.confirmation_number_outlined,
                  size: 64,
                  color: AppTheme.primary600,
                ),
                const SizedBox(height: AppTheme.space4),
                Text(
                  'Event & Ticket Pass',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                const SizedBox(height: AppTheme.space2),
                Text(
                  'Beli tiket & scan QR check-in dalam satu aplikasi',
                  textAlign: TextAlign.center,
                  style: Theme.of(context).textTheme.bodyMedium,
                ),
                const SizedBox(height: AppTheme.space8),

                if (_errorMessage != null) ...[
                  Container(
                    padding: const EdgeInsets.all(AppTheme.space3),
                    decoration: BoxDecoration(
                      color: AppTheme.errorLight,
                      borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                      border: Border.all(color: AppTheme.error),
                    ),
                    child: Text(
                      _errorMessage!,
                      style: const TextStyle(color: AppTheme.error, fontSize: 13),
                    ),
                  ),
                  const SizedBox(height: AppTheme.space4),
                ],

                TextField(
                  controller: _emailController,
                  decoration: const InputDecoration(
                    labelText: 'Email',
                    prefixIcon: Icon(Icons.email_outlined),
                  ),
                  keyboardType: TextInputType.emailAddress,
                ),
                const SizedBox(height: AppTheme.space4),

                TextField(
                  controller: _passwordController,
                  obscureText: true,
                  decoration: const InputDecoration(
                    labelText: 'Kata Sandi',
                    prefixIcon: Icon(Icons.lock_outlined),
                  ),
                ),
                const SizedBox(height: AppTheme.space6),

                ElevatedButton(
                  onPressed: _isLoading ? null : _handleLogin,
                  child: _isLoading
                      ? const SizedBox(
                          height: 20,
                          width: 20,
                          child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white),
                        )
                      : const Text('Masuk ke Aplikasi'),
                ),
                const SizedBox(height: AppTheme.space4),

                Container(
                  padding: const EdgeInsets.all(AppTheme.space3),
                  decoration: BoxDecoration(
                    color: AppTheme.primary50,
                    borderRadius: BorderRadius.circular(AppTheme.radiusMd),
                  ),
                  child: const Column(
                    children: [
                      Text(
                        'Akun Demo:',
                        style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                      ),
                      SizedBox(height: 4),
                      Text('Pembeli: buyer@test.com / Test1234!', style: TextStyle(fontSize: 11)),
                      Text('Petugas: staff@test.com / Test1234!', style: TextStyle(fontSize: 11)),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
