import { Request, Response } from "express";
/**
 * Create withdrawal request
 * POST /api/withdrawals
 * Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 7.7, 7.8, 7.9
 */
export declare function createWithdrawal(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Get user withdrawals
 * GET /api/withdrawals
 * Requirements: 8.1, 8.2, 8.3, 8.4, 8.5
 */
export declare function getWithdrawals(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=withdrawalController.d.ts.map