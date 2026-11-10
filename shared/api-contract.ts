/**
 * Event & Ticket Pass — Unified API Contract & TypeScript Types
 * Aligned with Database Schema (001_initial_schema.sql) & PRD v0.1
 */

// ============================================================================
// ENUMS & CONSTANTS
// ============================================================================

export type UserRole = 'buyer' | 'staff' | 'admin';

export type EventStatus = 'draft' | 'active' | 'archived';

export type OrderStatus = 'waiting_payment' | 'paid' | 'cancelled' | 'expired';

export type PaymentStatus = 'success' | 'failed';

export type TicketStatus = 'active' | 'used';

export type CheckInResult = 'VALID' | 'SUDAH_DIPAKAI' | 'TIDAK_VALID';

// Display Labels (Bahasa Indonesia)
export const USER_ROLE_LABELS: Record<UserRole, string> = {
  buyer: 'Pembeli',
  staff: 'Petugas Check-in',
  admin: 'Administrator',
};

export const EVENT_STATUS_LABELS: Record<EventStatus, string> = {
  draft: 'Draf',
  active: 'Aktif',
  archived: 'Diarsipkan',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  waiting_payment: 'Menunggu Pembayaran',
  paid: 'Dibayar',
  cancelled: 'Dibatalkan',
  expired: 'Kedaluwarsa',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  success: 'Berhasil',
  failed: 'Gagal',
};

export const TICKET_STATUS_LABELS: Record<TicketStatus, string> = {
  active: 'Aktif',
  used: 'Sudah Dipakai',
};

export const CHECKIN_RESULT_LABELS: Record<CheckInResult, string> = {
  VALID: 'Tiket Valid',
  SUDAH_DIPAKAI: 'Sudah Digunakan',
  TIDAK_VALID: 'Tidak Valid',
};

// ============================================================================
// ENTITIES
// ============================================================================

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface EventCategory {
  id: string;
  name: string;
  created_at: string;
}

export interface Event {
  id: string;
  title: string;
  description: string | null;
  category_id: string | null;
  category?: EventCategory | null;
  start_date: string; // ISO 8601 UTC
  end_date: string;   // ISO 8601 UTC
  venue: string;
  address: string;
  city: string;
  status: EventStatus;
  created_by: string;
  created_at: string;
  updated_at: string;
  zones?: TicketZone[];
}

export interface TicketZone {
  id: string;
  event_id: string;
  name: string;
  description: string | null;
  price: number; // in IDR
  quota: number;
  sold?: number;
  locked?: number;
  remaining?: number;
  sale_start: string; // ISO 8601 UTC
  sale_end: string;   // ISO 8601 UTC
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  buyer_id: string;
  event_id: string;
  ticket_zone_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: OrderStatus;
  expires_at: string;
  idempotency_key: string;
  created_at: string;
  updated_at: string;
  buyer?: Pick<User, 'id' | 'name' | 'email'>;
  event?: Pick<Event, 'id' | 'title' | 'start_date' | 'venue' | 'city'>;
  zone?: Pick<TicketZone, 'id' | 'name' | 'price'>;
  tickets?: Ticket[];
  payment_attempts?: PaymentAttempt[];
}

export interface PaymentAttempt {
  id: string;
  order_id: string;
  status: PaymentStatus;
  idempotency_key: string;
  created_at: string;
}

export interface Ticket {
  id: string;
  ticket_code: string;
  qr_token: string;
  order_id: string;
  event_id: string;
  ticket_zone_id: string;
  owner_id: string;
  status: TicketStatus;
  checked_in_at: string | null;
  checked_in_by: string | null;
  created_at: string;
  event?: Pick<Event, 'id' | 'title' | 'start_date' | 'venue' | 'city'>;
  zone?: Pick<TicketZone, 'id' | 'name'>;
}

// ============================================================================
// REQUEST / RESPONSE PAYLOADS
// ============================================================================

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  details?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

// Auth
export interface LoginRequest {
  email: string;
  password: string;
  platform?: 'web' | 'mobile';
}

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: UserRole;
  };
}

export interface RegisterBuyerRequest {
  name: string;
  email: string;
  password: string;
}

// Orders
export interface CreateOrderRequest {
  event_id: string;
  ticket_zone_id: string;
  quantity: number; // 1-12
  idempotency_key: string;
}

// Payment Simulation
export interface SimulatePaymentRequest {
  action: 'success' | 'failed' | 'cancel';
  idempotency_key: string;
}

// Check-in
export interface CheckInRequest {
  qr_token: string;
  event_id: string;
}

export interface CheckInResponseData {
  result: CheckInResult;
  message: string;
  ticket?: {
    id: string;
    ticket_code: string;
    status: TicketStatus;
    checked_in_at: string;
    zone_name: string;
    event_title: string;
    owner_name: string;
  };
  previous_check_in?: {
    checked_in_at: string;
    checked_in_by?: string;
  };
}

// Dashboard
export interface DashboardMetrics {
  total_revenue: number;
  tickets_sold: number;
  tickets_locked: number;
  total_check_ins: number;
  event_summaries: Array<{
    event_id: string;
    event_title: string;
    total_quota: number;
    sold: number;
    locked: number;
    revenue: number;
    check_ins: number;
  }>;
}
