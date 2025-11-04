#!/bin/bash

echo "🚌 Chargement des données de démo complètes pour Bus Sénégal..."
echo ""

docker exec postgres psql -U keycloak -d bus_senegal_dev << 'EOF'

-- 1. RESET
DELETE FROM bookings;
UPDATE seats SET status = 'AVAILABLE';
DELETE FROM seats;
DELETE FROM trips;
DELETE FROM routes;
DELETE FROM buses;
DELETE FROM companies WHERE id > 5;
DELETE FROM users WHERE id > 1;

-- 2. COMPAGNIES ADDITIONNELLES (5 nouvelles)
INSERT INTO companies (id, name, contact_phone, contact_email, address, city, subscription_status, subdomain, created_at, updated_at) VALUES
(6, 'Teranga Express', '+221776789012', 'contact@teranga-express.sn', 'Dakar', 'Dakar', 'ACTIVE', 'teranga', NOW(), NOW()),
(7, 'Sahel Voyages', '+221777890123', 'info@sahel-voyages.sn', 'Saint-Louis', 'Saint-Louis', 'ACTIVE', 'sahel', NOW(), NOW()),
(8, 'Casamance Transport', '+221778901234', 'contact@casamance-transport.sn', 'Ziguinchor', 'Ziguinchor', 'ACTIVE', 'casamance', NOW(), NOW()),
(9, 'Thiès Express', '+221779012345', 'info@thies-express.sn', 'Thiès', 'Thiès', 'ACTIVE', 'thies', NOW(), NOW()),
(10, 'Baobab Lines', '+221770123456', 'contact@baobab-lines.sn', 'Dakar', 'Dakar', 'ACTIVE', 'baobab', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 3. BUS ADDITIONNELS (15 nouveaux bus)
INSERT INTO buses (id, company_id, plate_number, brand, model, total_seats, has_wifi, has_ac, has_toilet, status, created_at, updated_at) VALUES
(11, 1, 'DK-1234-A', 'Mercedes', 'Sprinter', 45, false, true, true, 'ACTIVE', NOW(), NOW()),
(12, 1, 'DK-1235-A', 'Volvo', 'B11R', 55, true, true, true, 'ACTIVE', NOW(), NOW()),
(13, 2, 'DK-2234-B', 'Hyundai', 'Universe', 50, true, true, true, 'ACTIVE', NOW(), NOW()),
(14, 2, 'DK-2235-B', 'Mercedes', 'Travego', 48, true, true, true, 'ACTIVE', NOW(), NOW()),
(15, 3, 'DK-3234-C', 'Isuzu', 'Giga', 42, false, true, false, 'ACTIVE', NOW(), NOW()),
(16, 4, 'RF-4234-D', 'Volvo', 'B9R', 52, true, true, true, 'ACTIVE', NOW(), NOW()),
(17, 5, 'DK-5234-E', 'MAN', 'Lion Coach', 50, true, true, true, 'ACTIVE', NOW(), NOW()),
(18, 6, 'DK-6234-F', 'Mercedes', 'Tourismo', 49, true, true, true, 'ACTIVE', NOW(), NOW()),
(19, 7, 'SL-7234-G', 'Scania', 'Touring', 51, true, true, true, 'ACTIVE', NOW(), NOW()),
(20, 8, 'ZG-8234-H', 'Volvo', 'B11R', 53, true, true, true, 'ACTIVE', NOW(), NOW()),
(21, 9, 'TH-9234-I', 'Hyundai', 'Universe', 48, false, true, true, 'ACTIVE', NOW(), NOW()),
(22, 10, 'DK-0234-J', 'Mercedes', 'Sprinter', 45, true, true, false, 'ACTIVE', NOW(), NOW()),
(23, 6, 'DK-6235-F', 'Volvo', 'B9R', 50, true, true, true, 'ACTIVE', NOW(), NOW()),
(24, 7, 'SL-7235-G', 'Isuzu', 'Giga', 42, false, true, true, 'ACTIVE', NOW(), NOW()),
(25, 8, 'ZG-8235-H', 'MAN', 'Lion Coach', 48, true, true, true, 'ACTIVE', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 4. ROUTES (7 existantes + 13 nouvelles = 20 total)
INSERT INTO routes (id, departure_city, arrival_city, distance_km, estimated_duration_minutes, created_at, updated_at) VALUES
-- Existantes
(1, 'Dakar', 'Saint-Louis', 270, 270, NOW(), NOW()),
(2, 'Dakar', 'Touba', 195, 180, NOW(), NOW()),
(3, 'Dakar', 'Thiès', 70, 60, NOW(), NOW()),
(4, 'Dakar', 'Mbour', 80, 90, NOW(), NOW()),
(5, 'Dakar', 'Kaolack', 195, 150, NOW(), NOW()),
(6, 'Dakar', 'Ziguinchor', 450, 540, NOW(), NOW()),
(7, 'Saint-Louis', 'Richard-Toll', 60, 90, NOW(), NOW()),
-- Nouvelles
(8, 'Dakar', 'Tambacounda', 450, 480, NOW(), NOW()),
(9, 'Saint-Louis', 'Louga', 90, 90, NOW(), NOW()),
(10, 'Thiès', 'Touba', 125, 120, NOW(), NOW()),
(11, 'Kaolack', 'Tambacounda', 255, 210, NOW(), NOW()),
(12, 'Ziguinchor', 'Kolda', 140, 150, NOW(), NOW()),
(13, 'Mbour', 'Fatick', 50, 60, NOW(), NOW()),
(14, 'Dakar', 'Louga', 200, 180, NOW(), NOW()),
(15, 'Touba', 'Kaolack', 100, 90, NOW(), NOW()),
(16, 'Saint-Louis', 'Dakar', 270, 270, NOW(), NOW()),
(17, 'Thiès', 'Kaolack', 125, 120, NOW(), NOW()),
(18, 'Mbour', 'Kaolack', 115, 120, NOW(), NOW()),
(19, 'Tambacounda', 'Kolda', 350, 300, NOW(), NOW()),
(20, 'Ziguinchor', 'Dakar', 450, 540, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 5. TRAJETS (50 trajets variés)
INSERT INTO trips (id, route_id, bus_id, departure_date_time, arrival_date_time, price, available_seats, status, created_at, updated_at) VALUES
-- Route 1: Dakar → Saint-Louis (5 trajets/jour)
(1, 1, 11, '2025-11-03 07:00:00', '2025-11-03 11:30:00', 8000, 45, 'SCHEDULED', NOW(), NOW()),
(2, 1, 12, '2025-11-03 14:00:00', '2025-11-03 18:30:00', 9500, 55, 'SCHEDULED', NOW(), NOW()),
(3, 1, 18, '2025-11-03 09:00:00', '2025-11-03 13:30:00', 8500, 49, 'SCHEDULED', NOW(), NOW()),
(4, 1, 23, '2025-11-03 16:00:00', '2025-11-03 20:30:00', 9000, 50, 'SCHEDULED', NOW(), NOW()),
(5, 1, 11, '2025-11-03 19:00:00', '2025-11-03 23:30:00', 9500, 45, 'SCHEDULED', NOW(), NOW()),

-- Route 2: Dakar → Touba (4 trajets)
(6, 2, 13, '2025-11-03 06:00:00', '2025-11-03 09:00:00', 5000, 50, 'SCHEDULED', NOW(), NOW()),
(7, 2, 17, '2025-11-03 10:00:00', '2025-11-03 13:00:00', 5500, 50, 'SCHEDULED', NOW(), NOW()),
(8, 2, 13, '2025-11-03 14:00:00', '2025-11-03 17:00:00', 5000, 50, 'SCHEDULED', NOW(), NOW()),
(9, 2, 17, '2025-11-03 18:00:00', '2025-11-03 21:00:00', 6000, 50, 'SCHEDULED', NOW(), NOW()),

-- Route 3: Dakar → Thiès (6 trajets)
(10, 3, 15, '2025-11-03 07:00:00', '2025-11-03 08:00:00', 3000, 42, 'SCHEDULED', NOW(), NOW()),
(11, 3, 21, '2025-11-03 09:00:00', '2025-11-03 10:00:00', 3000, 48, 'SCHEDULED', NOW(), NOW()),
(12, 3, 15, '2025-11-03 12:00:00', '2025-11-03 13:00:00', 3000, 42, 'SCHEDULED', NOW(), NOW()),
(13, 3, 21, '2025-11-03 15:00:00', '2025-11-03 16:00:00', 3000, 48, 'SCHEDULED', NOW(), NOW()),
(14, 3, 15, '2025-11-03 17:00:00', '2025-11-03 18:00:00', 3500, 42, 'SCHEDULED', NOW(), NOW()),
(15, 3, 21, '2025-11-03 19:00:00', '2025-11-03 20:00:00', 3500, 48, 'SCHEDULED', NOW(), NOW()),

-- Route 4: Dakar → Mbour (4 trajets)
(16, 4, 14, '2025-11-03 08:00:00', '2025-11-03 09:30:00', 4000, 48, 'SCHEDULED', NOW(), NOW()),
(17, 4, 22, '2025-11-03 11:00:00', '2025-11-03 12:30:00', 4000, 45, 'SCHEDULED', NOW(), NOW()),
(18, 4, 14, '2025-11-03 14:30:00', '2025-11-03 16:00:00', 4500, 48, 'SCHEDULED', NOW(), NOW()),
(19, 4, 22, '2025-11-03 17:30:00', '2025-11-03 19:00:00', 4500, 45, 'SCHEDULED', NOW(), NOW()),

-- Route 5: Dakar → Kaolack (5 trajets)
(20, 5, 16, '2025-11-03 06:30:00', '2025-11-03 09:00:00', 6500, 52, 'SCHEDULED', NOW(), NOW()),
(21, 5, 13, '2025-11-03 10:00:00', '2025-11-03 12:30:00', 6500, 50, 'SCHEDULED', NOW(), NOW()),
(22, 5, 16, '2025-11-03 13:00:00', '2025-11-03 15:30:00', 7000, 52, 'SCHEDULED', NOW(), NOW()),
(23, 5, 13, '2025-11-03 16:00:00', '2025-11-03 18:30:00', 7000, 50, 'SCHEDULED', NOW(), NOW()),
(24, 5, 16, '2025-11-03 19:00:00', '2025-11-03 21:30:00', 7500, 52, 'SCHEDULED', NOW(), NOW()),

-- Route 6: Dakar → Ziguinchor (3 trajets)
(25, 6, 20, '2025-11-03 07:00:00', '2025-11-03 16:00:00', 15000, 53, 'SCHEDULED', NOW(), NOW()),
(26, 6, 25, '2025-11-03 14:00:00', '2025-11-03 23:00:00', 15000, 48, 'SCHEDULED', NOW(), NOW()),
(27, 6, 20, '2025-11-03 21:00:00', '2025-11-04 06:00:00', 16000, 53, 'SCHEDULED', NOW(), NOW()),

-- Route 8: Dakar → Tambacounda (3 trajets)
(28, 8, 19, '2025-11-03 06:00:00', '2025-11-03 14:00:00', 12000, 51, 'SCHEDULED', NOW(), NOW()),
(29, 8, 24, '2025-11-03 13:00:00', '2025-11-03 21:00:00', 12000, 42, 'SCHEDULED', NOW(), NOW()),
(30, 8, 19, '2025-11-03 20:00:00', '2025-11-04 04:00:00', 13000, 51, 'SCHEDULED', NOW(), NOW()),

-- Route 10: Thiès → Touba (4 trajets)
(31, 10, 21, '2025-11-03 08:00:00', '2025-11-03 10:00:00', 4500, 48, 'SCHEDULED', NOW(), NOW()),
(32, 10, 15, '2025-11-03 12:00:00', '2025-11-03 14:00:00', 4500, 42, 'SCHEDULED', NOW(), NOW()),
(33, 10, 21, '2025-11-03 15:00:00', '2025-11-03 17:00:00', 5000, 48, 'SCHEDULED', NOW(), NOW()),
(34, 10, 15, '2025-11-03 18:00:00', '2025-11-03 20:00:00', 5000, 42, 'SCHEDULED', NOW(), NOW()),

-- Route 16: Saint-Louis → Dakar (Retour, 4 trajets)
(35, 16, 12, '2025-11-03 08:00:00', '2025-11-03 12:30:00', 8500, 55, 'SCHEDULED', NOW(), NOW()),
(36, 16, 19, '2025-11-03 11:00:00', '2025-11-03 15:30:00', 8500, 51, 'SCHEDULED', NOW(), NOW()),
(37, 16, 12, '2025-11-03 15:00:00', '2025-11-03 19:30:00', 9000, 55, 'SCHEDULED', NOW(), NOW()),
(38, 16, 19, '2025-11-03 18:00:00', '2025-11-03 22:30:00', 9000, 51, 'SCHEDULED', NOW(), NOW()),

-- Route 12: Ziguinchor → Kolda (3 trajets)
(39, 12, 20, '2025-11-03 07:00:00', '2025-11-03 09:30:00', 7000, 53, 'SCHEDULED', NOW(), NOW()),
(40, 12, 25, '2025-11-03 12:00:00', '2025-11-03 14:30:00', 7000, 48, 'SCHEDULED', NOW(), NOW()),
(41, 12, 20, '2025-11-03 17:00:00', '2025-11-03 19:30:00', 7500, 53, 'SCHEDULED', NOW(), NOW()),

-- Route 14: Dakar → Louga (4 trajets)
(42, 14, 22, '2025-11-03 07:00:00', '2025-11-03 10:00:00', 5500, 45, 'SCHEDULED', NOW(), NOW()),
(43, 14, 18, '2025-11-03 11:00:00', '2025-11-03 14:00:00', 5500, 49, 'SCHEDULED', NOW(), NOW()),
(44, 14, 22, '2025-11-03 15:00:00', '2025-11-03 18:00:00', 6000, 45, 'SCHEDULED', NOW(), NOW()),
(45, 14, 18, '2025-11-03 19:00:00', '2025-11-03 22:00:00', 6000, 49, 'SCHEDULED', NOW(), NOW()),

-- Route 13: Mbour → Fatick (3 trajets)
(46, 13, 14, '2025-11-03 09:00:00', '2025-11-03 10:00:00', 2500, 48, 'SCHEDULED', NOW(), NOW()),
(47, 13, 22, '2025-11-03 13:00:00', '2025-11-03 14:00:00', 2500, 45, 'SCHEDULED', NOW(), NOW()),
(48, 13, 14, '2025-11-03 17:00:00', '2025-11-03 18:00:00', 3000, 48, 'SCHEDULED', NOW(), NOW()),

-- Route 15: Touba → Kaolack (3 trajets)
(49, 15, 17, '2025-11-03 08:00:00', '2025-11-03 09:30:00', 4000, 50, 'SCHEDULED', NOW(), NOW()),
(50, 15, 13, '2025-11-03 14:00:00', '2025-11-03 15:30:00', 4000, 50, 'SCHEDULED', NOW(), NOW()),
(51, 15, 17, '2025-11-03 18:00:00', '2025-11-03 19:30:00', 4500, 50, 'SCHEDULED', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 6. USERS ADDITIONNELS
INSERT INTO users (id, email, first_name, last_name, phone_number, role, keycloak_id, created_at, updated_at) VALUES
(2, 'admin@bussenegal.sn', 'Admin', 'BusSN', '+221338888888', 'ADMIN', 'admin-keycloak-id', NOW(), NOW()),
(3, 'marie@example.com', 'Marie', 'Sow', '+221779999999', 'CLIENT', 'marie-keycloak-id', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- 7. CRÉER SIÈGES POUR TOUS LES TRIPS (45 sièges chacun)
DO $$
DECLARE
  trip_id_var INTEGER;
  seat_num INTEGER;
BEGIN
  FOR trip_id_var IN 1..51 LOOP
    FOR seat_num IN 1..45 LOOP
      INSERT INTO seats (trip_id, seat_number, seat_position, seat_row, status, created_at, updated_at)
      VALUES (
        trip_id_var,
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

-- STATISTIQUES
SELECT 'COMPAGNIES' as type, COUNT(*) as total FROM companies
UNION ALL
SELECT 'BUS', COUNT(*) FROM buses
UNION ALL
SELECT 'ROUTES', COUNT(*) FROM routes
UNION ALL
SELECT 'TRAJETS', COUNT(*) FROM trips
UNION ALL
SELECT 'SIÈGES', COUNT(*) FROM seats
UNION ALL
SELECT 'USERS', COUNT(*) FROM users;

EOF

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ DONNÉES DE DÉMO COMPLÈTES CHARGÉES !"
echo "═══════════════════════════════════════════════════════════"
echo ""
echo "📊 Base de données enrichie avec :"
echo "   • 10 compagnies sénégalaises"
echo "   • 25 bus (Mercedes, Volvo, Hyundai, etc.)"
echo "   • 20 routes à travers le Sénégal"
echo "   • 51 trajets quotidiens"
echo "   • 2295 sièges (45 par trajet)"
echo "   • 3 users (1 client, 1 admin, 1 client test)"
echo ""
echo "🎯 Prêt pour une démo complète !"
echo ""

