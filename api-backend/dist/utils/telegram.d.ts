import { TelegramInitData } from "../types/auth.js";
/**
 * Validates Telegram initData signature
 * @param initData - The initData string from Telegram Mini App
 * @param botToken - The bot token
 * @returns boolean indicating if the signature is valid
 */
export declare function validateTelegramInitData(initData: string, botToken: string): boolean;
/**
 * Parses Telegram initData string into structured object
 * @param initData - The initData string from Telegram Mini App
 * @returns Parsed TelegramInitData object
 */
export declare function parseTelegramInitData(initData: string): TelegramInitData;
/**
 * Checks if initData is expired (older than 24 hours)
 * @param authDate - The auth_date from initData
 * @returns boolean indicating if the data is expired
 */
export declare function isInitDataExpired(authDate: number): boolean;
//# sourceMappingURL=telegram.d.ts.map