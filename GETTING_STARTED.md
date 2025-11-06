# Getting Started with Stars Grabber

This guide will help you get Stars Grabber up and running on your local machine for development.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 20+** - [Download](https://nodejs.org/)
- **npm** or **pnpm** - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)

You'll also need:

- **Supabase Account** - [Sign up](https://supabase.com)
- **Telegram Bot Token** - Get from [@BotFather](https://t.me/BotFather)
- **Telegram Account** - For testing the Mini App

## Step-by-Step Setup

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd stars-grabber
```

### 2. Run Setup Script

The setup script will install all dependencies and create .env files:

```bash
chmod +x setup.sh
./setup.sh
```

Or manually:

```bash
# Install Mini App dependencies
npm install

# Install API Backend dependencies
cd api-backend && npm install && cd ..

# Install Bot Backend dependencies
cd bot-backend && npm install && cd ..
```

### 3. Setup Supabase Database

1. Go to [supabase.com](https://supabase.com) and create a new project
2. Wait for the project to be ready (takes ~2 minutes)
3. Go to **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy the entire contents of `supabase/schema.sql`
6. Paste into the SQL Editor and click **Run**
7. You should see "Success. No rows returned"

### 4. Get Supabase Credentials

1. In your Supabase project, go to **Settings** > **API**
2. Copy the **Project URL** (looks like `https://xxxxx.supabase.co`)
3. Copy the **anon public** key (long string starting with `eyJ...`)

### 5. Create Telegram Bot

1. Open Telegram and search for [@BotFather](https://t.me/BotFather)
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Copy the **Bot Token** (looks like `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)
5. Send `/setcommands` to BotFather
6. Select your bot
7. Send: `start - Start bot`

### 6. Configure Environment Variables

#### Mini App (.env)

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_API_URL=http://localhost:3000
VITE_BOT_USERNAME=YourBotUsername  # Without @
```

#### API Backend (api-backend/.env)

```bash
cd api-backend
cp .env.example .env
```

Edit `api-backend/.env`:

```env
PORT=3000
NODE_ENV=development

SUPABASE_URL=https://xxxxx.supabase.co  # Your Supabase URL
SUPABASE_KEY=eyJ...                      # Your Supabase anon key

JWT_SECRET=your-random-secret-key-change-this

BOT_TOKEN=1234567890:ABC...              # Your bot token

ADMIN_TELEGRAM_ID=1327903698             # Your Telegram ID
```

To get your Telegram ID:

1. Message [@userinfobot](https://t.me/userinfobot)
2. It will reply with your ID

#### Bot Backend (bot-backend/.env)

```bash
cd bot-backend
cp .env.example .env
```

Edit `bot-backend/.env`:

```env
BOT_TOKEN=1234567890:ABC...              # Same bot token

SUPABASE_URL=https://xxxxx.supabase.co  # Same Supabase URL
SUPABASE_KEY=eyJ...                      # Same Supabase key

API_URL=http://localhost:3000

NODE_ENV=development

ADMIN_TELEGRAM_ID=1327903698             # Same Telegram ID
```

### 7. Start Development Servers

You'll need **three terminal windows**:

#### Terminal 1: API Backend

```bash
cd api-backend
npm run dev
```

You should see:

```
API Backend running on port 3000
Environment: development
```

#### Terminal 2: Bot Backend

```bash
cd bot-backend
npm run dev
```

You should see:

```
Bot started in polling mode
```

#### Terminal 3: Mini App

```bash
npm run dev
```

You should see:

```
VITE ready in XXX ms
Local: http://localhost:5173/
```

### 8. Test the Setup

#### Test API Backend

Open browser or use curl:

```bash
curl http://localhost:3000/health
```

Should return:

```json
{ "status": "ok", "timestamp": "2024-..." }
```

#### Test Bot

1. Open Telegram
2. Search for your bot
3. Send `/start`
4. Bot should reply with welcome message

#### Test Mini App

1. Open http://localhost:5173 in your browser
2. You should see the Mini App interface

## Development Workflow

### Making Changes

1. **Mini App Changes**: Edit files in `src/`, changes will hot-reload
2. **API Backend Changes**: Edit files in `api-backend/src/`, server will restart automatically
3. **Bot Backend Changes**: Edit files in `bot-backend/src/`, bot will restart automatically

### Adding a Test Task

To test the app, add a test task to the database:

1. Go to Supabase dashboard
2. Click **Table Editor**
3. Select **tasks** table
4. Click **Insert row**
5. Fill in:
   - type: `channel`
   - title: `Test Task`
   - description: `Subscribe to test channel`
   - reward: `10`
   - target: `your_test_channel` (without @)
   - status: `active`
6. Click **Save**

### Testing in Telegram

To test the Mini App in actual Telegram:

1. Go to [@BotFather](https://t.me/BotFather)
2. Send `/newapp`
3. Select your bot
4. Follow prompts to create Mini App
5. For Web App URL, use your ngrok/tunneling URL

For local development, use a tunneling service:

```bash
# Install ngrok
npm install -g ngrok

# Tunnel your local server
ngrok http 5173
```

Use the ngrok URL as your Mini App URL.

## Common Issues

### Port Already in Use

If you see "Port 3000 is already in use":

```bash
# Find and kill the process
# On Linux/Mac:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Bot Not Responding

1. Check bot token is correct
2. Check bot backend is running
3. Check logs for errors: `cd bot-backend && npm run dev`

### Database Connection Error

1. Verify Supabase URL and key are correct
2. Check Supabase project is active
3. Verify schema.sql was executed successfully

### Mini App Not Loading

1. Check API backend is running
2. Verify VITE_API_URL in .env is correct
3. Check browser console for errors

## Next Steps

Once everything is running:

1. Read the [Project README](PROJECT_README.md) for architecture overview
2. Check [API Backend README](api-backend/README.md) for API documentation
3. Check [Bot Backend README](bot-backend/README.md) for bot features
4. Review the [Deployment Guide](DEPLOYMENT.md) when ready to deploy

## Getting Help

- Check the logs in each terminal window
- Review error messages carefully
- Ensure all environment variables are set correctly
- Make sure all three services are running

## Development Tips

- Use `console.log()` for debugging in Mini App
- Check `api-backend/logs/` for API logs
- Check `bot-backend/logs/` for bot logs
- Use Supabase Table Editor to inspect database
- Test API endpoints with Postman or curl
- Use Telegram's Web App debug mode for Mini App testing

Happy coding! 🚀
