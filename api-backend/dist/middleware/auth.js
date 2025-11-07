import { validateTelegramInitData, parseTelegramInitData, isInitDataExpired, } from "../utils/telegram.js";
import { verifyToken } from "../utils/jwt.js";
import logger from "../utils/logger.js";
/**
 * Middleware to validate Telegram initData
 * Used for initial authentication
 */
export const validateInitData = (req, res, next) => {
    try {
        const { initData } = req.body;
        if (!initData) {
            res.status(400).json({
                error: "BadRequest",
                message: "Missing initData",
                statusCode: 400,
            });
            return;
        }
        const botToken = process.env.BOT_TOKEN;
        if (!botToken) {
            logger.error("BOT_TOKEN not configured");
            res.status(500).json({
                error: "ServerError",
                message: "Server configuration error",
                statusCode: 500,
            });
            return;
        }
        // Validate signature
        const isValid = validateTelegramInitData(initData, botToken);
        if (!isValid) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Invalid Telegram initData signature",
                statusCode: 401,
            });
            return;
        }
        // Parse initData
        const parsedData = parseTelegramInitData(initData);
        // Check if expired
        if (isInitDataExpired(parsedData.auth_date)) {
            res.status(401).json({
                error: "Unauthorized",
                message: "InitData expired",
                statusCode: 401,
            });
            return;
        }
        // Check if user data exists
        if (!parsedData.user) {
            res.status(400).json({
                error: "BadRequest",
                message: "Missing user data in initData",
                statusCode: 400,
            });
            return;
        }
        // Attach parsed data to request
        req.body.telegramUser = parsedData.user;
        next();
    }
    catch (error) {
        logger.error("Error validating initData", { error });
        res.status(401).json({
            error: "Unauthorized",
            message: "Invalid initData format",
            statusCode: 401,
        });
    }
};
/**
 * Middleware to authenticate requests using JWT token
 * Used for protected API endpoints
 */
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Missing authorization header",
                statusCode: 401,
            });
            return;
        }
        const token = authHeader.replace("Bearer ", "");
        if (!token) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Missing token",
                statusCode: 401,
            });
            return;
        }
        // Verify token
        const decoded = verifyToken(token);
        // Attach user to request
        req.user = decoded;
        next();
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Invalid token";
        res.status(401).json({
            error: "Unauthorized",
            message,
            statusCode: 401,
        });
    }
};
/**
 * Middleware to check if user is admin
 * Must be used after authenticateToken
 */
export const requireAdmin = (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                error: "Unauthorized",
                message: "Authentication required",
                statusCode: 401,
            });
            return;
        }
        const adminTelegramId = parseInt(process.env.ADMIN_TELEGRAM_ID || "1327903698", 10);
        if (req.user.telegramId !== adminTelegramId) {
            res.status(403).json({
                error: "Forbidden",
                message: "Admin access required",
                statusCode: 403,
            });
            return;
        }
        next();
    }
    catch (error) {
        logger.error("Error checking admin status", { error });
        res.status(500).json({
            error: "ServerError",
            message: "Error verifying admin status",
            statusCode: 500,
        });
    }
};
//# sourceMappingURL=auth.js.map