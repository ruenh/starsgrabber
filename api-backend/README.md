# Stars Grabber API Backend

REST API backend for Stars Grabber Telegram Mini App.

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
   - Supabase URL and Key
   - JWT Secret
   - Bot Token
   - Admin Telegram ID

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

## Project Structure

```
src/
├── config/          # Configuration files (Supabase, etc.)
├── middleware/      # Express middleware
├── routes/          # API route handlers
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Application entry point
```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login with Telegram initData

### Tasks

- `GET /api/tasks` - Get all active tasks
- `POST /api/tasks/:id/verify` - Verify task completion

### User

- `GET /api/user/profile` - Get user profile
- `GET /api/user/history` - Get transaction history

### Withdrawals

- `POST /api/withdrawals` - Create withdrawal request
- `GET /api/withdrawals` - Get user withdrawals

### Referrals

- `GET /api/referrals` - Get referral stats

### Admin

- `POST /api/admin/tasks` - Create task
- `PUT /api/admin/tasks/:id` - Update task
- `PATCH /api/admin/tasks/:id/close` - Close task
- `GET /api/admin/withdrawals` - Get all withdrawals
- `POST /api/admin/withdrawals/:id/approve` - Approve withdrawal
- `POST /api/admin/withdrawals/:id/reject` - Reject withdrawal
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/referral-tree` - Get referral tree

### Banners

- `GET /api/banners` - Get active banners
- `POST /api/admin/banners` - Create banner (admin only)
