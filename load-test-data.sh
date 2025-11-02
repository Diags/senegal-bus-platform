#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 📊 Charger les Données de Test - Bus Sénégal
# ═══════════════════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📊 CHARGEMENT DES DONNÉES DE TEST"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Vérifier PostgreSQL
if ! docker ps | grep -q postgres; then
    print_warning "PostgreSQL n'est pas en cours"
    print_info "Démarrez PostgreSQL avec : docker start postgres"
    exit 1
fi

print_success "PostgreSQL opérationnel"

# Charger le script SQL
print_info "Chargement du script data.sql..."

docker exec -i postgres psql -U bus_senegal_user -d bus_senegal_dev < senegal-bus-backend/src/main/resources/data.sql

if [ $? -eq 0 ]; then
    print_success "Données de test chargées avec succès !"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  ✅ DONNÉES CRÉÉES"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    print_info "👤 Admin : admin1 (admin@bus-senegal.sn)"
    print_info "🏢 5 Compagnies sénégalaises"
    print_info "🚌 12 Bus (capacités variées)"
    print_info "🗺️  10 Routes populaires"
    print_info "🎫 15 Trajets (3 prochains jours)"
    print_info "💺 ~700 Sièges disponibles"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🎯 TRAJETS DISPONIBLES"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    echo "  • Dakar → Saint-Louis (8000 FCFA, 4h30)"
    echo "  • Dakar → Touba (5000-6000 FCFA, 3h)"
    echo "  • Dakar → Thiès (3000 FCFA, 1h)"
    echo "  • Dakar → Mbour (4000 FCFA, 1h30)"
    echo "  • Dakar → Kaolack (6500 FCFA, 2h30)"
    echo "  • Dakar → Tambacounda (12000 FCFA, 8h)"
    echo "  • Dakar → Ziguinchor (15000 FCFA, 9h)"
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
    print_success "Testez maintenant : http://localhost:3000"
    print_info "Recherchez 'Dakar' → 'Saint-Louis' pour voir les résultats !"
    echo ""
else
    print_warning "Erreur lors du chargement des données"
    print_info "Vérifiez que la database bus_senegal_dev existe"
    echo ""
    print_info "Pour créer la database :"
    echo "  docker exec -it postgres psql -U keycloak"
    echo "  CREATE DATABASE bus_senegal_dev;"
    echo "  CREATE USER bus_senegal_user WITH PASSWORD 'bus_senegal_pass';"
    echo "  GRANT ALL PRIVILEGES ON DATABASE bus_senegal_dev TO bus_senegal_user;"
    exit 1
fi

