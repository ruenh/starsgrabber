# Requirements Document

## Introduction

Stars Grabber - это Telegram Mini App для заработка Telegram Stars через выполнение заданий (подписки на каналы, активация ботов). Система включает реферальную программу, ручную модерацию выводов и административную панель для управления заданиями.

## Glossary

- **Mini App**: Telegram Mini Application - веб-приложение, работающее внутри Telegram
- **User**: Пользователь приложения Stars Grabber
- **Admin**: Администратор системы (Telegram ID: 1327903698)
- **Task**: Задание для выполнения (подписка на канал или активация бота)
- **Stars**: Telegram Stars - внутренняя валюта приложения
- **Referral**: Реферал - пользователь, пришедший по реферальной ссылке
- **Withdrawal Request**: Заявка на вывод звезд
- **Bot Backend**: Telegram бот для проверок подписок и уведомлений
- **API Backend**: REST API для взаимодействия Mini App с базой данных
- **Supabase**: База данных PostgreSQL с REST API
- **Channel Subscription**: Подписка на Telegram канал
- **Bot Activation**: Активация бота через команду /start со специальной ссылкой

## Requirements

### Requirement 1: User Authentication

**User Story:** Как пользователь, я хочу войти в приложение через Telegram, чтобы начать зарабатывать звезды

#### Acceptance Criteria

1. WHEN User opens Mini App, THE Mini App SHALL retrieve Telegram initData containing user information
2. WHEN Mini App receives valid initData, THE Mini App SHALL send authentication request to API Backend
3. IF User does not exist in database, THEN THE API Backend SHALL create new User record with zero Stars balance
4. WHEN User authentication succeeds, THE Mini App SHALL display main interface with user data
5. WHEN User has referrer parameter in start URL, THE API Backend SHALL link User to referrer account

### Requirement 2: Task Display and Management

**User Story:** Как пользователь, я хочу видеть доступные задания, чтобы выбрать что выполнить

#### Acceptance Criteria

1. WHEN User opens Home page, THE Mini App SHALL fetch active tasks from API Backend
2. THE Mini App SHALL display each Task with title, reward amount, and action button
3. WHEN Task is completed by User, THE Mini App SHALL mark Task as completed in UI
4. THE Mini App SHALL NOT display completed Tasks in available tasks list
5. WHEN User clicks task action button, THE Mini App SHALL open task details modal

### Requirement 3: Channel Subscription Task Execution

**User Story:** Как пользователь, я хочу выполнить задание по подписке на канал, чтобы получить звезды

#### Acceptance Criteria

1. WHEN User opens Task details modal for channel subscription, THE Mini App SHALL display channel avatar, name, and subscribe button
2. WHEN User clicks subscribe button, THE Mini App SHALL open Telegram channel in new context
3. WHEN User returns from Telegram, THE Mini App SHALL change button text to "Проверить"
4. WHEN User clicks verify button, THE Mini App SHALL send verification request to Bot Backend via API Backend
5. IF Bot Backend confirms subscription, THEN THE API Backend SHALL add Stars reward to User balance and mark Task as completed
6. IF Bot Backend confirms subscription, THEN THE Mini App SHALL display Lottie animation of stars reward
7. IF Bot Backend denies subscription, THEN THE Mini App SHALL display red border on button and error message "Попробуйте снова"
8. WHEN verification fails, THE Mini App SHALL reopen Telegram channel before next verification attempt

### Requirement 4: Bot Activation Task Execution

**User Story:** Как пользователь, я хочу выполнить задание по активации бота, чтобы получить звезды

#### Acceptance Criteria

1. WHEN User opens Task details modal for bot activation, THE Mini App SHALL display bot avatar, name, and activate button
2. WHEN User clicks activate button, THE Mini App SHALL open bot with special tracking link containing User ID
3. WHEN User activates bot with tracking link, THE Bot Backend SHALL record activation in database
4. WHEN User returns and clicks verify button, THE API Backend SHALL check activation record in database
5. IF activation record exists, THEN THE API Backend SHALL add Stars reward to User balance and mark Task as completed
6. IF activation record exists, THEN THE Mini App SHALL display Lottie animation of stars reward

### Requirement 5: Referral System

**User Story:** Как пользователь, я хочу приглашать друзей и получать процент от их заработка

