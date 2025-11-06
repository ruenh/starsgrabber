# Notification System

This notification system implements all requirements from Requirement 14 (Notification System).

## Architecture

The notification system consists of two parts:

1. **Bot Backend** (`bot-backend/src/services/notificationService.ts`)

   - Contains the actual notification logic
   - Sends messages via Telegram Bot API
   - Handles batch notifications with rate limiting

2. **API Backend** (`api-backend/src/services/notificationService.ts`)
   - HTTP client that calls Bot Backend endpoints
   - Used by API controllers to trigger notifications
   - Handles errors gracefully

## Notification Types

### 1. New Task Notification (Requirement 14.1)

**Trigger**: When admin creates a new task
**Recipients**: All users
**Implementation**: `NotificationService.notifyNewTask()`

```typescript
await NotificationService.notifyNewTask("Subscribe to Channel", 50, "channel");
```

### 2. Referral Completion Notification (Requirement 14.2)

**Trigger**: When a referral completes a task
**Recipients**: The referrer user
**Implementation**: `NotificationService.notifyReferralCompletion()`

```typescript
await NotificationService.notifyReferralCompletion(
  referrerId,
  "John Doe",
  5,
  "Subscribe to Channel"
);
```

### 3. Withdrawal Approval Notification (Requirement 14.3)

**Trigger**: When admin approves a withdrawal request
**Recipients**: The user who requested withdrawal
**Implementation**: `NotificationService.notifyWithdrawalApproved()`

```typescript
await NotificationService.notifyWithdrawalApproved(userId, 100);
```

### 4. Withdrawal Rejection Notification (Requirement 14.4)

**Trigger**: When admin rejects a withdrawal request
**Recipients**: The user who requested withdrawal
**Implementation**: `NotificationService.notifyWithdrawalRejected()`

```typescript
await NotificationService.notifyWithdrawalRejected(
  userId,
  100,
  "Insufficient balance"
);
```

### 5. Admin Withdrawal Request Notification (Requirement 14.5)

**Trigger**: When a user creates a withdrawal request
**Recipients**: Admin
**Implementation**: `NotificationService.notifyAdminWithdrawalRequest()`

```typescript
await NotificationService.notifyAdminWithdrawalRequest(
  "johndoe",
  100,
  userId,
  withdrawalId
);
```

## HTTP Endpoints

The Bot Backend exposes HTTP endpoints for the API Backend to call:

- `POST /notifications/new-task`
- `POST /notifications/referral-completion`
- `POST /notifications/withdrawal-approved`
- `POST /notifications/withdrawal-rejected`
- `POST /notifications/admin-withdrawal-request`

All endpoints require the `X-API-Key` header for authentication.

## Configuration

### Bot Backend (.env)

```env
BOT_TOKEN=your-bot-token
BOT_PORT=3001
INTERNAL_API_KEY=your-secret-key
ADMIN_TELEGRAM_ID=1327903698
```

### API Backend (.env)

```env
BOT_BACKEND_URL=http://localhost:3001
INTERNAL_API_KEY=your-secret-key
```

## Usage in API Controllers

```typescript
import { NotificationService } from "../services/notificationService.js";

// In task creation endpoint
await NotificationService.notifyNewTask(task.title, task.reward, task.type);

// In task completion endpoint
if (referrerId) {
  await NotificationService.notifyReferralCompletion(
    referrerId,
    user.firstName,
    referralEarnings,
    task.title
  );
}

// In withdrawal approval endpoint
await NotificationService.notifyWithdrawalApproved(userId, amount);

// In withdrawal creation endpoint
await NotificationService.notifyAdminWithdrawalRequest(
  user.username,
  amount,
  userId,
  withdrawalId
);
```

## Rate Limiting

The notification service includes built-in rate limiting for batch notifications:

- 50ms delay between messages by default
- Prevents Telegram API rate limit errors
- Configurable via `batchNotify()` method

## Error Handling

- All notification methods catch and log errors
- Failed notifications don't block the main operation
- Errors are logged with Winston for monitoring
- HTTP client has 10-second timeout

## Testing

To test notifications manually:

```bash
# Start bot backend
cd bot-backend
npm run dev

# In another terminal, test with curl
curl -X POST http://localhost:3001/notifications/new-task \
  -H "Content-Type: application/json" \
  -H "X-API-Key: your-secret-key" \
  -d '{"taskTitle":"Test Task","reward":50,"taskType":"channel"}'
```
