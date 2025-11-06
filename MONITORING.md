# Monitoring and Logging Guide

This guide covers monitoring, logging, and troubleshooting for Stars Grabber.

## Table of Contents

- [Logging System](#logging-system)
- [PM2 Monitoring](#pm2-monitoring)
- [Health Checks](#health-checks)
- [Log Analysis](#log-analysis)
- [Alerts and Notifications](#alerts-and-notifications)
- [Performance Metrics](#performance-metrics)
- [Troubleshooting](#troubleshooting)

## Logging System

### Winston Logger

Stars Grabber uses Winston for structured logging across all backend services.

**Log Levels:**

- `error`: Error events that might still allow the application to continue running
- `warn`: Warning messages for potentially harmful situations
- `info`: Informational messages that highlight progress
- `http`: HTTP request logging
- `debug`: Detailed information for debugging (development only)

**Log Files:**

API Backend:

- `api-backend/logs/error.log` - Error logs only
- `api-backend/logs/combined.log` - All logs
- `api-backend/logs/pm2-error.log` - PM2 error output
- `api-backend/logs/pm2-out.log` - PM2 standard output

Bot Backend:

- `bot-backend/logs/error.log` - Error logs only
- `bot-backend/logs/combined.log` - All logs
- `bot-backend/logs/pm2-error.log` - PM2 error output
- `bot-backend/logs/pm2-out.log` - PM2 standard output

**Log Rotation:**

- Max file size: 5MB
- Max files kept: 5
- Automatic rotation when size limit reached

### Viewing Logs

**Real-time logs:**

```bash
# All applications
pm2 logs

# Specific application
pm2 logs stars-grabber-api
pm2 logs stars-grabber-bot

# Last N lines
pm2 logs --lines 100
```

**Log files:**

```bash
# Tail error logs
tail -f api-backend/logs/error.log
tail -f bot-backend/logs/error.log

# View combined logs
tail -f api-backend/logs/combined.log
tail -f bot-backend/logs/combined.log

# Search logs
grep "error" api-backend/logs/combined.log
grep "user" bot-backend/logs/combined.log
```

## PM2 Monitoring

### Setup PM2 Monitoring

```bash
# Run monitoring setup script
bash scripts/setup-monitoring.sh
```

This script:

- Installs PM2 log rotation module
- Configures log rotation (10MB max, 7 days retention)
- Sets up PM2 startup script
- Enables compression for rotated logs

### PM2 Commands

**Process Management:**

```bash
# List all processes
pm2 list

# Detailed process info
pm2 describe stars-grabber-api

# Process monitoring dashboard
pm2 monit

# Restart process
pm2 restart stars-grabber-api

# Stop process
pm2 stop stars-grabber-api

# Delete process
pm2 delete stars-grabber-api
```

**Log Management:**

```bash
# View logs
pm2 logs

# Flush logs
pm2 flush

# Reload logs
pm2 reloadLogs
```

**Monitoring:**

```bash
# Real-time monitoring
pm2 monit

# Process metrics
pm2 describe stars-grabber-api

# JSON output for scripting
pm2 jlist
```

### PM2 Web Interface

PM2 Plus (optional) provides a web-based monitoring interface:

```bash
# Link to PM2 Plus
pm2 link <secret_key> <public_key>
```

Visit [pm2.io](https://pm2.io) to create an account and get keys.

## Health Checks

### Automated Health Check

Run the health check script:

```bash
bash scripts/health-check.sh
```

This checks:

- PM2 process status
- Nginx status
- API endpoint availability
- Bot endpoint availability
- Disk space usage
- Memory usage
- Recent error logs

### Manual Health Checks

**API Backend:**

```bash
curl http://localhost:3000/health
# Expected: {"status":"ok","timestamp":"..."}
```

**Bot Backend:**

```bash
curl http://localhost:3001/health
# Expected: {"status":"ok","service":"bot-backend"}
```

**Nginx:**

```bash
systemctl status nginx
nginx -t  # Test configuration
```

### Scheduled Health Checks

Add to crontab for automated monitoring:

```bash
# Edit crontab
crontab -e

# Add health check every hour
0 * * * * /var/www/stars-grabber/scripts/health-check.sh >> /var/log/stars-grabber-health.log 2>&1
```

## Log Analysis

### Automated Log Analysis

Run the log analysis script:

```bash
bash scripts/analyze-logs.sh
```

This provides:

- Total log entries per service
- Error, warning, and info counts
- Top 5 most common errors
- Recent error messages
- PM2 log statistics
- Nginx error summary

### Manual Log Analysis

**Find errors in last hour:**

```bash
find api-backend/logs -name "*.log" -mmin -60 -exec grep -i "error" {} \;
```

**Count errors by type:**

```bash
grep "error" api-backend/logs/combined.log | \
  sed 's/.*"message":"\([^"]*\)".*/\1/' | \
  sort | uniq -c | sort -rn
```

**Find slow requests (>1000ms):**

```bash
grep "http" api-backend/logs/combined.log | \
  awk '{if ($NF > 1000) print}'
```

## Real-time Monitoring Dashboard

Launch the monitoring dashboard:

```bash
bash scripts/monitor-dashboard.sh
```

Features:

- Real-time system resource usage (CPU, Memory, Disk)
- Process status and metrics
- Nginx status
- Recent errors
- Auto-refresh every 5 seconds

**Requirements:**

- `jq` for JSON parsing: `sudo apt install jq`

## Alerts and Notifications

### PM2 Alerts

Configure PM2 to send alerts on process crashes:

```bash
# Install PM2 notify module
pm2 install pm2-auto-pull

# Configure email notifications (requires PM2 Plus)
pm2 link <secret_key> <public_key>
```

### Custom Alert Script

Create a custom alert script for critical errors:

```bash
#!/bin/bash
# /var/www/stars-grabber/scripts/alert.sh

ERROR_COUNT=$(grep -c "error" api-backend/logs/error.log)

if [ "$ERROR_COUNT" -gt 100 ]; then
    # Send alert (email, Telegram, etc.)
    echo "High error count: $ERROR_COUNT" | mail -s "Stars Grabber Alert" admin@example.com
fi
```

Add to crontab:

```bash
*/15 * * * * /var/www/stars-grabber/scripts/alert.sh
```

## Performance Metrics

### Application Metrics

**API Response Times:**

```bash
# Average response time from logs
grep "http" api-backend/logs/combined.log | \
  awk '{sum+=$NF; count++} END {print sum/count "ms"}'
```

**Request Rate:**

```bash
# Requests per minute
grep "http" api-backend/logs/combined.log | \
  grep "$(date +%Y-%m-%d\ %H:%M)" | wc -l
```

**Error Rate:**

```bash
# Errors per hour
grep "error" api-backend/logs/error.log | \
  grep "$(date +%Y-%m-%d\ %H)" | wc -l
```

### System Metrics

**CPU Usage:**

```bash
top -bn1 | grep "Cpu(s)"
```

**Memory Usage:**

```bash
free -h
```

**Disk Usage:**

```bash
df -h
```

**Network Connections:**

```bash
netstat -an | grep :3000 | wc -l  # API connections
netstat -an | grep :3001 | wc -l  # Bot connections
```

## Troubleshooting

### High Memory Usage

**Check process memory:**

```bash
pm2 list
pm2 describe stars-grabber-api
```

**Solution:**

- Restart process: `pm2 restart stars-grabber-api`
- Check for memory leaks in logs
- Adjust `max_memory_restart` in `ecosystem.config.cjs`

### High CPU Usage

**Identify process:**

```bash
top -c
```

**Solution:**

- Check for infinite loops in logs
- Review recent code changes
- Scale horizontally if needed

### Process Crashes

**Check crash logs:**

```bash
pm2 logs stars-grabber-api --err
```

**Common causes:**

- Uncaught exceptions
- Database connection issues
- Out of memory

**Solution:**

- Review error logs
- Check environment variables
- Verify database connectivity

### Slow Response Times

**Check logs for slow requests:**

```bash
grep "http" api-backend/logs/combined.log | \
  awk '{if ($NF > 1000) print}' | tail -20
```

**Solution:**

- Optimize database queries
- Add caching
- Review endpoint logic

### Database Connection Issues

**Check Supabase connectivity:**

```bash
curl https://your-project.supabase.co/rest/v1/
```

**Solution:**

- Verify Supabase credentials in .env
- Check network connectivity
- Review Supabase dashboard for issues

### Nginx 502 Bad Gateway

**Check backend status:**

```bash
pm2 status
curl http://localhost:3000/health
```

**Check Nginx logs:**

```bash
sudo tail -f /var/log/nginx/error.log
```

**Solution:**

- Restart backend: `pm2 restart all`
- Check Nginx configuration: `nginx -t`
- Verify port numbers match

## Best Practices

1. **Regular Log Review**: Check logs daily for errors and warnings
2. **Monitor Disk Space**: Ensure logs don't fill up disk
3. **Set Up Alerts**: Configure alerts for critical errors
4. **Regular Backups**: Backup logs before rotation
5. **Performance Baseline**: Establish normal performance metrics
6. **Documentation**: Document recurring issues and solutions
7. **Log Retention**: Keep logs for at least 30 days
8. **Security**: Restrict log file access to authorized users

## Useful Commands Cheat Sheet

```bash
# Quick status check
pm2 status && systemctl status nginx

# View all errors today
grep "$(date +%Y-%m-%d)" api-backend/logs/error.log

# Restart everything
pm2 restart all && sudo systemctl restart nginx

# Clear all logs
pm2 flush

# Monitor in real-time
pm2 monit

# Health check
bash scripts/health-check.sh

# Log analysis
bash scripts/analyze-logs.sh

# Monitoring dashboard
bash scripts/monitor-dashboard.sh
```
