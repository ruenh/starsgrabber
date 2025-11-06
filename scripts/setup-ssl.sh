#!/bin/bash

# SSL Certificate Setup Script
# This script automates SSL certificate installation with Let's Encrypt

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   SSL Certificate Setup                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
    exit 1
fi

# Check if certbot is installed
if ! command -v certbot &> /dev/null; then
    echo -e "${RED}❌ Certbot is not installed${NC}"
    echo -e "${YELLOW}Run: sudo apt install certbot python3-certbot-nginx${NC}"
    exit 1
fi

# Prompt for domain
read -p "Enter your domain name (e.g., example.com): " DOMAIN

if [ -z "$DOMAIN" ]; then
    echo -e "${RED}❌ Domain name is required${NC}"
    exit 1
fi

# Prompt for email
read -p "Enter your email address for SSL notifications: " EMAIL

if [ -z "$EMAIL" ]; then
    echo -e "${RED}❌ Email address is required${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}🔒 Obtaining SSL certificate for ${DOMAIN}...${NC}"
echo ""

# Run certbot
certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAIL" --redirect

if [ $? -eq 0 ]; then
    echo ""
    echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║   SSL Certificate Installed! ✅        ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${BLUE}Certificate Details:${NC}"
    echo -e "  • Domain: ${DOMAIN}"
    echo -e "  • Email: ${EMAIL}"
    echo -e "  • Auto-renewal: Enabled"
    echo ""
    echo -e "${YELLOW}Note: Certificates will auto-renew via certbot timer${NC}"
    echo -e "${YELLOW}Check renewal status: sudo certbot renew --dry-run${NC}"
else
    echo ""
    echo -e "${RED}❌ SSL certificate installation failed${NC}"
    echo -e "${YELLOW}Please check:${NC}"
    echo -e "  • Domain DNS is pointing to this server"
    echo -e "  • Port 80 and 443 are open"
    echo -e "  • Nginx is running"
    exit 1
fi
