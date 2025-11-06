# Supabase Setup

## Instructions

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `schema.sql` into the SQL Editor
4. Execute the SQL to create all tables and indexes
5. Copy your project URL and anon key from Settings > API
6. Add these credentials to your `.env` files in api-backend and bot-backend

## Database Schema

The schema includes the following tables:

- `users` - User accounts and balances
- `tasks` - Available tasks (channel subscriptions and bot activations)
- `user_tasks` - Completed tasks tracking
- `transactions` - Transaction history (earnings and withdrawals)
- `withdrawals` - Withdrawal requests and their status
- `bot_activations` - Bot activation tracking
- `banners` - Advertisement banners

## Row Level Security (RLS)

For production, you should enable RLS policies. This is optional for development but recommended for security.
