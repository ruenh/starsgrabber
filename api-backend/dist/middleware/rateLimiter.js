import rateLimit from "express-rate-limit";
/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        error: "TooManyRequests",
        message: "Too many requests, please try again later",
        statusCode: 429,
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 */
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: {
        error: "TooManyRequests",
        message: "Too many authentication attempts, please try again later",
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});
/**
 * Rate limiter for task verification
 * 10 requests per minute per IP
 */
export const verificationLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 verification requests per minute
    message: {
        error: "TooManyRequests",
        message: "Too many verification attempts, please slow down",
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Rate limiter for withdrawal requests
 * 3 requests per hour per IP
 */
export const withdrawalLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 withdrawal requests per hour
    message: {
        error: "TooManyRequests",
        message: "Too many withdrawal requests, please try again later",
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
/**
 * Rate limiter for admin operations
 * 50 requests per 15 minutes per IP
 */
export const adminLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // Limit each IP to 50 admin requests per windowMs
    message: {
        error: "TooManyRequests",
        message: "Too many admin requests, please try again later",
        statusCode: 429,
    },
    standardHeaders: true,
    legacyHeaders: false,
});
//# sourceMappingURL=rateLimiter.js.map