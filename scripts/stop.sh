#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}   Bus Sénégal - Stopping Services${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Stop Docker Compose
echo -e "${YELLOW}Stopping Docker Compose...${NC}"
docker-compose down

echo ""
echo -e "${GREEN}✓ All services stopped${NC}"
echo ""
echo -e "${YELLOW}Note: Data is preserved in Docker volumes.${NC}"
echo -e "${YELLOW}To remove data as well, use: ./scripts/reset.sh${NC}"
echo ""

