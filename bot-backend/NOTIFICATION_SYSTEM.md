# Notification System Implementation

## Overview

The notification system has been fully implemented according to Requirements 14.1-14.5. It consists of two main components:

1. **Bot Backend** - Handles actual Telegram message sending
2. **API Backend** - HTTP client to trigger notifications

## Implementation Details

### Bot Backend Components

#### 1. NotificationService (`bot-backend/src/services/notificationService.ts`)

Core service that sends Telegram messages via Bot API.

**Methods:**

- `notifyUser(userId, message)` - Send message to specific user
- `notifyNewTask(taskTitle, reward, taskType)` - Notify all users about new task (Req 14.1)
- `notifyReferralCompletion(userId, referralName, earnings, taskTitle)` - Notify referrer (Req 14.2)
- `notifyWithdrawalApproved(userId, amount)` - Notify user of approval (Req 14.3)
- `notifyWithdrawalRejected(userId, amount, reason)` - Notify user of rejection (Req 14.4)
- `notifyAdminWithdrawalRequest(username, amount, userId, withdrawalId)` - Notify admin (Req 14.5)
- `batchNotify(userIds, message, delayMs)` - Batch send with rate limiting

#### 2. NotificationController (`bot-backend/src/controllers/notificationController.ts`)

Controller layer that wraps NotificationService methods for HTTP endpoints.

#### 3. Notification Routes (`bot-backend/src/routes/notificationRoutes.ts`)

Express routes for notification endpoints:

- `POST /notifications/new-task`
- `POST /notifications/referral-completion`
- `POST /notifications/withdrawal-approved`
- `POST /notifications/withdrawal-rejected`
- `POST /notifications/admin-withdrawal-request`

All routes are protected with API key authentication via `X-API-Key` header.

#### 4. HTTP Server (`bot-backend/src/index.ts`)

Express server running on port 3001 (configurable via `BOT_PORT` env var) alongside the Telegram bot.

### API Backend Components

#### NotificationService (`api-backend/src/services/notificationService.ts`)

HTTP client that calls Bot Backend notification endpoints.

**Methods:**

- `notifyNewTask(taskTitle, reward, taskType)`
- `notifyReferralCompletion(userId, referralName, earnings, taskTitle)`
- `notifyWithdrawalApproved(userId, amount)`
- `notifyWithdrawalRejected(userId, amount, reason)`
- `notifyAdminWithdrawalRequest(username, amount, userId, withdrawalId)`

All methods return `Promise<boolean>` indicating success/failure.

## Configuration

### Environment Variables

**Bot Backend (.env):**

```env
BOT_TOKEN=your-bot-token
BOT_PORT=3001
INTERNAL_API_KEY=your-secret-key
ADMIN_TELEGRAM_ID=1327903698
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
```

**API Backend (.env):**

```env
BOT_BACKEND_URL=http://localhost:3001
INTERNAL_API_KEY=your-secret-key
```

## Usage Examples

### From API Backend Controllers

```typescript
import { NotificationService } from "../services/notificationService.js";

// When creating a new task
await NotificationService.notifyNewTask(task.title, task.reward, task.type);

// When referral completes a task
if (user.referrerId) {
  await NotificationService.notifyReferralCompletion(
    user.referrerId,
    user.firstName,
    referralEarnings,
    task.title
  );
}

// When approving withdrawal
await NotificationService.notifyWithdrawalApproved(
  withdrawal.userId,
  withdrawal.amount
);

// When rejecting withdrawal
await NotificationService.notifyWithdrawalRejected(
  withdrawal.userId,
  withdrawal.amount,
  "Insufficient balance"
);

// When user creates withdrawal request
await NotificationService.notifyAdminWithdrawalRequest(
  user.username,
  amount,
  user.id,
  withdrawal.id
);
```

## Features

### Rate Limiting

- Built-in 50ms delay between batch notifications
- Prevents Telegram API rate limit errors
- Configurable delay via `batchNotify()` method

### Error Handling

- All notification failures are logged but don't block main operations
- HTTP client has 10-second timeout
- Graceful degradation if Bot Backend is unavailable

### Security

- API key authentication for all endpoints
- Validates `X-API-Key` header matches `INTERNAL_API_KEY`
- Only API Backend can trigger notifications

### Logging

- Winston logger for all notification events
- Success/failure tracking
- Detailed error messages

## Testing

### Manual Testing

1. Start Bot Backend:

```bash
cd bot-backend
npm run dev
```

2. Run test script:

```bash
npx tsx test-notifications.ts
```

3. Or test with curl:

```bash
curl -X POST http://localhost:3001/notifications/new-task \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"taskTitle":"Test Task","reward":50,"taskType":"channel"}'
```

## Requirements Coverage

✅ **Requirement 14.1**: New task notifications to all users
✅ **Requirement 14.2**: Referral completion notifications
✅ **Requirement 14.3**: Withdrawal approval notifications
✅ **Requirement 14.4**: Withdrawal rejection notifications with reason
✅ **Requirement 14.5**: Admin withdrawal request notifications

## Dependencies Added

**Bot Backend:**

- `express@^4.18.2`
- `@types/express@^4.17.21`

**API Backend:**

- `axios@^1.6.2`

## Next Steps

To integrate the notification system into your application:

1. Install dependencies:

   ```bash
   cd bot-backend && npm install
   cd ../api-backend && npm install
   ```

2. Configure environment variables in both backends

3. Import and use `NotificationService` in your API controllers:

   - Task creation endpoints
   - Task completion endpoints
   - Withdrawal management endpoints
   - Referral tracking logic

4. Start both backends:

   ```bash
   # Terminal 1
   cd bot-backend && npm run dev

   # Terminal 2
   cd api-backend && npm run dev
   ```

## Architecture Diagram

```
┌─────────────────┐
│  API Backend    │
│  Controllers    │
└────────┬────────┘
         │ HTTP POST
         ▼
┌─────────────────────────────┐
│  API Backend                │
│  NotificationService        │
│  (HTTP Client)              │
└────────┬────────────────────┘
         │ HTTP POST with API Key
         ▼
┌─────────────────────────────┐
│  Bot Backend                │
│  Express Server :3001       │
│  /notifications/*           │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Bot Backend                │
│  NotificationController     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Bot Backend                │
│  NotificationService        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Telegram Bot API           │
│  sendMessage()              │
└─────────────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│  Telegram Users             │
└─────────────────────────────┘
```
