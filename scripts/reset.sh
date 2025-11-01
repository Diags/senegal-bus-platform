#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${RED}========================================${NC}"
echo -e "${RED}   Bus Sénégal - Reset All Data${NC}"
echo -e "${RED}========================================${NC}"
echo ""
echo -e "${YELLOW}⚠️  WARNING: This will delete all data!${NC}"
echo -e "${YELLOW}   - PostgreSQL databases${NC}"
echo -e "${YELLOW}   - Keycloak configuration${NC}"
echo -e "${YELLOW}   - All Docker volumes${NC}"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${BLUE}Reset cancelled.${NC}"
    exit 0
fi

echo ""
echo -e "${YELLOW}Stopping services...${NC}"
docker-compose down

echo -e "${YELLOW}Removing volumes...${NC}"
docker-compose down -v

echo -e "${YELLOW}Removing orphan containers...${NC}"
docker-compose down --remove-orphans

echo ""
echo -e "${GREEN}✓ All data has been reset${NC}"
echo ""
echo -e "${BLUE}To start fresh, run: ./scripts/start.sh${NC}"
echo ""

