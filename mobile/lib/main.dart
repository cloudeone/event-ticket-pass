import 'package:flutter/material.dart';
import 'config/theme.dart';

void main() {
  runApp(const EventTicketPassApp());
}

class EventTicketPassApp extends StatelessWidget {
  const EventTicketPassApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Event & Ticket Pass',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.lightTheme,
      home: const Scaffold(
        body: Center(
          child: Text(
            'Event & Ticket Pass\nMobile App',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
          ),
        ),
      ),
    );
  }
}

