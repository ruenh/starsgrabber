#!/bin/bash

# Stars Grabber Deployment Script
# This script builds and deploys all components

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Stars Grabber Deployment            ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if .env files exist
echo -e "${BLUE}🔍 Checking environment files...${NC}"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found in root directory${NC}"
    exit 1
fi
if [ ! -f "api-backend/.env" ]; then
    echo -e "${RED}❌ .env file not found in api-backend directory${NC}"
    exit 1
fi
if [ ! -f "bot-backend/.env" ]; then
    echo -e "${RED}❌ .env file not found in bot-backend directory${NC}"
    exit 1
fi
echo -e "${GREEN}✓ All environment files present${NC}"
echo ""

# Create log directories if they don't exist
mkdir -p api-backend/logs
mkdir -p bot-backend/logs

# Build Mini App
echo -e "${BLUE}📱 Building Mini App...${NC}"
npm install --production=false
npm run build
echo -e "${GREEN}✓ Mini App built successfully${NC}"
echo ""

# Build API Backend
echo -e "${BLUE}🔧 Building API Backend...${NC}"
cd api-backend
npm install --production=false
npm run build
cd ..
echo -e "${GREEN}✓ API Backend built successfully${NC}"
echo ""

# Build Bot Backend
echo -e "${BLUE}🤖 Building Bot Backend...${NC}"
cd bot-backend
npm install --production=false
npm run build
cd ..
echo -e "${GREEN}✓ Bot Backend built successfully${NC}"
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠ PM2 not found. Installing globally...${NC}"
    npm install -g pm2
fi

# Check if PM2 processes are running
if pm2 list | grep -q "stars-grabber"; then
    echo -e "${BLUE}🔄 Restarting PM2 processes...${NC}"
    pm2 restart ecosystem.config.cjs
    echo -e "${GREEN}✓ PM2 processes restarted${NC}"
else
    echo -e "${BLUE}🚀 Starting PM2 processes...${NC}"
    pm2 start ecosystem.config.cjs
    echo -e "${GREEN}✓ PM2 processes started${NC}"
fi
echo ""

# Save PM2 configuration
pm2 save

# Display status
echo -e "${BLUE}📊 Current PM2 Status:${NC}"
pm2 list
echo ""

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Deployment Completed! ✅             ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  • View logs: ${BLUE}pm2 logs${NC}"
echo -e "  • View status: ${BLUE}pm2 status${NC}"
echo -e "  • Restart all: ${BLUE}pm2 restart all${NC}"
echo -e "  • Stop all: ${BLUE}pm2 stop all${NC}"
echo ""
