import { initData } from "@tma.js/sdk-solid";
import type { AuthResponse } from "@/types/index.js";

const TOKEN_KEY = "stars_grabber_token";
const USER_KEY = "stars_grabber_user";

/**
 * Extract Telegram initData from TMA SDK
 */
export function getInitData(): string | null {
  try {
    const data = initData.state();
    if (!data) return null;

    // Serialize the initData object to a query string format
    // The backend expects the raw initData string
    const params = new URLSearchParams();

    if (data.user) {
      params.append("user", JSON.stringify(data.user));
    }
    if (data.hash) {
      params.append("hash", data.hash);
    }
    if (data.auth_date) {
      params.append("auth_date", data.auth_date.toString());
    }
    if (data.start_param) {
      params.append("start_param", data.start_param);
    }

    return params.toString() || null;
  } catch (error) {
    console.error("Failed to get initData:", error);
    return null;
  }
}

/**
 * Store JWT token in localStorage
 */
export function setToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    console.error("Failed to store token:", error);
  }
}

/**
 * Get JWT token from localStorage
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch (error) {
    console.error("Failed to get token:", error);
    return null;
  }
}

/**
 * Remove JWT token from localStorage
 */
export function removeToken(): void {
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch (error) {
    console.error("Failed to remove token:", error);
  }
}

/**
 * Store user data in localStorage
 */
export function setUser(user: AuthResponse["user"]): void {
  try {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch (error) {
    console.error("Failed to store user:", error);
  }
}

/**
 * Get user data from localStorage
 */
export function getUser(): AuthResponse["user"] | null {
  try {
    const userData = localStorage.getItem(USER_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error("Failed to get user:", error);
    return null;
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Check if user is admin (Telegram ID: 1327903698)
 */
export function isAdmin(): boolean {
  const user = getUser();
  return user?.telegramId === 1327903698;
}
