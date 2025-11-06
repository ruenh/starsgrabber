# Testing Guide for Stars Grabber

## Overview

This guide provides instructions for testing the Stars Grabber application, including manual testing procedures, automated test scripts, and debugging tips.

## Prerequisites

Before testing, ensure:

- API Backend is running on port 3000
- Bot Backend is running on port 3001
- Frontend is built and accessible
- Supabase database is configured
- Test Telegram account is available

## Quick Start

### 1. Run Automated API Tests

```bash
# Make script executable
chmod +x test-api.sh

# Run tests
./test-api.sh
```

### 2. Manual Integration Testing

Follow the comprehensive checklist in `test-integration.md`:

```bash
# Open the integration test checklist
cat test-integration.md
```

## Testing Categories

### A. Unit Testing (Not Yet Implemented)

**Status:** ⚠️ Needs Implementation

**Recommended Setup:**

```bash
# Install testing dependencies
cd api-backend
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest

# Install for bot backend
cd ../bot-backend
npm install --save-dev jest @types/jest ts-jest

# Install for frontend
cd ..
npm install --save-dev vitest @solidjs/testing-library
```

**Example Test Structure:**

```
api-backend/
  src/
    __tests__/
      services/
        userService.test.ts
        taskService.test.ts
        withdrawalService.test.ts
      middleware/
        auth.test.ts
        validation.test.ts
```

### B. Integration Testing

**Status:** ✅ Manual Checklist Available

Use `test-integration.md` for comprehensive manual testing of:

- User registration and authentication
- Task completion flows
- Referral system
- Withdrawal process
- Admin panel functionality
- Notification system

### C. API Testing

**Status:** ✅ Automated Script Available

Run `test-api.sh` to test:

- Health checks
- Authentication endpoints
- Authorization
- Input validation
- Rate limiting
- CORS configuration
- Error handling

### D. End-to-End Testing (Not Yet Implemented)

**Status:** ⚠️ Needs Implementation

**Recommended Setup:**

```bash
# Install Playwright
npm install --save-dev @playwright/test

# Or use Cypress
npm install --save-dev cypress
```

## Manual Testing Procedures

### 1. Authentication Flow

**Test Case:** New User Registration

```bash
# 1. Open Telegram
# 2. Start the bot: /start
# 3. Open Mini App
# 4. Verify user is authenticated
# 5. Check database for new user record

# Query to check:
# SELECT * FROM users ORDER BY created_at DESC LIMIT 1;
```

**Expected Result:**

- User record created
- JWT token stored in localStorage
- Balance is 0
- User redirected to Home page

### 2. Task Verification Flow

**Test Case:** Channel Subscription Task

```bash
# 1. Click on channel subscription task
# 2. Click "Subscribe" button
# 3. Subscribe to channel in Telegram
# 4. Return to app
# 5. Click "Verify" button
# 6. Wait for verification

# Check bot logs:
# tail -f bot-backend/logs/combined.log | grep "Subscription check"

# Check API logs:
# tail -f api-backend/logs/combined.log | grep "Task verified"
```

**Expected Result:**

- Verification succeeds
- Stars added to balance
- Animation plays
- Task marked as completed
- Transaction recorded

### 3. Withdrawal Flow

**Test Case:** Successful Withdrawal

```bash
# Prerequisites:
# - User has >= 100 stars
# - User has Telegram username
# - All subscriptions are active

# 1. Navigate to Profile
# 2. Click withdrawal button
# 3. Enter amount (e.g., 100)
# 4. Submit request
# 5. Check History tab

# Verify in database:
# SELECT * FROM withdrawals WHERE user_id = <user_id> ORDER BY created_at DESC LIMIT 1;
```

**Expected Result:**

- Withdrawal created with "pending" status
- Admin notified via bot
- Withdrawal visible in history with ⏳ emoji
- Balance not yet deducted

### 4. Admin Operations

**Test Case:** Task Creation

```bash
# Prerequisites:
# - Logged in as admin (ID: 1327903698)

# 1. Click admin button in header
# 2. Navigate to Task Manager
# 3. Click "Create Task"
# 4. Fill in details:
#    - Type: channel
#    - Title: Test Channel
#    - Reward: 50
#    - Target: testchannel
# 5. Submit

# Verify:
# SELECT * FROM tasks ORDER BY created_at DESC LIMIT 1;
```

**Expected Result:**

- Task created in database
- All users notified via bot
- Task visible on Home page

## Debugging Tips

### 1. Check Logs

**API Backend Logs:**

```bash
# Real-time logs
tail -f api-backend/logs/combined.log

# Error logs only
tail -f api-backend/logs/error.log

# Search for specific user
grep "userId: 123" api-backend/logs/combined.log
```

**Bot Backend Logs:**

```bash
# Real-time logs
tail -f bot-backend/logs/combined.log

# Verification logs
grep "Subscription check" bot-backend/logs/combined.log
```

**PM2 Logs (Production):**

```bash
# View all logs
pm2 logs

# View specific service
pm2 logs api-backend
pm2 logs bot-backend

# Clear logs
pm2 flush
```

### 2. Database Queries

**Check User Balance:**

```sql
SELECT id, telegram_id, username, balance
FROM users
WHERE telegram_id = <telegram_id>;
```

**Check User Tasks:**

```sql
SELECT ut.*, t.title, t.reward
FROM user_tasks ut
JOIN tasks t ON ut.task_id = t.id
WHERE ut.user_id = <user_id>;
```

**Check Transactions:**

```sql
SELECT * FROM transactions
WHERE user_id = <user_id>
ORDER BY created_at DESC;
```

