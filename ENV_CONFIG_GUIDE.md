# Правильная конфигурация .env файлов

## Архитектура доменов

- **Mini App**: `app.odindindindun.ru`
- **API Backend**: `api.odindindindun.ru`
- **Bot Webhook**: `api.odindindindun.ru/webhook`

---

## 1. Mini App (.env)

**Путь**: `/var/www/stars-grabber/.env`

```env
VITE_API_URL=https://api.odindindindun.ru
VITE_BOT_USERNAME=catcherstarsbot
```

**Важно**:

- `VITE_BOT_USERNAME` - это username бота (НЕ токен!)
- Без символа `@`

---

## 2. API Backend (.env)

**Путь**: `/var/www/stars-grabber/api-backend/.env`

```env
PORT=3000
NODE_ENV=production
SUPABASE_URL=https://vnpwsfzyzrpojzehvmae.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucHdzZnp5enJwb2p6ZWh2bWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDIzMTMsImV4cCI6MjA3Njk3ODMxM30.jyvB4SlNPimetrWCqYg6x5lO09dTIT9TOtTSKMX6VgA
JWT_SECRET=yazabilsvoyrospisistavlyfanatukakuytoxuynynafutbolke
BOT_TOKEN=8563495078:AAEFNjsJuIgJntrxjV6Aos0NIt4rbR1uKhw
BOT_USERNAME=catcherstarsbot
BOT_BACKEND_URL=http://localhost:3001
INTERNAL_API_KEY=q8aQOE4Qpq75rKL2eLqUB8Mg9xSFrZN9jN08zP19+FE=
ADMIN_TELEGRAM_ID=1327903698
```

**Важно**:

- `INTERNAL_API_KEY` - придумай случайную строку для безопасности связи между API и Bot

---

## 3. Bot Backend (.env)

**Путь**: `/var/www/stars-grabber/bot-backend/.env`

```env
BOT_TOKEN=8563495078:AAEFNjsJuIgJntrxjV6Aos0NIt4rbR1uKhw
SUPABASE_URL=https://vnpwsfzyzrpojzehvmae.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucHdzZnp5enJwb2p6ZWh2bWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDIzMTMsImV4cCI6MjA3Njk3ODMxM30.jyvB4SlNPimetrWCqYg6x5lO09dTIT9TOtTSKMX6VgA
API_URL=http://localhost:3000
BOT_PORT=3001
INTERNAL_API_KEY=q8aQOE4Qpq75rKL2eLqUB8Mg9xSFrZN9jN08zP19+FE=
WEBHOOK_DOMAIN=https://api.odindindindun.ru
WEBHOOK_PATH=/webhook
NODE_ENV=production
ADMIN_TELEGRAM_ID=1327903698
```

**Важно**:

- `API_URL` - `localhost` потому что бот обращается к API внутри сервера
- `WEBHOOK_DOMAIN` - поддомен API, куда Telegram будет отправлять обновления
- `INTERNAL_API_KEY` - должен совпадать с тем что в api-backend

---

## Ключевые моменты

### 1. Поддомены

- Mini App на `app.odindindindun.ru`
- API на `api.odindindindun.ru`
- Webhook на `api.odindindindun.ru/webhook`

### 2. Внутренняя связь

- Bot Backend → API Backend: `http://localhost:3000` (внутри сервера)
- Mini App → API Backend: `https://api.odindindindun.ru` (через интернет)

### 3. Безопасность

- `INTERNAL_API_KEY` - для защиты внутренних эндпоинтов между API и Bot
- `JWT_SECRET` - для подписи JWT токенов пользователей
- Оба должны быть случайными строками минимум 32 символа

### 4. Bot Username vs Bot Token

- **Bot Token**: `8563495078:AAEFNjsJuIgJntrxjV6Aos0NIt4rbR1uKhw` (секретный ключ)
- **Bot Username**: `catcherstarsbot` (публичное имя бота)

---

## Настройка DNS

Тебе нужно добавить A-записи для поддоменов:

```
app.odindindindun.ru  →  IP_твоего_VDS
api.odindindindun.ru  →  IP_твоего_VDS
```

В панели управления доменом (где купил домен):

1. Найди раздел DNS или DNS Records
2. Добавь две A-записи:
   - Host: `app`, Value: `IP_сервера`
   - Host: `api`, Value: `IP_сервера`
3. Сохрани изменения
4. Подожди 5-15 минут пока DNS обновится

---

## Проверка конфигурации

После настройки всех .env файлов, проверь:

```bash
# Проверь что все файлы созданы
ls -la /var/www/stars-grabber/.env
ls -la /var/www/stars-grabber/api-backend/.env
ls -la /var/www/stars-grabber/bot-backend/.env

# Проверь содержимое (убедись что нет опечаток)
cat /var/www/stars-grabber/.env
cat /var/www/stars-grabber/api-backend/.env
cat /var/www/stars-grabber/bot-backend/.env
```
