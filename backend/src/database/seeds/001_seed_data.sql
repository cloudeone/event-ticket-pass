-- ============================================================================
-- Seed:        001_seed_data.sql
-- Version:     1.0.0
-- Created:     2026-11-10
-- Description: Idempotent seed data for demo/development environment.
--              Creates admin user, event categories, sample events,
--              ticket zones, and test accounts.
-- Platform:    Supabase PostgreSQL (PG 13+)
-- Idempotent:  YES — safe to re-run without creating duplicates.
-- ============================================================================

BEGIN;

-- ==========================================================
-- 1. ADMIN USER
-- ==========================================================
-- Admin credentials (FR-AUTH-004):
--   Email:    admin@eventpass.com
--   Password: Admin123!  (bcrypt hash below)
--   Role:     admin
--
-- In production, admin credentials should come from environment
-- config (ADMIN_EMAIL, ADMIN_PASSWORD). This seed uses hardcoded
-- values for demo purposes only.
-- ==========================================================

INSERT INTO users (id, name, email, password_hash, role, is_active)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Admin Event Pass',
    'admin@eventpass.com',
    '$2a$10$rQXPJx5GhEqVGMr0bMG8/.8w7JiC5N0fW5wTl4zIIHxPz6k5T0OBi',
    'admin',
    true
)
ON CONFLICT (LOWER(email)) DO NOTHING;

-- ==========================================================
-- 2. TEST ACCOUNTS (buyer & staff)
-- ==========================================================
-- Buyer:  buyer@test.com  / Test1234!
-- Staff:  staff@test.com  / Test1234!
-- ==========================================================

INSERT INTO users (id, name, email, password_hash, role, is_active)
VALUES (
    'b0000000-0000-0000-0000-000000000001',
    'Test Buyer',
    'buyer@test.com',
    '$2a$10$rQXPJx5GhEqVGMr0bMG8/.8w7JiC5N0fW5wTl4zIIHxPz6k5T0OBi',
    'buyer',
    true
)
ON CONFLICT (LOWER(email)) DO NOTHING;

INSERT INTO users (id, name, email, password_hash, role, is_active)
VALUES (
    'b0000000-0000-0000-0000-000000000002',
    'Test Petugas',
    'staff@test.com',
    '$2a$10$rQXPJx5GhEqVGMr0bMG8/.8w7JiC5N0fW5wTl4zIIHxPz6k5T0OBi',
    'staff',
    true
)
ON CONFLICT (LOWER(email)) DO NOTHING;

-- ==========================================================
-- 3. EVENT CATEGORIES (8 categories)
-- ==========================================================
-- Fixed UUIDs for reproducibility.
-- ==========================================================

INSERT INTO event_categories (id, name) VALUES
    ('c0000000-0000-0000-0000-000000000001', 'Konser & Musik'),
    ('c0000000-0000-0000-0000-000000000002', 'Festival'),
    ('c0000000-0000-0000-0000-000000000003', 'Seminar & Workshop'),
    ('c0000000-0000-0000-0000-000000000004', 'Olahraga'),
    ('c0000000-0000-0000-0000-000000000005', 'Pameran & Expo'),
    ('c0000000-0000-0000-0000-000000000006', 'Teater & Seni'),
    ('c0000000-0000-0000-0000-000000000007', 'Teknologi'),
    ('c0000000-0000-0000-0000-000000000008', 'Komunitas')
ON CONFLICT (LOWER(name)) DO NOTHING;

-- ==========================================================
-- 4. SAMPLE EVENTS (3 events for demo)
-- ==========================================================
-- All events created_by the admin user.
-- Dates stored in UTC (input times are UTC+7, converted below).
--
-- UTC+7 → UTC conversion: subtract 7 hours
--   19:00 UTC+7 = 12:00 UTC
--   23:00 UTC+7 = 16:00 UTC
--   09:00 UTC+7 = 02:00 UTC
--   17:00 UTC+7 = 10:00 UTC
--   10:00 UTC+7 = 03:00 UTC
--   20:00 UTC+7 = 13:00 UTC
-- ==========================================================

