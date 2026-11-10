/// Model dan enum status untuk Event & Ticket Pass
/// Sinkron dengan shared/api-contract.ts

// ============================================
// ENUMS
// ============================================

enum UserRole { pembeli, petugas, admin }

enum EventStatus { draf, aktif, diarsipkan }

enum OrderStatus { menungguPembayaran, dibayar, dibatalkan, kedaluwarsa }

enum PaymentStatus { berhasil, gagal }

enum TicketStatus { aktif, dipakai }

enum CheckInResult { valid, sudahDipakai, tidakValid }

// ============================================
// EXTENSIONS
// ============================================

extension EventStatusExtension on EventStatus {
  String get label {
    switch (this) {
      case EventStatus.draf: return 'Draf';
      case EventStatus.aktif: return 'Aktif';
      case EventStatus.diarsipkan: return 'Diarsipkan';
    }
  }
  
  String get value {
    switch (this) {
      case EventStatus.draf: return 'DRAF';
      case EventStatus.aktif: return 'AKTIF';
      case EventStatus.diarsipkan: return 'DIARSIPKAN';
    }
  }
}

extension OrderStatusExtension on OrderStatus {
  String get label {
    switch (this) {
      case OrderStatus.menungguPembayaran: return 'Menunggu Pembayaran';
      case OrderStatus.dibayar: return 'Dibayar';
      case OrderStatus.dibatalkan: return 'Dibatalkan';
      case OrderStatus.kedaluwarsa: return 'Kedaluwarsa';
    }
  }
  
  String get value {
    switch (this) {
      case OrderStatus.menungguPembayaran: return 'MENUNGGU_PEMBAYARAN';
      case OrderStatus.dibayar: return 'DIBAYAR';
      case OrderStatus.dibatalkan: return 'DIBATALKAN';
      case OrderStatus.kedaluwarsa: return 'KEDALUWARSA';
    }
  }
}

extension TicketStatusExtension on TicketStatus {
  String get label {
    switch (this) {
      case TicketStatus.aktif: return 'Aktif';
      case TicketStatus.dipakai: return 'Sudah Dipakai';
    }
  }
  
  String get value {
    switch (this) {
      case TicketStatus.aktif: return 'AKTIF';
      case TicketStatus.dipakai: return 'DIPAKAI';
    }
  }
}

extension CheckInResultExtension on CheckInResult {
  String get label {
    switch (this) {
      case CheckInResult.valid: return 'Valid';
      case CheckInResult.sudahDipakai: return 'Sudah Dipakai';
      case CheckInResult.tidakValid: return 'Tidak Valid';
    }
  }
  
  String get value {
    switch (this) {
      case CheckInResult.valid: return 'VALID';
      case CheckInResult.sudahDipakai: return 'SUDAH_DIPAKAI';
      case CheckInResult.tidakValid: return 'TIDAK_VALID';
    }
  }
}

// ============================================
// MODELS
// ============================================

class User {
  final String id;
  final String name;
  final String email;
  final UserRole role;
  final bool isActive;
  final DateTime createdAt;

  User({
    required this.id,
    required this.name,
    required this.email,
    required this.role,
    required this.isActive,
    required this.createdAt,
  });

