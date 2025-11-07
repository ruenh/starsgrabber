import { Request, Response, NextFunction } from "express";
import { JWTPayload } from "../types/auth.js";
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
/**
 * Middleware to validate Telegram initData
 * Used for initial authentication
 */
export declare const validateInitData: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to authenticate requests using JWT token
 * Used for protected API endpoints
 */
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to check if user is admin
 * Must be used after authenticateToken
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map