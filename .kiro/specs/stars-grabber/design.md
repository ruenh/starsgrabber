# Design Document

## Overview

Stars Grabber - это трехкомпонентная система состоящая из:

1. **Telegram Mini App** (SolidJS) - пользовательский интерфейс
2. **API Backend** (Node.js + Express) - REST API для Mini App
3. **Bot Backend** (Node.js + Grammy) - Telegram бот для проверок и уведомлений

Все компоненты взаимодействуют через Supabase PostgreSQL и размещаются на VDS сервере.

## Architecture

### System Architecture Diagram

```
┌─────────────────┐
│  Telegram User  │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────────────┐
│      Telegram Mini App (SolidJS)        │
│  - @tma.js/sdk-solid hooks              │
│  - SolidJS Router                       │
│  - Lottie animations                    │
└────────┬────────────────────────────────┘
         │ HTTPS/REST
         ▼
┌─────────────────────────────────────────┐
│     API Backend (Node.js/Express)       │
│  - Authentication middleware            │
│  - Task management endpoints            │
│  - Withdrawal processing                │
│  - Admin endpoints                      │
└────┬────────────────────────────────┬───┘
     │                                │
     │ Supabase Client                │ Bot API calls
     ▼                                ▼
```

┌──────────────────┐ ┌─────────────────────────┐
│ Supabase │ │ Bot Backend (Grammy) │
│ PostgreSQL │◄─────┤ - Subscription checks │
│ - users │ │ - Notifications │
│ - tasks │ │ - Bot activation track │
│ - transactions │ └─────────────────────────┘
│ - withdrawals │
│ - referrals │
└──────────────────┘

```

### Technology Stack

**Frontend (Mini App):**
- SolidJS 1.9.9
- @tma.js/sdk-solid 3.0.8
- @solidjs/router 0.13.6
- Lottie-web для анимаций
- Vite для сборки

**Backend (API):**
- Node.js 20+
- Express.js
- @supabase/supabase-js
- JWT для аутентификации
- Telegram Bot API для проверок

**Backend (Bot):**
- Node.js 20+
- Grammy (Telegram Bot Framework)
- @supabase/supabase-js

**Database:**
- Supabase (PostgreSQL)
- Row Level Security (RLS) для безопасности

**Hosting:**
- VDS (4 vCPU, 8GB RAM, 80GB SSD)
- PM2 для управления процессами
- Nginx как reverse proxy

## Components and Interfaces

### Frontend Components Structure

```

src/
├── components/
│ ├── layout/
│ │ ├── BottomNav.tsx # Нижняя навигация
│ │ ├── Header.tsx # Шапка с логотипом
│ │ └── AdminButton.tsx # Кнопка админки
│ ├── home/
│ │ ├── BannerCarousel.tsx # Карусель баннеров
│ │ ├── TaskList.tsx # Список заданий
│ │ ├── TaskCard.tsx # Карточка задания
│ │ └── TaskModal.tsx # Модалка задания
│ ├── profile/
│ │ ├── ProfileHeader.tsx # Аватар и имя
│ │ ├── BalanceCard.tsx # Карточка баланса
│ │ ├── HistoryList.tsx # История операций
│ │ └── WithdrawalModal.tsx # Модалка вывода
│ ├── referrals/
│ │ ├── ReferralStats.tsx # Статистика рефералов
│ │ └── ReferralLink.tsx # Реферальная ссылка
│ ├── admin/
│ │ ├── AdminPanel.tsx # Главная админки
│ │ ├── TaskManager.tsx # Управление заданиями
│ │ ├── WithdrawalManager.tsx # Управление выводами
│ │ ├── StatsPanel.tsx # Статистика
│ │ └── ReferralTree.tsx # Дерево рефералов
│ └── shared/
│ ├── Modal.tsx # Базовая модалка
│ ├── Button.tsx # Кнопка
│ ├── LottieAnimation.tsx # Обертка Lottie
│ └── StatusIcon.tsx # Иконки статусов
├── pages/
│ ├── HomePage.tsx # Главная страница
│ ├── ProfilePage.tsx # Профиль
│ ├── ReferralsPage.tsx # Рефералы
│ └── AdminPage.tsx # Админ панель
├── services/
│ ├── api.ts # API клиент
│ ├── auth.ts # Аутентификация
│ └── telegram.ts # TMA SDK хелперы
├── stores/
│ ├── userStore.ts # Стор пользователя
│ ├── tasksStore.ts # Стор заданий
│ └── adminStore.ts # Стор админки
└── types/
└── index.ts # TypeScript типы

