# Implementation Plan

- [x] 1. Setup project infrastructure and database

  - Initialize Supabase project and create database schema
  - Setup API backend project structure with Express and TypeScript
  - Setup Bot backend project structure with Grammy
  - Configure environment variables and deployment scripts
  - _Requirements: All requirements depend on infrastructure_

- [x] 2. Implement authentication system

  - [x] 2.1 Create Telegram initData validation middleware

    - Implement crypto signature verification for Telegram initData
    - Create JWT token generation and validation
    - _Requirements: 1.1, 1.2, 1.3_

  - [x] 2.2 Implement user registration and login flow

    - Create user registration endpoint with referral linking
    - Implement login endpoint returning JWT token
    - Add user profile fetch endpoint
    - _Requirements: 1.3, 1.4, 1.5_

- [x] 3. Build task management system

  - [x] 3.1 Create task database operations

    - Implement task CRUD operations in Supabase
    - Create user_tasks relationship tracking
    - Add task completion status queries
    - _Requirements: 2.1, 2.2, 2.3_

  - [x] 3.2 Implement task API endpoints

    - Create GET /api/tasks endpoint with user completion status
    - Implement POST /api/tasks/:id/verify endpoint
    - Add task completion transaction logic
    - _Requirements: 2.2, 2.3, 2.4_

  - [x] 3.3 Build channel subscription verification

    - Implement Bot Backend getChatMember API call
    - Create subscription verification endpoint
    - Add error handling for bot permissions
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 13.1, 13.2, 13.3, 13.4, 13.5_

  - [x] 3.4 Build bot activation tracking system

    - Create bot /start command handler with tracking parameter
    - Implement bot_activations table operations
    - Add activation verification endpoint
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

-

- [x] 4. Implement referral system

  - [x] 4.1 Create referral tracking logic

    - Implement referral link generation
    - Add referral relationship creation on registration
    - Create referral earnings calculation (5%)
    - _Requirements: 5.1, 5.3, 5.4_

  - [x] 4.2 Build referral API endpoints

    - Create GET /api/referrals endpoint
    - Implement referral stats aggregation
    - Add referral transaction recording
    - _Requirements: 5.2, 5.5_

- [x] 5. Build withdrawal system

  - [x] 5.1 Create withdrawal request logic

    - Implement withdrawal validation (minimum 100 stars, sufficient balance)
    - Add username existence check
    - Create subscription re-verification for completed tasks
    - Implement star deduction for inactive subscriptions
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9_

  - [x] 5.2 Build withdrawal API endpoints

    - Create POST /api/withdrawals endpoint
    - Implement GET /api/withdrawals endpoint with status
    - Add withdrawal status update logic
    - _Requirements: 7.8, 8.1, 8.2, 8.3, 8.4, 8.5_

- [x] 6. Implement admin panel backend

  - [x] 6.1 Create admin authentication middleware

    - Implement Telegram ID verification (1327903698)
    - Add admin-only endpoint protection
    - _Requirements: 9.1, 9.2, 9.3_

  - [x] 6.2 Build task management endpoints

    - Create POST /api/admin/tasks endpoint
    - Implement PUT /api/admin/tasks/:id endpoint
    - Add PATCH /api/admin/tasks/:id/close endpoint
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [x] 6.3 Build withdrawal management endpoints

    - Create GET /api/admin/withdrawals endpoint
    - Implement POST /api/admin/withdrawals/:id/approve endpoint
    - Add POST /api/admin/withdrawals/:id/reject endpoint
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 6.4 Implement statistics and monitoring endpoints

    - Create GET /api/admin/stats endpoint with aggregations
    - Implement GET /api/admin/referral-tree endpoint
    - Add referral tree visualization data structure
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6_

-

- [x] 7. Build notification system

  - [x] 7.1 Implement bot notification handlers

    - Create notification service for new tasks
    - Add referral completion notifications
    - Implement withdrawal status notifications
    - Add admin withdrawal request notifications
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5_

-

- [x] 8. Implement banner system

  - [x] 8.1 Create banner database operations

    - Implement banner CRUD in Supabase
    - Add banner ordering logic
    - _Requirements: 17.1, 17.2, 17.3_

  - [x] 8.2 Build banner API endpoints

    - Create GET /api/banners endpoint
    - Implement POST /api/admin/banners endpoint
    - _Requirements: 17.4_

- [x] 9. Build Mini App frontend core

  - [x] 9.1 Setup SolidJS project structure

    - Configure Vite with TMA SDK
    - Setup routing with @solidjs/router
    - Create base layout components
    - Implement TMA SDK initialization
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 9.2 Implement authentication flow

    - Create auth service with initData extraction
    - Implement JWT token storage
    - Add authentication state management
    - _Requirements: 1.1, 1.2, 1.4_

  - [x] 9.3 Build API client service

    - Create axios instance with auth interceptors
    - Implement error handling and retry logic
    - Add TypeScript types for all endpoints
    - _Requirements: All API interactions_