#### Acceptance Criteria

1. WHEN User opens Referrals page, THE Mini App SHALL display unique referral link
2. WHEN User opens Referrals page, THE Mini App SHALL display total referrals count and total earnings from referrals
3. WHEN Referral completes Task, THE API Backend SHALL calculate 5 percent of Task reward
4. WHEN Referral completes Task, THE API Backend SHALL add 5 percent reward to referrer User balance
5. THE API Backend SHALL record referral earning as separate transaction in User history

### Requirement 6: User Profile and Balance

**User Story:** Как пользователь, я хочу видеть свой профиль с балансом и историей операций

#### Acceptance Criteria

1. WHEN User opens Profile page, THE Mini App SHALL display User avatar, username, and current Stars balance
2. WHEN User opens Profile page, THE Mini App SHALL display tabs for Balance and History sections
3. WHEN Balance tab is active, THE Mini App SHALL display Stars balance and withdrawal button
4. WHEN History tab is active, THE Mini App SHALL display list of all transactions with amounts and status icons
5. THE Mini App SHALL display completed tasks with green "+<n>" text
6. THE Mini App SHALL display referral earnings with green "+<n>" text
7. THE Mini App SHALL display withdrawals with red "-<n>" text and status emoji

### Requirement 7: Withdrawal Request Creation

**User Story:** Как пользователь, я хочу вывести заработанные звезды на свой Telegram аккаунт

#### Acceptance Criteria

1. WHEN User clicks withdrawal button, THE Mini App SHALL open withdrawal modal with input field
2. THE Mini App SHALL validate withdrawal amount is minimum 100 Stars
3. THE Mini App SHALL validate User balance is sufficient for withdrawal amount
4. WHEN User submits withdrawal request, THE API Backend SHALL check if User has Telegram username
5. IF User does not have username, THEN THE Mini App SHALL display error message requiring username creation
6. WHEN User has username, THE API Backend SHALL verify all completed channel subscriptions are still active
7. IF any channel subscription is inactive, THEN THE API Backend SHALL deduct Stars for that Task and reject withdrawal request
8. IF all subscriptions are active, THEN THE API Backend SHALL create Withdrawal Request with pending status
9. WHEN Withdrawal Request is created, THE Bot Backend SHALL send notification to Admin with request details

### Requirement 8: Withdrawal Request Status Tracking

**User Story:** Как пользователь, я хочу видеть статус моей заявки на вывод

#### Acceptance Criteria

1. WHEN User views History, THE Mini App SHALL display withdrawal transactions with status emoji
2. THE Mini App SHALL display loading emoji for pending Withdrawal Requests
3. THE Mini App SHALL display checkmark emoji for approved Withdrawal Requests
4. THE Mini App SHALL display cross emoji for rejected Withdrawal Requests
5. WHEN User clicks info icon next to withdrawal, THE Mini App SHALL display status description modal

### Requirement 9: Admin Panel Access Control

**User Story:** Как администратор, я хочу иметь доступ к админ панели для управления системой

#### Acceptance Criteria

1. WHEN User with Telegram ID 1327903698 opens Mini App, THE Mini App SHALL display admin button in top right corner
2. THE API Backend SHALL verify User Telegram ID matches 1327903698 before granting admin access
3. IF User Telegram ID does not match, THEN THE API Backend SHALL deny admin panel access
4. WHEN Admin clicks admin button, THE Mini App SHALL open admin panel interface

### Requirement 10: Admin Task Management

**User Story:** Как администратор, я хочу создавать, редактировать и закрывать задания

#### Acceptance Criteria

1. WHEN Admin opens task management section, THE Mini App SHALL display list of all Tasks with status
2. WHEN Admin clicks create task button, THE Mini App SHALL display task creation form
3. THE Mini App SHALL allow Admin to specify task type, title, reward amount, channel username or bot link
4. WHEN Admin submits new Task, THE API Backend SHALL create Task record and set status to active
5. WHEN Admin edits Task, THE API Backend SHALL update Task record with new values
6. WHEN Admin closes Task, THE API Backend SHALL set Task status to inactive
7. WHEN new Task is created, THE Bot Backend SHALL send notification to all Users

### Requirement 11: Admin Withdrawal Management

**User Story:** Как администратор, я хочу просматривать и обрабатывать заявки на вывод

