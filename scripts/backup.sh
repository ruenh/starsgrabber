#!/bin/bash

# Backup Script for Stars Grabber
# Creates a backup of the application and configuration

set -e

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Configuration
BACKUP_DIR="/var/backups/stars-grabber"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_NAME="stars-grabber-backup-${TIMESTAMP}.tar.gz"

echo -e "${BLUE}╔════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   Stars Grabber Backup                 ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════╝${NC}"
echo ""

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

echo -e "${BLUE}📦 Creating backup...${NC}"

# Create temporary directory for backup
TEMP_DIR=$(mktemp -d)

# Copy application files
echo -e "${BLUE}Copying application files...${NC}"
cp -r . "$TEMP_DIR/stars-grabber"

# Remove node_modules and dist directories to save space
echo -e "${BLUE}Removing build artifacts...${NC}"
find "$TEMP_DIR/stars-grabber" -name "node_modules" -type d -exec rm -rf {} + 2>/dev/null || true
find "$TEMP_DIR/stars-grabber" -name "dist" -type d -exec rm -rf {} + 2>/dev/null || true

# Create tarball
echo -e "${BLUE}Creating archive...${NC}"
tar -czf "${BACKUP_DIR}/${BACKUP_NAME}" -C "$TEMP_DIR" stars-grabber

# Clean up temporary directory
rm -rf "$TEMP_DIR"

# Get backup size
BACKUP_SIZE=$(du -h "${BACKUP_DIR}/${BACKUP_NAME}" | cut -f1)

echo ""
echo -e "${GREEN}╔════════════════════════════════════════╗${NC}"
echo -e "${GREEN}║   Backup Completed! ✅                 ║${NC}"
echo -e "${GREEN}╚════════════════════════════════════════╝${NC}"
echo ""
echo -e "${BLUE}Backup Details:${NC}"
echo -e "  • File: ${BACKUP_NAME}"
echo -e "  • Location: ${BACKUP_DIR}"
echo -e "  • Size: ${BACKUP_SIZE}"
echo ""

# Keep only last 7 backups
echo -e "${BLUE}🧹 Cleaning old backups (keeping last 7)...${NC}"
cd "$BACKUP_DIR"
ls -t stars-grabber-backup-*.tar.gz | tail -n +8 | xargs -r rm
echo -e "${GREEN}✓ Cleanup completed${NC}"
echo ""

echo -e "${YELLOW}To restore this backup:${NC}"
echo -e "  tar -xzf ${BACKUP_DIR}/${BACKUP_NAME} -C /var/www/"
echo ""
