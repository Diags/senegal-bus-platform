-- ═══════════════════════════════════════════════════════════════════════════
-- Script de Données de Test - Bus Sénégal
-- ═══════════════════════════════════════════════════════════════════════════
-- Ce script créé des données de test réalistes pour démonstration
-- Admin : admin1 / admin123
-- ═══════════════════════════════════════════════════════════════════════════

-- Nettoyer les données existantes (en ordre inverse des dépendances)
DELETE FROM payment WHERE id > 0;
DELETE FROM booking WHERE id > 0;
DELETE FROM seat WHERE id > 0;
DELETE FROM trip WHERE id > 0;
DELETE FROM bus WHERE id > 0;
DELETE FROM route WHERE id > 0;
DELETE FROM subscription WHERE id > 0;
DELETE FROM billing WHERE id > 0;
DELETE FROM notification WHERE id > 0;
DELETE FROM users WHERE id > 0;
DELETE FROM company WHERE id > 0;

-- Reset sequences
ALTER SEQUENCE IF EXISTS company_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS users_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS bus_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS route_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS trip_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS booking_seq RESTART WITH 1;
ALTER SEQUENCE IF EXISTS payment_seq RESTART WITH 1;

-- ═══════════════════════════════════════════════════════════════════════════
-- 1. ADMIN USER
-- ═══════════════════════════════════════════════════════════════════════════
INSERT INTO users (id, username, email, first_name, last_name, phone, role, enabled, created_at, updated_at)
VALUES (1, 'admin1', 'admin@bus-senegal.sn', 'Amadou', 'Diallo', '+221771234567', 'ADMIN', true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ═══════════════════════════════════════════════════════════════════════════
-- 2. COMPAGNIES DE BUS SÉNÉGALAISES
-- ═══════════════════════════════════════════════════════════════════════════

-- Ndiaga Ndiaye (La plus connue)
INSERT INTO company (id, name, phone, address, city, subscription_plan, subscription_status, subscription_start_date, subscription_end_date, created_at, updated_at)
VALUES (1, 'Ndiaga Ndiaye Transport', '+221338231234', 'Gare Routière Pompiers, Dakar', 'Dakar', 'PROFESSIONAL', 'ACTIVE', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Alham Transport
INSERT INTO company (id, name, phone, address, city, subscription_plan, subscription_status, subscription_start_date, subscription_end_date, created_at, updated_at)
VALUES (2, 'Alham Transport Express', '+221338234567', 'Gare Routière Colobane, Dakar', 'Dakar', 'PROFESSIONAL', 'ACTIVE', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar Dem Dikk (Transport urbain et interurbain)
INSERT INTO company (id, name, phone, address, city, subscription_plan, subscription_status, subscription_start_date, subscription_end_date, created_at, updated_at)
VALUES (3, 'Dakar Dem Dikk', '+221338225000', 'Avenue Malick Sy, Dakar', 'Dakar', 'ENTERPRISE', 'ACTIVE', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Senegal Dem Dikk
INSERT INTO company (id, name, phone, address, city, subscription_plan, subscription_status, subscription_start_date, subscription_end_date, created_at, updated_at)
VALUES (4, 'Sénégal Dem Dikk', '+221338221111', 'Rufisque, Dakar', 'Rufisque', 'STARTER', 'ACTIVE', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '350 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Mouride Transport (vers Touba)
INSERT INTO company (id, name, phone, address, city, subscription_plan, subscription_status, subscription_start_date, subscription_end_date, created_at, updated_at)
VALUES (5, 'Mouride Transport', '+221338229999', 'Gare Routière Colobane, Dakar', 'Dakar', 'PROFESSIONAL', 'ACTIVE', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '320 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ═══════════════════════════════════════════════════════════════════════════
-- 3. BUS POUR CHAQUE COMPAGNIE
-- ═══════════════════════════════════════════════════════════════════════════

-- Ndiaga Ndiaye - 3 bus
INSERT INTO bus (id, plate_number, capacity, bus_type, company_id, created_at, updated_at)
VALUES 
(1, 'DK-1234-AB', 45, 'STANDARD', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'DK-1235-AB', 55, 'VIP', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'DK-1236-AB', 30, 'MINIBUS', 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Alham - 2 bus
INSERT INTO bus (id, plate_number, capacity, bus_type, company_id, created_at, updated_at)
VALUES 
(4, 'DK-2345-CD', 50, 'STANDARD', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'DK-2346-CD', 40, 'VIP', 2, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar Dem Dikk - 3 bus
INSERT INTO bus (id, plate_number, capacity, bus_type, company_id, created_at, updated_at)
VALUES 
(6, 'DK-3456-EF', 60, 'STANDARD', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'DK-3457-EF', 45, 'VIP', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(8, 'DK-3458-EF', 50, 'STANDARD', 3, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Senegal Dem Dikk - 2 bus
INSERT INTO bus (id, plate_number, capacity, bus_type, company_id, created_at, updated_at)
VALUES 
(9, 'DK-4567-GH', 35, 'MINIBUS', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(10, 'DK-4568-GH', 45, 'STANDARD', 4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Mouride - 2 bus
INSERT INTO bus (id, plate_number, capacity, bus_type, company_id, created_at, updated_at)
VALUES 
(11, 'DK-5678-IJ', 50, 'STANDARD', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(12, 'DK-5679-IJ', 55, 'VIP', 5, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ═══════════════════════════════════════════════════════════════════════════
-- 4. ROUTES POPULAIRES AU SÉNÉGAL
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO route (id, origin, destination, duration_minutes, created_at, updated_at)
VALUES 
(1, 'Dakar', 'Saint-Louis', 270, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),      -- 4h30
(2, 'Dakar', 'Touba', 180, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),            -- 3h00
(3, 'Dakar', 'Thiès', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),             -- 1h00
(4, 'Dakar', 'Mbour', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),             -- 1h30
(5, 'Dakar', 'Kaolack', 150, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),          -- 2h30
(6, 'Saint-Louis', 'Richard-Toll', 90, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP), -- 1h30
(7, 'Dakar', 'Tambacounda', 480, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),      -- 8h00
(8, 'Dakar', 'Ziguinchor', 540, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),       -- 9h00
(9, 'Thiès', 'Saint-Louis', 210, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),      -- 3h30
(10, 'Kaolack', 'Tambacounda', 240, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);   -- 4h00

-- ═══════════════════════════════════════════════════════════════════════════
-- 5. TRAJETS POPULAIRES (15 trajets sur les 3 prochains jours)
-- ═══════════════════════════════════════════════════════════════════════════

-- DEMAIN
-- Dakar → Saint-Louis (matin)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (1, 1, 1, 
        (CURRENT_DATE + INTERVAL '1 day' + TIME '07:00:00'),
        (CURRENT_DATE + INTERVAL '1 day' + TIME '11:30:00'),
        8000, 'SCHEDULED', 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Saint-Louis (après-midi)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (2, 1, 2,
        (CURRENT_DATE + INTERVAL '1 day' + TIME '14:00:00'),
        (CURRENT_DATE + INTERVAL '1 day' + TIME '18:30:00'),
        9500, 'SCHEDULED', 55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Touba (matin - très demandé)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (3, 2, 11,
        (CURRENT_DATE + INTERVAL '1 day' + TIME '06:00:00'),
        (CURRENT_DATE + INTERVAL '1 day' + TIME '09:00:00'),
        5000, 'SCHEDULED', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Touba (midi)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (4, 2, 12,
        (CURRENT_DATE + INTERVAL '1 day' + TIME '12:00:00'),
        (CURRENT_DATE + INTERVAL '1 day' + TIME '15:00:00'),
        6000, 'SCHEDULED', 55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Thiès (matin)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (5, 3, 4,
        (CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00'),
        (CURRENT_DATE + INTERVAL '1 day' + TIME '09:00:00'),
        3000, 'SCHEDULED', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Mbour (matin)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (6, 4, 6,
        (CURRENT_DATE + INTERVAL '1 day' + TIME '07:30:00'),
        (CURRENT_DATE + INTERVAL '1 day' + TIME '09:00:00'),
        4000, 'SCHEDULED', 60, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Kaolack (matin)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (7, 5, 7,
        (CURRENT_DATE + INTERVAL '1 day' + TIME '08:00:00'),
        (CURRENT_DATE + INTERVAL '1 day' + TIME '10:30:00'),
        6500, 'SCHEDULED', 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- APRÈS-DEMAIN
-- Dakar → Saint-Louis (matin)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (8, 1, 1,
        (CURRENT_DATE + INTERVAL '2 days' + TIME '07:00:00'),
        (CURRENT_DATE + INTERVAL '2 days' + TIME '11:30:00'),
        8000, 'SCHEDULED', 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Touba (vendredi - grand rush)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (9, 2, 11,
        (CURRENT_DATE + INTERVAL '2 days' + TIME '05:00:00'),
        (CURRENT_DATE + INTERVAL '2 days' + TIME '08:00:00'),
        5500, 'SCHEDULED', 50, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Tambacounda (longue distance)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (10, 7, 2,
        (CURRENT_DATE + INTERVAL '2 days' + TIME '20:00:00'),
        (CURRENT_DATE + INTERVAL '3 days' + TIME '04:00:00'),
        12000, 'SCHEDULED', 55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Dakar → Ziguinchor (Casamance)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (11, 8, 5,
        (CURRENT_DATE + INTERVAL '2 days' + TIME '19:00:00'),
        (CURRENT_DATE + INTERVAL '3 days' + TIME '04:00:00'),
        15000, 'SCHEDULED', 40, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- DANS 3 JOURS
-- Dakar → Saint-Louis (matin)
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (12, 1, 2,
        (CURRENT_DATE + INTERVAL '3 days' + TIME '07:00:00'),
        (CURRENT_DATE + INTERVAL '3 days' + TIME '11:30:00'),
        8500, 'SCHEDULED', 55, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Saint-Louis → Richard-Toll
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (13, 6, 3,
        (CURRENT_DATE + INTERVAL '3 days' + TIME '10:00:00'),
        (CURRENT_DATE + INTERVAL '3 days' + TIME '11:30:00'),
        3500, 'SCHEDULED', 30, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Thiès → Saint-Louis
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (14, 9, 9,
        (CURRENT_DATE + INTERVAL '3 days' + TIME '08:00:00'),
        (CURRENT_DATE + INTERVAL '3 days' + TIME '11:30:00'),
        7000, 'SCHEDULED', 35, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Kaolack → Tambacounda
INSERT INTO trip (id, route_id, bus_id, departure_time, arrival_time, base_price, status, available_seats, created_at, updated_at)
VALUES (15, 10, 10,
        (CURRENT_DATE + INTERVAL '3 days' + TIME '09:00:00'),
        (CURRENT_DATE + INTERVAL '3 days' + TIME '13:00:00'),
        8000, 'SCHEDULED', 45, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ═══════════════════════════════════════════════════════════════════════════
-- 6. SIÈGES POUR CHAQUE BUS
-- ═══════════════════════════════════════════════════════════════════════════

-- Fonction pour générer les sièges
-- Note: Ceci est simplifié. En production, utiliser un script ou une procédure stockée

-- Bus 1 (45 places) - Trajet 1
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 1, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 45);

-- Bus 2 (55 places) - Trajet 2
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 2, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 55);

-- Bus 11 (50 places) - Trajet 3
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 3, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 50);

-- Bus 12 (55 places) - Trajet 4
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 4, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 55);

-- Bus 4 (50 places) - Trajet 5
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 5, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 50);

-- Bus 6 (60 places) - Trajet 6
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 6, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 60);

-- Bus 7 (45 places) - Trajet 7
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 7, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 45);

-- Bus 1 (45 places) - Trajet 8
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 8, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 45);

-- Bus 11 (50 places) - Trajet 9
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 9, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 50);

-- Bus 2 (55 places) - Trajet 10
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 10, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 55);

-- Bus 5 (40 places) - Trajet 11
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 11, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 40);

-- Bus 2 (55 places) - Trajet 12
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 12, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 55);

-- Bus 3 (30 places) - Trajet 13
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 13, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 30);

-- Bus 9 (35 places) - Trajet 14
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 14, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 35);

-- Bus 10 (45 places) - Trajet 15
INSERT INTO seat (trip_id, seat_number, status, created_at, updated_at)
SELECT 15, generate_series, 'AVAILABLE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP
FROM generate_series(1, 45);

-- ═══════════════════════════════════════════════════════════════════════════
-- 7. ABONNEMENTS POUR LES COMPAGNIES
-- ═══════════════════════════════════════════════════════════════════════════

INSERT INTO subscription (company_id, plan, status, start_date, end_date, created_at, updated_at)
VALUES 
(1, 'PROFESSIONAL', 'ACTIVE', CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE + INTERVAL '335 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'PROFESSIONAL', 'ACTIVE', CURRENT_DATE - INTERVAL '60 days', CURRENT_DATE + INTERVAL '305 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'ENTERPRISE', 'ACTIVE', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'STARTER', 'ACTIVE', CURRENT_DATE - INTERVAL '15 days', CURRENT_DATE + INTERVAL '350 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'PROFESSIONAL', 'ACTIVE', CURRENT_DATE - INTERVAL '45 days', CURRENT_DATE + INTERVAL '320 days', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- ═══════════════════════════════════════════════════════════════════════════
-- RÉSUMÉ DES DONNÉES CRÉÉES
-- ═══════════════════════════════════════════════════════════════════════════
-- ✅ 1 Admin user (admin1)
-- ✅ 5 Compagnies sénégalaises
-- ✅ 12 Bus (capacités variées)
-- ✅ 10 Routes populaires
-- ✅ 15 Trajets (3 prochains jours)
-- ✅ ~700 Sièges disponibles
-- ✅ 5 Abonnements actifs
--
-- LOGIN ADMIN :
--   Username : admin1
--   Email    : admin@bus-senegal.sn
--   Password : (à configurer via Keycloak ou directement)
--
-- TRAJETS POPULAIRES CRÉÉS :
--   • Dakar → Saint-Louis (8000 FCFA, 4h30)
--   • Dakar → Touba (5000-6000 FCFA, 3h)
--   • Dakar → Thiès (3000 FCFA, 1h)
--   • Dakar → Mbour (4000 FCFA, 1h30)
--   • Dakar → Kaolack (6500 FCFA, 2h30)
--   • Dakar → Tambacounda (12000 FCFA, 8h)
--   • Dakar → Ziguinchor (15000 FCFA, 9h)
--
-- ═══════════════════════════════════════════════════════════════════════════
-- Prêt pour les tests ! 🚀🇸🇳
-- ═══════════════════════════════════════════════════════════════════════════