-- Event 1: Konser Nusantara 2027 (active)
INSERT INTO events (id, title, description, category_id, start_date, end_date, venue, address, city, status, created_by)
VALUES (
    'e0000000-0000-0000-0000-000000000001',
    'Konser Nusantara 2027',
    'Festival musik terbesar tahun 2027 dengan menampilkan berbagai musisi Nusantara.',
    'c0000000-0000-0000-0000-000000000001',  -- Konser & Musik
    '2027-02-14 12:00:00+00',                -- 19:00 UTC+7
    '2027-02-14 16:00:00+00',                -- 23:00 UTC+7
    'Gelora Bung Karno',
    'Jl. Pintu Satu Senayan, Gelora, Tanah Abang, Jakarta Pusat',
    'Jakarta',
    'active',
    'a0000000-0000-0000-0000-000000000001'   -- Admin
)
ON CONFLICT (id) DO NOTHING;

-- Event 2: Tech Summit Indonesia (active)
INSERT INTO events (id, title, description, category_id, start_date, end_date, venue, address, city, status, created_by)
VALUES (
    'e0000000-0000-0000-0000-000000000002',
    'Tech Summit Indonesia',
    'Konferensi teknologi tahunan untuk developer, startup, dan pelaku industri digital.',
    'c0000000-0000-0000-0000-000000000007',  -- Teknologi
    '2027-03-20 02:00:00+00',                -- 09:00 UTC+7
    '2027-03-21 10:00:00+00',                -- 17:00 UTC+7
    'Jakarta Convention Center',
    'Jl. Gatot Subroto, Senayan, Tanah Abang, Jakarta Pusat',
    'Jakarta',
    'active',
    'a0000000-0000-0000-0000-000000000001'   -- Admin
)
ON CONFLICT (id) DO NOTHING;

-- Event 3: Pameran Seni Rupa Modern (draft)
INSERT INTO events (id, title, description, category_id, start_date, end_date, venue, address, city, status, created_by)
VALUES (
    'e0000000-0000-0000-0000-000000000003',
    'Pameran Seni Rupa Modern',
    'Pameran karya seni rupa modern dari seniman-seniman muda Indonesia.',
    'c0000000-0000-0000-0000-000000000005',  -- Pameran & Expo
    '2027-04-10 03:00:00+00',                -- 10:00 UTC+7
    '2027-04-12 13:00:00+00',                -- 20:00 UTC+7
    'Museum Nasional',
    'Jl. Medan Merdeka Barat No.12, Gambir, Jakarta Pusat',
    'Jakarta',
    'draft',
    'a0000000-0000-0000-0000-000000000001'   -- Admin
)
ON CONFLICT (id) DO NOTHING;

-- ==========================================================
-- 5. TICKET ZONES
-- ==========================================================
-- Prices in integer Rupiah. Sale period dates in UTC.
--
-- UTC+7 → UTC for sale periods:
--   00:00 UTC+7 (midnight) = 17:00 UTC (previous day)
--   18:00 UTC+7 = 11:00 UTC
--   23:59 UTC+7 = 16:59 UTC
--   08:00 UTC+7 = 01:00 UTC
--   09:00 UTC+7 = 02:00 UTC
-- ==========================================================

-- --- Konser Nusantara 2027: 3 zones ---

-- Reguler: Rp 150.000, quota 500
INSERT INTO ticket_zones (id, event_id, name, price, quota, sale_start, sale_end)
VALUES (
    'z0000000-0000-0000-0000-000000000001',
    'e0000000-0000-0000-0000-000000000001',
    'Reguler',
    150000,
    500,
    '2026-12-31 17:00:00+00',    -- 2027-01-01 00:00 UTC+7
    '2027-02-14 11:00:00+00'     -- 2027-02-14 18:00 UTC+7
)
ON CONFLICT ON CONSTRAINT uq_ticket_zones_event_name DO NOTHING;

-- VIP: Rp 500.000, quota 200
INSERT INTO ticket_zones (id, event_id, name, price, quota, sale_start, sale_end)
VALUES (
    'z0000000-0000-0000-0000-000000000002',
    'e0000000-0000-0000-0000-000000000001',
    'VIP',
    500000,
    200,
    '2026-12-31 17:00:00+00',    -- 2027-01-01 00:00 UTC+7
    '2027-02-14 11:00:00+00'     -- 2027-02-14 18:00 UTC+7
)
ON CONFLICT ON CONSTRAINT uq_ticket_zones_event_name DO NOTHING;