**Check Pending Withdrawals:**

```sql
SELECT w.*, u.username, u.telegram_id
FROM withdrawals w
JOIN users u ON w.user_id = u.id
WHERE w.status = 'pending'
ORDER BY w.created_at DESC;
```

**Check Referral Tree:**

```sql
WITH RECURSIVE referral_tree AS (
  SELECT id, telegram_id, username, referrer_id, 1 as level
  FROM users
  WHERE referrer_id IS NULL

  UNION ALL

  SELECT u.id, u.telegram_id, u.username, u.referrer_id, rt.level + 1
  FROM users u
  JOIN referral_tree rt ON u.referrer_id = rt.id
)
SELECT * FROM referral_tree ORDER BY level, id;
```

### 3. Network Debugging

**Check API Connectivity:**

```bash
# Health check
curl http://localhost:3000/health

# Test authentication
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"initData":"test"}'
```

**Check Bot Connectivity:**

```bash
# Health check
curl http://localhost:3001/health

# Test verification endpoint
curl -X POST http://localhost:3001/verify/channel \
  -H "Content-Type: application/json" \
  -d '{"userId":123,"channelUsername":"testchannel"}'
```

### 4. Frontend Debugging

**Check Browser Console:**

```javascript
// Check stored token
localStorage.getItem("token");

// Check stored user
localStorage.getItem("user");

// Check API calls
// Open Network tab in DevTools
// Filter by "api"
```

**Check TMA SDK:**

```javascript
// In browser console
window.Telegram.WebApp.initData;
window.Telegram.WebApp.initDataUnsafe;
```

## Common Issues and Solutions

### Issue 1: "Invalid initData signature"

**Cause:** Bot token mismatch or expired initData

**Solution:**

```bash
# Check bot token in .env
cat api-backend/.env | grep BOT_TOKEN

# Verify it matches the bot token in BotFather
# Restart the app after changing token
pm2 restart all
```

### Issue 2: "Bot not in channel"

**Cause:** Bot doesn't have admin permissions in channel

**Solution:**

1. Add bot to channel as administrator
2. Grant "View Messages" permission
3. Test verification again

### Issue 3: "CORS error"

**Cause:** Frontend origin not in allowed origins

**Solution:**

```bash
# Add origin to .env
echo "ALLOWED_ORIGINS=http://localhost:5173,https://yourdomain.com" >> api-backend/.env

# Restart API
pm2 restart api-backend
```

### Issue 4: "Rate limit exceeded"

**Cause:** Too many requests from same IP

**Solution:**

```bash
# Wait for rate limit window to expire
# Or temporarily disable rate limiting for testing

# In api-backend/src/index.ts, comment out:
# app.use("/api", apiLimiter);
```

### Issue 5: "Database connection error"

**Cause:** Supabase credentials incorrect or network issue

**Solution:**

```bash
# Check Supabase credentials
cat api-backend/.env | grep SUPABASE

# Test connection
curl -X GET "https://<project-id>.supabase.co/rest/v1/users?select=count" \
  -H "apikey: <anon-key>" \
  -H "Authorization: Bearer <anon-key>"
```

## Performance Testing

### Load Testing with Apache Bench

```bash
# Install Apache Bench
sudo apt-get install apache2-utils

# Test health endpoint
ab -n 1000 -c 10 http://localhost:3000/health

# Test authenticated endpoint (with token)
ab -n 100 -c 5 -H "Authorization: Bearer <token>" \
  http://localhost:3000/api/tasks
```

### Load Testing with Artillery

```bash
# Install Artillery
npm install -g artillery

# Create test config (artillery.yml)
# Run load test
artillery run artillery.yml
```

## Security Testing

### 1. Test SQL Injection

```bash
# Try SQL injection in task title
curl -X POST http://localhost:3000/api/admin/tasks \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"type":"channel","title":"Test'; DROP TABLE users;--","reward":50,"target":"test"}'

# Should be sanitized and rejected
```

### 2. Test XSS

```bash
# Try XSS in task description
curl -X POST http://localhost:3000/api/admin/tasks \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"type":"channel","title":"Test","description":"<script>alert(1)</script>","reward":50,"target":"test"}'

# Should be sanitized
```

### 3. Test Authorization Bypass

```bash
# Try accessing admin endpoint without admin token
curl -X GET http://localhost:3000/api/admin/stats \
  -H "Authorization: Bearer <regular-user-token>"

# Should return 403 Forbidden
```

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v2

      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: "20"

      - name: Install dependencies
        run: |
          cd api-backend && npm install
          cd ../bot-backend && npm install
          npm install

      - name: Run API tests
        run: ./test-api.sh

      - name: Run unit tests
        run: |
          cd api-backend && npm test
          cd ../bot-backend && npm test
```

## Test Coverage Goals

- **Unit Tests:** 80% code coverage
- **Integration Tests:** All critical user flows
- **E2E Tests:** Main user journeys
- **Security Tests:** OWASP Top 10 vulnerabilities
- **Performance Tests:** < 500ms API response time

## Next Steps

1. ✅ Complete manual integration testing using checklist
2. ⚠️ Implement unit tests for services
3. ⚠️ Add integration tests for API endpoints
4. ⚠️ Set up E2E tests with Playwright
5. ⚠️ Configure CI/CD pipeline
6. ⚠️ Add performance monitoring
7. ⚠️ Implement error tracking (Sentry)

## Resources

- [Integration Test Checklist](./test-integration.md)
- [Bugs and Fixes Report](./BUGS_AND_FIXES.md)
- [API Documentation](./api-backend/README.md)
- [Deployment Guide](./DEPLOYMENT.md)
