#!/bin/bash

# Colors for output
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Bus Sénégal - Service Logs${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Check if a service name was provided
if [ -z "$1" ]; then
    echo -e "${YELLOW}Usage: ./scripts/logs.sh [service]${NC}"
    echo ""
    echo -e "${BLUE}Available services:${NC}"
    echo "  • postgres"
    echo "  • keycloak"
    echo "  • backend"
    echo ""
    echo -e "${YELLOW}Example: ./scripts/logs.sh backend${NC}"
    echo -e "${YELLOW}Or view all logs: docker-compose logs -f${NC}"
    echo ""
    exit 0
fi

# Show logs for the specified service
docker-compose logs -f "$1"

