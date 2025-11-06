#!/bin/bash

# Health Check Script
# Checks the status of all components

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Stars Grabber Health Check           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Check PM2 processes
echo -e "${BLUE}📊 PM2 Process Status:${NC}"
if command -v pm2 &> /dev/null; then
    pm2 list
    echo ""
    
    # Check if API is running
    if pm2 list | grep -q "stars-grabber-api.*online"; then
        echo -e "${GREEN}✓ API Backend is running${NC}"
    else
        echo -e "${RED}✗ API Backend is not running${NC}"
    fi
    
    # Check if Bot is running
    if pm2 list | grep -q "stars-grabber-bot.*online"; then
        echo -e "${GREEN}✓ Bot Backend is running${NC}"
    else
        echo -e "${RED}✗ Bot Backend is not running${NC}"
    fi
else
    echo -e "${RED}✗ PM2 is not installed${NC}"
fi
echo ""

# Check Nginx
echo -e "${BLUE}🌐 Nginx Status:${NC}"
if command -v nginx &> /dev/null; then
    if systemctl is-active --quiet nginx; then
        echo -e "${GREEN}✓ Nginx is running${NC}"
    else
        echo -e "${RED}✗ Nginx is not running${NC}"
    fi
else
    echo -e "${RED}✗ Nginx is not installed${NC}"
fi
echo ""

# Check API endpoint
echo -e "${BLUE}🔌 API Endpoint Check:${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/api/health 2>/dev/null | grep -q "200"; then
    echo -e "${GREEN}✓ API is responding${NC}"
else
    echo -e "${YELLOW}⚠ API health check failed (endpoint may not exist yet)${NC}"
fi
echo ""

# Check Bot endpoint
echo -e "${BLUE}🤖 Bot Endpoint Check:${NC}"
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/health 2>/dev/null | grep -q "200"; then
    echo -e "${GREEN}✓ Bot is responding${NC}"
else
    echo -e "${YELLOW}⚠ Bot health check failed (endpoint may not exist yet)${NC}"
fi
echo ""

# Check disk space
echo -e "${BLUE}💾 Disk Space:${NC}"
df -h / | tail -1 | awk '{print "  Used: "$3" / "$2" ("$5")"}'
echo ""

# Check memory
echo -e "${BLUE}🧠 Memory Usage:${NC}"
free -h | grep Mem | awk '{print "  Used: "$3" / "$2}'
echo ""

# Check logs
echo -e "${BLUE}📝 Recent Errors (last 10):${NC}"
if [ -f "api-backend/logs/pm2-error.log" ]; then
    ERROR_COUNT=$(tail -100 api-backend/logs/pm2-error.log 2>/dev/null | wc -l)
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}  API Backend: ${ERROR_COUNT} recent log entries${NC}"
    else
        echo -e "${GREEN}  API Backend: No recent errors${NC}"
    fi
else
    echo -e "${YELLOW}  API Backend: No log file found${NC}"
fi

if [ -f "bot-backend/logs/pm2-error.log" ]; then
    ERROR_COUNT=$(tail -100 bot-backend/logs/pm2-error.log 2>/dev/null | wc -l)
    if [ "$ERROR_COUNT" -gt 0 ]; then
        echo -e "${YELLOW}  Bot Backend: ${ERROR_COUNT} recent log entries${NC}"
    else
        echo -e "${GREEN}  Bot Backend: No recent errors${NC}"
    fi
else
    echo -e "${YELLOW}  Bot Backend: No log file found${NC}"
fi
echo ""

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Health Check Complete                ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
