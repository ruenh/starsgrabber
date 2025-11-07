import { JWTPayload } from "../types/auth.js";
/**
 * Generates a JWT token for a user
 * @param userId - Database user ID
 * @param telegramId - Telegram user ID
 * @returns JWT token string
 */
export declare function generateToken(userId: number, telegramId: number): string;
/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export declare function verifyToken(token: string): JWTPayload;
//# sourceMappingURL=jwt.d.ts.map