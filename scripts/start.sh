#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Bus Sénégal - Starting Services${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  No .env file found. Creating from env.example...${NC}"
    if [ -f env.example ]; then
        cp env.example .env
        echo -e "${GREEN}✓ Created .env file. Please update it with your credentials.${NC}"
    else
        echo -e "${RED}✗ env.example not found. Please create a .env file manually.${NC}"
        exit 1
    fi
fi

# Make PostgreSQL init script executable
if [ -f postgres/init-multiple-databases.sh ]; then
    chmod +x postgres/init-multiple-databases.sh
    echo -e "${GREEN}✓ PostgreSQL init script is executable${NC}"
fi

# Start Docker Compose
echo -e "${BLUE}Starting Docker Compose...${NC}"
docker-compose up -d

# Wait for services to be healthy
echo ""
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
echo ""

# Wait for PostgreSQL
echo -e "${BLUE}Checking PostgreSQL...${NC}"
until docker-compose exec -T postgres pg_isready -U postgres > /dev/null 2>&1; do
    echo -e "${YELLOW}  Waiting for PostgreSQL...${NC}"
    sleep 2
done
echo -e "${GREEN}✓ PostgreSQL is ready${NC}"

# Wait for Keycloak
echo -e "${BLUE}Checking Keycloak...${NC}"
max_attempts=30
attempt=0
until curl -s http://localhost:8180/health/ready > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo -e "${RED}✗ Keycloak failed to start after ${max_attempts} attempts${NC}"
        echo -e "${YELLOW}  Check logs with: docker-compose logs keycloak${NC}"
        exit 1
    fi
    echo -e "${YELLOW}  Waiting for Keycloak... (attempt $attempt/$max_attempts)${NC}"
    sleep 5
done
echo -e "${GREEN}✓ Keycloak is ready${NC}"

# Wait for Backend
echo -e "${BLUE}Checking Backend...${NC}"
max_attempts=30
attempt=0
until curl -s http://localhost:8080/actuator/health > /dev/null 2>&1; do
    attempt=$((attempt + 1))
    if [ $attempt -ge $max_attempts ]; then
        echo -e "${RED}✗ Backend failed to start after ${max_attempts} attempts${NC}"
        echo -e "${YELLOW}  Check logs with: docker-compose logs backend${NC}"
        exit 1
    fi
    echo -e "${YELLOW}  Waiting for Backend... (attempt $attempt/$max_attempts)${NC}"
    sleep 5
done
echo -e "${GREEN}✓ Backend is ready${NC}"

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}   ✓ All services are running!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Access URLs:${NC}"
echo -e "  • Backend API:    ${GREEN}http://localhost:8080${NC}"
echo -e "  • Swagger UI:     ${GREEN}http://localhost:8080/swagger-ui.html${NC}"
echo -e "  • Keycloak Admin: ${GREEN}http://localhost:8180${NC}"
echo -e "  • PostgreSQL:     ${GREEN}localhost:5432${NC}"
echo ""
echo -e "${BLUE}Default Credentials:${NC}"
echo -e "  • Keycloak Admin: ${YELLOW}admin / admin${NC}"
echo -e "  • Test Client:    ${YELLOW}client@test.com / password123${NC}"
echo -e "  • Test Company:   ${YELLOW}compagnie@test.com / password123${NC}"
echo -e "  • Test Admin:     ${YELLOW}admin@test.com / admin123${NC}"
echo ""
echo -e "${BLUE}Useful Commands:${NC}"
echo -e "  • View logs:      ${YELLOW}./scripts/logs.sh${NC}"
echo -e "  • Stop services:  ${YELLOW}./scripts/stop.sh${NC}"
echo -e "  • Reset data:     ${YELLOW}./scripts/reset.sh${NC}"
echo ""

