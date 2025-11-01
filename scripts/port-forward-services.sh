#!/bin/bash

set -e

echo "🌐 Setting up port-forwards for local development..."

# Port forward Backend
kubectl port-forward -n bus-senegal-prod svc/prod-bus-senegal-backend-svc 8080:8080 > /dev/null 2>&1 &
BACKEND_PID=$!
echo "✅ Backend: http://localhost:8080 (PID: $BACKEND_PID)"

# Port forward Frontend
kubectl port-forward -n bus-senegal-prod svc/prod-bus-senegal-frontend-svc 3000:3000 > /dev/null 2>&1 &
FRONTEND_PID=$!
echo "✅ Frontend: http://localhost:3000 (PID: $FRONTEND_PID)"

# Port forward Keycloak
kubectl port-forward -n bus-senegal-prod svc/prod-keycloak-svc 8180:8080 > /dev/null 2>&1 &
KEYCLOAK_PID=$!
echo "✅ Keycloak: http://localhost:8180 (PID: $KEYCLOAK_PID)"

# Port forward PostgreSQL
kubectl port-forward -n bus-senegal-prod svc/prod-postgres-svc 5432:5432 > /dev/null 2>&1 &
POSTGRES_PID=$!
echo "✅ PostgreSQL: localhost:5432 (PID: $POSTGRES_PID)"

echo ""
echo "📝 Port forwards active. Services accessible at:"
echo "   - Backend:    http://localhost:8080"
echo "   - Frontend:   http://localhost:3000"
echo "   - Keycloak:   http://localhost:8180"
echo "   - PostgreSQL: localhost:5432"
echo ""
echo "To stop all port-forwards:"
echo "   kill $BACKEND_PID $FRONTEND_PID $KEYCLOAK_PID $POSTGRES_PID"
echo ""
echo "Press Ctrl+C to stop all port-forwards..."

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID $KEYCLOAK_PID $POSTGRES_PID 2>/dev/null; echo 'Port-forwards stopped'; exit" INT
wait

