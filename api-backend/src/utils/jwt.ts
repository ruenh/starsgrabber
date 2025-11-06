import jwt from "jsonwebtoken";
import { JWTPayload } from "../types/auth.js";

const JWT_SECRET =
  process.env.JWT_SECRET || "default-secret-change-in-production";
const JWT_EXPIRATION = "7d"; // 7 days

/**
 * Generates a JWT token for a user
 * @param userId - Database user ID
 * @param telegramId - Telegram user ID
 * @returns JWT token string
 */
export function generateToken(userId: number, telegramId: number): string {
  const payload: JWTPayload = {
    userId,
    telegramId,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
}

/**
 * Verifies and decodes a JWT token
 * @param token - JWT token string
 * @returns Decoded JWT payload
 * @throws Error if token is invalid or expired
 */
export function verifyToken(token: string): JWTPayload {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return decoded;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new Error("Token expired");
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new Error("Invalid token");
    }
    throw error;
  }
}
