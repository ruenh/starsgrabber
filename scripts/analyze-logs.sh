#!/bin/bash

# Log Analysis Script
# Analyzes application logs for errors and patterns

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Stars Grabber Log Analysis          ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Function to analyze log file
analyze_log() {
    local log_file=$1
    local service_name=$2
    
    if [ ! -f "$log_file" ]; then
        echo -e "${YELLOW}⚠ Log file not found: $log_file${NC}"
        return
    fi
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}${service_name}${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Total lines
    local total_lines=$(wc -l < "$log_file")
    echo -e "Total log entries: ${YELLOW}${total_lines}${NC}"
    
    # Error count
    local error_count=$(grep -i "error" "$log_file" 2>/dev/null | wc -l)
    echo -e "Error entries:     ${RED}${error_count}${NC}"
    
    # Warning count
    local warn_count=$(grep -i "warn" "$log_file" 2>/dev/null | wc -l)
    echo -e "Warning entries:   ${YELLOW}${warn_count}${NC}"
    
    # Info count
    local info_count=$(grep -i "info" "$log_file" 2>/dev/null | wc -l)
    echo -e "Info entries:      ${GREEN}${info_count}${NC}"
    
    echo ""
    
    # Most common errors
    if [ "$error_count" -gt 0 ]; then
        echo -e "${RED}Top 5 Error Messages:${NC}"
        grep -i "error" "$log_file" 2>/dev/null | \
            sed 's/.*"message":"\([^"]*\)".*/\1/' | \
            sort | uniq -c | sort -rn | head -5 | \
            while read count message; do
                echo -e "  ${count}x: ${message:0:60}..."
            done
        echo ""
    fi
}

# Analyze API Backend logs
if [ -f "api-backend/logs/combined.log" ]; then
    analyze_log "api-backend/logs/combined.log" "API Backend"
fi

if [ -f "api-backend/logs/error.log" ]; then
    echo -e "${RED}Recent API Errors (Last 10):${NC}"
    tail -10 api-backend/logs/error.log 2>/dev/null | while read line; do
        echo -e "  ${line:0:100}"
    done
    echo ""
fi

# Analyze Bot Backend logs
if [ -f "bot-backend/logs/combined.log" ]; then
    analyze_log "bot-backend/logs/combined.log" "Bot Backend"
fi

if [ -f "bot-backend/logs/error.log" ]; then
    echo -e "${RED}Recent Bot Errors (Last 10):${NC}"
    tail -10 bot-backend/logs/error.log 2>/dev/null | while read line; do
        echo -e "  ${line:0:100}"
    done
    echo ""
fi

# PM2 logs
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}PM2 Logs${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if [ -f "api-backend/logs/pm2-error.log" ]; then
    local pm2_api_errors=$(wc -l < "api-backend/logs/pm2-error.log")
    echo -e "API PM2 errors:    ${RED}${pm2_api_errors}${NC}"
fi

if [ -f "bot-backend/logs/pm2-error.log" ]; then
    local pm2_bot_errors=$(wc -l < "bot-backend/logs/pm2-error.log")
    echo -e "Bot PM2 errors:    ${RED}${pm2_bot_errors}${NC}"
fi

echo ""

# Nginx logs (if accessible)
if [ -f "/var/log/nginx/error.log" ]; then
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Nginx Errors (Last 10)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    sudo tail -10 /var/log/nginx/error.log 2>/dev/null | while read line; do
        echo -e "  ${line:0:100}"
    done
    echo ""
fi

echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Log Analysis Complete                ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""

echo -e "${YELLOW}Useful Commands:${NC}"
echo -e "  • View live logs: ${BLUE}pm2 logs${NC}"
echo -e "  • View specific app: ${BLUE}pm2 logs stars-grabber-api${NC}"
echo -e "  • Clear logs: ${BLUE}pm2 flush${NC}"
echo ""
