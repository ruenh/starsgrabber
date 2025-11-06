# Stars Grabber Bot Backend

Telegram Bot for Stars Grabber - handles subscription verification, bot activation tracking, and notifications.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

3. Update `.env` with your credentials:

   - Bot Token (from @BotFather)
   - Supabase URL and Key
   - API Backend URL
   - Admin Telegram ID

4. Configure your bot with @BotFather:
   - Set bot commands
   - Add bot to channels as administrator (for subscription checks)

## Development

Run in development mode with hot reload:

```bash
npm run dev
```

## Build

Build for production:

```bash
npm run build
```

## Production

Start production server:

```bash
npm start
```

## Bot Commands

- `/start` - Start bot and track bot activation tasks

## Features

### Subscription Verification

The bot checks if users are subscribed to specified Telegram channels using the `getChatMember` API method.

### Bot Activation Tracking

When users click bot activation links with tracking parameters, the bot records the activation in the database.

### Notifications

The bot sends notifications for:

- New tasks created
- Referral completions
- Withdrawal approvals/rejections
- Admin alerts for withdrawal requests

## Project Structure

```
src/
├── config/          # Configuration files (Supabase, etc.)
├── services/        # Business logic (verification, notifications)
├── utils/           # Utility functions (logger)
└── index.ts         # Bot entry point
```

## Important Notes

- The bot must be added as an administrator to all channels used for subscription tasks
- Bot activation links format: `https://t.me/YourBot?start=task_<taskId>_user_<userId>`
- In production, use webhooks instead of polling for better performance
