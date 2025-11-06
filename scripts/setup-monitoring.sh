#!/bin/bash

# PM2 Monitoring Setup Script
# Configures PM2 monitoring and log rotation

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   PM2 Monitoring Setup                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}⚠ PM2 not found. Installing...${NC}"
    npm install -g pm2
fi

# Install PM2 log rotate module
echo -e "${BLUE}📦 Installing PM2 log rotate module...${NC}"
pm2 install pm2-logrotate

# Configure log rotation
echo -e "${BLUE}⚙️  Configuring log rotation...${NC}"
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
pm2 set pm2-logrotate:compress true
pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
pm2 set pm2-logrotate:rotateModule true
echo -e "${GREEN}✓ Log rotation configured${NC}"
echo ""

# Setup PM2 startup script
echo -e "${BLUE}🚀 Setting up PM2 startup script...${NC}"
pm2 startup | tail -n 1 | bash || true
echo -e "${GREEN}✓ PM2 startup configured${NC}"
echo ""

# Display PM2 monitoring info
echo -e "${BLUE}📊 PM2 Monitoring Commands:${NC}"
echo -e "  • View dashboard: ${YELLOW}pm2 monit${NC}"
echo -e "  • View logs: ${YELLOW}pm2 logs${NC}"
echo -e "  • View metrics: ${YELLOW}pm2 describe <app-name>${NC}"
echo -e "  • View all apps: ${YELLOW}pm2 list${NC}"
echo ""

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Monitoring Setup Complete! ✅        ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Log Rotation Settings:${NC}"
echo -e "  • Max size: 10MB"
echo -e "  • Retention: 7 days"
echo -e "  • Compression: Enabled"
echo ""

echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Start your applications: ${BLUE}pm2 start ecosystem.config.cjs${NC}"
echo -e "  2. Save PM2 config: ${BLUE}pm2 save${NC}"
echo -e "  3. View monitoring: ${BLUE}pm2 monit${NC}"
echo ""
