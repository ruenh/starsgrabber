# Deployment Scripts

This directory contains utility scripts for deploying and managing Stars Grabber.

## Scripts Overview

### build-all.sh

Builds all components (Mini App, API Backend, Bot Backend) without deployment.

```bash
bash scripts/build-all.sh
```

**Use case:** CI/CD pipelines, testing builds locally

---

### setup-ssl.sh

Automates SSL certificate installation using Let's Encrypt.

```bash
sudo bash scripts/setup-ssl.sh
```

**Requirements:**

- Root access
- Certbot installed
- Domain DNS pointing to server
- Nginx configured

**Interactive prompts:**

- Domain name
- Email address for notifications

---

### backup.sh

Creates a compressed backup of the application.

```bash
bash scripts/backup.sh
```

**Features:**

- Excludes node_modules and dist directories
- Keeps last 7 backups
- Stores in `/var/backups/stars-grabber`

**Restore command:**

```bash
tar -xzf /var/backups/stars-grabber/stars-grabber-backup-TIMESTAMP.tar.gz -C /var/www/
```

---

### health-check.sh

Performs a comprehensive health check of all components.

```bash
bash scripts/health-check.sh
```

**Checks:**

- PM2 process status
- Nginx status
- API endpoint availability
- Bot endpoint availability
- Disk space usage
- Memory usage
- Recent error logs

---

## Making Scripts Executable

```bash
chmod +x scripts/*.sh
```

## Automated Backups

To schedule automatic backups, add to crontab:

```bash
# Daily backup at 2 AM
0 2 * * * /var/www/stars-grabber/scripts/backup.sh >> /var/log/stars-grabber-backup.log 2>&1
```

## Automated Health Checks

To schedule automatic health checks:

```bash
# Health check every hour
0 * * * * /var/www/stars-grabber/scripts/health-check.sh >> /var/log/stars-grabber-health.log 2>&1
```

---

### setup-monitoring.sh

Configures PM2 monitoring and log rotation.

```bash
bash scripts/setup-monitoring.sh
```

**Features:**

- Installs PM2 log rotation module
- Configures log rotation (10MB max, 7 days retention)
- Sets up PM2 startup script
- Enables log compression

---

### monitor-dashboard.sh

Real-time monitoring dashboard with live metrics.

```bash
bash scripts/monitor-dashboard.sh
```

**Requirements:**

- `jq` for JSON parsing: `sudo apt install jq`

**Features:**

- Live system resource monitoring
- Process status and metrics
- Recent error display
- Auto-refresh every 5 seconds

---

### analyze-logs.sh

Analyzes application logs for errors and patterns.

```bash
bash scripts/analyze-logs.sh
```

**Provides:**

- Log entry statistics
- Error/warning/info counts
- Top 5 most common errors
- Recent error messages
- PM2 and Nginx log analysis

---

## Additional Resources

For detailed monitoring and logging information, see [MONITORING.md](../MONITORING.md) in the root directory.