-- VVIP: Rp 1.000.000, quota 50
INSERT INTO ticket_zones (id, event_id, name, price, quota, sale_start, sale_end)
VALUES (
    'z0000000-0000-0000-0000-000000000003',
    'e0000000-0000-0000-0000-000000000001',
    'VVIP',
    1000000,
    50,
    '2026-12-31 17:00:00+00',    -- 2027-01-01 00:00 UTC+7
    '2027-02-10 16:59:00+00'     -- 2027-02-10 23:59 UTC+7
)
ON CONFLICT ON CONSTRAINT uq_ticket_zones_event_name DO NOTHING;

-- --- Tech Summit Indonesia: 2 zones ---

-- Early Bird: Rp 250.000, quota 300
INSERT INTO ticket_zones (id, event_id, name, price, quota, sale_start, sale_end)
VALUES (
    'z0000000-0000-0000-0000-000000000004',
    'e0000000-0000-0000-0000-000000000002',
    'Early Bird',
    250000,
    300,
    '2027-01-14 17:00:00+00',    -- 2027-01-15 00:00 UTC+7
    '2027-02-28 17:00:00+00'     -- 2027-03-01 00:00 UTC+7 (end of Feb 28)
)
ON CONFLICT ON CONSTRAINT uq_ticket_zones_event_name DO NOTHING;

-- Normal: Rp 400.000, quota 500
INSERT INTO ticket_zones (id, event_id, name, price, quota, sale_start, sale_end)
VALUES (
    'z0000000-0000-0000-0000-000000000005',
    'e0000000-0000-0000-0000-000000000002',
    'Normal',
    400000,
    500,
    '2027-02-28 17:00:00+00',    -- 2027-03-01 00:00 UTC+7
    '2027-03-20 01:00:00+00'     -- 2027-03-20 08:00 UTC+7
)
ON CONFLICT ON CONSTRAINT uq_ticket_zones_event_name DO NOTHING;

-- --- Pameran Seni Rupa Modern: 2 zones ---

-- Umum: Rp 75.000, quota 1000
INSERT INTO ticket_zones (id, event_id, name, price, quota, sale_start, sale_end)
VALUES (
    'z0000000-0000-0000-0000-000000000006',
    'e0000000-0000-0000-0000-000000000003',
    'Umum',
    75000,
    1000,
    '2027-02-28 17:00:00+00',    -- 2027-03-01 00:00 UTC+7
    '2027-04-10 02:00:00+00'     -- 2027-04-10 09:00 UTC+7
)
ON CONFLICT ON CONSTRAINT uq_ticket_zones_event_name DO NOTHING;

-- Pelajar: Rp 50.000, quota 500
INSERT INTO ticket_zones (id, event_id, name, price, quota, sale_start, sale_end)
VALUES (
    'z0000000-0000-0000-0000-000000000007',
    'e0000000-0000-0000-0000-000000000003',
    'Pelajar',
    50000,
    500,
    '2027-02-28 17:00:00+00',    -- 2027-03-01 00:00 UTC+7
    '2027-04-10 02:00:00+00'     -- 2027-04-10 09:00 UTC+7
)
ON CONFLICT ON CONSTRAINT uq_ticket_zones_event_name DO NOTHING;

-- ==========================================================
-- 6. VERIFICATION (optional: uncomment to check counts)
-- ==========================================================
-- SELECT 'users' AS tbl, COUNT(*) FROM users
-- UNION ALL SELECT 'event_categories', COUNT(*) FROM event_categories
-- UNION ALL SELECT 'events', COUNT(*) FROM events
-- UNION ALL SELECT 'ticket_zones', COUNT(*) FROM ticket_zones;

COMMIT;

-- ============================================================================
-- END OF SEED
-- ============================================================================
-- Test accounts summary:
--   Admin : admin@eventpass.com  / Admin123!  (role: admin)
--   Buyer : buyer@test.com      / Test1234!  (role: buyer)
--   Staff : staff@test.com      / Test1234!  (role: staff)
--
-- Sample data:
--   8 event categories
--   3 events (2 active, 1 draft)
--   7 ticket zones across 3 events
-- ============================================================================
