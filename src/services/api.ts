import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
} from "axios";
import type {
  AuthResponse,
  User,
  Task,
  Transaction,
  Withdrawal,
  ReferralStats,
  Banner,
  ApiError,
} from "@/types/index.js";
import { getToken, removeToken } from "./auth.js";

// API base URL - update this based on environment
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3000/api";

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor - add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors and retry logic
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Handle 401 Unauthorized - clear auth and redirect
    if (error.response?.status === 401 && !originalRequest._retry) {
      removeToken();
      window.location.href = "/";
      return Promise.reject(error);
    }

    // Handle network errors with retry (max 2 retries)
    if (!error.response && !originalRequest._retry) {
      originalRequest._retry = true;

      // Wait 1 second before retry
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return apiClient(originalRequest);
    }

    // Format error message
    const apiError: ApiError = {
      error: error.response?.data?.error || "Unknown error",
      message:
        error.response?.data?.message || error.message || "An error occurred",
      statusCode: error.response?.status || 500,
    };

    return Promise.reject(apiError);
  }
);

// ============================================
// Authentication API
// ============================================

export const authApi = {
  /**
   * Login with Telegram initData
   */
  login: async (initData: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>("/auth/login", {
      initData,
    });
    return response.data;
  },
};

// ============================================
// User API
// ============================================

export const userApi = {
  /**
   * Get user profile
   */
  getProfile: async (): Promise<{ user: User; balance: number }> => {
    const response = await apiClient.get("/user/profile");
    return response.data;
  },

  /**
   * Get user transaction history
   */
  getHistory: async (): Promise<{ transactions: Transaction[] }> => {
    const response = await apiClient.get("/user/history");
    return response.data;
  },
};

// ============================================
// Tasks API
// ============================================

export const tasksApi = {
  /**
   * Get all active tasks with completion status
   */
  getTasks: async (): Promise<{ tasks: Task[] }> => {
    const response = await apiClient.get("/tasks");
    return response.data;
  },

  /**
   * Verify task completion
   */
  verifyTask: async (
    taskId: number
  ): Promise<{ success: boolean; reward: number }> => {
    const response = await apiClient.post(`/tasks/${taskId}/verify`);
    return response.data;
  },
};

// ============================================
// Withdrawals API
// ============================================

export const withdrawalsApi = {
  /**
   * Create withdrawal request
   */
  createWithdrawal: async (
    amount: number
  ): Promise<{ withdrawal: Withdrawal }> => {
    const response = await apiClient.post("/withdrawals", { amount });
    return response.data;
  },

  /**
   * Get user withdrawals
   */
  getWithdrawals: async (): Promise<{ withdrawals: Withdrawal[] }> => {
    const response = await apiClient.get("/withdrawals");
    return response.data;
  },
};

// ============================================
// Referrals API
// ============================================

export const referralsApi = {
  /**
   * Get referral stats
   */
  getReferrals: async (): Promise<ReferralStats> => {
    const response = await apiClient.get("/referrals");
    return response.data;
  },
};

// ============================================
// Banners API
// ============================================

export const bannersApi = {
  /**
   * Get all active banners
   */
  getBanners: async (): Promise<{ banners: Banner[] }> => {
    const response = await apiClient.get("/banners");
    return response.data;
  },
};

// ============================================
// Admin API
// ============================================

export const adminApi = {
  // Task Management
  createTask: async (data: {
    type: "channel" | "bot";
    title: string;
    description?: string;
    reward: number;
    target: string;
    avatarUrl?: string;
  }): Promise<{ task: Task }> => {
    const response = await apiClient.post("/admin/tasks", data);
    return response.data;
  },

  updateTask: async (
    taskId: number,
    data: Partial<Task>
  ): Promise<{ task: Task }> => {
    const response = await apiClient.put(`/admin/tasks/${taskId}`, data);
    return response.data;
  },

  closeTask: async (taskId: number): Promise<{ success: boolean }> => {
    const response = await apiClient.patch(`/admin/tasks/${taskId}/close`);
    return response.data;
  },

  deleteTask: async (taskId: number): Promise<{ success: boolean }> => {
    const response = await apiClient.delete(`/admin/tasks/${taskId}`);
    return response.data;
  },

  // Withdrawal Management
  getWithdrawals: async (): Promise<{ withdrawals: Withdrawal[] }> => {
    const response = await apiClient.get("/admin/withdrawals");
    return response.data;
  },

  approveWithdrawal: async (
    withdrawalId: number
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post(
      `/admin/withdrawals/${withdrawalId}/approve`
    );
    return response.data;
  },

  rejectWithdrawal: async (
    withdrawalId: number,
    reason: string
  ): Promise<{ success: boolean }> => {
    const response = await apiClient.post(
      `/admin/withdrawals/${withdrawalId}/reject`,
      { reason }
    );
    return response.data;
  },

  // Statistics
  getStats: async (): Promise<{
    totalUsers: number;
    totalTasks: number;
    totalStars: number;
    pendingWithdrawals: number;
  }> => {
    const response = await apiClient.get("/admin/stats");
    return response.data;
  },

  // Referral Tree
  getReferralTree: async (): Promise<{ tree: any[] }> => {
    const response = await apiClient.get("/admin/referral-tree");
    return response.data;
  },

  // Banner Management
  createBanner: async (data: {
    imageUrl: string;
    link: string;
    orderIndex?: number;
  }): Promise<{ banner: Banner }> => {
    const response = await apiClient.post("/admin/banners", data);
    return response.data;
  },
};

// ============================================
// Convenience exports
// ============================================

export const login = authApi.login;
export const getProfile = userApi.getProfile;
export const getHistory = userApi.getHistory;
export const getTasks = tasksApi.getTasks;
export const verifyTask = tasksApi.verifyTask;
export const createWithdrawal = withdrawalsApi.createWithdrawal;
export const getWithdrawals = withdrawalsApi.getWithdrawals;
export const getReferrals = referralsApi.getReferrals;
export const getBanners = async (): Promise<Banner[]> => {
  const response = await bannersApi.getBanners();
  return response.banners;
};

// Export the axios instance for custom requests
export default apiClient;
