#!/bin/bash

# Real-time Monitoring Dashboard
# Displays live metrics for Stars Grabber

GREEN='\033[0;32m'
RED='\033[0;31m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Function to get process status
get_process_status() {
    local process_name=$1
    if pm2 list | grep -q "$process_name.*online"; then
        echo -e "${GREEN}●${NC} Online"
    else
        echo -e "${RED}●${NC} Offline"
    fi
}

# Function to get process uptime
get_process_uptime() {
    local process_name=$1
    pm2 jlist | jq -r ".[] | select(.name==\"$process_name\") | .pm2_env.pm_uptime" 2>/dev/null | head -1
}

# Function to get process memory
get_process_memory() {
    local process_name=$1
    pm2 jlist | jq -r ".[] | select(.name==\"$process_name\") | .monit.memory" 2>/dev/null | head -1 | awk '{printf "%.0f MB", $1/1024/1024}'
}

# Function to get process CPU
get_process_cpu() {
    local process_name=$1
    pm2 jlist | jq -r ".[] | select(.name==\"$process_name\") | .monit.cpu" 2>/dev/null | head -1 | awk '{printf "%.1f%%", $1}'
}

# Function to get process restarts
get_process_restarts() {
    local process_name=$1
    pm2 jlist | jq -r ".[] | select(.name==\"$process_name\") | .pm2_env.restart_time" 2>/dev/null | head -1
}

# Clear screen and display dashboard
while true; do
    clear
    
    echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║          Stars Grabber Monitoring Dashboard               ║${NC}"
    echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
    echo ""
    echo -e "${YELLOW}Last Updated: $(date '+%Y-%m-%d %H:%M:%S')${NC}"
    echo ""
    
    # System Resources
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}System Resources${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # CPU Usage
    CPU_USAGE=$(top -bn1 | grep "Cpu(s)" | awk '{print $2}' | cut -d'%' -f1)
    echo -e "CPU Usage:    ${YELLOW}${CPU_USAGE}%${NC}"
    
    # Memory Usage
    MEM_INFO=$(free -h | grep Mem)
    MEM_USED=$(echo $MEM_INFO | awk '{print $3}')
    MEM_TOTAL=$(echo $MEM_INFO | awk '{print $2}')
    echo -e "Memory:       ${YELLOW}${MEM_USED} / ${MEM_TOTAL}${NC}"
    
    # Disk Usage
    DISK_USAGE=$(df -h / | tail -1 | awk '{print $5}')
    echo -e "Disk Usage:   ${YELLOW}${DISK_USAGE}${NC}"
    
    echo ""
    
    # PM2 Processes
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Application Processes${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if command -v pm2 &> /dev/null && command -v jq &> /dev/null; then
        # API Backend
        echo -e "${YELLOW}API Backend${NC}"
        echo -e "  Status:    $(get_process_status 'stars-grabber-api')"
        echo -e "  Memory:    $(get_process_memory 'stars-grabber-api')"
        echo -e "  CPU:       $(get_process_cpu 'stars-grabber-api')"
        echo -e "  Restarts:  $(get_process_restarts 'stars-grabber-api')"
        echo ""
        
        # Bot Backend
        echo -e "${YELLOW}Bot Backend${NC}"
        echo -e "  Status:    $(get_process_status 'stars-grabber-bot')"
        echo -e "  Memory:    $(get_process_memory 'stars-grabber-bot')"
        echo -e "  CPU:       $(get_process_cpu 'stars-grabber-bot')"
        echo -e "  Restarts:  $(get_process_restarts 'stars-grabber-bot')"
        echo ""
    else
        if ! command -v pm2 &> /dev/null; then
            echo -e "${RED}PM2 not installed${NC}"
        fi
        if ! command -v jq &> /dev/null; then
            echo -e "${YELLOW}Install jq for detailed metrics: sudo apt install jq${NC}"
        fi
    fi
    
    # Nginx Status
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Web Server${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if systemctl is-active --quiet nginx 2>/dev/null; then
        echo -e "Nginx:        ${GREEN}●${NC} Running"
    else
        echo -e "Nginx:        ${RED}●${NC} Stopped"
    fi
    
    echo ""
    
    # Recent Errors
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${BLUE}Recent Errors (Last 5)${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    if [ -f "api-backend/logs/error.log" ]; then
        tail -5 api-backend/logs/error.log 2>/dev/null | while read line; do
            echo -e "${RED}API:${NC} ${line:0:80}..."
        done
    fi
    
    if [ -f "bot-backend/logs/error.log" ]; then
        tail -5 bot-backend/logs/error.log 2>/dev/null | while read line; do
            echo -e "${RED}BOT:${NC} ${line:0:80}..."
        done
    fi
    
    echo ""
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "Press ${YELLOW}Ctrl+C${NC} to exit"
    
    # Refresh every 5 seconds
    sleep 5
done