```

### API Backend Endpoints

**Authentication:**
```

POST /api/auth/login
Body: { initData: string }
Response: { token: string, user: User }

```

**Tasks:**
```

GET /api/tasks
Headers: { Authorization: Bearer <token> }
Response: { tasks: Task[] }

POST /api/tasks/:id/verify
Headers: { Authorization: Bearer <token> }
Response: { success: boolean, reward: number }

```

**User:**
```

GET /api/user/profile
Headers: { Authorization: Bearer <token> }
Response: { user: User, balance: number }

GET /api/user/history
Headers: { Authorization: Bearer <token> }
Response: { transactions: Transaction[] }

```

**Withdrawals:**
```

POST /api/withdrawals
Headers: { Authorization: Bearer <token> }
Body: { amount: number }
Response: { withdrawal: Withdrawal }

GET /api/withdrawals
Headers: { Authorization: Bearer <token> }
Response: { withdrawals: Withdrawal[] }

```

**Referrals:**
```

GET /api/referrals
Headers: { Authorization: Bearer <token> }
Response: { referrals: User[], totalEarnings: number }

```

**Admin:**
```

POST /api/admin/tasks
Headers: { Authorization: Bearer <token> }
Body: { type, title, reward, target }
Response: { task: Task }

PUT /api/admin/tasks/:id
PATCH /api/admin/tasks/:id/close
DELETE /api/admin/tasks/:id

GET /api/admin/withdrawals
POST /api/admin/withdrawals/:id/approve
POST /api/admin/withdrawals/:id/reject
Body: { reason: string }

GET /api/admin/stats
Response: { totalUsers, totalTasks, totalStars, pendingWithdrawals }

GET /api/admin/referral-tree
Response: { tree: ReferralNode[] }

```

**Banners:**
```

GET /api/banners
Response: { banners: Banner[] }

POST /api/admin/banners
Body: { imageUrl, link, order }

````

## Data Models

### Database Schema

**users**
```sql
CREATE TABLE users (
  id BIGSERIAL PRIMARY KEY,
  telegram_id BIGINT UNIQUE NOT NULL,
  username VARCHAR(255),
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  avatar_url TEXT,
  balance INTEGER DEFAULT 0,
  referrer_id BIGINT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_telegram_id ON users(telegram_id);
CREATE INDEX idx_users_referrer_id ON users(referrer_id);
````

**tasks**

```sql
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'channel' | 'bot'
  title VARCHAR(255) NOT NULL,
  description TEXT,
  reward INTEGER NOT NULL,
  target VARCHAR(255) NOT NULL, -- channel username or bot link
  avatar_url TEXT,
  status VARCHAR(50) DEFAULT 'active', -- 'active' | 'inactive'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_status ON tasks(status);
```

**user_tasks**

```sql
CREATE TABLE user_tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  completed_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

CREATE INDEX idx_user_tasks_user_id ON user_tasks(user_id);
CREATE INDEX idx_user_tasks_task_id ON user_tasks(task_id);
```

**transactions**

```sql
CREATE TABLE transactions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL, -- 'task' | 'referral' | 'withdrawal'
  amount INTEGER NOT NULL, -- positive for earnings, negative for withdrawals
  task_id INTEGER REFERENCES tasks(id),
  referral_id BIGINT REFERENCES users(id),
  withdrawal_id BIGINT REFERENCES withdrawals(id),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_type ON transactions(type);
