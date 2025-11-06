import { createSignal, createEffect } from "solid-js";
import type { User } from "@/types/index.js";
import {
  getUser,
  getToken,
  setUser as saveUser,
  setToken as saveToken,
  removeToken,
} from "@/services/auth.js";

// Create reactive signals for user state
const [user, setUser] = createSignal<User | null>(null);
const [token, setToken] = createSignal<string | null>(null);
const [isLoading, setIsLoading] = createSignal(true);
const [isAuthenticated, setIsAuthenticated] = createSignal(false);

// Initialize from localStorage
createEffect(() => {
  const storedUser = getUser();
  const storedToken = getToken();

  if (storedUser && storedToken) {
    setUser(storedUser);
    setToken(storedToken);
    setIsAuthenticated(true);
  }

  setIsLoading(false);
});

/**
 * Update user and token in state and localStorage
 */
export function updateAuth(userData: User, authToken: string) {
  setUser(userData);
  setToken(authToken);
  setIsAuthenticated(true);
  saveUser(userData);
  saveToken(authToken);
}

/**
 * Clear authentication state
 */
export function clearAuth() {
  setUser(null);
  setToken(null);
  setIsAuthenticated(false);
  removeToken();
}

/**
 * Update user data
 */
export function updateUser(userData: Partial<User>) {
  const currentUser = user();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData };
    setUser(updatedUser);
    saveUser(updatedUser);
  }
}

/**
 * Check if current user is admin
 */
export function isAdmin(): boolean {
  const currentUser = user();
  return currentUser?.telegramId === 1327903698;
}

// Export signals as getters
export const userStore = {
  get user() {
    return user();
  },
  get token() {
    return token();
  },
  get isLoading() {
    return isLoading();
  },
  get isAuthenticated() {
    return isAuthenticated();
  },
  get isAdmin() {
    return isAdmin();
  },
  updateAuth,
  clearAuth,
  updateUser,
};

// Export individual signals for reactive access
export { user, token, isLoading, isAuthenticated };
