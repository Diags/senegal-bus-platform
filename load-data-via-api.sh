#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 📊 Charger les Données de Test via API - Bus Sénégal
# ═══════════════════════════════════════════════════════════════════════════

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }

API_URL="http://localhost:8080/api"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  📊 CRÉATION DES DONNÉES DE TEST VIA API"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Vérifier que le backend est accessible
if ! curl -s "$API_URL/actuator/health" | grep -q "UP"; then
    echo "❌ Backend n'est pas accessible sur $API_URL"
    exit 1
fi

print_success "Backend accessible"

# Créer les compagnies
print_info "Création des compagnies sénégalaises..."

# 1. Ndiaga Ndiaye
curl -s -X POST "$API_URL/companies" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ndiaga Ndiaye Transport",
    "contactPhone": "+221338231234",
    "contactEmail": "contact@ndiaga-ndiaye.sn",
    "address": "Gare Routière Pompiers, Dakar",
    "city": "Dakar",
    "subdomain": "ndiaga-ndiaye",
    "description": "La compagnie historique du Sénégal, reconnue pour sa fiabilité"
  }' > /dev/null

# 2. Alham Transport
curl -s -X POST "$API_URL/companies" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alham Transport Express",
    "contactPhone": "+221338234567",
    "contactEmail": "contact@alham.sn",
    "address": "Gare Routière Colobane, Dakar",
    "city": "Dakar",
    "subdomain": "alham",
    "description": "Service rapide et confortable vers toutes les régions"
  }' > /dev/null

# 3. Dakar Dem Dikk
curl -s -X POST "$API_URL/companies" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Dakar Dem Dikk",
    "contactPhone": "+221338225000",
    "contactEmail": "info@ddd.sn",
    "address": "Avenue Malick Sy, Dakar",
    "city": "Dakar",
    "subdomain": "ddd",
    "description": "Transport urbain et interurbain de qualité"
  }' > /dev/null

# 4. Senegal Dem Dikk
curl -s -X POST "$API_URL/companies" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Sénégal Dem Dikk",
    "contactPhone": "+221338221111",
    "contactEmail": "contact@sdd.sn",
    "address": "Rufisque",
    "city": "Rufisque",
    "subdomain": "sdd",
    "description": "Votre partenaire de voyage de confiance"
  }' > /dev/null

# 5. Mouride Transport
curl -s -X POST "$API_URL/companies" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Mouride Transport",
    "contactPhone": "+221338229999",
    "contactEmail": "info@mouride-transport.sn",
    "address": "Gare Routière Colobane, Dakar",
    "city": "Dakar",
    "subdomain": "mouride",
    "description": "Spécialiste des trajets vers Touba et le Nord"
  }' > /dev/null

print_success "5 compagnies créées"

echo ""
echo "═══════════════════════════════════════════════════════════════"
echo "  ✅ DONNÉES CRÉÉES"
echo "═══════════════════════════════════════════════════════════════"
echo ""
print_info "🏢 5 Compagnies sénégalaises créées :"
echo "   • Ndiaga Ndiaye Transport"
echo "   • Alham Transport Express"
echo "   • Dakar Dem Dikk"
echo "   • Sénégal Dem Dikk"
echo "   • Mouride Transport"
echo ""
print_success "Prêt à tester !"
print_info "Prochaine étape : Créer des bus et trajets via Swagger UI"
print_info "Ouvrez : http://localhost:8080/api/swagger-ui.html"
echo ""
print_info "Ou testez le frontend : http://localhost:3000"
echo ""

