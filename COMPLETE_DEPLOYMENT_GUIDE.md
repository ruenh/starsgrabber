# Полный гайд по развертыванию Stars Grabber с нуля

Этот гайд проведет тебя через весь процесс развертывания проекта от начала до конца.

## 📋 Что у тебя уже есть

- ✅ VDS сервер
- ✅ Домен
- ✅ Supabase аккаунт
- ✅ Telegram Bot Token

## 🎯 Что мы будем делать

1. Настроим Supabase базу данных
2. Настроим VDS сервер
3. Развернем код на сервере
4. Настроим Nginx и SSL
5. Запустим все сервисы
6. Настроим Telegram бота

---

## Шаг 1: Настройка Supabase (5 минут)

### 1.1 Создай базу данных

1. Открой [supabase.com](https://supabase.com)
2. Войди в свой аккаунт
3. Нажми **"New Project"**
4. Заполни:
   - **Name**: `stars-grabber` (или любое имя)
   - **Database Password**: придумай надежный пароль (сохрани его!)
   - **Region**: выбери ближайший к твоему VDS
5. Нажми **"Create new project"**
6. Подожди 2-3 минуты пока проект создается

### 1.2 Выполни SQL скрипт

1. В левом меню нажми **"SQL Editor"**
2. Нажми **"New Query"**
3. Открой файл `supabase/schema.sql` из твоего проекта
4. Скопируй **весь** его содержимое
5. Вставь в SQL Editor
6. Нажми **"Run"** (или Ctrl+Enter)
7. Должно появиться: **"Success. No rows returned"**

### 1.3 Получи credentials

1. В левом меню нажми **"Settings"** (шестеренка внизу)
2. Нажми **"API"**
3. Найди и скопируй:
   - **Project URL** (например: `https://abcdefgh.supabase.co`)
   - **anon public key** (длинная строка начинающаяся с `eyJ...`)

**Сохрани эти данные! Они понадобятся позже.**

---

## Шаг 2: Подготовка VDS сервера (15 минут)

### 2.1 Подключись к серверу

```bash
ssh root@твой_ip_адрес
```

### 2.2 Обнови систему

```bash
apt update && apt upgrade -y
```

### 2.3 Установи Node.js 20

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
```

Проверь установку:

```bash
node -v  # Должно показать v20.x.x
npm -v   # Должно показать 10.x.x
```

### 2.4 Установи PM2

```bash
npm install -g pm2
```

### 2.5 Установи Nginx

```bash
apt install -y nginx
```

### 2.6 Установи Certbot (для SSL)

```bash
apt install -y certbot python3-certbot-nginx
```

### 2.7 Настрой firewall

```bash
ufw allow 22    # SSH
ufw allow 80    # HTTP
ufw allow 443   # HTTPS
ufw enable
```

---

## Шаг 3: Разверни код на сервере (10 минут)

### 3.1 Клонируй репозиторий

```bash
cd /var/www
git clone <URL_твоего_репозитория> stars-grabber
cd stars-grabber
```

### 3.2 Установи зависимости

```bash
# Mini App
npm install

# API Backend
cd api-backend
npm install
cd ..

# Bot Backend
cd bot-backend
npm install
cd ..
```

---

## Шаг 4: Настрой переменные окружения (10 минут)

### 4.1 Получи свой Telegram ID

1. Открой Telegram
2. Найди бота [@userinfobot](https://t.me/userinfobot)
3. Отправь ему любое сообщение
4. Он ответит твоим ID (например: `123456789`)

**Сохрани этот ID!**

### 4.2 Настрой Mini App

```bash
cd /var/www/stars-grabber
cp .env.example .env
nano .env
```

Заполни:

```env
VITE_API_URL=https://api.odindindindun.ru
VITE_BOT_USERNAME=catcherstarsbot
```

**Важно**: `VITE_BOT_USERNAME` без символа `@`

Сохрани: `Ctrl+O`, `Enter`, `Ctrl+X`

### 4.3 Настрой API Backend

```bash
cd api-backend
cp .env.example .env
nano .env
```

Заполни:

```env
PORT=3000
NODE_ENV=production
SUPABASE_URL=https://vnpwsfzyzrpojzehvmae.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucHdzZnp5enJwb2p6ZWh2bWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDIzMTMsImV4cCI6MjA3Njk3ODMxM30.jyvB4SlNPimetrWCqYg6x5lO09dTIT9TOtTSKMX6VgA
JWT_SECRET=yazabilsvoyrospisistavlyfanatukakuytoxuynynafutbolke
BOT_TOKEN=8563495078:AAEFNjsJuIgJntrxjV6Aos0NIt4rbR1uKhw
ADMIN_TELEGRAM_ID=1327903698
```

Сохрани: `Ctrl+O`, `Enter`, `Ctrl+X`

### 4.4 Настрой Bot Backend

```bash
cd ../bot-backend
cp .env.example .env
nano .env
```

Заполни:

```env
BOT_TOKEN=8563495078:AAEFNjsJuIgJntrxjV6Aos0NIt4rbR1uKhw
SUPABASE_URL=https://vnpwsfzyzrpojzehvmae.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZucHdzZnp5enJwb2p6ZWh2bWFlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MDIzMTMsImV4cCI6MjA3Njk3ODMxM30.jyvB4SlNPimetrWCqYg6x5lO09dTIT9TOtTSKMX6VgA
API_URL=http://localhost:3000
NODE_ENV=production
WEBHOOK_DOMAIN=https://api.odindindindun.ru
WEBHOOK_PATH=/webhook
ADMIN_TELEGRAM_ID=1327903698
```

Сохрани: `Ctrl+O`, `Enter`, `Ctrl+X`

```bash
cd ..
```

---

## Шаг 5: Собери проект (5 минут)

### 5.1 Сделай скрипт исполняемым

```bash
chmod +x deploy.sh
```

### 5.2 Запусти сборку

```bash
./deploy.sh
```

Подожди пока все соберется. Должно появиться:

```
✓ Building Mini App...
✓ Building API Backend...
✓ Building Bot Backend...
✓ Deployment complete!
```

---

## Шаг 6: Настрой Nginx (10 минут)

### 6.1 Создай конфигурацию

```bash
nano /etc/nginx/sites-available/stars-grabber
```

Вставь (замени `твой_домен.com` на свой домен):

```nginx
server {
    listen 80;
    server_name твой_домен.com;

    # Mini App static files
    root /var/www/stars-grabber/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # API Backend proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Bot webhook
    location /webhook {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Mini App routes (SPA)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

Сохрани: `Ctrl+O`, `Enter`, `Ctrl+X`

### 6.2 Активируй конфигурацию

```bash
ln -s /etc/nginx/sites-available/stars-grabber /etc/nginx/sites-enabled/
```

### 6.3 Проверь конфигурацию

```bash
nginx -t
```

Должно быть:

```
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

### 6.4 Перезапусти Nginx

```bash
systemctl restart nginx
```

---

## Шаг 7: Настрой SSL (5 минут)

```bash
certbot --nginx -d твой_домен.com
```

Следуй инструкциям:

1. Введи email
2. Согласись с Terms of Service (Y)
3. Выбери опцию 2 (Redirect HTTP to HTTPS)

---

## Шаг 8: Запусти сервисы (5 минут)

### 8.1 Запусти PM2

```bash
cd /var/www/stars-grabber
pm2 start ecosystem.config.cjs
```

### 8.2 Проверь статус

```bash
pm2 status
```

Должно быть:

```
┌─────┬──────────────────────┬─────────┬─────────┐
│ id  │ name                 │ status  │ restart │
├─────┼──────────────────────┼─────────┼─────────┤
│ 0   │ stars-grabber-api    │ online  │ 0       │
│ 1   │ stars-grabber-bot    │ online  │ 0       │
└─────┴──────────────────────┴─────────┴─────────┘
```

### 8.3 Сохрани конфигурацию PM2

```bash
pm2 save
```

### 8.4 Настрой автозапуск

```bash
pm2 startup
```

Скопируй и выполни команду, которую он выдаст (начинается с `sudo env...`)

---

## Шаг 9: Настрой Telegram бота (5 минут)

### 9.1 Установи webhook

```bash
curl -X POST "https://api.telegram.org/bot<ТВОЙ_BOT_TOKEN>/setWebhook?url=https://твой_домен.com/webhook"
```

Замени:

- `<ТВОЙ_BOT_TOKEN>` на твой токен
- `твой_домен.com` на твой домен

Должен вернуть:

```json
{ "ok": true, "result": true, "description": "Webhook was set" }
```

### 9.2 Проверь webhook

```bash
curl "https://api.telegram.org/bot<ТВОЙ_BOT_TOKEN>/getWebhookInfo"
```

Должно показать твой URL в поле `url`.

### 9.3 Настрой команды бота

1. Открой Telegram
2. Найди [@BotFather](https://t.me/BotFather)
3. Отправь `/setcommands`
4. Выбери своего бота
5. Отправь:

```
start - Запустить бота
```

### 9.4 Создай Mini App

1. В [@BotFather](https://t.me/BotFather) отправь `/newapp`
2. Выбери своего бота
3. Заполни:
   - **Title**: `Stars Grabber`
   - **Description**: `Earn Telegram Stars`
   - **Photo**: загрузи иконку (512x512px)
   - **Demo GIF**: можешь пропустить (отправь `/empty`)
   - **Web App URL**: `https://твой_домен.com`
   - **Short name**: `starsgrabber` (или другое уникальное имя)

---

## Шаг 10: Проверка работы (5 минут)

### 10.1 Проверь API

```bash
curl https://твой_домен.com/api/health
```

Должен вернуть:

```json
{ "status": "ok", "timestamp": "2024-..." }
```

### 10.2 Проверь бота

1. Открой Telegram
2. Найди своего бота
3. Отправь `/start`
4. Бот должен ответить приветственным сообщением

### 10.3 Проверь Mini App

1. В чате с ботом нажми на кнопку меню (справа от поля ввода)
2. Выбери свое Mini App
3. Должно открыться приложение

---

## 🎉 Готово!

Твой проект развернут и работает!

## 📊 Полезные команды

### Просмотр логов

```bash
# Все логи
pm2 logs

# Только API
pm2 logs stars-grabber-api

# Только Bot
pm2 logs stars-grabber-bot

# Nginx логи
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Управление PM2

```bash
# Статус
pm2 status

# Перезапуск
pm2 restart all
pm2 restart stars-grabber-api
pm2 restart stars-grabber-bot

# Остановка
pm2 stop all

# Удаление
pm2 delete all
```

### Обновление кода

```bash
cd /var/www/stars-grabber
git pull
./deploy.sh
```

---

## 🐛 Решение проблем

### API не отвечает

```bash
# Проверь статус
pm2 status

# Посмотри логи
pm2 logs stars-grabber-api

# Перезапусти
pm2 restart stars-grabber-api
```

### Бот не отвечает

```bash
# Проверь webhook
curl "https://api.telegram.org/bot<TOKEN>/getWebhookInfo"

# Посмотри логи
pm2 logs stars-grabber-bot

# Перезапусти
pm2 restart stars-grabber-bot
```

### Nginx 502 Bad Gateway

```bash
# Проверь что бэкенды запущены
pm2 status

# Проверь логи Nginx
tail -f /var/log/nginx/error.log

# Перезапусти Nginx
systemctl restart nginx
```

### SSL не работает

```bash
# Проверь сертификат
certbot certificates

# Обнови сертификат
certbot renew

# Перезапусти Nginx
systemctl restart nginx
```

---

## 🔐 Безопасность

После развертывания обязательно:

- [ ] Смени все пароли и секреты
- [ ] Проверь что `.env` файлы не в git
- [ ] Настрой регулярные бэкапы базы данных
- [ ] Включи мониторинг логов
- [ ] Обновляй систему регулярно: `apt update && apt upgrade`

---

## 📞 Нужна помощь?

Если что-то не работает:

1. Проверь логи: `pm2 logs`
2. Проверь статус: `pm2 status`
3. Проверь Nginx: `systemctl status nginx`
4. Проверь переменные окружения в `.env` файлах
5. Убедись что все порты открыты в firewall
