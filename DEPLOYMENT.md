# Deployment Guide

This guide covers deploying Stars Grabber to a VDS server.

## Prerequisites

- VDS server with Ubuntu 20.04+ (4 vCPU, 8GB RAM, 80GB SSD recommended)
- Domain name pointed to your server
- Root or sudo access

## Step 1: Server Setup

### Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### Install PM2

```bash
sudo npm install -g pm2
```

### Install Nginx

```bash
sudo apt update
sudo apt install -y nginx
```

### Install Certbot (for SSL)

```bash
sudo apt install -y certbot python3-certbot-nginx
```

## Step 2: Clone and Setup Project

```bash
# Clone your repository
git clone <your-repo-url> /var/www/stars-grabber
cd /var/www/stars-grabber

# Install Mini App dependencies
npm install

# Install API Backend dependencies
cd api-backend
npm install
cd ..

# Install Bot Backend dependencies
cd bot-backend
npm install
cd ..
```

## Step 3: Configure Environment Variables

### Mini App (.env)

```bash
cp .env.example .env
nano .env
```

Set:

- `VITE_API_URL` to your API URL (e.g., https://yourdomain.com/api)
- `VITE_BOT_USERNAME` to your bot username

### API Backend (api-backend/.env)

```bash
cd api-backend
cp .env.example .env
nano .env
```

Set all required variables:

- Supabase credentials
- JWT secret
- Bot token
- Admin Telegram ID

### Bot Backend (bot-backend/.env)

```bash
cd bot-backend
cp .env.example .env
nano .env
```

Set all required variables:

- Bot token
- Supabase credentials
- API URL
- Webhook domain

## Step 4: Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Copy the SQL from `supabase/schema.sql`
3. Go to SQL Editor in Supabase dashboard
4. Paste and execute the SQL
5. Copy your project URL and anon key to the .env files

## Step 5: Build All Components

```bash
# Make deploy script executable
chmod +x deploy.sh

# Run deployment script
./deploy.sh
```

## Step 6: Configure Nginx

```bash
# Copy nginx configuration
sudo cp nginx.conf.example /etc/nginx/sites-available/stars-grabber

# Edit the configuration
sudo nano /etc/nginx/sites-available/stars-grabber
# Update server_name with your domain

# Create symlink
sudo ln -s /etc/nginx/sites-available/stars-grabber /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

## Step 7: Setup SSL Certificate

```bash
sudo certbot --nginx -d yourdomain.com
```

Follow the prompts to configure SSL.

## Step 8: Start PM2 Processes

```bash
# Start all processes
pm2 start ecosystem.config.cjs

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

## Step 9: Configure Bot Webhook (Production)

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook?url=https://yourdomain.com/webhook"
```

## Step 10: Configure Telegram Bot

1. Go to @BotFather
2. Set bot commands:
   ```
   start - Start bot
   ```
3. Add bot as administrator to all channels you'll use for tasks

## Monitoring

### View PM2 Logs

```bash
# All logs
pm2 logs

# Specific app
pm2 logs stars-grabber-api
pm2 logs stars-grabber-bot
```

### View PM2 Status

```bash
pm2 status
```

### View Nginx Logs

```bash
# Access logs
sudo tail -f /var/log/nginx/access.log

# Error logs
sudo tail -f /var/log/nginx/error.log
```

## Updating

To update the application:

```bash
cd /var/www/stars-grabber
git pull
./deploy.sh
```

## Troubleshooting

### PM2 Process Not Starting

Check logs:

```bash
pm2 logs <app-name>
```

Restart process:

```bash
pm2 restart <app-name>
```

### Nginx 502 Bad Gateway

Check if backend services are running:

```bash
pm2 status
```

Check Nginx error logs:

```bash
sudo tail -f /var/log/nginx/error.log
```

### Bot Not Receiving Updates

Verify webhook is set:

```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo"
```

Delete webhook (for development):

```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/deleteWebhook"
```

## Security Checklist

- [ ] Change all default passwords and secrets
- [ ] Enable firewall (ufw)
- [ ] Keep system updated
- [ ] Use strong JWT secret
- [ ] Enable Supabase RLS policies
- [ ] Regular backups of database
- [ ] Monitor logs for suspicious activity
- [ ] Use environment variables for all secrets
- [ ] Never commit .env files to git

## Backup

### Database Backup

Use Supabase dashboard to create backups or use pg_dump:

```bash
pg_dump -h <supabase-host> -U postgres -d postgres > backup.sql
```

### Application Backup

```bash
tar -czf stars-grabber-backup.tar.gz /var/www/stars-grabber
```
