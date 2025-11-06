import { supabase } from "../config/supabase.js";
import { TelegramUser } from "../types/auth.js";
import { User, UserProfile } from "../types/user.js";
import { logger } from "../utils/logger.js";

/**
 * Finds a user by Telegram ID
 * @param telegramId - Telegram user ID
 * @returns User object or null if not found
 */
export async function findUserByTelegramId(
  telegramId: number
): Promise<User | null> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("telegram_id", telegramId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        // No rows returned
        return null;
      }
      throw error;
    }

    return data;
  } catch (error) {
    logger.error("Error finding user by Telegram ID", { telegramId, error });
    throw error;
  }
}

/**
 * Creates a new user
 * @param telegramUser - Telegram user data
 * @param referrerId - Optional referrer user ID
 * @returns Created user object
 */
export async function createUser(
  telegramUser: TelegramUser,
  referrerId?: number
): Promise<User> {
  try {
    const userData = {
      telegram_id: telegramUser.id,
      username: telegramUser.username,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
      avatar_url: telegramUser.photo_url,
      balance: 0,
      referrer_id: referrerId,
    };

    const { data, error } = await supabase
      .from("users")
      .insert(userData)
      .select()
      .single();

    if (error) {
      throw error;
    }

    logger.info("User created", {
      userId: data.id,
      telegramId: telegramUser.id,
      referrerId,
    });

    return data;
  } catch (error) {
    logger.error("Error creating user", { telegramUser, error });
    throw error;
  }
}

/**
 * Updates user information
 * @param userId - Database user ID
 * @param telegramUser - Updated Telegram user data
 * @returns Updated user object
 */
export async function updateUser(
  userId: number,
  telegramUser: TelegramUser
): Promise<User> {
  try {
    const updateData = {
      username: telegramUser.username,
      first_name: telegramUser.first_name,
      last_name: telegramUser.last_name,
      avatar_url: telegramUser.photo_url,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", userId)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    logger.error("Error updating user", { userId, error });
    throw error;
  }
}

/**
 * Gets user profile by user ID
 * @param userId - Database user ID
 * @returns User profile object
 */
export async function getUserProfile(userId: number): Promise<UserProfile> {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      throw error;
    }

    // Transform to camelCase for frontend
    return {
      id: data.id,
      telegramId: data.telegram_id,
      username: data.username,
      firstName: data.first_name,
      lastName: data.last_name,
      avatarUrl: data.avatar_url,
      balance: data.balance,
      referrerId: data.referrer_id,
      createdAt: data.created_at,
    };
  } catch (error) {
    logger.error("Error getting user profile", { userId, error });
    throw error;
  }
}

/**
 * Finds referrer by referral code (telegram_id)
 * @param referralCode - Referral code (referrer's telegram_id)
 * @returns Referrer user ID or null
 */
export async function findReferrerByCode(
  referralCode: string
): Promise<number | null> {
  try {
    const telegramId = parseInt(referralCode, 10);
    if (isNaN(telegramId)) {
      return null;
    }

    const user = await findUserByTelegramId(telegramId);
    return user ? user.id : null;
  } catch (error) {
    logger.error("Error finding referrer by code", { referralCode, error });
    return null;
  }
}