  factory User.fromJson(Map<String, dynamic> json) {
    return User(
      id: json['id'],
      name: json['name'],
      email: json['email'],
      role: UserRole.values.firstWhere(
        (r) => r.name == json['role'].toString().toLowerCase(),
        orElse: () => UserRole.pembeli,
      ),
      isActive: json['is_active'] ?? true,
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class Event {
  final String id;
  final String title;
  final String description;
  final String? category;
  final DateTime startDate;
  final DateTime endDate;
  final String venue;
  final String address;
  final String city;
  final EventStatus status;
  final List<TicketZone>? zones;
  final DateTime createdAt;

  Event({
    required this.id,
    required this.title,
    required this.description,
    this.category,
    required this.startDate,
    required this.endDate,
    required this.venue,
    required this.address,
    required this.city,
    required this.status,
    this.zones,
    required this.createdAt,
  });

  factory Event.fromJson(Map<String, dynamic> json) {
    return Event(
      id: json['id'],
      title: json['title'],
      description: json['description'] ?? '',
      category: json['category'],
      startDate: DateTime.parse(json['start_date']),
      endDate: DateTime.parse(json['end_date']),
      venue: json['venue'],
      address: json['address'],
      city: json['city'],
      status: EventStatus.values.firstWhere(
        (s) => s.value == json['status'],
        orElse: () => EventStatus.draf,
      ),
      zones: json['zones'] != null
          ? (json['zones'] as List).map((z) => TicketZone.fromJson(z)).toList()
          : null,
      createdAt: DateTime.parse(json['created_at']),
    );
  }
}

class TicketZone {
  final String id;
  final String eventId;
  final String name;
  final String? description;
  final int price;
  final int quota;
  final int sold;
  final int locked;
  final DateTime saleStart;
  final DateTime saleEnd;
  final bool isActive;

  TicketZone({
    required this.id,
    required this.eventId,
    required this.name,
    this.description,
    required this.price,
    required this.quota,
    this.sold = 0,
    this.locked = 0,
    required this.saleStart,
    required this.saleEnd,
    required this.isActive,
  });

  int get remaining => quota - sold - locked;

  String get saleStatus {
    final now = DateTime.now();
    if (!isActive) return 'Nonaktif';
    if (now.isBefore(saleStart)) return 'Belum Dibuka';
    if (now.isAfter(saleEnd)) return 'Penjualan Berakhir';
    if (remaining <= 0) return 'Habis';
    return 'Dijual';
  }

  factory TicketZone.fromJson(Map<String, dynamic> json) {
    return TicketZone(
      id: json['id'],
      eventId: json['event_id'],
      name: json['name'],
      description: json['description'],
      price: json['price'],
      quota: json['quota'],
      sold: json['sold'] ?? 0,
      locked: json['locked'] ?? 0,
      saleStart: DateTime.parse(json['sale_start']),
      saleEnd: DateTime.parse(json['sale_end']),
      isActive: json['is_active'] ?? true,
    );
  }
}

class Order {
  final String id;
  final String orderNumber;
  final String buyerId;
  final String eventId;
  final String zoneId;
  final int quantity;
  final int unitPrice;
  final int totalPrice;
  final OrderStatus status;
  final DateTime expiresAt;
  final DateTime createdAt;
  final Event? event;
  final TicketZone? zone;
  final List<Ticket>? tickets;

  Order({
    required this.id,
    required this.orderNumber,
    required this.buyerId,
    required this.eventId,
    required this.zoneId,
    required this.quantity,
    required this.unitPrice,
    required this.totalPrice,
    required this.status,
    required this.expiresAt,
    required this.createdAt,
    this.event,
    this.zone,
    this.tickets,
  });

  bool get isExpired => DateTime.now().isAfter(expiresAt);
  bool get canPay => status == OrderStatus.menungguPembayaran && !isExpired;
  bool get canCancel => status == OrderStatus.menungguPembayaran && !isExpired;

  factory Order.fromJson(Map<String, dynamic> json) {
    return Order(
      id: json['id'],
      orderNumber: json['order_number'],
      buyerId: json['buyer_id'],
      eventId: json['event_id'],
      zoneId: json['zone_id'],
      quantity: json['quantity'],
      unitPrice: json['unit_price'],
      totalPrice: json['total_price'],
      status: OrderStatus.values.firstWhere(
        (s) => s.value == json['status'],
        orElse: () => OrderStatus.menungguPembayaran,
      ),
      expiresAt: DateTime.parse(json['expires_at']),
      createdAt: DateTime.parse(json['created_at']),
      event: json['event'] != null ? Event.fromJson(json['event']) : null,
      zone: json['zone'] != null ? TicketZone.fromJson(json['zone']) : null,
      tickets: json['tickets'] != null
          ? (json['tickets'] as List).map((t) => Ticket.fromJson(t)).toList()
          : null,
    );
  }
}

class Ticket {
  final String id;
  final String orderId;
  final String eventId;
  final String zoneId;
  final String buyerId;
  final String ticketCode;
  final String qrToken;
  final TicketStatus status;
  final DateTime? checkedInAt;
  final String? checkedInBy;
  final DateTime createdAt;
  final Event? event;
  final TicketZone? zone;

  Ticket({
    required this.id,
    required this.orderId,
    required this.eventId,
    required this.zoneId,
    required this.buyerId,
    required this.ticketCode,
    required this.qrToken,
    required this.status,
    this.checkedInAt,
    this.checkedInBy,
    required this.createdAt,
    this.event,
    this.zone,
  });

  factory Ticket.fromJson(Map<String, dynamic> json) {
    return Ticket(
      id: json['id'],
      orderId: json['order_id'],
      eventId: json['event_id'],
      zoneId: json['zone_id'],
      buyerId: json['buyer_id'],
      ticketCode: json['ticket_code'],
      qrToken: json['qr_token'],
      status: TicketStatus.values.firstWhere(
        (s) => s.value == json['status'],
        orElse: () => TicketStatus.aktif,
      ),
      checkedInAt: json['checked_in_at'] != null
          ? DateTime.parse(json['checked_in_at'])
          : null,
      checkedInBy: json['checked_in_by'],
      createdAt: DateTime.parse(json['created_at']),
      event: json['event'] != null ? Event.fromJson(json['event']) : null,
      zone: json['zone'] != null ? TicketZone.fromJson(json['zone']) : null,
    );
  }
}

class CheckInResponse {
  final CheckInResult result;
  final String message;
  final Ticket? ticket;
  final DateTime? previousCheckIn;

  CheckInResponse({
    required this.result,
    required this.message,
    this.ticket,
    this.previousCheckIn,
  });

  factory CheckInResponse.fromJson(Map<String, dynamic> json) {
    return CheckInResponse(
      result: CheckInResult.values.firstWhere(
        (r) => r.value == json['result'],
        orElse: () => CheckInResult.tidakValid,
      ),
      message: json['message'],
      ticket: json['ticket'] != null ? Ticket.fromJson(json['ticket']) : null,
      previousCheckIn: json['previous_check_in'] != null
          ? DateTime.parse(json['previous_check_in'])
          : null,
    );
  }
}

class DashboardMetrics {
  final int totalRevenue;
  final int ticketsSold;
  final int ticketsLocked;
  final int totalCheckIns;
  final List<EventSummary> eventSummaries;

  DashboardMetrics({
    required this.totalRevenue,
    required this.ticketsSold,
    required this.ticketsLocked,
    required this.totalCheckIns,
    required this.eventSummaries,
  });

  factory DashboardMetrics.fromJson(Map<String, dynamic> json) {
    return DashboardMetrics(
      totalRevenue: json['total_revenue'],
      ticketsSold: json['tickets_sold'],
      ticketsLocked: json['tickets_locked'],
      totalCheckIns: json['total_check_ins'],
      eventSummaries: (json['event_summaries'] as List)
          .map((e) => EventSummary.fromJson(e))
          .toList(),
    );
  }
}

class EventSummary {
  final String eventId;
  final String eventTitle;
  final int totalQuota;
  final int sold;
  final int locked;
  final int revenue;
  final int checkIns;

  EventSummary({
    required this.eventId,
    required this.eventTitle,
    required this.totalQuota,
    required this.sold,
    required this.locked,
    required this.revenue,
    required this.checkIns,
  });

  factory EventSummary.fromJson(Map<String, dynamic> json) {
    return EventSummary(
      eventId: json['event_id'],
      eventTitle: json['event_title'],
      totalQuota: json['total_quota'],
      sold: json['sold'],
      locked: json['locked'],
      revenue: json['revenue'],
      checkIns: json['check_ins'],
    );
  }
}

