/**
 * General API rate limiter
 * 100 requests per 15 minutes per IP
 */
export declare const apiLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Strict rate limiter for authentication endpoints
 * 5 requests per 15 minutes per IP
 */
export declare const authLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter for task verification
 * 10 requests per minute per IP
 */
export declare const verificationLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter for withdrawal requests
 * 3 requests per hour per IP
 */
export declare const withdrawalLimiter: import("express-rate-limit").RateLimitRequestHandler;
/**
 * Rate limiter for admin operations
 * 50 requests per 15 minutes per IP
 */
export declare const adminLimiter: import("express-rate-limit").RateLimitRequestHandler;
//# sourceMappingURL=rateLimiter.d.ts.map