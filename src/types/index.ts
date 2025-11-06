// User types
export interface User {
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
export interface Task {
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
export interface Transaction {
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
export interface Withdrawal {
  id: number;
  userId: number;
  amount: number;
  status: "pending" | "approved" | "rejected";
  rejectionReason?: string;
  createdAt: string;
  processedAt?: string;
}

// Banner types
export interface Banner {
  id: number;
  imageUrl: string;
  link: string;
  orderIndex: number;
}

// Referral stats
export interface ReferralStats {
  referrals: User[];
  totalEarnings: number;
  totalReferrals: number;
}

// API Error
export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Auth response
export interface AuthResponse {
  token: string;
  user: User;
}
