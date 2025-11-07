import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "default-secret-change-in-production";
const JWT_EXPIRATION = "7d"; // 7 days
/**
 * Generates a JWT token for a user
 * @param userId - Database user ID
 * @param telegramId - Telegram user ID
 * @returns JWT token string
 */
export function generateToken(userId, telegramId) {
    const payload = {
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
export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error("Token expired");
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error("Invalid token");
        }
        throw error;
    }
}
//# sourceMappingURL=jwt.js.map