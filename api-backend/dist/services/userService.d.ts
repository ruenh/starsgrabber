import { TelegramUser } from "../types/auth.js";
import { User, UserProfile } from "../types/user.js";
/**
 * Finds a user by Telegram ID
 * @param telegramId - Telegram user ID
 * @returns User object or null if not found
 */
export declare function findUserByTelegramId(telegramId: number): Promise<User | null>;
/**
 * Creates a new user
 * @param telegramUser - Telegram user data
 * @param referrerId - Optional referrer user ID
 * @returns Created user object
 */
export declare function createUser(telegramUser: TelegramUser, referrerId?: number): Promise<User>;
/**
 * Updates user information
 * @param userId - Database user ID
 * @param telegramUser - Updated Telegram user data
 * @returns Updated user object
 */
export declare function updateUser(userId: number, telegramUser: TelegramUser): Promise<User>;
/**
 * Gets user profile by user ID
 * @param userId - Database user ID
 * @returns User profile object
 */
export declare function getUserProfile(userId: number): Promise<UserProfile>;
/**
 * Finds referrer by referral code (telegram_id)
 * @param referralCode - Referral code (referrer's telegram_id)
 * @returns Referrer user ID or null
 */
export declare function findReferrerByCode(referralCode: string): Promise<number | null>;
//# sourceMappingURL=userService.d.ts.map