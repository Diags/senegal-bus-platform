#!/bin/bash

# ═══════════════════════════════════════════════════════════════════════════
# 🚀 Gestion de l'Application Bus Sénégal en Local
# ═══════════════════════════════════════════════════════════════════════════

set -e

# Couleurs
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

# Chemins
BACKEND_JAR="senegal-bus-backend/target/senegal-bus-backend-0.0.1-SNAPSHOT.jar"
FRONTEND_DIR="bus-senegal-frontend"
BACKEND_PID_FILE="/tmp/backend.pid"
FRONTEND_PID_FILE="/tmp/frontend.pid"
BACKEND_LOG="/tmp/backend.log"
FRONTEND_LOG="/tmp/frontend.log"

# Fonctions
print_success() { echo -e "${GREEN}✅ $1${NC}"; }
print_info() { echo -e "${BLUE}ℹ️  $1${NC}"; }
print_warning() { echo -e "${YELLOW}⚠️  $1${NC}"; }
print_error() { echo -e "${RED}❌ $1${NC}"; }

show_usage() {
    cat << EOF

🚀 Usage: ./local-app.sh [command]

Commands:
  start      Démarrer l'application complète
  stop       Arrêter l'application
  restart    Redémarrer l'application
  status     Voir le statut des services
  logs       Voir les logs en temps réel
  open       Ouvrir dans le navigateur
  test       Tester l'application

Examples:
  ./local-app.sh start
  ./local-app.sh status
  ./local-app.sh logs

EOF
}

check_postgres() {
    if ! docker ps | grep -q postgres; then
        print_error "PostgreSQL n'est pas en cours d'exécution"
        print_info "Démarrez PostgreSQL avec : docker start postgres"
        return 1
    fi
    print_success "PostgreSQL opérationnel"
    return 0
}

start_backend() {
    if [ -f "$BACKEND_PID_FILE" ] && kill -0 $(cat "$BACKEND_PID_FILE") 2>/dev/null; then
        print_warning "Backend déjà en cours (PID: $(cat $BACKEND_PID_FILE))"
        return 0
    fi

    if [ ! -f "$BACKEND_JAR" ]; then
        print_info "Compilation du backend..."
        cd senegal-bus-backend
        ./mvnw clean package -DskipTests -Dmaven.test.skip=true -q
        cd ..
        print_success "Backend compilé"
    fi

    print_info "Démarrage du backend..."
    java -jar "$BACKEND_JAR" \
      --spring.datasource.url=jdbc:postgresql://localhost:5432/bus_senegal_dev \
      --spring.datasource.username=bus_senegal_user \
      --spring.datasource.password=bus_senegal_pass \
      --spring.jpa.hibernate.ddl-auto=update \
      --server.port=8080 \
      --logging.level.root=INFO \
      > "$BACKEND_LOG" 2>&1 &
    
    echo $! > "$BACKEND_PID_FILE"
    print_success "Backend démarré (PID: $(cat $BACKEND_PID_FILE))"
    
    print_info "Attente du démarrage (20s)..."
    sleep 20
    
    if curl -s http://localhost:8080/api/actuator/health | grep -q "UP"; then
        print_success "Backend opérationnel sur http://localhost:8080/api"
    else
        print_warning "Backend encore en démarrage, vérifiez les logs"
    fi
}

start_frontend() {
    if [ -f "$FRONTEND_PID_FILE" ] && kill -0 $(cat "$FRONTEND_PID_FILE") 2>/dev/null; then
        print_warning "Frontend déjà en cours (PID: $(cat $FRONTEND_PID_FILE))"
        return 0
    fi

    if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
        print_info "Installation des dépendances frontend..."
        cd "$FRONTEND_DIR"
        npm install -q
        cd ..
        print_success "Dépendances installées"
    fi

    print_info "Démarrage du frontend..."
    cd "$FRONTEND_DIR"
    npm run dev > "$FRONTEND_LOG" 2>&1 &
    echo $! > "$FRONTEND_PID_FILE"
    cd ..
    
    print_success "Frontend démarré (PID: $(cat $FRONTEND_PID_FILE))"
    
    print_info "Attente du démarrage (15s)..."
    sleep 15
    
    if curl -s http://localhost:3000 | grep -q "Bus Sénégal"; then
        print_success "Frontend opérationnel sur http://localhost:3000"
    else
        print_warning "Frontend encore en démarrage, vérifiez les logs"
    fi
}

