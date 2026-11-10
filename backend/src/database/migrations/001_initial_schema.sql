-- ============================================================================
-- Migration: 001_initial_schema.sql
-- Version:   1.0.0
-- Created:   2026-11-10
-- Description: Initial database schema for Event & Ticket Pass application.
--              Creates all tables, enums, indexes, constraints, triggers,
--              and utility functions.
-- Platform:  Supabase PostgreSQL (PG 13+)
-- Note:      RLS is DISABLED on all tables. The backend uses service_role key
--            and manages authorization at the application layer.
-- ============================================================================

-- ==========================================================
-- 0. EXTENSIONS
-- ==========================================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================================
-- 1. ENUM TYPES (idempotent via DO blocks)
-- ==========================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('buyer', 'staff', 'admin');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'event_status') THEN
        CREATE TYPE event_status AS ENUM ('draft', 'active', 'archived');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
        CREATE TYPE order_status AS ENUM ('waiting_payment', 'paid', 'cancelled', 'expired');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('success', 'failed');
    END IF;
END
$$;

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'ticket_status') THEN
        CREATE TYPE ticket_status AS ENUM ('active', 'used');
    END IF;
END
$$;

-- ==========================================================
-- 2. TRIGGER FUNCTION: auto-update updated_at
-- ==========================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ==========================================================
-- 3. TABLES
-- ==========================================================

-- ----------------------------------------------------------
-- 3.1 users
-- ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100)    NOT NULL,
    email           VARCHAR(255)    NOT NULL,
    password_hash   VARCHAR(255)    NOT NULL,
    role            user_role       NOT NULL DEFAULT 'buyer',
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Name length: 2-100 characters
    CONSTRAINT chk_users_name_length
        CHECK (char_length(name) >= 2 AND char_length(name) <= 100),

    -- Basic email format validation (case-insensitive uniqueness handled by index)
    CONSTRAINT chk_users_email_format
        CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

COMMENT ON TABLE users IS
    'Application users: buyers who purchase tickets, staff who check in attendees, and admins who manage events.';

-- Case-insensitive unique email
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique
    ON users (LOWER(email));

-- Lookup by role
CREATE INDEX IF NOT EXISTS idx_users_role
    ON users (role);

-- Filter active users
CREATE INDEX IF NOT EXISTS idx_users_is_active
    ON users (is_active)
    WHERE is_active = true;

-- Trigger: updated_at
DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS disabled (backend manages auth via service_role)
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- 3.2 event_categories (reference data)
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS event_categories (
    id          UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100)    NOT NULL,
    created_at  TIMESTAMPTZ     NOT NULL DEFAULT NOW()
);

COMMENT ON TABLE event_categories IS
    'Reference table for event categories (e.g., Music, Sports, Conference). Managed by admins.';

CREATE UNIQUE INDEX IF NOT EXISTS idx_event_categories_name_unique
    ON event_categories (LOWER(name));

ALTER TABLE event_categories DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- 3.3 events
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS events (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    title           VARCHAR(150)    NOT NULL,
    description     TEXT,
    category_id     UUID,
    start_date      TIMESTAMPTZ     NOT NULL,
    end_date        TIMESTAMPTZ     NOT NULL,
    venue           VARCHAR(255)    NOT NULL,
    address         TEXT            NOT NULL,
    city            VARCHAR(100)    NOT NULL,
    status          event_status    NOT NULL DEFAULT 'draft',
    created_by      UUID            NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- end_date must be after start_date
    CONSTRAINT chk_events_end_after_start
        CHECK (end_date > start_date),

    -- Foreign keys
    CONSTRAINT fk_events_category
        FOREIGN KEY (category_id) REFERENCES event_categories(id)
        ON DELETE SET NULL,

    CONSTRAINT fk_events_created_by
        FOREIGN KEY (created_by) REFERENCES users(id)
        ON DELETE RESTRICT
);

