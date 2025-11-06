#!/bin/bash

# Stars Grabber VDS Server Setup Script
# This script automates the initial server configuration
# Run with: sudo bash setup-server.sh

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Stars Grabber VDS Server Setup      ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Update system
echo -e "${BLUE}📦 Updating system packages...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✓ System updated${NC}"
echo ""

# Install Node.js 20.x
echo -e "${BLUE}📦 Installing Node.js 20.x...${NC}"
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
    echo -e "${GREEN}✓ Node.js $(node -v) installed${NC}"
else
    echo -e "${YELLOW}⚠ Node.js $(node -v) already installed${NC}"
fi
echo ""

# Install PM2
echo -e "${BLUE}📦 Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}✓ PM2 installed${NC}"
else
    echo -e "${YELLOW}⚠ PM2 already installed${NC}"
fi
echo ""

# Install Nginx
echo -e "${BLUE}📦 Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✓ Nginx installed and started${NC}"
else
    echo -e "${YELLOW}⚠ Nginx already installed${NC}"
fi
echo ""

# Install Certbot for SSL
echo -e "${BLUE}📦 Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✓ Certbot installed${NC}"
else
    echo -e "${YELLOW}⚠ Certbot already installed${NC}"
fi
echo ""

# Install Git
echo -e "${BLUE}📦 Installing Git...${NC}"
if ! command -v git &> /dev/null; then
    apt install -y git
    echo -e "${GREEN}✓ Git installed${NC}"
else
    echo -e "${YELLOW}⚠ Git already installed${NC}"
fi
echo ""

# Configure firewall
echo -e "${BLUE}🔒 Configuring firewall...${NC}"
if ! command -v ufw &> /dev/null; then
    apt install -y ufw
fi

# Allow SSH, HTTP, HTTPS
ufw --force enable
ufw allow ssh
ufw allow http
ufw allow https
echo -e "${GREEN}✓ Firewall configured${NC}"
echo ""

# Create application directory
echo -e "${BLUE}📁 Creating application directory...${NC}"
mkdir -p /var/www/stars-grabber
echo -e "${GREEN}✓ Directory created: /var/www/stars-grabber${NC}"
echo ""

# Create log directories
echo -e "${BLUE}📁 Creating log directories...${NC}"
mkdir -p /var/www/stars-grabber/api-backend/logs
mkdir -p /var/www/stars-grabber/bot-backend/logs
echo -e "${GREEN}✓ Log directories created${NC}"
echo ""

# Set proper permissions
echo -e "${BLUE}🔐 Setting permissions...${NC}"
chown -R $SUDO_USER:$SUDO_USER /var/www/stars-grabber
echo -e "${GREEN}✓ Permissions set${NC}"
echo ""

# Display summary
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Server Setup Completed! ✅           ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Installed Components:${NC}"
echo -e "  • Node.js: $(node -v)"
echo -e "  • npm: $(npm -v)"
echo -e "  • PM2: $(pm2 -v)"
echo -e "  • Nginx: $(nginx -v 2>&1 | grep -o 'nginx/[0-9.]*')"
echo -e "  • Git: $(git --version | grep -o '[0-9.]*')"
echo ""
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Clone your repository to /var/www/stars-grabber"
echo -e "  2. Configure environment variables (.env files)"
echo -e "  3. Run the deployment script: ./deploy.sh"
echo -e "  4. Configure Nginx with your domain"
echo -e "  5. Setup SSL certificate with certbot"
echo ""
