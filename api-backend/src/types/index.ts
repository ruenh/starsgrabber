// User types
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

// Task types
export interface Task {
  id: number;
  type: "channel" | "bot";
  title: string;
  description?: string;
  reward: number;
  target: string;
  avatar_url?: string;
  status: "active" | "inactive";
  created_at: string;
  updated_at: string;
}

// Transaction types
export interface Transaction {
  id: number;
  user_id: number;
  type: "task" | "referral" | "withdrawal";
  amount: number;
  task_id?: number;
  referral_id?: number;
  withdrawal_id?: number;
  created_at: string;
}

// Withdrawal types
export interface Withdrawal {
  id: number;
  user_id: number;
  amount: number;
  status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  created_at: string;
  processed_at?: string;
}

// Banner types
export interface Banner {
  id: number;
  image_url: string;
  link: string;
  order_index: number;
  active: boolean;
  created_at: string;
}

// Bot activation types
export interface BotActivation {
  id: number;
  user_id: number;
  task_id: number;
  activated_at: string;
}

// User task types
export interface UserTask {
  id: number;
  user_id: number;
  task_id: number;
  completed_at: string;
}