COMMENT ON TABLE events IS
    'Events created by admins. Lifecycle: draft → active ↔ archived. Contains venue and schedule info.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_events_category_id
    ON events (category_id);

CREATE INDEX IF NOT EXISTS idx_events_created_by
    ON events (created_by);

CREATE INDEX IF NOT EXISTS idx_events_status
    ON events (status);

-- Compound index for listing active events by date
CREATE INDEX IF NOT EXISTS idx_events_status_start_date
    ON events (status, start_date);

-- City-based search
CREATE INDEX IF NOT EXISTS idx_events_city
    ON events (LOWER(city));

-- Trigger: updated_at
DROP TRIGGER IF EXISTS trg_events_updated_at ON events;
CREATE TRIGGER trg_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE events DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- 3.4 ticket_zones
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS ticket_zones (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id        UUID            NOT NULL,
    name            VARCHAR(100)    NOT NULL,
    description     TEXT,
    price           INTEGER         NOT NULL,
    quota           INTEGER         NOT NULL,
    sale_start      TIMESTAMPTZ     NOT NULL,
    sale_end        TIMESTAMPTZ     NOT NULL,
    is_active       BOOLEAN         NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Price must be positive (in Rupiah)
    CONSTRAINT chk_ticket_zones_price_positive
        CHECK (price > 0),

    -- Quota must be at least 1
    CONSTRAINT chk_ticket_zones_quota_min
        CHECK (quota >= 1),

    -- sale_end must be after sale_start
    CONSTRAINT chk_ticket_zones_sale_end_after_start
        CHECK (sale_end > sale_start),

    -- Unique zone name per event
    CONSTRAINT uq_ticket_zones_event_name
        UNIQUE (event_id, name),

    -- Foreign key
    CONSTRAINT fk_ticket_zones_event
        FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE CASCADE
);

COMMENT ON TABLE ticket_zones IS
    'Ticket pricing zones for events (e.g., VIP, Regular). Each zone has its own price, quota, and sale window.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ticket_zones_event_id
    ON ticket_zones (event_id);

CREATE INDEX IF NOT EXISTS idx_ticket_zones_is_active
    ON ticket_zones (is_active)
    WHERE is_active = true;

-- Compound: find zones currently on sale
CREATE INDEX IF NOT EXISTS idx_ticket_zones_sale_window
    ON ticket_zones (event_id, sale_start, sale_end)
    WHERE is_active = true;

-- Trigger: updated_at
DROP TRIGGER IF EXISTS trg_ticket_zones_updated_at ON ticket_zones;
CREATE TRIGGER trg_ticket_zones_updated_at
    BEFORE UPDATE ON ticket_zones
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE ticket_zones DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- 3.5 orders
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS orders (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number    VARCHAR(50)     NOT NULL,
    buyer_id        UUID            NOT NULL,
    event_id        UUID            NOT NULL,
    ticket_zone_id  UUID            NOT NULL,
    quantity        INTEGER         NOT NULL,
    unit_price      INTEGER         NOT NULL,
    total_price     INTEGER         NOT NULL,
    status          order_status    NOT NULL DEFAULT 'waiting_payment',
    expires_at      TIMESTAMPTZ     NOT NULL,
    idempotency_key VARCHAR(255)    NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Quantity must be between 1 and 12
    CONSTRAINT chk_orders_quantity_range
        CHECK (quantity >= 1 AND quantity <= 12),

    -- Unit price must be positive
    CONSTRAINT chk_orders_unit_price_positive
        CHECK (unit_price > 0),

    -- Total must equal unit_price * quantity
    CONSTRAINT chk_orders_total_price_calc
        CHECK (total_price = unit_price * quantity),

    -- Unique order number
    CONSTRAINT uq_orders_order_number
        UNIQUE (order_number),

    -- Idempotency
    CONSTRAINT uq_orders_idempotency_key
        UNIQUE (idempotency_key),

    -- Foreign keys
    CONSTRAINT fk_orders_buyer
        FOREIGN KEY (buyer_id) REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_orders_event
        FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_orders_ticket_zone
        FOREIGN KEY (ticket_zone_id) REFERENCES ticket_zones(id)
        ON DELETE RESTRICT
);

