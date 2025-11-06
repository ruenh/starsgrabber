# Stars Grabber

Telegram Mini App for earning Telegram Stars by completing tasks (channel subscriptions and bot activations) with a referral system.

## 🏗️ Architecture

The project consists of three main components:

1. **Mini App** (SolidJS) - User interface running inside Telegram
2. **API Backend** (Node.js + Express) - REST API for the Mini App
3. **Bot Backend** (Node.js + Grammy) - Telegram bot for verification and notifications

All components use **Supabase** (PostgreSQL) as the database.

## 📁 Project Structure

```
stars-grabber/
├── src/                    # Mini App source code (SolidJS)
├── api-backend/            # API Backend (Express + TypeScript)
├── bot-backend/            # Bot Backend (Grammy + TypeScript)
├── supabase/               # Database schema and setup
├── public/                 # Mini App public assets
├── ecosystem.config.cjs    # PM2 configuration
├── deploy.sh               # Deployment script
├── nginx.conf.example      # Nginx configuration template
└── DEPLOYMENT.md           # Deployment guide
```

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- Telegram Bot Token (from @BotFather)

### 1. Setup Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor
3. Copy and execute the SQL from `supabase/schema.sql`
4. Get your project URL and anon key from Settings > API

### 2. Setup API Backend

```bash
cd api-backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 3. Setup Bot Backend

```bash
cd bot-backend
npm install
cp .env.example .env
# Edit .env with your credentials
npm run dev
```

### 4. Setup Mini App

```bash
# In root directory
npm install
cp .env.example .env
# Edit .env with your API URL and bot username
npm run dev
```

## 🔧 Development

### Mini App

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

### API Backend

```bash
cd api-backend
npm run dev          # Start with hot reload
npm run build        # Build TypeScript
npm start            # Start production server
```

### Bot Backend

```bash
cd bot-backend
npm run dev          # Start with hot reload
npm run build        # Build TypeScript
npm start            # Start production server
```

## 📦 Features

### User Features

- ✅ Telegram authentication
- ✅ Task completion (channel subscriptions, bot activations)
- ✅ Real-time balance tracking
- ✅ Transaction history
- ✅ Referral system (5% earnings from referrals)
- ✅ Withdrawal requests
- ✅ Banner advertisements

### Admin Features

- ✅ Task management (create, edit, close)
- ✅ Withdrawal approval/rejection
- ✅ System statistics
- ✅ Referral tree visualization
- ✅ Banner management

### Technical Features

- ✅ JWT authentication
- ✅ Telegram initData validation
- ✅ Channel subscription verification
- ✅ Bot activation tracking
- ✅ Automated notifications
- ✅ Transaction logging
- ✅ Error handling and logging

## 🎨 Tech Stack

### Frontend (Mini App)

- SolidJS 1.9.9
- @tma.js/sdk-solid 3.0.8
- @solidjs/router 0.13.6
- Vite
- TypeScript

### Backend (API)

- Node.js 20+
- Express.js
- TypeScript
- @supabase/supabase-js
- JWT
- Winston (logging)

### Backend (Bot)

- Node.js 20+
- Grammy (Telegram Bot Framework)
- TypeScript
- @supabase/supabase-js
- Winston (logging)

### Database

- Supabase (PostgreSQL)

### Deployment

- PM2 (process management)
- Nginx (reverse proxy)
- VDS/VPS server

## 📚 Documentation

- [Deployment Guide](DEPLOYMENT.md) - Complete deployment instructions
- [API Backend README](api-backend/README.md) - API documentation
- [Bot Backend README](bot-backend/README.md) - Bot documentation
- [Supabase Setup](supabase/README.md) - Database setup

## 🔐 Environment Variables

### Mini App (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_BOT_USERNAME=YourBotUsername
```

### API Backend (api-backend/.env)

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
JWT_SECRET=your-secret-key
BOT_TOKEN=your-bot-token
ADMIN_TELEGRAM_ID=1327903698
```

### Bot Backend (bot-backend/.env)

```env
BOT_TOKEN=your-bot-token
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key
API_URL=http://localhost:3000
WEBHOOK_DOMAIN=https://yourdomain.com
ADMIN_TELEGRAM_ID=1327903698
```

## 🚢 Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for complete deployment instructions.

Quick deployment:

```bash
./deploy.sh
```

## 📝 License

MIT

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, please open an issue in the repository.
