-- Données de démo complètes pour Bus Sénégal
-- À exécuter après le reset initial

-- USERS ADDITIONNELS
INSERT INTO users (email, first_name, last_name, phone_number, role, keycloak_id, created_at, updated_at) VALUES
('admin@bussenegal.sn', 'Admin', 'BusSN', '+221338888888', 'ADMIN', 'admin-key', NOW(), NOW()),
('marie@example.com', 'Marie', 'Sow', '+221779999999', 'CLIENT', 'marie-key', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- ROUTES ADDITIONNELLES  
INSERT INTO routes (departure_city, arrival_city, distance_km, estimated_duration_minutes, created_at, updated_at) VALUES
('Dakar', 'Tambacounda', 450, 480, NOW(), NOW()),
('Saint-Louis', 'Louga', 90, 90, NOW(), NOW()),
('Thiès', 'Touba', 125, 120, NOW(), NOW()),
('Kaolack', 'Tambacounda', 255, 210, NOW(), NOW()),
('Ziguinchor', 'Kolda', 140, 150, NOW(), NOW()),
('Mbour', 'Fatick', 50, 60, NOW(), NOW()),
('Dakar', 'Louga', 200, 180, NOW(), NOW()),
('Touba', 'Kaolack', 100, 90, NOW(), NOW()),
('Saint-Louis', 'Dakar', 270, 270, NOW(), NOW()),
('Thiès', 'Kaolack', 125, 120, NOW(), NOW())
ON CONFLICT DO NOTHING;

-- TRAJETS ADDITIONNELS (Dakar-Saint-Louis plus d'horaires)
INSERT INTO trips (route_id, bus_id, departure_date_time, arrival_date_time, price, available_seats, status, created_at, updated_at) VALUES
(1, 2, '2025-11-03 09:00:00', '2025-11-03 13:30:00', 8500, 55, 'SCHEDULED', NOW(), NOW()),
(1, 3, '2025-11-03 16:00:00', '2025-11-03 20:30:00', 9000, 50, 'SCHEDULED', NOW(), NOW()),
(1, 4, '2025-11-03 19:00:00', '2025-11-03 23:30:00', 9500, 48, 'SCHEDULED', NOW(), NOW()),
-- Dakar-Touba
(2, 5, '2025-11-03 10:00:00', '2025-11-03 13:00:00', 5500, 45, 'SCHEDULED', NOW(), NOW()),
(2, 6, '2025-11-03 14:00:00', '2025-11-03 17:00:00', 5000, 52, 'SCHEDULED', NOW(), NOW()),
-- Dakar-Thiès  
(3, 7, '2025-11-03 09:00:00', '2025-11-03 10:00:00', 3000, 50, 'SCHEDULED', NOW(), NOW()),
(3, 8, '2025-11-03 15:00:00', '2025-11-03 16:00:00', 3500, 49, 'SCHEDULED', NOW(), NOW()),
-- Dakar-Mbour
(4, 9, '2025-11-03 11:00:00', '2025-11-03 12:30:00', 4000, 51, 'SCHEDULED', NOW(), NOW()),
-- Dakar-Kaolack
(5, 10, '2025-11-03 10:00:00', '2025-11-03 12:30:00', 6500, 45, 'SCHEDULED', NOW(), NOW())
ON CONFLICT DO NOTHING;

-- Créer sièges pour tous les trips existants
DO $$
DECLARE
  trip_rec RECORD;
  seat_num INTEGER;
BEGIN
  FOR trip_rec IN SELECT id FROM trips LOOP
    FOR seat_num IN 1..45 LOOP
      INSERT INTO seats (trip_id, seat_number, seat_position, seat_row, status, created_at, updated_at)
      VALUES (
        trip_rec.id,
        'S' || LPAD(seat_num::text, 2, '0'),
        CASE WHEN seat_num % 4 IN (1, 2) THEN 'WINDOW' ELSE 'AISLE' END,
        ((seat_num - 1) / 4) + 1,
        'AVAILABLE',
        NOW(),
        NOW()
      )
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Stats finales
SELECT 'STATISTIQUES' as info;
SELECT COUNT(*) as compagnies FROM companies;
SELECT COUNT(*) as bus FROM buses;
SELECT COUNT(*) as routes FROM routes;
SELECT COUNT(*) as trajets FROM trips;
SELECT COUNT(*) as sieges FROM seats;
SELECT COUNT(*) as users FROM users;