stop_backend() {
    if [ -f "$BACKEND_PID_FILE" ]; then
        PID=$(cat "$BACKEND_PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            print_info "Arrêt du backend (PID: $PID)..."
            kill "$PID"
            rm "$BACKEND_PID_FILE"
            print_success "Backend arrêté"
        else
            print_warning "Backend n'est pas en cours"
            rm "$BACKEND_PID_FILE"
        fi
    else
        print_warning "Aucun PID backend trouvé"
    fi
}

stop_frontend() {
    if [ -f "$FRONTEND_PID_FILE" ]; then
        PID=$(cat "$FRONTEND_PID_FILE")
        if kill -0 "$PID" 2>/dev/null; then
            print_info "Arrêt du frontend (PID: $PID)..."
            kill "$PID"
            rm "$FRONTEND_PID_FILE"
            print_success "Frontend arrêté"
        else
            print_warning "Frontend n'est pas en cours"
            rm "$FRONTEND_PID_FILE"
        fi
    else
        print_warning "Aucun PID frontend trouvé"
    fi
}

show_status() {
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  📊 STATUT DES SERVICES - BUS SÉNÉGAL"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""

    # PostgreSQL
    if docker ps | grep -q postgres; then
        print_success "PostgreSQL : Opérationnel (port 5432)"
    else
        print_error "PostgreSQL : Arrêté"
    fi

    # Backend
    if [ -f "$BACKEND_PID_FILE" ] && kill -0 $(cat "$BACKEND_PID_FILE") 2>/dev/null; then
        PID=$(cat "$BACKEND_PID_FILE")
        if curl -s http://localhost:8080/api/actuator/health | grep -q "UP"; then
            print_success "Backend : Opérationnel (PID: $PID, port 8080)"
        else
            print_warning "Backend : Démarrage en cours (PID: $PID)"
        fi
    else
        print_error "Backend : Arrêté"
    fi

    # Frontend
    if [ -f "$FRONTEND_PID_FILE" ] && kill -0 $(cat "$FRONTEND_PID_FILE") 2>/dev/null; then
        PID=$(cat "$FRONTEND_PID_FILE")
        if curl -s http://localhost:3000 > /dev/null 2>&1; then
            print_success "Frontend : Opérationnel (PID: $PID, port 3000)"
        else
            print_warning "Frontend : Démarrage en cours (PID: $PID)"
        fi
    else
        print_error "Frontend : Arrêté"
    fi

    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
}

show_logs() {
    echo ""
    print_info "Logs Backend et Frontend (Ctrl+C pour quitter)"
    echo ""
    tail -f "$BACKEND_LOG" "$FRONTEND_LOG"
}

open_app() {
    print_info "Ouverture de l'application..."
    open http://localhost:3000
    sleep 1
    open http://localhost:8080/api/swagger-ui.html
    print_success "Application ouverte dans le navigateur"
}

test_app() {
    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo "  🧪 TESTS DE L'APPLICATION"
    echo "═══════════════════════════════════════════════════════════════"
    echo ""

    # Test Backend Health
    print_info "Test 1/3 : Backend Health Check..."
    HEALTH=$(curl -s http://localhost:8080/api/actuator/health)
    if echo "$HEALTH" | grep -q "UP"; then
        print_success "Backend Health : OK"
    else
        print_error "Backend Health : FAILED"
        echo "$HEALTH"
    fi

    # Test Swagger
    print_info "Test 2/3 : Swagger UI..."
    if curl -s http://localhost:8080/api/swagger-ui.html | grep -q "swagger-ui"; then
        print_success "Swagger UI : OK"
    else
        print_error "Swagger UI : FAILED"
    fi

    # Test Frontend
    print_info "Test 3/3 : Frontend..."
    if curl -s http://localhost:3000 | grep -q "Bus Sénégal"; then
        print_success "Frontend : OK"
    else
        print_error "Frontend : FAILED"
    fi

    echo ""
    echo "═══════════════════════════════════════════════════════════════"
    echo ""
}

# Main
case "${1:-}" in
    start)
        print_info "Démarrage de l'application Bus Sénégal..."
        check_postgres || exit 1
        start_backend
        start_frontend
        echo ""
        show_status
        echo ""
        print_success "Application démarrée avec succès !"
        print_info "Frontend : http://localhost:3000"
        print_info "Swagger  : http://localhost:8080/api/swagger-ui.html"
        echo ""
        ;;
    stop)
        print_info "Arrêt de l'application..."
        stop_backend
        stop_frontend
        print_success "Application arrêtée"
        ;;
    restart)
        print_info "Redémarrage de l'application..."
        stop_backend
        stop_frontend
        sleep 2
        check_postgres || exit 1
        start_backend
        start_frontend
        show_status
        print_success "Application redémarrée"
        ;;
    status)
        show_status
        ;;
    logs)
        show_logs
        ;;
    open)
        open_app
        ;;
    test)
        test_app
        ;;
    *)
        show_usage
        exit 1
        ;;
esac

