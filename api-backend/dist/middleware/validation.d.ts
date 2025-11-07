import { Request, Response, NextFunction } from "express";
/**
 * Sanitize string input to prevent XSS
 */
export declare function sanitizeString(input: string): string;
/**
 * Validate and sanitize task creation input
 */
export declare function validateTaskInput(req: Request, res: Response, next: NextFunction): void;
/**
 * Validate withdrawal amount
 */
export declare function validateWithdrawalInput(req: Request, res: Response, next: NextFunction): void;
/**
 * Validate banner input
 */
export declare function validateBannerInput(req: Request, res: Response, next: NextFunction): void;
/**
 * Validate task ID parameter
 */
export declare function validateTaskId(req: Request, res: Response, next: NextFunction): void;
/**
 * Validate withdrawal ID parameter
 */
export declare function validateWithdrawalId(req: Request, res: Response, next: NextFunction): void;
//# sourceMappingURL=validation.d.ts.map