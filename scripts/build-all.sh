#!/bin/bash

# Build all components without deployment
# Useful for CI/CD pipelines

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Building all components...${NC}"
echo ""

# Build Mini App
echo -e "${BLUE}Building Mini App...${NC}"
npm install --production=false
npm run build
echo -e "${GREEN}✓ Mini App built${NC}"

# Build API Backend
echo -e "${BLUE}Building API Backend...${NC}"
cd api-backend
npm install --production=false
npm run build
cd ..
echo -e "${GREEN}✓ API Backend built${NC}"

# Build Bot Backend
echo -e "${BLUE}Building Bot Backend...${NC}"
cd bot-backend
npm install --production=false
npm run build
cd ..
echo -e "${GREEN}✓ Bot Backend built${NC}"

echo ""
echo -e "${GREEN}✅ All components built successfully${NC}"