```

**withdrawals**

```sql
CREATE TABLE withdrawals (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- 'pending' | 'approved' | 'rejected'
  rejection_reason TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

CREATE INDEX idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX idx_withdrawals_status ON withdrawals(status);
```

**bot_activations**

```sql
CREATE TABLE bot_activations (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT REFERENCES users(id) ON DELETE CASCADE,
  task_id INTEGER REFERENCES tasks(id) ON DELETE CASCADE,
  activated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

CREATE INDEX idx_bot_activations_user_task ON bot_activations(user_id, task_id);
```

**banners**

```sql
CREATE TABLE banners (
  id SERIAL PRIMARY KEY,
  image_url TEXT NOT NULL,
  link TEXT NOT NULL,
  order_index INTEGER DEFAULT 0,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_banners_active_order ON banners(active, order_index);
```

### TypeScript Types

```typescript
// User types
interface User {
  id: number;
  telegramId: number;
  username?: string;
  firstName: string;
  lastName?: string;
  avatarUrl?: string;
  balance: number;
  referrerId?: number;
  createdAt: string;
}

// Task types
interface Task {
  id: number;
  type: "channel" | "bot";
  title: string;
  description?: string;
  reward: number;
  target: string;
  avatarUrl?: string;
  status: "active" | "inactive";
  completed?: boolean; // client-side flag
}

// Transaction types
interface Transaction {
  id: number;
  userId: number;
  type: "task" | "referral" | "withdrawal";
  amount: number;
  taskId?: number;
  referralId?: number;
  withdrawalId?: number;
  createdAt: string;
}

// Withdrawal types
interface Withdrawal {
  id: number;
  userId: number;
  amount: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

// Banner types
interface Banner {
  id: number;
  imageUrl: string;
  link: string;
  orderIndex: number;
}

// Referral stats
interface ReferralStats {
  referrals: User[];
  totalEarnings: number;
  totalReferrals: number;
}
```

## Error Handling

### API Error Responses

```typescript
interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Common errors:
// 401 - Unauthorized (invalid token)
// 403 - Forbidden (not admin)
// 404 - Not Found
// 400 - Bad Request (validation errors)
// 500 - Internal Server Error
```

### Frontend Error Handling

- Все API вызовы оборачиваются в try-catch
- Ошибки отображаются через toast notifications
- Критические ошибки логируются в console
- Fallback UI для failed states

### Bot Error Handling

- Retry механизм для Telegram API calls (3 попытки)
- Логирование всех ошибок в файл
- Graceful degradation при недоступности API

## Testing Strategy

### Unit Tests

**Frontend:**

- Тестирование компонентов с @solidjs/testing-library
- Тестирование stores и services
- Моки для TMA SDK

**Backend:**

- Тестирование API endpoints с supertest
- Тестирование middleware
- Моки для Supabase и Telegram API

### Integration Tests

- E2E тесты критических флоу:
  - Регистрация пользователя
  - Выполнение задания
  - Создание заявки на вывод
  - Админ операции

### Manual Testing

- Тестирование в реальном Telegram окружении
- Проверка на разных устройствах (iOS, Android, Desktop)
- Тестирование всех анимаций и переходов

## Security Considerations

### Authentication

- Валидация Telegram initData через crypto signature
- JWT токены с expiration (7 дней)
- Refresh token механизм

### Admin Access

- Hardcoded admin Telegram ID (1327903698)
- Дополнительная проверка на backend
- Rate limiting для admin endpoints

### Data Protection

- Supabase RLS policies
- Prepared statements для SQL queries
- Input validation и sanitization
- HTTPS only

### Bot Security

- Webhook с secret token
- Rate limiting для bot commands
- Проверка chat_id перед отправкой уведомлений

## Performance Optimization

### Frontend

- Code splitting по роутам
- Lazy loading для модалок и админки
- Оптимизация Lottie анимаций (preload)
- Кеширование API responses (SWR pattern)

### Backend

- Database indexes на часто запрашиваемые поля
- Connection pooling для Supabase
- Кеширование активных заданий в памяти
- Pagination для списков

### Database

- Composite indexes для сложных запросов
- Materialized views для статистики
- Регулярная очистка старых транзакций

## Deployment Strategy

### Build Process

```bash
# Frontend
cd mini-app
npm run build
# Output: dist/

# API Backend
cd api-backend
npm run build
# Output: dist/

# Bot Backend
cd bot-backend
npm run build
# Output: dist/
```

### VDS Setup

```bash
# Install dependencies
apt update && apt install -y nodejs npm nginx pm2

# Setup Nginx reverse proxy
# /etc/nginx/sites-available/stars-grabber

# PM2 ecosystem
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### Environment Variables

```env
# API Backend
PORT=3000
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
JWT_SECRET=xxx
BOT_TOKEN=8361363925:AAG8uDBzayQrTfnHHTVej8_SxNt37WGETf8
ADMIN_TELEGRAM_ID=1327903698

# Bot Backend
BOT_TOKEN=8361363925:AAG8uDBzayQrTfnHHTVej8_SxNt37WGETf8
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_KEY=xxx
API_URL=http://localhost:3000
WEBHOOK_DOMAIN=https://yourdomain.com
```

### Monitoring

- PM2 monitoring для процессов
- Nginx access/error logs
- Application logs через Winston
- Supabase dashboard для database metrics

## UI/UX Design Specifications

### Color Palette

```css
:root {
  --bg-primary: #000000;
  --bg-secondary: #1a1a1a;
  --bg-tertiary: #2a2a2a;

  --text-primary: #ffffff;
  --text-secondary: #6b7280;
  --text-tertiary: #9ca3af;

  --accent-green: #10b981;
  --accent-red: #ef4444;
  --accent-yellow: #f59e0b;

  --border-default: #374151;
  --border-error: #ef4444;
}
```

### Typography

```css
/* Используем системный шрифт похожий на дизайн */
font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto",
  "Helvetica", "Arial", sans-serif;

/* Sizes */
--text-xs: 12px;
--text-sm: 14px;
--text-base: 16px;
--text-lg: 18px;
--text-xl: 20px;
--text-2xl: 24px;
```

### Spacing

```css
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 16px;
--spacing-lg: 24px;
--spacing-xl: 32px;
```

### Border Radius

```css
--radius-sm: 8px;
--radius-md: 12px;
--radius-lg: 16px;
--radius-full: 9999px;
```

### Animations

```css
/* Transitions */
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;

/* Lottie animations */
- stars-reward.json (при получении звезд)
- loading.json (загрузка)
```

### Component Specifications

**Bottom Navigation:**

- Height: 64px
- Background: var(--bg-secondary)
- Icons: 24x24px
- Active state: accent color + scale(1.1)

**Task Card:**

- Padding: 16px
- Background: var(--bg-secondary)
- Border radius: var(--radius-md)
- Button: white bg, black text, 80px width

**Modal:**

- Max width: 90vw
- Background: var(--bg-secondary)
- Backdrop: rgba(0,0,0,0.8)
- Animation: slide up + fade in

**Banner Carousel:**

- Height: 120px
- Aspect ratio: 16:9
- Snap scroll behavior
- Indicators: dots below

## Integration Points

### TMA SDK Integration

```typescript
import {
  useSignal,
  initData,
  themeParams,
  miniApp,
  backButton,
  mainButton,
  popup,
} from "@tma.js/sdk-solid";

// Get user data
const userData = useSignal(initData.state);

// Theme integration
const theme = useSignal(themeParams.state);

// Back button
backButton.show();
backButton.onClick(() => navigate(-1));

// Main button (для админки)
mainButton.setText("Сохранить");
mainButton.onClick(handleSave);

// Popups
popup.open({
  title: "Ошибка",
  message: "Недостаточно звезд",
  buttons: [{ type: "ok" }],
});
```

### Supabase Integration

```typescript
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Example query
const { data, error } = await supabase
  .from("tasks")
  .select("*")
  .eq("status", "active")
  .order("created_at", { ascending: false });
```

### Telegram Bot API Integration

```typescript
import { Bot } from "grammy";

const bot = new Bot(process.env.BOT_TOKEN);

// Check subscription
async function checkSubscription(userId: number, channelUsername: string) {
  try {
    const member = await bot.api.getChatMember(`@${channelUsername}`, userId);
    return ["member", "administrator", "creator"].includes(member.status);
  } catch {
    return false;
  }
}

// Send notification
async function notifyUser(userId: number, message: string) {
  await bot.api.sendMessage(userId, message);
}
```

## Future Enhancements

- Мультиязычность (английский, украинский)
- Автоматические выплаты через Telegram Stars API
- Gamification (уровни, достижения)
- Ежедневные бонусы
- Конкурсы и лидерборды
- Push уведомления через Service Worker
- Темная/светлая тема переключение
- Экспорт статистики в CSV (админка)