COMMENT ON TABLE orders IS
    'Purchase orders for tickets. Status flow: waiting_payment → paid|cancelled|expired (all terminal). '
    'Expires 10 minutes after creation. Prices are snapshot at order time.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_orders_buyer_id
    ON orders (buyer_id);

CREATE INDEX IF NOT EXISTS idx_orders_event_id
    ON orders (event_id);

CREATE INDEX IF NOT EXISTS idx_orders_ticket_zone_id
    ON orders (ticket_zone_id);

CREATE INDEX IF NOT EXISTS idx_orders_status
    ON orders (status);

-- Find pending orders that are still holding quota
CREATE INDEX IF NOT EXISTS idx_orders_pending_quota
    ON orders (ticket_zone_id, status, expires_at)
    WHERE status = 'waiting_payment';

-- Buyer order history
CREATE INDEX IF NOT EXISTS idx_orders_buyer_status
    ON orders (buyer_id, status, created_at DESC);

-- Trigger: updated_at
DROP TRIGGER IF EXISTS trg_orders_updated_at ON orders;
CREATE TRIGGER trg_orders_updated_at
    BEFORE UPDATE ON orders
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE orders DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- 3.6 payments
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS payments (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id        UUID            NOT NULL,
    status          payment_status  NOT NULL,
    idempotency_key VARCHAR(255)    NOT NULL,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Idempotency
    CONSTRAINT uq_payments_idempotency_key
        UNIQUE (idempotency_key),

    -- Foreign key
    CONSTRAINT fk_payments_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT
);

COMMENT ON TABLE payments IS
    'Payment records for orders. Only ONE successful payment allowed per order (enforced by partial unique index).';

-- Partial unique index: only one successful payment per order
CREATE UNIQUE INDEX IF NOT EXISTS idx_payments_one_success_per_order
    ON payments (order_id)
    WHERE status = 'success';

-- Lookup by order
CREATE INDEX IF NOT EXISTS idx_payments_order_id
    ON payments (order_id);

ALTER TABLE payments DISABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------
-- 3.7 tickets
-- ----------------------------------------------------------

