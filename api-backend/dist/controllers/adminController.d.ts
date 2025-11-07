import { Request, Response } from "express";
/**
 * Task Management Controllers
 * Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6, 10.7
 */
/**
 * Get all tasks (including inactive)
 * GET /api/admin/tasks
 */
export declare function getAllTasksAdmin(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Create a new task
 * POST /api/admin/tasks
 * Requirement 10.3: Allow Admin to specify task type, title, reward amount, channel username or bot link
 */
export declare function createTaskAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Update an existing task
 * PUT /api/admin/tasks/:id
 */
export declare function updateTaskAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Close a task (set status to inactive)
 * PATCH /api/admin/tasks/:id/close
 */
export declare function closeTaskAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Withdrawal Management Controllers
 * Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 11.6
 */
/**
 * Get all pending withdrawal requests
 * GET /api/admin/withdrawals
 * Requirement 11.2: Display User username, amount, and request date for each Withdrawal Request
 */
export declare function getPendingWithdrawalsAdmin(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Approve a withdrawal request
 * POST /api/admin/withdrawals/:id/approve
 * Requirements: 11.3, 11.4
 */
export declare function approveWithdrawalAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Reject a withdrawal request
 * POST /api/admin/withdrawals/:id/reject
 * Requirements: 11.5, 11.6
 */
export declare function rejectWithdrawalAdmin(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Statistics and Monitoring Controllers
 * Requirements: 12.1, 12.2, 12.3, 12.4, 12.5, 12.6
 */
/**
 * Get admin statistics
 * GET /api/admin/stats
 */
export declare function getStatsAdmin(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
/**
 * Get referral tree
 * GET /api/admin/referral-tree
 * Requirements: 12.5, 12.6
 */
export declare function getReferralTreeAdmin(_req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
//# sourceMappingURL=adminController.d.ts.map