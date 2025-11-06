# Quick Test Reference Card

## 🚀 Quick Start

```bash
# 1. Run automated API tests
chmod +x test-api.sh && ./test-api.sh

# 2. Check services are running
curl http://localhost:3000/health  # API Backend
curl http://localhost:3001/health  # Bot Backend

# 3. Open manual test checklist
cat test-integration.md
```

## 🔍 Quick Checks

### Check User Balance

```sql
SELECT telegram_id, username, balance FROM users WHERE telegram_id = <id>;
```

### Check Recent Transactions

```sql
SELECT * FROM transactions WHERE user_id = <id> ORDER BY created_at DESC LIMIT 10;
```

### Check Pending Withdrawals

```sql
SELECT * FROM withdrawals WHERE status = 'pending' ORDER BY created_at DESC;
```

### Check Active Tasks

```sql
SELECT id, title, reward, type FROM tasks WHERE status = 'active';
```

## 📊 View Logs

```bash
# API logs
tail -f api-backend/logs/combined.log

# Bot logs
tail -f bot-backend/logs/combined.log

# PM2 logs (production)
pm2 logs
```

## 🐛 Common Issues

| Issue              | Quick Fix                                        |
| ------------------ | ------------------------------------------------ |
| CORS error         | Add origin to `ALLOWED_ORIGINS` in `.env`        |
| Rate limited       | Wait 15 minutes or disable limiter temporarily   |
| Invalid token      | Clear localStorage and re-authenticate           |
| Bot not in channel | Add bot as admin with "View Messages" permission |
| Database error     | Check Supabase credentials in `.env`             |

## 🧪 Test Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Login (will fail without valid initData)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"initData":"test"}'

# Get tasks (requires token)
curl http://localhost:3000/api/tasks \
  -H "Authorization: Bearer <token>"
```

## 📝 Test Checklist

- [ ] API health check passes
- [ ] Bot health check passes
- [ ] User can register/login
- [ ] Tasks load correctly
- [ ] Task verification works
- [ ] Referral system works
- [ ] Withdrawal creation works
- [ ] Admin panel accessible (admin only)
- [ ] Notifications sent correctly
- [ ] Rate limiting works
- [ ] Input validation works
- [ ] CORS configured correctly

## 🔐 Security Checks

- [ ] CORS allows only specific origins
- [ ] Rate limiting enabled on all endpoints
- [ ] Input validation on all user inputs
- [ ] Admin endpoints require admin token
- [ ] SQL injection prevented
- [ ] XSS attacks prevented

## 📚 Documentation

- `test-integration.md` - 50 detailed test cases
- `test-api.sh` - Automated API tests
- `TESTING_GUIDE.md` - Complete testing guide
- `BUGS_AND_FIXES.md` - Known issues and fixes
- `INTEGRATION_TEST_SUMMARY.md` - Work summary

## 🎯 Priority Tests

### Critical (Must Pass)

1. User authentication
2. Task verification
3. Balance updates
4. Withdrawal creation
5. Admin access control

### Important (Should Pass)

1. Referral tracking
2. Notification delivery
3. Rate limiting
4. Input validation
5. Error handling

### Nice to Have

1. UI animations
2. Performance metrics
3. Load testing
4. Security audit

## 🚨 Emergency Commands

```bash
# Restart all services
pm2 restart all

# Clear rate limit (restart API)
pm2 restart api-backend

# Check database connection
curl "https://<project>.supabase.co/rest/v1/users?select=count" \
  -H "apikey: <key>"

# View error logs only
tail -f api-backend/logs/error.log
```

## ✅ Success Criteria

- All automated tests pass
- Manual integration tests complete
- No critical bugs found
- Security checks pass
- Performance acceptable (<500ms API response)
- Documentation complete

## 📞 Need Help?

1. Check `TESTING_GUIDE.md` for detailed procedures
2. Review `BUGS_AND_FIXES.md` for known issues
3. Check logs for error details
4. Use SQL queries to inspect database
5. Verify environment variables are correct
