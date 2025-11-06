#!/bin/bash

# Stars Grabber Setup Script
# This script helps with initial project setup

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}🌟 Stars Grabber Setup${NC}"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}⚠️  Node.js is not installed. Please install Node.js 20+ first.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $(node --version) detected${NC}"

# Setup Mini App
echo ""
echo -e "${BLUE}📱 Setting up Mini App...${NC}"
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Created .env file. Please configure it with your settings.${NC}"
fi
echo -e "${GREEN}✓ Mini App setup complete${NC}"

# Setup API Backend
echo ""
echo -e "${BLUE}🔧 Setting up API Backend...${NC}"
cd api-backend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Created api-backend/.env file. Please configure it with your settings.${NC}"
fi
cd ..
echo -e "${GREEN}✓ API Backend setup complete${NC}"

# Setup Bot Backend
echo ""
echo -e "${BLUE}🤖 Setting up Bot Backend...${NC}"
cd bot-backend
npm install
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Created bot-backend/.env file. Please configure it with your settings.${NC}"
fi
cd ..
echo -e "${GREEN}✓ Bot Backend setup complete${NC}"

# Make scripts executable
chmod +x deploy.sh

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Setup Supabase database (see supabase/README.md)"
echo "2. Configure environment variables in .env files"
echo "3. Start development servers:"
echo "   - Mini App: npm run dev"
echo "   - API Backend: cd api-backend && npm run dev"
echo "   - Bot Backend: cd bot-backend && npm run dev"
echo ""
echo "For deployment instructions, see DEPLOYMENT.md"
