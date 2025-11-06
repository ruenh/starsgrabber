export interface User {
  id: number;
  telegram_id: number;
  username?: string;
  first_name: string;
  last_name?: string;
  avatar_url?: string;
  balance: number;
  referrer_id?: number;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
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