CREATE TABLE IF NOT EXISTS tickets (
    id              UUID            PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code     VARCHAR(50)     NOT NULL,
    qr_token        VARCHAR(255)    NOT NULL,
    order_id        UUID            NOT NULL,
    event_id        UUID            NOT NULL,
    ticket_zone_id  UUID            NOT NULL,
    owner_id        UUID            NOT NULL,
    status          ticket_status   NOT NULL DEFAULT 'active',
    checked_in_at   TIMESTAMPTZ,
    checked_in_by   UUID,
    created_at      TIMESTAMPTZ     NOT NULL DEFAULT NOW(),

    -- Unique ticket code
    CONSTRAINT uq_tickets_ticket_code
        UNIQUE (ticket_code),

    -- Unique QR token (unpredictable)
    CONSTRAINT uq_tickets_qr_token
        UNIQUE (qr_token),

    -- Foreign keys
    CONSTRAINT fk_tickets_order
        FOREIGN KEY (order_id) REFERENCES orders(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_tickets_event
        FOREIGN KEY (event_id) REFERENCES events(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_tickets_ticket_zone
        FOREIGN KEY (ticket_zone_id) REFERENCES ticket_zones(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_tickets_owner
        FOREIGN KEY (owner_id) REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT fk_tickets_checked_in_by
        FOREIGN KEY (checked_in_by) REFERENCES users(id)
        ON DELETE SET NULL
);

COMMENT ON TABLE tickets IS
    'Individual tickets generated after payment. Status flow: active → used (terminal). '
    'Each ticket has a unique code and an unpredictable QR token for check-in.';

-- Indexes
CREATE INDEX IF NOT EXISTS idx_tickets_order_id
    ON tickets (order_id);

CREATE INDEX IF NOT EXISTS idx_tickets_event_id
    ON tickets (event_id);

CREATE INDEX IF NOT EXISTS idx_tickets_ticket_zone_id
    ON tickets (ticket_zone_id);

CREATE INDEX IF NOT EXISTS idx_tickets_owner_id
    ON tickets (owner_id);

CREATE INDEX IF NOT EXISTS idx_tickets_status
    ON tickets (status);

-- QR token lookup for check-in (already has unique index, but explicit for clarity)
CREATE INDEX IF NOT EXISTS idx_tickets_qr_token
    ON tickets (qr_token);

-- Compound: active tickets for an event (for check-in queries)
CREATE INDEX IF NOT EXISTS idx_tickets_event_active
    ON tickets (event_id, status)
    WHERE status = 'active';

-- Owner's tickets for a specific event
CREATE INDEX IF NOT EXISTS idx_tickets_owner_event
    ON tickets (owner_id, event_id);

ALTER TABLE tickets DISABLE ROW LEVEL SECURITY;

-- ==========================================================
-- 4. UTILITY FUNCTIONS
-- ==========================================================

-- ----------------------------------------------------------
-- 4.1 check_quota_availability
--
-- Atomically checks whether a ticket zone has enough remaining
-- quota to fulfill a requested quantity. Considers:
--   - Total zone quota
--   - Tickets already issued (from paid orders)
--   - Pending orders that have NOT yet expired (waiting_payment
--     with expires_at > NOW())
--
-- Uses FOR UPDATE on ticket_zones to lock the row and prevent
-- concurrent overselling.
--
-- Returns the remaining available quota (after deducting sold
-- and reserved). Raises an exception if insufficient.
-- ----------------------------------------------------------

CREATE OR REPLACE FUNCTION check_quota_availability(
    p_zone_id   UUID,
    p_quantity   INTEGER
)
RETURNS INTEGER AS $$
DECLARE
    v_total_quota   INTEGER;
    v_sold_count    INTEGER;
    v_pending_count INTEGER;
    v_available     INTEGER;
BEGIN
    -- Lock the ticket zone row to prevent concurrent modifications
    SELECT quota INTO v_total_quota
    FROM ticket_zones
    WHERE id = p_zone_id
    FOR UPDATE;

    IF v_total_quota IS NULL THEN
        RAISE EXCEPTION 'Ticket zone % not found', p_zone_id;
    END IF;

    -- Count tickets from paid orders (permanently sold)
    SELECT COALESCE(SUM(o.quantity), 0) INTO v_sold_count
    FROM orders o
    WHERE o.ticket_zone_id = p_zone_id
      AND o.status = 'paid';

    -- Count quantities from pending orders that haven't expired yet
    -- (lazy expiration: we check expires_at instead of relying on
    -- a background job to flip status)
    SELECT COALESCE(SUM(o.quantity), 0) INTO v_pending_count
    FROM orders o
    WHERE o.ticket_zone_id = p_zone_id
      AND o.status = 'waiting_payment'
      AND o.expires_at > NOW();

    -- Calculate available quota
    v_available := v_total_quota - v_sold_count - v_pending_count;

    IF v_available < p_quantity THEN
        RAISE EXCEPTION 'Insufficient quota for zone %. Requested: %, Available: %',
            p_zone_id, p_quantity, v_available;
    END IF;

    RETURN v_available;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION check_quota_availability(UUID, INTEGER) IS
    'Atomically checks and locks ticket zone quota. Returns available quantity or raises exception if insufficient. '
    'Considers paid orders (sold) and non-expired waiting_payment orders (reserved).';

-- ==========================================================
-- 5. END OF MIGRATION
-- ==========================================================
-- Migration 001_initial_schema.sql complete.
-- All tables created with RLS disabled.
-- Backend service_role key manages all access control.
-- ==========================================================
