INSERT INTO users (id, name, email, password_hash, role, is_active)
VALUES 
('a0000000-0000-0000-0000-000000000001', 'Super Admin', 'admin@eventpass.com', '$2b$10$YourHashedPasswordHereForDemo123', 'ADMIN', TRUE),
('b0000000-0000-0000-0000-000000000002', 'Staff Lapangan 1', 'staff1@eventpass.com', '$2b$10$YourHashedPasswordHereForDemo123', 'STAFF', TRUE),
('c0000000-0000-0000-0000-000000000003', 'Buyer Demo', 'buyer@eventpass.com', '$2b$10$YourHashedPasswordHereForDemo123', 'BUYER', TRUE);

INSERT INTO events (id, title, description, category, start_time, end_time, venue, address, city, status)
VALUES 
('e0000000-0000-0000-0000-000000000001', 'Konser Musik Nusantara 2026', 'Konser akbar menampilkan musisi papan atas Indonesia.', 'Musik', '2026-12-10 19:00:00+00', '2026-12-10 23:00:00+00', 'GBK Main Stadium', 'Jl. Pintu Satu Senayan', 'Jakarta Pusat', 'ACTIVE');

INSERT INTO ticket_zones (id, event_id, name, description, price, quota, sale_start_time, sale_end_time, is_active)
VALUES 
('z0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', 'Festival', 'Area berdiri dekat panggung utama', 150000, 50, '2026-11-01 00:00:00+00', '2026-12-09 23:59:59+00', TRUE),
('z0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000001', 'VIP', 'Area tribun dengan tempat duduk bernomor dan merchandise', 500000, 10, '2026-11-01 00:00:00+00', '2026-12-09 23:59:59+00', TRUE);