- [x] 10. Build Home page components

  - [x] 10.1 Create Header component

    - Implement "Stars Grabber" title
    - Add admin button for authorized users
    - _Requirements: 9.4, 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

  - [x] 10.2 Build BannerCarousel component

    - Implement horizontal scrollable carousel
    - Add banner image loading and caching
    - Create banner click handler with Telegram browser
    - _Requirements: 17.1, 17.2, 17.3, 17.5_

  - [x] 10.3 Create TaskList and TaskCard components

    - Implement task list fetching and display
    - Create task card with title, reward, and action button
    - Add completed task filtering
    - _Requirements: 2.1, 2.2, 2.3, 2.4_

  - [x] 10.4 Build TaskModal component

    - Create modal with task details display
    - Implement subscribe/activate button with Telegram link opening
    - Add verify button with state management
    - Create success animation with Lottie
    - Implement error state with red border and retry message
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 15.6, 15.7_

-

- [x] 11. Build Profile page components

  - [x] 11.1 Create ProfileHeader component

    - Implement user avatar display
    - Add username display
    - _Requirements: 6.1_

  - [x] 11.2 Build BalanceCard component

    - Display current stars balance
    - Create withdrawal button
    - _Requirements: 6.2, 6.3_

  - [x] 11.3 Create HistoryList component

    - Implement transaction history fetching
    - Display transactions with color-coded amounts
    - Add status icons for withdrawals
    - Create status info modal
    - _Requirements: 6.4, 6.5, 6.6, 6.7, 8.1, 8.2, 8.3, 8.4, 8.5_

  - [x] 11.4 Build WithdrawalModal component

    - Create amount input with validation (min 100)
    - Implement balance check
    - Add withdrawal request submission
    - Display username requirement error
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5_

- [x] 12. Build Referrals page components

  - [x] 12.1 Create ReferralLink component

    - Generate and display unique referral link
    - Add copy to clipboard functionality
    - _Requirements: 5.1_

  - [x] 12.2 Build ReferralStats component

    - Display total referrals count
    - Show total earnings from referrals
    - List referral users
    - _Requirements: 5.2_

- [x] 13. Build Admin panel components

  - [x] 13.1 Create AdminPanel layout

    - Implement admin panel modal/page
    - Add navigation between admin sections
    - _Requirements: 9.4_

  - [x] 13.2 Build TaskManager component

    - Create task list with edit/close actions
    - Implement task creation form
    - Add task editing form
    - Create task close confirmation
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7_

  - [x] 13.3 Build WithdrawalManager component

    - Display pending withdrawal requests
    - Create approve/reject action buttons
    - Implement rejection reason input
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6_

  - [x] 13.4 Create StatsPanel component

    - Display total users count
    - Show total tasks completed
    - Display total stars distributed
    - Show pending withdrawals amount
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

  - [x] 13.5 Build ReferralTree component

    - Implement tree visualization of referral structure
    - Display user referral counts and earnings
    - _Requirements: 12.5, 12.6_

- [x] 14. Build BottomNav component

  - Create navigation bar with three buttons
  - Implement Home, Profile, Referrals navigation
  - Add active state highlighting
  - Use minimalist icons
  - _Requirements: 16.1, 16.2, 16.3, 16.4, 16.5, 16.6_

- [x] 15. Implement UI styling and animations

  - [x] 15.1 Create global CSS with design system

    - Define color palette variables
    - Setup typography system
    - Add spacing and border radius variables
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 15.5_

  - [x] 15.2 Implement Lottie animations

        - Integrate lottie-web library
        - Create LottieAnimation wrapper component
        - Add stars reward animation
        - _Requirements: 15.6, 15.7_

    x

  - [x] 15.3 Add smooth transitions and interactions

    - Implement CSS transitions for all interactive elements
    - Add modal animations (slide up + fade)
    - Create button hover and active states
    - _Requirements: 15.7, 15.8_

-

- [x] 16. Setup deployment and monitoring

  - [x] 16.1 Configure VDS server

    - Install Node.js, Nginx, PM2
    - Setup Nginx reverse proxy configuration
    - Configure SSL certificates
    - _Requirements: All deployment requirements_

  - [x] 16.2 Create deployment scripts

    - Write build scripts for all components
    - Create PM2 ecosystem configuration
    - Add deployment automation scripts
    - _Requirements: All deployment requirements_

  - [x] 16.3 Setup monitoring and logging

    - Configure PM2 monitoring
    - Setup application logging with Winston
    - Add error tracking
    - _Requirements: All monitoring requirements_

- [x] 17. Integration testing and bug fixes

  - Test complete user flow from registration to withdrawal
  - Verify admin panel functionality
  - Test referral system end-to-end
  - Fix any discovered bugs and edge cases
  - _Requirements: All requirements_