#### Acceptance Criteria

1. WHEN Admin opens withdrawal management section, THE Mini App SHALL display all pending Withdrawal Requests
2. THE Mini App SHALL display User username, amount, and request date for each Withdrawal Request
3. WHEN Admin approves Withdrawal Request, THE API Backend SHALL update status to approved and deduct Stars from User balance
4. WHEN Admin approves Withdrawal Request, THE Bot Backend SHALL send notification to User
5. WHEN Admin rejects Withdrawal Request, THE API Backend SHALL update status to rejected with reason
6. WHEN Admin rejects Withdrawal Request, THE Bot Backend SHALL send notification to User with rejection reason

### Requirement 12: Admin Statistics and Monitoring

**User Story:** Как администратор, я хочу видеть статистику системы и структуру рефералов

#### Acceptance Criteria

1. WHEN Admin opens statistics section, THE Mini App SHALL display total Users count
2. THE Mini App SHALL display total Tasks completed count
3. THE Mini App SHALL display total Stars distributed amount
4. THE Mini App SHALL display total pending withdrawals amount
5. WHEN Admin opens referral structure view, THE Mini App SHALL display tree visualization of referral relationships
6. THE Mini App SHALL display each User with referral count and total earnings

### Requirement 13: Bot Subscription Verification

**User Story:** Как система, я хочу проверять подписки пользователей на каналы через бота

#### Acceptance Criteria

1. WHEN API Backend receives subscription verification request, THE Bot Backend SHALL call Telegram API getChatMember method
2. THE Bot Backend SHALL check if User status is member or administrator in channel
3. IF User is subscribed, THEN THE Bot Backend SHALL return success response to API Backend
4. IF User is not subscribed, THEN THE Bot Backend SHALL return failure response to API Backend
5. THE Bot Backend SHALL have administrator permissions in all channels used for Tasks

### Requirement 14: Notification System

**User Story:** Как пользователь, я хочу получать уведомления о важных событиях

#### Acceptance Criteria

1. WHEN new Task is created, THE Bot Backend SHALL send notification message to all Users
2. WHEN Referral completes Task, THE Bot Backend SHALL send notification to referrer User
3. WHEN Withdrawal Request is approved, THE Bot Backend SHALL send notification to User
4. WHEN Withdrawal Request is rejected, THE Bot Backend SHALL send notification to User with reason
5. WHEN Withdrawal Request is created, THE Bot Backend SHALL send notification to Admin

### Requirement 15: UI Design and Animations

**User Story:** Как пользователь, я хочу использовать приятное минималистичное приложение

#### Acceptance Criteria

1. THE Mini App SHALL use dark theme with black background color #000000
2. THE Mini App SHALL use dark gray color #1a1a1a for card backgrounds
3. THE Mini App SHALL use white color #ffffff for primary text
4. THE Mini App SHALL use gray color #6b7280 for secondary text
5. THE Mini App SHALL use green color for positive values and red color for negative values
6. THE Mini App SHALL display Lottie animations for task completion rewards
7. THE Mini App SHALL use smooth CSS transitions for all interactive elements
8. THE Mini App SHALL support custom webp emoji stickers

### Requirement 16: Navigation and Layout

**User Story:** Как пользователь, я хочу легко перемещаться между разделами приложения

#### Acceptance Criteria

1. THE Mini App SHALL display bottom navigation bar with three buttons
2. THE Mini App SHALL display Home icon on left navigation button
3. THE Mini App SHALL display Profile icon on center navigation button
4. THE Mini App SHALL display Referrals icon on right navigation button
5. WHEN User clicks navigation button, THE Mini App SHALL navigate to corresponding page
6. THE Mini App SHALL highlight active navigation button

### Requirement 17: Banner Advertisement System

**User Story:** Как администратор, я хочу размещать рекламные баннеры в приложении

#### Acceptance Criteria

1. WHEN User opens Home page, THE Mini App SHALL display horizontal scrollable banner carousel below header
2. THE Mini App SHALL fetch banner images and links from API Backend
3. WHEN User clicks banner, THE Mini App SHALL open banner link in Telegram browser
4. WHEN Admin creates banner, THE API Backend SHALL store banner image URL and target link
5. THE Mini App SHALL allow horizontal swipe navigation between banners
